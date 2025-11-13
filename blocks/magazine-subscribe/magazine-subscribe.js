import { buildBlock, decorateBlock, loadBlock } from '../../scripts/aem.js';
import { createElement, getTextLabel, MAGAZINE_CONFIGS } from '../../scripts/common.js';

export default async function decorate(block) {
  const { HREF: href, IFRAME_SIZE } = MAGAZINE_CONFIGS;
  const content = document.createRange().createContextualFragment(`
    <div class="default-content-wrapper">
      <h2 id="subscribe-to-bulldog-magazine">${getTextLabel('magazine_subscribe:heading')}</h2>
      <p>${getTextLabel('magazine_subscribe:text')}</p>
    </div>
  `);

  const iframeLink = createElement('a', {
    classes: 'iframe-link',
    props: { href: href || '' },
  });
  const iframeForm = buildBlock('iframe', { elems: [iframeLink] });

  block.textContent = '';
  block.append(content);
  block.parentElement.classList.add('section', 'center', 'padding-0');
  block.parentElement.setAttribute('data-form-type', 'Subscribe-magazine');
  block.insertAdjacentElement('afterend', iframeForm);
  if (IFRAME_SIZE) {
    iframeForm.classList.add(IFRAME_SIZE);
  }
  decorateBlock(iframeForm);
  loadBlock(iframeForm);
}
