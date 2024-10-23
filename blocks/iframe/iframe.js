import { createElement } from '../../scripts/common.js';

export default async function decorate(block) {
  const link = block.querySelector('a')?.getAttribute('href');
  const iframe = createElement('iframe', {
    props: { frameborder: 0, src: link },
  });
  const fixedHeightClass = [...block.classList].find((el) => /[0-9]+px/.test(el));
  const maxWidthClass = [...block.classList].find((el) => /width-[0-9]+px/.test(el));

  if (fixedHeightClass) {
    iframe.height = fixedHeightClass;
  }
  if (maxWidthClass) {
    const maxWidth = maxWidthClass.split('width-')[1];
    iframe.style.maxWidth = maxWidth;
  }
  block.replaceChildren(iframe);
}
