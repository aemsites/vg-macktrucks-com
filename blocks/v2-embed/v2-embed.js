import { addVideoConfig, createVideo, handleVideoMessage, VideoEventManager, AEM_ASSETS } from '../../scripts/video-helper.js';

const blockName = 'v2-embed';
const videoEventManager = new VideoEventManager();

class VideoComponent {
  constructor(videoId) {
    this.videoId = videoId;

    videoEventManager.register(this.videoId, blockName, (event) => handleVideoMessage(event, this.videoId, blockName));
  }

  unregister() {
    videoEventManager.unregister(this.videoId, blockName);
  }
}

const extractAspectRatio = (block) => {
  const aspectRatioRegex = /aspect-ratio-(\d+)-(\d+)/;
  const aspectRatioClass = Array.from(block.classList).find((className) => aspectRatioRegex.test(className));

  if (!aspectRatioClass) {
    return null;
  }

  const match = aspectRatioClass.match(aspectRatioRegex);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  }

  return null;
};

const retrieveVideoConfig = (block, aspectRatio) => ({
  ...(aspectRatio ? { aspectRatio: `${aspectRatio.width}:${aspectRatio.height}` } : {}),
  ...(block.querySelector('img')?.getAttribute('src')
    ? { poster: new URL(block.querySelector('img').getAttribute('src'), window.location.href).href }
    : {}),
  autoplay: block.classList.contains('autoplay') ? 'any' : false,
  muted: block.classList.contains('autoplay'),
  loop: block.classList.contains('loop'),
  controls: !block.classList.contains('disable-controls'),
  disablePictureInPicture: block.classList.contains('disable-picture-in-picture'),
  language: document.documentElement.lang,
});

const configureVideo = (block, videoId) => {
  const config = retrieveVideoConfig(block);
  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined) {
      addVideoConfig(videoId, { [key]: value });
    }
  });
};

export default function decorate(block) {
  const linkElement = block.querySelector('a');
  const link = linkElement?.getAttribute('href');
  const title = linkElement?.textContent;
  const match = link?.match(AEM_ASSETS.videoIdRegex);

  if (!link) {
    console.warn(`[${blockName}]: There is no video link`);
    return;
  }

  if (!match) {
    console.warn(`[${blockName}]: Video link is incorrect: ${link}`);
    return;
  }

  const [videoId] = match;
  block.videoId = videoId;

  const aspectRatio = extractAspectRatio(block);
  if (aspectRatio) {
    block.style.setProperty('--video-aspect-ratio', `${aspectRatio.width}/${aspectRatio.height}`);
  }

  const videoConfig = retrieveVideoConfig(block, aspectRatio);
  const videoProps = {
    ...videoConfig,
    title,
  };

  configureVideo(block, videoId);

  new VideoComponent(block.videoId);
  const videoElement = createVideo(block, link, `${blockName}__frame`, videoProps, false, videoId);

  block.innerHTML = '';
  block.append(videoElement);
}
