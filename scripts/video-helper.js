import { isSocialAllowed, createElement, deepMerge, getTextLabel } from './common.js';

// videoURLRegex: verify if a given string follows a specific pattern indicating it is a video URL
// videoIdRegex: extract the video ID from the URL
export const AEM_ASSETS = {
  aemCloudDomain: '.adobeaemcloud.com',
  videoURLRegex: /\/assets\/urn:aaid:aem:[\w-]+\/play/,
  videoIdRegex: /urn:aaid:aem:[0-9a-fA-F-]+/,
};

const { aemCloudDomain, videoURLRegex } = AEM_ASSETS;

export const videoTypes = {
  aem: 'aem',
  youtube: 'youtube',
  local: 'local',
  both: 'both',
};

export const standardVideoConfig = {
  autoplay: false,
  muted: false,
  controls: true,
  disablePictureInPicture: false,
  currentTime: 0,
  playsinline: true,
};

export const videoConfigs = {};

export const addVideoConfig = (videoId, props = {}) => {
  if (!videoConfigs[videoId]) {
    videoConfigs[videoId] = deepMerge({}, standardVideoConfig);
  }
  deepMerge(videoConfigs[videoId], props);
};

export const getVideoConfig = (videoId) => videoConfigs[videoId];

export function isLowResolutionVideoUrl(url) {
  return url.split('?')[0].endsWith('.mp4');
}

export function isAEMVideoUrl(url) {
  return videoURLRegex.test(url);
}

export function isVideoLink(link) {
  const linkString = link.getAttribute('href');
  return (
    (linkString.includes('youtube.com/embed/') || videoURLRegex.test(linkString) || isLowResolutionVideoUrl(linkString)) &&
    link.closest('.block.embed') === null
  );
}

export function selectVideoLink(links, preferredType, videoType = videoTypes.both) {
  const linksArray = Array.isArray(links) ? links : [...links];
  const hasConsentForSocialVideos = isSocialAllowed();
  const isTypeBoth = videoType === videoTypes.both;
  const prefersYouTube = (hasConsentForSocialVideos && preferredType !== 'local') || (!isTypeBoth && videoType === videoTypes.youtube);

  const findLinkByCondition = (conditionFn) => linksArray.find((link) => conditionFn(link.getAttribute('href')));

  const aemVideoLink = findLinkByCondition((href) => videoURLRegex.test(href));
  const youTubeLink = findLinkByCondition((href) => href.includes('youtube.com/embed/'));
  const localMediaLink = findLinkByCondition((href) => href.split('?')[0].endsWith('.mp4'));

  if (aemVideoLink) {
    return aemVideoLink;
  }
  if (prefersYouTube && youTubeLink) {
    return youTubeLink;
  }
  return localMediaLink;
}

export function createLowResolutionBanner() {
  const lowResolutionMessage = getTextLabel('Low resolution video message');
  const changeCookieSettings = getTextLabel('Change cookie settings');

  const banner = createElement('div', { classes: 'low-resolution-banner' });
  banner.innerHTML = `${lowResolutionMessage} <button class="low-resolution-banner-cookie-settings">${changeCookieSettings}</button>`;
  banner.querySelector('button').addEventListener('click', () => {
    window.OneTrust.ToggleInfoDisplay();
  });

  return banner;
}

export function showVideoModal(linkUrl) {
  import('../common/modal/modal-component.js').then((modal) => {
    let beforeBanner = {};

    if (isLowResolutionVideoUrl(linkUrl)) {
      beforeBanner = createLowResolutionBanner();
    }

    modal.showModal(linkUrl, beforeBanner);
  });
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    showVideoModal(link.getAttribute('href'));
  });
}

export function isSoundcloudLink(link) {
  return link.getAttribute('href').includes('soundcloud.com/player') && link.closest('.block.embed') === null;
}

export function addSoundcloudShowHandler(link) {
  link.classList.add('text-link-with-soundcloud');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const thumbnail = link.closest('div')?.querySelector('picture');
    const title = link.closest('div')?.querySelector('h1, h2, h3');
    const text = link.closest('div')?.querySelector('p:not(.button-container, .image)');

    import('../common/modal/modal-component.js').then((modal) => {
      const episodeInfo = document.createElement('div');
      episodeInfo.classList.add('modal-soundcloud');
      episodeInfo.innerHTML = `<div class="episode-image"><picture></div>
      <div class="episode-text">
          <h2></h2>
          <p></p>
      </div>`;
      episodeInfo.querySelector('picture').innerHTML = thumbnail?.innerHTML || '';
      episodeInfo.querySelector('h2').innerText = title?.innerText || '';
      episodeInfo.querySelector('p').innerText = text?.innerText || '';

      modal.showModal(link.getAttribute('href'), null, episodeInfo);
    });
  });
}

