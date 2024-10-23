import { createElement } from '../../scripts/common.js';

export default function decorate(block) {
  const breadcrumbItems = createElement('ul', { classes: 'breadcrumb-list' });

  const articleUrl = (window.location.href).split('/').pop();
  const articleName = articleUrl.replaceAll('-', ' ').toLowerCase();
  const homeUrl = `${window.location.origin}/magazine/`;

  breadcrumbItems.innerHTML = `
    <li class="breadcrumb breadcrumb-home">
      <a href='${homeUrl}'>
        Home
      </a>
    </li>
    <li class="breadcrumb breadcrumb-current">
      ${articleName}
    </li>`;

  block.textContent = '';
  block.append(breadcrumbItems);
}
