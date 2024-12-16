import { createElement } from '../../scripts/common.js';
import fragmentBlock from '../fragment/fragment.js';

/* Function checks if the content of the provied element is just a link to other doc */
function isContentLink(el) {
  // The assumpions:
  // 1. The content is just plain text - no HTML inside
  // 2. The link starts from '/' and doesn't contain any white space character
  return el.innerHTML === el.textContent && /^\/(\S+)$/g.test(el.innerHTML);
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const accordionsPromises = rows.map(async (row) => {
    const accordionHeader = row.querySelector(
      ':scope > div > h1, :scope > div > h2, :scope > div > h3, :scope > div > h4, :scope > div > h5, :scope > div > h6',
    );
    const accordionContent = row.querySelector(':scope > div:nth-child(2)');

    const headerButton = createElement('button', { classes: 'accordion-header-button' });
    const headerEl = createElement('h2', { classes: 'accordion-header' });
    const plusEl = createElement('div', { classes: 'accordion-close' });
    headerEl.innerHTML = accordionHeader?.innerHTML;
    headerButton.append(headerEl, plusEl);

    const contentEl = createElement('div', { classes: ['accordion-content', 'accordion-content-close'] });

    if (isContentLink(accordionContent)) {
      await fragmentBlock(accordionContent);
    }

    if (accordionContent.textContent.startsWith('#id-') && accordionContent.innerHTML === accordionContent.textContent) {
      const pointedContent = document.querySelector(`.${accordionContent.textContent.substring(1)}`);

      if (pointedContent) {
        const prevDisaply = pointedContent.parentElement.style.display;
        pointedContent.parentElement.style.display = 'none';
        // lets wait for loading of the content that we want to put inside the accordion
        new MutationObserver((_, observer) => {
          if (pointedContent.dataset.blockStatus === 'loaded') {
            observer.disconnect();
            contentEl.innerHTML = '';
            contentEl.append(pointedContent.parentElement);
            pointedContent.parentElement.style.display = prevDisaply;
          }
        }).observe(pointedContent, { attributes: true });
      }
    }

    contentEl.innerHTML = accordionContent.innerHTML;

    const accordionEl = createElement('div', { classes: ['accordion-item', 'accordion-item-close'] });
    accordionEl.append(headerButton);
    accordionEl.append(contentEl);

    headerButton.addEventListener('click', () => {
      accordionEl.classList.toggle('accordion-item-close');
    });

    return accordionEl;
  });

  block.innerHTML = '';
  await Promise.allSettled(accordionsPromises);
  accordionsPromises.forEach(async (acc) => {
    const result = await acc;
    block.append(result);
  });
}