export function addPlayIcon(parent) {
  const iconWrapper = createElement('div', { classes: 'video-icon-wrapper' });
  const icon = createElement('i', { classes: ['fa', 'fa-play', 'video-icon'] });
  iconWrapper.appendChild(icon);
  parent.appendChild(iconWrapper);
}

export function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary', 'text-link-with-video');

  addPlayIcon(videoLink);
}

export function createIframe(url, { parentEl, classes = [] }) {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = createElement('iframe', {
    classes: Array.isArray(classes) ? classes : [classes],
    props: {
      frameborder: '0',
      allowfullscreen: true,
      src: url,
    },
  });

  if (parentEl) {
    parentEl.appendChild(iframe);
  }

  return iframe;
}

/**
 * Set playback controls for video elements.
 * This function selects all button elements that are direct children of video elements,
 * and re-assigns them to their grandparent elements (the parent of their parent).
 */
export const setPlaybackControls = () => {
  const playbackControls = document.querySelectorAll('video > button');
  playbackControls.forEach((control) => {
    const { parentElement } = control.parentElement;
    parentElement.append(control);
  });
};

/**
 * Creates a video element with a source.
 *
 * @param {string} src - The source URL of the video.
 * @param {string} className - CSS class names to apply to the video element.
 * @param {Object} props - Properties and attributes for the video element.
 * @returns {HTMLElement} - The created video element with a source child.
 */
const createVideoElement = (src, className, props) => {
  const video = createElement('video', { classes: className });
  const source = createElement('source', { props: { src, type: 'video/mp4' } });
  video.appendChild(source);

  if (props.muted === true) {
    video.muted = props.muted;
  }

  if (props.autoplay === true) {
    video.autoplay = props.autoplay;
  } else {
    video.removeAttribute('autoplay');
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      video.setAttribute(propName, props[propName]);
    });
  }

  return video;
};

/**
 * Creates an iframe element with specified attributes.
 *
 * @param {string} src - The source URL of the iframe.
 * @param {string} className - CSS class names to apply to the iframe.
 * @param {Object} props - Properties and attributes for the iframe element.
 * @param {string} videoId - The video ID of the iframe.
 * @returns {HTMLElement} - The created iframe element.
 */
const createIframeElement = (src, className, props, videoId) => {
  addVideoConfig(videoId, props);

  return createElement('iframe', {
    classes: className,
    props: {
      ...props,
      allow: 'autoplay; fullscreen',
      allowfullscreen: true,
      src,
    },
  });
};

/**
 * Creates a play/pause button with icons.
 *
 * @returns {HTMLElement} - The created play/pause button.
 */
const createPlayPauseButton = () => {
  const button = createElement('button', {
    props: { type: 'button', class: 'v2-video__playback-button' },
  });
  const pauseIcon = createElement('span', { classes: ['icon', 'icon-pause-video'] });
  const playIcon = createElement('span', { classes: ['icon', 'icon-play-video'] });
  button.append(pauseIcon, playIcon);
  return button;
};

/**
 * Toggles the display of play and pause icons.
 *
 * @param {boolean} isPaused - Whether the video is paused.
 * @param {HTMLElement} playIcon - The play icon element.
 * @param {HTMLElement} pauseIcon - The pause icon element.
 * @param {HTMLElement} playPauseButton - The play/pause button element.
 */
const togglePlayPauseIcon = (isPaused, playIcon, pauseIcon, playPauseButton) => {
  playIcon.style.display = isPaused ? 'flex' : 'none';
  pauseIcon.style.display = isPaused ? 'none' : 'flex';
  playPauseButton.setAttribute('aria-label', getTextLabel(isPaused ? 'Play video' : 'Pause video'));
};

/**
 * Sets up event listeners for the video element and play/pause button.
 *
 * @param {HTMLElement} video - The video element.
 * @param {HTMLElement} playPauseButton - The play/pause button element.
 * @param {Object} props - Properties and attributes for the video element.
 */
