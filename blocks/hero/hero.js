import { getImageURLs, createResponsivePicture, createElement } from '../../scripts/common.js';

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

const createHeroResponsiveImage = (block) => {
  const pictures = [...block.querySelectorAll('p > picture')];
  if (pictures.length !== 1) {
    return null;
  }

  const imageURLs = getImageURLs(pictures);
  const imageData = [
    {
      src: imageURLs[0],
      breakpoints: [
        { media: '(min-width: 600px)', width: 600 },
        { media: '(min-width: 1200px)', width: 1200 },
        { media: '(min-width: 1440px)', width: 1440 },
        { media: '(min-width: 1920px)', width: 1920 },
        { width: 1600 },
      ],
    },
  ];

  const altText = [pictures[0].querySelector('img.alt')].filter(Boolean);
  const responsivePicture = createResponsivePicture(imageData, true, altText, 'hero__image');
  pictures[0].parentNode.remove();
  const wrapper = createElement('div', { classes: 'hero__image-wrapper' });
  wrapper.appendChild(responsivePicture);
  return wrapper;
};

export default function decorate(block) {
  const isAutoBlock = block.classList.contains('auto-block');
  if (isAutoBlock) {
    return;
  }

  const contentWrapper = block.querySelector(':scope > div > div');
  const parentContainer = contentWrapper.parentElement;

  const video = block.querySelector('a[href*=".mp4"]');
  const videoWrapper = video && video.closest('p');
  const videoLink = videoWrapper?.firstElementChild;
  const contentContainer = createElement('div', { classes: 'hero-content-container' });
  const mediaWrapper = createElement('div', { classes: 'hero-content-media' });

  const responsiveImage = createHeroResponsiveImage(block);
  if (responsiveImage) {
    mediaWrapper.appendChild(responsiveImage);
  }

  if (videoLink) {
    decorateVideo(videoLink);
    mediaWrapper.appendChild(videoWrapper);
  }

  parentContainer.prepend(mediaWrapper);
  contentContainer.appendChild(contentWrapper);
  parentContainer.appendChild(contentContainer);
  contentContainer.prepend(mediaWrapper);
  contentWrapper.className = 'hero-content-wrapper';
}
