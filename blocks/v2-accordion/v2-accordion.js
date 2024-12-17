import { createElement, decorateIcons } from '../../scripts/common.js';
import fragmentBlock from '../fragment/fragment.js';

const blockName = 'v2-accordion';

function isContentLinkedCheck(el, startsWithString) {
  if ((el.children.length === 1 && el.children[0].tagName.toLowerCase() === 'p') || (el.children.length === 0 && el.textContent === el.innerHTML)) {
    return el.textContent.startsWith(startsWithString);
  }
  return false;
}

/* Function checks if the content of the provided element is just a link to other doc */
function isContentLink(el) {
  return isContentLinkedCheck(el, '/');
}

function isContentInsideAnotherElement(el) {
  return isContentLinkedCheck(el, '#id-');
}

function loaded(element, pointedContent, display) {
  element.innerHTML = '';
  element.append(pointedContent.parentElement);
  pointedContent.parentElement.style.display = display;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const accordionsPromises = rows.map(async (row) => {
    const accordionHeader = row.querySelector(
      ':scope > div > h1, :scope > div > h2, :scope > div > h3, :scope > div > h4, :scope > div > h5, :scope > div > h6',
    );
    accordionHeader?.classList.add(`${blockName}__title`);
    const accordionContent = row.querySelector(':scope > div:nth-child(2)');

    const headerButton = createElement('button', { classes: `${blockName}__button` });
    const dropdownArrowIcon = createElement('span', { classes: [`${blockName}__icon`, 'icon', 'icon-dropdown-caret'] });
    headerButton.append(accordionHeader, dropdownArrowIcon);

    const contentEl = createElement('div', { classes: [`${blockName}__content`, `${blockName}__content-close`] });

    if (isContentLink(accordionContent)) {
      await fragmentBlock(accordionContent);
    }

    contentEl.innerHTML = accordionContent.innerHTML;

    if (isContentInsideAnotherElement(accordionContent)) {
      const pointedContent = document.querySelector(`.${accordionContent.textContent.substring(1)}`);
      if (pointedContent) {
        const prevDisplay = pointedContent.parentElement.style.display;
        pointedContent.parentElement.style.display = 'none';

        if (pointedContent.dataset.blockStatus === 'loaded') {
          loaded(contentEl, pointedContent, prevDisplay);
        } else {
          // lets wait for loading of the content that we want to put inside the accordion
          new MutationObserver((_, observer) => {
            if (pointedContent.dataset.blockStatus === 'loaded') {
              observer.disconnect();
              loaded(contentEl, pointedContent, prevDisplay);
            }
          }).observe(pointedContent, { attributes: true });
        }
      }
    }

    const accordionEl = createElement('div', { classes: [`${blockName}__item`, `${blockName}__item-close`] });
    accordionEl.append(headerButton);
    accordionEl.append(contentEl);

    headerButton.addEventListener('click', () => {
      accordionEl.classList.toggle(`${blockName}__item-close`);
    });

    decorateIcons(accordionEl);
    return accordionEl;
  });

  block.innerHTML = '';
  await Promise.allSettled(accordionsPromises);
  accordionsPromises.forEach(async (acc) => {
    const result = await acc;
    block.append(result);
  });
  decorateIcons(block);
}
