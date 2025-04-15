import { isSocialAllowed, createElement, deepMerge, getTextLabel, decorateIcons } from './common.js';
import { loadScript } from './aem.js';

export const VIDEO_JS_SCRIPT = '/scripts/videojs/video.min.js';
export const VIDEO_JS_CSS = '/scripts/videojs/video-js.min.css';
/* global videojs */

// videoURLRegex: verify if a given string follows a specific pattern indicating it is a video URL
// videoIdRegex: extract the video ID from the URL
export const AEM_ASSETS = {
  aemCloudDomain: '.adobeaemcloud.com',
  videoURLRegex: /\/assets\/urn:aaid:aem:[\w-]+\/play/,
  videoIdRegex: /urn:aaid:aem:[0-9a-fA-F-]+/,
};

export const youtubeVideoRegex =
  /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/|e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)([\w-]{11})[?&#]?\S*$/;

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

async function waitForVideoJs() {
  return new Promise((resolve) => {
    const scriptTag = document.querySelector(`head > script[src="${VIDEO_JS_SCRIPT}"]`);
    const cssLink = document.querySelector(`head > link[href="${VIDEO_JS_CSS}"]`);
    const isJsLoaded = scriptTag && scriptTag.dataset.loaded;
    const isCSSLoaded = cssLink && cssLink.dataset.loaded;
    if (!isJsLoaded || !isCSSLoaded) {
      const successHandler = () => {
        document.removeEventListener('videojs-loaded', successHandler);
        resolve();
      };

      document.addEventListener('videojs-loaded', successHandler);
      return;
    }

    resolve();
  });
}

function setupAutopause(videoElement, player) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          player.play();
        } else {
          player.pause();
        }
      });
    },
    {
      threshold: [0.5],
    },
  );

  observer.observe(videoElement);
}

export async function setupPlayer(url, videoContainer, config, video) {
  let videoElement = video;
  if (!videoElement) {
    videoElement = document.createElement('video');
    videoElement.id = `video-${Math.random().toString(36).substr(2, 9)}`;
  }

  videoElement.classList.add('video-js');

  if (config.playsinline || config.autoplay) {
    videoElement.setAttribute('playsinline', '');
  }

  videoContainer.append(videoElement);

  const videojsConfig = {
    ...config,
    preload: config.poster && !config.autoplay ? 'none' : 'auto',
    bigPlayButton: config.controls ?? true,
    controls: config.controls ?? false,
  };

  if (config.autoplay) {
    videojsConfig.loop = true;
    videojsConfig.autoplay = true;
  }

  if (config.muted) {
    videojsConfig.muted = true;
  }

  await waitForVideoJs();

  if (!videojs) {
    throw new Error('Video.js is not loaded');
  }

  const player = videojs(videoElement, videojsConfig);
  player.src(url);

  player.ready(() => {
    if (config.autoplay) {
      setupAutopause(videoElement, player);
    }
  });

  return player;
}

export function getDeviceSpecificVideoUrl(videoUrl) {
  const { userAgent } = navigator;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari =
    /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent) && !/CriOs/i.test(userAgent) && !/Android/i.test(userAgent) && !/Edg/i.test(userAgent);

  const manifest = isIOS || isSafari ? 'manifest.m3u8' : 'manifest.mpd';
  return videoUrl.replace(/manifest\.mpd|manifest\.m3u8|play/, manifest);
}

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

export function isYoutubeVideoUrl(url) {
  return youtubeVideoRegex.test(url);
}

export function getYoutubeVideoId(url) {
  const match = url.match(youtubeVideoRegex);

  return match?.length >= 2 ? match[1] : '';
}

