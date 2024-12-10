import {
  createElement,
  getOrigin,
  getTextLabel,
} from '../../scripts/common.js';
import {
  extractLimitFromBlock,
  clearRepeatedArticles,
  sortArticlesByDateField,
  fetchMagazineData,
  formatArticlesArray,
} from '../../scripts/services/magazine.service.js';
import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';

const recommendationsText = getTextLabel('Recommendations text');
const readNowText = getTextLabel('READ NOW');
const defaultLimit = 2;
const blockName = 'recommendations';

const createList = (articles, template) => `
  <ul class="${blockName}-list">
    ${articles.map((e, idx) => {
    const picture = createOptimizedPicture(e.image, e.title);
    const pictureTag = picture.outerHTML;
    const linkUrl = new URL(e.path, getOrigin());

    const articleCategory = e.category;
    const categoryWithDash = articleCategory.replaceAll(' ', '-').toLowerCase();
    const categoryUrl = new URL(`magazine/categories/${categoryWithDash}`, getOrigin());

    const truckList = e.truck?.join(', ');
    const truckSection = `
      <div class="${blockName}-truck">
        <img
          class="truck-icon"
          src="/icons/Truck_Key_icon.svg"
          alt="truck icon"
        />
        <p class="${blockName}-truck-text">${truckList}</p>
      </div>`;

    return (`
      <li class="${blockName}-item ${blockName}-item-${idx}">
        <div class="${blockName}-image">
          <a href="" class="image-link">
            ${pictureTag}
          </a>
        </div>
        <div class="${blockName}-text-content">
          ${e.category && template ? `<a class="${blockName}-category" href="${categoryUrl}">${e.category}</a>` : ''}
          <a class="${blockName}-title" href="${linkUrl}">${e.title}</a>
          ${e.truck && !template ? truckSection : ''}
          <a class="${blockName}-link" href="${linkUrl}">${readNowText}</a>
        </div>
      </li>`
    );
  }).join('')}
  </ul>`;

export default async function decorate(block) {
  const limit = extractLimitFromBlock(block) || defaultLimit;
  const isTemplate = document.body.classList.contains('magazine');
  const category = getMetadata('article-category');

  const queryVariables = { facets: ['ARTICLE'] };
  const allData = await fetchMagazineData(queryVariables);
  const allArticles = formatArticlesArray(allData?.items);

  const recommendedArticles = allArticles.filter((e) => e.category === category);
  const sortedArticles = sortArticlesByDateField(recommendedArticles, 'lastModified');
  const filteredArticles = clearRepeatedArticles(sortedArticles);
  const selectedArticles = filteredArticles.slice(0, limit);

  const recommendationsSection = createElement('div', { classes: `${blockName}-section` });
  const recommendationsContent = document.createRange().createContextualFragment(`
        <h3 class="${blockName}-section-title">${recommendationsText}</h3>
        ${createList(selectedArticles, isTemplate)}
      `);

  recommendationsSection.append(recommendationsContent);
  block.textContent = '';
  block.append(recommendationsSection);
}
