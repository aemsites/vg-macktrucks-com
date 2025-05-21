import { createElement, decorateIcons, decorateBlackLabel, generateId, getTextLabel, HEADER_CONFIGS, getLanguagePath } from '../../scripts/common.js';
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import { getAllElWithChildren } from '../../scripts/scripts.js';

// check if the header has to have a login and/or a search button
const { SEARCH_DISABLED = '', LOGIN_DISABLED = '' } = HEADER_CONFIGS;

const blockName = 'header';

const desktopMQ = window.matchMedia('(min-width: 1200px)');
const tabsVariants = {
  TAB_WITH_CARDS: 'tabs-with-cards',
  TAB: 'tabs',
  FEATURED_CARD: 'featured-card',
  FEATURED_CARD_DOUBLE: 'featured-card-double',
};
const DESKTOP_MEDIA_QUERY = '(min-width: 1200px)';
const LARGE_IMAGE_WIDTHS = {
  '2x': 1368,
  '1x': 684,
};
const STANDARD_IMAGE_WIDTHS = {
  '2x': 580,
  '1x': 290,
};

const setTabIndexForLinks = (el, tabIndexValue) => {
  try {
    if (!el) {
      throw new Error('No element provided to setTabIndexForLinks.');
    }

    const links = el.querySelectorAll('a, button');

    if (!links.length) {
      console.warn('No links or buttons found in the provided element:', el);
      return;
    }

    links.forEach((link) => {
      if (link && typeof link.setAttribute === 'function') {
        link.setAttribute('tabindex', tabIndexValue);
      } else {
        console.warn('Skipped an invalid link element:', link);
      }
    });
  } catch (error) {
    console.error('setTabIndexForLinks encountered an error:', error, '\nElement passed in:', el);
  }
};

const createLogo = (logoWrapper) => {
  const logoImage = logoWrapper.querySelector('span.icon');

  if (!logoImage) {
    return createElement('div');
  }

  const logoLink = logoImage.parentElement.tagName === 'A' ? logoImage.parentElement : null;

  logoImage.classList.add(`${blockName}__logo-image`);
  logoImage.setAttribute('aria-hidden', 'true');
  (logoLink || logoImage).classList.add(`${blockName}__logo-image-wrapper`);

  if (logoLink) {
    const logoLinkTextContainer = createElement('span', { classes: ['screenreader'] });
    const logoLinkText = getTextLabel('Logo link');
    logoLinkTextContainer.append(logoLinkText);

    logoLink.append(logoLinkTextContainer);
  }

  return logoLink || logoImage;
};

const createMainLinks = (mainLinksWrapper) => {
  const list = mainLinksWrapper.querySelector('ul');
  if (list) {
    list.setAttribute('id', 'header-main-nav');
    list.classList.add(`${blockName}__main-nav`);
    list.querySelectorAll('li').forEach((listItem) => {
      const accordionContainer = document.createRange().createContextualFragment(`
        <div class="${blockName}__accordion-container ${blockName}__main-link-wrapper">
          <div class="${blockName}__accordion-content-wrapper">
          </div>
          <div class="desktop-wrapper"></div>
          <div class="desktop-wrapper-footer"></div>
        </div>
      `);

      listItem.classList.add(`${blockName}__main-nav-item`);
      listItem.append(accordionContainer);

      const mainNavLink = listItem.querySelector('a');
      mainNavLink.setAttribute('id', generateId('main-nav'));
    });
    list.querySelectorAll('li > a').forEach((link) => {
      link.classList.add(`${blockName}__main-nav-link`, `${blockName}__link`, `${blockName}__link-accordion`);
    });

    const closeMenuLabel = getTextLabel('Close menu');
    const closeIcon = document.createRange().createContextualFragment(`
      <li class="${blockName}__action-item ${blockName}__action-item--close-menu">
        <button
          aria-label="${closeMenuLabel}"
          class="${blockName}__close-menu"
          aria-expanded="false"
          aria-controls="header-main-nav, header-actions-list"
        >
          <span class="icon icon-close" />
        </button>
      </li>
    `);

    list.prepend(closeIcon);

    return list;
  }
  return null;
};

