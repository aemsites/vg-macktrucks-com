import { createElement } from '../../scripts/common.js';
import {
  feedsInfo, getBodyBuilderNews, getMackNews, PagingInfo,
} from '../../scripts/news.js';
import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);

  const type = window.location.pathname.startsWith('/parts-and-services/support/body-builders')
    ? 'body-builder-news'
    : 'mack-news';

  const filter = config.filter || '';
  block.textContent = '';

  // eslint-disable-next-line function-call-argument-newline,function-paren-newline
  const rssLink = createElement('a', {
    classes: ['title-with-icon'],
    props: { href: feedsInfo[type].feedPath, target: '_blank' },
  });
  rssLink.textContent = 'News RSS';
  block.append(rssLink);

  const pagingInfo = new PagingInfo();
  const posts = type === 'body-builder-news'
    ? await getBodyBuilderNews(pagingInfo)
    : await getMackNews(window.location.pathname, pagingInfo, filter);

  const list = createElement('ul', { classes: ['news-sidebar-list'] });
  list.append(...posts.map((post) => {
    const articleLink = createElement('a', { props: { href: post.path } });

    const heading = createElement('h3');
    heading.textContent = (post.title && post.title !== '0') ? post.title : '';
    articleLink.append(heading);

    const summary = createElement('p');
    summary.textContent = post.summary;
    articleLink.append(summary);

    const li = createElement('li');
    li.append(articleLink);
    return li;
  }));
  block.append(list);
}
