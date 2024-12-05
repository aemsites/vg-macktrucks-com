import { variantsClassesToBEM } from '../../scripts/common.js';

const blockName = 'v2-resources';
const variantClasses = ['magazine'];

export default async function decorate(block) {
  variantsClassesToBEM(block.classList, variantClasses, blockName);
  const isMagazineVariant = block.classList.contains(`${blockName}--magazine`);

  if (isMagazineVariant) {
    block.parentElement.parentElement.classList.add(`${blockName}-wrapper__magazine`);
  }

  const contentWrapper = block.querySelector(':scope > div');
  contentWrapper.classList.add(`${blockName}__content-wrapper`);

  const columns = [...block.querySelectorAll(':scope > div > div')];

  const [headerCol, contentCol] = columns;

  headerCol.classList.add(`${blockName}__header`);
  contentCol.classList.add(`${blockName}__content`);

  const header = [...headerCol.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  header[0].classList.add(`${blockName}__heading`);

  const subtitles = [...contentCol.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  subtitles.forEach((subt) => subt.classList.add(`${blockName}__subtitle`));

  [...contentCol.children].forEach((el) => {
    const link = el.querySelector('a');
    const buttonClasses = isMagazineVariant ? ['button', 'button--primary', 'button--large'] : ['standalone-link'];
    link?.classList.add(...buttonClasses);
  });
}
