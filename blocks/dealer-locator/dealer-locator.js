import { simplifiedReadBlockConfig, TOOLS_CONFIGS } from '../../scripts/common.js';
const { GOOGLE_API_KEY } = TOOLS_CONFIGS;

/**
 * Maps authored block config rows to the dealer locator component's mount options.
 * TODO: Consider refactoring this block to load/map all dealer locator mount
 * options from a JSON config file instead of hardcoding option extraction in
 * JS.
 *
 * Authorable block config keys (all optional unless noted):
 *
 * Core:
 * - `api-base-url`: Dealer search endpoint. Mandatory at runtime — the widget
 *   logs a console error when missing.
 * - `contact-form-post-url`: POST endpoint for the dealer contact form, expected
 *   to return `{ result: "success" | "error" }`. Required for contact form
 *   submissions to succeed.
 * - `initial-query`: Prefills the search field on first render.
 * - `google-maps-api-key`: Google Maps browser API key. Mandatory for map
 *   rendering unless a page-level meta tag provides it:
 *   `<meta name="google-maps-api-key" content="...">`
 *
 * Locale / theme:
 * - `locale`: BCP 47 locale tag controlling UI language and distance units.
 *   Defaults to `"en-US"`. Supported values: `"en-US"`, `"en-CA"`,
 *   `"es-419"`, `"fr-CA"`.
 * - `theme`: Visual theme applied to the widget. Defaults to `"volvo"`.
 *   Brand aliases (`volvo`, `mack`, `renault`) resolve to the light variant.
 *   Full IDs: `volvo-light`, `volvo-dark`, `mack-light`, `mack-dark`,
 *   `renault-light`, `renault-dark`. Invalid values fall back to `volvo-light`.
 *
 * Radius slider:
 * - `range-min`: Minimum selectable radius in miles. Default: `25`.
 * - `range-max`: Maximum selectable radius in miles. Default: `2000`.
 * - `range-initial-value`: Pre-selected radius on first render. Default: `100`.
 *
 * Map:
 * - `map-default-lat`: Default map center latitude before search/geolocation.
 *   Only applied when paired with `map-default-lng`.
 * - `map-default-lng`: Default map center longitude before search/geolocation.
 *   Only applied when paired with `map-default-lat`.
 * - `map-default-zoom`: Initial zoom level. Default: `4`.
 * - `map-min-zoom`: Minimum zoom allowed in map controls. Default: `2`.
 * - `map-max-zoom`: Maximum zoom allowed in map controls. Default: `18`.
 * - `scroll-zoom`: Enables scroll-wheel zoom on the map. Authored as `"true"`
 *   or `"false"`. Defaults to `true`. When `false`, the page scrolls normally
 *   over the map; Ctrl+scroll still zooms the map.
 *
 * Numeric values (`range-*`, `map-*-zoom`, `map-default-lat/lng`) are
 * pre-coerced to numbers by `simplifiedReadBlockConfig`; the widget also
 * sanitizes them before use so invalid values fall back to widget defaults.
 */
function toMountOptions(cfg) {
  const options = {
    apiBaseUrl: cfg.apiBaseUrl || undefined,
    theme: 'mack',
    requestAccessApiUrl: cfg.requestAccessApiUrl || undefined,
    initialQuery: cfg.initialQuery || undefined,
    // Prefer an authored key, otherwise fall back to a page-level meta contract.
    googleMapsApiKey: GOOGLE_API_KEY,
  };

  const { rangeMin, rangeMax, rangeInitialValue } = cfg;
  if (rangeMin !== undefined || rangeMax !== undefined || rangeInitialValue !== undefined) {
    options.range = {
      ...(rangeMin !== undefined ? { min: rangeMin } : {}),
      ...(rangeMax !== undefined ? { max: rangeMax } : {}),
      ...(rangeInitialValue !== undefined ? { initialValue: rangeInitialValue } : {}),
    };
  }

  const { mapDefaultLat: lat, mapDefaultLng: lng, mapDefaultZoom: defaultZoom, mapMinZoom: minZoom, mapMaxZoom: maxZoom } = cfg;
  let scrollZoom;
  if (cfg.scrollZoom === 'false') {
    scrollZoom = false;
  } else if (cfg.scrollZoom === 'true') {
    scrollZoom = true;
  }

  if (
    (lat !== undefined && lng !== undefined) ||
    defaultZoom !== undefined ||
    minZoom !== undefined ||
    maxZoom !== undefined ||
    scrollZoom !== undefined
  ) {
    options.map = {
      ...(lat !== undefined && lng !== undefined ? { defaultCenter: { lat, lng } } : {}),
      ...(defaultZoom !== undefined ? { defaultZoom } : {}),
      ...(minZoom !== undefined ? { minZoom } : {}),
      ...(maxZoom !== undefined ? { maxZoom } : {}),
      ...(scrollZoom !== undefined ? { scrollZoom } : {}),
    };
  }

  return options;
}

export default async function decorate(block) {
  const [{ mount }] = await Promise.all([
    import(/* webpackChunkName: "dealer-locator-vendor" */ '@volvo/vg-dealer-locator/dist/vg-dealer-locator.es.js'),
    import(/* webpackChunkName: "dealer-locator-vendor" */ '@volvo/vg-dealer-locator/dist/vg-dealer-locator.css'),
  ]);

  const cfg = simplifiedReadBlockConfig(block);

  const mountEl = document.createElement('div');
  mountEl.className = 'dealer-locator__mount';

  block.textContent = '';
  block.append(mountEl);

  if (block.__dealerLocatorUnmount) {
    block.__dealerLocatorUnmount();
  }

  block.__dealerLocatorUnmount = mount(mountEl, toMountOptions(cfg));
}
