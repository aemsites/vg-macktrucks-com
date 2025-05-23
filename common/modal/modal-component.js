/* global YT */
import { loadCSS } from '../../scripts/aem.js';
import {
  createIframe,
  createVideo,
  handleVideoMessage,
  getYoutubeVideoId,
  loadYouTubeIframeAPI,
  isAEMVideoUrl,
  isLowResolutionVideoUrl,
  isYoutubeVideoUrl,
  VideoEventManager,
  AEM_ASSETS,
} from '../../scripts/video-helper.js';
import { createElement, decorateIcons, getTextLabel, isSocialAllowed } from '../../scripts/common.js';

const { videoIdRegex } = AEM_ASSETS;
const videoEventManager = new VideoEventManager();

class VideoComponent {
  constructor(videoId) {
    this.videoId = videoId;
    this.blockName = 'modal';

    videoEventManager.register(this.videoId, this.blockName, (event) => handleVideoMessage(event, this.videoId, this.blockName));
  }

  unregister() {
    videoEventManager.unregister(this.videoId, this.blockName);
  }
}

const HIDE_MODAL_CLASS = 'modal-hidden';

async function addVideo(block, videoId) {
  const cookieMsgContainer = block.querySelector('.modal-cookie-message');
  if (cookieMsgContainer) {
    cookieMsgContainer.remove();
  }

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?color=white&amp;rel=0&amp;playsinline=1&amp;enablejsapi=1&amp;autoplay=1`;

  const iframeYT = createIframe(iframeSrc, {
    parentEl: block,
    classes: 'modal-video',
    props: { id: 'modal-youtube-iframe', allow: 'autoplay', allowfullscreen: 'true' },
  });

  block.append(...iframeYT.childNodes);

  await loadYouTubeIframeAPI();

  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReadyInit() {
    if (!YT) {
      throw new Error('YouTube API not loaded');
    }
    new YT.Player('modal-youtube-iframe', {
      events: {
        onReady: onPlayerReady,
        onError: onPlayerError,
        onAutoplayBlocked: onPlayerAutoplayBlocked,
      },
    });
  };
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerError(event) {
  console.warn(event.data);
}

function onPlayerAutoplayBlocked(event) {
  console.warn(event.data);
}

const createModal = () => {
  const modalBackground = createElement('div', { classes: ['modal-background', HIDE_MODAL_CLASS] });

  modalBackground.addEventListener('click', () => {
    hideModal();
  });

  const keyDownAction = (event) => {
    if (event.key === 'Escape') {
      hideModal();
    }
  };

  const modalContent = createElement('div', { classes: 'modal-content' });
  modalBackground.appendChild(modalContent);
  // preventing initial animation when added to DOM
  modalBackground.style = 'height: 0; opacity: 0;';
  document.body.appendChild(modalBackground);

  // adding close modal button
  const closeModalLabel = getTextLabel('Close modal');
  const closeButton = createElement('button', { classes: 'modal-close-button', props: { 'aria-label': `${closeModalLabel}` } });
  const closeIcon = createElement('span', { classes: ['icon', 'icon-close'] });
  closeButton.append(closeIcon);
  modalBackground.appendChild(closeButton);

  closeButton.addEventListener('click', () => hideModal());

  decorateIcons(closeButton);

  const clearModalContent = () => {
    modalContent.innerHTML = '';
    modalContent.className = 'modal-content';
  };

  async function showModal(newContent, { beforeBanner, beforeIframe, classes = [] } = {}) {
    const shouldVideoSocialCheck = classes.includes('modal-video-social-cookie-check');

    await loadCSS(`${window.hlx.codeBasePath}/common/modal/modal-component.css`);
    modalBackground.style = '';
    modalBackground.classList.add(...classes);
    window.addEventListener('keydown', keyDownAction);

    if (newContent && typeof newContent !== 'string') {
      // opening modal
      clearModalContent();
      modalContent.classList.add(...classes);
      modalContent.append(newContent);
      modalContent.appendChild(closeButton);
    } else if (newContent) {
      clearModalContent();
      let videoWrapper = null;
      if (isLowResolutionVideoUrl(newContent)) {
        videoWrapper = createVideo(
          newContent,
          'modal-video',
          {
            autoplay: 'any',
            muted: true,
            playsinline: true,
            controls: false,
            loop: false,
            language: document.documentElement.lang,
          },
          {
            addMuteToggle: true,
            usePosterAutoDetection: false,
          },
        );
        modalContent.append(videoWrapper);
      } else if (isAEMVideoUrl(newContent)) {
        let videoId;
        const match = newContent.match(videoIdRegex);
        if (match) {
          [videoId] = match;
        }

        new VideoComponent(videoId);

        videoWrapper = createVideo(
          newContent,
          'modal-video',
          {
            autoplay: 'any',
            muted: true,
            playsinline: true,
            controls: false,
            loop: false,
            disablePictureInPicture: true,
            title: 'video',
            language: document.documentElement.lang,
          },
          {
            addMuteToggle: true,
            usePosterAutoDetection: false,
          },
        );
        modalContent.append(videoWrapper);
      } else if (isYoutubeVideoUrl(newContent) && shouldVideoSocialCheck) {
        const videoId = getYoutubeVideoId(newContent);

        if (!videoId) {
          console.warn('V2 Video block: There is no video link. Please check the provided URL.');
          return;
        }
        window.isSingleVideo = true;

        if (isSocialAllowed()) {
          addVideo(modalContent, videoId);
        } else {
          const cookieMsgContainer = createElement('div', {
            classes: 'modal-cookie-message',
          });
          cookieMsgContainer.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 100%) center / cover no-repeat';

          const cookieMessage = document.createRange().createContextualFragment(`
            <h3 class="modal-cookie-message__title">${getTextLabel('single video message title')}</h3>
            ${getTextLabel('single video message text')}
            <div class="modal-cookie-message__button-container">
              <button class="button primary button--large button--red">${getTextLabel('single video message button')}</button>
              <button class="button secondary button--large">${getTextLabel('single video message button deny')}</button>
            </div>
          `);

          cookieMsgContainer.append(cookieMessage);
          modalContent.append(cookieMsgContainer);

          modalContent.querySelector('.modal-cookie-message__button-container .primary')?.addEventListener('click', () => {
            if (window.OneTrust) {
              window.OneTrust.AllowAll();
            }

            addVideo(modalContent, videoId);
          });

          modalContent.querySelector('.modal-cookie-message__button-container .secondary')?.addEventListener('click', () => {
            hideModal();
          });
        }
      } else {
        // otherwise load it as iframe
        videoWrapper = createIframe(newContent, { parentEl: modalContent, classes: 'modal-video' });
      }

      if (beforeBanner) {
        const bannerWrapper = createElement('div', { classes: 'modal-before-banner' });
        bannerWrapper.addEventListener('click', (event) => event.stopPropagation());
        bannerWrapper.appendChild(beforeBanner);

        videoWrapper.parentElement.insertBefore(bannerWrapper, videoWrapper);
      }

      if (beforeIframe) {
        const wrapper = createElement('div', { classes: 'modal-before-iframe' });
        wrapper.appendChild(beforeIframe);
        videoWrapper.parentElement.insertBefore(wrapper, videoWrapper);
      }

      if (videoWrapper) {
        videoWrapper.parentElement.insertBefore(closeButton, videoWrapper);
      } else {
        modalContent.insertBefore(closeButton, modalContent.firstChild);
      }
    }

    modalBackground.classList.remove(HIDE_MODAL_CLASS);

    // disable page scrolling
    document.body.classList.add('disable-scroll');

    modalContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  function hideModal() {
    modalBackground.classList.add(HIDE_MODAL_CLASS);
    window.removeEventListener('keydown', keyDownAction);
    document.body.classList.remove('disable-scroll');

    // stop playing video if the modal contains one
    document.querySelector('.modal-content video')?.pause();
    document.querySelector('.modal-content iframe')?.setAttribute('src', '');

    const onHideTransitionCancel = (event) => {
      if (event.target === modalBackground) {
        modalBackground.removeEventListener('transitionend', onHideTransitionEnd);
      }
    };

    const onHideTransitionEnd = (event) => {
      if (event.target === modalBackground) {
        clearModalContent();

        if (onHideTransitionCancel) {
          modalBackground.removeEventListener('transitioncancel', onHideTransitionCancel);
        }
      }
    };

    modalBackground.addEventListener('transitionend', onHideTransitionEnd, { once: true });
    modalBackground.addEventListener('transitioncancel', onHideTransitionCancel, { once: true });
  }

  return {
    showModal,
    hideModal,
  };
};

const { showModal, hideModal } = createModal();

export { showModal, hideModal };
