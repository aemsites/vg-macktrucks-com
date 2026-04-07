import { createElement } from '../../scripts/common.js';

export default function decorate(block) {
  const button = createElement('button', {
    classes: ['button', 'button--primary'],
  });
  button.textContent = block.textContent;
  button.addEventListener('click', () => {
    if (window.OneTrust) {
      window.OneTrust.ToggleInfoDisplay();
    }
  });

  block.textContent = '';
  block.append(button);
}
