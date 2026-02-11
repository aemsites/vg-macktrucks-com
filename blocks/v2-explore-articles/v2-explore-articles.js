import { decorateIcons, getTextLabel } from '../../scripts/common.js';
import { fetchMagazineData, formatArticlesArray, formatFacetsArray } from '../../scripts/services/magazine.service.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const blockName = 'v2-explore-articles';

const LABELS = {
  SHOW_MORE: getTextLabel('v2_explore_articles:show_more_button_text'),
  SEARCH: getTextLabel('v2_explore_articles:search_articles'),
  SHOWING_PLACEHOLDER: getTextLabel('v2_explore_articles:showing_placeholder'),
  SORT_BY: getTextLabel('v2_explore_articles:sort_by'),
  SORT_MOST_RECENT: getTextLabel('v2_explore_articles:most_recent'),
  SORT_ALPHABETICAL: getTextLabel('v2_explore_articles:sort_alphabetical'),
  FILTERS_BUTTON: getTextLabel('v2_explore_articles:filters_button'),
  TOGGLE_FILTERS_MORE: getTextLabel('v2_explore_articles:show_more_button_text'),
  TOGGLE_FILTERS_LESS: getTextLabel('v2_explore_articles:show_less_button_text'),
  CLEAR_ALL_BUTTON: getTextLabel('v2_explore_articles:clear_all_button_text'),
  CLEAR_BUTTON: getTextLabel('v2_explore_articles:clear_button_text'),
  APPLY_BUTTON: getTextLabel('v2_explore_articles:apply_button_text'),
  SELECTED: getTextLabel('v2_explore_articles:selected_text'),
  ERROR_TITLE: getTextLabel('v2_explore_articles:error_title'),
  ERROR_TEXT: getTextLabel('v2_explore_articles:error_text'),
};

const CLASSES = {
  headSection: `${blockName}__head-section`,
  filterButton: `${blockName}__filter-button`,
  searchContainer: `${blockName}__search-container`,
  searchInput: `${blockName}__search-input`,
  sortContainer: `${blockName}__sort-container`,
  sortByDate: `${blockName}__sort-by-date`,
  sortByTitle: `${blockName}__sort-by-title`,
  switchContainer: `${blockName}__switch-container`,
  switchSlider: `${blockName}__switch-slider`,
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

const FILTER_KEYS = ['truck', 'topic', 'category'];
const FACET_NAME_TO_FILTER_KEY = {
  truck: 'truck',
  topic: 'topic',
  category: 'category',
  // "article" can be used as a facet label,
  // but it maps to the same filter dimension as "category"
  article: 'category',
};

const docRange = document.createRange();
const defaultAmountOfArticles = 9;
const widthBreakpoint = 744;
const sortingTypes = {
  byPublishDate: 'PUBLISH_DATE_DESC',
  alphabetical: 'ALPHABETICAL',
};

let totalArticleCount = 0;
let offset = 0;
let pageCounter = 0;
let appliedFilters = {};
let previousQueryFilters = {};
let amountOfFacets = 10000; // high default value
let appliedSortingCriteria = 'PUBLISH_DATE_DESC'; // sorting criteria defaults to: 'by date'

const getFilterKeyFromHeading = (facetHeadingEl) => {
  const facetName = facetHeadingEl?.textContent?.trim().toLowerCase();
  return facetName ? (FACET_NAME_TO_FILTER_KEY[facetName] ?? null) : null;
};

const readFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const filters = {};

  FILTER_KEYS.forEach((key) => {
    const raw = params.get(key);
    if (!raw) {
      return;
    }

    const values = raw
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const uniqueValues = [...new Set(values)];
    if (uniqueValues.length) {
      filters[key] = uniqueValues;
    }
  });

  return filters;
};

const writeFiltersToUrl = (filters) => {
  const params = new URLSearchParams(window.location.search);
  FILTER_KEYS.forEach((key) => params.delete(key));

  Object.entries(filters).forEach(([key, values]) => {
    if (!FILTER_KEYS.includes(key)) {
      return;
    }
    if (!Array.isArray(values) || values.length === 0) {
      return;
    }

    const cleanValues = [...new Set(values.map((v) => String(v).trim()).filter(Boolean))];
    if (cleanValues.length === 0) {
      return;
    }

    params.set(key, cleanValues.join(','));
  });

  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState({}, '', nextUrl);
  }
};

const syncUrlWithFilters = () => {
  writeFiltersToUrl(appliedFilters);
};

const applyFiltersToUi = (block, filters) => {
  const checkboxes = Array.from(block.querySelectorAll(`.${CLASSES.filterCheckbox}`));
  const checkboxByValue = new Map(checkboxes.map((cb) => [String(cb.value).trim(), cb]));
  let didApply = false;

  Object.entries(filters).forEach(([key, values]) => {
    if (!FILTER_KEYS.includes(key) || !Array.isArray(values)) {
      return;
    }

    values
      .map((v) => String(v).trim())
      .filter(Boolean)
      .forEach((value) => {
        const checkbox = checkboxByValue.get(value);
        if (checkbox && !checkbox.checked) {
          checkbox.click();
          didApply = true;
        }
      });
  });

  return didApply;
};

