import { createElement, decorateIcons, getTextLabel, variantsClassesToBEM, isMobileViewport } from '../../scripts/common.js';

const blockName = 'v2-icon-cards';
const variantClasses = ['no-background', 'alt-font-size', 'slider'];

function numberCardsToNavigate(block) {
  const isMobile = isMobileViewport();
  if (isMobile) {
    return 1;
  }

  if (block.classList.contains('slider-slide-2')) {
    return 2;
  }
  if (block.classList.contains('slider-slide-3')) {
    return 3;
  }
  if (block.classList.contains('slider-slide-4')) {
    return 4;
  }

  return 1;
}

function mergeColumnsInOneRow(block) {
  const columns = [...block.querySelectorAll(':scope > div > div')];

  if (columns.length > 5) {
    const row = document.createElement('div');

    row.append(...columns);
    block.innerHTML = '';
    block.append(row);
  }
}

function setSliderNavButtonEvents(block) {
  const numberCardsToNavigatePerClick = numberCardsToNavigate(block);
  const sliderNav = block.querySelector('.v2-icon-cards__slider-nav');
  const sliderNavPrev = sliderNav.querySelector('.v2-icon-cards__slider-nav-button--prev');
  const sliderNavNext = sliderNav.querySelector('.v2-icon-cards__slider-nav-button--next');
  const scrollContainer = block.querySelector('.v2-icon-cards__row');
  const numberItems = block.querySelectorAll('.v2-icon-cards__column')?.length;
  const scrollContainerScrollWidth = scrollContainer.scrollWidth;
  const itemWidth = scrollContainerScrollWidth / numberItems;

  sliderNavPrev.addEventListener('click', () => {
    scrollContainer.scrollLeft -= itemWidth * numberCardsToNavigatePerClick;
  });

  sliderNavNext.addEventListener('click', () => {
    scrollContainer.scrollLeft += itemWidth * numberCardsToNavigatePerClick;
  });
}

function initialiseSliderNav(block) {
  let intervalId = null;
  let progressBarInitialised = false;
  const progressBar = block.querySelector('.v2-icon-cards__slider-progress');
  const scrollContainer = block.querySelector('.v2-icon-cards__row');

  const setupNavAndProgressBar = () => {
    const blockClientWidth = block.clientWidth;
    const scrollContainerScrollWidth = scrollContainer.scrollWidth;

    if (!blockClientWidth || !scrollContainerScrollWidth) {
      return;
    }
    const visibleScrollPercentage = (blockClientWidth * 100) / scrollContainerScrollWidth;
    const remainingScrollWidth = scrollContainerScrollWidth - blockClientWidth;
    const scrollLeftPosition = scrollContainer.scrollLeft;
    const remainingScrollPercentage = (scrollLeftPosition / remainingScrollWidth) * (100 - visibleScrollPercentage) || 0;

    progressBar.style.width = `${remainingScrollPercentage + visibleScrollPercentage}%`;

    progressBarInitialised = true;
  };

  // Set initial width
  const initialiseProgressBar = () => {
    setupNavAndProgressBar();

    if (progressBarInitialised) {
      setSliderNavButtonEvents(block);
      clearInterval(intervalId);
    }
  };

  intervalId = setInterval(initialiseProgressBar, 100);

  // Update width on scroll
  scrollContainer.addEventListener('scroll', setupNavAndProgressBar);
}

