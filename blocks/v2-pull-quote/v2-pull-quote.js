import { unwrapDivs, variantsClassesToBEM } from '../../scripts/common.js';

const blockName = 'v2-pull-quote';
const variantClasses = ['half-width'];
let quoteIsRight = true;

export default function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const parentWrapper = block.parentElement;

  const isHalfWidth = block.classList.contains(`${blockName}--half-width`);
  const previousTextEl = parentWrapper.previousElementSibling.lastChild;

  if (isHalfWidth && previousTextEl) {
    parentWrapper.classList.add(`${blockName}-wrapper--half-width`, quoteIsRight ? 'quote-right' : 'quote-left');
    quoteIsRight = !quoteIsRight;
    previousTextEl.classList.add('half-width-text');
    parentWrapper.prepend(previousTextEl);
  }
  unwrapDivs(block);
}
