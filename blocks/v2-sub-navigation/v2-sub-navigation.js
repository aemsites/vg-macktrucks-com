import {
  createElement,
  decorateIcons,
} from '../../scripts/common.js';
import {
  getMetadata,
} from '../../scripts/aem.js';

const blockName = 'v2-sub-navigation';

/**
 * Toggles the dropdown menu.
 * @param {HTMLElement} dropdownWrapper - The wrapper element of the dropdown.
 * @returns {Function} Event handler function.
 */
const toggleDropdown = (dropdownWrapper) => (e) => {
  if (e.target.closest(`.${blockName}__active-item-wrapper`)) {
    dropdownWrapper.classList.toggle(`${blockName}__dropdown--open`);
  } else {
    dropdownWrapper.classList.remove(`${blockName}__dropdown--open`);
  }
};

/**
 * Fetches the sub-navigation HTML content.
 * @param {string} content - The content path.
 * @returns {Promise<DocumentFragment>} The fetched HTML content as a DocumentFragment.
 */
const fetchSubNavHtml = async (content) => {
  const response = await fetch(`${content}.plain.html`);
  if (!response.ok) throw new Error('Failed to fetch sub-navigation content');
  return document.createRange().createContextualFragment(await response.text());
};

/**
 * Sets up navigation items with appropriate classes.
 * @param {HTMLElement} list - The list element containing the navigation items.
 * @returns {NodeList} The list of navigation items.
 */
const setupNavItems = (list) => {
  const items = list.querySelectorAll('li');

  items.forEach((item) => {
    item.className = `${blockName}__item`;
  });

  return items;
};

/**
 * Creates a wrapper for the active navigation item.
 * @param {HTMLElement} activeItem - The active item element.
 * @returns {HTMLElement} The created wrapper element.
 */
const createActiveItemWrapper = (activeItem) => {
  const activeItemWrapper = createElement('div', { classes: `${blockName}__active-item-wrapper` });
  const dropdownIcon = createElement('span', { classes: [`${blockName}__icon`, 'icon', 'icon-dropdown-caret'] });
  activeItemWrapper.append(activeItem, dropdownIcon);
  return activeItemWrapper;
};

/**
 * Creates a dropdown container element.
 * @param {HTMLElement} activeItem - The active item element.
 * @param {HTMLElement} list - The list element containing the navigation items.
 * @returns {HTMLElement} The created dropdown container element.
 */
const createDropdownContainer = (activeItem, list) => {
  const container = createElement('div', { classes: `${blockName}__dropdown` });
  container.append(createActiveItemWrapper(activeItem), list);
  return container;
};

/**
 * Extracts anchor attributes from the given fragment.
 * @param {DocumentFragment} fragment - The HTML fragment.
 * @returns {Object|null} The extracted anchor attributes or null if not found.
 */
const extractAnchorAttributes = (fragment) => {
  const [mobileAnchor, desktopAnchor] = [...fragment.querySelectorAll('p a')];

  return mobileAnchor && desktopAnchor ? {
    mobileAnchorText: mobileAnchor.textContent,
    desktopAnchorText: desktopAnchor.textContent,
    anchorHref: mobileAnchor.href || desktopAnchor.href,
    anchorTitle: desktopAnchor.title,
  } : null;
};

/**
 * Creates a navigation anchor element.
 * @param {Object} anchorsAttributes - The attributes for the anchor.
 * @returns {HTMLElement} The created anchor element.
 */
const createSubNavAnchor = (anchorsAttributes) => {
  const anchor = createElement('a', {
    classes: ['button', 'button--large', 'button--red', `${blockName}__cta`],
    props: { href: anchorsAttributes.anchorHref, title: anchorsAttributes.anchorTitle },
  });

  const mobileSpan = createElement('span', { classes: [`${blockName}__cta--mobile`] });
  const desktopSpan = createElement('span', { classes: [`${blockName}__cta--desktop`] });

  mobileSpan.textContent = anchorsAttributes.mobileAnchorText;
  desktopSpan.textContent = anchorsAttributes.desktopAnchorText;

  anchor.append(mobileSpan, desktopSpan);

  return anchor;
};