function setupSlider(block) {
  mergeColumnsInOneRow(block);
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    row.classList.add(`${blockName}__row`);
  });

  const sliderNav = document.createRange().createContextualFragment(`
      <div class="${blockName}__slider-nav">
        <div class="${blockName}__slider-nav-arrows">
          <button class="${blockName}__slider-nav-button ${blockName}__slider-nav-button--prev" aria-label="${getTextLabel('Previous')}"><span class="icon icon-chevron-right"></span></button>
          <button class="${blockName}__slider-nav-button ${blockName}__slider-nav-button--next" aria-label="${getTextLabel('Next')}"><span class="icon icon-chevron-right"></span></button>
        </div>
        <div class="${blockName}__slider-progress-wrapper"> <div class="${blockName}__slider-progress"></div></div>
      </div>
    `);

  block.append(sliderNav);
  decorateIcons(block);

  initialiseSliderNav(block);
}

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const columns = [...block.querySelectorAll(':scope > div > div')];
  const isSliderEnabled = block.classList.contains(`${blockName}--slider`);

  if (isSliderEnabled) {
    setupSlider(block);
  } else {
    const rows = [...block.querySelectorAll(':scope > div')];
    rows.forEach((row) => {
      row.classList.add(`${blockName}__row`);
    });
  }

  const parentSection = block.parentElement.parentElement;
  const hasHeader = parentSection.classList.contains('header-with-mark');
  const hasExtraColumn = columns.length === 4;

  if (hasExtraColumn) {
    block.classList.add(`${blockName}--4-cols`);
  }
  if ((hasExtraColumn && hasHeader) || (isSliderEnabled && hasHeader)) {
    parentSection.querySelector('.default-content-wrapper').classList.add(`${blockName}--short-header`);
  }

  columns.forEach((col, idx) => {
    const isExtraColumn = idx === 3;
    col.classList.add(`${blockName}__column`);

    const allTextElmts = col.querySelectorAll('p');
    const bodyElmts = [];

    allTextElmts.forEach((e) => {
      const nextElmt = e.nextElementSibling;

      const isButton = [...e.classList].includes('button-container');
      const isPretitle = nextElmt?.tagName.toLowerCase()[0] === 'h';

      if (!isPretitle && !isButton) {
        bodyElmts.push(e);
      }
    });
    bodyElmts.forEach((e) => e.classList.add(`${blockName}__body`));

    const buttons = [...block.querySelectorAll('.button-container a')];
    buttons.forEach((btn) => {
      const buttonContainer = btn.closest('.button-container');
      if (buttonContainer) {
        buttonContainer.replaceWith(btn);
      }

      if (btn.classList.contains('button--primary') || btn.classList.contains('button--secondary') || btn.classList.contains('button--red')) {
        btn.classList.add('button--small');
      } else {
        btn.classList.add('standalone-link', `${blockName}__button`);
      }
    });

    if (isExtraColumn) {
      col.classList.add(`${blockName}__column--extra-col`);
      col.dataset.theme = 'gold';
    }

    const headings = [...col.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    headings.forEach((heading) => heading.classList.add(`${blockName}__heading`, 'h2'));

    // icons
    [...col.querySelectorAll('.icon')].forEach((icon, index) => {
      const iconParentEl = icon.parentElement;
      if (iconParentEl.children.length === 1 && index === 0) {
        icon.classList.add('top-icon');
        iconParentEl.replaceWith(icon);
      }
    });

    const prevEl = headings[0]?.previousElementSibling;
    const pretitleText = prevEl && !prevEl.classList.contains('icon') && prevEl.textContent;

    if (pretitleText) {
      const pretitle = createElement('span', { classes: 'pretitle' });
      pretitle.textContent = pretitleText;
      prevEl.replaceWith(pretitle);
    }
  });

  const headings = [...block.querySelectorAll('h3, h4, h5, h6')];
  const h2List = [...block.querySelectorAll('h2')];

  headings.forEach((h) => {
    h.classList.add('h5');
    h.classList.remove('h2');
  });

  h2List.forEach((h) => {
    h.classList.add('with-marker', 'h2');
    h.classList.remove('h1');
    h.closest(`.${blockName}__column`)?.classList.add(`${blockName}__column--main`);
  });

  // replacing headings (h3, h4, h5, h6) with strong so the block will not break semantic
  // (example breaking semantic: col 1 -> h5, col 2 -> h2)
  headings.forEach((heading) => {
    const newHeadingEl = createElement('strong', { classes: [...heading.classList] });
    newHeadingEl.innerHTML = heading.innerHTML;
    heading.replaceWith(newHeadingEl);
  });
}
