import { getOrigin, getLocale, getTextLabel } from '../common.js';
import { fetchData, magazineSearchQuery, TENANT } from '../search-api.js';

/**
 * Fetches all magazine articles from GraphQL endpoint.
 * @async
 * @param {Object} - An object with the query configurations
 * @returns {Promise<Array>} - A promise that resolves to an array of articles and facets.
 */
export const fetchMagazineData = async ({
  limit,
  offset = 0,
  q = 'Mack',
  sort = 'BEST_MATCH',
  tenant = TENANT,
  language = getLocale().split('-')[0].toUpperCase(),
  category = 'magazine',
  facets = null,
  article,
} = {}) => {
  let allArticleData = [];
  const variables = {
    tenant,
    language,
    q,
    category,
    limit: limit ?? null,
    offset,
    facets,
    sort,
    article,
  };

  try {
    const rawData = await fetchData({
      query: magazineSearchQuery(),
      variables,
    });

    const querySuccess = rawData?.data?.edssearch;

    if (!querySuccess) {
      return allArticleData;
    }

    if (!limit) {
      variables.limit = rawData.data.edssearch.count;
      return fetchMagazineData(variables);
    }

    allArticleData = rawData.data.edssearch;

    return allArticleData || null;
  } catch (error) {
    console.error('Error fetching magazine articles:', error);
    return [];
  }
};

/**
 * Checks if the given link is actually an image
 * @param {string} link - A string containig a link of an image
 */
const isImageLink = (link) => `${link}`.split('?')[0].match(/\.(jpeg|jpg|gif|png|svg|bmp|webp)$/) !== null;

/**
 * Returns a default image of the brand.
 */
const getDefaultImage = () => {
  const logoImageURL = '/magazine/categories/media_10b792212a4995e99d13ed3ea3f4a80574ae54979.png';
  return logoImageURL;
};

/**
 * Formats magazine articles from a given object.
 * @param {Array} arts - An array of objects as it comes from endpoint
 * @returns {Array} - An array of correctly formatted objects
 */
export const formatArticlesArray = (arts = []) => {
  const defaultAuthor = getTextLabel('defaultAuthor');
  const defaultReadTime = getTextLabel('defaultReadTime');
  const articleList = [];

  articleList?.push(
    ...arts.map((item) => {
      const filterTag = ['category', 'topic', 'truck']
        .map((key) => {
          return item.metadata.article[key];
        })
        .filter(Boolean);

      const { article, image } = item.metadata;
      const articleObject = {
        ...item.metadata,
        filterTag,
        author: article.author || defaultAuthor,
        image: isImageLink(image) ? getOrigin() + image : getDefaultImage(),
        path: item.metadata?.url,
        readingTime: /\d+/.test(article.readTime) ? article.readTime : defaultReadTime,
        isDefaultImage: !isImageLink(image),
        topic: article.topic,
        truck: article.truck,
        date: article.publishDate,
      };

      if (article.category) {
        const [category] = Object.values(article.category);
        articleObject.category = category;
      }

      delete articleObject.article;
      return articleObject;
    }),
  );
  return articleList;
};

/**
 * Formats facets as they come from endpoint.
 * @param {Object} facets - An object of objects
 * @returns {Object} - An object of correctly formatted objects
 */
export const formatFacetsArray = (facets) => {
  const facetObject = {};
  facets?.forEach((facet) => {
    facet.field = facet.field === 'ARTICLE' ? 'category' : facet.field.toLowerCase();
    const { field: facetName, items: facetItems } = facet;
    const extractedValues = facetItems.map((item) => item.value);
    facetObject[facetName] = extractedValues;
  });
  return facetObject;
};

/**
 * Extracts the values from an array of objects and returns an array of values
 * example: [{ key: 'value' }] => ['value']
 * @param {Array} array - An array of objects
 * @returns {Array} An array of values
 */
export function getValuesFromObjectsArray(array = []) {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }
  return array.map((item) => Object.values(item)[0]);
}

/**
 * Extract the classes of a block and in case there is a 'limit-X' set, extract it as a number
 * @param {block} block - The block element
 * @returns {number} - A number representing the limit
 */
export const extractLimitFromBlock = (block) => {
  let limit = null;
  const blockClass = [...block.classList].find((className) => className.startsWith('limit-'));
  if (blockClass) {
    const [, value] = blockClass.split('-');
    limit = Number(value);
  }
  return limit;
};

/**
 * Checks the current URL to delete the same article from the other lists
 * @param {Array} articles - The articles array
 * @returns {Array} The articles without the opened one
 */
export const clearRepeatedArticles = (articles) => {
  return articles.filter((e) => {
    const currentArticlePath = window.location.href.split('/').pop();
    const path = e.path?.split('/').pop();
    if (path !== currentArticlePath) {
      return e;
    }
    return null;
  });
};

/**
 * Sorts articles by the specified date field in descending order.
 * @param {Array} articles - The array of article objects to be sorted.
 * @param {string} dateField - The date field to sort by (e.g., 'lastModified' or 'date').
 * @returns {Array} - A new array of articles sorted by the most recent date.
 */
export const sortArticlesByDateField = (articles, dateField) =>
  articles
    .map((article) => ({
      ...article,
      timestamp: new Date(article[dateField]).getTime(),
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

/**
 * Sorts the array of articles by the date that appears in the URL
 * @param {Array} articles - The articles array
 * @returns {Array} The same array but sorted
 */
export const sortArticlesByDateInURL = (articles) =>
  articles.sort((a, b) => {
    const aPath = a.path.split('/');
    const bPath = b.path.split('/');
    const aYear = aPath[3];
    const aMonth = aPath[4];
    const bYear = bPath[3];
    const bMonth = bPath[4];

    const aDate = new Date(`${aYear}-${aMonth}`);
    const bDate = new Date(`${bYear}-${bMonth}`);

    if (aDate.getTime() === bDate.getTime()) {
      return b.lastModified - a.lastModified;
    }
    return bDate - aDate;
  });

/**
 * Checks whether the current page is a magazine template.
 */
export const isMagazineTemplate = document.body.classList.contains('v2-magazine') || document.body.classList.contains('magazine');
