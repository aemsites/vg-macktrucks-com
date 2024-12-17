import { readBlockConfig, loadBlock, getMetadata } from '../../scripts/aem.js';
import { createElement, decorateIcons, getTextLabel } from '../../scripts/common.js';

const PLACEHOLDERS = {
  subscribe: getTextLabel('SUBSCRIBE TO BULLDOG'),
  emailAddress: getTextLabel('Email Address'),
};

const addClassToTitle = (block, className) => {
  const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  [...headings].forEach((h) => h.classList.add(className));
};

const CLASSES = {
  blockName: 'footer',
  prefooter: 'prefooter',
  truckList: 'footer-truck-list',
  menu: 'footer-menu',
  newsletter: 'footer-newsletter',
  legal: 'footer-legal',
};

function addScrollToTopButton(mainEl) {
  const scrollToTopButton = document.createRange().createContextualFragment(`
    <div class="scroll-to-top-container">
      <a href="#" class="scroll-to-top" title="${getTextLabel('go to top')}">
        <span class="icon icon-arrow-right" />
      </a>
    </div>
  `);

  mainEl.append(scrollToTopButton);
}

function findList(ele) {
  if (ele.classList.contains(CLASSES.truckList)) {
    return ele;
  }
  return findList(ele.parentElement);
}

function toggleExpand(targetH3) {
  const clickedColumn = findList(targetH3);
  const isExpanded = clickedColumn.classList.contains('expand');
  const wrapper = targetH3.closest(`.${CLASSES.truckList}`);
  const content = wrapper.querySelector(`.${CLASSES.truckList}__items`);
  if (wrapper === clickedColumn && !isExpanded) {
    wrapper.classList.add('expand');
    content.style.maxHeight = `${content.scrollHeight}px`;
  } else {
    wrapper.classList.remove('expand');
    content.style.maxHeight = null;
  }
}

async function setupNewsletterForm(footerBlock, footerMenuEl) {
  const newsletterEl = createElement('div', { classes: CLASSES.newsletter });
  const newsletterCol = footerMenuEl.querySelector(':scope > div:last-child');

  let pardotForm = footerBlock.querySelector('.v2-newsletter');
  if (pardotForm) {
    pardotForm.setAttribute('data-block-name', 'v2-newsletter');
    await loadBlock(pardotForm);
    pardotForm = footerBlock.querySelector('.v2-newsletter');
    newsletterEl.append(pardotForm);
  }

  const submitButton = newsletterEl.querySelector('button[type="submit"]');
  const emailInput = newsletterEl.querySelector('input[name="email"]');
  const pdtForm = newsletterEl.querySelector(':scope form');

  if (pdtForm) {
    pdtForm.className = 'pardot-form';
  }

  // change the submit button to arrow button
  // and display it sticked to the right side of email input
  if (submitButton && emailInput) {
    emailInput.placeholder = PLACEHOLDERS.emailAddress;
    submitButton.ariaLabel = `${PLACEHOLDERS.subscribe}`;
  }

  newsletterEl.prepend(newsletterCol);
  addClassToTitle(newsletterEl, `${CLASSES.newsletter}__title`);

  return newsletterEl;
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  let footerPath = cfg.footer || '/footer';
  const isCustomFooter = getMetadata('custom-footer');
  const cfgMetadata = getMetadata('cfg-footer');

  if (isCustomFooter) {
    footerPath = isCustomFooter;
    block.classList.add(`${CLASSES.blockName}__custom`);
  }

  if (cfgMetadata) {
    footerPath = cfgMetadata;
  }

  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();

  block.innerHTML = html;

  const footerItems = block.querySelectorAll(`:scope > div .${CLASSES.blockName} > div`);

  // The footer is divided into 4 sections/rows in the block
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

  // First row: Prefooter
  if (prefooterEl) {
    prefooterEl.classList.add(CLASSES.prefooter);
    newFooter.append(prefooterEl);
  }

  // Second Row: Truck list
  if (truckListEl) {
    truckListEl.classList.add(`${CLASSES.truckList}__wrapper`);
    truckListEl.querySelector('ul')?.classList.add(`${CLASSES.truckList}__items`);
    addClassToTitle(truckListEl, `${CLASSES.truckList}__title`);
    const truckListContent = createElement('div', { classes: CLASSES.truckList });
    truckListContent.appendChild(truckListEl);

    newFooter.append(truckListContent);
  }

  // Third row: Menu -> social media + logo + menu list + newsletter form
  const newMenu = createElement('div', { classes: CLASSES.menu });
  if (footerMenuEl) {
    // First column, first row: Logo
    const logo = document.createRange().createContextualFragment(`<div class="${CLASSES.menu}__logo">
      <a href="/">
        <span class="icon icon-logo" />
        <span class="screenreader">${getTextLabel('Logo link')}</span>
      </a>
    </div>`);
    newMenu.appendChild(logo);

    // First column, second row: Social media
    const socialMedia = footerMenuEl.querySelector(':scope > div ul');
    socialMedia.classList.add(`${CLASSES.menu}__socialmedia`);
    const socialLinks = socialMedia.querySelectorAll('a');
    [...socialLinks].forEach((a) => {
      a.target = '_blank';
    });
    newMenu.appendChild(socialMedia);
    // remove div which contained logo and social media
    footerMenuEl.firstElementChild.remove();

    // Second column: menu
    const menuEl = createElement('div', { classes: `${CLASSES.menu}__columns` });
    // Menu Columns: Newsletter form
    const newsletterEl = await setupNewsletterForm(block, footerMenuEl);
    newMenu.append(newsletterEl);

    menuEl.append(footerMenuEl);
    const menuList = menuEl.querySelectorAll(':scope > div');
    menuList.forEach((item) => item.classList.add(`${CLASSES.menu}__column`));
    if (menuEl.children.length) {
      newMenu.appendChild(menuEl);
    }

    newFooter.append(newMenu);
  }

  if (footerLegalEl) {
    footerLegalEl.classList.add(CLASSES.legal);

    newFooter.append(footerLegalEl);
  }

  block.innerHTML = '';
  block.append(newFooter);

  addScrollToTopButton(block);

  await decorateIcons(block);
  await loadBlock(block);

  block.addEventListener('click', (e) => {
    if (e.target.classList.contains(`${CLASSES.truckList}__title`)) {
      toggleExpand(e.target);
    }
  });
}
