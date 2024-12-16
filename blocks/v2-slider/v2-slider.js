import { createElement } from '../../scripts/common.js';

const blockName = 'v2-slider';

function handleSlider(block) {
  const clippingSlider = block.querySelector(`.${blockName}__input`);

  clippingSlider.addEventListener('input', (event) => {
    const newValue = `${event.target.value}%`;
    block.style.setProperty('--exposure', newValue);
  });
}

export default async function decorate(block) {
  const contentWrapper = block.querySelector(':scope > div');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const content = block.querySelector(':scope > div > div');
  content.classList.add(`${blockName}__content`);

  const images = [...content.querySelectorAll('p > picture')];
  const has2Images = images.length === 2;

  if (has2Images) {
    block.classList.add('two-images');
  }

  const header = createElement('div', { classes: `${blockName}__header` });
  const heading = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6')][0];
  heading.classList.add(`${blockName}__title`, 'with-marker');

  const nextElement = heading.nextElementSibling;
  const isImage = nextElement.querySelector('picture');

  header.append(heading);
  if (!isImage) {
    nextElement.classList.add(`${blockName}__subtitle`);
    header.append(nextElement);
  }
  content.prepend(header);

  const slider = createElement('div', { classes: `${blockName}__images` });
  const models = createElement('div', { classes: `${blockName}__models` });

  if (has2Images) {
    images.forEach((img, idx) => {
      img.classList.add('image', `image-${idx + 1}`);

      const model = img.parentElement;
      if (model.textContent.trim().length > 0) {
        model.classList.add('model', `model-${idx + 1}`);
        models.appendChild(model);
      }
      slider.appendChild(img);
    });

    const divider = createElement('div', { classes: `${blockName}__image-divider` });
    const label = createElement('label', { classes: `${blockName}__label` });
    const input = createElement('input', { classes: `${blockName}__input` });
    input.type = 'range';
    input.min = '0';
    input.max = '100';
    label.appendChild(input);
    slider.append(label, divider);

    content.append(slider, models);

    handleSlider(block);
  } else {
    slider.appendChild(images[0]);
    content.appendChild(slider);
  }

  const buttons = [...content.querySelectorAll('p.button-container')];
  if (buttons.length > 0) {
    buttons.forEach((btn) => content.appendChild(btn));
  }
}
