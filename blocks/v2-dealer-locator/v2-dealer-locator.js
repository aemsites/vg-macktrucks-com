import { loadScript, loadCSS, readBlockConfig } from '../../scripts/aem.js';
import { TOOLS_CONFIGS, isMobileViewport } from '../../scripts/common.js';
import template from './shared/template.js';

const { GOOGLE_API_KEY } = TOOLS_CONFIGS;

/**
 * Escapes HTML characters from a string.
 *
 * @returns {string} The escaped string
 */
function escapeHTML(input) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Wrapper around loadScript to avoid the duplication in this file around:
 * `{ type: 'text/javascript', charset: 'UTF-8' }`
 *
 * @returns {Promise} Promise that resolves when the script is loaded
 */
const loadComponentScript = (scriptlink) => loadScript(scriptlink, { type: 'text/javascript', charset: 'UTF-8' });

/**
 * Gets the zip code from the URL query string.
 *
 * @returns {string} Zip code from the URL query string
 */
const getZipCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hasZipLocation = searchParams.has('l');

  return hasZipLocation ? escapeHTML(searchParams.get('l')) : '';
};

/**
 * Converts a string with values separated by commas into an array of strings.
 *
 * @param {string} amenitiesString - Amenities string to parse. Example:
 *  "Appointments Accepted, Bilingual Service, Driver Lounge"
 * @returns {Array.<string>} Extracted config object
 */
const parseAmenities = (amenitiesString) => {
  const amenities = amenitiesString?.split(',').map((amenity) => amenity.trim()) || [];

  return amenities;
};

/**
 * Extracts the config object from the block element.
 *
 * @param {HTMLElement} block - The block element
 * @returns {Array.<string>} Extracted config object
 */
const getBlockConfigs = (block) => {
  const config = readBlockConfig(block);

  if (config?.amenities) {
    config.amenities = parseAmenities(config.amenities);
  }

  return config;
};

export default async function decorate(block) {
  const zipCode = getZipCode();
  const isMobile = isMobileViewport();
  const blockConfig = getBlockConfigs(block);
  const isExportMarket = blockConfig.version?.toLowerCase() === 'export-market';

  // blockConfig.datasource is a required field for the block to work:
  if (!blockConfig.datasource) {
    console.error('The block is missing the datasource field in the configuration.');
  } else if (!GOOGLE_API_KEY) {
    console.error('The block is missing the %cGOOGLE_API_KEY%c in the %cTOOLS_CONFIGS', 'color: red;', 'color: initial;', 'color: red;');
  } else {
    window.locatorConfig = {
      asist: false,
      showAsistDialog: true,
      consolidateFilters: true,
      selectedBrand: 'mack',
      dataSource: blockConfig.datasource,
      apiKey: GOOGLE_API_KEY,
      version: blockConfig.version, // 'default' or 'export-market'
      country: blockConfig.country,
      amenities: blockConfig.amenities,
      coords: blockConfig.coords,
    };

    const sharedTemplate = template({ zipCode, isMobile, isExportMarket });

    if (isExportMarket) {
      loadCSS('/blocks/v2-dealer-locator/versions/export/dealer-locator.css');
    }

    block.innerHTML = sharedTemplate;

    loadComponentScript('/blocks/v2-dealer-locator/shared/vendor/jquery.min.js').then(() => {
      // These scripts depend on jquery

      if (isExportMarket) {
        loadComponentScript('/blocks/v2-dealer-locator/versions/export/sidebar-maps.js');
      } else {
        loadComponentScript('/blocks/v2-dealer-locator/versions/default/sidebar-maps.js');
      }

      loadComponentScript('/blocks/v2-dealer-locator/shared/my-dealer.js');
    });

    loadComponentScript('/blocks/v2-dealer-locator/shared/vendor/moment.js').then(() => {
      loadComponentScript('/blocks/v2-dealer-locator/shared/vendor/moment-timezone.min.js');
    });
  }
}
