import { debounce } from '../../scripts/scripts.js';
import { decorateIcons, getTextLabel } from '../../scripts/common.js';

const blockName = 'v2-stories-carousel';

/**
 * Creates the basic HTML structure for a carousel component.
 * @param {string} title - The title for the carousel.
 * @param {string} baseBlockName - The base class name for the carousel elements.
 * @param {string} [previousLabel="Previous"] - Accessible label for the "previous" button.
 * @param {string} [nextLabel="Next"] - Accessible label for the "next" button.
 * @returns {string} - The HTML string for the carousel structure.
 */
const createCarouselStructure = (title, baseBlockName, previousLabel = 'Previous', nextLabel = 'Next') => `
  <div class="${baseBlockName}-aligner">
    <h2 class="${baseBlockName}-title">${title}</h2>
    <div class="${baseBlockName}-content-wrapper" aria-label="Carousel: ${title}">
      <button class="${baseBlockName}-control prev hidden" aria-label="${previousLabel}" aria-controls="${baseBlockName}-track">
        <span class="${baseBlockName}__icon icon icon-chevron-left-thin" aria-hidden="true"></span>
      </button>
      <div class="${baseBlockName}-track-container" role="region" aria-roledescription="carousel">
        <ul id="${baseBlockName}-track" class="${baseBlockName}-track" aria-live="polite" aria-atomic="true"></ul>
      </div>
      <button class="${baseBlockName}-control next" aria-label="${nextLabel}" aria-controls="${baseBlockName}-track">
        <span class="${baseBlockName}__icon icon icon-chevron-right-thin" aria-hidden="true"></span>
      </button>
    </div>
  </div>
`;

/**
 * Creates the HTML for a single carousel card.
 * @param {Object} item - The data for the carousel item.
 * @param {HTMLElement} item.picture - The picture element for the card.
 * @param {string} item.text - The text content for the card.
 * @param {string} item.linkText - The link text for the card.
 * @param {string} item.linkHref - The URL for the card link.
 * @param {string} baseBlockName - The base class name for the carousel elements.
 * @returns {string} - The HTML string for the carousel card.
 */
const createCarouselCard = (
  {
    picture,
    text,
    linkText,
    linkHref,
  },
  baseBlockName,
) => `
  <li class="${baseBlockName}-card">
    <a href="${linkHref}" class="${baseBlockName}-image-link">${picture.outerHTML}</a>
    <p class="${baseBlockName}-tag">${text}</p>
    <a href="${linkHref}" class="${baseBlockName}-link">${linkText}</a>
  </li>
`;

/**
 * Updates the visibility of the prev and next buttons based on the scroll position.
 * @param {Object} elements - An object containing carousel elements.
 */
const updateButtonVisibility = (elements) => {
  const { trackContainer, prevButton, nextButton } = elements;
  const { scrollLeft, scrollWidth, offsetWidth } = trackContainer;
  const isAtStart = scrollLeft <= 0;
  const isAtEnd = Math.ceil(scrollLeft + offsetWidth) >= scrollWidth;
  prevButton.classList.toggle('hidden', isAtStart);
  nextButton.classList.toggle('hidden', isAtEnd);
};

/**
 * Scrolls to the specified slide based on direction and updates button visibility.
 * @param {Object} elements - An object containing carousel elements.
 * @param {HTMLElement} elements.trackContainer - The container element that holds
 * the carousel track.
 * @param {HTMLElement[]} elements.slides - An array of slide elements within the carousel.
 * @param {number} elements.currentSlideIndex - The index of the currently active slide.
 * @param {number} [direction=1] - The scroll direction, positive for next and
 * negative for previous.
 * @param {boolean} [debounced=false] - Whether to apply debouncing to the scroll action.
 */
const scrollToSlide = (elements, direction = 1, debounced = false) => {
  const { trackContainer, currentSlideIndex } = elements;
  elements.slides = elements.slides || Array.from(trackContainer.querySelectorAll(`.${blockName}-card`));
  const { slides } = elements;

  const newSlideIndex = Math.max(0, Math.min(currentSlideIndex + direction, slides.length - 1));
  elements.currentSlideIndex = newSlideIndex;
  const targetScrollPosition = slides[newSlideIndex].offsetLeft;

  const performScroll = () => {
    if (Math.abs(trackContainer.scrollLeft - targetScrollPosition) < 1) return;

    trackContainer.scrollTo({
      left: targetScrollPosition,
      behavior: 'smooth',
    });
    updateButtonVisibility(elements);
  };

  if (debounced) {
    debounce(performScroll, 100)();
  } else {
    performScroll();
  }
};

