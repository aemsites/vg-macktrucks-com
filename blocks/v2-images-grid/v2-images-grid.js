import { createOptimizedPicture } from '../../scripts/aem.js';
import { createElement, removeEmptyTags, getTextLabel, debounce, decorateIcons, variantsClassesToBEM } from '../../scripts/common.js';
import { getAllElWithChildren } from '../../scripts/scripts.js';
import { showModal } from '../../common/modal/modal-component.js';

const blockName = 'v2-images-grid';
const variantClasses = ['with-captions'];

const scrollLeft = (el, leftPadding, behavior = 'smooth') => {
  el.scrollTo({
    left: leftPadding,
    behavior,
  });
};

const udpateArrowsState = (activeSlideIndex, itemsCount) => {
  const arrowButtons = [...document.querySelectorAll(`.${blockName}__modal-arrows-wrapper button`)];

  if (!arrowButtons.length) {
    return;
  }

  if (activeSlideIndex === 0) {
    arrowButtons[0].setAttribute('disabled', 'disabled');
  } else {
    arrowButtons[0].removeAttribute('disabled');
  }

  if (activeSlideIndex === itemsCount - 1) {
    arrowButtons[1].setAttribute('disabled', 'disabled');
  } else {
    arrowButtons[1].removeAttribute('disabled');
  }
};

const setActiveSlide = (activeSlideIndex, carouselItemsList, carouselImagesList, modalContent, behavior) => {
  const itemWidth = carouselItemsList.getBoundingClientRect().width;

  udpateArrowsState(activeSlideIndex, carouselItemsList.children.length, modalContent);

  scrollLeft(carouselImagesList, activeSlideIndex * 90, behavior);
  scrollLeft(carouselItemsList, activeSlideIndex * itemWidth, behavior);
};

const createModalContent = (content) => {
  const carouselItemsList = createElement('ul', { classes: `${blockName}__carousel-items-list` });
  const carouselImagesList = createElement('ul', { classes: `${blockName}__carousel-preview-list` });

  let isScrolling = false;
  let stopScrolling;

  carouselItemsList.addEventListener('scroll', () => {
    isScrolling = true;

    clearTimeout(stopScrolling);
    stopScrolling = setTimeout(() => {
      isScrolling = false;
    }, 50);
  });

  const debouncedOnItemChange = debounce((index) => {
    if (isScrolling) {
      return;
    }

    scrollLeft(carouselImagesList, index * 90);
  }, 100);

  [...content.querySelectorAll('.v2-images-grid__item')].forEach((el, index) => {
    const image = el.querySelector('img');

    // adding image to carousel preview
    const carouselImage = createOptimizedPicture(image.src, image.alt, false, [{ width: '80' }]);
    const carousePreviewlItem = createElement('li', { classes: `${blockName}__carousel-preview-item` });
    const buttonWithImage = createElement('button');

    buttonWithImage.addEventListener('click', () => {
      const itemWidth = carouselItemsList.getBoundingClientRect().width;

      scrollLeft(carouselItemsList, index * itemWidth);
    });

    buttonWithImage.append(carouselImage);
    carousePreviewlItem.append(buttonWithImage);
    carouselImagesList.append(carousePreviewlItem);

    // creating item content
    const itemImage = createOptimizedPicture(image.src, image.alt, false);
    const [, caption, description] = el.querySelectorAll('p');
    const carouselItem = createElement('li', { classes: `${blockName}__carousel-item` });

    carouselItem.append(itemImage, description || caption);
    carouselItemsList.append(carouselItem);

    const options = {
      root: carouselItemsList,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        return;
      }

      debouncedOnItemChange(index);

      udpateArrowsState(index, carouselItemsList.children.length, el.closest(`${blockName}__carousel-items-wrapper`));
    }, options);

    observer.observe(carouselItem);
  });

  const itemsWrapper = createElement('div', { classes: `${blockName}__carousel-items-wrapper` });
  const wrapper = createElement('div', { classes: `${blockName}__modal-content` });

  itemsWrapper.innerHTML = `<div class="${blockName}__modal-arrows-wrapper">
    <button class="${blockName}__modal-arrow" aria-label="${getTextLabel('Previous')}">
      <span class="icon icon-arrow-left" />
    </button>
    <button class="${blockName}__modal-arrow" aria-label="${getTextLabel('Next')}">
      <span class="icon icon-arrow-right" />
    </button>
  </div>`;
  itemsWrapper.append(carouselItemsList);

  [...itemsWrapper.querySelectorAll('button')].forEach((el, elIndex) => {
    const modifiers = [-1, 1];

    el.addEventListener('click', () => {
      const itemWidth = carouselItemsList.getBoundingClientRect().width;
      const index = Math.round(carouselItemsList.scrollLeft / itemWidth) + modifiers[elIndex];

      setActiveSlide(index, carouselItemsList, carouselImagesList, content);
    });
  });

  decorateIcons(itemsWrapper);

  wrapper.append(itemsWrapper, carouselImagesList);

  return wrapper;
};

