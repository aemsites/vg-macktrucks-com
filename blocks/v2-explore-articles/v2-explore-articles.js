import { decorateIcons, getTextLabel } from '../../scripts/common.js';
import { fetchMagazineData, formatArticlesArray, formatFacetsArray } from '../../scripts/services/magazine.service.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const LABELS = {
  SHOW_MORE: getTextLabel('Show More'),
  SEARCH: getTextLabel('Search'),
  FILTERS_PLACEHOLDERS: getTextLabel('Magazine filters placeholders'),
  SHOWING_PLACEHOLDER: getTextLabel('Showing placeholder'),
  SORT_BY: getTextLabel('Sort by'),
  SORT_PLACEHOLDERS: getTextLabel('Sort filter placeholders'),
  FILTERS_BUTTON: getTextLabel('Sort filter button'),
  CLEAR_ALL_BUTTON: getTextLabel('clearAllBtn'),
  APPLY_BUTTON: getTextLabel('applyBtn'),
};

const blockName = 'v2-explore-articles';
const CLASSES = {
  headSection: `${blockName}__head-section`,
  filterButton: `${blockName}__filter-button`,
  filters: `${blockName}__filters`,
  filterList: `${blockName}__filter-list`,
  selectedFilters: `${blockName}__selected-filters`,
  selectedFilter: `${blockName}__selected-filter`,
  clearFiltersBtn: `${blockName}__clear-filters-button`,
  filterListTitle: `${blockName}__filter-list-title`,
  facetList: `${blockName}__facet-list`,
  filterCheckbox: `${blockName}__filter-checkbox`,
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
let totalAmount = 0;
let offset = 0;
let counter = 0;
let appliedFilters = {};

const getData = async (articleSet = {}, offset = 0) => {
  const queryVariables = {
    limit: defaultAmount,
    offset: offset,
    facets: ['ARTICLE', 'TOPIC', 'TRUCK'],
    sort: 'PUBLISH_DATE_DESC',
    article: articleSet,
  };

  const allMagazineData = await fetchMagazineData(queryVariables);
  const allArticles = formatArticlesArray(allMagazineData?.items);

  const allFacets = formatFacetsArray(allMagazineData?.facets);
  const count = allMagazineData?.count;

  const collageItemsData = allArticles.map((article) => {
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

  totalAmount = count;

  return {
    articles: collageItemsData,
    facets: allFacets,
    count,
  };
};

const buildFiltersExtraLine = (recievedArticles = defaultAmount, articlesAmount = totalAmount) => {
  const showingLabel = recievedArticles < totalAmount ? recievedArticles : totalAmount;
  const showingText = LABELS.SHOWING_PLACEHOLDER.replace('$0', showingLabel).replace('$1', articlesAmount);
  return `
    <div class="${CLASSES.showing}">
      <p>${showingText}</p>
    </div>
  `;
};

const buildArticlesTemplate = (articles) => {
  const collage = articles.reduce((accumulator, article) => {
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
  return collage;
};

const buildFilterLists = (facets) => {
  let filterList = `
      <div class="${CLASSES.filterList} hide">
    `;

  for (const [key, values] of Object.entries(facets)) {
    filterList += `
        <fieldset class="${CLASSES.facetList}">
          <legend>${key}</legend>
          <ul>
      `;
    for (const value of values) {
      filterList += `
          <li>
            <input id="${value.replaceAll(' ', '-')}" name="${value}" class="${CLASSES.filterCheckbox}" type="checkbox">
            <label for="${value.replaceAll(' ', '-')}">${value}<label>
          </li>
        `;
    }
    filterList += '</ul></fieldset>';
  }

  filterList += '</div>';
  return filterList;
};

const buildShowMoreBtn = () => {
  const showMoreButton =
    totalAmount >= defaultAmount
      ? `<button class="${CLASSES.showMoreButton} button button--secondary button--large"> ${LABELS.SHOW_MORE}</button>`
      : '';

  return showMoreButton;
};

const buildTemplate = (articles, facets, articlesAmount) => {
  const template = docRange.createContextualFragment(`
  <div class="${CLASSES.headSection}">
    <div class="${CLASSES.filterButton}">
      <button>
        <span class="icon icon-filter-settings"></span>
        ${LABELS.FILTERS_BUTTON}</button>
    </div>
    <div class="${CLASSES.extraLine}">
      ${buildFiltersExtraLine(articles.length, articlesAmount)}
    </div>
  </div>
  <div class="${CLASSES.filters}">
    ${buildFilterLists(facets)}
    <div class="${CLASSES.selectedFilters}"></div>
    <button class="${CLASSES.clearFiltersBtn} hide">${LABELS.CLEAR_ALL_BUTTON}</button>
  </div>
  <div class="${CLASSES.collageWrapper}">
    <div class="${CLASSES.collage}">
      ${buildArticlesTemplate(articles)}
    </div>
  </div>
  <div class="${CLASSES.showMoreButtonWrapper}">
    ${buildShowMoreBtn()}
  </div>
`);

  return template;
};

const updateHtmlElmt = (block, selectedClass, newEl) => {
  const container = block.querySelector(`.${selectedClass}`);
  const newFragment = docRange.createContextualFragment(newEl);
  container.innerHTML = '';
  container.append(newFragment);
};

const updateArticleList = async (block, offset = 0) => {
  const { articles: newFilteredArticles, count } = await getData(appliedFilters, offset);
  totalAmount = count;

  const newExtraLine = buildFiltersExtraLine(defaultAmount, totalAmount);
  updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

  const newArticlesTemplate = buildArticlesTemplate(newFilteredArticles);
  updateHtmlElmt(block, CLASSES.collage, newArticlesTemplate);

  const showMoreBtnWrapper = block.querySelector(`.${CLASSES.showMoreButtonWrapper}`);
  showMoreBtnWrapper.classList[newFilteredArticles.length >= count && count < defaultAmount ? 'add' : 'remove']('hide');
};

const addEventListeners = (block, articles) => {
  console.log('change');
  const selectedFilters = block.querySelector(`.${CLASSES.selectedFilters}`);
  const clearButton = block.querySelector(`.${CLASSES.clearFiltersBtn}`);
  const showMoreButtonEl = block.querySelector(`.${CLASSES.showMoreButton}`);

  // FILTER CLICK
  const filtersButton = block.querySelector(`.${CLASSES.filterButton} button`);
  filtersButton.addEventListener('click', async () => {
    block.querySelector(`.${CLASSES.filterList}`).classList.toggle('hide');
    filtersButton.classList.toggle('overlay');

    if (block.querySelector(`.${CLASSES.filterList}`).classList.contains('hide')) {
      updateArticleList(block);
    }
  });

  // CHECKBOX CLICKS
  const checkboxesContainer = block.querySelector(`.${CLASSES.filterList}`);
  checkboxesContainer.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target.classList.contains(CLASSES.filterCheckbox)) {
      const facetContainer = target.closest('fieldset').querySelector('legend').innerText;
      const item = docRange.createContextualFragment(`
        <div class="${CLASSES.selectedFilter} ${target.id.replaceAll(' ', '-')}-filter">
          <p>${target.name}<p>
          <span class="icon icon-close"></span>
        </div>`);
      decorateIcons(item);

      clearButton.classList.remove('hide');

      if (target.checked) {
        // check input
        selectedFilters.append(item);
        if (!appliedFilters[facetContainer]) {
          appliedFilters[facetContainer] = [];
        }
        appliedFilters[facetContainer].push(target.name);
      } else {
        // uncheck input
        selectedFilters.querySelector(`.${target.id}-filter`).remove();
        appliedFilters[facetContainer].pop(target.name);

        if (appliedFilters[facetContainer].length === 0) {
          delete appliedFilters[facetContainer];
        }

        // once all inputs are unchecked
        if (selectedFilters.children.length === 0) {
          delete appliedFilters[facetContainer];
          clearButton.classList.add('hide');
        }
      }

      const selectedCloseIcon = selectedFilters.querySelector(`.${target.id}-filter .icon`);
      selectedCloseIcon?.addEventListener('click', () => {
        target.checked = false;
        selectedFilters.querySelector(`.${target.id}-filter`).remove();

        appliedFilters[facetContainer].pop(target.name);

        if (appliedFilters[facetContainer].length === 0) {
          delete appliedFilters[facetContainer];
        }

        if (selectedFilters.children.length === 0) {
          clearButton.classList.add('hide');
        }

        updateArticleList(block);
      });
    }
  });

  // CLEAR CHECKBOXES
  clearButton.addEventListener('click', async () => {
    block.querySelectorAll(`.${CLASSES.filterCheckbox}`).forEach((checkbox) => (checkbox.checked = false));
    clearButton.classList.add('hide');
    selectedFilters.innerHTML = '';
    appliedFilters = {};

    updateArticleList(block);
  });

  // SHOW MORE
  showMoreButtonEl?.addEventListener('click', async () => {
    const collageEl = block.querySelector(`.${CLASSES.collage}`);

    counter = counter + 1;
    offset = counter * defaultAmount;

    const { articles: moreArticles, count } = await getData(appliedFilters, offset);
    const newArticlesTemplate = buildArticlesTemplate(moreArticles);
    const newArticlesFragment = docRange.createContextualFragment(newArticlesTemplate);

    collageEl.appendChild(newArticlesFragment);
    const displayedArticles = defaultAmount * (counter + 1);

    if (totalAmount <= displayedArticles) {
      showMoreButtonEl.remove();
      totalAmount = articles.length;
    }
    const newExtraLine = buildFiltersExtraLine(displayedArticles, count);
    updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

    decorateIcons(block);
  });
};

export default async function decorate(block) {
  const { articles, facets, count } = await getData();

  const blockWrapper = block.closest(`.${blockName}-wrapper`);
  const initialArticles = articles.slice(0, defaultAmount);
  const template = buildTemplate(initialArticles, facets, count);

  // totalAmount += defaultAmount;
  blockWrapper.classList.add('full-width');

  block.appendChild(template);
  decorateIcons(block);

  addEventListeners(block, articles);
}
