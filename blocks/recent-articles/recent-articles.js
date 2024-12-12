import {
  createElement,
  getOrigin,
  getTextLabel,
} from '../../scripts/common.js';
import {
  extractLimitFromBlock,
  clearRepeatedArticles,
  fetchMagazineData,
  formatArticlesArray,
} from '../../scripts/services/magazine.service.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const sectionTitle = getTextLabel('Recent article text');
const readNowText = getTextLabel('READ NOW');
const defaultLimit = 5;
const blockName = 'recent-articles';

const createList = (articles) => `
  <ul class="${blockName}-list">
  ${articles.map((e, idx) => {
    const firstOrRestClass = (idx === 0) ? 'first' : 'rest';
    const picture = createOptimizedPicture(e.image, e.title);
    const pictureTag = picture.outerHTML;
    const linkUrl = new URL(e.path, getOrigin());

    const articleCategory = e.category;
    const categoryWithDash = articleCategory.replaceAll(' ', '-').toLowerCase();
    const categoryUrl = new URL(`magazine/categories/${categoryWithDash}`, getOrigin());

    return (
      `<li class="${blockName}-${firstOrRestClass}-item">
        <div class="${blockName}-${firstOrRestClass}-image">
          <a href="${linkUrl}">${pictureTag}</a>
        </div>
        ${(idx === 0 && e.category) ? `<a class="${blockName}-${firstOrRestClass}-category" href="${categoryUrl}">${e.category}</a>` : ''}
        <a class="${blockName}-${firstOrRestClass}-title" href="">${e.title}</a>
        ${(idx === 0 && e.subtitle) ? `<p class="${blockName}-${firstOrRestClass}-subtitle">${e.subtitle}</p>` : ''}
        ${(idx === 0) ? `<a class="${blockName}-${firstOrRestClass}-link" href="${linkUrl}">${readNowText}</a>` : ''}
      </li>`
    );
  }).join('')}
  </ul>`;

export default async function decorate(block) {
  const limit = extractLimitFromBlock(block) || defaultLimit;

  const queryVariables = { limit: limit + 1, sort: 'LAST_MODIFIED_DESC' };
  const allData = await fetchMagazineData(queryVariables);
  const allArticles = formatArticlesArray(allData?.items);

  const filteredArticles = clearRepeatedArticles(allArticles);
  const selectedArticles = filteredArticles.slice(0, limit);

  const recentArticlesSection = createElement('div', { classes: `${blockName}-section` });
  const recentArticleContent = document.createRange().createContextualFragment(`
      <h3 class="${blockName}-section-title">${sectionTitle}</h3>
      ${createList(selectedArticles)}
    `);
  recentArticlesSection.append(recentArticleContent);

  block.textContent = '';
  block.append(recentArticlesSection);
}
