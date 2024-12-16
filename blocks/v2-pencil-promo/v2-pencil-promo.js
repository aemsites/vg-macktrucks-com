import { getImageURLs, createResponsivePicture, variantsClassesToBEM, createElement } from '../../scripts/common.js';

export default async function decorate(block) {
  const blockName = 'v2-pencil-promo';
  // variant pencil banner black is default
  const variantClasses = ['pencil-banner-black', 'pencil-banner-copper', 'promo-banner-gold', 'promo-banner-copper'];
  const indexVariant = variantClasses.findIndex((variant) => block.classList.contains(variant));
  const currentVariant = (indexVariant >= 0 && variantClasses[indexVariant]) || variantClasses[0];
  const isPencil = currentVariant.includes('pencil');
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  block.classList.add(`${blockName}__${isPencil ? 'pencil' : 'promo'}-banner`);
  if (isPencil) {
    block.parentElement.classList.add('full-width');
  } else {
    block.classList.add(`${blockName}__promo-banner--with-image`);
  }

  const bannerImage = block.querySelector('picture');
  if (isPencil && bannerImage !== null) {
    bannerImage.remove();
  } else if (!isPencil) {
    const images = [...block.querySelectorAll('p > picture')];
    const imageURLs = getImageURLs(images);
    const imageData = imageURLs.map((src) => ({ src, breakpoints: [] }));

    const breakpoints0 = [{ media: '(min-width: 600px)', width: 800 }, { width: 600 }];

    const breakpoints1 = [
      { media: '(min-width: 744px)', width: 800 },
      { media: '(min-width: 1200px)', width: 1200 },
      { media: '(min-width: 1440px)', width: 1440 },
      { media: '(min-width: 1920px)', width: 1920 },
    ];

    if (images.length === 1) {
      imageData[0].breakpoints = [...breakpoints0, ...breakpoints1];
    } else if (images.length > 1) {
      imageData[0].breakpoints = [...breakpoints0];
      imageData[1].breakpoints = [...breakpoints1];
    }

    const altText = [...block.querySelectorAll('p > picture img.alt')];
    const newPicture = createResponsivePicture(imageData, true, altText, `${blockName}__image`);
    images.forEach((image) => image.parentNode.remove());

    block.prepend(newPicture);
  }

  const contentWrapper = block.querySelector(':scope > div');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const content = block.querySelector(':scope > div > div');
  content.classList.add(`${blockName}__content`);
  if (content.querySelectorAll('p').length === 0) {
    const p = createElement('p');
    while (content.firstChild) {
      p.appendChild(content.firstChild);
    }
    content.appendChild(p);
  }

  const ctaButtons = content.querySelectorAll('.button-container > a');
  [...ctaButtons].forEach((b) => {
    b.classList.remove('button', 'button--primary');
    b.parentElement.classList.remove('button-container');
    b.parentElement.removeAttribute('class');
  });

  const bannerLinks = block.querySelectorAll('a');

  bannerLinks.forEach((link) => {
    const closestParent = link.closest(`.${blockName}`);
    closestParent.addEventListener('click', () => {
      const linkHref = link.getAttribute('href');
      if (linkHref) {
        window.location.href = linkHref;
      }
    });
  });
}
