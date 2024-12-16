import { createElement } from '../../scripts/common.js';

const buildLinkAndList = (block) => {
  const specsTitle = block.querySelector('h3');
  const subtitles = block.querySelectorAll('p');
  const uls = block.querySelectorAll('ul');
  const lis = block.querySelectorAll('li');

  lis.forEach((li) => {
    if (li.textContent.length === 0) {
      li.remove();
    }
  });
  uls.forEach((ul) => {
    ul.classList.add('link-and-list');
  });

  const specsSection = createElement('div', { classes: 'specs-section' });
  const specsHeading = createElement('div', { classes: 'specs-heading' });
  const specsList = createElement('ul', { classes: 'specs-list' });

  for (let idx = 0; idx < subtitles.length; idx += 1) {
    const item = createElement('li', { classes: ['specs-item', `specs-item-${idx + 1}`] });
    const link = subtitles[idx].querySelector('a');

    if (link) {
      link.classList.remove('button', 'primary');
      link.classList.add('specs-link');
      item.append(link);
    } else {
      item.append(subtitles[idx]);
    }
    item.append(uls[idx]);
    specsList.append(item);
  }
  specsHeading.append(specsTitle);
  specsSection.append(specsHeading, specsList);

  block.textContent = '';
  block.append(specsSection);
};

const buildDefaultSpecs = (block) => {
  const children = [...block.children];
  const ulElements = [...block.querySelectorAll('ul')];

  const specsTitle = children.shift().querySelector('h3');

  const specsSection = createElement('div', { classes: 'specs-section' });
  const specsHeading = createElement('div', { classes: 'specs-heading' });
  const specsList = createElement('ul', { classes: 'specs-list' });

  if (ulElements.length === 1) {
    const liElements = [...ulElements[0].querySelectorAll('li')];

    liElements.forEach((e, idx) => {
      const item = createElement('li', { classes: ['specs-item', `specs-item-${idx + 1}`] });
      const text = createElement('p', { classes: 'p-element' });
      const isStrong = e.querySelector('strong');
      const link = e.querySelector('a');

      if (link) {
        link.classList.remove('button', 'primary');
        link.classList.add('specs-link');
        item.append(link);
      } else {
        text.append(isStrong ?? e.innerText);
        item.append(text);
      }
      const extraArrowSpan = item.querySelector('span');
      if (extraArrowSpan) {
        extraArrowSpan.remove();
      }
      specsList.append(item);
    });
  } else if (ulElements.length > 1) {
    specsList.classList.add('specs-list-multiple');

    ulElements.forEach((e, idx) => {
      const item = createElement('li', { classes: ['specs-item', `specs-item-${idx + 1}`] });

      const subtitle = e.parentNode.querySelector('p');
      subtitle.classList.add('specs-item-subtitle');
      if (idx <= 2) {
        item.append(subtitle);
      }

      const liElements = [...e.querySelectorAll('li')];
      const features = createElement('div', { classes: 'feature-list' });

      liElements.forEach((feature) => {
        const text = createElement('p', { classes: 'p-element' });
        const isStrong = feature.querySelector('strong');

        text.append(isStrong ?? feature.innerText);
        features.append(text);
      });
      item.append(features);
      specsList.append(item);
    });
  } else {
    children.forEach((e, idx) => {
      const item = createElement('li', { classes: ['specs-item', `specs-item-${idx + 1}`, 'specs-item-with-image'] });

      const pElements = [...e.querySelectorAll('p')];
      const picture = e.querySelector('picture');
      const [subtitle, content] = pElements;

      if (!subtitle || !content) {
        const singleText = e.innerText;
        const text = createElement('p', { classes: 'single-text' });
        const strongTag = createElement('strong', { classes: 'single-text' });
        strongTag.innerText = singleText;
        text.append(strongTag);
        item.append(text);
      } else {
        if (picture) {
          item.append(picture);
        }
        const link = e.querySelector('a');
        if (link) {
          link.classList.remove('button', 'primary');
          link.classList.add('specs-link');
          item.append(subtitle, link);
        } else {
          item.append(subtitle, content);
        }
      }
      specsList.append(item);
    });
  }
  specsHeading.append(specsTitle);
  specsSection.append(specsHeading, specsList);

  block.textContent = '';
  block.append(specsSection);
};

export default function decorate(block) {
  const typeDetector = [...block.classList];
  if (typeDetector.includes('link-and-list')) {
    buildLinkAndList(block);
  } else {
    buildDefaultSpecs(block);
  }
}
