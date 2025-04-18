import { createElement, getTextLabel, isMobileViewport } from '../../scripts/common.js';

const BLOCK_NAME = 'v2-picture-tooltips';

/**
 * Extracts hotspot data from a given block element.
 *
 * This function processes a block element to extract information about hotspots.
 * Each hotspot is represented as an object containing its index, coordinates,ß
 * and text content. After extracting the hotspots, the function removes all
 * non-first child elements from the block.
 *
 * @param {HTMLElement} block - The block element containing hotspot data.
 * @returns {Array<Object>} An array of hotspot objects, where each object contains:
 *   - `index` {number}: The index of the hotspot.
 *   - `coords` {string}: The coordinates of the hotspot, extracted from the first child paragraph.
 *   - `textContent` {Array<HTMLElement>}: An array of child elements from the last child of the hotspot.
 */
function extractHotSpotsFrom(block) {
  const hotSpotsElements = Array.from(block.querySelectorAll(':scope > div')).slice(1);
  const hotSpots = hotSpotsElements.map((hotSpot, index) => ({
    index,
    coords: hotSpot.querySelector(':scope > div:first-child p').textContent,
    textContent: Array.from(hotSpot.querySelector(':scope > div:last-child').children),
  }));

  block.querySelectorAll(':scope > div:not(:first-child)').forEach((element) => {
    element.remove();
  });

  return hotSpots;
}

/**
 * Generates a CSS style string for positioning based on given coordinates.
 *
 * @param {string} coords - A string representing coordinates in the format "x:y",
 *                          where `x` and `y` are percentages.
 * @returns {string} A CSS style string in the format "left: x%; top: y%;".
 */
function getCoordsStyle(coords) {
  const [x, y] = coords.split(':');

  return `left: ${x}%; top: ${y}%`;
}

function getBottomStyleClass(coords) {
  const [, y] = coords.split(':');

  return y > 50 ? `${BLOCK_NAME}__tooltip--bottom` : '';
}

/**
 * Decorates a block element with hotspots and tooltips.
 *
 * @param {HTMLElement} block - The block element to decorate.
 * @param {Array<Object>} hotSpots - An array of hotspot objects to add to the block.
 * @param {string} hotSpots[].coords - The coordinates for the hotspot, used for positioning.
 * @param {Array<HTMLElement>} hotSpots[].textContent - An array of HTML elements representing the content of the tooltip.
 * @param {number} hotSpots[].index - The index of the hotspot, used for labeling.
 */
function decorateBlockWithHotSpots(block, hotSpots) {
  // Cell with the image:
  const firstBlockCol = block.querySelector(':scope > div > div');
  // Cell with the html text content:
  const secondBlockCol = block.querySelector(':scope > div > div:nth-child(2)');
  const firstBlockRow = block.querySelector(':scope > div');
  const pictureWrapper = createElement('div', { classes: `${BLOCK_NAME}__picture-wrapper` });

  if (!firstBlockCol) {
    return;
  }

  firstBlockCol.classList.add(`${BLOCK_NAME}__picture-container`);
  firstBlockCol.appendChild(pictureWrapper);

  // Move all elements from the first block column to the picture wrapper
  while (firstBlockCol.firstChild !== pictureWrapper) {
    pictureWrapper.appendChild(firstBlockCol.firstChild);
  }

  const hotspotsTooltip = document.createElement('ol');
  hotspotsTooltip.classList.add(`${BLOCK_NAME}__tooltips-wrapper`);
  firstBlockRow.insertAdjacentElement('afterend', hotspotsTooltip);
  firstBlockRow.classList.add(`${BLOCK_NAME}__main-wrapper`);

  if (secondBlockCol) {
    secondBlockCol.classList.add(`${BLOCK_NAME}__text-container`);
    firstBlockRow.classList.add(`${BLOCK_NAME}__main-wrapper--two-columns`);
  }

  hotSpots.forEach((hotSpot, index) => {
    pictureWrapper.insertAdjacentHTML(
      'beforeend',
      `
        <div class="${BLOCK_NAME}__hotspot-wrapper ${index === 0 ? 'active' : ''}" data-coords="${hotSpot.coords}" style="${getCoordsStyle(hotSpot.coords)}">
          <button class="${BLOCK_NAME}__hotspot" aria-label="${getTextLabel('tooltip')}">${hotSpot.index + 1}<span class="icon"></span></button>
          <div class="${BLOCK_NAME}__tooltip ${getBottomStyleClass(hotSpot.coords)}">
            <div class="${BLOCK_NAME}__tooltip-content">
              ${hotSpot.textContent.map((el) => el.outerHTML).join('')}
            </div>
          </div>
        </div>
      `,
    );

    hotspotsTooltip.insertAdjacentHTML(
      'beforeend',
      `
      <li class="${BLOCK_NAME}__tooltip ${index === 0 ? 'active' : ''}" data-coords="${hotSpot.coords}">
        <div class="${BLOCK_NAME}__tooltip-content">
          ${hotSpot.textContent.map((el) => el.outerHTML).join('')}
        </div>
      </li>
    `,
    );
  });
}

