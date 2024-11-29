import {
  createElement,
  decorateIcons,
  generateId,
  getTextLabel,
  HEADER_CONFIGS,

  getLanguagePath,
} from '../../scripts/common.js';
import {
  createOptimizedPicture,
  getMetadata,
} from '../../scripts/aem.js';
import { getAllElWithChildren } from '../../scripts/scripts.js';

// check if the header has to have a login and/or a search button
const { SEARCH_DISABLED, LOGIN_DISABLED } = HEADER_CONFIGS;

const blockClass = 'header';

const desktopMQ = window.matchMedia('(min-width: 1200px)');
const tabsVariants = {
  TAB_WITH_CARDS: 'tabs-with-cards',
  TAB: 'tabs',
};

const setTabIndexForLinks = (el, tabIndexValue) => {
  [...el.querySelectorAll('a, button')].forEach((link) => {
    link.setAttribute('tabindex', tabIndexValue);
  });
};

const createLogo = (logoWrapper) => {
  const logoImage = logoWrapper.querySelector('span.icon');
  const logoLink = logoImage.parentElement.tagName === 'A' ? logoImage.parentElement : null;

  logoImage.classList.add(`${blockClass}__logo-image`);
  logoImage.setAttribute('aria-hidden', 'true');
  (logoLink || logoImage).classList.add(`${blockClass}__logo-image-wrapper`);

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
    list.classList.add(`${blockClass}__main-nav`);
    list.querySelectorAll('li').forEach((listItem) => {
      const accordionContainer = document.createRange().createContextualFragment(`
        <div class="${blockClass}__accordion-container ${blockClass}__main-link-wrapper">
          <div class="${blockClass}__accordion-content-wrapper">
          </div>
          <div class="desktop-wrapper"></div>
          <div class="desktop-wrapper-footer"></div>
        </div>
      `);

      listItem.classList.add(`${blockClass}__main-nav-item`);
      listItem.append(accordionContainer);

      const mainNavLink = listItem.querySelector('a');
      mainNavLink.setAttribute('id', generateId('main-nav'));
    });
    list.querySelectorAll('li > a').forEach((link) => {
      link.classList.add(`${blockClass}__main-nav-link`, `${blockClass}__link`, `${blockClass}__link-accordion`);
    });

    const closeMenuLabel = getTextLabel('Close menu');
    const closeIcon = document.createRange().createContextualFragment(`
      <li class="${blockClass}__action-item ${blockClass}__action-item--close-menu">
        <button
          aria-label="${closeMenuLabel}"
          class="${blockClass}__close-menu"
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

  list.setAttribute('id', 'header-actions-list');
  list.classList.add(`${blockClass}__actions-list`);
  list.querySelectorAll('li').forEach((listItem) => {
    listItem.classList.add(`${blockClass}__action-item`);
  });
  list.querySelectorAll('li > a').forEach((link) => {
    link.classList.add(`${blockClass}__action-link`, `${blockClass}__link`);

    // wrapping text nodes into spans &
    // adding aria labels (because text labels are hidden on mobile)
    [...link.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .forEach((textNode) => {
        const spanWrapper = createElement('span', { classes: [`${blockClass}__action-link-text`] });

        textNode.replaceWith(spanWrapper);
        spanWrapper.append(textNode);
        link.setAttribute('aria-label', textNode.textContent);
      });
  });

  return list;
};

const mobileActions = () => {
  const mobileActionsEl = createElement('div', { classes: [`${blockClass}__mobile-actions`] });
  const searchLabel = getTextLabel('Search');
  const openMenuLabel = getTextLabel('Open menu');
  const searchResults = `${getLanguagePath()}search`;

  const searchEl = `<a href="${searchResults}" aria-label="${searchLabel}" class="${blockClass}__search-button ${blockClass}__action-link ${blockClass}__link">
    <span class="icon icon-search" aria-hidden="true"></span>
  </a>`;

  const actions = document.createRange().createContextualFragment(`
    ${SEARCH_DISABLED?.toLowerCase() === 'true' ? '' : searchEl}
    <button
      aria-label="${openMenuLabel}"
      class="${blockClass}__hamburger-menu ${blockClass}__action-link ${blockClass}__link"
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
  item.classList.add(`${blockClass}__category-item`);

  [...item.childNodes].forEach((el) => {
    // unwrapping images & links inside paragraphs
    if (el.tagName === 'P' && el.querySelectorAll(':scope > picture, :scope > a').length === 1) {
      el.replaceWith(el.children[0]);
    }

    // second list of links should be rendered as buttons
    if (item.querySelector(':scope > ul:nth-of-type(2)') === el) {
      el.classList.add(`${blockClass}__category-item-buttons`);

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
    firstLink.classList.add(`${blockClass}__link--after-image`);
  }
};

const optimiseImage = (picture) => {
  const img = picture.querySelector('img');
  const newPicture = createOptimizedPicture(img.src, img.alt, false, [
    { media: '(min-width: 1200px) and (min-resolution: 2x)', width: '568' },
    { media: '(min-width: 1200px)', width: '284' },
  ]);

  picture.replaceWith(newPicture);
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

    [...menuData.querySelectorAll('picture')].forEach(optimiseImage);
  });

  const results = document.createRange().createContextualFragment(`
    <div>
      ${data.map((el) => el.outerHTML).join('')}
    </div>
  `);

  return results.children[0];
};

const setTabActive = (tab) => {
  const targetId = tab.closest('[menu-accordion-id]').getAttribute('menu-accordion-id');
  const tabContent = document.querySelector(`#${targetId}`);

  [...tabContent.parentElement.querySelectorAll(`.${blockClass}__accordion-container`)].forEach((item) => {
    if (item !== tabContent) {
      item.setAttribute('data-active', 'false');
    }
  });

  tabContent.setAttribute('data-active', 'true');

  // scroll to proper tab content for tabs with cards
  if (tab.closest('.header__main-link-wrapper--tabs-with-cards')) {
    const tabContentId = tab.getAttribute('aria-controls');
    document.querySelector(`#${tabContentId}`).scrollIntoView({ behavior: 'smooth' });
  }

  // setting the aria-expanded for tabs and link's tab indexes
  [...tab.closest('.header__accordion-content-wrapper').querySelectorAll('.header__tab-link')].forEach((tabLink) => {
    const tId = tabLink.getAttribute('aria-controls');
    const tContent = document.querySelector(`#${tId}`);

    tabLink.setAttribute('aria-expanded', tabLink === tab ? 'true' : 'false');

    setTabIndexForLinks(tContent, tabLink === tab ? '0' : '-1');
  });
};

const onNavExpandChange = (isExpanded) => {
  // disabling scroll when menu is open
  document.body.classList[isExpanded ? 'add' : 'remove']('disable-scroll');

  document.querySelector('.header.block').classList[isExpanded ? 'add' : 'remove']('header--expanded');
};

const onAccordionItemClick = (el) => {
  const elClassList = el.currentTarget.classList;
  const isMainLink = elClassList.contains(`${blockClass}__main-nav-link`);
  const isTabLink = elClassList.contains(`${blockClass}__tab-link`);
  const isDesktop = desktopMQ.matches;

  if (isDesktop && (!isMainLink && !isTabLink)) {
    return;
  }

  el.preventDefault();

  const menuEl = el.currentTarget.parentElement;
  menuEl.classList.toggle(`${blockClass}__menu-open`);
  const isExpanded = menuEl.classList.contains(`${blockClass}__menu-open`);
  el.currentTarget.setAttribute('aria-expanded', isExpanded);

  if (isDesktop && isMainLink) {
    // closing other open menus
    if (isDesktop && menuEl.classList.contains(`${blockClass}__main-nav-item`)) {
      const openMenus = document.querySelectorAll(`.${blockClass}__menu-open`);

      [...openMenus].filter((menu) => menu !== menuEl).forEach((menu) => {
        menu.classList.remove(`${blockClass}__menu-open`);
        menu.querySelector(':scope > a').setAttribute('aria-expanded', false);
        setTabIndexForLinks(menu, '-1');
      });

      setTabIndexForLinks(menuEl, '0');
    }

    onNavExpandChange(isExpanded);

    // set first tab active
    const firstTabLink = el.target.parentElement.querySelector('.header__main-link-wrapper a');
    setTabActive(firstTabLink);
  }

  if (isDesktop && isTabLink) {
    setTabActive(el.currentTarget);
  }
};

const buildMenuContent = (menuData, navEl) => {
  const menus = transformMenuData(menuData);
  const navLinks = [...navEl.querySelectorAll(`.${blockClass}__main-nav-link`)];

  [...menus.children].forEach((menuItemData) => {
    const tabName = menuItemData.querySelector(':scope > p > a');
    if (!tabName) return;

    const categories = [...menuItemData.querySelectorAll(':scope > div')];
    const navLink = navLinks.find((el) => el.textContent.trim() === tabName.textContent.trim());
    const accordionContentWrapper = navLink?.closest(`.${blockClass}__main-nav-item`).querySelector(`.${blockClass}__accordion-content-wrapper`);

    categories.filter((cat) => cat.classList.contains('menu')).forEach((cat) => {
      const title = cat.querySelector(':scope > a');
      const list = cat.querySelector(':scope > ul');
      let extraClass = '';

      title?.classList.add(`${blockClass}__link`, `${blockClass}__link-accordion`, `${blockClass}__menu-heading`);
      title?.removeAttribute('href');

      if (cat.classList.contains(tabsVariants.TAB_WITH_CARDS)
        || cat.classList.contains(tabsVariants.TAB)
      ) {
        title?.classList.add(`${blockClass}__tab-link`);
      }

      if (cat.classList.contains(tabsVariants.TAB_WITH_CARDS)) {
        extraClass = `${blockClass}__main-link-wrapper--${tabsVariants.TAB_WITH_CARDS}`;
      }

      if (cat.classList.contains(tabsVariants.TAB)) {
        extraClass = `${blockClass}__main-link-wrapper--${tabsVariants.TAB}`;
      }

      list.classList.add(`${blockClass}__category-items`);
      [...list.querySelectorAll('li')].forEach(rebuildCategoryItem);
      [...list.querySelectorAll('a')].forEach((el) => el.classList.add(`${blockClass}__link`));
      [...list.querySelectorAll('li > a:not(.button):not(:only-child)')].forEach((el) => el.classList.add('standalone-link'));

      let menuContent;

      if (!title) {
        menuContent = document.createRange().createContextualFragment(`
          <div class="${blockClass}__menu-content">
            ${list.outerHTML}
          </div>
        `);
      } else {
        menuContent = document.createRange().createContextualFragment(`
        <div class="${blockClass}__menu-content">
          ${title.outerHTML}
          <div class="${blockClass}__category-content ${blockClass}__accordion-container">
            <div class="${blockClass}__accordion-content-wrapper">
              ${list.outerHTML}
            </div>
          </div>
        </div>
      `);
      }

      menuContent.querySelector(`.${blockClass}__link-accordion`)?.addEventListener('click', onAccordionItemClick);
      accordionContentWrapper.append(menuContent);
      if (extraClass) {
        accordionContentWrapper.parentElement.classList.add(extraClass);
      }
    });

    const menuFooter = categories.find((el) => el.classList.contains('menu-footer'));

    if (menuFooter) {
      [...menuFooter.querySelectorAll('a')].forEach((link, index) => {
        const classes = index ? ['standalone-link'] : ['button', 'button--primary', 'button--small'];
        link.classList.add(...classes);
      });

      navLink.parentElement.querySelector('.desktop-wrapper-footer').append(menuFooter);
    }

    navLink?.addEventListener('click', onAccordionItemClick);
  });
};

const decorateCTA = (wrapper) => {
  const anchorTags = wrapper.querySelectorAll('a');
  anchorTags.forEach((link) => {
    link.classList.add(`${blockClass}__custom-button`, 'button', 'button--primary');
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
    block.classList.add(`${blockClass}__custom`);

    const customStyles = getMetadata('custom-header-style');
    if (customStyles) {
      block.classList.add(`${blockClass}__custom--${customStyles}`);
    }
  }

  const testHeader = getMetadata('test-header');
  if (testHeader) navPath = testHeader;

  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error(`Header is not loaded: ${resp.status}`);
  }

  // get the navigation text, turn it into html elements
  const content = document.createRange().createContextualFragment(await resp.text());

  const [
    logoContainer,
    navigationContainer,
    actionsContainer,
    ...menuContent
  ] = content.children;
  const nav = createElement('nav', { classes: [`${blockClass}__nav`] });
  const navContent = document.createRange().createContextualFragment(`
    <div class="${blockClass}__menu-overlay"></div>
    ${createLogo(logoContainer).outerHTML}
    ${navigationContainer.children.length ? `<div class="${blockClass}__main-links">
      ${createMainLinks(navigationContainer).outerHTML}
    </div>` : ''}
    <div class="${blockClass}__actions">
      ${isMobileMenuDisabled ? '' : mobileActions().outerHTML}
      ${isMobileMenuDisabled ? decorateCTA(actionsContainer).outerHTML : createActions(actionsContainer).outerHTML}
    </div>
  `);

  const setAriaForMenu = (isMenuVisible) => {
    nav.querySelectorAll(`.${blockClass}__close-menu, .${blockClass}__hamburger-menu`).forEach((control) => {
      control.setAttribute('aria-expanded', isMenuVisible);

      document.querySelectorAll('.header__main-nav-link').forEach((el) => {
        el.setAttribute('tabindex', isMenuVisible ? '0' : '-1');
      });

      document.querySelectorAll('.header__action-item').forEach((el) => {
        setTabIndexForLinks(el, isMenuVisible ? '0' : '-1');
      });

      if (isMenuVisible) {
        document.querySelector('.header__close-menu')?.focus();
      }
    });
    nav.querySelectorAll('#header-main-nav, #header-actions-list').forEach((item) => {
      item.setAttribute('aria-hidden', !isMenuVisible);
    });
  };

  const initAriaForAccordions = () => {
    const menuPrefix = 'menu-accordion';
    const accordionContainers = block.querySelectorAll(`.${blockClass}__link-accordion ~ .${blockClass}__accordion-container`);

    [...accordionContainers].forEach((container) => {
      const id = generateId(menuPrefix);
      const accordionLink = container.parentElement.querySelector(`.${blockClass}__link-accordion`);

      container.setAttribute('id', id);
      accordionLink.setAttribute('aria-controls', id);
      accordionLink.setAttribute('aria-expanded', false);
      accordionLink.parentElement.setAttribute('menu-accordion-id', id);
    });
  };

  const closeHamburgerMenu = () => {
    block.classList.remove(`${blockClass}--hamburger-open`);
    onNavExpandChange(false);

    block.querySelectorAll(`.${blockClass}__menu-open`).forEach((el) => {
      el.classList.remove(`${blockClass}__menu-open`);
      el.setAttribute('aria-expanded', 'false');
    });

    setAriaForMenu(false);
  };

  // add actions for search
  if (SEARCH_DISABLED.toLowerCase() === 'false') {
    navContent.querySelector(`.${blockClass}__search-button`)?.addEventListener('click', () => {
      window.location.href = '/search';
    });
  }

  // add action for hamburger
  navContent.querySelector(`.${blockClass}__hamburger-menu`)?.addEventListener('click', () => {
    block.classList.add(`${blockClass}--hamburger-open`);
    onNavExpandChange(true);
    setAriaForMenu(true);
  });

  navContent.querySelectorAll(`.${blockClass}__menu-overlay, .${blockClass}__close-menu`).forEach((el) => {
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
    const isTargetOutsideMenu = !event.target.closest(`.${blockClass}__main-nav`) && !event.target.closest('.header__actions');
    const openMenu = block.querySelector(`.${blockClass}__main-nav-item.${blockClass}__menu-open`);

    if (isTargetOutsideMenu && openMenu) {
      openMenu.classList.remove(`${blockClass}__menu-open`);
      openMenu.setAttribute('aria-expanded', false);
      onNavExpandChange(false);
    }
  });

  const swapMenuMountPoint = (isDesktop) => {
    const selector = `
      .header__main-link-wrapper--tabs-with-cards .header__category-content.header__accordion-container,
      .header__main-link-wrapper--tabs .header__category-content.header__accordion-container
    `;
    const menus = [...document.querySelectorAll(selector)];

    if (isDesktop) {
      menus.forEach((item) => {
        const desktopMountPoint = item.closest(`.${blockClass}__main-link-wrapper`).querySelector('.desktop-wrapper');

        desktopMountPoint.append(item);
      });
    } else {
      menus.forEach((item) => {
        const mobileMountPoints = [...item.closest(`.${blockClass}__main-link-wrapper`).querySelectorAll('.header__menu-content')];
        const mountPoint = mobileMountPoints.find((el) => el.getAttribute('menu-accordion-id') === item.getAttribute('id'));

        mountPoint.append(item);
      });
    }
  };

  const swapActionsLinks = (isDesktop) => {
    const actionsLinks = document.querySelector('#header-actions-list');
    const actionsLinksDesktopMountPoint = document.querySelector('.header__actions');
    const headerMainNav = document.querySelector('.header__main-links'); // mobile actions links mount point
    const buttonsWithoutIcons = getAllElWithChildren([...actionsLinks.querySelectorAll('a')], '.icon', true);
    const loginLink = actionsLinks.querySelector('.header__action-item a[href*="login"]');

    if (loginLink && LOGIN_DISABLED.toLowerCase() === 'true') loginLink.remove();

    if (isDesktop) {
      actionsLinksDesktopMountPoint.append(actionsLinks);
      buttonsWithoutIcons.forEach((el) => el.classList.add('button', 'button--primary'));
    } else {
      headerMainNav.append(actionsLinks);
      buttonsWithoutIcons.forEach((el) => el.classList.remove('button', 'button--primary'));
    }
  };

  const setupAriaAndTabIndexes = (isDesktop) => {
    if (!isDesktop) {
      const mainLinksEl = document.querySelector('.header__main-links');
      const actionsEl = document.querySelector('.header__actions-list');

      setTabIndexForLinks(mainLinksEl, '-1');
      setTabIndexForLinks(actionsEl, '-1');

      [...mainLinksEl.querySelectorAll('[aria-expanded="true"]')].forEach((el) => {
        el.setAttribute('aria-expanded', 'false');
      });
    } else {
      const mainNav = document.querySelector('.header__main-nav');

      setTabIndexForLinks(mainNav);
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
}