const getSelectedFiltersCount = () => Object.values(appliedFilters).reduce((sum, value) => (Array.isArray(value) ? sum + value.length : sum), 0);

const updateSelectedFiltersUiState = (htmlElts, facetHeading) => {
  if (!htmlElts) {
    return;
  }

  const selectedCount = getSelectedFiltersCount();
  const hasAnySelected = selectedCount > 0;

  if (htmlElts.filterButton) {
    if (hasAnySelected) {
      htmlElts.filterButton.dataset.amount = `(${selectedCount} ${LABELS.SELECTED})`;
    } else {
      delete htmlElts.filterButton.dataset.amount;
    }
  }

  if (facetHeading) {
    const facetKey = getFilterKeyFromHeading(facetHeading);
    const facetCount = facetKey && Array.isArray(appliedFilters?.[facetKey]) ? appliedFilters[facetKey].length : 0;

    if (facetCount > 0) {
      facetHeading.dataset.amount = `(${facetCount} ${LABELS.SELECTED})`;
    } else {
      delete facetHeading.dataset.amount;
    }
  }

  htmlElts.clearBtn?.classList.toggle('hide', !hasAnySelected);
  htmlElts.mobileBtnsContainer?.classList.toggle('hide', !hasAnySelected);
};

const setSelectedFiltersOverflowControlsHidden = (block, hidden) => {
  const showMoreButton = block.querySelector(`.${CLASSES.toggleMore}`);
  const showLessButton = block.querySelector(`.${CLASSES.toggleLess}`);

  [showMoreButton, showLessButton].filter(Boolean).forEach((button) => {
    button.style.display = hidden ? 'none' : '';
  });
};

const updateSelectedFiltersOverflowControls = (block) => {
  const selectedFiltersEl = block.querySelector(`.${CLASSES.selectedFilters}`);
  if (!selectedFiltersEl) {
    return;
  }

  const hasSelectedFilters = !!selectedFiltersEl.querySelector('.filter-item');

  const showMoreButton = block.querySelector(`.${CLASSES.toggleMore}`);
  const showLessButton = block.querySelector(`.${CLASSES.toggleLess}`);

  if (!hasSelectedFilters) {
    showMoreButton?.classList.add('hide');
    showLessButton?.classList.add('hide');
    return;
  }

  handleToggleBtns(selectedFiltersEl, 29);
};