const createActions = (actionsWrapper) => {
  const list = actionsWrapper.querySelector('ul');

  if (!list) {
    return createElement('div');
  }

  list.setAttribute('id', 'header-actions-list');
  list.classList.add(`${blockName}__actions-list`);
  list.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.add(`${blockName}__action-item`);
  });
  list.querySelectorAll('li > a').forEach((link) => {
    link.classList.add(`${blockName}__action-link`, `${blockName}__link`);

    // wrapping text nodes into spans &
    // adding aria labels (because text labels are hidden on mobile)
    [...link.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .forEach((textNode) => {
        const spanWrapper = createElement('span', { classes: [`${blockName}__action-link-text`] });

        textNode.replaceWith(spanWrapper);
        spanWrapper.append(textNode);
        link.setAttribute('aria-label', textNode.textContent);
      });
  });

  return list;
};

const mobileActions = () => {
  const mobileActionsEl = createElement('div', { classes: [`${blockName}__mobile-actions`] });
  const searchLabel = getTextLabel('Search');
  const openMenuLabel = getTextLabel('Open menu');
  const searchResults = `${getLanguagePath()}search`;

  const searchEl = `<a href="${searchResults}" aria-label="${searchLabel}" class="${blockName}__search-button ${blockName}__action-link ${blockName}__link">
    <span class="icon icon-search" aria-hidden="true"></span>
  </a>`;

  const actions = document.createRange().createContextualFragment(`
    ${SEARCH_DISABLED?.toLowerCase() === 'true' ? '' : searchEl}
    <button
      aria-label="${openMenuLabel}"
      class="${blockName}__hamburger-menu ${blockName}__action-link ${blockName}__link"
      aria-expanded="false"
      aria-controls="header-main-nav, header-actions-list"
    >
      <span class="icon icon-hamburger" aria-hidden="true"></span>
    </button>
  `);

  mobileActionsEl.append(...actions.childNodes);

  return mobileActionsEl;
};

const rebuildCategoryItem = (item) => {
  item.classList.add(`${blockName}__category-item`);

  [...item.childNodes].forEach((el) => {
    // unwrapping images & links inside paragraphs
    if (el.tagName === 'P' && el.querySelectorAll(':scope > picture, :scope > a').length === 1) {
      el.replaceWith(el.children[0]);
    }

    // second list of links should be rendered as buttons
    if (item.querySelector(':scope > ul:nth-of-type(2)') === el) {
      el.classList.add(`${blockName}__category-item-buttons`);

      [...el.querySelectorAll('a')].forEach((button, index) => {
        if (!index) {
          button.classList.add('button', 'button--small', 'button--primary');
        } else {
          button.classList.add('button', 'button--small', 'button--secondary');
        }
      });
    }
  });

  const firstLink = item.querySelector(':scope > a:first-of-type');

  if (firstLink?.previousElementSibling?.tagName === 'PICTURE') {
    firstLink.classList.add(`${blockName}__link--after-image`);
  }
};

/**
 * Generates an array of responsive image source definitions for use in <picture> elements.
 *
 * @param {{ '2x': number, '1x': number }} widths - Object defining widths for 1x and 2x resolution.
 * @returns {Array<{ media: string, width: number }>} An array of responsive image source definitions.
 */
const getResponsiveSources = (widths) => [
  { media: `${DESKTOP_MEDIA_QUERY} and (min-resolution: 2x)`, width: widths['2x'] },
  { media: DESKTOP_MEDIA_QUERY, width: widths['1x'] },
];

/**
 * Replaces an existing <picture> element with an optimized version using responsive sources.
 *
 * @param {HTMLPictureElement} picture - The original picture element in the DOM.
 * @param {boolean} isInsideFeaturedCard - Whether the picture is part of a featured card (to use large sizes).
 * @returns {void}
 */
const optimiseImage = (picture, isInsideFeaturedCard) => {
  const img = picture.querySelector('img');
  if (!img?.src) {
    return;
  }

  const widths = isInsideFeaturedCard ? LARGE_IMAGE_WIDTHS : STANDARD_IMAGE_WIDTHS;
  const sources = getResponsiveSources(widths);
  const newPicture = createOptimizedPicture(img.src, img.alt, false, sources);
  picture.replaceWith(newPicture);
};