const setVideoEvents = (video, playPauseButton, props) => {
  const playIcon = playPauseButton.querySelector('.icon-play-video');
  const pauseIcon = playPauseButton.querySelector('.icon-pause-video');

  if (props.autoplay === false) {
    togglePlayPauseIcon(true, playIcon, pauseIcon, playPauseButton);
  }

  playPauseButton.addEventListener('click', () => {
    video[video.paused ? 'play' : 'pause']();
  });

  video.addEventListener('playing', () => togglePlayPauseIcon(false, playIcon, pauseIcon, playPauseButton));
  video.addEventListener('pause', () => togglePlayPauseIcon(true, playIcon, pauseIcon, playPauseButton));

  // Fallback to make sure the video is automatically played
  if (props.autoplay === true) {
    video.addEventListener(
      'loadedmetadata',
      () => {
        setTimeout(() => {
          if (video.paused) {
            console.warn('Failed to autoplay video, fallback code executed');
            video.play();
          }
        }, 500);
      },
      { once: true },
    );
  } else {
    video.removeAttribute('autoplay');
  }
};

/**
 * Creates and configures a video element with play/pause controls.
 *
 * @param {string} src - The source URL of the video.
 * @param {string} className - CSS class names to apply to the video element.
 * @param {Object} props - Properties and attributes for the video element.
 * @param {HTMLElement} block - The block to which the video element will be appended.
 * @returns {HTMLElement} - The created and configured video element.
 */
const createAndConfigureVideo = (src, className, props, block) => {
  const video = createVideoElement(src, className, props);
  const playPauseButton = createPlayPauseButton();

  if (block) {
    block.prepend(video);
    block.insertBefore(playPauseButton, video.nextSibling);
  }

  setVideoEvents(video, playPauseButton, props);
  return video;
};

/**
 * Creates a video element or an iframe for a video, depending on whether the video is local
 * or not. Configures the element with specified classes, properties, and source.
 *
 * @param {HTMLElement} block - The block to which the video element or iframe will be appended.
 * @param {string} src - The source URL of the video.
 * @param {string} [className=''] - CSS class names to apply to the video element or iframe.
 * @param {Object} [props={}] - Properties and attributes for the video element or iframe,
 *                              including attributes like 'muted', 'autoplay', 'title'. All
 *                              properties are applied as attributes.
 * @param {boolean} [localVideo=true] - Indicates if the video is a local file. If true, creates
 *                                      a <video> element with a <source> child. If false,
 *                                      creates an iframe for an external video.
 * @param {string} [videoId=''] - Identifier for the video, used for external video sources.
 * @returns {HTMLElement} - The created video element (<video> or <iframe>) with specified configs.
 */
export const createVideo = (block, src, className = '', props = {}, localVideo = true, videoId = '') =>
  localVideo ? createAndConfigureVideo(src, className, props, block) : createIframeElement(src, className, props, videoId);

const logVideoEvent = (eventName, videoId, timeStamp, blockName = 'video') => {
  console.info(`[${blockName}] ${eventName} for ${videoId} at ${timeStamp}`);
};

const formatDebugTime = (date) => {
  const timeOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${formattedTime}.${milliseconds}`;
};

export const handleVideoMessage = (event, videoId, blockName = 'video') => {
  if (!event.origin.endsWith(aemCloudDomain)) {
    return;
  }
  if (event.data.type === 'embedded-video-player-event') {
    const timeStamp = formatDebugTime(new Date());

    logVideoEvent(event.data.name, event.data.videoId, timeStamp, blockName);

    if (event.data.name === 'video-config' && event.data.videoId === videoId) {
      console.info('Sending video config:', getVideoConfig(videoId), timeStamp);
      event.source.postMessage(JSON.stringify(getVideoConfig(videoId)), '*');
    }

    // TODO: handle events when needed in a block
    // switch (event.data.name) {
    //   case 'video-playing':
    //   case 'video-play':
    //   case 'video-ended':
    //   case 'video-loadedmetadata':
    //     logVideoEvent(event.data.name, event.data.videoId, timeStamp, blockName);
    //     break;
    //   default:
    //     break;
    // }
  }
};

class VideoEventManager {
  constructor() {
    this.registrations = [];
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  register(videoId, blockName, callback) {
    this.registrations.push({ videoId, blockName, callback });
  }

  unregister(videoId, blockName) {
    this.registrations = this.registrations.filter((reg) => reg.videoId !== videoId || reg.blockName !== blockName);
  }

  handleMessage(event) {
    this.registrations.forEach(({ videoId, blockName, callback }) => {
      if (event.data.type === 'embedded-video-player-event' && event.data.videoId === videoId) {
        callback(event, videoId, blockName);
      }
    });
  }
}

export { VideoEventManager };
