import { loadCSS } from '../../scripts/aem.js';
import {
  createIframe,
  createVideo,
  handleVideoMessage,
  isAEMVideoUrl,
  isLowResolutionVideoUrl,
  VideoEventManager,
  AEM_ASSETS,
} from '../../scripts/video-helper.js';
import { createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';

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
    await loadCSS(`${window.hlx.codeBasePath}/common/modal/modal-component.css`);
    modalBackground.style = '';
    window.addEventListener('keydown', keyDownAction);

    if (newContent && typeof newContent !== 'string') {
      // opening modal
      clearModalContent();
      modalContent.classList.add(...classes);
      modalContent.append(newContent);
      modalContent.appendChild(closeButton);
    } else if (newContent) {
      clearModalContent();
      let videoOrIframe = null;
      if (isLowResolutionVideoUrl(newContent)) {
        // Leverage the <video> HTML tag to improve video display
        // This implementation addresses video height inconsistencies in Safari when using an iframe
        videoOrIframe = createElement('video', {
          classes: 'modal-video',
          props: {
            src: newContent,
            controls: '',
            autoplay: 'autoplay',
            playsinline: '',
          },
        });
        modalContent.append(videoOrIframe);
      } else if (isAEMVideoUrl) {
        let videoId;
        const match = newContent.match(videoIdRegex);
        if (match) {
          [videoId] = match;
        }

        // eslint-disable-next-line no-unused-vars
        const modalVideoComponent = new VideoComponent(videoId);
        videoOrIframe = createVideo(
          null,
          newContent,
          'modal-video',
          {
            autoplay: 'any',
            disablePictureInPicture: true,
            loop: false,
            muted: false,
            playsinline: true,
            title: 'video',
            language: document.documentElement.lang,
          },
          false,
          videoId,
        );
        modalContent.append(videoOrIframe);
      } else {
        // otherwise load it as iframe
        videoOrIframe = createIframe(newContent, { parentEl: modalContent, classes: 'modal-video' });
      }

      if (beforeBanner) {
        const bannerWrapper = createElement('div', { classes: 'modal-before-banner' });
        bannerWrapper.addEventListener('click', (event) => event.stopPropagation());
        bannerWrapper.appendChild(beforeBanner);

        videoOrIframe.parentElement.insertBefore(bannerWrapper, videoOrIframe);
      }

      if (beforeIframe) {
        const wrapper = createElement('div', { classes: 'modal-before-iframe' });
        wrapper.appendChild(beforeIframe);
        videoOrIframe.parentElement.insertBefore(wrapper, videoOrIframe);
      }

      videoOrIframe.parentElement.insertBefore(closeButton, videoOrIframe);
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