/**
 * Optimizes <picture> elements within the header menu.
 * Applies larger image widths for featured cards and smaller ones for standard menu items.
 *
 * @param {HTMLElement} menu - The menu element to process.
 */
const optimisePicturesInMenu = (menu) => {
  [...menu.querySelectorAll('picture')].forEach((picture, i) => {
    const isFeaturedCard = Boolean(picture.closest('.featured-card'));
    const isDoubleFeaturedCard = Boolean(picture.closest('.featured-card-double'));

    if (isFeaturedCard) {
      // Optimise the first 2 pictures only (main + background) in a single featured card
      optimiseImage(picture, i < 2);
    } else if (isDoubleFeaturedCard) {
      // Optimise the first 4 pictures only (2 cards × 2 images per card) in a double featured card
      optimiseImage(picture, i < 4);
    } else {
      optimiseImage(picture);
    }
  });
};

/* transformMenuData unify HTML that comes from word doc */
const transformMenuData = (data) => {
  // for each tab
  data.forEach((menuData) => {
    const titles = menuData.querySelectorAll('.menu > div > div:first-child > a');

    // unwrapping the titles (.menu > div > div > a => .menu > a)
    titles.forEach((title) => title.parentElement.parentElement.replaceWith(title));

    // changing divs to lists
    const menusContentList = [...menuData.querySelectorAll('.menu')];

    // for each menu tab sub items
    menusContentList.forEach((menuItem) => {
      // for tracks menu only
      if (menuItem.classList.contains(tabsVariants.TAB_WITH_CARDS)) {
        // changing the structure to list
        const item = menuItem.querySelectorAll(':scope > div > div');
        const listEl = createElement('ul');

        item.forEach((mItem) => {
          const listItemEl = createElement('li');
          mItem.parentElement.remove();
          listItemEl.append(...mItem.children);
          listEl.append(listItemEl);
        });

        menuItem.append(listEl);
      } else {
        // for other manu types,
        // unwrap the list:
        // .menu > div > div > ul => .menu > ul
        const listEl = menuItem.querySelector('ul');
        menuItem.children[1].replaceWith(listEl);
      }
    });
  });

  data.forEach(optimisePicturesInMenu);

  const results = document.createRange().createContextualFragment(`
    <div>
      ${data.map((el) => el.outerHTML).join('')}
    </div>
  `);

  return results.children[0];
};

const setTabActive = (tab) => {
  if (!tab) {
    console.warn('No tab element provided to setTabActive.', { tab });
    return;
  }
  const accordionIdElement = tab.closest('[menu-accordion-id]');
  if (!accordionIdElement) {
    console.warn('No accordion Id Element found for the provided tab.', { tab });
    return;
  }
  const targetId = accordionIdElement.getAttribute('menu-accordion-id');
  if (!targetId) {
    console.warn('No targetId found for the provided tab.', { tab });
    return;
  }
  const tabContent = document.querySelector(`#${targetId}`);

  [...tabContent.parentElement.querySelectorAll(`.${blockName}__accordion-container`)].forEach((item) => {
    if (item !== tabContent) {
      item.setAttribute('data-active', 'false');
    }
  });

  tabContent.setAttribute('data-active', 'true');

  // scroll to proper tab content for tabs with cards
  const tabsWithCards = tab.closest(`.${blockName}__main-link-wrapper--tabs-with-cards`);
  if (tabsWithCards) {
    const tabContentId = tab.getAttribute('aria-controls');
    document.querySelector(`#${tabContentId}`).scrollIntoView({ behavior: 'smooth' });
  } else {
    console.warn('No %ctabs with cards %cfound for the provided tab.', 'color:red', 'color:default', { tab });
  }

  // setting the aria-expanded for tabs and link's tab indexes
  const accordionContentWrapper = tab.closest(`.${blockName}__accordion-content-wrapper`);
  const tabLinks = accordionContentWrapper ? [...accordionContentWrapper.querySelectorAll(`.${blockName}__tab-link`)] : [];
  tabLinks.forEach((tabLink) => {
    const tId = tabLink.getAttribute('aria-controls');
    const tContent = document.querySelector(`#${tId}`);

    tabLink.setAttribute('aria-expanded', tabLink === tab ? 'true' : 'false');

    setTabIndexForLinks(tContent, tabLink === tab ? '0' : '-1');
  });
};

