import { decorateIcons, getTextLabel } from '../../scripts/common.js';
import { fetchMagazineData, formatArticlesArray, formatFacetsArray } from '../../scripts/services/magazine.service.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const blockName = 'v2-explore-articles';

const LABELS = {
  SHOW_MORE: getTextLabel('Show More'),
  SEARCH: getTextLabel('Search'),
  FILTERS_PLACEHOLDERS: getTextLabel('Magazine filters placeholders'),
  SHOWING_PLACEHOLDER: getTextLabel('Showing placeholder'),
  SORT_BY: getTextLabel('Sort by'),
  SORT_PLACEHOLDERS: getTextLabel('Sort filter placeholders'),
  FILTERS_BUTTON: getTextLabel('Filter articles'),
  TOGGLE_FILTERS_MORE: getTextLabel('Show more'),
  TOGGLE_FILTERS_LESS: getTextLabel('Show less'),
  CLEAR_ALL_BUTTON: getTextLabel('Clear all'),
  CLEAR_BUTTON: getTextLabel('Clear'),
  APPLY_BUTTON: getTextLabel('Apply'),
  SELECTED: getTextLabel('Selected'),
  ERROR_TITLE: getTextLabel('Magazine error title'),
  ERROR_TEXT: getTextLabel('Magazine error text'),
};

const CLASSES = {
  headSection: `${blockName}__head-section`,
  filterButton: `${blockName}__filter-button`,
  filters: `${blockName}__filters`,
  filterList: `${blockName}__filter-list`,
  selectedFilters: `${blockName}__selected-filters`,
  selectedFilter: `${blockName}__selected-filter`,
  toggleFilters: `${blockName}__toggle-filters`,
  toggleLess: `${blockName}__toggle-less`,
  toggleMore: `${blockName}__toggle-more`,
  applyClearBtns: `${blockName}__apply-clear-buttons`,
  applyFiltersBtn: `${blockName}__apply-filters-button`,
  clearFiltersBtn: `${blockName}__clear-filters-button`,
  clearAllFiltersBtn: `${blockName}__clear-all-filters-button`,
  filterListTitle: `${blockName}__filter-list-title`,
  facetList: `${blockName}__facet-list`,
  facetHeadingWrapper: `${blockName}__facet-heading-wrapper`,
  facetHeading: `${blockName}__facet-heading`,
  filterCheckbox: `${blockName}__filter-checkbox`,
  extraLine: `${blockName}__extra-line`,
  showing: `${blockName}__showing`,
  sortBy: `${blockName}__sort-by`,
  collageWrapper: `${blockName}__collage-wrapper`,
  loadingOverlay: `${blockName}__loading-overlay`,
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
let totalArticleCount = 0;
let offset = 0;
let counter = 0;
let appliedFilters = {};
let previousQueryFilters = {};
const MQ = window.matchMedia('(max-width: 743px)');
const isMobile = MQ.matches;
let amountOfFacets = 10000; // high default value

// Gets the data from the API and formats it
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

  amountOfFacets = Object.values(allFacets)?.reduce((sum, array) => sum + array?.length, 0);

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

  totalArticleCount = count;

  return {
    articles: collageItemsData,
    facets: allFacets,
    count,
  };
};

