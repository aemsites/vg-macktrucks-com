import { loadBlock } from '../../scripts/aem.js';
import { createElement, slugify, removeEmptyTags } from '../../scripts/common.js';

const blockName = 'v2-specifications';

export default async function decorate(block) {
  const accordionId = [...block.classList].find((className) => className.startsWith('id-'));

  const items = block.querySelectorAll(':scope > div');

  let accordion;
  let accordionContent;
  let accordionWrapper;

  const accordionBlock = createElement('div', {
    classes: ['block', 'v2-accordion', ...(accordionId ? [accordionId] : [])],
    props: { 'data-block-name': 'v2-accordion' },
  });

  const accordionBlockWrapper = createElement('div', {
    classes: ['v2-accordion-wrapper'],
  });
  accordionBlockWrapper.appendChild(accordionBlock);
  block.appendChild(accordionBlockWrapper);

  // Hx tag used for the titles of the accordion
  const titleMeta = block.closest('.section').dataset.header;
  if (!titleMeta) {
    return;
  }

  const headerTag = titleMeta.charAt(titleMeta.length - 1);
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(headerTag);

  [...items].forEach((item) => {
    const typeTitle = item.querySelector(`h${headerTag}`); // header of the accordion
    const typePicture = item.querySelector('picture'); // with image
    const typeDownloads = item.querySelector('.button-container a'); // with downloads

    // Add title styles to the headings that are not as the accordion button
    const headingString = headings.join(',');
    const headingsList = [...block.querySelectorAll(headingString)];
    headingsList.forEach((heading) => heading.classList.add(`${blockName}__subtitle`, 'h5'));
    const subtitleCounter = item.querySelectorAll(`.${blockName}__subtitle`).length;

    if (typeTitle) {
      if (accordion) {
        // close old Accordion content
        accordionBlock.appendChild(accordion);
        accordionWrapper.appendChild(accordionContent);
        block.appendChild(accordionWrapper);
      }

      // create slug based on title name
      const name = `id-${slugify(item.textContent.trim())}`;

      // new Accordion content
      // (accordionWrapper + accordionContent + accordion are needed)
      accordionWrapper = createElement('div', { classes: [`${blockName}__accordion-wrapper`] });
      accordionContent = createElement('div', {
        classes: [`${blockName}__accordion-content`, name],
        props: { 'data-block-status': 'loaded' },
      });
      accordion = createElement('div');

      // Title of the accordion
      const titleDiv = item.querySelector(':scope > div');
      titleDiv.classList.add(`${blockName}__title`);
      accordion.appendChild(titleDiv);

      // Id to be updated in the accordion content
      const divId = createElement('div');
      divId.textContent = `#${name}`;
      accordion.appendChild(divId);
      item.remove();
    }

    const classes = [];
    if (subtitleCounter) {
      classes.push(`${blockName}__list--subtitle`);
    }

    // apply classes to the content based on items inside
    if (typePicture) {
      classes.push(`${blockName}__list--with-pictures`);
    }

    if (typeDownloads) {
      classes.push(`${blockName}__list--with-downloads`);

      const buttons = item.querySelectorAll('.button-container a');
      buttons.forEach((bt) => {
        bt.classList.add('standalone-link');
      });
    }

    if (!typePicture && !typeDownloads && !typeTitle) {
      classes.push(`${blockName}__list--with-text`);
    }

    item.classList.add(...classes);

    if (accordionContent) {
      accordionContent.appendChild(item);
    }
  });

  // close last accordion content
  if (accordion) {
    accordionBlock.appendChild(accordion);
    accordionWrapper.appendChild(accordionContent);
    block.appendChild(accordionWrapper);
  }

  removeEmptyTags(block);

  await loadBlock(accordionBlock);
}
