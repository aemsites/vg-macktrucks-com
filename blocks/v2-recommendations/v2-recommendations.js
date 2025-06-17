import { unwrapDivs } from '../../scripts/common.js';
import { getMetadata } from '../../scripts/aem.js';
import { fetchMagazineData, sortArticlesByDateField, formatArticlesArray } from '../../scripts/services/magazine.service.js';

const blockName = 'v2-recommendations';

/**
 * Retrieves up to 3 articles, prioritizing those in the specified category.
 * If fewer than 3 articles are found in the specified category, it will include
 * fallback articles from other categories to reach a total of 3.
 *
 * @param {Array<Object>} articles - The list of articles to filter through. Each article
 *                                   is an object with a `category` property.
 * @param {string} category - The target category to filter articles by.
 * @returns {Array<Object>} - A list of up to 3 articles, prioritizing those in
 *                            the specified category.
 */
const getFilteredArticles = (articles, category) => {
  const categoryArticles = [];
  const fallbackArticles = [];

  for (const article of articles) {
    if (article.category === category) {
      categoryArticles.push(article);
    }
  }

  if (categoryArticles.length < 3) {
    for (const article of articles) {
      if (article.category !== category) {
        fallbackArticles.push(article);
        if (categoryArticles.length + fallbackArticles.length >= 3) {
          break;
        }
      }
    }
  }

  // Combine category and fallback articles and return up to 3 articles
  return categoryArticles.concat(fallbackArticles).slice(0, 3);
};

/**
 * Builds and appends a block of related articles to a given block element.
 * Each article is rendered inside an article container with an image, category, and title.
 *
 * @param {Array<Object>} articles - An array of article objects to be rendered. Each article
 * should have the following properties:
 *  - path {string}: The URL path to the article.
 *  - image {string}: The URL of the article's image.
 *  - category {string}: The category of the article.
 *  - title {string}: The title of the article.
 * @param {HTMLElement} block - The block element where the articles container will be appended.
 */
const buildBlock = (articles, block) => {
  const fragment = document.createDocumentFragment();

  articles.forEach((article) => {
    const articleElement = document.createElement('article');
    articleElement.classList.add(`${blockName}__article`);

    articleElement.innerHTML = `
      <a href="${article.path}" class="${blockName}__article-link">
        <img src="${article.image}" alt="" class="${blockName}__article-image">
        <div class="${blockName}__article-content">
          <p class="${blockName}__article-content-category">${article.category}</p>
          <h4 class="${blockName}__article-content-title">${article.title}</h4>
        </div>
      </a>
    `;

    fragment.appendChild(articleElement);
  });

  const articlesContainer = document.createElement('div');
  articlesContainer.classList.add(`${blockName}__articles`);
  articlesContainer.appendChild(fragment);

  block.appendChild(articlesContainer);
};

/**
 * Main function to decorate the block element with the top articles.
 * Fetches the articles, sorts them by date, filters them by category, and displays up to
 * three articles.
 * @param {HTMLElement} block - The block element to decorate.
 * @returns {void}
 */
export default async function decorate(block) {
  const queryVariables = { facets: [], sort: 'PUBLISH_DATE_DESC' };
  const allMagazineData = await fetchMagazineData(queryVariables);
  const allArticles = formatArticlesArray(allMagazineData?.items);
  if (!allArticles.length) {
    return;
  }

  const sortedArticles = sortArticlesByDateField(allArticles, 'date');
  const category = getMetadata('article-category');
  const filteredArticles = getFilteredArticles(sortedArticles, category);

  if (filteredArticles.length) {
    buildBlock(filteredArticles, block);
    block.parentElement.classList.add('full-width');
    unwrapDivs(block);
  }
}
