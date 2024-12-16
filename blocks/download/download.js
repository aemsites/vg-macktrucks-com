import { createElement } from '../../scripts/common.js';

const buildRegularDownloadBlock = (block) => {
  const children = [...block.children];

  const downloadList = createElement('ul', { classes: 'download-list' });

  children.forEach((e, idx) => {
    const downloadItem = createElement('li', { classes: ['download-item', `download-item-${idx + 1}`] });

    const image = e.querySelector('picture').innerHTML;

    const allTexts = e.querySelectorAll('p');

    const titleElement = allTexts[0].querySelector('a');
    const title = titleElement.getAttribute('title');
    const titleUrl = titleElement.getAttribute('href');

    const textContent = allTexts[1].innerHTML;

    const linkElement = allTexts[2].querySelector('a');
    const linkText = linkElement.getAttribute('title');
    const linkUrl = linkElement.getAttribute('href');

    const fileExtension = linkUrl.split('.').pop();
    const fileRoute = fileExtension === 'xlsm' ? `${window.hlx.codeBasePath}/files/${linkUrl.slice(7)}` : linkUrl;

    downloadItem.innerHTML = `
    <div class='download-card'>
      <div class='download-image'>
        <picture>
          ${image}
        </picture>
      </div>
      <div class='download-texts'>
        <a href='${titleUrl}' class='download-texts-title'>
          ${title}
        </a>
        <p class='download-texts-text'>
          ${textContent}
        </p>
        <a href='${fileRoute}' class='download-texts-link' target='_blank' title='${linkText}'>
          ${linkText}
        </a>
      </div>
    </div>`;
    downloadList.append(downloadItem);
  });
  block.textContent = '';
  block.append(downloadList);
};

const buildNewDownloadBlock = (block) => {
  const children = [...block.children];
  const downloadNewList = createElement('ul', { classes: 'download-new-list' });

  children.forEach((e, idx) => {
    const downloadItem = createElement('li', { classes: ['download-new-item', `download-new-item-${idx + 1}`] });
    const allTexts = e.querySelectorAll('li');
    const linkUrl = e.querySelector('a').getAttribute('href');

    const fileExtension = linkUrl.split('.').pop();
    const fileRoute = fileExtension === 'xlsm' ? `${window.hlx.codeBasePath}/files/${linkUrl.slice(7)}` : linkUrl;

    const newCondition = e.children[1].innerText.toUpperCase();
    const number = allTexts[1].innerText;
    const title = allTexts[2].innerText;
    const subTitle = allTexts[3].innerText;

    downloadItem.innerHTML = `
    <a href="${fileRoute}" target="_blank" class='download-new-link' title='${title}'>
        <div class='download-new-texts'>
          <p>
            ${number}. ${title}
          </p>
          <small>
            ${subTitle}
          </small>
        </div>
    ${
      newCondition.length === 0
        ? ''
        : `<div class='download-new-label'>
      ${newCondition}
    </div>`
    }
    </a>`;
    downloadNewList.append(downloadItem);
  });

  block.textContent = '';
  block.append(downloadNewList);
};

export default function decorate(block) {
  const typeDetector = [...block.classList];

  // This detects what block needs to be render and calls the corresponding function.
  if (!typeDetector.includes('new')) {
    buildRegularDownloadBlock(block);
  } else if (typeDetector.includes('new')) {
    buildNewDownloadBlock(block);
  }
}
