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
  CLEAR_ALL_BUTTON: getTextLabel('Clear all button'),
  CLEAR_BUTTON: getTextLabel('Clear button'),
  APPLY_BUTTON: getTextLabel('Apply button'),
  // TODO get these from placeholder?
  ERROR_TITLE: 'SORRY, YOUR FILTER CRITERIA RETURNED NO RESULTS!',
  ERROR_TEXT: '"LET\'S REFINE, OR TRY FILTERING BY DIFFERENT FILTER OPTION(S) INSTEAD."',
};

const blockName = 'v2-explore-articles';
const CLASSES = {
  headSection: `${blockName}__head-section`,
  filterButton: `${blockName}__filter-button`,
  filters: `${blockName}__filters`,
  filterList: `${blockName}__filter-list`,
  selectedFilters: `${blockName}__selected-filters`,
  selectedFilter: `${blockName}__selected-filter`,
  applyClearBtns: `${blockName}__apply-clear-buttons`,
  applyFiltersBtn: `${blockName}__apply-filters-button`,
  clearFiltersBtn: `${blockName}__clear-filters-button`,
  clearAllFiltersBtn: `${blockName}__clear-all-filters-button`,
  filterListTitle: `${blockName}__filter-list-title`,
  facetList: `${blockName}__facet-list`,
  facetHeading: `${blockName}__facet-heading`,
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
  noArticlesMessage: `${blockName}__no-articles-message`,
};

const docRange = document.createRange();
const defaultAmountOfArticles = 9;
let totalAmount = 0;
let offset = 0;
let counter = 0;
let appliedFilters = {};

