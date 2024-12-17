import { createElement, decorateIcons } from '../../scripts/common.js';

/**
 * @typedef {Object} HotspotContent
 *
 * @property {number} id
 * @property {HTMLPictureElement} picture
 * @property {HTMLElement} category
 * @property {HTMLElement} title
 * @property {HTMLElement} text
 * @property {string} positionLeft
 * @property {string} positionTop
 */

let hotspotBlockCounter = 0;

export default function decorate(block) {
  const firstBlockRow = block.querySelector(':scope > div');
  const firstPicture = firstBlockRow.querySelector('picture');
  const title = firstBlockRow.querySelector('h1, h2');
  const description = firstBlockRow.querySelector('p');

  // every instance of this block needs a unique id.
  hotspotBlockCounter += 1;
  block.closest('.section.hotspots-container').dataset.hotspotAreaId = hotspotBlockCounter;
  // first hotspots group is active by default (used for mobile view)
  if (hotspotBlockCounter === 1) {
    block.closest('.section.hotspots-container').classList.add('active');
  }

  block.innerHTML = `
    <div class="main">
        <div class="hotspot-mobile"></div>
    </div>
    <div class="hotspot-layover" style="display: none;"></div>
  `;

  decorateImageAndTitle(block.querySelector('.main'), firstPicture, title, description);

  addMobileTabNavigation(block, title, hotspotBlockCounter);

  block.querySelector('.hotspot-layover').addEventListener('click', (event) => {
    const layoverDialog = block.querySelector('.hotspot-layover-box.is-active');
    handleCloseLayover(event, layoverDialog, block);
  });

  decorateIcons(block);
}

function handleClickHotspot(event, iconLink, hotspotId, block) {
  event.preventDefault();

  iconLink.classList.add('active-spot');

  const allLayovers = block.querySelector('.hotspot-layover');
  allLayovers.style.display = 'block';
  allLayovers.classList.add('is-active');

  // Workaround: Delay adding the class, otherwise slide-in animation is not played.
  setTimeout(() => {
    const layoverDialog = allLayovers.querySelector(`.hotspot-layover-box[data-hotspot-content="${hotspotId}"]`);
    layoverDialog.classList.add('is-active');
  }, 0);
}

/**
 *
 * @param event
 * @param layoverDialog {HTMLDialogElement}
 * @param block {HTMLDivElement}
 */
function handleCloseLayover(event, layoverDialog, block) {
  block.querySelectorAll('.hotspot-icon-set .active-spot').forEach((spot) => spot.classList.remove('active-spot'));

  layoverDialog.parentElement.classList.remove('is-active');
  layoverDialog.classList.remove('is-active');

  setTimeout(() => {
    layoverDialog.parentElement.style.display = 'none';
  }, 300);
}

/**
 *
 * @param block
 * @param index {number} 0-based index of the linked dialog
 */
function switchToOtherHotspot(block, index) {
  const dialogs = block.querySelectorAll('.hotspot-layover-box');
  dialogs.forEach((box) => box.classList.add('no-animation'));
  dialogs.forEach((box) => box.classList.remove('is-active'));

  block.querySelectorAll('.hotspot-icon-set .active-spot').forEach((spot) => spot.classList.remove('active-spot'));

  const switchTo = dialogs[index];
  switchTo.classList.add('is-active');

  // activate the hotspot icon that links to the dialog
  block.querySelector(`[data-spot="${switchTo.dataset.hotspotContent}"]`).classList.add('active-spot');

  // open the new dialog
  setTimeout(() => {
    // workaround: for some reason the animation is still played when the class is added immediately
    block.querySelectorAll('.hotspot-layover-box').forEach((box) => box.classList.remove('no-animation'));
  }, 0);
}

function addDesktopHotspotIcon(hotspot, block, main) {
  const iconLink = createElement('a', {
    classes: 'hotspot-icon',
    props: { href: '#' },
  });
  iconLink.dataset.spot = hotspot.id;
  iconLink.style.left = hotspot.positionLeft;
  iconLink.style.top = hotspot.positionTop;

  const image = createElement('img', {
    props: {
      src: '/icons/hotspot.png',
      alt: hotspot.title.textContent,
    },
  });
  iconLink.appendChild(image);
  iconLink.onclick = (event) => handleClickHotspot(event, iconLink, hotspot.id, block);

  main.querySelector('.hotspot-icon-set').append(iconLink);
}

function addDesktopLayover(hotspot, block) {
  const container = document.createElement('div');
  container.innerHTML = `
<div class="hotspot-layover-box" data-hotspot-content="1">
    <div class="hotspot-layover-thumb" style="background-image: url();"></div>
    <div class="hotspot-layover-close">
        <img src="/icons/x.png" alt="close">
    </div>
    <div class="hotspot-layover-text">
        <h5></h5>
        <h3></h3>
        <p class="large"></p>
    </div>
    <div class="hotspot-layover-controls">
        <a class="hotspot-layover-button prev">
            <img src="/icons/left-arrow-small.png" alt="Left arrow">
            <span></span>
        </a>
        <a class="hotspot-layover-button next">
            <img src="/icons/right-arrow-small.png" alt="Right arrow">
            <span></span>
        </a>
    </div>
</div>`;

  const dialog = container.querySelector('.hotspot-layover-box');
  dialog.dataset.hotspotContent = hotspot.id.toString();
  dialog.querySelector('.hotspot-layover-thumb').style.backgroundImage = `url(${hotspot.picture.querySelector('img').src})`;
  dialog.querySelector('.hotspot-layover-text h5').innerHTML = hotspot.category.innerHTML;
  dialog.querySelector('.hotspot-layover-text h3').innerHTML = hotspot.title.innerHTML;
  dialog.querySelector('.hotspot-layover-text p').innerHTML = hotspot.text.innerHTML;

  // don't close if clicked on sidebar
  dialog.addEventListener('click', (event) => event.stopPropagation());

  dialog.querySelector('.hotspot-layover-close').addEventListener('click', (event) => handleCloseLayover(event, dialog, block));

  block.querySelector('.hotspot-layover').append(...container.childNodes);
}

