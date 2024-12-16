// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 768px)');
let isInitialPainting = true;

function addTitlesListener(container) {
  const tabTitles = container.querySelectorAll('h4');
  container.onclick = (e) => {
    const { target } = e;
    if (isInitialPainting) {
      return;
    }
    if (target.localName !== 'h4') {
      return;
    }
    const tabContent = target.nextElementSibling;
    const contentWrapper = tabContent.querySelector('.content-wrapper');
    const isActive = target.classList.contains('active');
    [...tabTitles].forEach((tabTitle) => tabTitle.classList.remove('active'));
    if (MQ.matches) {
      target.classList.add('active');
    } else {
      target.classList.toggle('active', !isActive);
    }
    // tab fold/unfold animation
    if (MQ.matches && isActive) {
      return;
    }
    [...tabTitles].forEach((title) => {
      title.nextElementSibling.style.height = 0;
    });
    tabContent.style.height = tabContent.clientHeight ? 0 : `${contentWrapper.clientHeight}px`;
  };
}

function isOutOfRange(isNext, movement, lastSlide) {
  const isFirstSlide = !isNext && movement > 0;
  const isLastSlide = isNext && movement < lastSlide;
  return isFirstSlide || isLastSlide;
}

function addClickListener(container) {
  const slideControls = container.querySelector('.slide-controls');
  const slidesContainer = container.querySelector('.slides-container');
  const arrows = slideControls.querySelectorAll('.slide-control');
  const previousBtn = slideControls.querySelector('.btn-previous');
  const nextBtn = slideControls.querySelector('.btn-next');
  const paginationBtns = slideControls.querySelectorAll('.pagination-link');
  const { length } = slidesContainer.children;
  slideControls.onclick = (e) => {
    const { target } = e;
    e.preventDefault();
    if (target.localName !== 'a') {
      return;
    }
    const activeSlide = slidesContainer.querySelector('.active');
    const isArrow = target.classList.contains('slide-control');
    let movement;
    let targetSlide;
    let targetArrow;
    if (isArrow) {
      const isNext = target.classList.contains('btn-next');
      const lastSlide = (length - 1) * -100;
      const sum = isNext ? -100 : 100;
      const slideIndex = activeSlide.dataset.value;

      targetArrow = target;
      targetSlide = isNext ? +slideIndex + 1 : +slideIndex - 1;
      movement = slideIndex * -100 + sum;
      if (isOutOfRange(isNext, movement, lastSlide)) {
        return;
      }
    } else {
      targetSlide = +target.dataset.value;
      movement = targetSlide * -100;
      if (targetSlide === length - 1) {
        targetArrow = nextBtn;
      } else if (targetSlide === 0) {
        targetArrow = previousBtn;
      }
    }
    slidesContainer.style = `translate: ${movement}%`;
    activeSlide.classList.remove('active');
    slidesContainer.querySelector(`[data-value="${targetSlide}"]`).classList.add('active');
    [...arrows].forEach((arrow) => arrow.classList.remove('disabled'));
    if (targetSlide === length - 1 || targetSlide === 0) {
      targetArrow.classList.add('disabled');
    }
    [...paginationBtns].forEach((btn) => btn.classList.remove('active'));
    slideControls.querySelector(`[data-value="${targetSlide}"]`).classList.add('active');
  };
}

function addSliderControls(contentWrapper, slidesLength) {
  const tabBody = contentWrapper.querySelector('.description');
  const slideControls = document.createElement('div');
  const previousBtn = document.createElement('a');
  const nextBtn = document.createElement('a');
  const pagination = document.createElement('div');
  const navList = document.createElement('ul');

  for (let i = 0; i < slidesLength; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = `${i}`;
    a.dataset.value = `${i}`;
    a.className = i !== 0 ? 'pagination-link' : 'pagination-link active';
    li.appendChild(a);
    navList.appendChild(li);
  }
  previousBtn.href = '#';
  nextBtn.href = '#';
  slideControls.className = 'slide-controls';
  previousBtn.className = 'slide-control btn-previous disabled';
  nextBtn.className = 'slide-control btn-next';
  pagination.className = 'pagination';
  previousBtn.textContent = 'PREVIOUS';
  nextBtn.textContent = 'NEXT';
  pagination.appendChild(navList);
  slideControls.append(pagination, previousBtn, nextBtn);
  contentWrapper.insertBefore(slideControls, tabBody);
}

