import { createElement, unwrapDivs } from '../../scripts/common.js';

const blockName = 'v2-intro-section';

export default function decorate(block) {
  const content = block.querySelector(':scope > div > div:first-child');
  const image = block.querySelector(':scope > div > div:nth-child(2) > picture');
  const button = content.querySelector('.button-container');

  const parent = block.parentElement;
  parent.classList.add(button ? `${blockName}__with-button` : 'full-width');

  content.classList.add(`${blockName}__text-content`);

  const heading = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  heading[0].classList.add(`${blockName}__heading`, button && 'with-marker');

  if (button) {
    const texts = createElement('div', { classes: `${blockName}__content` });
    texts.append(content, button);
    block.append(texts);
  }

  parent.prepend(image);
  unwrapDivs(block);
}
