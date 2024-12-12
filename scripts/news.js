import { getMetadata } from './aem.js';

export const feedsInfo = {
  'mack-news': {
    feedPath: '/mack-news/feed.xml',
    jsonSource: '/mack-news/feed.json',
  },
  'body-builder-news': {
    feedPath: '/parts-and-services/support/body-builders/news-and-events/feed.xml',
    jsonSource: '/body-builder-news.json',
  },
};

/**
 * @typedef {Object} NewsPost
 * @property {string} path
 * @property {string} title
 * @property {string} summary
 * @property {string} template
 * @property {string} publicationDate
 */

/**
 * This method can be called multiple times with the same parameters as the pagingInfo is
 * automatically updated to track the offset.
 *
 * @param pagingInfo {PagingInfo}  paging metadata
 * @returns {Promise<NewsPost[]>}
 */
export async function getBodyBuilderNews(pagingInfo) {
  const allPosts = await fetchJsonFeed(feedsInfo['body-builder-news'].jsonSource, pagingInfo);
  allPosts.sort(sortNewsByDate);

  if (pagingInfo.pageSize > 0) {
    return allPosts.slice(0, pagingInfo.pageSize);
  }
  return allPosts;
}

/**
 * Get the list of news posts from the index. This method can be called multiple times with the
 * same parameters as the pagingInfo is automatically updated to track the offset.
 *
 * News are auto-filtered based on page context e.g tags, etc. and sorted by date.
 *
 * @param path {string}  the path of the current page, used to filter by year
 * @param pagingInfo {PagingInfo}  paging metadata
 * @param filter "auto"|"topic"|"subtopic"|"author"|"tag"|"post"|"auto"|"none"} filter to apply.
 * @returns {Promise<NewsPost[]>}
 */
export async function getMackNews(path, pagingInfo, filter = 'none') {
  const allPosts = await fetchJsonFeed(feedsInfo['mack-news'].jsonSource, pagingInfo);
  let filteredPosts = allPosts.filter((page) => page.template === 'mack-news');
  filteredPosts.sort(sortNewsByDate);

  const year = path ? extractYearFromPath(path) : null;
  if (year) {
    filteredPosts = filterNewsByDate(filteredPosts, year);
  }

  // TODO: filter by topic, subtopic, author, tag, post
  let applicableFilter = filter ? filter.toLowerCase() : 'none';
  if (applicableFilter === 'auto') {
    if (getMetadata('template') === 'mack-news') {
      applicableFilter = 'mack-news';
    } else {
      applicableFilter = 'none';
    }
  }

  if (pagingInfo.pageSize > 0) {
    return filteredPosts.slice(0, pagingInfo.pageSize);
  }
  return filteredPosts;
}

/**
 * Stores the paging metadata so that additional pages can be fetched.
 * @type {PagingInfo}
 * @property {number} offset  the offset of the next page to fetch
 * @property {boolean} allLoaded  true if all pages have been fetched
 * @property {number} pageSize  the number of items to return per page. -1 means all.
 */
export class PagingInfo {
  constructor() {
    this.offset = 0;
    this.allLoaded = false;
    this.pageSize = -1;
  }
}

/**
 * loads more data from the query index
 * @param jsonFeedPath {string}  path to the json feed to fetch
 * @param {PagingInfo} pagingInfo
 * @returns {Promise<NewsPost[]>}
 */
async function fetchJsonFeed(jsonFeedPath, pagingInfo) {
  if (!pagingInfo.allLoaded) {
    const queryLimit = 600;
    const resp = await fetch(`${jsonFeedPath}?limit=${queryLimit}&offset=${pagingInfo.offset}`);
    const json = await resp.json();
    const { total, data } = json;
    window.mack.newsData.news.push();
    pagingInfo.allLoaded = total <= (window.mack.newsData.offset + queryLimit);
    pagingInfo.offset += queryLimit;
    return data;
  }

  return [];
}

/**
 * A function for sorting an array of posts by date
 */
function sortNewsByDate(newsA, newsB) {
  const aDate = Number(newsA.publicationDate || newsA.lastModified);
  const bDate = Number(newsB.publicationDate || newsB.lastModified);
  return bDate - aDate;
}

/**
 * A function for filter news results by date
 */
function filterNewsByDate(posts, year) {
  return posts.filter((post) => {
    const resultYear = new Date(post.publicationDate * 1000).getFullYear();
    return resultYear === year;
  });
}

/**
 * A function for extract year from url pathname
 */
function extractYearFromPath(path) {
  const yearRegex = /\/(\d{4})\//;
  const matches = path.match(yearRegex);

  if (matches && matches.length >= 2) {
    return parseInt(matches[1], 10);
  }

  return null;
}
