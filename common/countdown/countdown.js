import { loadCSS } from '../../scripts/aem.js';
import { createElement, isValidISODateString, formatTimeUnit } from '../../scripts/common.js';

/**
 * Creates the HTML structure for the countdown timer.
 *
 * @returns {HTMLElement} - The root element of the countdown timer.
 */
const createCountdownHTML = () => {
  const countdown = createElement('div', { classes: 'countdown' });
  const countdownTime = createElement('div', { classes: 'countdown__time' });
  countdown.appendChild(countdownTime);
  return countdown;
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
 * Creates and initializes a countdown timer. Generates the countdown timer HTML structure,
 * starts the countdown logic, and returns the HTML element for appending to the DOM.
 *
 * @param {string} countdownDateString - The target date in ISO 8601 format (e.g., "2025-01-01T00:00:00Z").
 * @returns {Promise<HTMLElement|null>} - A Promise that resolves to the countdown HTML element,
 * or `null` if the date is invalid or an error occurs.
 *
 * @throws {Error} Logs an error if the provided date string is not valid or the CSS fails to load.
 */
export const initializeCountdown = async (countdownDateString) => {
  if (!isValidISODateString(countdownDateString)) {
    console.error('Invalid ISO 8601 date string:', countdownDateString);
    return null;
  }

  const baseURL = window.location.origin;

  try {
    await loadCSS(`${baseURL}/common/countdown/countdown.css`);
    const countdownDate = new Date(countdownDateString);
    const countdownHTML = createCountdownHTML();
    const countdownElement = countdownHTML.querySelector('.countdown__time');
    startCountdown(countdownElement, countdownDate);
    return countdownHTML;
  } catch (error) {
    console.error('Failed to load countdown CSS:', error);
    return null;
  }
};
