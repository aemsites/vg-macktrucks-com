import { createElement, getTextLabel, capitalizeWords } from '../../scripts/common.js';
import { fetchMagazineData, formatArticlesArray, formatFacetsArray } from '../../scripts/services/magazine.service.js';

const blockName = 'explore-articles';

const queryVariables = { facets: ['ARTICLE', 'TRUCK'], sort: 'PUBLISH_DATE_DESC' };
const allMagazineData = await fetchMagazineData(queryVariables);
const allArticles = formatArticlesArray(allMagazineData?.items);
const allFacets = formatFacetsArray(allMagazineData?.facets);

const { truck: allTrucks, category: allCategories } = allFacets;
const [categoryPlaceholder, truckPlaceholder] = getTextLabel('Article filter placeholder').split(',');

let counter = 1;
const artsPerChunk = 4;

const divideArray = (mainArray, perChunk) => {
  const dividedArrays = mainArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return dividedArrays;
};

const getOptions = (list, placeholder) => {
  const options = [];
  list.unshift(placeholder);
  list.forEach((el) => {
    const option = createElement('option', { props: { value: el } });
    option.innerText = capitalizeWords(el);
    if (el.length !== 0) {
      options.push(option);
    }
  });
  return options;
};

const buildSelect = (type, array, text) => {
  const select = createElement('select', { classes: ['input-field', `${type}-input`], props: { id: type, name: type } });
  const options = getOptions(array, text);
  options.forEach((option) => {
    select.append(option);
  });
  return select;
};

const createTruckSection = (trucks) => {
  const truckList = trucks?.map((item) => item.replace('Mack ', '')).join(', ');
  return `
    <div class="article-truck">
      <img
        class="truck-icon"
        src="/icons/Truck_Key_icon.svg"
        alt="truck icon"
      />
      <p class="article-truck-text">${truckList}</p>
    </div>`;
};

const buildArticle = (article, idx) => {
  const linkUrl = new URL(article.path, window.location.origin);
  const categoriesWithDash = article.category.replaceAll(' ', '-').toLowerCase();
  const categoryUrl = new URL(`magazine/categories/${categoriesWithDash}`, window.location.origin);
  const articleDiv = createElement('div', { classes: 'article', props: { id: `group-${idx}` } });
  const articleContent = document.createRange().createContextualFragment(`
      <div class="article-image">
          <img src="${article.image}" alt="article image" class="image">
      </div>
      <div class="article-content">
          ${article.category ? `<a href="${categoryUrl}" class="article-category">${article.category}</a>` : ''}
          <a href="${linkUrl}" class="article-link">
            <h3 class="article-title">${article.title}</h3>
            ${article.description ? `<p class="article-subtitle">${article.description}</p>` : ''}
          </a>
          ${article.truck ? createTruckSection(article.truck) : ''}

      </div>
  `);
  articleDiv.append(articleContent);
  return articleDiv;
};

const loadMoreArticles = (evt, articleGroups, amountOfGroups) => {
  evt.preventDefault();
  const activeButton = evt.srcElement;
  const allShownArticles = document.querySelectorAll('.article');
  const lastShownArticle = allShownArticles[allShownArticles.length - 1];
  const lastShownId = +lastShownArticle.id.split('-').pop();
  const nextArticleGroup = articleGroups[lastShownId + 1];

  nextArticleGroup.forEach((e, idx) => {
    if (idx !== 0) {
      lastShownArticle.insertAdjacentElement('afterend', e);
    }
  });

  if (amountOfGroups - 1 <= counter) {
    activeButton.remove();
  }

  counter += 1;
};

const getArticleGroups = (artGroup) => {
  const groups = [];
  artGroup.forEach((articleGroup, idx) => {
    const group = [idx];
    articleGroup.forEach((el) => {
      const article = buildArticle(el, idx);
      group.push(article);
    });
    groups.push(group);
  });
  return groups;
};