const onNavExpandChange = (isExpanded) => {
  // disabling scroll when menu is open
  document.body.classList.toggle('disable-scroll', isExpanded);
  document.querySelector(`.${blockName}.block`).classList.toggle(`${blockName}--expanded`, isExpanded);
};

const onAccordionItemClick = (el) => {
  const elClassList = el.currentTarget.classList;
  const isMainLink = elClassList.contains(`${blockName}__main-nav-link`);
  const isTabLink = elClassList.contains(`${blockName}__tab-link`);
  const isDesktop = desktopMQ.matches;

  if (isDesktop && !isMainLink && !isTabLink) {
    return;
  }

  el.preventDefault();

  const menuEl = el.currentTarget.parentElement;
  menuEl.classList.toggle(`${blockName}__menu-open`);
  const isExpanded = menuEl.classList.contains(`${blockName}__menu-open`);
  el.currentTarget.setAttribute('aria-expanded', isExpanded);

  if (!isDesktop) {
    return;
  }

  if (isMainLink) {
    // closing other open menus
    if (menuEl.classList.contains(`${blockName}__main-nav-item`)) {
      const openMenus = document.querySelectorAll(`.${blockName}__menu-open`);

      [...openMenus]
        .filter((menu) => menu !== menuEl)
        .forEach((menu) => {
          menu.classList.remove(`${blockName}__menu-open`);
          menu.querySelector(':scope > a').setAttribute('aria-expanded', false);
          setTabIndexForLinks(menu, '-1');
        });

      setTabIndexForLinks(menuEl, '0');
    }

    onNavExpandChange(isExpanded);

    // set first tab active
    const firstTabLink = el.target.parentElement.querySelector(`.${blockName}__main-link-wrapper a`);
    setTabActive(firstTabLink);
  }

  if (isTabLink) {
    setTabActive(el.currentTarget);
  }
};

const extractAndCloneFirstListItem = (list, isFeaturedCard) =>
  isFeaturedCard && list.children.length ? list.firstElementChild?.cloneNode(true) : null;

const extractFeaturedCardData = (item) => {
  const pictures = item.querySelectorAll('picture');
  const paragraphs = [...item.querySelectorAll('p')];

  return {
    mainImage: pictures[0] || '',
    backgroundImage: pictures[1] || '',
    title: item.querySelector('h3 a') || '',
    subtitle: paragraphs[2]?.textContent.trim() || '',
    text: paragraphs[3]?.textContent.trim() || '',
    primaryButton: paragraphs[4]?.querySelector('a') || '',
    secondaryButton: paragraphs[5]?.querySelector('a') || '',
    primaryLink: paragraphs[6]?.querySelector('a') || '',
    secondaryLink: paragraphs[7]?.querySelector('a') || '',
  };
};

const generateFeaturedCardHtml = (data) => {
  const { mainImage, backgroundImage, title, subtitle, text, primaryButton, secondaryButton, primaryLink, secondaryLink } = data;
  const titleHref = title?.getAttribute('href')?.trim() || '';
  const titleHtml = title?.outerHTML || '';
  const mainImageHtml = mainImage?.outerHTML || '';
  const backgroundImageHtml = backgroundImage?.outerHTML || '';

  const buttonsHtml = [primaryButton, secondaryButton]
    .filter(Boolean)
    .map(
      (btn, index) =>
        `<a href="${btn.href?.trim()}" class="${blockName}__featured-card-button button ${index === 0 ? 'button--primary' : 'button--secondary'}">
        ${btn.textContent}
      </a>`,
    )
    .join('');

  const linksHtml = [primaryLink, secondaryLink]
    .filter(Boolean)
    .map((link) => link.outerHTML)
    .join('');

  return `
    <div class="${blockName}__featured-card">
      <div class="${blockName}__featured-card-image">
        <a class="${blockName}__featured-card-image-link" href="${titleHref}">
          ${mainImageHtml}
          ${backgroundImageHtml}
        </a>
      </div>
      <div class="${blockName}__featured-card-content">
        ${titleHtml ? `<h3 class="${blockName}__featured-card-title">${titleHtml}</h3>` : ''}
        ${subtitle ? `<h5 class="${blockName}__featured-card-subtitle">${subtitle}</h5>` : ''}
        ${text ? `<p class="${blockName}__featured-card-text">${text}</p>` : ''}
        ${buttonsHtml ? `<div class="${blockName}__featured-card-buttons">${buttonsHtml}</div>` : ''}
        ${linksHtml ? `<div class="${blockName}__featured-card-links">${linksHtml}</div>` : ''}
      </div>
    </div>
  `;
};

