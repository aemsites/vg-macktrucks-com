import { createElement, getOrigin, getTextLabel, getLocale } from '../../scripts/common.js';
import { fetchData, searchQuery, recommendationSearchQuery, TENANT } from '../../scripts/search-api.js';

// TODO [BLOCKED]: This block requires a dedicated OpenSearch query (edsRecommend / edsSearch)
// that filters results specifically to Mack News content on the API side.
// The query does NOT exist yet — it needs to be created by the backend/search team.
// Until that query is available, the current implementation falls back to client-side
// path filtering (`/mack-news/`), which is a temporary workaround that wastes API batches.
// Do NOT ship to production until the proper server-side filter query is in place.

// Block-level configuration for the news listing UI and API behavior.
const ITEMS_PER_PAGE = 10;
const SEARCH_LABELS = {
  searchPlaceholder: getTextLabel('search:search_for'),
  searchButton: getTextLabel('search:search_button'),
  previous: getTextLabel('search:previous'),
  next: getTextLabel('search:next'),
};

const DEFAULT_NEWS_IMAGE = '/icons/bulldog.svg';
const NEWS_PATH_PREFIX = '/mack-news/';
const MAX_BATCHES = 10;

function getLanguage() {
  return getLocale().split('-')[0].toUpperCase();
}

function isImageLink(link) {
  return `${link}`.split('?')[0].match(/\.(jpeg|jpg|gif|png|svg|bmp|webp)$/) !== null;
}

function getFallbackImage() {
  return `${getOrigin()}${DEFAULT_NEWS_IMAGE}`;
}

function parseDate(dateValue) {
  if (!dateValue) {
    return 0;
  }

  const numericDate = Number(dateValue);
  if (Number.isNaN(numericDate)) {
    return 0;
  }

  return numericDate;
}

function sortByNewest(a, b) {
  const aDate = parseDate(a.publishDate || a.lastModified);
  const bDate = parseDate(b.publishDate || b.lastModified);
  return bDate - aDate;
}

function formatDate(dateValue) {
  const unixSeconds = parseDate(dateValue);
  if (!unixSeconds) {
    return '';
  }

  const date = new Date(unixSeconds * 1000);
  return date.toLocaleDateString('en-US');
}

// Normalize OpenSearch responses into the shape required by the block UI.
// We also keep only Mack News URLs to avoid rendering unrelated search results.
function normalizeNewsItems(items = []) {
  return items
    .map((item) => {
      const metadata = item?.metadata || {};
      const image = metadata.image || '';
      const fullImage = isImageLink(image) ? `${getOrigin()}${image}` : getFallbackImage();

      return {
        title: metadata.title || '',
        description: metadata.description || '',
        path: metadata.url || '',
        image: fullImage,
        publishDate: metadata.publishDate || metadata.lastModified || '',
      };
    })
    .filter((item) => item.path && item.path.includes(NEWS_PATH_PREFIX) && item.title)
    .sort(sortByNewest);
}

function dedupeByPath(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.path)) {
      return false;
    }
    seen.add(item.path);
    return true;
  });
}

async function fetchRecommendedNews({ limit = 100, offset = 0 } = {}) {
  const variables = {
    tenant: TENANT,
    language: getLanguage(),
    limit,
    offset,
    sort: 'PUBLISH_DATE_DESC',
    category: null,
    article: null,
    facets: null,
  };

  const response = await fetchData({
    query: recommendationSearchQuery(),
    variables,
  });

  const data = response?.data?.edsrecommend;
  return {
    count: data?.count || 0,
    items: normalizeNewsItems(data?.items || []),
  };
}

async function fetchSearchNews(term, { limit = 100, offset = 0 } = {}) {
  const variables = {
    tenant: TENANT,
    language: getLanguage(),
    q: term,
    limit,
    offset,
    facets: null,
    sort: 'PUBLISH_DATE_DESC',
    article: {},
    category: null,
  };

  const response = await fetchData({
    query: searchQuery(),
    variables,
  });

  const data = response?.data?.edssearch;
  return {
    count: data?.count || 0,
    items: normalizeNewsItems(data?.items || []),
  };
}

// Pull recommendation results in batches so the block can build a stable
// paginated list after client-side filtering and de-duplication.
async function fetchAllRecommendedNews() {
  const collected = [];
  let offset = 0;
  let count = 0;
  let batches = 0;

  while (batches < MAX_BATCHES) {
    const response = await fetchRecommendedNews({ limit: 100, offset });
    count = response.count;
    collected.push(...response.items);

    offset += 100;
    batches += 1;

    if (offset >= count || response.items.length === 0) {
      break;
    }
  }

  return dedupeByPath(collected).sort(sortByNewest);
}

// Search results are also fetched in batches because not every returned item
// belongs to `/mack-news/`, and we still need enough items for 10-per-page pagination.
async function fetchAllSearchNews(term) {
  const collected = [];
  let offset = 0;
  let count = 0;
  let batches = 0;

  while (batches < MAX_BATCHES) {
    const response = await fetchSearchNews(term, { limit: 100, offset });
    count = response.count;
    collected.push(...response.items);

    offset += 100;
    batches += 1;

    if (offset >= count || response.items.length === 0) {
      break;
    }
  }

  return dedupeByPath(collected).sort(sortByNewest);
}

