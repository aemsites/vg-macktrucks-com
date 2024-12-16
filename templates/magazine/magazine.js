import { getMetadata, createOptimizedPicture, loadBlock } from '../../scripts/aem.js';
import { createElement, getPlaceholders } from '../../scripts/common.js';
import { getArticleTags } from '../../scripts/services/magazine.service.js';

async function buildArticleHero({ truckTags, categoryTag } = {}) {
  const title = getMetadata('og:title');
  const headPic = getMetadata('og:image');
  const headAlt = getMetadata('og:image:alt');

  const truckModel = truckTags || getMetadata('truck');
  const category = categoryTag || getMetadata('category');

  const section = createElement('div', { classes: ['section', 'template', 'article-template', 'article-hero-container'] });

  const headImg = createOptimizedPicture(headPic, headAlt);
  const articleHeroImage = createElement('div', { classes: 'article-hero-image' });
  const articleHeroContent = createElement('div', { classes: 'article-hero-content' });

  const categoryUrl = category.toLowerCase().replaceAll(' ', '-');
  const categorySpan = createElement('a', {
    classes: 'article-hero-category',
    props: { href: `/magazine/categories/${categoryUrl}` },
  });
  categorySpan.innerText = category;

  const titleH4 = createElement('h4', { classes: 'article-hero-title' });
  titleH4.innerText = title;

  const truck = createElement('div', { classes: 'article-hero-truck' });
  const truckText = createElement('p', { classes: 'truck-text' });
  truckText.innerText = truckModel;
  const truckIcon = createElement('img', {
    classes: 'truck-icon',
    props: { src: '/icons/Truck_Key_icon.svg', alt: 'truck icon' },
  });

  articleHeroImage.append(headImg);
  truck.append(truckIcon, truckText);

  articleHeroContent.append(categorySpan, titleH4);
  if (truckModel.length !== 0) {
    articleHeroContent.append(truck);
  }
  section.append(articleHeroImage, articleHeroContent);

  return section;
}

async function buildSection(container, sectionName = '') {
  const selectedContent = container.querySelector(`.${sectionName}-container .${sectionName}-wrapper`);
  const classes =
    sectionName === 'breadcrumbs' ? ['section', 'template', 'article-template', `${sectionName}-container`] : `${sectionName}-container`;
  const sectionContainer = createElement('div', { classes });
  sectionContainer.append(selectedContent);

  return sectionContainer;
}

async function buildShareSection() {
  const shareSection = createElement('div', { classes: 'share-wrapper' });
  const shareItems = [
    ['envelope', 'Share via email', 'mailto:?body=', 'Email', '#FD6D4B'],
    ['twitter', 'Share on Twitter', 'https://twitter.com/intent/tweet?url=', 'Tweet', '#1C9BEF'],
    ['facebook', 'Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u=', 'Like', '#1977F2'],
  ];
  const shareSidebar = createElement('div', { classes: 'share' });
  const shareList = createElement('div', { classes: 'share-icons' });
  shareItems.forEach((share) => {
    const icon = createElement('span', { classes: ['icon', `fa-${share[0]}`] });
    const shareItem = createElement('button', {
      classes: share[0],
      props: { title: share[1], type: 'button' },
    });
    shareItem.addEventListener('click', () => {
      window.open(`${share[2]}${window.location.href}`, '_blank');
    });
    const [, , , label, color] = share;
    shareItem.innerText = label;
    shareItem.style.backgroundColor = color;

    shareItem.append(icon);
    shareList.append(shareItem);
  });
  shareSidebar.append(shareList);
  shareSection.append(shareSidebar);

  return shareSection;
}

async function loadInnerBlocks(container) {
  // Lets wait for the placeholders to be loaded since the blocks might have them as a dependency
  await getPlaceholders();

  container.querySelectorAll('.block').forEach((block) => {
    loadBlock(block);
  });
}

export default async function decorate(doc) {
  const categoryTag = await getArticleTags('categories');
  const truckTags = await getArticleTags('trucks');

  const container = doc.querySelector('main');

  const article = createElement('div', { classes: 'article-content' });
  const articleTexts = createElement('div', { classes: ['section', 'template', 'article-template', 'article-texts-container'] });
  const currentArticle = createElement('div', { classes: 'current-article-container' });

  const [breadSection, heroSection, shareSection1, shareSection2, recentSection, recommendationsSection] = await Promise.all([
    buildSection(container, 'breadcrumb'),
    buildArticleHero({ truckTags, categoryTag }),
    buildShareSection(),
    buildShareSection(),
    buildSection(container, 'recent-articles'),
    buildSection(container, 'recommendations'),
  ]);

  const authorName = getMetadata('author');
  const author = createElement('p', { classes: 'author-text' });
  author.innerText = authorName;

  const defaultContent = container.querySelector('.default-content-wrapper');
  const subscribeContent = container.querySelector('.magazine-subscribe-wrapper');

  const parentSection = defaultContent.parentNode;
  parentSection.classList.add('default-content-container');
  parentSection.classList.remove('breadcrumb-container', 'recent-articles-container');
  parentSection.style.display = 'unset';

  const altSubtitle = createElement('h5', { classes: 'default-content-subtitle' });
  altSubtitle.innerText = getMetadata('og:title');

  const firstHeading = defaultContent.querySelector('h5') ?? altSubtitle;
  firstHeading?.classList.add('default-content-subtitle');

  parentSection.insertAdjacentElement('afterbegin', firstHeading);

  currentArticle.append(firstHeading, author, shareSection1, parentSection, shareSection2);
  articleTexts.append(currentArticle, recommendationsSection, recentSection);
  article.append(breadSection, heroSection, articleTexts, ...(subscribeContent ? [subscribeContent] : []));

  container.innerText = '';
  container.append(article);

  // loadInnerBlocks is an async function
  // Lets run it async without wait, no need...
  loadInnerBlocks(container);
}
