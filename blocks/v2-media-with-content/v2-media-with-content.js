import { variantsClassesToBEM, createElement, unwrapDivs } from '../../scripts/common.js';

export default async function decorate(block) {
  const blockName = 'v2-media-with-content';
  const variantClasses = ['with-icons'];
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const contentWrapper = block.querySelector(':scope > div');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const content = [...block.querySelectorAll(':scope > div > div')];
  content.forEach((col) => {
    col.classList.add(`${blockName}__column`);
    if (col.firstElementChild.tagName === 'PICTURE') {
      col.classList.add('column-with-image');
    } else {
      col.classList.add('column-with-text');
    }
  });

  if (content[1].firstElementChild.tagName === 'PICTURE') {
    contentWrapper.classList.add(`${blockName}__content-wrapper--image-right`);
  }

  const header = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  header.forEach((h) => {
    h.classList.add(`${blockName}__title`);
  });

  const text = [...block.querySelectorAll('p')];
  text.forEach((t) => {
    t.classList.add(`${blockName}__text`);
  });

  if (block.classList.contains(`${blockName}--with-icons`)) {
    const iconList = block.querySelector('ul');
    iconList.classList.add(`${blockName}__icon-list`);

    const items = iconList.querySelectorAll('li');
    items.forEach((item) => {
      item.classList.add(`${blockName}__list-item`);
      const image = item.querySelector('picture');
      const figure = createElement('figure');
      const pElmt = createElement('figcaption');
      const liText = item.innerText.trim();
      pElmt.textContent = liText;

      if (image) {
        figure.append(image);
      }

      figure.append(pElmt);
      item.textContent = '';
      item.append(figure);
    });
  }

  unwrapDivs(block);
}
