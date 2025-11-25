import { createElement, formatStringToArray } from './common.js';
import { loadScript, loadCSS, getMetadata } from './aem.js';
import { validateCountries } from './validate-countries.js';

/**
 * Convert metadata or comma-separated lists into clean arrays.
 */
const parseUrlList = (list) =>
  formatStringToArray(list || '')
    .map((u) => u?.trim())
    .filter(Boolean);

/**
 * Create the mount container and replace main content with it.
 */
const mountContainer = (main, appId) => {
  const container = createElement('div', { props: { id: appId } });
  main.replaceChildren(container);
  return container;
};

/**
 * Load JS and CSS assets safely.
 */
const loadAssets = (urls = {}, loadedScripts = new Set()) => {
  const jsUrls = parseUrlList(urls.JS);
  const cssUrls = parseUrlList(urls.CSS);

  jsUrls.forEach((url) => {
    if (!loadedScripts.has(url)) {
      loadedScripts.add(url);
      loadScript(url, { defer: 'defer', type: 'text/javascript', charset: 'UTF-8' });
    }
  });

  cssUrls.forEach((url) => loadCSS(url));
};

/**
 * Handle single metadata-based hash routing.
 */
const applyInitialRoute = (metadataPageKey) => {
  if (!metadataPageKey) {
    return;
  }

  const page = getMetadata(metadataPageKey)?.toLowerCase();
  if (!page) {
    return;
  }

  const expected = `#/${page}`;
  if (!location.hash.startsWith(expected)) {
    location.hash = expected;
  }
};

/**
 * Move the app class from <main> to <html>.
 */
const normalizeAppClass = (html, main, appClass) => {
  if (main.classList.contains(appClass)) {
    main.classList.remove(appClass);
    html.classList.add(appClass);
  }
};

/**
 * Optional country validation helper.
 */
const handleCountryRestrictions = () => {
  const allowed = getMetadata('allowed-countries');
  const redirectUrl = getMetadata('redirect-url');
  if (allowed && redirectUrl) {
    validateCountries(allowed, redirectUrl);
  }
};

/**
 * Main entry point for embedding an app.
 */
export const initEmbeddedApp = ({ appClass, appId, urls = {}, metadataPageKey, shouldDisableHeader = false, headerDetailClass = null }) => {
  const html = document.documentElement;
  const main = document.querySelector('main');

  if (!html.classList.contains(appClass) && !main.classList.contains(appClass)) {
    return;
  }

  normalizeAppClass(html, main, appClass);
  handleCountryRestrictions();
  mountContainer(main, appId);
  loadAssets(urls);
  applyInitialRoute(metadataPageKey);

  if (shouldDisableHeader && headerDetailClass) {
    html.classList.add(headerDetailClass);
  }
};
