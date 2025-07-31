import { unwrapDivs } from '../../scripts/common.js';
import { getMetadata } from '../../scripts/aem.js';
import { fetchRecommendedArticles, sortArticlesByDateField, formatRecommendedArticlesArray } from '../../scripts/services/magazine.service.js';
import { createVideo } from '../../scripts/video-helper.js';

const blockName = 'v2-recommendations';

/**
 * Returns up to `limit` articles, prioritizing those matching the target category.
 * Maintains the order from the original (already sorted) input list.
 *
 * @param {Array<Object>} articles - Pre-sorted list of articles.
 * @param {string} targetCategory - Lowercased category to prioritize.
 * @param {number} limit - Maximum number of articles to return.
 * @returns {Array<Object>} - Ordered list of articles, with priority given to matching category.
 */
const filterArticlesByCategoryWithFallback = (articles, targetCategory = '', limit = 3) => {
  const primary = [];
  const fallback = [];

  const normalize = (val) => val?.toLowerCase?.();
  const matchesCategory = (cat) => normalize(cat) === targetCategory;

  for (const article of articles) {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    if (categories.some(matchesCategory)) {
      primary.push(article);
    } else {
      fallback.push(article);
    }

    if (primary.length + fallback.length >= limit * 2) {
      break;
    }
  }

  return [...primary, ...fallback].slice(0, limit);
};

/**
 * Creates an article element containing a video player outside the anchor.
 *
 * @param {Object} article - The article data object.
 * @param {string} article.path - The URL to the article page.
 * @param {string} article.videoUrl - The video URL.
 * @param {string} article.category - The article category label.
 * @param {string} article.title - The article title.
 * @param {string} blockName - The base CSS class name for styling.
 * @returns {HTMLElement} The article element containing the video and metadata.
 */
const createVideoArticle = (article, blockName) => {
  const articleEl = document.createElement('article');
  articleEl.classList.add(`${blockName}__article`);

  articleEl.innerHTML = `
    <div class="${blockName}__article-media">
      <div class="video-placeholder"></div>
    </div>
    <a href="${article.path}" class="${blockName}__article-link">
      <div class="${blockName}__article-content">
        <p class="${blockName}__article-content-category">${article.category}</p>
        <h4 class="${blockName}__article-content-title">${article.title}</h4>
      </div>
    </a>
  `;

  const placeholder = articleEl.querySelector('.video-placeholder');
  const videoEl = createVideo(article.videoUrl, `${blockName}__article-video`, {
    autoplay: true,
    muted: true,
    playsinline: true,
    controls: false,
    loop: true,
  });
  placeholder.replaceWith(videoEl);

  return articleEl;
};

/**
 * Creates an article element with an image wrapped inside the anchor.
 *
 * @param {Object} article - The article data object.
 * @param {string} article.path - The URL to the article page.
 * @param {string} article.image - The image URL.
 * @param {string} article.category - The article category label.
 * @param {string} article.title - The article title.
 * @param {string} blockName - The base CSS class name for styling.
 * @returns {HTMLElement} The article element containing the image and metadata.
 */
const createImageArticle = (article, blockName) => {
  const articleEl = document.createElement('article');
  articleEl.classList.add(`${blockName}__article`);

  articleEl.innerHTML = `
    <a href="${article.path}" class="${blockName}__article-link">
      <img src="${article.image}" alt="" class="${blockName}__article-image">
      <div class="${blockName}__article-content">
        <p class="${blockName}__article-content-category">${article.category}</p>
        <h4 class="${blockName}__article-content-title">${article.title}</h4>
      </div>
    </a>
  `;

  return articleEl;
};

/**
 * Builds and appends a block of related articles to a given block element.
 *
 * Each article is rendered inside a container with either:
 * - a video displayed outside the anchor (if `videoUrl` is defined)
 * - or an image inside the anchor (default)
 *
 * @param {Array<Object>} articles - An array of article objects to render.
 *   Each object should have:
 *     - path {string}: URL of the article
 *     - image {string}: Image URL (for non-video articles)
 *     - videoUrl {string} [optional]: Video URL
 *     - category {string}: Article category
 *     - title {string}: Article title
 * @param {HTMLElement} block - The DOM element to append the rendered block to.
 */
const buildBlock = (articles, block) => {
  const fragment = document.createDocumentFragment();

  articles.forEach((article, i) => {
    // TEMP: Add hardcoded video URLs for testing purposes
    if (i === 1) {
      article.videoUrl = 'https://www.macktrucks.com/trucks/anthem/media_1f836bcb54c043f523c2172ffdf69139c49d698fc.mp4';
    }

    if (i === 2) {
      article.videoUrl =
        'https://delivery-p107394-e1241111.adobeaemcloud.com/adobe/assets/urn:aaid:aem:283e5f67-2a55-4fae-ba5e-3f57906999cd/play?accept-experimental=1';
    }

    const articleElement = article.videoUrl ? createVideoArticle(article, blockName) : createImageArticle(article, blockName);

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
  const recommendedData = await fetchRecommendedArticles();
  const items = recommendedData?.items || [];
  const formattedArticles = formatRecommendedArticlesArray(items);
  if (!formattedArticles.length) {
    return;
  }

  const sortedArticles = sortArticlesByDateField(formattedArticles, 'date');
  const articleCategory = getMetadata('article-category')?.toLowerCase?.() || '';
  const filteredArticles = filterArticlesByCategoryWithFallback(sortedArticles, articleCategory);

  if (filteredArticles.length) {
    buildBlock(filteredArticles, block);
    block.parentElement.classList.add('full-width');
    unwrapDivs(block);
  }
}
