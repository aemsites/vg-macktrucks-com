import { adjustPretitle, createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';
import { listenScroll, createArrowControls, setCarouselPosition } from '../../scripts/carousel-helper.js';

const blockName = 'v2-feature-carousel';
const CLASSES = {
  button: `${blockName}__button`,
  buttonPrev: `${blockName}__button-prev`,
  buttonNext: `${blockName}__button-next`,
  imageWrapper: `${blockName}__image-wrapper`,
  image: `${blockName}__image`,
  listWrapper: `${blockName}__list-wrapper`,
  listContainer: `${blockName}__list-container`,
  listContainerSingle: `${blockName}__list-container--single`,
  list: `${blockName}__list`,
  listItem: `${blockName}__list-item`,
  title: `${blockName}__title`,
  arrowcontrols: `${blockName}__arrowcontrols`,
};

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

const createImageList = (pictures) => {
  let images = '';
  pictures.forEach((pic, idx) => {
    pic.classList.add(`${CLASSES.image}`);
    pic.dataset.index = idx;
    images += pic.outerHTML;
  });
  return images;
};

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

export default async function decorate(block) {
  const pictureNodes = [];
  const otherNodes = [];

  block.querySelectorAll(':scope > div div').forEach((el) => {
    if (el.querySelector('picture')) {
      const picEl = el.querySelector('picture');
      pictureNodes.push(picEl);
    } else {
      otherNodes.push(el);
    }
  });

  const carousel = document.createRange().createContextualFragment(`
    <div class='${CLASSES.imageWrapper}'>
      ${createImageList(pictureNodes)}
    </div>
    <div class='${CLASSES.listWrapper}'>
      <div class='${CLASSES.listContainer}'>
        <ul class='${CLASSES.list}'>
          ${createCardsList(otherNodes)}
        </ul>
      </div>
    </div>
  `);

  const carouselList = carousel.querySelector(`.${CLASSES.list}`);

  if (otherNodes.length > 1) {
    createArrowControls(carouselList, `.${CLASSES.listItem}.active`, [`${CLASSES.arrowcontrols}`], arrowFragment());
    const elements = carouselList.querySelectorAll(`.${CLASSES.listItem}`);
    listenScroll(carouselList, elements, updateActiveClass, 0.75);
  } else {
    carouselList.parentElement.classList.add(`${CLASSES.listContainerSingle}`);
  }

  block.innerHTML = '';
  block.append(carousel);

  decorateIcons(block);
}
