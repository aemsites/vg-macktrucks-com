import { adjustPretitle, createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';
import { listenScroll, createArrowControls } from '../../scripts/carousel-helper.js';

const blockName = 'v2-feature-carousel';

const updateActiveClass = (elements, entry) => {
  elements.forEach((el, index) => {
    if (el === entry.target) {
      el.classList.add('active');
      let arrowControl = el.parentElement.previousElementSibling.querySelector(`.${blockName}__button:disabled`);

      if (arrowControl) {
        arrowControl.disabled = false;
        arrowControl = null;
      }
      // disable arrow buttons
      if (index === 0) {
        arrowControl = el.parentElement.previousElementSibling.querySelector(`.${blockName}__button-prev`);
      } else if (index === el.parentNode.children.length - 1) {
        arrowControl = el.parentElement.previousElementSibling.querySelector(`.${blockName}__button-next`);
      }
      if (arrowControl) {
        arrowControl.disabled = true;
      }
    } else {
      el.classList.remove('active');
    }
  });
};

const arrowFragment = () =>
  document.createRange().createContextualFragment(`<li>
  <button aria-label="${getTextLabel('Previous')}" class="${blockName}__button ${blockName}__button-prev">
    <span class="icon icon-arrow-right" />
  </button>
</li>
<li>
  <button aria-label="${getTextLabel('Next')}" class="${blockName}__button ${blockName}__button-next">
    <span class="icon icon-arrow-right" />
  </button>
</li>`);

const createImageList = (pictures) => {
  let images = '';
  pictures.forEach((pic) => {
    pic.classList.add(`${blockName}__image`);
    images += pic.outerHTML;
  });
  return images;
};

const createCardsList = (nodes) => {
  let cardItems = '';
  nodes.forEach((node) => {
    const buttons = [...node.querySelectorAll('.button-container a')];
    buttons.forEach((btn) => {
      btn.classList.add('button--large');
    });

    const li = createElement('li', { classes: `${blockName}__list-item` });
    li.innerHTML = node.innerHTML;

    const headings = li.querySelectorAll('h1, h2, h3, h4');
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

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
    <div class='${blockName}__image-wrapper'>
      ${createImageList(pictureNodes)}
    </div>
    <div class='${blockName}__list-wrapper'>
      <div class='${blockName}__list-container'>
        <ul class='${blockName}__list'>
          ${createCardsList(otherNodes)}
        </ul>
      </div>
    </div>
  `);

  const carouselList = carousel.querySelector(`.${blockName}__list`);
  const imageList = carousel.querySelector(`.${blockName}__image-wrapper`);

  if (otherNodes.length > 1) {
    createArrowControls(carouselList, `.${blockName}__list-item.active`, [`${blockName}__arrowcontrols`], arrowFragment());
    createArrowControls(imageList, `.${blockName}__image.active`, [`${blockName}__arrowcontrols`], arrowFragment());
    const elements = carouselList.querySelectorAll(`.${blockName}__list-item`);
    listenScroll(carouselList, elements, updateActiveClass, 0.75);
    const images = imageList.querySelectorAll(`.${blockName}__image`);
    listenScroll(imageList, images, updateActiveClass, 0.75);
  } else {
    carousel.querySelector(`.${blockName}__list-container`).classList.add(`${blockName}__list-container--single`);
  }

  block.innerHTML = '';
  block.append(carousel);

  decorateIcons(block);
}
