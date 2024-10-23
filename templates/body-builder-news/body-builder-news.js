import {
  getMetadata,
  buildBlock,
  decorateBlock,
} from '../../scripts/aem.js';
import { findAndCreateImageLink } from '../../scripts/scripts.js';
import {
  createElement,
  decorateIcons,
} from '../../scripts/common.js';

async function buildNewsData(h1) {
  const pubdate = getMetadata('date');
  const stats = createElement('div', { classes: 'news-stats' });
  const pubDateSpan = createElement('span', { classes: 'pubdate' });
  pubDateSpan.innerHTML = pubdate;
  stats.append(pubDateSpan);

  h1.insertAdjacentElement('afterend', stats);
  decorateIcons(h1.parentElement);
}

export default async function decorate(doc) {
  const h1 = doc.querySelector('h1');
  buildNewsData(h1);

  const classes = ['section'];
  const sidebarSection = createElement('div', {
    classes,
    props: {
      'data-section-status': 'initialized',
    },
  });
  const sidebarContainer = createElement('div');
  sidebarSection.append(sidebarContainer);

  const bodyBuilderNewsContent = doc.querySelector('main .section:not(.related-content-container, .news-cards-container)');
  bodyBuilderNewsContent.classList.add('body-builder-news-content');

  findAndCreateImageLink(bodyBuilderNewsContent);

  // finding picture/video wrappers
  [...bodyBuilderNewsContent.querySelectorAll('picture, a.image-link')].forEach((pic) => {
    const parent = pic.parentElement;
    const isParentPicturesWrapper = [...parent.children].every((el) => el.tagName.toLowerCase() === 'picture'
        || el.classList.contains('image-link')
        || el.tagName.toLowerCase() === 'br');

    if (isParentPicturesWrapper) {
      parent.classList.add('body-builder-news-pictures-wrapper');
      // removing break lines - they aren't needed for images dispalyed in one row
      parent.querySelectorAll('br').forEach((br) => br.remove());
    }
  });

  const newsSidebar = buildBlock('news-sidebar', '');
  sidebarContainer.append(newsSidebar);
  // for performance (Speed Index) the sidebar is added after the mack news
  // and displayed before mack news content thanks to CSS rule
  bodyBuilderNewsContent.insertAdjacentElement('afterend', sidebarSection);
  decorateBlock(newsSidebar);
}
