import { createElement, unwrapDivs, getTextLabel, decorateIcons } from '../../scripts/common.js';
import { removeArticlesWithNoImage, fetchMagazineArticles } from '../../scripts/services/magazine.service.js';
import { setCarouselPosition, listenScroll } from '../../scripts/carousel-helper.js';
import { isVideoLink, createVideo } from '../../scripts/video-helper.js';

const blockName = 'v2-magazine-tabbed-carousel';
const activeTabClass = `${blockName}__navigation-item--active`;
const activeCarouselClass = `${blockName}__carousel-item--active`;

let autoScrollEnabled = true;
const maxAmountOfTabs = 4;

const allArticles = await fetchMagazineArticles();
const allArticlesWithImage = removeArticlesWithNoImage(allArticles);

let activeVideo = null;

const handleVideoAutoplay = (carouselItem, index) => {
  if (!carouselItem || !carouselItem.children[index]) {
    return;
  }

  const currentVideo = carouselItem.children[index].querySelector('video');

  if (currentVideo) {
    if (activeVideo && activeVideo !== currentVideo) {
      activeVideo.pause();
    }
    currentVideo.play();
    activeVideo = currentVideo;
  } else if (activeVideo) {
    activeVideo.pause();
    activeVideo = null;
  }
};

const updateActiveItem = (elements, entry) => {
  elements.forEach((el, index) => {
    if (el === entry.target && entry.intersectionRatio >= 0.75) {
      const carouselItems = el.parentElement;
      const navigation = el.parentElement.nextElementSibling;

      [carouselItems, navigation].forEach((c) => {
        c.querySelectorAll(`.${activeTabClass}, .${activeCarouselClass}`).forEach((i) => {
          i.classList.remove(`${activeTabClass}`, `${activeCarouselClass}`);
        });
      });
      carouselItems.children[index].classList.add(activeCarouselClass);
      navigation.children[index].classList.add(activeTabClass);

      // Center navigation item
      const navigationActiveItem = navigation.querySelector(`.${activeTabClass}`);

      if (navigation && navigationActiveItem) {
        const { clientWidth: itemWidth, offsetLeft } = navigationActiveItem;
        // Calculate the scroll position to center the active item
        const scrollPosition = offsetLeft - (navigation.clientWidth - itemWidth) / 2;
        navigation.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }

      handleVideoAutoplay(carouselItems, index);
    }
  });
};

const buildTabNavigation = (carousel, title, category, index) => {
  const item = document.createRange().createContextualFragment(`
    <button tabindex="0" class="${blockName}__navigation-item item-${index + 1}">
      <p class="pretitle">${category}</p>
      <p class="title">${title}</p>
    </button>
  `);
  item.querySelector('button').addEventListener('click', () => setCarouselPosition(carousel, index));

  return item;
};

const appendMediaToFigure = (figure, picture, links) => {
  if (picture) {
    figure.append(picture);
  } else {
    const videoLink = Array.from(links).find((link) => link.classList.contains('text-link-with-video'));
    const isVideo = videoLink ? isVideoLink(videoLink) : false;
    if (isVideo) {
      createVideo(figure, videoLink.getAttribute('href'), `${blockName}__video`, {
        muted: true,
        autoplay: false,
        loop: true,
        playsinline: true,
      });
      videoLink.remove();
    }
  }
};

const buildTabItems = (carousel, navigation, items, articles) => {
  items.forEach((item, index) => {
    if (index <= maxAmountOfTabs - 1) {
      const picture = item.querySelector('picture');
      const links = item.querySelectorAll('a');
      const tabContent = Array.from(links).find((link) => !link.classList.contains('text-link-with-video'));
      const articlePath = tabContent.href;

      const liItem = createElement('li', { classes: [`${blockName}__item`, `item-${index + 1}`] });
      const figure = createElement('figure', { classes: `${blockName}__figure` });

      appendMediaToFigure(figure, picture, links);

      const figureCaption = createElement('figcaption');
      figureCaption.append(tabContent);
      figure.append(figureCaption);

      liItem.append(figure);
      carousel.appendChild(liItem);

      const fullArticleObj = articles.find((path) => {
        const shortUrl = articlePath.split('/magazine/')[1];
        const shortPath = path.path.split('/magazine/')[1];
        return shortPath === shortUrl;
      });
      const { title, category } = fullArticleObj;

      const navItem = buildTabNavigation(carousel, title, category, index);
      navigation.append(navItem);
    }
    item.innerHTML = '';
  });
};

