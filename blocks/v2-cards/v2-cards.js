import { variantsClassesToBEM } from '../../scripts/common.js';
import { createVideo } from '../../scripts/video-helper.js';

const blockName = 'v2-cards';
const variantClasses = [
  'no-background',
  'horizontal',
  'image-aspect-ratio-7-5',
  'large-heading',
  '4-cards-row',
  '2-cards-row',
  'spaced',
  'with-border',
];

const decorateMedia = (block) => {
  const firstCardItems = [...block.querySelectorAll(':scope > div > div:first-of-type')];
  firstCardItems.forEach((el) => {
    const pictureEl = el.querySelector(':scope > picture');
    const videoURL = el.querySelector(':scope > p > a.text-link-with-video');
    if (pictureEl) {
      const imageEl = pictureEl.querySelector('img');
      pictureEl.classList.add(`${blockName}__picture`);
      pictureEl.parentElement.classList.add(`${blockName}__media-wrapper`);
      pictureEl.parentElement.classList.remove(`${blockName}__text-wrapper`);
      imageEl.classList.add(`${blockName}__image`);
    }
    if (videoURL) {
      const { href } = videoURL;
      const videoContainer = createVideo(href, `${blockName}__video-container`, {
        autoplay: true,
        muted: true,
        playsinline: true,
        controls: false,
        loop: true,
      });
      const videoEl = videoContainer.querySelector('video');
      el.classList.add(`${blockName}__media-wrapper`);
      el.classList.remove(`${blockName}__text-wrapper`);
      videoEl.classList.add(`${blockName}__video`);
      videoEl.classList.remove(`${blockName}__video-container`);
      videoURL.parentElement.classList.add(`${blockName}__video-wrapper`);
      videoURL.replaceWith(videoContainer);
    }
    if (!pictureEl && !videoURL) {
      console.warn('No %cmedia element%c found', 'font-weight: bold; color: red;', 'font-weight: normal; color: inherit;');
      return;
    }
  });
};

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const cardsItems = [...block.querySelectorAll(':scope > div')];
  cardsItems.forEach((el) => el.classList.add(`${blockName}__card-item`));

  const cardsSections = [...block.querySelectorAll(':scope > div > div')];
  cardsSections.forEach((el) => {
    el.classList.add(`${blockName}__text-wrapper`);
  });

  decorateMedia(block);

  const cardsHeadings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  cardsHeadings.forEach((el) => {
    el.classList.add(`${blockName}__heading`);
    if (el.querySelector('a')) {
      block.classList.add(`${blockName}--heading-with-arrow`);
    }
  });

  const buttons = [...block.querySelectorAll('.button-container')];
  buttons.forEach((el) => {
    el.classList.add(`${blockName}__button-container`);
    [...el.querySelectorAll('a')].forEach((link) => {
      if (link.classList.contains('button--primary') || link.classList.contains('button--secondary') || link.classList.contains('button--red')) {
        link.classList.add('button--small');
      } else {
        link.classList.add('standalone-link', `${blockName}__button`);
      }
      if (block.classList.contains(`${blockName}--spaced`)) {
        link.classList.replace('button--small', 'button--large');
      }
    });
  });
}
