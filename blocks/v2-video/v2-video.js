import { removeEmptyTags, variantsClassesToBEM } from '../../scripts/common.js';
import { createVideo, cleanupVideoLink } from '../../scripts/video-helper.js';

const extractAspectRatio = (block) => {
  const aspectRatioRegex = /aspect-ratio-(\d+)-(\d+)/;
  const aspectRatioClass = Array.from(block.classList).find((className) => aspectRatioRegex.test(className));

  const match = aspectRatioClass?.match(aspectRatioRegex);

  return match
    ? {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10),
      }
    : null;
};

const retrieveVideoConfig = (block, aspectRatio) => {
  const image = block.querySelector('img');
  const poster = image ? new URL(image.getAttribute('src'), window.location.href).href : undefined;

  return {
    ...(aspectRatio ? { aspectRatio: `${aspectRatio.width}:${aspectRatio.height}` } : {}),
    ...(poster ? { poster } : {}),
    autoplay: block.classList.contains('autoplay'),
    muted: block.classList.contains('autoplay') || block.classList.contains('muted'),
    loop: block.classList.contains('loop'),
    controls: block.classList.contains('controls'),
    disablePictureInPicture: block.classList.contains('disable-picture-in-picture'),
    language: document.documentElement.lang,
    playsinline: true,
  };
};

const variantClasses = ['expanding'];

export default async function decorate(block) {
  const blockName = 'v2-video';
  const videoLink = block.querySelector('a');

  variantsClassesToBEM(block.classList, variantClasses, blockName);

  if (!videoLink) {
    console.warn('Video for v2-video block is required and not provided. The block will not render!');
    block.innerHTML = '';
    return;
  }

  const aspectRatio = extractAspectRatio(block);
  if (aspectRatio) {
    block.style.setProperty('--video-aspect-ratio', `${aspectRatio.width}/${aspectRatio.height}`);
  }

  const config = retrieveVideoConfig(block, aspectRatio);
  const video = createVideo(
    videoLink,
    `${blockName}__video`,
    {
      ...config,
      fill: true,
    },
    {
      usePosterAutoDetection: true,
      addMuteToggle: config.controls === false, // Only add mute toggle when controls are enabled
    },
  );

  cleanupVideoLink(block, videoLink, true);
  removeEmptyTags(block, true);
  block.prepend(video);
}