/**
 * Injects the menu footer links into the menu that has the class 'inject-menu-footer'
 * @param {Element[]} categories
 * @param {Element} menuFooter
 * @returns {void}
 */
const injectMenuFooter = (categories, menuFooter) => {
  const categoryItems = categories.filter((el) => el.classList.contains('inject-menu-footer'));
  const menuFooterLinks = menuFooter.querySelectorAll('a');
  if (menuFooterLinks.length > 0) {
    categoryItems.forEach((categoryItem) => {
      const list = categoryItem.querySelector(':scope > ul');
      if (list) {
        [...menuFooterLinks].forEach((link) => {
          const li = createElement('li', { classes: [`${blockName}__category-item`, 'mobile-menu-footer'] });
          const a = createElement('a', { classes: [`${blockName}__link`], props: { href: link.href } });
          a.textContent = link.textContent;
          li.append(a);
          list.append(li);
        });
      }
    });
  }
};

/**
 * Builds and returns HTML for one or two featured cards,
 * and removes those cards from the given list to prevent duplication.
 *
 * @param {HTMLUListElement} list - The list containing card <li> elements.
 * @param {boolean} isDoubleFeaturedCard - Whether to extract two cards instead of one.
 * @returns {string} featuredCardsHtml - The resulting HTML markup for the featured cards.
 */
const buildFeaturedCardsHtml = (list, isDoubleFeaturedCard) => {
  if (!list?.children?.length) {
    return '';
  }

  let featuredCardsHtml = '';
  const firstCardItem = list.children[0].cloneNode(true);
  const firstCard = extractFeaturedCardData(firstCardItem);
  featuredCardsHtml += generateFeaturedCardHtml(firstCard);

  if (isDoubleFeaturedCard && list.children[1]) {
    const secondCardItem = list.children[1].cloneNode(true);
    const secondCard = extractFeaturedCardData(secondCardItem);
    featuredCardsHtml += generateFeaturedCardHtml(secondCard);
  }

  if (isDoubleFeaturedCard) {
    featuredCardsHtml = `<div class="${blockName}__featured-card-group">${featuredCardsHtml}</div>`;
  }

  return featuredCardsHtml;
};

/**
 * Builds the menu content for the Mega-menu
 * @param {Element[]} menuData
 * @param {Element} navEl
 * @returns {void}
 */
