import {
  readBlockConfig,
  loadBlocks,
  getMetadata,
} from '../../scripts/aem.js';
import {
  createElement,
  decorateIcons,
  getTextLabel,
} from '../../scripts/common.js';

const PLACEHOLDERS = {
  subscribe: getTextLabel('SUBSCRIBE TO BULLDOG'),
  emailAddress: getTextLabel('Email Address'),
};

const addClassToTitle = (block, className) => {
  const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  [...headings].forEach((h) => h.classList.add(className));
};

const blockNames = {
  blockName: 'footer',
  prefooter: 'prefooter',
  truckList: 'footer-truck-list',
  menu: 'footer-menu',
  newsletter: 'footer-newsletter',
  legal: 'footer-legal',
};

const {
  blockName, prefooter, truckList, menu, newsletter, legal,
} = blockNames;

function addScrollToTopButton(mainEl) {
  const scrollToTopButton = document.createRange().createContextualFragment(`<div class="scroll-to-top-container">
    <a href="#" class="scroll-to-top" title="${getTextLabel('go to top')}">
      <span class="icon icon-arrow-right" />
    </a>
  </div>`);

  mainEl.append(scrollToTopButton);
}

function findList(ele) {
  if (ele.classList.contains(truckList)) {
    return ele;
  }
  return findList(ele.parentElement);
}

function toggleExpand(targetH3) {
  const clickedColumn = findList(targetH3);
  const isExpanded = clickedColumn.classList.contains('expand');
  const wrapper = targetH3.closest(`.${truckList}`);
  const content = wrapper.querySelector(`.${truckList}__items`);
  if (wrapper === clickedColumn && !isExpanded) {
    wrapper.classList.add('expand');
    content.style.maxHeight = `${content.scrollHeight}px`;
  } else {
    wrapper.classList.remove('expand');
    content.style.maxHeight = null;
  }
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  let footerPath = cfg.footer || '/footer';
  const isCustomFooter = getMetadata('custom-footer');
  const cfgMetadata = getMetadata('cfg-footer');

  if (isCustomFooter) {
    footerPath = isCustomFooter;
    block.classList.add(`${blockName}__custom`);
  }

  if (cfgMetadata) footerPath = cfgMetadata;

  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();

  block.innerHTML = html;

  // Pardot form necessary variables
  let observer = null;
  let formFieldsFixed = false;

  const footerItems = block.querySelectorAll(`:scope > div .${blockName} > div`);

  // The footer is divided into 4 sections in the block
  let prefooterEl; // row 1
  let truckListEl; // row 2
  let footerMenuEl; // row 3
  let footerLegalEl; // row 4

  // Footer items
  // 4 items: prefooter, truck list, menu, legal
  if (footerItems.length === 4) {
    const [row1, row2, row3, row4] = footerItems;
    prefooterEl = row1.querySelector(':scope > div');
    truckListEl = row2.querySelector(':scope > div');
    footerMenuEl = row3;
    footerLegalEl = row4.querySelector(':scope > div');
  }

  const newFooter = createElement('div');

  // Prefooter
  if (prefooterEl) {
    prefooterEl.classList.add(prefooter);
    newFooter.append(prefooterEl);
  }

  // Truck list
  if (truckListEl) {
    truckListEl.classList.add(`${truckList}__wrapper`);
    truckListEl.querySelector('ul')?.classList.add(`${truckList}__items`);
    addClassToTitle(truckListEl, `${truckList}__title`);
    const truckListContent = createElement('div', { classes: truckList });
    truckListContent.appendChild(truckListEl);

    newFooter.append(truckListContent);
  }

  // Menu: social media + logo + menu list + newsletter form
  if (footerMenuEl) {
    const newMenu = createElement('div', { classes: menu });

    // Logo
    const logo = document.createRange().createContextualFragment(`<div class="${menu}__logo">
      <a href="/">
        <span class="icon icon-logo" />
        <span class="screenreader">${getTextLabel('Logo link')}</span>
      </a>
    </div>`);
    newMenu.appendChild(logo);

    // Social media
    const socialMedia = footerMenuEl.querySelector(':scope > div ul');
    socialMedia.classList.add(`${menu}__socialmedia`);
    const socialLinks = socialMedia.querySelectorAll('a');
    [...socialLinks].forEach((a) => { a.target = '_blank'; });
    newMenu.appendChild(socialMedia);

    // remove div which contained logo and social media
    footerMenuEl.firstElementChild.remove();

    // Menu Columns: Newsletter form
    const newsletterEl = createElement('div', { classes: newsletter });
    const newsletterCol = footerMenuEl.querySelector(':scope > div:last-child');

    if (newsletterCol) {
      newsletterEl.appendChild(newsletterCol);
    }

    const pardotForm = block.querySelector('.v2-newsletter');
    if (pardotForm) {
      pardotForm?.setAttribute('data-block-name', 'v2-newsletter');
      newsletterEl.append(pardotForm);
    }
    addClassToTitle(newsletterEl, `${newsletter}__title`);

    // Menu Columns: menu
    const menuEl = createElement('div', { classes: `${menu}__columns` });
    menuEl.innerHTML = footerMenuEl.innerHTML;
    const menuList = menuEl.querySelectorAll(':scope > div');
    menuList.forEach((item) => item.classList.add(`${menu}__column`));

    if (menuEl.children.length) {
      newMenu.appendChild(menuEl);
    }

    if (newsletterEl.children.length) {
      newMenu.appendChild(newsletterEl);
    }

    newFooter.append(newMenu);
  }

  if (footerLegalEl) {
    footerLegalEl.classList.add(legal);

    newFooter.append(footerLegalEl);
  }

  block.innerHTML = newFooter.innerHTML;

  addScrollToTopButton(block);

  await decorateIcons(block);
  await loadBlocks(block);

  const onFormLoaded = (mutationList) => {
    for (const mutation of mutationList) {
      if (formFieldsFixed) return;

      if (mutation.type !== 'childList') return;
      const submitButton = block.querySelector('button[type="submit"]');
      const emailInput = block.querySelector('input[name="email"]');
      const pdtForm = block.querySelector(':scope form');

      if (pdtForm) pdtForm.className = 'pardot-form';

      // change the submit button to arrow button
      // and display it sticked to the right side of email input
      if (submitButton && emailInput) {
        emailInput.placeholder = PLACEHOLDERS.emailAddress;
        submitButton.ariaLabel = `${PLACEHOLDERS.subscribe}`;
        formFieldsFixed = true;
        observer.disconnect();
      }
    }
  };

  const pardotForm = block.querySelector('.footer-newsletter');
  if (pardotForm) {
    observer = new MutationObserver(onFormLoaded);
    observer.observe(pardotForm, {
      childList: true,
      attributes: false,
      subtree: true,
    });
  }

  block.addEventListener('click', (e) => {
    if (e.target.classList.contains(`${truckList}__title`)) {
      toggleExpand(e.target);
    }
  });
}
