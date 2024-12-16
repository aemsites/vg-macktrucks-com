import { decorateIcons, getTextLabel } from '../../scripts/common.js';
import { fetchMagazineArticles, sortArticlesByDateInURL, removeArticlesWithNoImage } from '../../scripts/services/magazine.service.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const LABELS = {
  SHOW_MORE: getTextLabel('Show More'),
  SEARCH: getTextLabel('Search'),
  FILTERS_PLACEHOLDERS: getTextLabel('Magazine filters placeholders'),
  SHOWING_PLACEHOLDER: getTextLabel('Showing placeholder'),
  SORT_BY: getTextLabel('Sort by'),
  SORT_PLACEHOLDERS: getTextLabel('Sort filter placeholders'),
};

const blockName = 'v2-explore-articles';
const CLASSES = {
  filters: `${blockName}__filters`,
  extraLine: `${blockName}__extra-line`,
  filterItem: `${blockName}__filter-item`,
  showing: `${blockName}__showing`,
  sortBy: `${blockName}__sort-by`,
  collageWrapper: `${blockName}__collage-wrapper`,
  collage: `${blockName}__collage`,
  collageItemContainer: `${blockName}__collage-item-container`,
  collageItemLink: `${blockName}__collage-item-link`,
  collageItemContent: `${blockName}__collage-item-content`,
  collageItemCategoryTitle: `${blockName}__collage-item-category-title`,
  collageItemTitle: `${blockName}__collage-item-title`,
  showMoreButton: `${blockName}__show-more-button`,
  showMoreButtonWrapper: `${blockName}__show-more-container`,
};

const docRange = document.createRange();
const defaultAmount = 9;
let currentAmount = 0;

const getData = async () => {
  const allArticles = await fetchMagazineArticles();
  const allArticlesWithImage = removeArticlesWithNoImage(allArticles);
  const sortedArticlesByDate = sortArticlesByDateInURL(allArticlesWithImage);
  // Preparing the data for every collage item
  const collageItemsData = sortedArticlesByDate.map((article) => {
    const { title, image, path, category } = article;
    const linkUrl = new URL(path, window.location.origin);
    const picture = createOptimizedPicture(new URL(image, window.location.origin), title, true);
    picture.setAttribute('tabindex', '0');
    return {
      title,
      picture,
      linkUrl,
      category,
    };
  });

  // TODO: prepare the data to fill the categories, topics, and trucks filters

  return {
    articles: collageItemsData,
    // categories: [],
    // topics: [],
    // trucks: [],
  };
};

// TODO: to be restored to enable the filters
// const buildFiltersTemplate = () => {
//   const filtersPlaceholderList = LABELS.FILTERS_PLACEHOLDERS.split(',');
//   return filtersPlaceholderList.reduce((accumulator, placeholder) => {
//     const filterFragment = `
//     <select class="${CLASSES.filterItem}" name="${placeholder}">
//       <option value="">${placeholder}</option>
//     </select>`;
//     return `${accumulator}${filterFragment}`;
//   }, '');
// };

const buildFiltersExtraLine = (articlesAmount) => {
  // TODO: to be restored to enable the sort filter
  // const sortPlaceholderList = LABELS.SORT_PLACEHOLDERS.split(',');
  const showingText = LABELS.SHOWING_PLACEHOLDER.replace('$0', defaultAmount).replace('$1', articlesAmount);
  return `
    <div class="${CLASSES.showing}">
      ${showingText}
    </div>
  `;
  // TODO: add the sort filter below the showing div element
  // <div class="${CLASSES.sortBy}">
  //   <span>${LABELS.SORT_BY}</span>
  //   <select class="${CLASSES.filterItem}" name="${LABELS.SORT_BY}">
  //     ${sortPlaceholderList.reduce((accumulator, placeholder) => `
  //       ${accumulator}<option value="${placeholder.toLowerCase()}">${placeholder}</option>`, '')}
  //   </select>
  // </div>
};

const buildArticlesTemplate = (articles) =>
  articles.reduce((accumulator, article) => {
    const collageItemFragment = `
    <a class="${CLASSES.collageItemLink}" href="${article.linkUrl.toString()}">
      <div class="${CLASSES.collageItemContent}">
        <div class="${CLASSES.collageItemCategoryTitle}">${article.category}</div>
        <div class="${CLASSES.collageItemTitle}">
          ${article.title.split('|')[0]}
          <span class="icon icon-arrow-right"></span>
        </div>
      </div>
      ${article.picture.outerHTML}
    </a>
  `;
    return `${accumulator}
    <div class="${CLASSES.collageItemContainer}">${collageItemFragment}</div>`;
  }, '');

// TODO: replace the filters div with the following code
/*
  <div class="${CLASSES.filters}">
    <input class="${CLASSES.filterItem}" type="search" placeholder="${LABELS.SEARCH}" />
    <span class="icon icon-search"></span>
    ${buildFiltersTemplate()}
  </div>
*/
const buildTemplate = (articles, articlesAmount) =>
  docRange.createContextualFragment(`
  <div class="${CLASSES.filters}">
  </div>
  <div class="${CLASSES.extraLine}">
    ${buildFiltersExtraLine(articlesAmount)}
  </div>
  <div class="${CLASSES.collageWrapper}">
    <div class="${CLASSES.collage}">
      ${buildArticlesTemplate(articles)}
    </div>
  </div>
  <div class="${CLASSES.showMoreButtonWrapper}">
    <button class="${CLASSES.showMoreButton} button button--secondary button--large">
      ${LABELS.SHOW_MORE}
    </button>
  </div>
`);

const addEventListeners = (block, articles) => {
  const showMoreButtonEl = block.querySelector(`.${CLASSES.showMoreButton}`);

  showMoreButtonEl.addEventListener('click', () => {
    const collageEl = block.querySelector(`.${CLASSES.collage}`);
    const amountEl = block.querySelector(`.${CLASSES.showing} strong span`);
    const newArticles = articles.slice(currentAmount, currentAmount + defaultAmount);
    const newArticlesTemplate = buildArticlesTemplate(newArticles);
    const newArticlesFragment = docRange.createContextualFragment(newArticlesTemplate);
    collageEl.appendChild(newArticlesFragment);

    currentAmount += defaultAmount;
    if (currentAmount >= articles.length) {
      showMoreButtonEl.remove();
      currentAmount = articles.length;
    }
    amountEl.textContent = currentAmount;
    decorateIcons(block);
  });
};

export default async function decorate(block) {
  const {
    articles, // TODO: categories, topics, trucks, are missing
  } = await getData();
  const blockWrapper = block.closest(`.${blockName}-wrapper`);
  const initialArticles = articles.slice(0, defaultAmount);
  const template = buildTemplate(initialArticles, articles.length);

  currentAmount += defaultAmount;
  blockWrapper.classList.add('full-width');

  block.appendChild(template);
  decorateIcons(block);
  addEventListeners(block, articles);
}
