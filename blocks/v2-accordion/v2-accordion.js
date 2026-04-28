const BLOCK_REFERENCE_PREFIX = '#';
const BLOCK_LOADED_STATUS = 'loaded';

/**
 * Builds a <vcdk-accordion> item.
 * Compliant with Volvo VCDK slot structure.
 * @param {string} title
 * @param {string} bodyHTML
 * @returns {DocumentFragment}
 */
const renderAccordionItem = (title, bodyHTML = '') => {
  const html = `
    <vcdk-accordion>
      <span slot="title" class="accordion__title">${title}</span>
      <div class="accordion__content">${bodyHTML}</div>
    </vcdk-accordion>
  `;
  return document.createRange().createContextualFragment(html);
};

/**
 * Returns authoring rows with [title, content].
 * @param {HTMLElement} block
 * @returns {HTMLElement[]}
 */
const getRows = (block) => [...block.children].filter((row) => row.children?.length >= 2);

const getText = (element) => element.textContent.trim();

const isBlockReferenceContent = (element) => {
  const text = getText(element);
  return text.startsWith(BLOCK_REFERENCE_PREFIX) && text.length > 1 && element.children.length <= 1;
};

const getBlockReferenceId = (element) => getText(element).slice(BLOCK_REFERENCE_PREFIX.length).trim();

const findBlockByReferenceId = (referenceId) => {
  if (!referenceId) {
    return null;
  }
  return document.querySelector(`.${CSS.escape(referenceId)}`);
};

/**
 * Waits until a block reaches "loaded" state, then executes a callback.
 * This avoids blocking the accordion rendering.
 *
 * @param {HTMLElement} block
 * @param {Function} callback
 */
const waitForBlockLoaded = (block, callback) => {
  if (block.dataset.blockStatus === BLOCK_LOADED_STATUS) {
    callback();
    return;
  }

  const observer = new MutationObserver(() => {
    if (block.dataset.blockStatus === BLOCK_LOADED_STATUS) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(block, {
    attributes: true,
    attributeFilter: ['data-block-status'],
  });
};

/**
 * Injects a referenced block into the accordion content once loaded.
 * Falls back to original HTML if the reference cannot be resolved.
 *
 * @param {HTMLElement} contentEl
 * @param {HTMLElement} sourceEl
 */
const injectReferencedBlock = (contentEl, sourceEl) => {
  const referenceId = getBlockReferenceId(sourceEl);
  const referencedBlock = findBlockByReferenceId(referenceId);
  const referencedBlockWrapper = referencedBlock?.parentElement;

  if (!referencedBlock || !referencedBlockWrapper) {
    contentEl.innerHTML = sourceEl.innerHTML.trim();
    return;
  }

  const moveBlock = () => {
    contentEl.replaceChildren(referencedBlockWrapper);
  };

  waitForBlockLoaded(referencedBlock, moveBlock);
};

const populateAccordionContent = (contentEl, sourceEl) => {
  if (isBlockReferenceContent(sourceEl)) {
    injectReferencedBlock(contentEl, sourceEl);
    return;
  }

  contentEl.innerHTML = sourceEl.innerHTML.trim();
};

/**
 * Enables single-open mode:
 * When one accordion opens, all others close.
 *
 * @param {HTMLElement} block
 */
const enableSingleOpenBehavior = (block) => {
  const items = [...block.querySelectorAll('vcdk-accordion')];

  if (items.length <= 1) {
    return;
  }

  items.forEach((item) => {
    item.addEventListener('vcdk-toggle', () => {
      if (!item.open) {
        return;
      }

      items
        .filter((other) => other !== item && other.open)
        .forEach((other) => {
          other.open = false;
        });
    });
  });
};

/**
 * Forces all links inside the block to open in a new tab.
 *
 * @param {HTMLElement} block
 */
const setLinksToOpenInNewTab = (block) => {
  block.querySelectorAll('a[href]').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
};

/**
 * Decorates the accordion block.
 * Supports:
 * - standard rich text content
 * - referenced blocks via "#id" syntax
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const fragment = document.createDocumentFragment();

  getRows(block).forEach((row) => {
    const [titleEl, bodyEl] = row.children;
    const item = renderAccordionItem(getText(titleEl));
    const contentEl = item.querySelector('.accordion__content');
    populateAccordionContent(contentEl, bodyEl);
    fragment.append(item);
  });

  block.replaceChildren(fragment);

  setLinksToOpenInNewTab(block);
  enableSingleOpenBehavior(block);
}
