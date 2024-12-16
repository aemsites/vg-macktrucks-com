import { createElement } from '../../scripts/common.js';

const decorateVideo = (link) => {
  const { parentElement } = link;
  const video = createElement('video', {
    classes: ['hero-video', 'hide'],
    props: {
      loop: 'loop',
    },
  });
  const source = createElement('source', { props: { src: link.href, type: 'video/mp4' } });
  video.appendChild(source);
  parentElement.appendChild(video);
  link.remove();
  setTimeout(() => {
    video.classList.remove('hide');
    video.muted = true;
    video.play();
  }, 3000);
};

export default function decorate(block) {
  const isAutoBlock = block.classList.contains('auto-block');
  if (isAutoBlock) {
    return;
  }
  const contentWrapper = block.querySelector(':scope > div > div');
  const parentContainer = contentWrapper.parentElement;
  // check if it has a video or an image
  const picture = block.querySelector('picture');
  const pictureWrapper = picture.closest('p');
  const video = block.querySelector('a[href*=".mp4"]');
  const videoWrapper = video && video.closest('p');
  const videoLink = videoWrapper?.firstElementChild;
  const contentContainer = createElement('div', { classes: 'hero-content-container' });
  const mediaWrapper = createElement('div', { classes: 'hero-content-media' });

  // transform link into a video tag
  if (videoLink) {
    decorateVideo(videoLink);
  }

  // move aside all media elements: image, video...
  parentContainer.prepend(mediaWrapper);
  mediaWrapper.appendChild(pictureWrapper);
  if (videoWrapper) {
    mediaWrapper.appendChild(videoWrapper);
  }

  contentContainer.appendChild(contentWrapper);
  parentContainer.appendChild(contentContainer);
  contentContainer.prepend(mediaWrapper);
  contentWrapper.className = 'hero-content-wrapper';
}