const buildMenuContent = (menuData, navEl) => {
  const menus = transformMenuData(menuData);
  const navLinks = [...navEl.querySelectorAll(`.${blockName}__main-nav-link`)];

  [...menus.children].forEach((menuItemData) => {
    const tabName = menuItemData.querySelector(':scope > p > a');
    if (!tabName) {
      return;
    }

    const categories = [...menuItemData.querySelectorAll(':scope > div')];
    const navLink = navLinks.find((el) => el.textContent.trim() === tabName.textContent.trim());
    const accordionContentWrapper = navLink?.closest(`.${blockName}__main-nav-item`).querySelector(`.${blockName}__accordion-content-wrapper`);
    // add the menu footer to the Mega-menu
    const menuFooter = categories.find((el) => el.classList.contains('menu-footer'));

    if (menuFooter) {
      [...menuFooter.querySelectorAll('a')].forEach((link, index) => {
        const classes = index ? ['standalone-link'] : ['button', 'button--primary', 'button--small'];
        link.classList.add(...classes);
      });

      navLink.parentElement.querySelector('.desktop-wrapper-footer').append(menuFooter);

      injectMenuFooter(categories, menuFooter);
    }

    categories
      .filter((cat) => cat.classList.contains('menu'))
      .forEach((cat) => {
        const title = cat.querySelector(':scope > a');
        const list = cat.querySelector(':scope > ul');
        const accordionParentClassList = accordionContentWrapper.parentElement.classList;
        let extraClass = '';
        const isFeaturedCard = cat.classList.contains(tabsVariants.FEATURED_CARD) || cat.classList.contains(tabsVariants.FEATURED_CARD_DOUBLE);
        const isDoubleFeaturedCard = cat.classList.contains(tabsVariants.FEATURED_CARD_DOUBLE);

        title?.classList.add(`${blockName}__link`, `${blockName}__link-accordion`, `${blockName}__menu-heading`);
        title?.removeAttribute('href');

        if (isFeaturedCard) {
          accordionParentClassList.add(tabsVariants.FEATURED_CARD);
        }

        if (isDoubleFeaturedCard) {
          accordionParentClassList.add(tabsVariants.FEATURED_CARD_DOUBLE);
        }

        if (cat.classList.contains(tabsVariants.TAB_WITH_CARDS) || cat.classList.contains(tabsVariants.TAB)) {
          title?.classList.add(`${blockName}__tab-link`);
        }

        if (cat.classList.contains(tabsVariants.TAB_WITH_CARDS)) {
          extraClass = `${blockName}__main-link-wrapper--${tabsVariants.TAB_WITH_CARDS}`;
        }

        if (cat.classList.contains(tabsVariants.TAB)) {
          extraClass = `${blockName}__main-link-wrapper--${tabsVariants.TAB}`;
        }

        const featuredCardsHtml = isFeaturedCard ? buildFeaturedCardsHtml(list, isDoubleFeaturedCard) : '';

        list.classList.add(`${blockName}__category-items`);
        [...list.querySelectorAll('li')].forEach(rebuildCategoryItem);
        [...list.querySelectorAll('a')].forEach((el) => el.classList.add(`${blockName}__link`));
        [...list.querySelectorAll('li > a:not(.button):not(:only-child)')].forEach((el) => el.classList.add('standalone-link'));

        let menuContent;

        if (!title) {
          menuContent = document.createRange().createContextualFragment(`
            <div class="${blockName}__menu-content">
              ${list.outerHTML}
            </div>
          `);
        } else {
          menuContent = document.createRange().createContextualFragment(`
            <div class="${blockName}__menu-content">
              ${title.outerHTML}
              <div class="${blockName}__category-content ${blockName}__accordion-container">
                <div class="${blockName}__accordion-content-wrapper">
                  ${isFeaturedCard && featuredCardsHtml ? featuredCardsHtml : ''}
                  ${list.outerHTML}
                </div>
              </div>
            </div>
          `);
        }

        menuContent.querySelector(`.${blockName}__link-accordion`)?.addEventListener('click', onAccordionItemClick);
        accordionContentWrapper.append(menuContent);
        if (extraClass) {
          accordionParentClassList.add(extraClass);
        }
      });

    navLink?.addEventListener('click', onAccordionItemClick);
  });
};