// Gets the data from the API and formats it
const getData = async (articleSet = {}, offset = 0, sortingCriteria = appliedSortingCriteria) => {
  const queryVariables = {
    limit: defaultAmountOfArticles,
    offset: offset,
    facets: ['ARTICLE', 'TOPIC', 'TRUCK'],
    sort: sortingCriteria,
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

const buildFiltersExtraLine = (shownArticles, articlesAmount) => {
  const showingLabel = shownArticles < articlesAmount ? shownArticles : articlesAmount;
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
    <div class="${CLASSES.searchContainer}">
      <input class="${CLASSES.searchInput}" type="text" id="search" name="search" placeholder="${LABELS.SEARCH}">
    </div>
    <div class="${CLASSES.sortContainer} switch">
      <p>${LABELS.SORT_BY}:</p>
      <div class="${CLASSES.switchContainer}">
        <button value="${sortingTypes.byPublishDate}" class="${CLASSES.sortByDate} active">${LABELS.SORT_MOST_RECENT}</button>
        <button value="${sortingTypes.alphabetical}"class="${CLASSES.sortByTitle}">${LABELS.SORT_ALPHABETICAL}</button>
        <div class="${CLASSES.switchSlider}"></div>  
      </div>
    </div>
  </div>
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
const objectsAreTheSame = (obj1, obj2) => {
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
};

// Update the article list with the global object "appliedFilters"
const updateArticleList = async (block, offset = 0, sorting) => {
  if (objectsAreTheSame(previousQueryFilters, appliedFilters) && sorting === undefined) {
    return;
  }

  const { articles: newFilteredArticles, count } = await getData(appliedFilters, offset, sorting);
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
  const isDesktop = filters.closest('body')?.getBoundingClientRect().width >= widthBreakpoint;
  if (!isDesktop) {
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

const addEventListeners = (block) => {
  const htmlElts = {
    sortContainer: block.querySelectorAll(`.${CLASSES.sortContainer} button`),
    sortByDate: block.querySelector(`.${CLASSES.sortByDate}`),
    sortByTitle: block.querySelector(`.${CLASSES.sortByTitle}`),
    switchSlider: block.querySelector(`.${CLASSES.switchSlider}`),
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

  htmlElts.sortContainer.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('active')) {
        return;
      }
      // move slider
      htmlElts.switchSlider.style.left = htmlElts.switchSlider.classList.contains('move-right') ? '4px' : 'calc(50% - 4px)';
      htmlElts.switchSlider.classList.toggle('move-right');

      htmlElts.sortByDate.classList.toggle('active');
      htmlElts.sortByTitle.classList.toggle('active');

      // update sorting criteria
      appliedSortingCriteria = btn.value;

      updateArticleList(block, 0, btn.value);
    });
  });

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
        pageCounter = 0;
      }
    });
  });

  // Handle checkbox clicks and selected filters
  htmlElts.filterList?.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.classList.contains(CLASSES.filterCheckbox)) {
      const facetHeading = target.closest(`.${CLASSES.facetList}`).querySelector(`.${CLASSES.facetHeading}`);
      const facet = getFilterKeyFromHeading(facetHeading);
      if (!facet) {
        return;
      }
      const { value: itemValue, id: itemId } = target;

      // Create applied filter element
      const item = docRange.createContextualFragment(`
        <div class="${CLASSES.selectedFilter} ${itemId}-filter filter-item">
          <p>${itemValue}<p>
          <span class="icon icon-close"></span>
        </div>`);
      decorateIcons(item);

      if (target.checked) {
        // add filter to list
        htmlElts.selectedFilters.append(item);

        if (!appliedFilters[facet]) {
          appliedFilters[facet] = [];
        }
        appliedFilters[facet].push(itemValue);

        handleToggleBtns(htmlElts.selectedFilters, 29);
        updateSelectedFiltersUiState(htmlElts, facetHeading);
        syncUrlWithFilters();
      } else {
        // uncheck input
        const itemIndex = appliedFilters[facet].indexOf(itemValue);
        htmlElts.selectedFilters.querySelector(`.${itemId}-filter`).remove();
        appliedFilters[facet].splice(itemIndex, 1);

        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        handleToggleBtns(htmlElts.selectedFilters);
        updateSelectedFiltersUiState(htmlElts, facetHeading);
        syncUrlWithFilters();
      }

      // Add closing functionality to X icon
      const selectedCloseIcon = htmlElts.selectedFilters.querySelector(`.${itemId}-filter .icon`);
      selectedCloseIcon?.addEventListener('click', () => {
        const itemIndex = appliedFilters[facet].indexOf(target.value);
        target.checked = false;
        htmlElts.selectedFilters.querySelector(`.${itemId}-filter`).remove();

        appliedFilters[facet].splice(itemIndex, 1);

        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        pageCounter = 0;

        updateSelectedFiltersUiState(htmlElts, facetHeading);
        handleToggleBtns(htmlElts.selectedFilters);
        syncUrlWithFilters();
        updateArticleList(block);
      });
    }
  });

  const mobileClearBtn = htmlElts.mobileBtnsContainer.querySelector(`.${CLASSES.clearFiltersBtn}`);
  const allClearBtns = [mobileClearBtn, htmlElts.clearBtn];
  // Clear all filters from both available buttons
  allClearBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentFilters = block.querySelectorAll(`.${CLASSES.selectedFilter}`);
      currentFilters.forEach((filter) => filter.remove());

      htmlElts.filterCheckbox.forEach((checkbox) => (checkbox.checked = false));
      htmlElts.facetHeading.forEach((heading) => delete heading.dataset.amount);
      htmlElts.toggleFilters.forEach((btn) => btn.classList.add('hide'));
      htmlElts.selectedFilters.classList.remove('expand');

      appliedFilters = {};
      syncUrlWithFilters();
      pageCounter = 0;

      updateSelectedFiltersUiState(htmlElts);
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

    pageCounter = pageCounter + 1;
    offset = pageCounter * defaultAmountOfArticles;

    const { articles: moreArticles, count } = await getData(appliedFilters, offset);
    const newArticlesTemplate = buildArticlesTemplate(moreArticles);
    const newArticlesFragment = docRange.createContextualFragment(newArticlesTemplate);

    collageEl.appendChild(newArticlesFragment);
    const displayedArticles = defaultAmountOfArticles * (pageCounter + 1);
    totalArticleCount = count;

    if (totalArticleCount <= displayedArticles) {
      htmlElts.showMoreBtn.parentElement.classList.add('hide');
    }
    const newExtraLine = buildFiltersExtraLine(displayedArticles, count);
    updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

    decorateIcons(block);
  });

  // Toggle filter lists (ul) visibility only in mobile
  htmlElts.filterList.addEventListener('click', (e) => {
    const isDesktop = e.target.closest('body')?.getBoundingClientRect().width >= widthBreakpoint;
    if (isDesktop) {
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

  addEventListeners(block);

  setSelectedFiltersOverflowControlsHidden(block, true);

  const urlFilters = readFiltersFromUrl();
  const didApplyUrlFilters = applyFiltersToUi(block, urlFilters);

  if (didApplyUrlFilters) {
    writeFiltersToUrl(urlFilters);

    pageCounter = 0;
    offset = 0;
    await updateArticleList(block, 0, appliedSortingCriteria);
  }

  // Run after layout is settled to correctly measure overflow
  requestAnimationFrame(() => {
    updateSelectedFiltersOverflowControls(block);
    setSelectedFiltersOverflowControlsHidden(block, false);
  });
}
