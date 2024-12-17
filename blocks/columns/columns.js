import { addVideoShowHandler, isVideoLink, selectVideoLink, wrapImageWithVideoLink } from '../../scripts/video-helper.js';
import { createElement } from '../../scripts/common.js';
import { getAllElWithChildren } from '../../scripts/scripts.js';

const decorateUnderline = (col) => {
  const hr = createElement('hr', { classes: 'column-underline' });
  const u = col.querySelector('u');
  if (!u) {
    const strong = col.firstElementChild.querySelector('strong');
    if (strong) {
      strong.parentElement.appendChild(hr);
    }
    return;
  }
  const uText = u.textContent;
  const p = u.closest('p');
  u.parentElement.textContent = uText;
  p.appendChild(hr);
};

const removeEmptyPs = (pictureWrapper) => {
  const Ps = pictureWrapper.querySelectorAll('p');
  [...Ps].forEach((p) => {
    if (p.children.length === 0) {
      p.remove();
    }
  });
};

const videoHandling = (blockEl) => {
  const pictureWrapper = getAllElWithChildren(blockEl.querySelectorAll(':scope > div > div'), 'picture')[0];
  const picture = pictureWrapper && pictureWrapper.querySelector('picture');
  const links = pictureWrapper && pictureWrapper.querySelectorAll('a');

  if (!picture || !links.length) {
    return;
  }

  const videoLinks = [...links].filter((link) => isVideoLink(link));
  const selectedVideoLink = selectVideoLink(videoLinks);

  if (selectedVideoLink) {
    videoLinks.filter((videoLink) => videoLink.getAttribute('href') !== selectedVideoLink.getAttribute('href')).forEach((link) => link.remove());
    wrapImageWithVideoLink(selectedVideoLink, picture);
    addVideoShowHandler(selectedVideoLink);
    selectedVideoLink.parentElement.replaceChildren(selectedVideoLink);
    removeEmptyPs(pictureWrapper);
  }
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const isInfo = block.classList.contains('info');
  const isPromo = block.classList.contains('promo');
  if (isInfo) {
    const hasAbsolute = block.classList.contains('absolute');
    if (hasAbsolute) {
      block.closest('.columns-wrapper').classList.add('info', 'absolute');
    }
    cols.forEach((col) => {
      col.className = 'columns-col-wrapper';
      decorateUnderline(col);
    });
  }
  if (isPromo) {
    const parent = block.querySelectorAll(':scope > div > div');
    const textParent = getAllElWithChildren(parent, 'picture', true)[0];
    const pictureParent = getAllElWithChildren(parent, 'picture')[0];
    const imgLeft = parent[0].querySelector('picture');
    textParent.className = 'columns-promo-text-wrapper';
    if (pictureParent) {
      pictureParent.className = 'columns-promo-picture-wrapper';
    }
    if (imgLeft) {
      textParent.classList.add('columns-promo-img-left');
    }
  }

  videoHandling(block);
}