const buildFiltersExtraLine = (recievedArticles = defaultAmountOfArticles, articlesAmount = totalArticleCount) => {
  const showingLabel = recievedArticles < totalArticleCount ? recievedArticles : totalArticleCount;
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
        <div class="${CLASSES.facetList}">
          <div class="${CLASSES.facetHeadingWrapper}">
            <h5 class="${CLASSES.facetHeading}">${key}</h5>
            <span class="icon icon-chevron-down-thin"></span>
          </div>
          <ul>
      `;
    for (const value of values) {
      const itemId = value.replaceAll(' ', '-');
      filterList += `
          <li>
            <input id="${itemId}" value="${value}" class="${CLASSES.filterCheckbox}" type="checkbox">
            <label for="${itemId}">${value}<label>
          </li>
        `;
    }
    filterList += '</ul></div>';
  }

  filterList += '</div>';
  return filterList;
};

const buildShowMoreBtn = () => {
  const showMoreButton =
    totalArticleCount >= defaultAmountOfArticles
      ? `<button class="${CLASSES.showMoreButton} button button--secondary button--large"> ${LABELS.SHOW_MORE}</button>`
      : '';

  return showMoreButton;
};

const buildTemplate = (articles, facets, articlesAmount) => {
  const template = docRange.createContextualFragment(`
  <div class="${CLASSES.headSection}">
    <div class="${CLASSES.filterButton}">
      <a class="standalone-link">
        <span class="icon icon-filter-settings"></span>
        ${LABELS.FILTERS_BUTTON}
      </a>
    </div>
    <div class="${CLASSES.extraLine}">
      ${buildFiltersExtraLine(articles.length, articlesAmount)}
    </div>
  </div>
  <div class="${CLASSES.filters}">
    ${buildFilterLists(facets)}
    <div class="${CLASSES.selectedFilters}">
      <button 
        class="${CLASSES.toggleFilters} ${CLASSES.toggleLess} button button--secondary hide"
        style="order: ${amountOfFacets + 1 /* ensure that this button always appears last */};">
        ${LABELS.TOGGLE_FILTERS_LESS}
      </button>
    </div>
    <div class="${CLASSES.applyClearBtns} hide">
      <button class="${CLASSES.clearFiltersBtn} button button--secondary button--large">
        ${LABELS.CLEAR_BUTTON}
      </button>
      <button class="${CLASSES.applyFiltersBtn} button button--primary button--large">
        ${LABELS.APPLY_BUTTON}
      </button>
    </div>
    <button class="${CLASSES.toggleFilters} ${CLASSES.toggleMore} button button--secondary hide">
      ${LABELS.TOGGLE_FILTERS_MORE}
    </button>
    <a class="${CLASSES.clearAllFiltersBtn} standalone-link hide">
      ${LABELS.CLEAR_ALL_BUTTON}
    </a>
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

// Updates a single HTML element
const updateHtmlElmt = (block, selectedClass, newEl) => {
  const container = block.querySelector(`.${selectedClass}`);
  const newFragment = docRange.createContextualFragment(newEl);
  container.innerHTML = '';
  container.append(newFragment);
};

// Compares if 2 objects are the same
function objectsAreTheSame(obj1, obj2) {
  // Check objects
  if (obj1 === obj2) {
    return true;
  }
  // Check amount of keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  // Check values
  for (const key of keys1) {
    if (!keys2.includes(key) || !objectsAreTheSame(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

// Update the article list with the global object "appliedFilters"
const updateArticleList = async (block, offset = 0) => {
  if (objectsAreTheSame(previousQueryFilters, appliedFilters)) {
    return;
  }

  const { articles: newFilteredArticles, count } = await getData(appliedFilters, offset);
  // Store the last query to compare next time
  previousQueryFilters = JSON.parse(JSON.stringify(appliedFilters));
  totalArticleCount = count;

  const newExtraLine = buildFiltersExtraLine(defaultAmountOfArticles, totalArticleCount);
  updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

  const newArticlesTemplate = buildArticlesTemplate(newFilteredArticles);
  updateHtmlElmt(block, CLASSES.collage, newArticlesTemplate);

  const showMoreBtnWrapper = block.querySelector(`.${CLASSES.showMoreButtonWrapper}`);
  showMoreBtnWrapper.classList[newFilteredArticles.length >= count && count <= defaultAmountOfArticles ? 'add' : 'remove']('hide');

  const noArticlesMessage = block.querySelector(`.${CLASSES.noArticlesMessage}`);
  noArticlesMessage.classList[count == 0 ? 'remove' : 'add']('hide');
};

// Check toggle buttons to show or hide applied filters
const handleToggleBtns = (filters, extra = 0) => {
  if (isMobile) {
    return;
  }
  const toggleMoreBtn = filters.parentElement.querySelector(`.${CLASSES.toggleMore}`);
  const toggleLessBtn = filters.parentElement.querySelector(`.${CLASSES.toggleLess}`);

  const { width: listWidth, height: listHeight } = filters.getBoundingClientRect();
  const wrapperWidth = filters.parentElement.getBoundingClientRect().width;

  const maxListWidth = wrapperWidth * 0.75 - (window.innerWidth < 1200 ? 48 : 0); // padding of 24 + 24 is set to max 1200 screen
  const listPlusExtra = listWidth + extra; // when adding filters 29px are missing in the getBoundingClientRect() method

  const listBiggerThanWrapper = listPlusExtra >= maxListWidth; // if list is wider than the container
  const sizeDifference = Math.round(maxListWidth - listPlusExtra); // difference between the avialable and the taken space
  const isMultiLine = listHeight > 36; // this is the height of the filter wrapper's height in CSS

  if (listBiggerThanWrapper || sizeDifference < 50) {
    if (isMultiLine) {
      toggleMoreBtn.classList.add('hide');
      toggleLessBtn.classList.remove('hide');
    } else {
      toggleMoreBtn.classList.remove('hide');
      toggleLessBtn.classList.add('hide');
    }
  } else {
    toggleMoreBtn.classList.add('hide');
    toggleLessBtn.classList.add('hide');
  }
};

const addEventListeners = (block, articles) => {
  const htmlElts = {
    filterButton: block.querySelector(`.${CLASSES.filterButton}`),
    filterList: block.querySelector(`.${CLASSES.filterList}`),
    toggleFilters: block.querySelectorAll(`.${CLASSES.toggleFilters}`),
    toggleLess: block.querySelector(`.${CLASSES.toggleLess}`),
    toggleMore: block.querySelector(`.${CLASSES.toggleMore}`),
    mobileBtnsContainer: block.querySelector(`.${CLASSES.applyClearBtns}`),
    clearBtn: block.querySelector(`.${CLASSES.clearAllFiltersBtn}`),
    facetHeadingWrapper: block.querySelectorAll(`.${CLASSES.facetHeadingWrapper}`),
    facetHeading: block.querySelectorAll(`.${CLASSES.facetHeading}`),
    filterCheckbox: block.querySelectorAll(`.${CLASSES.filterCheckbox}`),
    selectedFilters: block.querySelector(`.${CLASSES.selectedFilters}`),
    showMoreBtn: block.querySelector(`.${CLASSES.showMoreButton}`),
  };

  const mobileApplyBtn = htmlElts.mobileBtnsContainer.querySelector(`.${CLASSES.applyFiltersBtn}`);
  const allApplyBtns = [mobileApplyBtn, htmlElts.filterButton];
  // Handles the filter and apply btn clicks
  allApplyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      htmlElts.filterList.classList.toggle('hide');
      htmlElts.filterButton.classList.toggle('overlay');
      htmlElts.mobileBtnsContainer.classList.toggle('hide');
      htmlElts.filterButton.style.setProperty('--display-icon', htmlElts.filterButton.classList.contains('overlay') ? 'inline-flex' : 'none');

      // Scroll to the top so filters open in view
      const headerHeight = document.querySelector('.header-wrapper').getBoundingClientRect().height;
      const yOffset = htmlElts.filterButton.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: yOffset,
        behavior: 'smooth',
      });

      // Lock screen when filter opens
      document.body.classList.add('disable-scroll');

      // Apply changes when filter closes.
      if (htmlElts.filterList.classList.contains('hide')) {
        updateArticleList(block);
        document.body.classList.remove('disable-scroll');
      }
    });
  });

  // Handle checkbox clicks and selected filters
  htmlElts.filterList?.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.classList.contains(CLASSES.filterCheckbox)) {
      const facetHeading = target.closest(`.${CLASSES.facetList}`).querySelector(`.${CLASSES.facetHeading}`);
      const facet = facetHeading.innerText.toLowerCase();
      const { value: itemValue, id: itemId } = target;

      // Create applied filter element
      const itemIndex = appliedFilters[facet]?.indexOf(itemValue);
      const item = docRange.createContextualFragment(`
        <div class="${CLASSES.selectedFilter} ${itemId}-filter filter-item">
          <p>${itemValue}<p>
          <span class="icon icon-close"></span>
        </div>`);
      decorateIcons(item);

      htmlElts.mobileBtnsContainer.classList.remove('hide');
      htmlElts.clearBtn.classList.remove('hide');

      const getSelectedFilters = () => Object.values(appliedFilters).reduce((sum, value) => (Array.isArray(value) ? sum + value.length : sum), 0);

      if (target.checked) {
        // add filter to list
        htmlElts.selectedFilters.append(item);
        // if facet is empty create an empty array and add value
        if (!appliedFilters[facet]) {
          appliedFilters[facet] = [];
        }
        appliedFilters[facet].push(itemValue);

        htmlElts.filterButton.dataset.amount = `(${getSelectedFilters()} ${LABELS.SELECTED})`;
        facetHeading.dataset.amount = `(${appliedFilters[facet].length} ${LABELS.SELECTED})`;

        handleToggleBtns(htmlElts.selectedFilters, 29);
      } else {
        // uncheck input
        htmlElts.selectedFilters.querySelector(`.${itemId}-filter`).remove();
        appliedFilters[facet].splice(itemIndex, 1);

        htmlElts.filterButton.dataset.amount = getSelectedFilters() > 0 ? `(${getSelectedFilters()} ${LABELS.SELECTED})` : '';
        facetHeading.dataset.amount = appliedFilters[facet].length > 0 ? `(${appliedFilters[facet].length} ${LABELS.SELECTED})` : '';

        handleToggleBtns(htmlElts.selectedFilters);

        // delete array key if array is empty
        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        // once all inputs are unchecked hide 'clear all' btn
        if (htmlElts.selectedFilters.querySelectorAll('.filter-item').length === 0) {
          delete appliedFilters[facet];
          htmlElts.clearBtn.classList.add('hide');
          delete htmlElts.filterButton.dataset.amount;
          delete facetHeading.dataset.amount;
        }
      }

      // Add closing functionality to X icon
      const selectedCloseIcon = htmlElts.selectedFilters.querySelector(`.${itemId}-filter .icon`);
      selectedCloseIcon?.addEventListener('click', () => {
        target.checked = false;
        htmlElts.selectedFilters.querySelector(`.${itemId}-filter`).remove();

        appliedFilters[facet].splice(itemIndex, 1);

        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        if (htmlElts.selectedFilters.querySelectorAll('.filter-item').length === 0) {
          htmlElts.mobileBtnsContainer.classList.add('hide');
          htmlElts.clearBtn.classList.add('hide');
        }
        handleToggleBtns(htmlElts.selectedFilters);
        updateArticleList(block);
      });
    }
  });

  const mobileClearBtn = htmlElts.mobileBtnsContainer.querySelector(`.${CLASSES.clearFiltersBtn}`);
  const allClearBtns = [mobileClearBtn, htmlElts.clearBtn];
  // Clear all filters from both available buttons
  allClearBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Get all currently added filter items
      const currentFilters = block.querySelectorAll(`.${CLASSES.selectedFilter}`);
      currentFilters.forEach((filter) => filter.remove());

      htmlElts.clearBtn.classList.add('hide');
      htmlElts.filterCheckbox.forEach((checkbox) => (checkbox.checked = false));
      htmlElts.facetHeading.forEach((heading) => (heading.dataset.amount = ''));
      htmlElts.toggleFilters.forEach((btn) => btn.classList.add('hide'));
      htmlElts.selectedFilters.classList.remove('expand');
      delete htmlElts.filterButton.dataset.amount;

      appliedFilters = {};
      counter = 1;

      updateArticleList(block);
    });
  });

  // "Show more" and "Show less" filter buttons
  htmlElts.toggleFilters.forEach((btn) =>
    btn.addEventListener('click', () => {
      htmlElts.toggleMore.classList.toggle('hide');
      htmlElts.toggleLess.classList.toggle('hide');
      htmlElts.selectedFilters.classList.toggle('expand');
    }),
  );

  // Show more articles
  htmlElts.showMoreBtn.addEventListener('click', async () => {
    const collageEl = block.querySelector(`.${CLASSES.collage}`);

    counter = counter + 1;
    offset = counter * defaultAmountOfArticles;

    const { articles: moreArticles, count } = await getData(appliedFilters, offset);
    const newArticlesTemplate = buildArticlesTemplate(moreArticles);
    const newArticlesFragment = docRange.createContextualFragment(newArticlesTemplate);

    collageEl.appendChild(newArticlesFragment);
    const displayedArticles = defaultAmountOfArticles * (counter + 1);

    if (totalArticleCount <= displayedArticles) {
      htmlElts.showMoreBtn.remove();
      totalArticleCount = articles.length;
    }
    const newExtraLine = buildFiltersExtraLine(displayedArticles, count);
    updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

    decorateIcons(block);
  });

  // Toggle filter lists (ul) visibility in mobile
  htmlElts.filterList.addEventListener('click', (e) => {
    if (!isMobile) {
      return;
    }
    const clickedTarget = e.target.closest(`.${CLASSES.facetHeadingWrapper}`);
    if (e.target.classList.contains(CLASSES.facetHeadingWrapper) || clickedTarget) {
      clickedTarget.querySelector('svg').classList.toggle('rotate');

      const selectedChecklist = e.target.closest(`.${CLASSES.facetList}`);
      selectedChecklist.querySelector('ul').classList.toggle('expand');
    }
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
