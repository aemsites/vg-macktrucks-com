import { readBlockConfig } from '../../scripts/aem.js';
import { createElement, getTextLabel, variantsClassesToBEM, addTargetBlankToExternalLink } from '../../scripts/common.js';

const blockName = 'v2-breadcrumb';
const sectionStatus = 'data-section-status';
const breadcrumb = getTextLabel('v2_breadcrumbs:aria_label');
const homeText = {
  home: getTextLabel('v2_breadcrumbs:home_text'),
  ellipsis: '…', // unicode ellipsis
};
const variantClasses = ['custom'];

const formatText = (str) => str.replace(/-/g, ' ').toLowerCase();

const getPadding = (elCompCSS) =>
  parseInt(elCompCSS.getPropertyValue('padding-left'), 10) + parseInt(elCompCSS.getPropertyValue('padding-right'), 10);

const getCrumbsWidth = (block) => {
  const crumbs = block.querySelectorAll(`.${blockName}__crumb-item`);
  return [...crumbs].reduce((acc, item) => {
    const itemCompCSS = window.getComputedStyle(item);
    return acc + parseInt(itemCompCSS.getPropertyValue('width'), 10);
  }, 0);
};

const getBlockWidth = (block) => {
  const computedCSS = window.getComputedStyle(block);
  const blockWidth = parseInt(computedCSS.getPropertyValue('width'), 10);
  const boxSizing = computedCSS.getPropertyValue('box-sizing');
  const padding = boxSizing === 'border-box' ? getPadding(computedCSS) : 0;
  return blockWidth - padding;
};

const fitting = (block) => getCrumbsWidth(block) < getBlockWidth(block);

const hasFormattingTags = (element) => {
  return element.querySelectorAll('em, strong, sup').length > 0;
};

const generateCustomUrl = (block) => {
  const allCrumbs = [];
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const crumbEl = cols[0].children[0] || null;
        const obj = {
          element: crumbEl,
          hasFormattingTags: crumbEl ? hasFormattingTags(crumbEl) : false,
          key: cols[0].textContent,
          value: row.children[1].textContent,
        };

        allCrumbs.push(obj);
      }
    }
  });
  const keyString = allCrumbs.map((obj) => obj.key).join('/');

  return [keyString, allCrumbs];
};

export default function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  let url;
  let customLinks;
  const hasCustomClass = block.classList.contains(`${blockName}--custom`);

  const cfg = readBlockConfig(block);
  const hasPath = cfg && Object.hasOwn(cfg, 'path');

  if (hasPath) {
    url = cfg.path;
  } else if (hasCustomClass) {
    const [customPath, allCrumbs] = generateCustomUrl(block);
    customLinks = allCrumbs;
    url = customPath;
  } else {
    url = window.location.pathname;
  }

  const path = url.split('/').filter(Boolean);
  const nav = createElement('nav', { classes: [`${blockName}__crumb-nav`] });
  const ul = createElement('ul', { classes: [`${blockName}__crumb-list`] });

  const crumbs = path
    .map((_, i) => {
      const liEl = createElement('li', { classes: [`${blockName}__crumb-item`] });
      const crumbClasses = [`${blockName}__crumb`];
      let content;
      let crumbProps = {};

      if (hasCustomClass) {
        const linkData = customLinks[i];
        if (!linkData) {
          return null;
        }
        content = path[i];
        crumbProps = { 'data-content': content };
        if (i !== path.length - 1) {
          crumbProps.href = linkData.value;
        } else {
          crumbClasses.push(`${blockName}__crumb--active`);
          crumbProps['aria-current'] = 'page';
        }
        const crumb = createElement('a', { classes: crumbClasses, props: crumbProps });
        addTargetBlankToExternalLink(crumb);
        if (linkData.hasFormattingTags) {
          crumb.append(...linkData.element.childNodes);
        } else {
          crumb.textContent = content;
        }
        liEl.append(crumb);
      } else {
        content = formatText(path[i]);
        crumbProps = { 'data-content': content };
        if (i !== path.length - 1) {
          crumbProps.href = `/${path.slice(0, i + 1).join('/')}/`;
        } else {
          crumbClasses.push(`${blockName}__crumb--active`);
          crumbProps['aria-current'] = 'page';
        }
        const crumb = createElement('a', { classes: crumbClasses, props: crumbProps });
        crumb.textContent = content;
        liEl.append(crumb);
      }

      return liEl;
    })
    .filter(Boolean);

  const homeItem = createElement('li', { classes: [`${blockName}__crumb-item`] });
  const homeEl = createElement('a', {
    classes: [`${blockName}__crumb`, `${blockName}__crumb--home`],
    props: { href: hasCustomClass ? `${customLinks[0].value}` : '/' },
  });
  addTargetBlankToExternalLink(homeEl);

  homeEl.textContent = hasCustomClass ? `${customLinks[0].key}` : homeText.home;
  homeItem.append(homeEl);
  crumbs.unshift(homeItem);
  if (hasCustomClass) {
    crumbs.splice(1, 1);
  }
  ul.append(...crumbs);
  nav.append(ul);
  block.textContent = '';
  block.append(nav);
  block.parentElement.classList.add('full-width');
  block.setAttribute('aria-label', breadcrumb);

  const checkCrumbsFits = () => {
    // 1st check if home fits, if not it become an ellipsis
    if (!fitting(block) && crumbs.length > 2) {
      homeEl.textContent = homeText.ellipsis;
    }
    // if still doesn't fit, remove active crumb
    if (!fitting(block)) {
      crumbs.at(-1).firstElementChild.textContent = '';
      crumbs.at(-1).classList.add(`${blockName}__crumb-item--hidden`);
    }
    // if it still doesn't fit again, remove the crumbs from the middle
    if (!fitting(block)) {
      let i = 1;
      while (i < crumbs.length - 2 && !fitting(block)) {
        crumbs[i].firstElementChild.textContent = '';
        crumbs[i].classList.add(`${blockName}__crumb-item--hidden`);
        i += 1;
      }
    }
  };

  const rObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.contentBoxSize) {
        return;
      }
      // add again the content from each item and check if it fits again or not
      homeEl.textContent = hasCustomClass ? `${customLinks[0].key}` : homeText.home;
      crumbs.forEach((crumb, i) => {
        const link = crumb.firstElementChild;
        if (i > 0) {
          crumb.classList.remove(`${blockName}__crumb-item--hidden`);

          if (!hasFormattingTags(link)) {
            link.textContent = link.dataset.content;
          }
        }
      });
      checkCrumbsFits();
    });
  });

  const mObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // check if the attribute data-section-status has the value 'loaded'
      if (mutation.attributeName !== sectionStatus) {
        return;
      }
      const section = mutation.target;
      const status = section.getAttribute(sectionStatus);
      if (status !== 'loaded') {
        return;
      }
      rObserver.observe(block);
      mObserver.disconnect();
    });
  });
  mObserver.observe(block.closest('.section'), {
    childList: true,
    attributeFilter: [sectionStatus],
  });
}