const autoScrollFunction = (container) => {
  const amountOfSlides = container.querySelectorAll(`.${blockName}__item`).length;
  const activeSlide = container.querySelector(`.${activeCarouselClass}`);
  const classlistArray = [...activeSlide.classList];
  const item = classlistArray.find((el) => el.slice(0, 5) === 'item-');
  const itemNum = Number(item.split('-')[1]);

  activeSlide.classList.remove(`${activeCarouselClass}`);

  const nextNum = itemNum === amountOfSlides ? 1 : itemNum + 1;
  const nextSlide = container.querySelector(`.item-${nextNum}`);

  nextSlide.classList.add(`${activeCarouselClass}`);
  if (nextSlide.classList.contains(`${blockName}__item`)) {
    const itemsContainer = nextSlide.parentElement;
    const { x: itemWidth } = nextSlide.getBoundingClientRect();
    itemsContainer.scrollLeft += itemWidth;
  }
};

const handleSwitch = (e, setAutoScroll) => {
  const slider = e.target.parentElement.querySelector('.switch-slider');
  const isOff = e.target.matches('[data-autoscroll="off"]');
  if (autoScrollEnabled === isOff) {
    autoScrollEnabled = !isOff;
  }
  slider.style.left = isOff ? '53px' : '0';
  setAutoScroll(autoScrollEnabled);
};

export default async function decorate(block) {
  let isFirstLoad = true;
  let scrollIntervalID;
  const carouselContainerSection = block.closest('.section.v2-magazine-tabbed-carousel-container');
  const intervalTime = parseInt(carouselContainerSection?.dataset.magazineTabbedCarouselIntervalTime || '6000', 10);

  const switchFullTexts = getTextLabel('autoscroll_switch');

  const carouselContainer = createElement('div', { classes: `${blockName}__container` });
  const carouselItems = createElement('ul', { classes: `${blockName}__items` });
  carouselContainer.append(carouselItems);

  const tabNavigation = createElement('nav', { classes: `${blockName}__navigation` });

  const tabItems = block.querySelectorAll(':scope > div');

  buildTabItems(carouselItems, tabNavigation, tabItems, allArticlesWithImage);

  const handleAutoScroll = (isEnabled) => {
    if (isEnabled) {
      scrollIntervalID = setInterval(() => {
        autoScrollFunction(carouselContainer);
      }, intervalTime);
    } else {
      clearInterval(scrollIntervalID);
      scrollIntervalID = null;
    }
  };

  const switchSplittedTexts = switchFullTexts.split(',');
  const autoScrollSwitch = document.createRange().createContextualFragment(`
    <div class="switch">
      <p class="switch-label">${switchSplittedTexts[0]}</p>
      <div class="switch-buttons">
        <button>${switchSplittedTexts[1]}</button>
        <button data-autoscroll="off">${switchSplittedTexts[2]}</button>
        <div class="switch-slider"></div>
      </div>
    </div>
  `);

  autoScrollSwitch.querySelectorAll('button').forEach((btn) => btn.addEventListener('click', (e) => handleSwitch(e, handleAutoScroll)));

  carouselContainer.append(tabNavigation);

  block.parentElement.classList.add('full-width');
  block.append(carouselContainer);

  if (isFirstLoad && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    carouselContainer.append(autoScrollSwitch);
    handleAutoScroll(autoScrollEnabled);
    isFirstLoad = false;
  }

  // update the button indicator on scroll
  const elements = carouselItems.querySelectorAll(':scope > *');
  listenScroll(carouselItems, elements, updateActiveItem, 0.75);
  unwrapDivs(block);
  decorateIcons(block);
}
