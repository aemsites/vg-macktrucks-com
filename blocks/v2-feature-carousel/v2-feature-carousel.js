import { adjustPretitle, createElement, decorateIcons, getTextLabel, unwrapDivs } from '../../scripts/common.js';
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

export default async function decorate(block) {
  const imageRow = block.firstElementChild;
  imageRow.classList.add(`${blockName}__image-wrapper`);
  unwrapDivs(imageRow);

  const carouselList = createElement('ul', { classes: `${blockName}__list` });

  // select 2nd div of the block to attach the carousel list
  const carouselContainer = imageRow.nextElementSibling;
  carouselContainer.classList.add(`${blockName}__list-container`);

  // select all div except first , as it contains image
  const textElements = block.querySelectorAll('div:not(:first-child)');
  textElements.forEach((textCol) => {
    const buttons = [...textCol.querySelectorAll('.button-container a')];
    buttons.forEach((btn) => {
      btn.classList.add('button--large');
    });

    // creating li element for carousel
    const li = createElement('li', { classes: `${blockName}__list-item` });
    li.innerHTML = textCol.innerHTML;

    const headings = li.querySelectorAll('h1, h2, h3, h4');
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

    adjustPretitle(li);
    carouselList.append(li);
    textCol.innerHTML = '';
  });

  carouselContainer.append(carouselList);

  const carouselRow = createElement('div', { classes: `${blockName}__list-wrapper` });
  carouselRow.append(carouselContainer);

  block.append(carouselRow);

  if (textElements.length > 1) {
    createArrowControls(carouselList, `.${blockName}__list-item.active`, [`${blockName}__arrowcontrols`], arrowFragment());
    const elements = carouselList.querySelectorAll(`.${blockName}__list-item`);
    listenScroll(carouselList, elements, updateActiveClass, 0.75);
  } else {
    carouselContainer.classList.add(`${blockName}__list-container--single`);
  }

  unwrapDivs(block, { ignoreDataAlign: true });
  decorateIcons(block);
}
