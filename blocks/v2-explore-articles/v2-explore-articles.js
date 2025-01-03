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
  SELECTED: getTextLabel('Selected'),
  ERROR_TITLE: getTextLabel('Magazine error title'),
  ERROR_TEXT: getTextLabel('Magazine error text'),
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
  facetHeadingWrapper: `${blockName}__facet-heading-wrapper`,
  facetHeading: `${blockName}__facet-heading`,
  filterCheckbox: `${blockName}__filter-checkbox`,
  extraLine: `${blockName}__extra-line`,
  filterItem: `${blockName}__filter-item`,
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
let totalAmount = 0;
let offset = 0;
let counter = 0;
let appliedFilters = {};

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
            <input id="${itemId}" name="${value}" class="${CLASSES.filterCheckbox}" type="checkbox">
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
    totalAmount >= defaultAmountOfArticles
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

// Updates a single HTML element
const updateHtmlElmt = (block, selectedClass, newEl) => {
  const container = block.querySelector(`.${selectedClass}`);
  const newFragment = docRange.createContextualFragment(newEl);
  container.innerHTML = '';
  container.append(newFragment);
};

// Update the article list with the global object "appliedFilters"
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
  const htmlElts = {
    filterButton: block.querySelector(`.${CLASSES.filterButton}`),
    filterList: block.querySelector(`.${CLASSES.filterList}`),
    mobileBtnsContainer: block.querySelector(`.${CLASSES.applyClearBtns}`),
    clearBtn: block.querySelector(`.${CLASSES.clearAllFiltersBtn}`),
    facetHeadingWrapper: block.querySelectorAll(`.${CLASSES.facetHeadingWrapper}`),
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

      // Move filter button to the top of the screen
      const headerHeight = document.querySelector('.header-wrapper').getBoundingClientRect().height;
      const yOffset = htmlElts.filterButton.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: yOffset,
        behavior: 'smooth',
      });

      // Lock screen when filter opens
      document.body.classList.toggle('disable-scroll');

      // Apply changes when filter closes.
      if (htmlElts.filterList.classList.contains('hide')) {
        updateArticleList(block);
      }
    });
  });

  // Handle checkbox clicks and selected filters
  htmlElts.filterList?.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target.classList.contains(CLASSES.filterCheckbox)) {
      const facetHeading = target.closest(`.${CLASSES.facetList}`).querySelector(`.${CLASSES.facetHeading}`);
      const facet = facetHeading.innerText.toLowerCase();
      const { name: itemName, id: itemId } = target;

      // Create applied filter element
      const itemIndex = appliedFilters[facet]?.indexOf(itemName);
      const item = docRange.createContextualFragment(`
        <div class="${CLASSES.selectedFilter} ${itemId}-filter">
          <p>${itemName}<p>
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
        appliedFilters[facet].push(itemName);

        htmlElts.filterButton.dataset.amount = `(${getSelectedFilters()} ${LABELS.SELECTED})`;
        facetHeading.dataset.amount = `(${appliedFilters[facet].length} ${LABELS.SELECTED})`;
      } else {
        // uncheck input
        htmlElts.selectedFilters.querySelector(`.${itemId}-filter`).remove();
        appliedFilters[facet].splice(itemIndex, 1);

        htmlElts.filterButton.dataset.amount = `(${getSelectedFilters()} ${LABELS.SELECTED})`;
        facetHeading.dataset.amount = `(${appliedFilters[facet].length} ${LABELS.SELECTED})`;
        // delete array key if array is empty
        if (appliedFilters[facet].length === 0) {
          delete appliedFilters[facet];
        }

        // once all inputs are unchecked hide 'clear all' btn
        if (htmlElts.selectedFilters.children.length === 0) {
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

        if (htmlElts.selectedFilters.children.length === 0) {
          htmlElts.mobileBtnsContainer.classList.add('hide');
          htmlElts.clearBtn.classList.add('hide');
        }

        updateArticleList(block);
      });
    }
  });

  const mobileClearBtn = htmlElts.mobileBtnsContainer.querySelector(`.${CLASSES.clearFiltersBtn}`);
  const allClearBtns = [mobileClearBtn, htmlElts.clearBtn];
  // Clear all filters from both available buttons
  allClearBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      htmlElts.clearBtn.classList.add('hide');
      htmlElts.selectedFilters.innerHTML = '';
      delete htmlElts.filterButton.dataset.amount;
      block.querySelectorAll(`.${CLASSES.filterCheckbox}`).forEach((checkbox) => (checkbox.checked = false));
      block.querySelectorAll(`.${CLASSES.facetHeading}`).forEach((heading) => (heading.dataset.amount = ''));
      appliedFilters = {};

      updateArticleList(block);
    });
  });

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

    if (totalAmount <= displayedArticles) {
      htmlElts.showMoreBtn.remove();
      totalAmount = articles.length;
    }
    const newExtraLine = buildFiltersExtraLine(displayedArticles, count);
    updateHtmlElmt(block, CLASSES.extraLine, newExtraLine);

    decorateIcons(block);
  });

  // Toggle filter lists (ul) visibility in mobile
  htmlElts.filterList.addEventListener('click', (e) => {
    // Prevent this behaviour in desktop
    if (window.innerWidth >= 744) {
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