function decorateSlider(container) {
  // explore trucks' slider has to be the 1st h4 element
  const tabContent = container.querySelector('h4:first-of-type + .tab-content');
  const contentWrapper = tabContent.querySelector('.content-wrapper');
  const sliderWrapper = contentWrapper.children[0]; // div with data-align center

  const imageContainers = sliderWrapper.querySelectorAll('p');
  const titles = sliderWrapper.querySelectorAll('h2');
  const newSliderWrapper = document.createElement('div');
  const slidesContainer = document.createElement('div');
  newSliderWrapper.className = 'slider-wrapper';
  slidesContainer.className = 'slides-container';

  [...imageContainers].forEach((p, i) => {
    const div = document.createElement('div');
    const imgLink = document.createElement('a');
    const picture = p.children[0];
    imgLink.href = titles[i].querySelector('a').href;
    div.className = i !== 0 ? 'slide' : 'slide active';
    div.dataset.value = i;
    imgLink.appendChild(picture);
    p.prepend(imgLink);
    div.append(p, titles[i]);
    slidesContainer.appendChild(div);
  });

  newSliderWrapper.appendChild(slidesContainer);
  contentWrapper.prepend(newSliderWrapper);
  sliderWrapper.remove();

  // add slider controls
  addSliderControls(contentWrapper, titles.length);
  addClickListener(container);
}

function onResizeCalculation(container) {
  const tabContentList = container.querySelectorAll(':scope > .tab-content > .content-wrapper');

  // resizing content of active tab
  const resizeObserver = new ResizeObserver((entries) => {
    const activeContent = container.querySelector(':scope > .tab-title.active + .tab-content > .content-wrapper');

    entries.forEach((entry) => {
      // resize the tab content element to fit the children node
      if (activeContent === entry.target) {
        activeContent.parentElement.style.height = `${entry.target.clientHeight}px`;
      }
    });
  });

  tabContentList.forEach((el) => {
    resizeObserver.observe(el);
  });

  // handling the switch between row of elements (on desktop) and carousel (on tablet and mobile)
  let translationsList = null;

  MQ.addEventListener('change', (e) => {
    const sliderContainersList = container.querySelectorAll('.slides-container');

    if (!translationsList) {
      translationsList = Array(sliderContainersList.length).fill(0);
    }

    sliderContainersList.forEach((el, index) => {
      if (e.matches) {
        // storing the mobile translation - the active slide in the carousel
        translationsList[index] = el.style.translate;
        el.style.translate = 0;
      } else {
        // reverting to the prev active slide on mobile
        el.style.translate = translationsList[index];
      }
    });
  });
}

function setupInitialStyles(container) {
  const tabTitle = container.children[0];
  const tabContent = container.children[1];
  const contentWrapper = tabContent.children[0];
  let resizeTimer = null;
  tabContent.style.height = MQ.matches ? '578px' : 0;
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.contentRect.height > 0 && MQ.matches) {
        tabContent.style.height = `${entry.target.clientHeight}px`;
      }
    });
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      isInitialPainting = false;
      resizeObserver.disconnect();
    }, 3000);
  });
  resizeObserver.observe(contentWrapper);
  if (MQ.matches) {
    tabTitle.classList.add('active');
  }
}

export default function decorate(block) {
  const tabContainers = block.children;
  const exploreContainer = document.createElement('div');
  [...tabContainers].forEach((tab) => {
    const tabContent = document.createElement('div');
    const contentWrapper = document.createElement('div');
    const content = [...tab.children];
    const tabTitle = tab.querySelector('h4');
    const ctas = tab.querySelector('.button-container');
    // relocate content to the new container
    content.forEach((node) => {
      contentWrapper.appendChild(node);
    });
    // add again the content and the title
    tabContent.appendChild(contentWrapper);
    exploreContainer.append(tabTitle, tabContent);
    // add proper class names for styling
    tabContent.style.height = 0;
    ctas.classList.add('cta');
    tabContent.className = 'tab-content';
    contentWrapper.className = 'content-wrapper';
    tab.className = 'tab-container';
    tabTitle.className = 'tab-title';
    tabTitle.setAttribute('tabindex', 0);
    contentWrapper.children[0].className = 'tab-image';
    contentWrapper.children[1].className = 'description';
    tab.remove();
  });

  exploreContainer.className = 'tab-container';
  block.appendChild(exploreContainer);
  addTitlesListener(exploreContainer);
  decorateSlider(exploreContainer);
  setupInitialStyles(exploreContainer);
  onResizeCalculation(exploreContainer);
}