/**
 * Handles the click event on a hotspot element within a block.
 * This function manages the activation of the clicked hotspot and its corresponding tooltip,
 * ensures smooth scrolling to the block if necessary, and sets focus to the tooltip.
 *
 * @param {Event} event - The click event triggered by the user.
 * @param {HTMLElement} block - The parent block element containing hotspots and tooltips.
 */
function handleClickHotspot(event, block) {
  // remove all active classes and assign the correct ones to the clicked element and to the tooltip with the same data-coords
  const hotspot = event.target;
  const hotspotWrapper = hotspot.closest(`.${BLOCK_NAME}__hotspot-wrapper`);
  const hotspotCoords = hotspotWrapper.getAttribute('data-coords');
  const tooltip = block.querySelector(`.${BLOCK_NAME}__tooltip[data-coords="${hotspotCoords}"]`);

  block.querySelectorAll(`.${BLOCK_NAME}__hotspot-wrapper`).forEach((el) => el.classList.remove('active'));
  block.querySelectorAll(`.${BLOCK_NAME}__tooltip`).forEach((el) => el.classList.remove('active'));

  hotspotWrapper.classList.add('active');
  tooltip.classList.add('active');

  if (isMobileViewport() && block.getBoundingClientRect().top > 0) {
    tooltip.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // set focus to the tooltip
  tooltip.focus();
}

/**
 * Assigns a click event listener to all hotspot elements within the specified block.
 * When a hotspot is clicked, it triggers the `handleClickHotspot` function.
 *
 * @param {HTMLElement} block - The parent block element containing hotspot elements.
 */
function assignHotspotClickEvent(block) {
  block.querySelectorAll(`.${BLOCK_NAME}__hotspot`).forEach((hotspot) => {
    hotspot.addEventListener('click', (event) => handleClickHotspot(event, block));
  });
}

/**
 * Adds specific CSS classes to all heading elements (h1, h2, h3, h4, h5, h6) within a given block.
 *
 * @param {HTMLElement} block - The container element within which to find and decorate heading elements.
 * @returns {void}
 */
function decorateHeadings(block) {
  // TODO: Move this to common.js and find other usages of this 'with-marker' class
  const headings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];

  headings.forEach((heading) => heading.classList.add(`${BLOCK_NAME}__heading`, 'with-marker'));
}

/**
 * Decorates a given block element by extracting hotspots, decorating the block with them,
 * and assigning click events to the hotspots.
 *
 * @param {HTMLElement} block - The block element to decorate.
 */
function decorate(block) {
  const hotSpots = extractHotSpotsFrom(block);

  decorateHeadings(block);
  decorateBlockWithHotSpots(block, hotSpots);

  assignHotspotClickEvent(block);
}

export default decorate;
