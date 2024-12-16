import { unwrapDivs, variantsClassesToBEM } from '../../scripts/common.js';

const blockName = 'v2-navigation-hub';
const variantClasses = ['media-left', 'media-right', 'overlap'];
const blockNames = {
  column: `${blockName}__column`,
  card: `${blockName}__card-container`,
  cardContent: `${blockName}__card-content`,
  cardNavigation: `${blockName}__card-navigation`,
  cardNavTitle: `${blockName}__card-nav-title`,
  cardNavList: `${blockName}__card-nav-list`,
  media: `${blockName}__media-container`,
  mediaRight: `${blockName}__media-right`,
  mediaLeft: `${blockName}__media-left`,
  mediaImage: `${blockName}__image`,
};

export default function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const blockWrapper = block.closest(`.${blockName}-wrapper`);
  // Card elements
  const cardContainer = block.querySelector(':scope > div:first-child');
  const cardContent = cardContainer.querySelector(':scope > div:first-child');
  const cardButton = cardContent.querySelector(':scope .button-container a');
  const cardNavigation = cardContainer.querySelector(':scope > div:last-child');
  const cardNavTitle = cardNavigation.querySelector(':scope > :first-child');
  const cardNavList = cardNavigation.querySelector(':scope > ul');
  const cardNavLinks = [...cardNavList.querySelectorAll('a')];
  // Media element
  const mediaContainer = block.querySelector(':scope > div:last-child');
  const mediaImage = mediaContainer.querySelector('img');
  const isMediaLeft = mediaContainer.firstElementChild.children.length > 0;
  // By default, media is on the left side
  const mediaPosition = isMediaLeft ? blockNames.mediaLeft : blockNames.mediaRight;

  blockWrapper.classList.add('full-width');
  cardContainer.className = `${blockNames.card} ${blockNames.column}`;
  cardContent.className = blockNames.cardContent;
  cardButton.classList.add('button--large');
  cardNavigation.className = blockNames.cardNavigation;
  cardNavTitle.className = blockNames.cardNavTitle;
  cardNavList.className = blockNames.cardNavList;
  cardNavLinks.forEach((link) => {
    link.className = 'standalone-link';
  });
  mediaContainer.className = `${blockNames.media} ${blockNames.column}`;
  mediaImage.className = blockNames.mediaImage;

  block.classList.add(mediaPosition);

  unwrapDivs(mediaContainer);
}
