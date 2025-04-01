import { createElement, variantsClassesToBEM, decorateBlackLabel } from '../../scripts/common.js';
import { createVideo, isVideoLink } from '../../scripts/video-helper.js';

const blockName = 'v2-columns';

const getLastTextElmts = (block) => {
  const allTexts = block.querySelectorAll('p');
  const linksTitle = allTexts[allTexts.length - 1];
  linksTitle.classList.add('list-title');
  return linksTitle;
};

const insertVideo = (block, videoAnchor, picture) => {
  const img = picture?.querySelector('img');
  const posterUrl = img ? new URL(img.getAttribute('src'), window.location.href).href : undefined;
  const videoElement = createVideo(videoAnchor.getAttribute('href'), `${blockName}__video`, {
    loop: true,
    playsinline: true,
    controls: false,
    language: document.documentElement.lang,
    poster: posterUrl,
  });
  const videoColumn = block.querySelector(`.${blockName}__column:last-of-type`);
  videoColumn.className = `${blockName}__video-column`;
  videoColumn.innerHTML = '';
  videoColumn.append(videoElement);
};

export default async function decorate(block) {
  const blockParent = block.parentElement.parentElement;

  const variantClasses = ['with-background-image', 'background-plane', 'icon-list', 'navigation-links', 'inset', 'headline', 'video-launcher'];
  variantsClassesToBEM(block.classList, variantClasses, blockName);

  const isBackgroundImageVariant = block.classList.contains(`${blockName}--with-background-image`);
  const isIconListVariant = block.classList.contains(`${blockName}--icon-list`);
  const is3LinksVariant = block.classList.contains(`${blockName}--navigation-links`);
  const isListVariant = isIconListVariant || is3LinksVariant;
  const hasHeader = blockParent.classList.contains('header-with-mark') || blockParent.classList.contains('header-no-mark');
  const isHeadlineVariant = block.classList.contains(`${blockName}--headline`);
  const isVideoLauncherVariant = block.classList.contains(`${blockName}--video-launcher`);

  const rows = [...block.querySelectorAll(':scope > div')];
  const columns = [...block.querySelectorAll(':scope > div > div')];

  rows.forEach((row) => {
    row.classList.add(`${blockName}__row`);
  });

  columns.forEach((col) => {
    col.classList.add(`${blockName}__column`);

    const picture = col.querySelector('picture');
    const allTextElmts = col.querySelectorAll('p, ul, ol');
    const bodyElmts = [];
    const linkList = createElement('div', { classes: `${blockName}--links` });
    const link = col.querySelector('a');
    const videoAnchor = link && isVideoLink(link) ? link : null;

    if (picture && !isVideoLauncherVariant) {
      col.classList.add(`${blockName}__column--with-image`);
    } else {
      col.classList.add(`${blockName}__column--with-text`);
    }

    allTextElmts.forEach((e) => {
      const nextElmt = e.nextElementSibling;

      const isButton = [...e.classList].includes('button-container');
      const isPretitle = nextElmt?.tagName.toLowerCase()[0] === 'h';
      const hasLinkList = isListVariant && (e.tagName.toLowerCase() === 'ul' || e.tagName.toLowerCase() === 'ol');

      if (hasLinkList) {
        if (is3LinksVariant) {
          linkList.append(getLastTextElmts(col));
        }
        linkList.append(e);
      } else if (!isPretitle && !isButton) {
        bodyElmts.push(e);
      }
    });
    bodyElmts.forEach((e) => {
      if (!e.classList.contains('list-title')) {
        e.classList.add(`${blockName}__body`);
      }
    });

    const buttons = [...col.querySelectorAll('.button-container a')];

    if (isBackgroundImageVariant) {
      blockParent.classList.add(`${blockName}-container--with-background-image`);
      const btnSection = createElement('div', { classes: 'button-container' });

      buttons.forEach((btn) => {
        btn.classList.add('button--large');
        const btnContainer = btn.closest('.button-container');
        btnContainer.replaceWith(btn);
        btnSection.append(btn);
      });
      if (!picture) {
        col.append(btnSection);
      }
      if (isListVariant) {
        linkList.querySelectorAll('a').forEach((e) => e.classList.add('standalone-link'));
        col.append(linkList);
      }

      if (hasHeader) {
        const defaultContent = blockParent.querySelector('.default-content-wrapper');

        if (defaultContent) {
          const header = [...defaultContent.querySelectorAll('h1, h2, h3, h4, h5, h6')];
          header[0].classList.add(`${blockName}__body-header`, !blockParent.classList.contains('header-no-mark') && 'with-marker');
          bodyElmts[0].insertAdjacentElement('beforebegin', header[0]);
          defaultContent.remove();
        }
      }
    } else {
      buttons.forEach((btn) => {
        btn.classList.add('button--large');
      });
    }

    const headings = [...col.querySelectorAll('h1, h2, h3, h4, h5, h6')];

    if (isHeadlineVariant) {
      headings.forEach((heading) => heading.classList.add(`${blockName}__heading`, 'with-marker'));
    } else {
      headings.forEach((heading) => heading.classList.add(`${blockName}__heading`, 'h2'));
    }

    const prevEl = headings[0]?.previousElementSibling;
    const pretitleText = prevEl && !prevEl.classList.contains('icon') && prevEl.textContent;

    if (pretitleText) {
      const pretitle = createElement('span', { classes: 'pretitle' });
      pretitle.textContent = pretitleText;
      prevEl.replaceWith(pretitle);
    }

    if (isVideoLauncherVariant && videoAnchor) {
      insertVideo(block, videoAnchor, picture);
    }
  });

  decorateBlackLabel(block);
}
