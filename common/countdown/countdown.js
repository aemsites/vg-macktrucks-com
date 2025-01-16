import { loadCSS } from '../../scripts/aem.js';
import { isValidISODateString, formatTimeUnit } from '../../scripts/common.js';

/**
 * Inserts the HTML structure for the countdown timer into the specified container.
 *
 * @param {HTMLElement} container - The container where the countdown timer will be rendered.
 */
const renderCountdownHTML = (container) => {
  const countdownHTML = `
    <div class="countdown">
      <div class="countdown__time"></div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', countdownHTML);
};

/**
 * Calculates the time remaining between the current time and a target date.
 *
 * @param {Date} targetDate - The future date to count down to.
 * @returns {Object|null} - An object with `days`, `hours`, `minutes`, and `seconds`, or null if the target date has passed.
 */
const calculateTimeDifference = (targetDate) => {
  const now = Date.now();
  const timeDifference = targetDate.getTime() - now;

  if (timeDifference <= 0) {
    return null;
  }

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

/**
 * Updates the content of the countdown timer element with the specified time units.
 *
 * @param {HTMLElement} countdownElement - The DOM element where the countdown time is displayed.
 * @param {Object} timeUnits - The remaining time to display, including `days`, `hours`, `minutes`, and `seconds`.
 */
const updateCountdownDisplay = (countdownElement, timeUnits) => {
  const { days, hours, minutes, seconds } = timeUnits;
  countdownElement.textContent = `${formatTimeUnit(days)}:${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
};

/**
 * Starts the countdown timer update loop with drift compensation.
 *
 * @param {HTMLElement} countdownElement - The DOM element where the countdown time is displayed.
 * @param {Date} countdownDate - The target date for the countdown.
 */
const startCountdown = (countdownElement, countdownDate) => {
  const tick = () => {
    const timeUnits = calculateTimeDifference(countdownDate);

    if (!timeUnits) {
      countdownElement.textContent = '00:00:00:00'; // To be updated with the desired behavior in #154
      clearTimeout(timeoutId);
      return;
    }

    updateCountdownDisplay(countdownElement, timeUnits);

    const nextTick = 1000 - (Date.now() % 1000);
    timeoutId = setTimeout(tick, nextTick);
  };

  let timeoutId = setTimeout(tick, 0);
};

/**
 * Initializes and starts a countdown timer. Renders the countdown timer in the specified container
 * and begins updating it in real-time. Automatically loads required CSS for styling.
 *
 * @param {string} countdownDateString - The target date as a string in ISO 8601 format.
 * @param {HTMLElement} container - The container where the countdown timer will be displayed.
 */
export const initializeCountdown = (countdownDateString, container) => {
  if (!isValidISODateString(countdownDateString)) {
    console.error('Invalid ISO 8601 date string:', countdownDateString);
    return;
  }

  const baseURL = window.location.origin;
  loadCSS(`${baseURL}/common/countdown/countdown.css`);

  const countdownDate = new Date(countdownDateString);
  renderCountdownHTML(container);
  const countdownElement = container.querySelector('.countdown__time');
  startCountdown(countdownElement, countdownDate);
};
