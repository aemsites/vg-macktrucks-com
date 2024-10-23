import {
  getTextLabel,
  unwrapDivs,
  decorateIcons,
} from '../../scripts/common.js';

const blockName = 'v2-social-block';
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
};

const TEMPLATE_LINK_CONFIGS = [
  ['twitter', 'https://twitter.com/intent/tweet?url='],
  ['linkedin', 'https://www.linkedin.com/cws/share?url='],
  ['fb', 'https://www.facebook.com/sharer/sharer.php?u='],
];

const buildTemplateBlock = (links) => {
  const fragment = docRange.createContextualFragment(`
    <ul class='${CLASSES.list}'>
      ${links.map((link) => `
        <li class='${CLASSES.listItem}'>
          <a href='${link[1]}${window.location.href}' target='_blank'>
            <span class='icon icon-${link[0]}'></span>
          </a>
        </li>
        `).join('')}
    </ul>
  `);
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
      /* eslint-disable-next-line no-console */
      console.error('Failed to copy: ', err);
    }
  });
  anchorEl.classList.add(...CLASSES.tooltipTop);
};

export default function decorate(block) {
  let fragment;
  const isMagazineTemplate = document.body.classList.contains('v2-magazine');

  if (isMagazineTemplate) {
    fragment = buildTemplateBlock(TEMPLATE_LINK_CONFIGS);
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
