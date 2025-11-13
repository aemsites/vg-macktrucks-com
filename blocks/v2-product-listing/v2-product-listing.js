import {
  createElement,
  createResponsivePicture,
  decorateBlackLabel,
  getImageURLs,
  getTextLabel,
  variantsClassesToBEM,
} from '../../scripts/common.js';

const blockName = 'v2-product-listing';
const variantClasses = ['with-filter', 'with-dots', '2-columns', 'pencil-promo'];

function getActiveFilterButton(block) {
  const AllFilterButtons = block.querySelectorAll(`.${blockName}__button-list .${blockName}__segment-button`);
  AllFilterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', (e) => {
      AllFilterButtons.forEach((button) => {
        if (button !== e.target) {
          button.classList.remove('active');
        } else if (button === e.target && !button.classList.contains('active')) {
          e.target.classList.toggle('active');
        }
      });
    });
  });
}

function getPictures(imageWrapper) {
  const pictures = [...imageWrapper.querySelectorAll('picture')];
  const imageURLs = getImageURLs(pictures);
  const imageData = imageURLs.map((src) => ({ src, breakpoints: [] }));

  if (imageData.length === 2) {
    imageData[0].breakpoints = [
      { media: '(min-width: 600px)', width: 600 },
      { media: '(min-width: 1200px)', width: 1200 },
      { media: '(min-width: 1440px)', width: 1440 },
      { width: 750 },
    ];
  }

  if (imageData.length > 2) {
    imageData[0].breakpoints = [{ media: '(min-width: 600px)', width: 600 }, { width: 750 }];

    imageData[1].breakpoints = [
      { media: '(min-width: 1200px)', width: 1200 },
      { media: '(min-width: 1440px)', width: 1440 },
    ];
  }
  const newPicture = createResponsivePicture(imageData, true, 'small image', `${blockName}__image`);

  return [newPicture, pictures[pictures.length - 1]];
}

function buildProductImageDom(prodEle) {
  const productImageWrapper = prodEle.querySelectorAll(`.${blockName}__product > div:first-child`);

  productImageWrapper.forEach((imageWrapper) => {
    imageWrapper.classList.add(`${blockName}__product-image`);
    const pictures = getPictures(imageWrapper);
    const link = imageWrapper.querySelector('a');
    link.text = '';
    link.classList.add(`${blockName}__product-image-link`);
    link.append(...pictures);
    imageWrapper.innerHTML = '';
    imageWrapper.append(link);
  });
}

function buildProductInfoDom(prodEle) {
  const productInfoWrapper = prodEle.querySelectorAll(`.${blockName}__product> div:last-child`);
  productInfoWrapper.forEach((info) => {
    const buttonContainer = createElement('div', { classes: `${blockName}__button-container` });
    const buttons = info.querySelectorAll('.button-container a');
    const primaryButton = info.querySelector('.button--primary');

    info.classList.add(`${blockName}__product-info`);

    [...buttons].forEach((b) => {
      const parent = b.parentElement;
      b.classList.add('button--large');
      buttonContainer.appendChild(b);
      parent.remove(); // Remove the previous empty button container
    });
    info.appendChild(buttonContainer);

    primaryButton?.addEventListener('mouseover', () => {
      info.previousElementSibling.classList.add(`${blockName}__product-image--show-background`);
    });

    primaryButton?.addEventListener('mouseout', () => {
      info.previousElementSibling.classList.remove(`${blockName}__product-image--show-background`);
    });
  });
}

function buildSegments(segmentList, allSegmentNames) {
  segmentList.forEach((ul) => {
    ul.classList.add(`${blockName}__segment-list`);
    const segmentListItems = ul.querySelectorAll('li');
    const segmentNames = Array.from(segmentListItems).map((item) => {
      const segmentName = item.textContent.trim().toLowerCase().replaceAll(' ', '-');
      if (!allSegmentNames.includes(segmentName)) {
        allSegmentNames.push(segmentName);
      }
      return segmentName;
    });
    const product = ul.closest(`.${blockName}__product`);
    segmentNames.forEach((segment) => {
      product.classList.add(segment);
    });
  });
}

