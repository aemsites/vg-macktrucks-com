import { createOptimizedPicture } from '../../scripts/aem.js';
import { createElement } from '../../scripts/common.js';

const updateListElements = (ul, isDarkVar = false, isCTABlock = false) => {
  const lis = [...ul.children];
  lis.forEach((li) => {
    // get image for setting as background image
    if (isDarkVar) {
      const img = li.querySelector('img');
      li.style.backgroundImage = `url(${img.src})`;
      const pictureDiv = li.querySelector('.cards-card-image');
      pictureDiv.remove();
    }

    if (isCTABlock) {
      const buttons = li.querySelectorAll('.cards-card-body .button-container');
      const { length } = buttons;
      if (length === 0) {
        return;
      }
      // Last button is the one we want to use at card level
      const tempLink = [...buttons].at(-1).querySelector('a');
      const newLink = createElement('a', {
        props: { href: tempLink.href, title: tempLink.title },
      });

      buttons[length - 1].remove(); // remove last button
      newLink.innerHTML = li.innerHTML;
      li.textContent = '';
      li.appendChild(newLink);
    }
  });
};

const recalcMaxHeight = (elements, initMaxHeight) => {
  const newMaxHeight = elements.reduce((maxHeight, el) => {
    el.style.height = '';

    return el.offsetHeight > maxHeight ? el.offsetHeight : maxHeight;
  }, initMaxHeight);

  return newMaxHeight;
};

const setHeightForCards = (cards, height) => {
  [...cards].forEach((c) => {
    c.style.height = `${height}px`;
  });
};

const observerFallBack = (changes, observer, cards, imgMaxHeight) => {
  changes.forEach((change) => {
    const isAttribute = change.type === 'attributes';
    const isStatus = isAttribute && change.attributeName === 'data-section-status';
    const isLoaded = isStatus && change.target.dataset.sectionStatus === 'loaded';
    if (!isLoaded) {
      return;
    }
    let maxHeight = imgMaxHeight;
    const { children } = cards;
    [...children].forEach((card) => {
      const height = card.offsetHeight;
      const img = card.querySelector('img');
      if (img && img.offsetHeight === 0) {
        img.classList.add('scaled');

        // adding height recalculation on images load
        img.addEventListener('load', () => {
          maxHeight = recalcMaxHeight([...children], maxHeight);

          setHeightForCards(children, maxHeight);
        });
      }
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    setHeightForCards(children, maxHeight);
    observer.disconnect();
  });
};

const setSameHeightCards = (block, cards, imgMaxHeight) => {
  const parentSection = block.closest('[data-section-status]');
  const observer = new MutationObserver((changes) => observerFallBack(changes, observer, cards, imgMaxHeight));
  observer.observe(parentSection, { attributes: true, attributeFilter: ['data-section-status'] });
};

export default function decorate(block) {
  const isCTABlock = block.classList.contains('cta');
  const isDarkVar = block.classList.contains('dark');
  let imgMaxHeight = 0;
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      const hasPicture = isCTABlock ? div.querySelector('picture') : div.children.length === 1 && div.querySelector('picture');
      if (hasPicture) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    if (isDarkVar) {
      imgMaxHeight = img.height > imgMaxHeight ? img.height : imgMaxHeight;
    }
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  // add background black
  if (isDarkVar) {
    const cardsContainer = block.parentElement.parentElement;
    cardsContainer.classList.add('dark-card-container');
  }
  block.textContent = '';
  block.append(ul);

  updateListElements(ul, isDarkVar, isCTABlock);

  if (isCTABlock) {
    setSameHeightCards(block, ul, imgMaxHeight);
  }
}