/**
 * Finds and sets the active item based on the current URL.
 * If no item's href matches the current URL, sets the first item's anchor as active.
 * @param {NodeList} items - The list of navigation items.
 * @param {string} className - The class name to set on the active item.
 * @returns {string|null} The text content of the active item
 * or the text content of the first anchor if no match is found.
 */
const findAndSetActiveItem = (items, className) => {
  const currentUrl = window.location.href;
  let firstAnchor = null;

  for (const item of items) {
    const anchor = item.querySelector('a');
    if (anchor) {
      const anchorHref = new URL(anchor.getAttribute('href'), window.location.origin).href;

      if (!firstAnchor) {
        firstAnchor = anchor;
      }

      if (anchorHref === currentUrl) {
        item.classList.add(className);
        return anchor.textContent;
      }
    }
  }

  if (firstAnchor) {
    firstAnchor.closest('li').classList.add(className);
    return firstAnchor.textContent;
  }

  return null;
};

/**
 * Updates the --v2-sub-navigation-height CSS variable based on the viewport width.
 */
const updateSubNavigationHeight = () => {
  const width = document.documentElement.clientWidth;
  const height = width < 1200 ? '168px' : '218px';
  document.documentElement.style.setProperty('--v2-sub-navigation-height', height);
};

/**
 * Initializes the ResizeObserver to monitor changes in the viewport width
 * and update the --v2-sub-navigation-height CSS variable accordingly.
 */
const initializeResizeObserver = () => {
  const resizeObserver = new ResizeObserver(() => updateSubNavigationHeight());
  resizeObserver.observe(document.documentElement);
  updateSubNavigationHeight();
};

/**
 * Applies custom styles to the block's parent elements.
 * @param {HTMLElement} block - The block element to apply styles to.
 * @param {string} style - The custom style to apply.
 */
const applyCustomStyles = (block, style) => {
  if (style) {
    const twoUp = block.parentElement.parentElement;
    twoUp.classList.add(`${blockName}__custom--${style}`);
  }
};

/**
 * Sets up the sub-navigation block by fetching the sub-navigation HTML,
 * setting up the list and items, and managing the dropdown and picture elements.
 * @param {HTMLElement} block - The block element where the sub-navigation will be appended.
 * @param {string} content - The URL or content to fetch the sub-navigation HTML from.
 * @returns {Promise<void>} - A promise that resolves when the sub-navigation is set up.
 */
const setupSubNavigation = async (block, content) => {
  try {
    const fragment = await fetchSubNavHtml(content);
    const list = fragment.querySelector('ul');
    if (!list) return;

    list.className = `${blockName}__items`;
    const items = setupNavItems(list);
    const activeItem = createElement('div', { classes: `${blockName}__active-item` });
    const activeText = findAndSetActiveItem(items, `${blockName}__item--active`);
    activeItem.textContent = activeText || '';

    const subNavWrapper = createElement('div', { classes: `${blockName}__wrapper` });
    const dropdownWrapper = createDropdownContainer(activeItem, list);
    const anchorsAttributes = extractAnchorAttributes(fragment);
    if (!anchorsAttributes) return;

    const anchor = createSubNavAnchor(anchorsAttributes);
    subNavWrapper.append(dropdownWrapper, anchor);

    const picture = fragment.querySelector('picture');

    if (picture) {
      const subNavImageWrapper = createElement('div', { classes: `${blockName}__image-wrapper` });
      subNavImageWrapper.append(picture);
      block.append(subNavImageWrapper, subNavWrapper);
      initializeResizeObserver();
    } else {
      block.append(subNavWrapper);
    }

    const customStyles = getMetadata('custom-subnav-style');
    applyCustomStyles(block, customStyles);

    document.addEventListener('click', toggleDropdown(dropdownWrapper));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
};

/**
 * Decorates the sub-navigation block.
 * @param {HTMLElement} block - The navigation block element.
 */
const decorate = async (block) => {
  const metaContent = document.head.querySelector('meta[name="v2-sub-navigation"]');

  if (metaContent) {
    await setupSubNavigation(block, metaContent.content);
    decorateIcons(block);
  }
};

export default decorate;