function handFilterClick(e, firstSegment, featuredAmount) {
  const { target } = e;
  const activeBlock = target.closest(`.${blockName}`);
  const products = activeBlock.querySelectorAll(`.${blockName}__product`);
  const clickedSegment = target.textContent.trim().toLowerCase();
  const selectedItem = activeBlock.querySelector(`.${blockName}__selected-item`);
  selectedItem.textContent = clickedSegment;

  const dropdown = activeBlock.querySelector(`.${blockName}__dropdown`);
  dropdown.dataset.selected = clickedSegment;

  const isFirstSegmentActive = firstSegment === clickedSegment;
  activeBlock.dataset.selected = clickedSegment;

  dropdown.classList.toggle('initial-state', isFirstSegmentActive);

  products.forEach((product, idx) => {
    product.style.display = product.classList.contains(clickedSegment) || isFirstSegmentActive ? 'flex' : 'none';
    const isSelected = product.style.display === 'flex';
    product.style.display = isSelected ? 'flex' : 'none';
    product.classList.toggle('selected-product', isSelected);

    if (idx < featuredAmount) {
      product.classList.toggle('featured', isFirstSegmentActive);
    }
  });

  const allProductsRows = activeBlock.querySelectorAll(`.${blockName}__product`);

  allProductsRows.forEach((product) => {
    if (product.classList.contains('selected-product')) {
      product.classList.remove('odd', 'even');

      const selectedProducts = activeBlock.querySelectorAll('.selected-product');
      selectedProducts.forEach((selectedProduct, i) => {
        const newIdx = isFirstSegmentActive ? i + featuredAmount : i;
        console.log(newIdx);
        if (newIdx % 2 === 0) {
          selectedProduct.classList.remove('even');
          selectedProduct.classList.add('odd');
        } else {
          selectedProduct.classList.remove('odd');
          selectedProduct.classList.add('even');
        }
      });
    } else if (!product.classList.contains('selected-product')) {
      product.classList.remove('odd', 'even');
    }
  });

  // show/hide pencil promo text blocks depending on the clicked segment if pencil promo variant is present
  if (!activeBlock.classList.contains(`${blockName}--pencil-promo`)) {
    return;
  }
  const allPencilPromo = activeBlock.closest('.section').querySelectorAll('[data-segment]');
  allPencilPromo.forEach((promo) => {
    const promoSegment = promo.dataset.segment.trim().toLowerCase();
    const isClickedSegment = promoSegment === clickedSegment;
    promo.parentElement.classList.toggle('v2-pencil-promo--hidden', !isClickedSegment);
  });
}

function buildFilter(allSegmentNames, firstSegment, featuredAmount) {
  const dropdownWrapper = createElement('div', { classes: `${blockName}__dropdown` });
  const selectedItemWrapper = createElement('div', { classes: `${blockName}__selected-item-wrapper` });
  const selectedItem = createElement('div', { classes: `${blockName}__selected-item` });
  const segmentNamesList = createElement('ul', { classes: `${blockName}__button-list` });

  const dropdownArrowIcon = createElement('span', { classes: [`${blockName}__icon`, 'icon', 'icon-dropdown-caret'] });
  selectedItemWrapper.append(selectedItem);
  selectedItemWrapper.appendChild(dropdownArrowIcon);

  dropdownWrapper.append(selectedItemWrapper);
  dropdownWrapper.append(segmentNamesList);

  allSegmentNames.forEach((segment, index) => {
    const li = createElement('li');
    const filterButton = createElement('button', { classes: `${blockName}__segment-button` });
    filterButton.textContent = segment;

    if (index === 0) {
      // Default selected item
      filterButton.classList.add('active');
      selectedItem.textContent = segment;
    }

    segmentNamesList.appendChild(li);
    li.append(filterButton);

    filterButton.addEventListener('click', (e) => handFilterClick(e, firstSegment, featuredAmount));
  });

  return dropdownWrapper;
}

function handleListeners(dropdownWrapper, block) {
  // Listener to toggle the dropdown (open / close)
  block.addEventListener('click', (e) => {
    if (e.target.closest(`.${blockName}__selected-item-wrapper`)) {
      dropdownWrapper.classList.toggle(`${blockName}__dropdown--open`);
    } else {
      dropdownWrapper.classList.remove(`${blockName}__dropdown--open`);
    }
  });
}

const getRowClass = (idx, amount) => {
  const newId = amount + idx;
  return newId % 2 ? 'even' : 'odd';
};

export default function decorate(block) {
  let featuredAmount = 0;

  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const allSegmentNames = [getTextLabel('v2_product_listing:all_segment_text')];
  const firstSegment = allSegmentNames[0].trim().toLowerCase();
  const hasFilters = block.classList.contains(`${blockName}--with-filter`);

  const classes = block.classList;
  classes.forEach((cl) => {
    if (cl.endsWith('-featured')) {
      featuredAmount = Number(cl.split('-')[1]);
    }
  });

  if (featuredAmount !== 0) {
    block.classList.add('with-featured');
  }

  const productElement = block.querySelectorAll(`.${blockName} > div`);
  productElement.forEach((prodEle, idx) => {
    prodEle.classList.add(`${blockName}__product`);

    if (idx < featuredAmount) {
      prodEle.classList.add('featured');
    }

    const rowClass = getRowClass(idx, featuredAmount);
    prodEle.classList.add(rowClass);

    buildProductImageDom(prodEle);
    buildProductInfoDom(prodEle);
  });

  block.parentElement.classList.add('full-width');
  // Add product name to product element class list
  getProductName(block);

  if (hasFilters) {
    // Create menu buttons from product segments
    const segmentList = block.querySelectorAll(`.${blockName}__product > div > ul`);
    block.dataset.selected = firstSegment;
    buildSegments(segmentList, allSegmentNames);
    const dropdownWrapper = buildFilter(allSegmentNames, firstSegment, featuredAmount);
    block.prepend(dropdownWrapper);
    dropdownWrapper.dataset.selected = firstSegment;
    dropdownWrapper.classList.add('initial-state');

    handleListeners(dropdownWrapper, block);
    getActiveFilterButton(block);
  } else {
    const detailList = block.querySelectorAll(`.${blockName}__product > div > ul`);
    detailList.forEach((ul) => {
      ul.classList.add(`${blockName}__detail-list`);
    });
  }

  decorateBlackLabel(block);
}

function getProductName(block) {
  const modelName = block.querySelectorAll(`.${blockName}__product > div + div > h3`);
  modelName.forEach((model) => {
    const parentNodeElement = model.parentNode.parentNode;
    parentNodeElement.classList.add(model.id);
  });
}
