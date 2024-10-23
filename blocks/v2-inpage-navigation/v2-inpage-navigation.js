import { getMetadata } from '../../scripts/aem.js';
import {
  createElement,
  debounce,
  decorateIcons,
} from '../../scripts/common.js';

const blockName = 'v2-inpage-navigation';

const scrollToSection = (id) => {
  let timeout;

  const container = document.querySelector(`main .section[data-inpageid='${id}']`);
  container?.scrollIntoView({ behavior: 'smooth' });

  // Checking if the height of the main element changes while scrolling (caused by layout shift)
  const main = document.querySelector('main');
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(timeout);
    container?.scrollIntoView({ behavior: 'smooth' });

    timeout = setTimeout(() => {
      resizeObserver.disconnect();
    }, 500);
  });
  resizeObserver.observe(main);
};

const inpageNavigationButton = () => {
  // if we have a button title & button link
  if (getMetadata('inpage-button') && getMetadata('inpage-link')) {
    const titleMobile = getMetadata('inpage-button');
    const url = getMetadata('inpage-link');
    const link = createElement('a', {
      classes: ['button', 'button--large', 'button--red', `${blockName}__cta`],
      props: {
        href: url,
        title: titleMobile,
      },
    });
    const mobileText = createElement('span', { classes: `${blockName}__cta--mobile` });
    mobileText.textContent = titleMobile;
    link.appendChild(mobileText);

    const titleDesktop = getMetadata('inpage-button-large');
    if (titleDesktop) {
      const desktopText = createElement('span', { classes: `${blockName}__cta--desktop` });
      desktopText.textContent = titleDesktop;
      link.setAttribute('title', titleDesktop);
      link.appendChild(desktopText);
    }

    return link;
  }

  return null;
};

// Retrieve an array of sections with its corresponding intersectionRatio
const wrapSectionItems = (elements) => {
  const elementsData = [];
  const viewportHeight = window.innerHeight;
  elements.forEach((item) => {
    const elementRect = item.getBoundingClientRect();

    // Calculate the vertical space occupied by the element within the viewport
    const verticalSpace = Math.min(elementRect.bottom, viewportHeight)
      - Math.max(elementRect.top, 0);

    // Calculate the ratio of vertical space to the viewport height
    const spaceRatio = verticalSpace / viewportHeight;

    elementsData.push({
      element: item,
      intersectionRatio: Math.max(0, Math.min(1, spaceRatio)),
    });
  });

  return elementsData;
};

const gotoSection = (event) => {
  const { target } = event;
  const button = target.closest('button');

  if (button) {
    const { id } = button.dataset;

    scrollToSection(id);
  }
};

const updateActive = (id) => {
  const activeItemInList = document.querySelector(`.${blockName}__item--active`);

  // Prevent reassign active value
  if (activeItemInList?.firstElementChild?.dataset.id === id) return;

  // Remove focus position
  document.activeElement.blur();

  // check active id is equal to id don't do anything
  const selectedItem = document.querySelector(`.${blockName}__selected-item`);
  activeItemInList?.classList.remove(`${blockName}__item--active`);
  const itemsButton = document.querySelectorAll(`.${blockName}__items button`);
  const { pathname } = window.location;

  if (id) {
    const selectedButton = [...itemsButton].find((button) => button.dataset.id === id);
    if (!selectedButton) return;
    selectedItem.textContent = selectedButton.textContent;
    selectedButton.parentNode.classList.add(`${blockName}__item--active`);

    window.history.replaceState({}, '', `${pathname}#${id}`);
  } else {
    window.history.replaceState({}, '', `${pathname}`);
  }
};

export default async function decorate(block) {
  const ctaButton = inpageNavigationButton();

  const wrapper = block.querySelector(':scope > div');
  wrapper.classList.add(`${blockName}__wrapper`);
  const itemsWrapper = block.querySelector(':scope > div > div > p');

  const dropdownWrapper = createElement('div', { classes: `${blockName}__dropdown` });
  const selectedItemWrapper = createElement('div', { classes: `${blockName}__selected-item-wrapper` });
  const selectedItem = createElement('div', { classes: `${blockName}__selected-item` });

  const list = createElement('ul', { classes: `${blockName}__items` });

  [...itemsWrapper.children].forEach((item, index) => {
    const classes = [`${blockName}__item`];
    if (index === 0) { // Default selected item
      classes.push(`${blockName}__item--active`);
      selectedItem.textContent = item.textContent;
    }
    const listItem = createElement('li', { classes });

    listItem.innerHTML = item.outerHTML;
    list.appendChild(listItem);
  });

  const dropdownArrowIcon = createElement('span', { classes: [`${blockName}__icon`, 'icon', 'icon-dropdown-caret'] });
  selectedItemWrapper.append(selectedItem);
  selectedItemWrapper.appendChild(dropdownArrowIcon);

  dropdownWrapper.append(selectedItemWrapper);
  dropdownWrapper.append(list);
  wrapper.append(dropdownWrapper);

  itemsWrapper.remove();

  if (ctaButton) {
    wrapper.appendChild(ctaButton);
  }

  list.addEventListener('click', gotoSection);

  // on load Go to section if defined
  const hash = window.location.hash.substring(1);
  if (hash) {
    updateActive(hash);

    setTimeout(() => {
      scrollToSection(hash);
    }, 1000);
  }

  // Listener to toggle the dropdown (open / close)
  document.addEventListener('click', (e) => {
    if (e.target.closest(`.${blockName}__selected-item-wrapper`)) {
      dropdownWrapper.classList.toggle(`${blockName}__dropdown--open`);
    } else {
      dropdownWrapper.classList.remove(`${blockName}__dropdown--open`);
    }
  });

  const sectionsList = document.querySelectorAll('main .section');
  // listen scroll to change the url + navigation item
  window.addEventListener('scroll', debounce(() => {
    // Calculate intersectionRatio from all section items
    const elementsData = wrapSectionItems(sectionsList);

    // Get intersected item that occupies most of the space in the viewport
    const intersectedItem = elementsData.reduce((prev, current) => (
      prev.intersectionRatio > current.intersectionRatio ? prev : current
    ));

    if (intersectedItem.element.dataset?.inpageid) {
      updateActive(intersectedItem.element.dataset.inpageid);
    } else {
      updateActive();
    }

    // detecting if the element inpage nav sticks to navigation
    const navHeight = Number.parseInt(getComputedStyle(block).getPropertyValue('--nav-height'), 10);
    const isStuck = block.getBoundingClientRect().top <= navHeight;
    block.classList[isStuck ? 'add' : 'remove']('v2-inpage-navigation--stuck');
  }));

  decorateIcons(block);
}
