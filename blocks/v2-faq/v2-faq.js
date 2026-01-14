import { decorateIcons } from '../../scripts/common.js';

const BLOCK_NAME = 'v2-faq';
const FAQ_SCHEMA_SELECTOR = 'script[type="application/ld+json"][data-v2-faq]';

const GLOBAL_KEYS = {
  ENTRIES_BY_BLOCK: '__v2FaqEntriesByBlock',
  SCHEMA_SCHEDULED: '__v2FaqSchemaScheduled',
};

// Initialize global state once per page
window[GLOBAL_KEYS.ENTRIES_BY_BLOCK] = window[GLOBAL_KEYS.ENTRIES_BY_BLOCK] || new Map();
window[GLOBAL_KEYS.SCHEMA_SCHEDULED] = window[GLOBAL_KEYS.SCHEMA_SCHEDULED] || false;

/**
 * Normalize text content from a DOM node.
 * Safely handles nullish values by returning an empty string.
 *
 * @param {Element | null | undefined} el
 * @returns {string}
 */
const normalizeTextContent = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  [String.fromCharCode(39)]: '&#39;',
};

/**
 * Escape text for safe HTML insertion.
 * @param {string} str
 * @returns {string}
 */
const escapeHtmlText = (str = '') => str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] || ch);

/**
 * Create a unique id fragment for block-scoped DOM ids.
 * Prefers `crypto.randomUUID()` when available; falls back to a random hex string.
 * @returns {string}
 */
const createStableId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(16).slice(2);
};

/**
 * Ensure a stable block id on the element.
 * The id is stored in `data-v2-faq-id` so it persists across re-decorations.
 * @param {HTMLElement} block
 * @returns {string}
 */
const getOrCreateBlockId = (block) => {
  if (!block.dataset.v2FaqId) {
    block.dataset.v2FaqId = `${BLOCK_NAME}-${createStableId()}`;
  }
  return block.dataset.v2FaqId;
};

/**
 * Extract FAQ items from authored markup.
 *
 * Security note:
 * - `answerHtml` is treated as trusted HTML from the authoring pipeline (EDS).
 * - It may contain markup (links, lists, formatting).
 * - If this assumption changes, sanitize `answerHtml` before rendering.
 *
 * @param {HTMLElement} block
 * @returns {{ question: string, answerText: string, answerHtml: string }[]}
 */
const extractFaqItems = (block) => {
  const rows = [...block.children];

  return rows
    .map((row) => {
      if (!row?.children || row.children.length < 2) {
        return null;
      }
      const questionCell = row.children[0];
      const answerCell = row.children[1];
      if (!questionCell || !answerCell) {
        return null;
      }

      const question = normalizeTextContent(questionCell);
      const answerText = normalizeTextContent(answerCell);
      const answerHtml = (answerCell.innerHTML || '').trim();

      if (!question || !answerText) {
        return null;
      }
      return { question, answerText, answerHtml };
    })
    .filter(Boolean);
};

/**
 * Render a single FAQ item as HTML.
 * @param {{ question: string, answerHtml: string }} item
 * @param {string} blockId
 * @param {number} index
 * @returns {string}
 */
const renderFaqItemMarkup = ({ question, answerHtml }, blockId, index) => {
  const buttonId = `${blockId}-btn-${index}`;
  const panelId = `${blockId}-panel-${index}`;

  return `
    <div class="${BLOCK_NAME}__item">
      <button
        class="${BLOCK_NAME}__button"
        id="${buttonId}"
        aria-expanded="false"
        aria-controls="${panelId}"
        type="button"
      >
        <span class="${BLOCK_NAME}__title">${escapeHtmlText(question)}</span>
        <span class="${BLOCK_NAME}__icon" aria-hidden="true">
          <span class="icon icon-dropdown-caret-wide"></span>
        </span>
      </button>

      <div
        class="${BLOCK_NAME}__panel"
        id="${panelId}"
        role="region"
        aria-labelledby="${buttonId}"
        aria-hidden="true"
        hidden
      >
        ${answerHtml}
      </div>
    </div>
  `;
};

/**
 * Render all FAQ items into the block.
 * @param {HTMLElement} block
 * @param {{ question: string, answerText: string, answerHtml: string }[]} items
 * @param {string} blockId
 * @returns {void}
 */
const renderFaqItems = (block, items, blockId) => {
  block.innerHTML = items.map((item, i) => renderFaqItemMarkup(item, blockId, i)).join('');
  decorateIcons(block);
};

/**
 * Find the panel controlled by a button (via aria-controls).
 * @param {HTMLButtonElement} button
 * @returns {HTMLElement|null}
 */
const getPanelForButton = (block, button) => {
  const panelId = button.getAttribute('aria-controls');
  if (!panelId) {
    return null;
  }
  return block.getElementById(panelId);
};

/**
 * Toggle a single accordion item.
 *
 * State invariants:
 * - When expanded:
 *   - button[aria-expanded="true"]
 *   - panel is visible (no `hidden`)
 *   - panel[aria-hidden="false"]
 * - When collapsed:
 *   - button[aria-expanded="false"]
 *   - panel has `hidden`
 *   - panel[aria-hidden="true"]
 *
 * @param {HTMLButtonElement} button
 * @param {HTMLElement} panel
 * @returns {void}
 */