const buildFirstArticles = (art, section) => {
  const firstArticles = art[0];
  firstArticles.forEach((e, idx) => {
    if (idx !== 0) {
      section.append(e);
    }
  });
};

const getSelectedAmount = (array) => {
  const initialValue = 0;
  const total = array.reduce((acc, curr) => acc + curr.length, initialValue);
  return total;
};

const buildArticleList = (articles) => {
  const groupedArticles = divideArray(articles, artsPerChunk);
  const articleGroups = getArticleGroups(groupedArticles);
  const selectedArticlesNumber = getSelectedAmount(groupedArticles);
  const amountOfGroups = articleGroups.length;

  const articlesSection = createElement('div', { classes: `${blockName}-articles` });
  const articlesContent = document.createRange().createContextualFragment(`
      <div class="pagination-section">
        <p class="article-amount">
          ${selectedArticlesNumber !== 0 ? `${selectedArticlesNumber} articles` : getTextLabel('No article Message')}
        </p>
      </div>
      <div class="article-list"></div>
      <div class="${blockName}-more">
        ${selectedArticlesNumber > artsPerChunk ? `<button class="more-btn">${getTextLabel('Load more articles button')}</button>` : ''}
      </div>
    `);

  if (articleGroups.length !== 0) {
    buildFirstArticles(articleGroups, articlesContent.querySelector('.article-list'));
    articlesContent.querySelector('.more-btn')?.addEventListener('click', (evt) => loadMoreArticles(evt, articleGroups, amountOfGroups));
  }
  articlesSection.append(articlesContent);

  return articlesSection;
};

const handleForm = () => {
  counter = 1;
  const fieldset = document.querySelector('#explore-magazine-fieldset');
  const selects = fieldset.querySelectorAll('select');
  const [catSelect, truckSelect] = selects;

  const filteredList = allArticles.filter((art) => {
    const truckValue = truckSelect.value.toLowerCase();
    const truckMatch = art.truck?.some((truck) => truck.toLowerCase() === truckValue);
    const categoryMatch = art.category.toLowerCase() === catSelect.value.toLowerCase();

    return (
      (catSelect.value === categoryPlaceholder && truckSelect.value === truckPlaceholder) ||
      (catSelect.value === categoryPlaceholder && truckMatch) ||
      (categoryMatch && truckSelect.value === truckPlaceholder) ||
      (categoryMatch && truckMatch)
    );
  });

  const articleList = document.querySelector(`.${blockName}-articles`);
  articleList.textContent = '';
  const filteredArticles = buildArticleList(filteredList, 0);
  articleList.append(filteredArticles);
};

const buildFieldset = () => {
  const formSection = createElement('div', { classes: `${blockName}-fieldset` });
  const formFragment = document.createRange().createContextualFragment(`
    <form>
      <fieldset class="fieldset filter-list" method="get" name="article-fieldset" id="explore-magazine-fieldset">
          <div class="category-field"></div>
          <div class="trucks-field"></div>
      </fieldset>
    </form>
  `);

  formFragment.querySelector('form').addEventListener('change', handleForm);
  formFragment.querySelector('.category-field').append(buildSelect('category', allCategories, categoryPlaceholder));
  formFragment.querySelector('.trucks-field').append(buildSelect('truck', allTrucks, truckPlaceholder));

  formSection.append(formFragment);

  return formSection;
};

export default async function decorate(block) {
  const children = block.querySelectorAll('p');
  const [title, text] = children;

  const generalSection = createElement('div', { classes: `${blockName}-section` });
  const contentWrapper = document.createRange().createContextualFragment(`
    <div class="${blockName}-heading">
      <h4 class="${blockName}-title" >${title.innerText}</h4>
      <p class="${blockName}-text" >${text.innerText}</p>
    </div>
    <div class="${blockName}-content"></div>
  `);

  contentWrapper.querySelector(`.${blockName}-content`).append(buildFieldset(), buildArticleList(allArticles, 0));

  generalSection.append(contentWrapper);

  block.textContent = '';
  block.append(generalSection);
}
