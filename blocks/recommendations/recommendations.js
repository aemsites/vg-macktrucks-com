import { createElement, getOrigin, getTextLabel } from '../../scripts/common.js';
import {
  extractLimitFromBlock,
  clearRepeatedArticles,
  fetchMagazineData,
  formatArticlesArray,
  isMagazineTemplate,
} from '../../scripts/services/magazine.service.js';
import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';

const recommendationsText = getTextLabel('Recommendations text');
const readNowText = getTextLabel('READ NOW');
const defaultLimit = 2;
const blockName = 'recommendations';

const createTruckSection = (trucks) => {
  const truckList = trucks?.map((item) => item.replace('Mack ', '')).join(', ');
  return `
    <div class="${blockName}-truck">
      <img
        class="truck-icon"
        src="/icons/Truck_Key_icon.svg"
        alt="truck icon"
      />
      <p class="${blockName}-truck-text">${truckList}</p>
    </div>`;
};

const createList = (articles) => `
  <ul class="${blockName}-list">
    ${articles
      .map((article, idx) => {
        const picture = createOptimizedPicture(article.image, article.title);
        const pictureTag = picture.outerHTML;
        const linkUrl = new URL(article.path, getOrigin());

        const articleCategory = article.category;
        const categoryWithDash = articleCategory.replaceAll(' ', '-').toLowerCase();
        const categoryUrl = new URL(`magazine/categories/${categoryWithDash}`, getOrigin());

        return `
        <li class="${blockName}-item ${blockName}-item-${idx}">
          <div class="${blockName}-image">
            <a href="" class="image-link">
              ${pictureTag}
            </a>
          </div>
          <div class="${blockName}-text-content">
            ${article.category && isMagazineTemplate ? `<a class="${blockName}-category" href="${categoryUrl}">${article.category}</a>` : ''}
            <a class="${blockName}-title" href="${linkUrl}">${article.title}</a>
            ${article.truck && !isMagazineTemplate ? createTruckSection(article.truck) : ''}
            <a class="${blockName}-link" href="${linkUrl}">${readNowText}</a>
          </div>
        </li>`;
      })
      .join('')}
    </ul>`;

export default async function decorate(block) {
  const limit = extractLimitFromBlock(block) || defaultLimit;
  const category = getMetadata('article-category');

  const queryVariables = {
    limit: limit + 1,
    facets: ['ARTICLE'],
    sort: 'LAST_MODIFIED_DESC',
    article: { category },
  };
  const allMagazineData = await fetchMagazineData(queryVariables);
  const allArticles = formatArticlesArray(allMagazineData?.items);

  const filteredArticles = clearRepeatedArticles(allArticles);
  const selectedArticles = filteredArticles.slice(0, limit);

  const recommendationsSection = createElement('div', { classes: `${blockName}-section` });
  const recommendationsContent = document.createRange().createContextualFragment(`
        <h3 class="${blockName}-section-title">${recommendationsText}</h3>
        ${createList(selectedArticles)}
      `);

  recommendationsSection.append(recommendationsContent);
  block.textContent = '';
  block.append(recommendationsSection);
}
