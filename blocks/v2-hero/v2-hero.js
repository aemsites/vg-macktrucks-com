import { getImageURLs, createResponsivePicture, variantsClassesToBEM, decorateIcons, createElement } from '../../scripts/common.js';
import { isVideoLink, createVideo } from '../../scripts/video-helper.js';
import { initializeCountdown } from '../../common/countdown/countdown.js';

export const variantClasses = ['dark', 'light', 'half-height', 'magazine', 'countdown', 'with-engine-stats'];
const blockName = 'v2-hero';
let hasVideo;

const addLineBreaksToWords = (element) => {
  element.innerHTML = element.textContent
    .split(' ')
    .map((word) => `<span>${word}</span>`)
    .join(' ');
};

const getCountdownDate = (block) => {
  const section = block.closest('.section');
  const countdownDate = section.dataset.countdownDate;
  if (!countdownDate) {
    console.error('Countdown date is not defined in the section dataset.');
  }
  return countdownDate;
};

const getFirstBlockHeader = (block) => {
  const firstBlockHeader = block.querySelector(':scope h1, :scope h2, :scope h3');
  if (!firstBlockHeader) {
    console.warn('First block header is missing.');
  }
  return firstBlockHeader;
};

const setupCountdownSection = async (block, wrapper) => {
  try {
    const targetDate = getCountdownDate(block);
    const firstBlockHeader = getFirstBlockHeader(block);

    if (targetDate) {
      const countdown = await initializeCountdown(targetDate);
      const section = block.closest('.section');
      const iframe = section.querySelector('.iframe');

      if (countdown) {
        if (firstBlockHeader) {
          // append the countdown after the first block header
          firstBlockHeader.insertAdjacentElement('afterend', countdown);
        } else {
          wrapper.prepend(countdown);
        }
      }

      if (iframe) {
        const iframeContainer = createElement('div', { classes: `${blockName}__iframe-container` });
        iframeContainer.appendChild(iframe);
        wrapper.appendChild(iframeContainer);
      }
    }
  } catch (error) {
    console.error('Error initializing countdown feature:', error);
  }
};

const processVideoLink = (block, link) => {
  const linkText = link.innerText.trim().toLowerCase();

  if (linkText === 'background') {
    const video = createVideo(link.getAttribute('href'), `${blockName}__video`, {
      muted: true,
      autoplay: true,
      loop: true,
      playsinline: true,
    });

    block.prepend(video);
    link.parentElement.remove();
  }
};

const handleMultipleButtons = (content, buttons = []) => {
  const heading = content.querySelector(`.${blockName}__heading`);
  content.classList.add(`${blockName}__content--2-buttons`);
  const buttonsWrapper = createElement('div');
  heading.after(buttonsWrapper, buttons[0]);
  buttonsWrapper.append(...buttons);
};

export default function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const blockContainer = block.parentElement.parentElement;
  const isPdp = blockContainer.dataset.page === 'pdp';
  const isHalfHeight = block.classList.contains(`${blockName}--half-height`);
  const isMagazine = block.classList.contains(`${blockName}--magazine`);
  const isCountdown = block.classList.contains(`${blockName}--countdown`);
  const hasEngineStats = block.classList.contains(`${blockName}--with-engine-stats`);
  const hasBackgroundImage = block.closest('.section--with-background');

  if (hasEngineStats && hasBackgroundImage) {
    hasBackgroundImage.classList.add('reduced-height');
  }

  const images = [...block.querySelectorAll('p > picture')];
  const imageURLs = getImageURLs(images);
  const imageData = imageURLs.map((src) => ({ src, breakpoints: [] }));

  const links = block.querySelectorAll('a');

  if (links) {
    links.forEach((link) => {
      const isVideo = isVideoLink(link);
      if (isVideo) {
        hasVideo = true;
      }
      processVideoLink(block, link);
    });
  }

  if (imageData.length === 1) {
    imageData[0].breakpoints = [
      { media: '(min-width: 600px)', width: 600 },
      { media: '(min-width: 1200px)', width: 1200 },
      { media: '(min-width: 1440px)', width: 1440 },
      { media: '(min-width: 1920px)', width: 1920 },
      { width: 1600 },
    ];
  }

  if (imageData.length > 1) {
    imageData[0].breakpoints = [{ media: '(min-width: 600px)', width: 600 }, { width: 1600 }];

    imageData[1].breakpoints = [
      { media: '(min-width: 1200px)', width: 1200 },
      { media: '(min-width: 1440px)', width: 1440 },
      { media: '(min-width: 1920px)', width: 1920 },
    ];
  }

  const altText = [...block.querySelectorAll('p > picture img.alt')];
  const newPicture = createResponsivePicture(imageData, true, altText, `${blockName}__image`);
  images.forEach((image) => image.parentNode.remove());

  if (images.length !== 0) {
    block.prepend(newPicture);
  } else if (!hasVideo) {
    block.classList.add(`${blockName}--no-image`);
  }

  const contentWrapper = block.querySelector(':scope > div:last-of-type');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const content = block.querySelector(':scope > div > div');
  content.classList.add(`${blockName}__content`);

  const headings = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  headings.forEach((h) => h.classList.add(`${blockName}__heading`));

  if (!isPdp && !isMagazine && !isCountdown) {
    const firstHeading = headings[0];
    firstHeading?.classList.add('with-marker');
  }

  if (isMagazine) {
    const heading = content.querySelector(`.${blockName}__heading`);
    if (heading) {
      addLineBreaksToWords(heading);
    }
  }

  const button = content.querySelector('a');
  const allTexts = content.querySelectorAll('p');

  const buttons = content.querySelectorAll('p.button-container');
  if (buttons.length > 1) {
    handleMultipleButtons(content, buttons);
  }

  if (!button && allTexts.length > 0) {
    content.classList.add('with-text');
    allTexts.forEach((p) => p.classList.add(`${blockName}__text`));
  }

  const ctaButtons = content.querySelectorAll('.button-container > a');
  [...ctaButtons].forEach((b) => {
    b.classList.add(isPdp ? `${blockName}__cta` : 'button--large', 'button--red', 'button');
    if (!isHalfHeight) {
      b.classList.remove('button--primary');
    }
    b.parentElement.classList.add(`${blockName}__cta-wrapper`);
  });

  if (isCountdown) {
    setupCountdownSection(block, content);
  }

  block.parentElement.classList.add('full-width');
  decorateIcons(block);
}