const toggleAccordionItem = (button, panel) => {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  const nextExpanded = !expanded;

  button.setAttribute('aria-expanded', String(nextExpanded));

  if (nextExpanded) {
    panel.removeAttribute('hidden');
    panel.setAttribute('aria-hidden', 'false');
  } else {
    panel.setAttribute('hidden', '');
    panel.setAttribute('aria-hidden', 'true');
  }

  button.parentElement?.classList.toggle(`${BLOCK_NAME}__item--open`, nextExpanded);
};

/**
 * Bind delegated click handling for accordion toggles (once per block).
 * @param {HTMLElement} block
 * @returns {void}
 */
const bindAccordionToggle = (block) => {
  if (block.dataset.v2FaqBound) {
    return;
  }

  block.addEventListener('click', (e) => {
    const button = e.target?.closest?.(`.${BLOCK_NAME}__button`);
    if (!button || !block.contains(button)) {
      return;
    }

    const panel = getPanelForButton(block, button);
    if (!panel || !block.contains(panel)) {
      return;
    }

    toggleAccordionItem(button, panel);
  });

  block.dataset.v2FaqBound = 'true';
};

/**
 * Register or remove FAQ entries for a specific block in the global registry.
 *
 * This registry is later used to generate a single, de-duplicated FAQPage
 * JSON-LD schema for the entire page.
 *
 * - If the block has valid entries, they are stored under its blockId.
 * - If no valid entries exist, the block is removed from the registry.
 *
 * @param {string} blockId
 * @param {{ question: string, answerText: string, answerHtml: string }[]} items
 * @returns {void}
 */
const setBlockEntries = (blockId, items) => {
  const entries = items.map(({ question, answerText }) => ({ question, answer: answerText }));
  const registry = window[GLOBAL_KEYS.ENTRIES_BY_BLOCK];

  if (entries.length) {
    registry.set(blockId, entries);
  } else {
    registry.delete(blockId);
  }
};

/**
 * Normalize a string for deduplication:
 * - collapse whitespace
 * - trim
 * @param {string} str
 * @returns {string}
 */
const normalizeForDedupeKey = (str = '') => str.replace(/\s+/g, ' ').trim();

/**
 * De-duplicate entries across blocks.
 * Deduplication is whitespace-insensitive for both question and answer.
 * @param {{ question: string, answer: string }[]} entries
 * @returns {{ question: string, answer: string }[]}
 */
const dedupeEntries = (entries) => {
  const seen = new Set();

  return entries.filter(({ question, answer }) => {
    const key = `${normalizeForDedupeKey(question)}\u0000${normalizeForDedupeKey(answer)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Collect all entries across blocks and de-duplicate them.
 * @returns {{ question: string, answer: string }[]}
 */
const getAllEntriesDeduplicated = () => {
  const registry = window[GLOBAL_KEYS.ENTRIES_BY_BLOCK];
  const all = Array.from(registry.values()).flat();
  return dedupeEntries(all);
};

/**
 * Build a FAQPage JSON-LD object (schema.org / Google FAQPage).
 *
 * Notes:
 * - `question` and `answer` must be plain text (no HTML).
 * - The result is serialized with `JSON.stringify` and injected into a
 *   `<script type="application/ld+json">` tag.
 *
 * @param {{ question: string, answer: string }[]} entries
 * @returns {Record<string, any>}
 */
const buildFaqJsonLdSchema = (entries) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: entries.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

/**
 * Create, update, or remove the page-level FAQPage JSON-LD script.
 *
 * Guarantees:
 * - At most ONE FAQPage script with `data-v2-faq` exists on the page.
 * - Script is removed when no valid FAQ entries are registered.
 *
 * @returns {void}
 */
const updateFaqSchemaScript = () => {
  const entries = getAllEntriesDeduplicated();
  const existing = document.querySelector(FAQ_SCHEMA_SELECTOR);

  if (!entries.length) {
    existing?.remove();
    return;
  }

  const json = JSON.stringify(buildFaqJsonLdSchema(entries));

  const script = existing || document.createElement('script');
  if (!existing) {
    script.type = 'application/ld+json';
    script.dataset.v2Faq = 'true';
    document.head.appendChild(script);
  }

  script.textContent = json;
};

/**
 * Batch schema updates across blocks (one per frame).
 * @returns {void}
 */
const scheduleSchemaUpdate = () => {
  if (window[GLOBAL_KEYS.SCHEMA_SCHEDULED]) {
    return;
  }

  window[GLOBAL_KEYS.SCHEMA_SCHEDULED] = true;
  requestAnimationFrame(() => {
    try {
      updateFaqSchemaScript();
    } finally {
      window[GLOBAL_KEYS.SCHEMA_SCHEDULED] = false;
    }
  });
};

export default function decorate(block) {
  const blockId = getOrCreateBlockId(block);
  const items = extractFaqItems(block);

  renderFaqItems(block, items, blockId);
  bindAccordionToggle(block);

  setBlockEntries(blockId, items);
  scheduleSchemaUpdate();
}
