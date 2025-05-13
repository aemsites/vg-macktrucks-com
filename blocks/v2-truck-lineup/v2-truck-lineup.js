import { createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';
import { createArrowControls, listenScroll, setCarouselPosition } from '../../scripts/carousel-helper.js';

const blockName = 'v2-truck-lineup';
const tabContentClass = `.${blockName}__content`;

function stripEmptyTags(main, child) {
  if (child !== main && child.innerHTML.trim() === '') {
    const parent = child.parentNode;
    child.remove();
    stripEmptyTags(main, parent);
  }
}

const moveNavigationLine = (navigationLine, activeTab, tabNavigation) => {
  const { x: navigationX } = tabNavigation.getBoundingClientRect();
  const { x, width } = activeTab.getBoundingClientRect();
  Object.assign(navigationLine.style, {
    left: `${x + tabNavigation.scrollLeft - navigationX}px`,
    width: `${width}px`,
  });
};

const setNavigationLine = (tabNavigation) => {
  const navWidth = tabNavigation.offsetWidth;
  const viewportWidth = document.documentElement.clientWidth;
  const listItems = tabNavigation.querySelectorAll(`.${blockName}__navigation-item`);
  let totalWidth = 0;

  [...listItems].forEach((listItem) => {
    totalWidth += listItem.getBoundingClientRect().width;
  });

  let borderScale = totalWidth;
  if (totalWidth + 32 <= navWidth) {
    borderScale = navWidth === 1040 && viewportWidth >= 1200 ? navWidth : navWidth - 32;
  }
  tabNavigation.style.setProperty('--truck-lineup-border-scale', `${borderScale}`);
};

function buildTabNavigation(tabItems, clickHandler) {
  const tabNavigationContainer = createElement('div', { classes: `${blockName}__navigation-container` });
  const tabNavigation = createElement('ul', { classes: `${blockName}__navigation` });
  const navigationLine = createElement('li', { classes: `${blockName}__navigation-line` });
  let timeout;

  [...tabItems].forEach((tabItem, i) => {
    const listItem = createElement('li', { classes: `${blockName}__navigation-item` });
    const button = createElement('button');
    button.addEventListener('click', () => clickHandler(i));
    button.addEventListener('mouseover', (e) => {
      clearTimeout(timeout);
      moveNavigationLine(navigationLine, e.currentTarget, tabNavigation);
    });

    button.addEventListener('mouseout', () => {
      timeout = setTimeout(() => {
        const activeItem = document.querySelector(`.${blockName}__navigation-item.active button`);
        moveNavigationLine(navigationLine, activeItem, tabNavigation);
      }, 600);
    });

    const tabContent = tabItem.querySelector(tabContentClass);
    const icon = tabContent && tabContent?.dataset.truckCarouselIcon;
    const svgIcon = icon ? `<span class="icon icon-${icon}"></span>` : '';
    button.innerHTML = `${tabContent.dataset.truckCarousel}${svgIcon}`;
    listItem.append(button);
    tabNavigation.append(listItem);
  });

  tabNavigation.append(navigationLine);
  tabNavigationContainer.append(tabNavigation);

  return tabNavigationContainer;
}

const updateActiveItem = (index) => {
  const images = document.querySelector(`.${blockName}__images-container`);
  const descriptions = document.querySelector(`.${blockName}__description-container`);
  const navigation = document.querySelector(`.${blockName}__navigation`);
  const navigationLine = document.querySelector(`.${blockName}__navigation-line`);
  const tabNavigation = document.querySelector(`.${blockName}__navigation`);

  [images, descriptions, navigation].forEach((c) => c.querySelectorAll('.active').forEach((i) => i.classList.remove('active')));
  images.children[index].classList.add('active');
  descriptions.children[index].classList.add('active');
  navigation.children[index].classList.add('active');

  const activeNavigationItem = navigation.children[index].querySelector('button');
  moveNavigationLine(navigationLine, activeNavigationItem, navigation);
  setNavigationLine(tabNavigation);

  // Center navigation item
  const navigationActiveItem = navigation.querySelector('.active');

  if (navigation && navigationActiveItem) {
    const { clientWidth: itemWidth, offsetLeft } = navigationActiveItem;
    // Calculate the scroll position to center the active item
    const scrollPosition = offsetLeft - (navigation.clientWidth - itemWidth) / 2;
    navigation.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }

  // Update description position
  const descriptionWidth = descriptions.offsetWidth;

  descriptions.scrollTo({
    left: descriptionWidth * index,
    behavior: 'smooth',
  });
};

const scrollObserverFunction = (elements, entry) => {
  // in case the block has a featured item, scroll to it
  const featuredItem = [...elements].find((el) => el.classList.contains('featured'));
  const targetElement = featuredItem || entry.target;
  let idx = 0;

  elements.forEach((el, index) => {
    if (el === targetElement && entry.intersectionRatio >= 0.9) {
      if (featuredItem) {
        idx = index;
      }
      updateActiveItem(index);
    }
  });

  if (featuredItem) {
    featuredItem.classList.remove('featured');
    setCarouselPosition(targetElement.parentNode, idx);
  }
};

const arrowFragment = document.createRange().createContextualFragment(`<li>
  <button aria-label="${getTextLabel('Previous')}">
    <span class="icon icon-arrow-left" />
  </button>
</li>
<li>
  <button aria-label="${getTextLabel('Next')}">
    <span class="icon icon-arrow-right" />
  </button>
</li>`);

export default async function decorate(block) {
  const descriptionContainer = block.querySelector(':scope > div');
  descriptionContainer.classList.add(`${blockName}__description-container`);

  const tabItems = block.querySelectorAll(':scope > div > div');

  const imagesWrapper = createElement('div', { classes: `${blockName}__slider-wrapper` });
  const imagesContainer = createElement('div', { classes: `${blockName}__images-container` });
  descriptionContainer.parentNode.prepend(imagesWrapper);
  imagesWrapper.appendChild(imagesContainer);

  const tabNavigation = buildTabNavigation(tabItems, (index) => {
    setCarouselPosition(imagesContainer, index);
  });

  // Arrows
  createArrowControls(imagesContainer, `.${blockName}__image-item.active`, [`${blockName}__arrow-controls`], arrowFragment);
  let arrowControls = imagesContainer.querySelector(`.${blockName}__arrow-controls`);

  if (!arrowControls && imagesContainer.parentElement) {
    // arrowControls = imagesContainer.parentElement.querySelector(`.${blockName}__arrow-controls`);
    const arrowControlsContainer = imagesContainer.parentElement?.querySelector(`.${blockName}__arrow-controls`);
    if (arrowControlsContainer) {
      arrowControls = arrowControlsContainer;
    }
  }
  if (arrowControls) {
    // move arrows to the end of the images container
    imagesWrapper.append(arrowControls);
  } else {
    console.warn('%cArrow controls not found. %cplease refresh the page', 'color:red', 'color:default', { arrowControls, imagesContainer });
  }

  descriptionContainer.parentNode.append(tabNavigation);

  tabItems.forEach((tabItem) => {
    tabItem.classList.add(`${blockName}__desc-item`);
    const tabContent = tabItem.querySelector(tabContentClass);

    const headings = tabContent ? tabContent.querySelectorAll('h1, h2, h3, h4, h5, h6') : [];
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

    // create div for image and append inside image div container
    const picture = tabItem.querySelector('picture');
    // adds the featured class only to the first featured item even if there are more than one
    const tabFeatured = tabContent.dataset.truckCarouselFeatured;
    const hasImageFeatured = imagesContainer.querySelector('.featured');
    const imageItem = createElement('div', {
      classes: [`${blockName}__image-item`, ...(tabFeatured && !hasImageFeatured ? ['featured'] : [])],
    });

    imageItem.appendChild(picture);
    imagesContainer.appendChild(imageItem);

    // remove empty tags
    tabContent.querySelectorAll('p, div').forEach((item) => {
      stripEmptyTags(tabContent, item);
    });

    const descriptions = tabContent.querySelectorAll('p:not(.button-container)');
    [...descriptions].forEach((description) => description.classList.add(`${blockName}__description`));

    // Wrap text in container
    const textContainer = createElement('div', { classes: `${blockName}__text` });
    const text = tabContent.querySelector('.default-content-wrapper')?.querySelectorAll(':scope > *:not(.button-container)');
    if (text) {
      const parentTextContainer = text[0].parentNode;
      textContainer.append(...text);
      parentTextContainer.appendChild(textContainer);
    }

    // Wrap links in container
    const buttonContainer = createElement('div', { classes: `${blockName}__buttons-container` });
    const buttons = tabContent.querySelectorAll('.button-container');

    if (buttons.length) {
      const parentButtonContainer = buttons[0].parentNode;
      buttonContainer.append(...buttons);
      parentButtonContainer.appendChild(buttonContainer);
    }
  });

  // update the button indicator on scroll
  const elements = imagesContainer.querySelectorAll(':scope > *');
  listenScroll(imagesContainer, elements, scrollObserverFunction, 0.9);

  // Update text position + navigation line when page is resized
  window.addEventListener('resize', () => {
    const activeItem = imagesContainer.querySelector(`.${blockName}__image-item.active`);
    if (!activeItem || !activeItem.parentNode) {
      return;
    }

    const index = [...activeItem.parentNode.children].indexOf(activeItem);
    updateActiveItem(index);
    setTimeout(() => {
      setNavigationLine(tabNavigation);
    }, 100);
  });

  decorateIcons(block);
}
