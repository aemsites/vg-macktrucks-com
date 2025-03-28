import { createElement, clearElementAttributes, decorateIcons, removeEmptyTags } from '../../scripts/common.js';
import { isVideoLink, createVideo } from '../../scripts/video-helper.js';

const blockName = 'v2-category-collage';

const CLASSES = {
  itemContainer: `${blockName}__item-container`,
  itemContent: `${blockName}__item-content`,
  itemTitle: `${blockName}__item-title`,
  itemCategoryTitle: `${blockName}__item-category-title`,
  itemMedia: `${blockName}__item-media`,
  itemLinkClass: `${blockName}__item-link`,
};

const getItemTitleContainer = (item) => item.querySelector('div:nth-child(3)');
const getItemCategoryTitleContainer = (item) => item.querySelector('div:nth-child(2)');
const getItemLink = (item) => item.querySelector('div:nth-child(3) > a, div:nth-child(3) > p > a');

const arrowButtonElement = () => createElement('span', { classes: ['icon', 'icon-arrow-right'] });

const decorateImage = (itemLink, itemImage) => {
  const hasImageContainer = itemImage.parentElement === itemLink;

  if (!hasImageContainer) {
    const imageContainer = itemImage.parentElement;
    itemImage.classList.add(CLASSES.itemMedia);
    itemLink.prepend(itemImage);
    imageContainer.remove();
  }

  itemImage.setAttribute('tabindex', 0);
};

const decorateVideo = async (itemLink) => {
  const videoLink = itemLink.querySelector('a.text-link-with-video');

  if (!videoLink || !isVideoLink(videoLink)) {
    return;
  }

  const video = await createVideo(videoLink.getAttribute('href'), CLASSES.itemMedia, {
    muted: true,
    autoplay: true,
    loop: true,
    playsinline: true,
    tabindex: 0,
  });

  itemLink.prepend(video);
  videoLink.remove();
};

const decorateMedia = (item, itemImage) => {
  const itemLink = item.querySelector(`.${CLASSES.itemLinkClass}`);

  if (itemImage) {
    decorateImage(itemLink, itemImage);
  } else {
    decorateVideo(itemLink);
  }
};

const removeInnerLink = (link) => {
  const text = link.parentElement;
  const linkText = link.innerHTML;

  text.innerHTML = linkText;
};

const decorateNewItemContainer = (item, itemContainer, innerLink) => {
  const { href = '', title = '' } = innerLink || {};
  const newItemContainer = createElement('a', {
    classes: CLASSES.itemLinkClass,
    props: { href, title, tabindex: -1 },
  });
  const itemContent = createElement('div', {
    classes: CLASSES.itemContent,
  });
  const itemCategoryTitleContainer = getItemCategoryTitleContainer(item);
  const itemTitleContainer = getItemTitleContainer(item);

  if (innerLink) {
    removeInnerLink(innerLink);
  }

  item.classList.add(CLASSES.itemContainer);
  clearElementAttributes(itemTitleContainer).classList.add(CLASSES.itemTitle);
  clearElementAttributes(itemCategoryTitleContainer).classList.add(CLASSES.itemCategoryTitle);

  itemTitleContainer.append(arrowButtonElement());

  itemContent.append(itemCategoryTitleContainer);
  itemContent.append(itemTitleContainer);

  newItemContainer.innerHTML = itemContainer.innerHTML;
  newItemContainer.prepend(itemContent);
  itemContainer.remove();
  item.append(newItemContainer);
};

const decorateCollageItems = (items) => {
  items.forEach((item) => {
    const itemContainer = item.firstElementChild;
    const itemLink = getItemLink(item);

    decorateNewItemContainer(item, itemContainer, itemLink);
    decorateMedia(item, item.querySelector('picture'));
  });
};

export default function decorate(block) {
  const blockWrapper = block.parentElement;
  const collageItemContainers = block.querySelectorAll(':scope > div');

  blockWrapper.classList.add('full-width');

  decorateCollageItems([...collageItemContainers]);
  decorateIcons(block);
  removeEmptyTags(block, true);
}
