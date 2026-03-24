import { loadCSS, getMetadata } from './aem.js';

const DEFAULT_PLACEHOLDER_LOCALE = 'en';
let placeholders = null;
let placeholdersPromise = null;

const formatValues = (values) => {
  const obj = {};
  if (values) {
    values.forEach(({ name, value }) => (obj[name] = value));
  }
  return obj;
};

// The `key` key MUST exist in the object
// The rest of the params will be key-value pairs of the main key
const formatValuesByKey = (values) =>
  (values &&
    values.reduce((acc, { key, ...rest }) => {
      acc[key] = rest;
      return acc;
    }, {})) ||
  {};

const getLanguagePath = () => {
  const { pathname } = new URL(window.location.href);
  const langCodeMatch = pathname.match('^(/[a-z]{2}(-[a-z]{2})?/).*');
  return langCodeMatch ? langCodeMatch[1] : '/';
};

/**
 * loads the constants file where configuration values are stored
 */
async function getConstantValues() {
  const constantsUrl = `${getLanguagePath()}constants.json`;

  try {
    const response = await fetch(constantsUrl);

    if (!response.ok) {
      console.error('[constants] Failed to fetch constants:', response.status, response.statusText, constantsUrl);
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('[constants] Error fetching constants file:', constantsUrl, error);
    return {};
  }
}

const CONSTANTS = (await getConstantValues()) || {};
const {
  searchConfig,
  cookieValues,
  magazineConfig,
  headerConfig,
  tools,
  truckConfiguratorUrls,
  myGarageUrls,
  newsFeedConfig,
  feeds,
  holidays,
  placeholdersConfig,
} = CONSTANTS;

// This data comes from the sharepoint 'constants.xlsx' file
const SEARCH_CONFIGS = formatValues(searchConfig?.data);
const COOKIE_CONFIGS = formatValues(cookieValues?.data);
const MAGAZINE_CONFIGS = formatValues(magazineConfig?.data);
const HEADER_CONFIGS = formatValues(headerConfig?.data);
const TOOLS_CONFIGS = formatValues(tools?.data);
const TRUCK_CONFIGURATOR_URLS = formatValues(truckConfiguratorUrls?.data);
const NEWS_FEED_CONFIGS = formatValues(newsFeedConfig?.data);
const FEEDS = formatValuesByKey(feeds?.data);
const MY_GARAGE_URLS = formatValues(myGarageUrls?.data);
const HOLIDAYS = formatValues(holidays?.data);
const PLACEHOLDERS_URL = formatValues(placeholdersConfig?.data)?.PLACEHOLDERS_URL;

/**
 * Resolves the localized text for a single placeholder row.
 *
 * Fallback order:
 * 1. Exact locale (e.g. "fr-ca")
 * 2. Base language (e.g. "fr")
 * 3. Any matching language variant (e.g. "fr-*", deterministic)
 * 4. Default locale (DEFAULT_PLACEHOLDER_LOCALE)
 *
 * @param {Object} placeholderRow
 * @param {string} pageLocale
 * @returns {string}
 */
function resolveTextForLocale(placeholderRow, pageLocale) {
  if (!placeholderRow || typeof placeholderRow !== 'object') {
    return '';
  }

  const pageLocaleNormalized = String(pageLocale || '')
    .toLowerCase()
    .trim();
  const languageCode = pageLocaleNormalized ? pageLocaleNormalized.split('-')[0] : '';

  const readText = (value) => {
    if (typeof value !== 'string') {
      return '';
    }
    return value.trim() || '';
  };

  if (pageLocaleNormalized) {
    const exactLocaleText = readText(placeholderRow[pageLocaleNormalized]);
    if (exactLocaleText) {
      return exactLocaleText;
    }
  }

  if (languageCode) {
    const baseLanguageText = readText(placeholderRow[languageCode]);
    if (baseLanguageText) {
      return baseLanguageText;
    }

    const languageVariantPrefix = `${languageCode}-`;
    let bestVariantColumnKey = '';
    let bestVariantColumnKeyNormalized = '';

    for (const columnKey of Object.keys(placeholderRow)) {
      const columnKeyNormalized = String(columnKey).toLowerCase();
      if (!columnKeyNormalized.startsWith(languageVariantPrefix)) {
        continue;
      }
      if (!bestVariantColumnKey || columnKeyNormalized < bestVariantColumnKeyNormalized) {
        bestVariantColumnKey = columnKey;
        bestVariantColumnKeyNormalized = columnKeyNormalized;
      }
    }

    if (bestVariantColumnKey) {
      const variantText = readText(placeholderRow[bestVariantColumnKey]);
      if (variantText) {
        return variantText;
      }
    }
  }

  return readText(placeholderRow[DEFAULT_PLACEHOLDER_LOCALE]);
}

/**
 * Builds a map of placeholder keys to resolved localized values.
 *
 * Rows without a valid key or resolved text are ignored.
 * Duplicate keys overwrite previous values and log a warning.
 *
 * @param {Object} placeholdersPayload
 * @param {string} pageLocale
 * @returns {Map<string, string>}
 */
function buildPlaceholdersMap(placeholdersPayload, pageLocale) {
  const dataRows = Array.isArray(placeholdersPayload?.data) ? placeholdersPayload.data : [];
  const placeholdersByKey = new Map();

  for (const dataRow of dataRows) {
    const authoredKey = dataRow?.Key ?? dataRow?.key;
    if (authoredKey === undefined || authoredKey === null) {
      continue;
    }

    const placeholderKey = String(authoredKey).trim();
    if (!placeholderKey) {
      continue;
    }

    const resolvedText = resolveTextForLocale(dataRow, pageLocale);
    if (!resolvedText) {
      continue;
    }

    if (placeholdersByKey.has(placeholderKey)) {
      console.warn('[placeholders] Duplicate placeholder key:', placeholderKey);
    }

    placeholdersByKey.set(placeholderKey, resolvedText);
  }

  return placeholdersByKey;
}

/**
 * Loads and caches the placeholders map for the current locale.
 * Ensures a single in-flight request. On failure, an empty map is stored.
 *
 * @returns {Promise<void>}
 */
async function getPlaceholders() {
  if (placeholders) {
    return Promise.resolve();
  }

  if (placeholdersPromise) {
    return placeholdersPromise;
  }

  const locale = getLocale();
  const pageLocale = locale ? locale.toLowerCase().trim() : DEFAULT_PLACEHOLDER_LOCALE;
  const placeholdersUrl = typeof PLACEHOLDERS_URL === 'string' ? PLACEHOLDERS_URL.trim() : '';

  if (!placeholdersUrl) {
    console.error('[placeholders] Missing PLACEHOLDERS_URL.');
    placeholders = new Map();
    return Promise.resolve();
  }

  placeholdersPromise = (async () => {
    try {
      const response = await fetch(placeholdersUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch placeholders (${response.status} ${response.statusText})`);
      }

      const placeholdersPayload = await response.json();
      const dataRows = Array.isArray(placeholdersPayload?.data) ? placeholdersPayload.data : [];

      if (dataRows.length) {
        const hasLocaleColumn = dataRows.some((dataRow) => {
          return dataRow && typeof dataRow === 'object' && pageLocale in dataRow;
        });

        if (!hasLocaleColumn) {
          console.warn('[placeholders] Locale column missing in placeholder file:', pageLocale);
        }
      }

      placeholders = buildPlaceholdersMap(placeholdersPayload, pageLocale);
    } catch (error) {
      console.error('[placeholders] Fetch failed:', { url: placeholdersUrl, error });
      placeholders = new Map();
    } finally {
      placeholdersPromise = null;
    }
  })();

  return placeholdersPromise;
}

/**
 * Return the resolved placeholder text for a key.
 *
 * @param {string} key
 * @returns {string}
 */
function getTextLabel(key) {
  return placeholders?.get(key) ?? key;
}

/**
 * Returns the true origin of the current page in the browser.
 * If the page is running in a iframe with srcdoc, the ancestor origin is returned.
 * @returns {String} The true origin
 */
function getOrigin() {
  return window.location.href === 'about:srcdoc' ? window.parent.location.origin : window.location.origin;
}

/**
 * Returns the true of the current page in the browser.mac
 * If the page is running in a iframe with srcdoc,
 * the ancestor origin + the path query param is returned.
 * @returns {String} The href of the current page or the href of the block running in the library
 */
function getHref() {
  if (window.location.href !== 'about:srcdoc') {
    return window.location.href;
  }

  const urlParams = new URLSearchParams(window.parent.location.search);

  return `${window.parent.location.origin}${urlParams.get('path')}`;
}

/**
 * Create an element with the given id and classes.
 * @param {string} tagName the tag
 * @param {Object} options the element options
 * @param {string[]|string} [options.classes=[]] the class or classes to add
 * @param {Object} [options.props={}] any other attributes to add to the element
 * @returns {HTMLElement} the element
 */
function createElement(tagName, options = {}) {
  const { classes = [], props = {} } = options;
  const elem = document.createElement(tagName);
  const isString = typeof classes === 'string';
  if (classes || (isString && classes !== '') || (!isString && classes.length > 0)) {
    const classesArr = isString ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (!isString && classes.length === 0) {
    elem.removeAttribute('class');
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      const isBooleanAttribute = propName === 'allowfullscreen' || propName === 'autoplay' || propName === 'muted' || propName === 'controls';

      // For boolean attributes, add the attribute without a value if it's truthy
      if (isBooleanAttribute) {
        if (props[propName]) {
          elem.setAttribute(propName, '');
        }
      } else {
        const value = props[propName];
        elem.setAttribute(propName, value);
      }
    });
  }

  return elem;
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
function addFavIcon(href) {
  const link = createElement('link', { props: { rel: 'icon', type: 'image/svg+xml', href } });
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

const ICONS_CACHE = {};

/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} [element] Element containing icons
 */
async function decorateIcons(element) {
  // Prepare the inline sprite
  let svgSprite = document.getElementById('franklin-svg-sprite');
  if (!svgSprite) {
    const div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    document.body.append(div.firstElementChild);
  }

  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(
    icons.map(async (span) => {
      const iconName = Array.from(span.classList)
        .find((c) => c.startsWith('icon-'))
        .substring(5);
      if (!ICONS_CACHE[iconName]) {
        ICONS_CACHE[iconName] = true;
        try {
          const response = await fetch(`${window.hlx.codeBasePath}/icons/${iconName}.svg`);
          if (!response.ok) {
            ICONS_CACHE[iconName] = false;
            return;
          }
          // Styled icons don't play nice with the sprite approach because of shadow dom isolation
          const svg = await response.text();
          if (svg.match(/(<style | class=)/)) {
            ICONS_CACHE[iconName] = { styled: true, html: svg };
          } else {
            ICONS_CACHE[iconName] = {
              html: svg
                .replace('<svg', `<symbol id="icons-sprite-${iconName}"`)
                .replace(/ width=".*?"/, '')
                .replace(/ height=".*?"/, '')
                .replace('</svg>', '</symbol>'),
            };
          }
        } catch (error) {
          ICONS_CACHE[iconName] = false;

          console.error(error);
        }
      }
    }),
  );

  const symbols = Object.keys(ICONS_CACHE)
    .filter((k) => !svgSprite.querySelector(`#icons-sprite-${k}`))
    .map((k) => ICONS_CACHE[k])
    .filter((v) => !v.styled)
    .map((v) => v.html)
    .join('\n');
  svgSprite.innerHTML += symbols;

  icons.forEach((span) => {
    const iconName = Array.from(span.classList)
      .find((c) => c.startsWith('icon-'))
      .substring(5);
    const parent = span.firstElementChild?.tagName === 'A' ? span.firstElementChild : span;
    // Styled icons need to be inlined as-is, while unstyled ones can leverage the sprite
    if (ICONS_CACHE[iconName].styled) {
      parent.innerHTML = ICONS_CACHE[iconName].html;
    } else {
      parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`;
    }
  });
}

/**
 * Replace double squared brackets word with a <span> with black label styling
 * @param {Element} [element] HTML element containing a word between [[square brackets]]
 */
function decorateBlackLabel(element) {
  const regex = /\[\[(.*?)\]\]/g;

  function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const replaced = node.textContent.replace(regex, '<span class="black-label">$1</span>');
      if (replaced !== node.textContent) {
        const temp = document.createElement('div');
        temp.innerHTML = replaced;
        node.parentElement.classList.add('black-label-container');
        node.replaceWith(...temp.childNodes);
      }
    } else {
      node.childNodes.forEach(replaceText);
    }
  }
  replaceText(element);
}

async function loadTemplate(doc, templateName) {
  try {
    await loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(`../templates/${templateName}/${templateName}.js`);
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          console.error(`Failed to load template ${templateName}`, error);
        }
        resolve();
      })();
    });
    await decorationComplete;
  } catch (error) {
    console.log(`failed to load block ${templateName}`, error);
  }
}

const removeEmptyTags = (block, isRecursive) => {
  const isEmpty = (node) => {
    const tagName = `</${node.tagName}>`;

    // exclude iframes
    if (node.tagName.toUpperCase() === 'IFRAME') {
      return false;
    }
    // checking that the tag is not autoclosed to make sure we don't remove <meta />
    // checking the innerHTML and trim it to make sure the content inside the tag is 0
    return node.outerHTML.slice(tagName.length * -1).toUpperCase() === tagName && node.innerHTML.trim().length === 0;
  };

  if (isRecursive) {
    block.querySelectorAll(':scope > *').forEach((node) => {
      if (node.children.length > 0) {
        removeEmptyTags(node, true);
      }

      if (isEmpty(node)) {
        node.remove();
      }
    });
    return;
  }

  block.querySelectorAll('*').forEach((node) => {
    if (isEmpty(node)) {
      node.remove();
    }
  });
};

/**
 * This function recursively traverses the child elements of a given element
 * and removes all <div> elements that have no attributes,
 * moving their children to the parent element.
 * @param {HTMLElement} element the parent element to remove its children
 * @param {Object} options the unwrap options
 * @param {boolean} [options.ignoreDataAlign=false] whether to ignore divs with data-align attribute
 * @returns {void}
 */
const unwrapDivs = (element, options = {}) => {
  const stack = [element];
  const { ignoreDataAlign = false } = options;

  while (stack.length > 0) {
    const currentElement = stack.pop();

    let i = 0;
    while (i < currentElement.children.length) {
      const node = currentElement.children[i];
      const attributesLength = [...node.attributes].filter((el) => {
        if (ignoreDataAlign) {
          return !(el.name.startsWith('data-align') || el.name.startsWith('data-valign'));
        }

        return el;
      }).length;

      if (node.tagName === 'DIV' && attributesLength === 0) {
        while (node.firstChild) {
          currentElement.insertBefore(node.firstChild, node);
        }
        node.remove();
      } else {
        stack.push(node);
        i += 1;
      }
    }
  }
};

const variantsClassesToBEM = (blockClasses, expectedVariantsNames, blockName) => {
  expectedVariantsNames.forEach((variant) => {
    if (blockClasses.contains(variant)) {
      blockClasses.remove(variant);
      blockClasses.add(`${blockName}--${variant}`);
    }
  });
};

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    // separate accent from letter
    .normalize('NFD')
    // remove all separated accents
    .replace(/[\u0300-\u036f]/g, '')
    // replace spaces with -
    .replace(/\s+/g, '-')
    // replace & with 'and'
    .replace(/&/g, '-and-')
    // remove all non-word chars
    .replace(/[^\w-]+/g, '')
    // replace multiple '-' with single '-'
    .replace(/--+/g, '-');

/**
 * Extracts the values from an array in format: ['key1: value1', 'key2: value2', 'key3: value3']
 * and returns this into an object with those keys and values:
 * { key1: value1, key2: value2, key3: value3 }
 * @param {Array} data - Array of strings that contain an object coming from sharepoint
 * @returns {Object} An parsed object with those values and keys
 */
const extractObjectFromArray = (data) => {
  if (!Array.isArray(data)) {
    return {};
  }
  const obj = {};
  for (const item of data) {
    try {
      if (typeof item !== 'string' || !item.includes(':')) {
        throw new TypeError(`Invalid input: "${item}". Expected a string: "key: value".`);
      }
      const [key, value] = item.split(':', 2);
      obj[key.trim()] = value.trim();
    } catch (error) {
      console.warn(`Error with item: "${item}"`, error);
    }
  }
  return obj;
};

/**
 * Check if one trust group is checked.
 * @param {String} groupName the one trust group like: C0002
 */
function checkOneTrustGroup(groupName, cookieCheck = false) {
  if (cookieCheck) {
    return true;
  }

  const activeGroups = window.OnetrustActiveGroups || '';
  if (activeGroups.includes(groupName)) {
    return true;
  }

  const consentCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('OptanonConsent='));
  if (!consentCookie) {
    return false;
  }

  const oneTrustCookie = decodeURIComponent(consentCookie);
  return oneTrustCookie.includes(`${groupName}:1`);
}

const { PERFORMANCE_COOKIE = false, FUNCTIONAL_COOKIE = false, TARGETING_COOKIE = false, SOCIAL_COOKIE = false } = COOKIE_CONFIGS;

function isPerformanceAllowed() {
  return checkOneTrustGroup(PERFORMANCE_COOKIE);
}

function isFunctionalAllowed() {
  return checkOneTrustGroup(FUNCTIONAL_COOKIE);
}

function isTargetingAllowed() {
  console.log(checkOneTrustGroup(TARGETING_COOKIE));
  console.log(TARGETING_COOKIE);
  return checkOneTrustGroup(TARGETING_COOKIE);
}

function isSocialAllowed() {
  return checkOneTrustGroup(SOCIAL_COOKIE);
}

/**
 * Helper for delaying a function
 * @param {function} func callback function
 * @param {number} timeout time to debouce in ms, default 200
 */
function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Returns a list of properties listed in the block
 * @param {string} route get the Json data from the route
 * @returns {Object} the json data object
 */
const getJsonFromUrl = async (route) => {
  try {
    const response = await fetch(route);
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('getJsonFromUrl:', { error });
  }
  return null;
};

/**
 * See https://www.aem.live/developer/spreadsheets#arrays
 * Converts a string representation of an array, removing all brackets, backslashes, and quotes,
 * into an actual JavaScript array. Splits on commas, trims each string, and filters out empty
 * strings to ensure all elements contain valid data.
 *
 * @param {string} inputString - The string to be converted. It should mimic a serialized array,
 *                               often found in JSON-like structures where arrays are represented
 *                               as strings due to data transmission constraints.
 * @returns {string[]} An array of strings derived from the cleaned input string. Each element
 *                     is a trimmed, non-empty string that was separated by a comma in the
 *                     original input.
 */
const formatStringToArray = (inputString) => {
  if (typeof inputString !== 'string') {
    return [];
  }

  const cleanedString = inputString.replace(/[[\]\\'"]+/g, '');
  return cleanedString
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item);
};

/*
  The generateId function should be used only
  for generating the id for UI elements
*/
let idValue = 0;

const generateId = (prefix = 'id') => {
  idValue += 1;
  return `${prefix}-${idValue}`;
};

const adjustPretitle = (element) => {
  const headingSelector = 'h1, h2, h3, h4, h5, h6';

  [...element.querySelectorAll(headingSelector)].forEach((heading) => {
    const isNextElHeading = heading.nextElementSibling?.matches(headingSelector);
    if (!isNextElHeading) {
      return;
    }

    const currentLevel = Number(heading.tagName[1]);
    const nextElLevel = Number(heading.nextElementSibling.tagName[1]);

    if (currentLevel > nextElLevel) {
      const pretitle = createElement('span', { classes: ['pretitle'] });
      pretitle.append(...heading.childNodes);

      heading.replaceWith(pretitle);
    }
  });
};

/**
 * Extracts the URL without query parameters of images from an array of picture elements
 * @param {HTMLElement} images - An array of picture elements
 * @returns {Array} Array of src strings
 */
function getImageURLs(pictures) {
  return pictures.map((picture) => {
    const imgElement = picture.querySelector('img');
    return imgElement.getAttribute('src').split('?')[0];
  });
}

/**
 * Creates a picture element based on provided image data and breakpoints
 * @param {Array} images - Array of objects defining image data and breakpoints
 * @param {boolean} eager - Whether to load images eagerly
 * @param {string} alt - Alt text for the image
 * @param {string[]|string} imageClass - Class for the image
 * @returns {HTMLElement} The created picture element
 */
function createResponsivePicture(images, eager, alt, imageClass) {
  const picture = document.createElement('picture');
  let fallbackWidth = '';
  let fallbackSrc = '';

  function constructSrcset(src, width, format) {
    const baseUrl = `${src}?format=${format}&optimize=medium`;
    return `${baseUrl}&width=${width} 1x, ${baseUrl}&width=${width * 2} 2x`;
  }

  images.forEach((image) => {
    const originalFormat = image.src.split('.').pop();

    image.breakpoints.forEach((bp) => {
      if (!bp.media) {
        return;
      }

      const srcsetWebp = constructSrcset(image.src, bp.width, 'webp');
      const srcsetOriginal = constructSrcset(image.src, bp.width, originalFormat);

      const webpSource = createElement('source', {
        props: {
          type: 'image/webp',
          srcset: srcsetWebp,
          media: bp.media,
        },
      });

      const originalSource = createElement('source', {
        props: {
          type: `image/${originalFormat}`,
          srcset: srcsetOriginal,
          media: bp.media,
        },
      });

      picture.insertBefore(originalSource, picture.firstChild);
      picture.insertBefore(webpSource, originalSource);
    });

    const fallbackBreakpoint = image.breakpoints.find((bp) => !bp.media);
    if (fallbackBreakpoint && !fallbackSrc) {
      fallbackWidth = fallbackBreakpoint.width;
      fallbackSrc = `${image.src}?width=${fallbackWidth}&format=${originalFormat}&optimize=medium`;
    }
  });

  const img = createElement('img', {
    classes: imageClass,
    props: {
      src: fallbackSrc,
      alt,
      loading: eager ? 'eager' : 'lazy',
      width: fallbackWidth,
    },
  });

  picture.appendChild(img);

  return picture;
}

const deepMerge = (originalTarget, source) => {
  let target = originalTarget;
  // Initialize target as an empty object if it's undefined or null
  if (typeof target !== 'object' || target === null) {
    target = {};
  }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];
    const sourceIsPlainObject = Object.prototype.toString.call(sourceValue) === '[object Object]';
    const targetIsPlainObject = Object.prototype.toString.call(targetValue) === '[object Object]';

    if (sourceIsPlainObject && targetIsPlainObject) {
      target[key] = target[key] || {};
      deepMerge(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};

const isDevHost = () => {
  const devHosts = ['localhost', '127.0.0.1', 'aem.page', 'aem.live'];
  return devHosts.some((url) => window.location.host.includes(url));
};

/**
 * Function that checks for the locale field in metadata an returns it.
 * It defaults to 'en-us'
 * @returns {string} The locale string
 */
const getLocale = () => getMetadata('locale') || 'en-us';

/**
 * Clear/removes all of the attributes of an element by reference
 * @param {HTMLElement} element - Element to clear attributes from
 * @returns {HTMLElement} The created picture element
 *
 * USAGE:
 * Clean by reference:
 *
 * clearElementAttributes(element);
 * // Then do things on the clean element...
 *
 * OR, leverage the return of the element and do chaining operations:
 *
 * removeAllAttributes(element).classList.add('SOME-CLASS-NAME');
 *
 */
const clearElementAttributes = (element) => {
  // Get all attributes of the element
  const attributes = Array.from(element.attributes);

  // Loop through the attributes and remove them
  attributes.forEach((attr) => {
    element.removeAttribute(attr.name);
  });

  return element;
};

/**
 * Get a HTML link element and adds the target=blank attribute if href is external
 * @param {HTMLElement} link - Anchor HTML element with an href attribute
 */
function addTargetBlankToExternalLink(link) {
  if (!link.href) {
    return;
  }
  const url = link.href;
  const isExternal = !url.match('macktrucks') && !url.match('.hlx.(page|live)') && !url.match('.aem.(page|live)') && !url.match('localhost');
  if (url.match('build.macktrucks') || url.endsWith('.pdf') || isExternal) {
    link.target = '_blank';
  }
}

/**
 * Receives a lowercase string and capitalizes it.
 * Useful for elements not reachable by css fe: select <options>
 * @param {string} str - lowercase string fe: 'mack trucks'.
 * @returns {string} The capitalized string fe: 'Mack Trucks'.
 */
const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function isInsideSection(element) {
  const sections = document.querySelectorAll('.section');
  return Array.from(sections).some((section) => section.contains(element));
}

/**
 * Validates if a string is a valid ISO 8601 date.
 *
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - True if the string is a valid ISO 8601 date; otherwise, false.
 */
const isValidISODateString = (dateString) => {
  if (typeof dateString !== 'string') {
    return false;
  }

  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    return false;
  }

  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
  return iso8601Regex.test(dateString);
};

/**
 * Formats a time unit by adding a leading zero for two-digit formatting.
 *
 * @param {number} value - The value to format.
 * @returns {string} - The formatted value as a two-digit string.
 */
const formatTimeUnit = (value) => String(value).padStart(2, '0');

/**
 * Checks if the current screen is mobile.
 *
 * @returns {boolean} true if it matched the media query
 */
const isMobileViewport = () => {
  const MQ = window.matchMedia('(max-width: 744px)');

  return MQ.matches;
};

/**
 * Normalize a string intended to be used as a URL.
 *
 * - Coerces `undefined`/`null` to an empty string.
 * - Replaces non-breaking spaces with regular spaces.
 * - Strips out angle brackets (`<`, `>`).
 * - Trims leading/trailing whitespace.
 *
 * @param {string} [s] - Raw string (possibly from DOM or dataset).
 * @returns {string} A cleaned string safe to pass to `new URL()`.
 */
const normalizeUrlText = (s) =>
  String(s || '')
    .replace(/\u00A0/g, ' ')
    .replace(/[<>]/g, '')
    .trim();

/**
 * Test whether a given URL protocol is HTTP or HTTPS.
 *
 * @param {string} protocol - Protocol string (e.g. `"http:"`, `"https:"`).
 * @returns {boolean} `true` if the protocol is HTTP/HTTPS, otherwise `false`.
 */
const isHttp = (protocol) => /^https?:$/i.test(protocol);

export {
  loadCSS,
  getMetadata,
  placeholders,
  formatValues,
  formatValuesByKey,
  getLanguagePath,
  getConstantValues,
  SEARCH_CONFIGS,
  COOKIE_CONFIGS,
  MAGAZINE_CONFIGS,
  HEADER_CONFIGS,
  TOOLS_CONFIGS,
  TRUCK_CONFIGURATOR_URLS,
  MY_GARAGE_URLS,
  NEWS_FEED_CONFIGS,
  FEEDS,
  HOLIDAYS,
  getPlaceholders,
  getTextLabel,
  getOrigin,
  getHref,
  createElement,
  addFavIcon,
  decorateIcons,
  decorateBlackLabel,
  loadTemplate,
  removeEmptyTags,
  unwrapDivs,
  variantsClassesToBEM,
  slugify,
  extractObjectFromArray,
  checkOneTrustGroup,
  PERFORMANCE_COOKIE,
  FUNCTIONAL_COOKIE,
  TARGETING_COOKIE,
  SOCIAL_COOKIE,
  isPerformanceAllowed,
  isFunctionalAllowed,
  isTargetingAllowed,
  isSocialAllowed,
  debounce,
  getJsonFromUrl,
  formatStringToArray,
  generateId,
  adjustPretitle,
  getImageURLs,
  createResponsivePicture,
  deepMerge,
  isDevHost,
  getLocale,
  clearElementAttributes,
  addTargetBlankToExternalLink,
  capitalizeWords,
  isInsideSection,
  isValidISODateString,
  formatTimeUnit,
  isMobileViewport,
  normalizeUrlText,
  isHttp,
};