const showImagesGridModal = async (modalContent) => {
  await showModal(modalContent, { classes: ['modal-content--bottom'] });
};

const buildOverlayFragment = (captionText) => {
  return document.createRange().createContextualFragment(`
    <button class="${blockName}__btn ${blockName}__info-btn" aria-label="${getTextLabel('Image info open')}" aria-haspopup="dialog" aria-expanded="false">
      <span class="icon icon-info" aria-hidden="true">Info</span>
    </button>
    <div class="${blockName}__caption-panel" hidden role="dialog" aria-label="${getTextLabel('Image info dialog')}">
      <p class="${blockName}__caption-text">${captionText}</p>
    </div>
    <button class="${blockName}__btn ${blockName}__close-btn" hidden aria-label="${getTextLabel('Image info close')}">
      <span class="icon icon-close" aria-hidden="true">Close</span>
    </button>
  `);
};

const attachOverlayEvents = (container) => {
  const infoBtn = container.querySelector(`.${blockName}__info-btn`);
  const captionPanel = container.querySelector(`.${blockName}__caption-panel`);
  const closeBtn = container.querySelector(`.${blockName}__close-btn`);

  infoBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    captionPanel.removeAttribute('hidden');
    closeBtn.removeAttribute('hidden');
    infoBtn.setAttribute('aria-expanded', 'true');
    infoBtn.style.display = 'none';
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    captionPanel.setAttribute('hidden', 'true');
    closeBtn.setAttribute('hidden', 'true');
    infoBtn.setAttribute('aria-expanded', 'false');
    infoBtn.style.display = 'block';
  });
};

const createCaptionOverlay = (captionText) => {
  const overlay = createElement('div', { classes: `${blockName}__overlay` });
  overlay.append(buildOverlayFragment(captionText));
  attachOverlayEvents(overlay);
  return overlay;
};

export default function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const isCaptionsVariant = block.classList.contains(`${blockName}--with-captions`);

  // all items are inside a ul list with classname called 'v2-images-grid__items'
  const ul = createElement('ul', { classes: `${blockName}__items` });
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    // If cell contain any element, we add them in the ul
    if (cell.childElementCount) {
      const li = createElement('li', { classes: `${blockName}__item` });
      li.append(...cell.childNodes);
      ul.append(li);
    }
    cell.remove();
  });
  if (isCaptionsVariant) {
    const amountOfItems = ul.querySelectorAll('li').length;
    ul.classList.add(`${blockName}__${amountOfItems}-items`);
  }
  block.append(ul);

  const modalContent = !isCaptionsVariant && createModalContent(ul);

  // give format to the first 4 list items
  [...ul.children].forEach((li, idx) => {
    if (idx < 4) {
      const captionEle = getAllElWithChildren(li.querySelectorAll('p'), 'picture', true)[0];
      let picture = li.querySelector('picture');
      let overlay;

      if (picture) {
        const img = picture.lastElementChild;
        // no width provided because we are using object-fit, we need the biggest option
        const newPicture = createOptimizedPicture(img.src, captionEle?.textContent, false);
        picture.replaceWith(newPicture);
        picture = newPicture;
        picture.classList.add(`${blockName}__picture`);
        // use figcaption for text
        const figCaption = createElement('figcaption', { classes: `${blockName}__figcaption` });
        figCaption.textContent = captionEle?.textContent;
        picture.append(figCaption);
        overlay = createCaptionOverlay(captionEle?.textContent);
      }

      li.innerHTML = '';
      li.append(picture, overlay);

      if (!isCaptionsVariant) {
        li.addEventListener('click', async () => {
          const carouselItemsList = modalContent.querySelector(`.${blockName}__carousel-items-list`);
          const carouselImagesList = modalContent.querySelector(`.${blockName}__carousel-preview-list`);

          await showImagesGridModal(modalContent);
          setActiveSlide(idx, carouselItemsList, carouselImagesList, modalContent, 'instant');
        });
      }
      return;
    }
    li.remove();
  });

  if (!isCaptionsVariant) {
    const button = createElement('a', {
      classes: ['button', 'button--large', 'button--primary'],
    });
    button.textContent = getTextLabel('Open Gallery');
    button.addEventListener('click', async () => {
      const carouselItemsList = modalContent.querySelector(`.${blockName}__carousel-items-list`);
      const carouselImagesList = modalContent.querySelector(`.${blockName}__carousel-preview-list`);

      await showImagesGridModal(modalContent);
      setActiveSlide(0, carouselItemsList, carouselImagesList, modalContent);
    });

    block.append(button);
  }

  decorateIcons(block);
  removeEmptyTags(block);
}
