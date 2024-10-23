import { getJsonFromUrl } from '../common.js';

/**
 * Fetches magazine articles from a given URL.
 * @async
 * @returns {Promise<Array>} - A promise that resolves to an array of article objects or an
 * empty array if the fetch fails.
 */
export const fetchMagazineArticles = async () => {
  try {
    const response = await getJsonFromUrl('/magazine-articles.json');

    if (!response?.data) {
      // eslint-disable-next-line no-console
      console.warn('No data found in response.');
      return [];
    }

    const { data } = response;

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching articles: ${error.message || error}`);
    return [];
  }
};

/**
 * Extracts the articles that dont have an image field
 * @param {Array} articles - An array of articles
 * @returns {Array} - The same array of articles but without those that dont have an image field
 */
export const removeArticlesWithNoImage = (articles) => {
  const filteredArray = [...articles];
  filteredArray.filter((art) => !art.image);
  return filteredArray;
};

/**
 * Extracts the values from an array of objects and returns an array of values
 * example: [{ key: 'value' }] => ['value']
 * @param {Array} array - An array of objects
 * @returns {Array} An array of values
 */
export function getValuesFromObjectsArray(array = []) {
  if (!Array.isArray(array) || array.length === 0) return [];
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
export const clearRepeatedArticles = (articles) => articles.filter((e) => {
  const currentArticlePath = window.location.href.split('/').pop();
  const path = e.path.split('/').pop();
  if (path !== currentArticlePath) return e;
  return null;
});

/**
 * Sorts articles by the specified date field in descending order.
 * @param {Array} articles - The array of article objects to be sorted.
 * @param {string} dateField - The date field to sort by (e.g., 'lastModified' or 'date').
 * @returns {Array} - A new array of articles sorted by the most recent date.
 */
export const sortArticlesByDateField = (articles, dateField) => articles
  .map((article) => ({
    ...article,
    timestamp: new Date(article[dateField]).getTime(),
  }))
  .sort((a, b) => b.timestamp - a.timestamp);

// TODO:
// THESE FUNCTIONS SHOULD BE DEPRECATED AND DELETED
// ONCE ALL METADATA TAGS ARE SET CORRECTLY
/**
 * Extract the classes of a block and in case there is a 'limit-X' set, extract it as a number
 * @param {Object} article - The article element with all its fields
 * @param {Array} allCategories - The block element
 * @returns {number} - A number representing the limit
 */
export const getArticleCategory = (article, allCategories) => {
  try {
    const articleTags = JSON.parse(article.tags);
    const categoriesSet = new Set(allCategories);
    return articleTags.find((tag) => categoriesSet.has(tag)) || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing article tags:', error);
    return null;
  }
};

/**
 * Fetches the tags from the JSON file
 * @returns {Array} An array of categories set in sharepoint
 */
export const fetchArticleTagsJSON = async () => getJsonFromUrl('/magazine/articles/tags.json');

/**
 * Fetches the tags from the JSON file
 * @returns {Object} An object with the tags
 * @property {Array} categories - An array of categories
 * @property {Array} trucks - An array of trucks
 * @property {Array} topics - An array of topics
 */
export const getArticleTagsJSON = async () => {
  try {
    const tagsJSON = await fetchArticleTagsJSON();

    return {
      categories: getValuesFromObjectsArray(tagsJSON.categories?.data),
      trucks: getValuesFromObjectsArray(tagsJSON.trucks?.data),
      topics: getValuesFromObjectsArray(tagsJSON.topics?.data),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching article tags JSON:', error);
    throw new Error('Unable to fetch article tags.');
  }
};

/**
 * Sorts the array of articles by the date that appears in the URL
 * @param {Array} articles - The articles array
 * @returns {Array} The same array but sorted
 */
export const sortArticlesByDateInURL = (articles) => articles.sort((a, b) => {
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
 * Extracts the matching tags from an array of tags and an array of article tags
 * and returns a string of matching tags
 * @param {Array} tags - An array of tags from the JSON file
 * @param {Array} articleTags - An array of article:tags
 * @returns {string} A string of matching tags
 */
export function getMetadataFromTags(tags, articleTags) {
  if (!tags || !articleTags) {
    return '';
  }

  const matchingTags = [...articleTags]
    .filter((tag) => tags.includes(tag.content))
    .map((tag) => tag.content);
  return matchingTags && matchingTags?.length > 0 ? matchingTags.join(', ') : '';
}

/**
 * Get the article tags from the JSON file and the article tags from the document
 * and return the matching tags
 * @param {string} tagType - The type of tag to get such as 'categories', 'topics' or 'trucks'
 * @returns {string} A string of matching tags
 */
export async function getArticleTags(tagType) {
  const articleTags = document.head.querySelectorAll('meta[property="article:tag"]') || [];
  const tagItems = await fetchArticleTagsJSON();
  const tags = tagItems && tagItems[tagType]
    && getValuesFromObjectsArray(tagItems[tagType].data);
  return getMetadataFromTags(tags, articleTags);
}
