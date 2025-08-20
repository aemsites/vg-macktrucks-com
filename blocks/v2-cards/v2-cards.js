import { variantsClassesToBEM } from '../../scripts/common.js';
import { createVideo, isVideoLink } from '../../scripts/video-helper.js';

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

const decoratePicture = (picture) => {
  const imageEl = picture.querySelector('img');
  picture.classList.add(`${blockName}__picture`);
  picture.parentElement.classList.add(`${blockName}__media-wrapper`);
  picture.parentElement.classList.remove(`${blockName}__text-wrapper`);
  imageEl.classList.add(`${blockName}__image`);
};

const processVideoLink = (card, link) => {
  const videoWrapper = createVideo(link.href, `${blockName}__video-wrapper`, {
    autoplay: true,
    muted: true,
    playsinline: true,
    controls: false,
    loop: true,
  });
  const videoEl = videoWrapper.querySelector('video');
  card.classList.add(`${blockName}__media-wrapper`);
  card.classList.remove(`${blockName}__text-wrapper`);
  videoEl.classList.add(`${blockName}__video`);
  videoEl.classList.remove(`${blockName}__video-wrapper`);
  link.parentElement.replaceWith(videoWrapper);
};

const decorateMedia = (block) => {
  const cards = [...block.querySelectorAll(':scope > div > div:first-of-type')];
  if (!cards.length) {
    console.warn('No %ccards% c found', 'font-weight: bold; color: red;', 'font-weight: normal; color: inherit;');
    return;
  }
  cards.forEach((card) => {
    const pictureEl = card.querySelector(':scope > picture');
    const links = [...card.querySelectorAll(':scope a')];
    if (pictureEl) {
      decoratePicture(pictureEl);
    }
    if (links.length) {
      links.forEach((link) => {
        if (!isVideoLink(link)) {
          console.warn('Link %c%s%c is not a video link', 'font-weight: bold; color: red;', link.href, 'font-weight: normal; color: inherit;');
          return;
        }
        processVideoLink(card, link);
      });
    }
    if (!pictureEl && !links.length) {
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