// Build a single news card with image, date, title and summary text.
function buildArticleCard(item) {
  const article = createElement('article', { classes: 'v2-news-list__item' });

  const imageWrapper = createElement('div', { classes: 'v2-news-list__image-wrapper' });
  const image = createElement('img', {
    classes: 'v2-news-list__image',
    props: {
      src: item.image,
      alt: item.title,
      loading: 'lazy',
      width: '280',
      height: '180',
    },
  });
  imageWrapper.append(image);

  const content = createElement('div', { classes: 'v2-news-list__content' });

  const date = createElement('p', { classes: 'v2-news-list__date' });
  date.textContent = formatDate(item.publishDate);

  const titleLink = createElement('a', {
    classes: 'v2-news-list__title-link',
    props: { href: item.path },
  });
  const title = createElement('h3', { classes: 'v2-news-list__title' });
  title.textContent = item.title;
  titleLink.append(title);

  const description = createElement('p', { classes: 'v2-news-list__description' });
  description.textContent = item.description;

  content.append(date, titleLink, description);
  article.append(imageWrapper, content);

  return article;
}

function renderPagination(container, state, onPageChange) {
  const totalPages = Math.max(1, Math.ceil(state.items.length / ITEMS_PER_PAGE));

  container.textContent = '';
  if (totalPages <= 1) {
    return;
  }

  const pagination = createElement('nav', { classes: 'v2-news-list__pagination', props: { 'aria-label': 'News pagination' } });

  const prevButton = createElement('button', {
    classes: 'v2-news-list__page-btn v2-news-list__page-btn--nav',
    props: {
      type: 'button',
      'aria-label': SEARCH_LABELS.previous,
      disabled: state.currentPage === 1,
    },
  });
  prevButton.textContent = SEARCH_LABELS.previous;
  prevButton.addEventListener('click', () => {
    if (state.currentPage > 1) {
      onPageChange(state.currentPage - 1);
    }
  });

  const pages = createElement('div', { classes: 'v2-news-list__page-numbers' });
  for (let page = 1; page <= totalPages; page += 1) {
    const pageButton = createElement('button', {
      classes: `v2-news-list__page-btn${page === state.currentPage ? ' is-active' : ''}`,
      props: {
        type: 'button',
        'aria-label': `Page ${page}`,
      },
    });
    pageButton.textContent = page;
    pageButton.addEventListener('click', () => onPageChange(page));
    pages.append(pageButton);
  }

  const nextButton = createElement('button', {
    classes: 'v2-news-list__page-btn v2-news-list__page-btn--nav',
    props: {
      type: 'button',
      'aria-label': SEARCH_LABELS.next,
      disabled: state.currentPage === totalPages,
    },
  });
  nextButton.textContent = SEARCH_LABELS.next;
  nextButton.addEventListener('click', () => {
    if (state.currentPage < totalPages) {
      onPageChange(state.currentPage + 1);
    }
  });

  pagination.append(prevButton, pages, nextButton);
  container.append(pagination);
}

function renderResults(resultsContainer, state) {
  resultsContainer.textContent = '';

  if (!state.items.length) {
    const empty = createElement('p', { classes: 'v2-news-list__empty' });
    empty.textContent = getTextLabel('search:no_results');
    resultsContainer.append(empty);
    return;
  }

  const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = state.items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  pageItems.forEach((item) => {
    resultsContainer.append(buildArticleCard(item));
  });
}

function buildSearchBar(onSearch) {
  const searchWrapper = createElement('div', { classes: 'v2-news-list__search' });

  const input = createElement('input', {
    classes: 'v2-news-list__search-input',
    props: {
      type: 'text',
      placeholder: `${SEARCH_LABELS.searchPlaceholder}...`,
      'aria-label': SEARCH_LABELS.searchPlaceholder,
    },
  });

  const button = createElement('button', {
    classes: 'v2-news-list__search-button',
    props: {
      type: 'button',
      'aria-label': SEARCH_LABELS.searchButton,
    },
  });
  const icon = createElement('span', { classes: 'v2-news-list__search-icon', props: { 'aria-hidden': 'true' } });
  button.append(icon);

  button.addEventListener('click', () => {
    onSearch(input.value.trim());
  });

  searchWrapper.append(input, button);
  return searchWrapper;
}

export default async function decorate(block) {
  // Local UI state for the currently visible result set and active page.
  const state = {
    items: [],
    currentPage: 1,
  };

  const onPageChange = (page) => {
    state.currentPage = page;
    renderResults(resultsContainer, state);
    renderPagination(paginationContainer, state, onPageChange);
  };

  const root = createElement('section', { classes: 'v2-news-list__wrapper' });
  const searchBar = buildSearchBar(async (term) => {
    // Clicking the search button resets pagination and swaps data source
    // between `edsrecommend` (empty query) and `edssearch` (keyword query).
    state.currentPage = 1;

    state.items = term ? await fetchAllSearchNews(term) : await fetchAllRecommendedNews();

    renderResults(resultsContainer, state);
    renderPagination(paginationContainer, state, onPageChange);
  });

  const resultsContainer = createElement('div', { classes: 'v2-news-list__results' });
  const paginationContainer = createElement('div', { classes: 'v2-news-list__pagination-container' });

  root.append(searchBar, resultsContainer, paginationContainer);
  block.textContent = '';
  block.append(root);

  // Initial load shows recommended/latest Mack News content before any search.
  state.items = await fetchAllRecommendedNews();

  renderResults(resultsContainer, state);
  renderPagination(paginationContainer, state, onPageChange);
}
