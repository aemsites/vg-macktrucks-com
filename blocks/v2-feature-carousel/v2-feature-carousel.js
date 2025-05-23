import { adjustPretitle, createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';
import { listenScroll, createArrowControls, setCarouselPosition } from '../../scripts/carousel-helper.js';
import { createVideo, isVideoLink } from '../../scripts/video-helper.js';

const blockName = 'v2-feature-carousel';
const CLASSES = {
  button: `${blockName}__button`,
  buttonPrev: `${blockName}__button-prev`,
  buttonNext: `${blockName}__button-next`,
  backgroundWrapper: `${blockName}__background-wrapper`,
  image: `${blockName}__image`,
  listWrapper: `${blockName}__list-wrapper`,
  listContainer: `${blockName}__list-container`,
  listContainerSingle: `${blockName}__list-container--single`,
  list: `${blockName}__list`,
  listItem: `${blockName}__list-item`,
  title: `${blockName}__title`,
  arrowcontrols: `${blockName}__arrowcontrols`,
};

/**
 * Updates the state of the arrows and disables the extremes when there are no more slides.
 * @param {HTMLElement} el - The active slide element
 * @param {number} index - The position of the slide in the carousel
 */
const updateArrows = (el, index) => {
  let arrowControl = el.parentElement.previousElementSibling.querySelector(`.${CLASSES.button}:disabled`);

  if (arrowControl) {
    arrowControl.disabled = false;
    arrowControl = null;
  }
  // disable arrow buttons
  if (index === 0) {
    arrowControl = el.parentElement.previousElementSibling.querySelector(`.${CLASSES.buttonPrev}`);
  } else if (index === el.parentNode.children.length - 1) {
    arrowControl = el.parentElement.previousElementSibling.querySelector(`.${CLASSES.buttonNext}`);
  }
  if (arrowControl) {
    arrowControl.disabled = true;
  }
};

/**
 * Updates the state of the image according to the active slide.
 * @param {HTMLElement} el - The active slide element
 */
const updateImage = (el) => {
  const activeBlock = el.closest('.block');
  const allImages = activeBlock.querySelectorAll(`.${CLASSES.image}`);

  if (allImages.length > 1) {
    const index = Number(el.dataset.index);
    const activeImage = activeBlock.querySelector(`[data-index='${index}']`);
    activeImage.classList.add('active');
    const carousel = activeImage.parentElement;

    setCarouselPosition(carousel, index);
  }
};

/**
 * Callback function that updates the slides. It also triggers the update of the arrows and images.
 * @param {Array<HTMLElement>} elements - The slide elements of the carousel.
 * @param {Object} entry - The observed data for the carousel item.
 */
const updateActiveClass = (elements, entry) => {
  elements.forEach((el, index) => {
    if (el === entry.target) {
      el.classList.add('active');
      updateImage(el);
      updateArrows(el, index);
    } else {
      el.classList.remove('active');
    }
  });
};

/**
 * The fragment containing the arrows that is used in the createArrowControls function.
 */
const arrowFragment = () =>
  document.createRange().createContextualFragment(`
    <li>
      <button aria-label="${getTextLabel('Previous')}" class="${CLASSES.button} ${CLASSES.buttonPrev}">
        <span class="icon icon-arrow-right" />
      </button>
    </li>
    <li>
      <button aria-label="${getTextLabel('Next')}" class="${CLASSES.button} ${CLASSES.buttonNext}">
        <span class="icon icon-arrow-right" />
      </button>
    </li>
  `);

/**
 * From all the <div> elements array that contain the slides properties are added and returned
 * as a string containing all <li> to insert into a <ul> element.
 * @param {Array<HTMLElement>} nodes - The slide <div> elements of the carousel.
 * @returns {string} - The HTML string for the carousel slides as one.
 */
const createCardsList = (nodes) => {
  let cardItems = '';
  nodes.forEach((node, idx) => {
    const buttons = [...node.querySelectorAll('.button-container a')];
    buttons.forEach((btn) => {
      btn.classList.add('button--large');
    });

    const li = createElement('li', { classes: `${CLASSES.listItem}` });
    li.innerHTML = node.innerHTML;
    li.dataset.index = idx;

    const headings = li.querySelectorAll('h1, h2, h3, h4');
    [...headings].forEach((heading) => heading.classList.add(`${CLASSES.title}`));

    adjustPretitle(li);
    cardItems += li.outerHTML;
  });
  return cardItems;
};

function buildBlockBackgrounds(block) {
  const firstLink = block.querySelector(':scope > div div a');

  if (isVideoLink(firstLink)) {
    const videoLink = firstLink.getAttribute('href');

    return [
      createVideo(
        videoLink,
        `${blockName}__video`,
        {
          autoplay: true,
          fill: true,
        },
        { usePosterAutoDetection: true },
      ),
    ];
  } else {
    const pictureNodes = [];
    let idx = 0;

    block.querySelectorAll(':scope > div div').forEach((el) => {
      if (el.querySelector('picture')) {
        const picEl = el.querySelector('picture');
        picEl.classList.add(`${CLASSES.image}`);
        picEl.dataset.index = idx;
        pictureNodes.push(picEl);
        idx++;
      }
    });

    return pictureNodes;
  }
}

export default async function decorate(block) {
  const listNodes = [];
  const blockBackgrounds = buildBlockBackgrounds(block);

  block.querySelectorAll(':scope > div div').forEach((el) => {
    if (!el.querySelector('picture') && !(el.children.length === 1 && el.querySelector('a') && isVideoLink(el.querySelector('a')))) {
      listNodes.push(el);
    }
  });

  const carousel = document.createRange().createContextualFragment(`
    <div class='${CLASSES.backgroundWrapper}'></div>
    <div class='${CLASSES.listWrapper}'>
      <div class='${CLASSES.listContainer}'>
        <ul class='${CLASSES.list}'>
          ${createCardsList(listNodes)}
        </ul>
      </div>
    </div>
  `);

  const carouselList = carousel.querySelector(`.${CLASSES.list}`);

  if (listNodes.length > 1) {
    createArrowControls(carouselList, `.${CLASSES.listItem}.active`, [`${CLASSES.arrowcontrols}`], arrowFragment());
    const elements = carouselList.querySelectorAll(`.${CLASSES.listItem}`);
    listenScroll(carouselList, elements, updateActiveClass, 0.75);
  } else {
    carouselList.parentElement.classList.add(`${CLASSES.listContainerSingle}`);
  }

  block.innerHTML = '';
  block.append(carousel);

  block.querySelector(`.${CLASSES.backgroundWrapper}`).append(...blockBackgrounds);

  decorateIcons(block);
}
