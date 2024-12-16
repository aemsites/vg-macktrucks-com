import { createElement } from './common.js';

export const listenScroll = (carousel, elements, updateFn, threshold = 1) => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateFn(elements, entry);
        }
      });
    },
    {
      root: carousel,
      threshold,
    },
  );

  elements.forEach((el) => {
    io.observe(el);
  });
};

export const setCarouselPosition = (carousel, index) => {
  const firstEl = carousel.firstElementChild;
  const scrollOffset = firstEl.getBoundingClientRect().width;
  const style = window.getComputedStyle(firstEl);
  const marginleft = parseFloat(style.marginLeft);

  carousel.scrollTo({
    left: index * scrollOffset + marginleft,
    behavior: 'smooth',
  });
};

export const createArrowControls = (carousel, scrollSelector, controlClasses, arrowFragment) => {
  function navigate(direction) {
    const activeItem = carousel.querySelector(scrollSelector);
    let index = [...activeItem.parentNode.children].indexOf(activeItem);
    if (direction === 'left') {
      index -= 1;
      if (index === -1) {
        // Go to the last item if at the start
        index = carousel.childElementCount;
      }
    } else {
      index += 1;
      if (index > carousel.childElementCount - 1) {
        index = 0; // Go to the first item if at the end
      }
    }

    setCarouselPosition(carousel, index);
  }

  const arrowControls = createElement('ul', { classes: controlClasses });
  arrowControls.append(...arrowFragment.children);
  carousel.insertAdjacentElement('beforebegin', arrowControls);
  const [prevButton, nextButton] = arrowControls.querySelectorAll(':scope button');
  prevButton.addEventListener('click', () => navigate('left'));
  nextButton.addEventListener('click', () => navigate('right'));
};
