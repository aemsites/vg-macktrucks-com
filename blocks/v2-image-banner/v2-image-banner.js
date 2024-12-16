import { unwrapDivs, variantsClassesToBEM, debounce } from '../../scripts/common.js';

const variantClasses = ['16-9', '4-3'];
const blockName = 'v2-image-banner';

/**
 * Finds the matching source element based on the media query.
 * @param {HTMLElement} picture - The picture element containing the sources.
 * @returns {HTMLElement|null} The matching source element or null if none found.
 */
const findMatchingSource = (picture) => {
  const sources = Array.from(picture.querySelectorAll('source'));
  return sources.find((source) => {
    const media = source.getAttribute('media');
    return !media || window.matchMedia(media).matches;
  });
};

/**
 * Retrieves the image source URL from a block element.
 * @param {HTMLElement} block - The block element containing the picture.
 * @returns {string} The image source URL.
 */
const getImgSrc = (block) => {
  const picture = block.querySelector('picture');
  if (!picture) {
    return '';
  }

  const matchingSource = findMatchingSource(picture);
  if (matchingSource) {
    return matchingSource.getAttribute('srcset');
  }

  const img = picture.querySelector('img');
  return img ? img.getAttribute('src') : '';
};

/**
 * Sets the background image of a block element.
 * @param {HTMLElement} block - The block element to set the background image for.
 * @param {string} imgSrc - The image source URL.
 */
const setImgSrc = (block, imgSrc) => {
  block.style.backgroundImage = `url(${imgSrc})`;
};

/**
 * Updates the image source if the media query has changed.
 * @param {HTMLElement} block - The block element to update.
 * @param {string} currentMediaQuery - The current media query.
 * @returns {string} The new media query.
 */
const updateImageSrc = (block, currentMediaQuery) => {
  const picture = block.querySelector('picture');
  if (!picture) {
    return currentMediaQuery;
  }

  const matchingSource = findMatchingSource(picture);
  const newMediaQuery = matchingSource ? matchingSource.getAttribute('media') : '';
  if (newMediaQuery !== currentMediaQuery) {
    const newImgSrc = matchingSource ? matchingSource.getAttribute('srcset') : picture.querySelector('img').getAttribute('src');
    setImgSrc(block, newImgSrc);
    return newMediaQuery;
  }

  return currentMediaQuery;
};

/**
 * Initializes a ResizeObserver to update the background image URL based on the block's size.
 * @param {HTMLElement} block - The block element to observe.
 */
const initResizeObserver = (block) => {
  let currentMediaQuery = '';

  const debouncedUpdateImageSrc = debounce(() => {
    currentMediaQuery = updateImageSrc(block, currentMediaQuery);
  }, 100);

  const resizeObserver = new ResizeObserver(debouncedUpdateImageSrc);
  resizeObserver.observe(block);
};

/**
 * Decorates the block element with the appropriate classes and background image.
 * @param {HTMLElement} block - The block element to decorate.
 */
export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  block.parentElement.classList.add('full-width');

  const imgSrc = getImgSrc(block);
  if (imgSrc) {
    setImgSrc(block, imgSrc);
  }

  initResizeObserver(block);
  unwrapDivs(block);
}
