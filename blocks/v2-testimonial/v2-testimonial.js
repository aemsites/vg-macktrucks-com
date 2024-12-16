import { isVideoLink, selectVideoLink } from '../../scripts/video-helper.js';
import { removeEmptyTags, unwrapDivs, variantsClassesToBEM } from '../../scripts/common.js';

const blockName = 'v2-testimonial';
const variantClasses = ['media-left', 'media-right', 'overlap'];

const handleVideoLinks = (videoLinks) => {
  const selectedVideo = selectVideoLink(videoLinks);

  videoLinks.forEach((link) => {
    if (link !== selectedVideo) {
      link.parentElement.remove();
    }
  });

  if (selectedVideo) {
    selectedVideo.classList.add(`${blockName}__video-link`);
    return;
  }

  console.warn(`[${blockName}]: No proper video link provided for current cookie settings!`);
};

const createVideoSection = (col) => {
  const videoLinks = [...col.querySelectorAll('a')].filter(isVideoLink);

  if (videoLinks.length === 0) {
    return;
  }

  handleVideoLinks(videoLinks);
  const videoSection = col.querySelector('p');
  videoSection.classList.add(`${blockName}__video-section`);
  videoSection.setAttribute('data-theme', 'gold');
  videoSection.append(col.querySelector(`.${blockName}__video-link`));
};

const handleBlockquotes = (block, firstHeading) => {
  let blockquotes = block.querySelectorAll('blockquote');
  if (blockquotes.length === 0) {
    console.warn(`[${blockName}]: No blockquote found in the column! Will try to create a blockquote from the text.`);

    const blockquoteCol = block.querySelector(`.${blockName}__blockquote-container`);
    const paragraphs = blockquoteCol.querySelectorAll('p:only-child, p:not(:last-child)');

    if (paragraphs.length === 0) {
      console.error(`[${blockName}]: No paragraphs found in the column!`);
      return;
    }

    const blockquote = document.createElement('blockquote');

    paragraphs.forEach((p) => {
      blockquote.append(p);
    });

    firstHeading.insertAdjacentElement('afterend', blockquote);
  }
  blockquotes = block.querySelectorAll('blockquote');
  blockquotes.forEach((bq) => {
    const em = bq.querySelector('em');

    if (em) {
      em.outerHTML = em.innerHTML;
    }

    bq.classList.add(`${blockName}__blockquote`);
  });
};

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  block.parentElement.classList.add('full-width');

  const columns = block.querySelectorAll(':scope > div > div');
  const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const firstHeading = headings[0];

  columns.forEach((col) => {
    if (col.contains(firstHeading)) {
      col.parentElement.classList.add(`${blockName}__column`, `${blockName}__column--text`);
      col.classList.add(`${blockName}__blockquote-container`);
      headings.forEach((h) => {
        h.classList.add(`${blockName}__heading`);
      });
      firstHeading.classList.add('with-marker');
    }

    const images = [...col.querySelectorAll('img')];
    images.forEach((img) => {
      img.classList.add(`${blockName}__image`);
      img.parentElement.classList.add(`${blockName}__column`, `${blockName}__column--media`);
    });

    createVideoSection(col);
  });

  handleBlockquotes(block, firstHeading);
  unwrapDivs(block, { ignoreDataAlign: true });
  removeEmptyTags(block);
}
