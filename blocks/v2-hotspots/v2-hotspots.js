import {
  createElement,
  decorateIcons,
} from '../../scripts/common.js';

/**
 * @typedef {Object} HotspotContent
 *
 * @property {number} id
 * @property {HTMLPictureElement} picture
 * @property {HTMLElement} title
 * @property {HTMLElement} text
 * @property {string} positionLeft
 * @property {string} positionTop
 */

let hotspotBlockCounter = 0;
let previousSpot = 0;
const blockName = 'v2-hotspots';

export default function decorate(block) {
  const firstBlockRow = block.querySelector(':scope > div');
  const firstPicture = firstBlockRow.querySelector('picture');
  const title = firstBlockRow.querySelector('h1, h2');

  // every instance of this block needs a unique id.
  hotspotBlockCounter += 1;
  block.closest(`.section.${blockName}-container`).dataset.hotspotAreaId = hotspotBlockCounter;

  block.innerHTML = `
    <div class="main">
      <div class="hotspot-features"></div>
    </div>
    <div class="hotspot-layover" style="display: none;"></div>
  `;

  decorateImageAndTitle(block.querySelector('.main'), firstPicture, title);

  decorateIcons(block);
}

/**
 *
 * @param block {HTMLDivElement}
 */
function handleClose(block) {
  previousSpot = 0;
  block.querySelector('.hotspot-features').style = 'transform: translateX(200%)';
  block.querySelectorAll('.hotspot-icon').forEach((icon) => icon.classList.remove('active-spot'));
}

/**
 *
 * @param event {click event}
 * @param iconLink {clicked anchor element}
 * @param hotspotId {anchor element's id}
 * @param block {HTMLDivElement}
 */
function handleClickHotspot(event, iconLink, hotspotId, block) {
  event.preventDefault();

  if ((previousSpot > 0) && (Number(hotspotId) === previousSpot)) {
    handleClose(block);
    return;
  }

  previousSpot = Number(hotspotId);

  block.querySelectorAll('.hotspot-icon').forEach((icon) => icon.classList.remove('active-spot'));
  block.querySelector('.hotspot-features').style = 'transform: translateX(0)';

  iconLink.classList.add('active-spot');

  block.querySelector('.features.is-active').classList.remove('is-active');
  block.querySelector(`.features.number-${hotspotId}`).classList.add('is-active');
}

function addDesktopHotspotIcon(hotspot, block, main) {
  const iconLink = createElement('a', {
    classes: 'hotspot-icon',
    props: {
      href: '#',
      'data-spot': hotspot.id,
      style: `left: ${hotspot.positionLeft}; top: ${hotspot.positionTop};`,
    },
  });

  const plusIcon = createElement('img', { props: { src: '/icons/plus.svg' } });
  iconLink.appendChild(plusIcon);

  iconLink.onclick = (event) => handleClickHotspot(
    event,
    iconLink,
    hotspot.id,
    block,
  );

  main.querySelector('.hotspot-icon-set').append(iconLink);
}

function addCards(hotspot, main) {
  const featureBlock = document.createElement('div');
  featureBlock.innerHTML = `
    <div class="features number-${hotspot.id}" data-fade-object="true">
      <button class="feature-close"></button>
      <div class="row">
        <div class="feature">
          <h3 class="feature-title"></h3>
          <picture></picture>
          <div class="feature-text"></div>
        </div>
        <div class='feature-pagination'></div>
      </div>
    </div>
  `;

  featureBlock.querySelector('picture').innerHTML = hotspot.picture.innerHTML;
  featureBlock.querySelector('.feature-title').innerHTML = hotspot.title.innerHTML;
  if (Number(hotspot.id) === 1) featureBlock.querySelector('.features').classList.add('is-active');

  hotspot.text.forEach((p) => {
    const pEl = createElement('p');
    pEl.innerHTML = p.innerHTML;
    featureBlock.querySelector('.feature-text').append(pEl);
  });

  const closeBtn = featureBlock.querySelector('.feature-close');
  closeBtn.addEventListener('click', () => handleClose(main));

  const closeIcon = createElement('img', { props: { src: '/icons/close.svg' } });
  closeBtn.appendChild(closeIcon);

  const featuresDiv = main.querySelector('.hotspot-features');
  featuresDiv.append(...featureBlock.childNodes);
}

function addPaginationButtons(block) {
  const allFeatures = block.querySelectorAll('.features');
  allFeatures.forEach((feature, idx) => {
    const paginationStructure = `
      <a class="hotspot-feature-button prev"></a>
      <span class="hotspot-feature-pagination">${idx + 1}/${allFeatures.length}</span>
      <a class="hotspot-feature-button next"></a>
    `;
    feature.querySelector('.feature-pagination').innerHTML = paginationStructure;

    feature.querySelectorAll('.hotspot-feature-button').forEach((arrow) => {
      const image = createElement('img', { props: { src: '/icons/arrow-right.svg' } });
      arrow.appendChild(image);
    });
  });
}

function updateActiveHotspot(event, clickedNum, block) {
  const slideNumber = ((clickedNum > 3) && 1) || ((clickedNum < 1) && 3) || clickedNum;

  previousSpot = clickedNum;

  const clickedElmt = event.target.closest('.features');
  clickedElmt.classList.remove('is-active');

  clickedElmt.parentElement.querySelector(`.features.number-${slideNumber}`).classList.add('is-active');

  block.querySelectorAll('.hotspot-icon').forEach((icon) => icon.classList.remove('active-spot'));
  block.querySelector(`.hotspot-icon[data-spot="${slideNumber}"]`).classList.add('active-spot');
}

function updateFeature(block) {
  const features = block.querySelectorAll('.features');

  features.forEach((feat, idx) => {
    feat.querySelector(`.features.number-${idx + 1} .hotspot-feature-button.prev`).onclick = (e) => updateActiveHotspot(e, idx, block);
    feat.querySelector(`.features.number-${idx + 1} .hotspot-feature-button.next`).onclick = (e) => updateActiveHotspot(e, idx + 2, block);
  });
}

/**
 *
 * @param block
 * @param hotspot {HotspotContent}
 */
export function addSpot(block, hotspot) {
  // desktop hotspot icon
  const main = block.querySelector('.main');

  // keep track of the number of hotspots in the DOM
  main.dataset.hotspotCounter = (+main.dataset.hotspotCounter || 0) + 1;
  hotspot.id = main.dataset.hotspotCounter;
  addDesktopHotspotIcon(hotspot, block, main);

  addCards(hotspot, main);

  addPaginationButtons(block);

  updateFeature(block);
}

/**
 *
 * @param mainDiv {HTMLDivElement}
 * @param firstPicture {HTMLPictureElement}
 * @param title {HTMLElement}
//  * @param description {HTMLElement}
 */
function decorateImageAndTitle(mainDiv, firstPicture, title) {
  const hotspot = createElement('div', { classes: 'hotspot' });
  hotspot.innerHTML = `
      <picture class="hotspot-bg-img"></picture>
      <div class="hotspot-content content-wrapper ">
        <h1 class="hotspot-header with-marker"></h1>
      </div>

      <div class="hotspot-icon-set"></div>`;

  hotspot.querySelector('.hotspot-bg-img').innerHTML = firstPicture.innerHTML;
  hotspot.querySelector('.hotspot-header').innerHTML = title.innerHTML;

  mainDiv.prepend(hotspot);
}