function addMobileAlternativeCards(hotspot, main) {
  // using styles from "hotspots-features.css"
  const featureBlock = document.createElement('div');
  featureBlock.innerHTML = `
    <div class="features animated" data-fade-object="true">
        <div class="row">
            <div class="feature">
                <picture></picture>
                <h4 class="feature-title"></h4>
                <p></p></div>
        </div>
    </div>`;

  featureBlock.querySelector('picture').innerHTML = hotspot.picture.innerHTML;
  featureBlock.querySelector('.feature-title').innerHTML = hotspot.title.innerHTML;
  featureBlock.querySelector('.feature p').innerHTML = hotspot.text.innerHTML;

  const mobileDiv = main.querySelector('.hotspot-mobile');
  mobileDiv.append(...featureBlock.childNodes);
}

function updateDesktopLayoverBeforeAndNextButtons(block) {
  const dialogs = block.querySelectorAll('.hotspot-layover-box');
  dialogs.forEach((dialog, index) => {
    const prevIndex = index === 0 ? dialogs.length - 1 : index - 1;
    const prevTextHtml = dialogs[prevIndex].querySelector('h3').innerHTML;
    dialog.querySelector('.hotspot-layover-button.prev span').innerHTML = prevTextHtml;
    dialog.querySelector('.hotspot-layover-button.prev').addEventListener('click', () => switchToOtherHotspot(block, prevIndex));

    const nextIndex = index === dialogs.length - 1 ? 0 : index + 1;
    const nextTextHtml = dialogs[nextIndex].querySelector('h3').innerHTML;
    dialog.querySelector('.hotspot-layover-button.next span').innerHTML = nextTextHtml;
    dialog.querySelector('.hotspot-layover-button.next').addEventListener('click', () => switchToOtherHotspot(block, nextIndex));
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
  addDesktopLayover(hotspot, block);
  updateDesktopLayoverBeforeAndNextButtons(block);

  addMobileAlternativeCards(hotspot, main);
}

/**
 *
 * @param mainDiv {HTMLDivElement}
 * @param firstPicture {HTMLPictureElement}
 * @param title {HTMLElement}
 * @param description {HTMLElement}
 */
function decorateImageAndTitle(mainDiv, firstPicture, title, description) {
  const hotspot = createElement('div', { classes: ['hotspot', 'animated'] });
  hotspot.innerHTML = `
      <picture class="hotspot-bg-img desktop"></picture>
      <picture class="hotspot-bg-img mobile"></picture>

      <div class="hotspot-content content-wrapper ">
          <h1 class="hotspot-header"></h1>
          <p class="hotspot-text reduced-width"></p>
      </div>

      <div class="hotspot-icon-set"></div>`;

  hotspot.querySelector('.hotspot-bg-img.desktop').innerHTML = firstPicture.innerHTML;
  hotspot.querySelector('.hotspot-bg-img.mobile').innerHTML = firstPicture.innerHTML;
  hotspot.querySelector('.hotspot-header').innerHTML = title.innerHTML;
  hotspot.querySelector('.hotspot-text').innerHTML = description.innerHTML;

  mainDiv.prepend(hotspot);
}

function addMobileTabNavigation(block, title, hotspotAreaId) {
  // only one tab navigation is needed for the entire page
  let mobileNav = document.querySelector('main > div#hotspots-mobile-nav');
  if (!mobileNav) {
    mobileNav = createElement('div', {
      props: { id: 'hotspots-mobile-nav' },
    });

    const ul = createElement('ul', { classes: 'featurenav-list' });
    mobileNav.append(ul);

    document.querySelector('main').append(mobileNav);
  }

  const li = createElement('li', { classes: 'featurenav-list-item' });
  li.dataset.hotspotTargetId = hotspotAreaId;
  if (mobileNav.firstElementChild.childElementCount === 0) {
    li.classList.add('active');
  }

  const link = createElement('a', { props: { href: `#${title.textContent}` } });
  link.innerHTML = title.innerHTML;
  li.append(link);
  mobileNav.firstElementChild.append(li);

  li.addEventListener('click', (event) => {
    event.preventDefault();

    const clickedButton = event.target.closest('li');
    if (clickedButton.classList.contains('active')) {
      return;
    }

    const id = clickedButton.dataset.hotspotTargetId;
    // Remove the active class from other active elements and add to current
    const activeElements = mobileNav.querySelectorAll('li.active');
    activeElements.forEach((el) => el.classList.remove('active'));
    clickedButton.classList.add('active');

    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Remove the active class from other active hotspot areas
    document.querySelectorAll('.section.hotspots-container.active').forEach((activeHotspotArea) => activeHotspotArea.classList.remove('active'));

    // activate the new hotspot area
    const targetHotspotArea = document.querySelector(`.section.hotspots-container[data-hotspot-area-id="${id}"]`);
    targetHotspotArea.classList.add('active');
  });
}
