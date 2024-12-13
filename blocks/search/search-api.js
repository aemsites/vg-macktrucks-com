import { SEARCH_URLS } from '../../scripts/common.js';

const { SEARCH_URL_DEV, SEARCH_URL_PROD } = SEARCH_URLS;
const isProd = !window.location.host.includes('hlx.page')
               && !window.location.host.includes('aem.page')
               && !window.location.host.includes('localhost');
const SEARCH_LINK = isProd ? SEARCH_URL_PROD : SEARCH_URL_DEV;

export async function fetchData(queryObj) {
  try {
    if (!SEARCH_LINK) {
      throw new Error('SEARCH_LINK is not defined');
    }

    const response = await fetch(
      SEARCH_LINK,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': queryObj.length,
        },
        body: JSON.stringify(queryObj),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
}

export const searchQuery = (hasFilters) => `
query MacTrucksQuery($q: String, $offset: Int, $limit: Int, $language: MackLocaleEnum!,
$facets: [MackFacet], $sort: [MackSortOptionsEnum]${hasFilters ? ', $filters: [MackFilterItem]' : ''}) {
  macktrucksearch(q: $q, offset: $offset, limit: $limit, language: $language,
  facets: $facets, sort: $sort${hasFilters ? ', filters: $filters' : ''}) {
    count
    items {
      uuid
      score
      metadata {
        title
        description
        url
        lastModified
      }
    }
    facets {
      field
      items {
        value
        count
      }
    }
  }
}
`;

export const autosuggestQuery = () => `query Macktrucksuggest($term: String!, $locale: MackLocaleEnum!, $sizeSuggestions: Int) {
  macktrucksuggest(term: $term, locale: $locale, sizeSuggestions: $sizeSuggestions) {
    terms
  }
}`;