const getData = async (articleSet = {}, offset = 0) => {
  const queryVariables = {
    limit: defaultAmountOfArticles,
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

const buildFiltersExtraLine = (recievedArticles = defaultAmountOfArticles, articlesAmount = totalAmount) => {
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
          <legend class="${CLASSES.facetHeading}">${key}</legend>
          <ul>
      `;
    for (const value of values) {
      const itemId = value.replaceAll(' ', '-');
      filterList += `
          <li>
            <input id="${itemId}" name="${value}" class="${CLASSES.filterCheckbox}" type="checkbox">
            <label for="${itemId}">${value}<label>
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
    totalAmount >= defaultAmountOfArticles
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
    <div class="${CLASSES.applyClearBtns} hide">
      <button class="${CLASSES.clearFiltersBtn} button button--secondary button--large">${LABELS.CLEAR_BUTTON}</button>
      <button class="${CLASSES.applyFiltersBtn} button button--primary button--large">${LABELS.APPLY_BUTTON}</button>
      </div>
    <a class="${CLASSES.clearAllFiltersBtn} standalone-link hide">${LABELS.CLEAR_ALL_BUTTON}</a>
  </div>
  <div class="${CLASSES.collageWrapper}">
    <div class="${CLASSES.collage}">
      ${buildArticlesTemplate(articles)}
    </div>
  </div>
  <div class="${CLASSES.showMoreButtonWrapper}">
    ${buildShowMoreBtn()}
  </div>
  <div class="${CLASSES.noArticlesMessage} hide">
    <h3>${LABELS.ERROR_TITLE}</h3>
    <p>${LABELS.ERROR_TEXT}</p>
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

  const newExtraLine = buildFiltersExtraLine(defaultAmountOfArticles, totalAmount);
  updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

  const newArticlesTemplate = buildArticlesTemplate(newFilteredArticles);
  updateHtmlElmt(block, CLASSES.collage, newArticlesTemplate);

  const showMoreBtnWrapper = block.querySelector(`.${CLASSES.showMoreButtonWrapper}`);
  showMoreBtnWrapper.classList[newFilteredArticles.length >= count && count < defaultAmountOfArticles ? 'add' : 'remove']('hide');

  const noArticlesMessage = block.querySelector(`.${CLASSES.noArticlesMessage}`);
  noArticlesMessage.classList[count == 0 ? 'remove' : 'add']('hide');
};

const addEventListeners = (block, articles) => {
  const filterEls = {
    button: block.querySelector(`.${CLASSES.filterButton} button`),
    list: block.querySelector(`.${CLASSES.filterList}`),
    buttonContainer: block.querySelector(`.${CLASSES.applyClearBtns}`),
    clearBtn: block.querySelector(`.${CLASSES.clearAllFiltersBtn}`),
    showMoreBtn: block.querySelector(`.${CLASSES.showMoreButton}`),
    selectedFilters: block.querySelector(`.${CLASSES.selectedFilters}`),
  };

  // Toggle filters visibility and body overflow
  filterEls.button?.addEventListener('click', async () => {
    filterEls.list.classList.toggle('hide');
    filterEls.button.classList.toggle('overlay');
    if (window.innerWidth >= 744) {
      document.body.style.overflow = filterEls.list.classList.contains('hide') ? 'visible' : 'hidden';
    }
    updateArticleList(block);
  });

  // Handle checkbox clicks and selected filters
  filterEls.list?.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target.classList.contains(CLASSES.filterCheckbox)) {
      const facet = target.closest('fieldset').querySelector('legend').innerText.toLowerCase();
      const { name: itemName, id: itemId } = target;

      const itemIndex = appliedFilters[facet]?.indexOf(itemName);
      const item = docRange.createContextualFragment(`
        <div class="${CLASSES.selectedFilter} ${itemId}-filter">
          <p>${itemName}<p>
          <span class="icon icon-close"></span>
        </div>`);
      decorateIcons(item);

      filterEls.buttonContainer.classList.remove('hide');
      filterEls.clearBtn.classList.remove('hide');

      if (target.checked) {
        // add filter to list
        filterEls.selectedFilters.append(item);
        // if facet is empty create an empty array and add value
        if (!appliedFilters[facet]) {
          appliedFilters[facet] = [];
        }
        appliedFilters[facet].push(itemName);
      } else {
        // uncheck input
        filterEls.selectedFilters.querySelector(`.${itemId}-filter`).remove();
        appliedFilters[facet].splice(itemIndex, 1);
        // delete array key if array is empty
        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        // once all inputs are unchecked hide 'clear all' btn
        if (filterEls.selectedFilters.children.length === 0) {
          delete appliedFilters[facet];
          filterEls.buttonContainer.classList.add('hide');
          filterEls.clearBtn.classList.add('hide');
        }
      }

      // add closing functionality to X icon
      const selectedCloseIcon = filterEls.selectedFilters.querySelector(`.${itemId}-filter .icon`);
      selectedCloseIcon?.addEventListener('click', () => {
        target.checked = false;
        filterEls.selectedFilters.querySelector(`.${itemId}-filter`).remove();

        appliedFilters[facet].splice(itemIndex, 1);

        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        if (filterEls.selectedFilters.children.length === 0) {
          filterEls.buttonContainer.classList.add('hide');
          filterEls.clearBtn.classList.add('hide');
        }

        updateArticleList(block);
      });
    }
  });

  // Clear all filters
  filterEls.clearBtn.addEventListener('click', async () => {
    block.querySelectorAll(`.${CLASSES.filterCheckbox}`).forEach((checkbox) => (checkbox.checked = false));
    filterEls.buttonContainer.classList.add('hide');
    filterEls.clearBtn.classList.add('hide');
    filterEls.selectedFilters.innerHTML = '';
    appliedFilters = {};
    updateArticleList(block);
  });

  // Show more articles
  filterEls.showMoreBtn?.addEventListener('click', async () => {
    const collageEl = block.querySelector(`.${CLASSES.collage}`);

    counter = counter + 1;
    offset = counter * defaultAmountOfArticles;

    const { articles: moreArticles, count } = await getData(appliedFilters, offset);
    const newArticlesTemplate = buildArticlesTemplate(moreArticles);
    const newArticlesFragment = docRange.createContextualFragment(newArticlesTemplate);

    collageEl.appendChild(newArticlesFragment);
    const displayedArticles = defaultAmountOfArticles * (counter + 1);

    if (totalAmount <= displayedArticles) {
      filterEls.showMoreBtn.remove();
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
  const initialArticles = articles.slice(0, defaultAmountOfArticles);
  const template = buildTemplate(initialArticles, facets, count);

  blockWrapper.classList.add('full-width');

  block.appendChild(template);
  decorateIcons(block);

  addEventListeners(block, articles);
}
