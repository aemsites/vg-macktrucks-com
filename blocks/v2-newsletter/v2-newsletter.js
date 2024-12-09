import {
  loadBlock, sampleRUM,
} from '../../scripts/aem.js';
import { createElement } from '../../scripts/common.js';

const blockName = 'v2-newsletter';
export const logResults = {
  success: 'success',
  error: 'error',
};
let thanksMessageEl;
let errorMessageEl;

//* init response handling *
async function handleSubmissionResult(isSuccess) {
  const form = document.querySelector('form[data-submitting=true]');
  const message = isSuccess ? thanksMessageEl : errorMessageEl;
  message.className = `${blockName}__message`;

  if (isSuccess) {
    sampleRUM('form:submit');
  }

  form.setAttribute('data-submitting', 'false');
  form.replaceWith(message);
}
//* end response handling *

window.logResult = function logResult(json) {
  handleSubmissionResult(json.result === logResults.success);
};

export default async function decorate(block) {
  const formLink = block.firstElementChild.innerText.trim();
  const thanksEl = block.firstElementChild.nextElementSibling.firstElementChild;
  const errorEl = block.lastElementChild.firstElementChild;

  const container = createElement('div', { classes: `${blockName}__container` });

  thanksMessageEl = thanksEl.cloneNode(true);
  errorMessageEl = errorEl.cloneNode(true);
  thanksEl.remove();
  errorEl.remove();

  const form = document.createRange().createContextualFragment(`
    <div class="v2-forms block" data-block-name="v2-forms" data-block-status="" data-force-load="true">
      <div>
        <div>subscribe</div>
      </div>
      <div>
        <div>${formLink}</div>
      </div>
    </div>`);

  container.append(...form.children);

  await loadBlock(container.querySelector('.v2-forms'));

  const newBlock = createElement('div', { classes: `${blockName}` });
  newBlock.append(container);

  block.replaceWith(newBlock);
}
