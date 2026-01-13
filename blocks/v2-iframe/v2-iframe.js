import { createElement, variantsClassesToBEM } from '../../scripts/common.js';

const blockName = 'v2-iframe';
const variantClasses = ['fullscreen'];

/**
 * Returns the first class name matching the provided RegExp.
 *
 * @param {DOMTokenList} classList
 * @param {RegExp} pattern
 * @returns {string|null}
 */
const findClass = (classList, pattern) => [...classList].find((cls) => pattern.test(cls)) || null;

/**
 * Extracts a fixed height value from block classes (e.g. "600px").
 *
 * @param {HTMLElement} block
 * @returns {string|null}
 */
const getFixedHeight = (block) => findClass(block.classList, /^[0-9]+px$/);

/**
 * Extracts a max-width value from block classes (e.g. "width-800px").
 *
 * @param {HTMLElement} block
 * @returns {string|null}
 */
const getMaxWidth = (block) => findClass(block.classList, /^width-[0-9]+px$/)?.replace('width-', '') || null;

/**
 * Enables fullscreen mode for the iframe block.
 *
 * Adds:
 *  - `${blockName}-container--fullscreen` to the block container
 *  - `${blockName}-fullscreen` to the document body
 *
 * @param {HTMLElement} block
 */
const enableFullscreenMode = (block) => {
  const container = block.closest(`.${blockName}-container`);
  if (container) {
    container.classList.add(`${blockName}-container--fullscreen`);
  }
  document.body.classList.add(`${blockName}-fullscreen`);
};

/**
 * Creates an iframe element with default configuration.
 *
 * @param {string} src
 * @returns {HTMLIFrameElement}
 */
const createIframe = (src) =>
  createElement('iframe', {
    props: {
      src,
      frameborder: 0,
      loading: 'lazy',
    },
  });

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const isFullscreen = block.classList.contains(`${blockName}--fullscreen`);
  const src = block.querySelector('a')?.getAttribute('href') || '';

  const iframe = createIframe(src);

  if (!isFullscreen) {
    const fixedHeight = getFixedHeight(block);
    const maxWidth = getMaxWidth(block);

    if (fixedHeight) {
      iframe.height = fixedHeight;
    }

    if (maxWidth) {
      iframe.style.maxWidth = maxWidth;
    }
  } else {
    enableFullscreenMode(block);
  }

  block.replaceChildren(iframe);
}
