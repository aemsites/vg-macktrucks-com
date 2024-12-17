import { getTextLabel, unwrapDivs, decorateIcons, variantsClassesToBEM } from '../../scripts/common.js';
import { getMetadata } from '../../scripts/aem.js';

const blockName = 'v2-social-block';
const variantClasses = ['attribution'];
const docRange = document.createRange();

const LABELS = {
  COPIED: getTextLabel('tooltip copied text'),
};

const CLASSES = {
  title: `${blockName}__title`,
  list: `${blockName}__list`,
  listItem: `${blockName}__list-item`,
  tooltipTop: ['tooltip', 'tooltip--top'],
  tooltipShow: 'show',
  attribution: `${blockName}--attribution`,
  attributionWrapper: `${blockName}__attribution-wrapper`,
  attributionDate: `${blockName}__attribution-date`,
  attributionAuthor: `${blockName}__attribution-author`,
};

const TEMPLATE_LINK_CONFIGS = [
  ['twitter', 'https://twitter.com/intent/tweet?url='],
  ['linkedin', 'https://www.linkedin.com/cws/share?url='],
  ['fb', 'https://www.facebook.com/sharer/sharer.php?u='],
];

const buildTemplateBlock = (links, hasAttribution) => {
  const attributionDate = getMetadata('date');
  const attributionAuthor = getMetadata('author');

  const attributionContent = hasAttribution
    ? `
    <div class="${CLASSES.attributionWrapper}">
      ${attributionDate ? `<p class="${CLASSES.attributionDate}">${attributionDate}</p>` : ''}
      ${attributionAuthor ? `<p class="${CLASSES.attributionAuthor}">${attributionAuthor}</p>` : ''}
    </div>
  `
    : '';

  const listItems = links
    .map(
      ([icon, baseHref]) => `
    <li class="${CLASSES.listItem}">
      <a href="${baseHref}${window.location.href}" target="_blank">
        <span class="icon icon-${icon}"></span>
      </a>
    </li>
  `,
    )
    .join('');

  const template = `
    ${attributionContent}
    <ul class="${CLASSES.list}">
      ${listItems}
    </ul>
  `;

  const fragment = docRange.createContextualFragment(template);
  decorateIcons(fragment);

  return fragment;
};

const buildDefaultBlock = (heading = undefined, links = []) => {
  heading?.classList.add(CLASSES.title);
  const fragment = docRange.createContextualFragment(`
    ${heading ? heading.outerHTML : ''}
    <ul class='${CLASSES.list}'>
      ${links.map((anchor) => `<li class='${CLASSES.listItem}'>${anchor.outerHTML}</li>`).join('')}
    </ul>
  `);
  return fragment;
};

const addTooltip = (link) => {
  const anchorEl = link.parentElement;
  anchorEl.dataset.tooltip = LABELS.COPIED;
  anchorEl.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(window.location.href);
      anchorEl.classList.add(CLASSES.tooltipShow);

      setTimeout(() => {
        anchorEl.classList.remove(CLASSES.tooltipShow);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });
  anchorEl.classList.add(...CLASSES.tooltipTop);
};

export default function decorate(block) {
  let fragment;
  const isMagazineTemplate = document.body.classList.contains('v2-magazine');

  if (isMagazineTemplate) {
    variantsClassesToBEM(block.classList, variantClasses, blockName);
    const hasAttribution = block.classList.contains(CLASSES.attribution);
    fragment = buildTemplateBlock(TEMPLATE_LINK_CONFIGS, hasAttribution);
  } else {
    const heading = block.querySelectorAll('h1, h2, h3, h4, h5, h6')[0];
    const links = Array.from(block.querySelectorAll('a'));

    fragment = buildDefaultBlock(heading, links);

    const copyIcon = fragment.querySelector('.icon-link');
    if (copyIcon) {
      addTooltip(copyIcon);
    }
  }
  block.innerHTML = '';
  block.appendChild(fragment);

  unwrapDivs(block);
}
