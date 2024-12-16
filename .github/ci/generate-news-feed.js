import { Feed } from 'feed';
import path from 'path';
import fs from 'fs';

/**
 * @typedef {Object} FeedConfig
 * @property {string} DOMAIN
 * @property {string} LANGUAGE
 * @property {string} SOURCE_ENDPOINT
 * @property {string} TARGET_FILE
 * @property {string} FEED_TITLE
 * @property {string} FEED_SITE_ROOT
 * @property {string} FEED_LINK
 * @property {string} FEED_DESCRIPTION
 */

/**
 * @typedef {Object} Post
 * @property {string} title
 * @property {string} summary
 * @property {string} path
 * @property {string} publicationDate
 * @property {string} template
 */

const CONSTANTS_FILE_URL = 'https://www.macktrucks.com/constants.json';

/**
 * @return {Promise<FeedConfig[]>}
 */
async function getConstantValues() {
  let constants = {};

  try {
    const response = await fetch(CONSTANTS_FILE_URL);

    if (response.ok) {
      const responseData = await response.json();

      constants = responseData;
    } else {
      console.error('Error fetching constants file', response.statusText);
    }
  } catch (error) {
    console.error('Error with constants file', error);
  }

  return constants;
}

/**
 * @return {Promise<FeedConfig[]>}
 */
async function getFeedConfig() {
  const { newsFeedConfig } = await getConstantValues();

  return newsFeedConfig?.data || [];
}

/**
 * @return {Promise<void>}
 */
async function createFeed() {
  const feedsConfigurations = await getFeedConfig();

  if (!feedsConfigurations) {
    console.error('No feed configurations found');
    return;
  }

  for (const feedConfig of feedsConfigurations) {
    const { LANGUAGE, SOURCE_ENDPOINT, TARGET_FILE, FEED_TITLE, FEED_SITE_ROOT, FEED_LINK, FEED_DESCRIPTION, LIMIT } = feedConfig;

    const PARSED_LIMIT = Number(LIMIT);

    const allPosts = await fetchBlogPosts(SOURCE_ENDPOINT, PARSED_LIMIT);

    console.log(`Generating feed "${FEED_TITLE}" - "${FEED_LINK}"`);
    console.log(`Found ${allPosts.length} posts`);

    const newestPost = allPosts
      .map((post) => new Date(post.publicationDate * 1000))
      .reduce((maxDate, date) => (date > maxDate ? date : maxDate), new Date(0));

    const feed = new Feed({
      title: FEED_TITLE,
      description: FEED_DESCRIPTION,
      id: FEED_LINK,
      link: FEED_LINK,
      updated: newestPost,
      generator: `${FEED_TITLE} - Feed Generator`,
      language: LANGUAGE,
    });

    allPosts.forEach((post) => {
      const link = FEED_SITE_ROOT + post.path;
      const date = post.date || post.publicationDate;
      const dateFormatted = new Date(date * 1000);

      feed.addItem({
        title: post.title,
        id: link,
        link,
        content: post.summary,
        date: dateFormatted,
        published: dateFormatted,
      });
    });

    const dir = path.parse(TARGET_FILE).dir;

    if (!fs.existsSync(dir)) {
      console.log('Folder does not exist: ', dir);
      console.log('Creating folder: ', dir);

      fs.mkdirSync(dir);
    }

    fs.writeFileSync(TARGET_FILE, feed.atom1());

    console.log('Wrote file to: ', TARGET_FILE);
    console.log('-----------------------------------');
  }
}

/**
 * @param {string} endpoint
 * @param {number} limit
 * @return {Promise<Post[]>}
 */
async function fetchBlogPosts(endpoint, limit) {
  let offset = 0;
  const allPosts = [];

  while (true) {
    let result;
    const apiUrl = new URL(endpoint);

    apiUrl.searchParams.append('offset', JSON.stringify(offset));
    apiUrl.searchParams.append('limit', limit);

    try {
      const response = await fetch(apiUrl);

      if (response.ok) {
        result = await response.json();
      } else {
        console.error('Error fetching blog posts', response.statusText);
      }
    } catch (error) {
      console.error('Error with constants file', error);
    }

    if (!result) {
      break;
    }

    if (result?.data) {
      allPosts.push(...result.data);
    }

    if (result.offset + result.limit < result.total) {
      // there are more pages
      offset = result.offset + result.limit;
    } else {
      break;
    }
  }
  return allPosts;
}

createFeed().catch((e) => console.error(e));