const decorateCTA = (wrapper) => {
  const anchorTags = wrapper.querySelectorAll('a');
  anchorTags.forEach((link) => {
    link.classList.add(`${blockName}__custom-button`, 'button', 'button--primary');
    wrapper.appendChild(link);
  });
  wrapper.firstElementChild.remove();
  return wrapper;
};

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // clear the block
  block.textContent = '';

  // fetch nav content
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  let navPath = `${langCodeMatch ? langCodeMatch[1] : '/'}nav`;

  const isCustomHeader = getMetadata('custom-header');
  const isMobileMenuDisabled = getMetadata('custom-header-mobile-menu').toLowerCase() === 'false';
  if (isCustomHeader) {
    navPath = `${langCodeMatch ? langCodeMatch[1] : ''}${isCustomHeader}`;
    block.classList.add(`${blockName}__custom`);

    const customStyles = getMetadata('custom-header-style');
    if (customStyles) {
      block.classList.add(`${blockName}__custom--${customStyles}`);
    }
  }

  const testHeader = getMetadata('test-header');
  if (testHeader) {
    navPath = testHeader;
  }

  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    console.error(`Header is not loaded: ${resp.status}`);
  }

  // get the navigation text, turn it into html elements
  const content = document.createRange().createContextualFragment(await resp.text());

  const [logoContainer, navigationContainer, actionsContainer, ...menuContent] = content.children;
  const nav = createElement('nav', { classes: [`${blockName}__nav`] });
  const navContent = document.createRange().createContextualFragment(`
    <div class="${blockName}__menu-overlay"></div>
    ${createLogo(logoContainer).outerHTML}
    ${
      navigationContainer.children.length
        ? `<div class="${blockName}__main-links">
      ${createMainLinks(navigationContainer).outerHTML}
    </div>`
        : ''
    }
    <div class="${blockName}__actions">
      ${isMobileMenuDisabled ? '' : mobileActions().outerHTML}
      ${isMobileMenuDisabled ? decorateCTA(actionsContainer).outerHTML : createActions(actionsContainer).outerHTML}
    </div>
  `);

  const setAriaForMenu = (isMenuVisible) => {
    nav.querySelectorAll(`.${blockName}__close-menu, .${blockName}__hamburger-menu`).forEach((control) => {
      control.setAttribute('aria-expanded', isMenuVisible);

      document.querySelectorAll(`.${blockName}__main-nav-link`).forEach((el) => {
        el.setAttribute('tabindex', isMenuVisible ? '0' : '-1');
      });

      document.querySelectorAll(`.${blockName}__action-item`).forEach((el) => {
        setTabIndexForLinks(el, isMenuVisible ? '0' : '-1');
      });

      if (isMenuVisible) {
        document.querySelector(`.${blockName}__close-menu`)?.focus();
      }
    });
    nav.querySelectorAll('#header-main-nav, #header-actions-list').forEach((item) => {
      item.setAttribute('aria-hidden', !isMenuVisible);
    });
  };

  const initAriaForAccordions = () => {
    const menuPrefix = 'menu-accordion';
    const accordionContainers = block.querySelectorAll(`.${blockName}__link-accordion ~ .${blockName}__accordion-container`);

    [...accordionContainers].forEach((container) => {
      const id = generateId(menuPrefix);
      const accordionLink = container.parentElement.querySelector(`.${blockName}__link-accordion`);

      container.setAttribute('id', id);
      accordionLink.setAttribute('aria-controls', id);
      accordionLink.setAttribute('aria-expanded', false);
      accordionLink.parentElement.setAttribute('menu-accordion-id', id);
    });
  };

  const closeHamburgerMenu = () => {
    block.classList.remove(`${blockName}--hamburger-open`);
    onNavExpandChange(false);

    block.querySelectorAll(`.${blockName}__menu-open`).forEach((el) => {
      el.classList.remove(`${blockName}__menu-open`);
      el.setAttribute('aria-expanded', 'false');
    });

    setAriaForMenu(false);
  };

  // add actions for search
  if (SEARCH_DISABLED.toLowerCase() === 'false') {
    navContent.querySelector(`.${blockName}__search-button`)?.addEventListener('click', () => {
      window.location.href = '/search';
    });
  }

  // add action for hamburger
  navContent.querySelector(`.${blockName}__hamburger-menu`)?.addEventListener('click', () => {
    block.classList.add(`${blockName}--hamburger-open`);
    onNavExpandChange(true);
    setAriaForMenu(true);
  });

  navContent.querySelectorAll(`.${blockName}__menu-overlay, .${blockName}__close-menu`).forEach((el) => {
    el.addEventListener('click', closeHamburgerMenu);
  });

  // hiding the hamburger menu when switch to desktop
  desktopMQ.addEventListener('change', closeHamburgerMenu);

  nav.append(navContent);
  block.append(nav);

  setAriaForMenu(false);
  if (menuContent) {
    buildMenuContent(menuContent, nav);
  }
  initAriaForAccordions();

  // hiding nav when clicking outside the menu
  document.addEventListener('click', (event) => {
    const isTargetOutsideMenu = !event.target.closest(`.${blockName}__main-nav`) && !event.target.closest(`.${blockName}__actions`);
    const openMenu = block.querySelector(`.${blockName}__main-nav-item.${blockName}__menu-open`);

    if (isTargetOutsideMenu && openMenu) {
      openMenu.classList.remove(`${blockName}__menu-open`);
      openMenu.setAttribute('aria-expanded', false);
      onNavExpandChange(false);
    }
  });

  const swapMenuMountPoint = (isDesktop) => {
    const selector = `
      .${blockName}__main-link-wrapper--tabs-with-cards .${blockName}__category-content.${blockName}__accordion-container,
      .${blockName}__main-link-wrapper--tabs .${blockName}__category-content.${blockName}__accordion-container
    `;
    const menus = [...document.querySelectorAll(selector)];

    if (isDesktop) {
      menus.forEach((item) => {
        const desktopMountPoint = item.closest(`.${blockName}__main-link-wrapper`).querySelector('.desktop-wrapper');

        desktopMountPoint.append(item);
      });
    } else {
      menus.forEach((item) => {
        const mobileMountPoints = [...item.closest(`.${blockName}__main-link-wrapper`).querySelectorAll(`.${blockName}__menu-content`)];
        const mountPoint = mobileMountPoints.find((el) => el.getAttribute('menu-accordion-id') === item.getAttribute('id'));

        mountPoint.append(item);
      });
    }
  };

  const swapActionsLinks = (isDesktop) => {
    const actionsLinksList = document.querySelector(`#${blockName}-actions-list`) || createElement('div');
    const actionsLinksDesktopMountPoint = document.querySelector(`.${blockName}__actions`);
    const headerMainNav = document.querySelector(`.${blockName}__main-links`); // mobile actions links mount point
    const buttonsWithoutIcons = getAllElWithChildren([...actionsLinksList.querySelectorAll('a')], '.icon', true);
    const loginLink = actionsLinksList.querySelector(`.${blockName}__action-item a[href*="login"]`);

    if (loginLink && LOGIN_DISABLED.toLowerCase() === 'true') {
      loginLink.remove();
    }

    if (isDesktop) {
      actionsLinksDesktopMountPoint.append(actionsLinksList);
      buttonsWithoutIcons.forEach((el) => el.classList.add('button', 'button--primary'));
    } else {
      headerMainNav.append(actionsLinksList);
      buttonsWithoutIcons.forEach((el) => el.classList.remove('button', 'button--primary'));
    }
  };

  const setupAriaAndTabIndexes = (isDesktop) => {
    if (!isDesktop) {
      const mainLinksEl = block.querySelector(`.${blockName}__main-links`);
      const actionsEl = block.querySelector(`.${blockName}__actions-list`);

      if (mainLinksEl) {
        setTabIndexForLinks(mainLinksEl, '-1');
      }

      if (actionsEl) {
        setTabIndexForLinks(actionsEl, '-1');
      }

      [...mainLinksEl.querySelectorAll('[aria-expanded="true"]')].forEach((el) => {
        el.setAttribute('aria-expanded', 'false');
      });
    } else {
      const mainNav = block.querySelector(`.${blockName}__main-nav`);

      if (mainNav) {
        setTabIndexForLinks(mainNav);
      }
    }
  };

  if (!isMobileMenuDisabled) {
    desktopMQ.addEventListener('change', (e) => {
      const isDesktop = e.matches;

      setupAriaAndTabIndexes(isDesktop);
      swapMenuMountPoint(isDesktop);
      swapActionsLinks(isDesktop);
    });

    setupAriaAndTabIndexes(desktopMQ.matches);
    swapMenuMountPoint(desktopMQ.matches);
    swapActionsLinks(desktopMQ.matches);
  }
  decorateIcons(block);
  decorateBlackLabel(block);
}