export function isVideoLink(link) {
  const linkString = link.getAttribute('href');
  return (
    (linkString.includes('youtube.com/embed/') ||
      linkString.includes('https://player.restream.io') ||
      videoURLRegex.test(linkString) ||
      isLowResolutionVideoUrl(linkString)) &&
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

function getVideoLinkContainer(link, usePosterAutoDetection) {
  if (!usePosterAutoDetection) {
    return link;
  }

  let poster = null;
  let level = 2;
  let parent = link;
  while (parent !== null && level >= 0) {
    poster = parent.querySelector('picture');
    if (poster) {
      break;
    }

    parent = parent.parentElement;
    level -= 1;
  }

  return poster ? parent : link;
}

function parseVideoLink(link, usePosterAutoDetection) {
  const isVideo = link ? isVideoLink(link) : false;
  if (!isVideo) {
    return null;
  }

  const container = getVideoLinkContainer(link, usePosterAutoDetection);
  const poster = container.querySelector('picture')?.cloneNode(true);

  return {
    url: link.href,
    poster,
  };
}

export function cleanupVideoLink(block, link, hasPoster) {
  const container = getVideoLinkContainer(link, hasPoster);
  // Remove empty ancestor nodes after removing video container containing link and poster image
  if (container) {
    let parent = container;
    while (parent?.parentElement?.children.length === 1 && parent?.parentElement !== block) {
      parent = parent.parentElement;
    }

    parent.remove();
  }
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

export function showVideoModal(linkUrl, modalClasses) {
  import('../common/modal/modal-component.js').then((modal) => {
    let beforeBanner;

    if (isLowResolutionVideoUrl(linkUrl)) {
      beforeBanner = createLowResolutionBanner();
    }

    modal.showModal(linkUrl, { beforeBanner, classes: modalClasses });
  });
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const variantClasses = ['black'];
    const modalClasses = [...event.target.closest('.section').classList].filter((el) => el.startsWith('modal-'));
    variantClasses.forEach((variant) => {
      const index = modalClasses.findIndex((el) => el === `modal-${variant}`);

      if (index >= 0) {
        modalClasses[index] = modalClasses[index].replace('modal-', 'modal--');
      }
    });

    showVideoModal(link.getAttribute('href'), modalClasses);
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

export function createIframe(url, { parentEl, classes = [], props = {} }) {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = createElement('iframe', {
    classes: Array.isArray(classes) ? classes : [classes],
    props: {
      frameborder: '0',
      allowfullscreen: 'allowfullscreen',
      src: url,
      ...props,
    },
  });

  if (parentEl) {
    parentEl.appendChild(iframe);
  }

  return iframe;
}

export function setPlaybackControls(container) {
  // Playback controls - play and pause button
  const playPauseButton = createElement('button', {
    props: { type: 'button', class: 'v2-video__playback-button' },
  });

  const playbackButton = createElement('button', {
    props: { type: 'button', class: 'v2-video__playback-button' },
  });
  const pauseIcon = createElement('span', { classes: ['icon', 'icon-pause-video'] });
  const playIcon = createElement('span', { classes: ['icon', 'icon-play-video'] });
  playbackButton.append(pauseIcon, playIcon);

  playPauseButton.append(...playbackButton.children);
  container.appendChild(playPauseButton);
  decorateIcons(container);

  const playIconElement = container.querySelector('.icon-play-video');
  const pauseIconElement = container.querySelector('.icon-pause-video');

  const pauseVideoLabel = getTextLabel('Pause video');
  const playVideoLabel = getTextLabel('Play video');

  playPauseButton.setAttribute('aria-label', pauseVideoLabel);

  const togglePlayPauseIcon = (isPaused) => {
    if (isPaused) {
      pauseIconElement.style.display = 'none';
      playIconElement.style.display = 'flex';
      playPauseButton.setAttribute('aria-label', playVideoLabel);
    } else {
      pauseIconElement.style.display = 'flex';
      playIconElement.style.display = 'none';
      playPauseButton.setAttribute('aria-label', pauseVideoLabel);
    }
  };

  const video = container.querySelector('video');
  const poster = container.querySelector('picture');
  togglePlayPauseIcon(video.paused);

  const togglePlayPause = (el) => {
    if (el.paused) {
      if (poster) {
        poster.remove();
        video.parentElement.style.display = '';
        video.style.display = '';
      }
      el.play();
    } else {
      el.pause();
    }
  };

  playPauseButton.addEventListener('click', (e) => {
    e.preventDefault();
    togglePlayPause(video);
  });
  video.addEventListener('playing', () => {
    togglePlayPauseIcon(video.paused);
  });
  video.addEventListener('pause', () => {
    togglePlayPauseIcon(video.paused);
  });
}

function createProgressivePlaybackVideo(src, className = '', props = {}) {
  const video = createElement('video', {
    classes: className,
  });

  if (props.muted || props.autoplay) {
    video.muted = true;
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      const value = props[propName];
      if (typeof value !== 'boolean') {
        video.setAttribute(propName, value);
      } else if (value) {
        video.setAttribute(propName, '');
      }
    });
  }

  const source = createElement('source', {
    props: {
      src,
      type: 'video/mp4',
    },
  });

  // If the video is not playing, we’ll try to play again
  if (props.autoplay) {
    video.addEventListener(
      'loadedmetadata',
      () => {
        setTimeout(() => {
          if (video.paused) {
            console.warn('Failed to autoplay video, fallback code executed');
            // TODO: This is just a way of prevent the code to break due to the NotAllowedError error on iOS and Safari
            // For this to work better needs further development and either way it will always be an hack can at any point can stop working
            try {
              video.play();
            } catch (error) {
              if (error.name === 'NotAllowedError') {
                console.error('Playback was prevented by the browser:', error);
              } else {
                console.error('An error occurred while trying to play the video:', error);
              }
            }
          }
        }, 500);
      },
      { once: true },
    );
  }

  // set playback controls after video container is attached to dom
  if (!props.controls) {
    setTimeout(() => {
      setPlaybackControls(video.parentElement);
    }, 0);
  }

  video.appendChild(source);

  return video;
}

export function getDynamicVideoHeight(video) {
  // Get the element's height(use requestAnimationFrame to get actual height instead of 0)
  requestAnimationFrame(() => {
    const height = video.offsetHeight - 60;
    const playbackControls = video.parentElement?.querySelector('.v2-video__playback-button');
    if (!playbackControls) {
      return;
    }

    playbackControls.style.top = `${height.toString()}px`;
  });

  // Get the element's height on resize
  const getVideoHeight = (entries) => {
    for (const entry of entries) {
      const height = entry.target.offsetHeight - 60;
      const playbackControls = video.parentElement?.querySelector('.v2-video__playback-button');
      if (!playbackControls) {
        return;
      }
      playbackControls.style.top = `${height.toString()}px`;
    }
  };

  const resizeObserver = new ResizeObserver(getVideoHeight);
  resizeObserver.observe(video);
}

/**
 * Creates a video element with a poster image.
 * @param {string} linkUrl - Video URL.
 * @param {HTMLPictureElement} poster - Poster image.
 * @param {string} className - The name of the CSS block for styling.
 * @param {Object} videoConfig - Properties for video player.
 * @return {HTMLElement} - The container element that holds the video and poster.
 */
export function createVideoWithPoster(linkUrl, poster, className, videoConfig = {}) {
  const defaultConfig = {
    muted: false,
    autoplay: false,
    loop: false,
    playsinline: true,
    controls: true,
  };

  const config = {
    ...defaultConfig,
    ...videoConfig,
  };

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-wrapper', className);
  videoContainer.append(poster);

  const loadAndSetupPlayer = async (videoUrl) => {
    const playerSetupPromise = setupPlayer(videoUrl, videoContainer, {
      fill: true,
      ...config,
    });

    const video = videoContainer.querySelector('.video-js');
    video.style.display = 'none';
    return playerSetupPromise;
  };

  if (isLowResolutionVideoUrl(linkUrl)) {
    const videoOrIframe = createProgressivePlaybackVideo(linkUrl, 'video-wrapper', config);
    if (poster) {
      const posterSrc = poster.querySelector('img')?.src;
      videoOrIframe.setAttribute('poster', posterSrc);
      poster.remove();
    }
    videoContainer.append(videoOrIframe);
  } else {
    const videoUrl = getDeviceSpecificVideoUrl(linkUrl);
    if (config.autoplay) {
      (async () => {
        const player = await loadAndSetupPlayer(videoUrl);
        const video = videoContainer.querySelector('.video-js');
        if (config.autoplay) {
          player.on('loadeddata', () => {
            if (poster) {
              video.style.display = '';
              if (video.parentElement.classList.contains('video-js')) {
                video.parentElement.style.display = '';
              }
              poster.style.display = 'none';
              if (!config.controls) {
                setPlaybackControls(videoContainer);
              }
            }
          });
        }
      })();
    } else {
      async function initializePlayerWithControls() {
        await loadAndSetupPlayer(videoUrl);
        setPlaybackControls(videoContainer);
      }

      initializePlayerWithControls();
    }
  }
  return videoContainer;
}

/**
 * Creates a video element or videojs player, depending on whether the video is local
 * or not. Configures the element with specified classes, properties, and source.
 *
 * @param {HTMLAnchorElement | string} link - The link that contains the video URL or the URL of the video.
 * @param {string} [className=''] - Optional. CSS class names to apply to the video container.
 * @param {Object} [videoParams={}] - Optional. Properties for the video player, including attributes like 'muted', 'autoplay', 'title'.
 * @param {Object} [configs={}] - Optional. Additional configurations such as 'usePosterAutoDetection' and 'checkVideoCookie'.
 * @param {boolean} [configs.usePosterAutoDetection=false] - Whether to automatically detect and use a poster image.
 * @param {boolean} [configs.checkVideoCookie=false] - Whether to check for video cookie settings.
 * @returns {HTMLElement | null} - The created video element or player with specified configs, or null if the video link is invalid.
 */
export const createVideo = (link, className = '', videoParams = {}, configs = {}) => {
  let src;
  let poster;

  const { usePosterAutoDetection, checkVideoCookie } = configs;
  if (link instanceof HTMLAnchorElement) {
    const config = parseVideoLink(link, usePosterAutoDetection);
    if (!config) {
      return null;
    }

    src = config.url;
    poster = config.poster;
  } else {
    src = link;
  }

  if (isLowResolutionVideoUrl(src)) {
    return createProgressivePlaybackVideo(src, className, videoParams);
  }

  if (poster) {
    return createVideoWithPoster(src, poster, className, videoParams);
  }

  const container = document.createElement('div');
  container.classList.add(className);

  const videoUrl = getDeviceSpecificVideoUrl(src);

  console.log('setup player');

  async function initializePlayerWithControls() {
    await setupPlayer(videoUrl, container, videoParams, null, checkVideoCookie);

    if (!videoParams.controls) {
      setPlaybackControls(container);
    }
  }

  initializePlayerWithControls();

  return container;
};

export function loadYouTubeIframeAPI() {
  return loadScript('https://www.youtube.com/iframe_api');
}

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