/**
 * Initializes the carousel by setting its structure and populating items.
 * @param {HTMLElement} block - The carousel container element.
 */
const createCarousel = (block) => {
  const [header, ...items] = block.children;
  const title = header?.querySelector('h2')?.textContent || '';
  const previousLabel = getTextLabel('Previous');
  const nextLabel = getTextLabel('Next');
  block.innerHTML = createCarouselStructure(title, blockName, previousLabel, nextLabel);
  const carouselTrack = block.querySelector(`.${blockName}-track`);

  carouselTrack.innerHTML = items
    .map((item) => {
      const picture = item.querySelector('picture');
      const text = item.querySelectorAll('p')[1]?.textContent || '';
      const link = item.querySelector('a');
      const linkText = link?.textContent || '';
      const linkHref = link?.href || '#';

      return createCarouselCard(
        {
          picture,
          text,
          linkText,
          linkHref,
        },
        blockName,
      );
    })
    .join('');
};

/**
 * Calculates and caches the width of each slide.
 * @param {Array<HTMLElement>} slides - An array of slide elements.
 * @returns {number} - The width of each slide.
 */
let cachedSlideWidth;
const calculateSlideWidth = (slides) => {
  if (!cachedSlideWidth) {
    cachedSlideWidth = slides[0].getBoundingClientRect().width;
  }
  return cachedSlideWidth;
};

/**
 * Adds swipe gesture support for touch devices.
 * @param {HTMLElement} trackContainer - The track container element.
 * @param {Object} elements - An object containing carousel elements.
 * @param {number} [swipeThreshold=50] - Minimum swipe distance to trigger a slide change.
 */
const addSwipeSupport = (trackContainer, elements, swipeThreshold = 50) => {
  let startX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const swipeDistance = endX - startX;
    if (Math.abs(swipeDistance) > swipeThreshold) {
      const direction = swipeDistance < 0 ? 1 : -1;
      scrollToSlide(elements, direction, true);
    }
    startX = 0;
  };

  trackContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
  trackContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
};

/**
 * Adds event listeners for carousel navigation, scroll, and resize handling.
 * @param {Object} elements - An object containing carousel elements.
 */
const addEventListeners = (elements) => {
  const { trackContainer, nextButton, prevButton } = elements;

  elements.currentSlideIndex = 0;
  elements.slides = elements.slides || Array.from(trackContainer.querySelectorAll(`.${blockName}-card`));

  const updateCarouselState = () => {
    const slideWidth = calculateSlideWidth(elements.slides);
    elements.currentSlideIndex = Math.round(
      trackContainer.scrollLeft / slideWidth,
    );
    updateButtonVisibility(elements);
    cachedSlideWidth = null;
  };

  const debouncedUpdateCarouselState = debounce(updateCarouselState, 100);
  const handleNextClick = () => scrollToSlide(elements, 1, true);
  const handlePrevClick = () => scrollToSlide(elements, -1, true);

  nextButton.addEventListener('click', handleNextClick);
  prevButton.addEventListener('click', handlePrevClick);
  trackContainer.addEventListener('scroll', debouncedUpdateCarouselState, { passive: true });
  window.addEventListener('resize', debouncedUpdateCarouselState);

  addSwipeSupport(trackContainer, elements);
};

/**
 * Main function to set up and initialize the carousel.
 * @param {HTMLElement} block - The carousel container element.
 */
export default function decorate(block) {
  createCarousel(block);
  const elements = {
    trackContainer: block.querySelector(`.${blockName}-track-container`),
    nextButton: block.querySelector(`.${blockName}-control.next`),
    prevButton: block.querySelector(`.${blockName}-control.prev`),
  };
  addEventListeners(elements);
  block.parentElement.classList.add('full-width');
  decorateIcons(block);
}
