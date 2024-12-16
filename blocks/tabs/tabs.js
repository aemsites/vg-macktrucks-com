export default function decorate(block) {
  const tabsItems = block.querySelectorAll(':scope > div');
  // makes the 1st tab by default as the active one...
  tabsItems.forEach((el, i) => {
    el.className = i > 0 ? `tabs-tab-item${i === 1 ? ' active' : ''}` : 'tabs-tab-titles';
  });
  const tabTitles = block.querySelector('.tabs-tab-titles ul');
  const items = block.querySelectorAll('.tabs-tab-item');
  // ... also for the 1st tab-title
  const defaultActive = tabTitles.firstElementChild;
  defaultActive.className = 'active';
  // make tab-titles focusable
  [...tabTitles.children].forEach((li) => {
    li.tabIndex = 0;
  });
  // add picture & text wrappers a css class
  [...items].forEach((item) => {
    const picture = item.querySelector('picture');
    const p = item.querySelector('p');
    picture.parentElement.className = 'tab-picture-wrapper';
    p.parentElement.className = 'tab-text-wrapper';
  });

  const setActiveTab = (e) => {
    if (e.target.localName !== 'li') {
      return;
    }
    const { parentElement } = e.target;
    const idx = [...parentElement.children].indexOf(e.target);
    [...parentElement.children].forEach((li, i) => {
      li.className = '';
      items[i].classList.remove('active');
    });
    e.target.className = 'active';
    items[idx].classList.add('active');
  };

  tabTitles.onclick = (e) => setActiveTab(e);
  tabTitles.onkeydown = (e) => {
    if (e.key === 'Enter') {
      setActiveTab(e);
    }
  };
}
