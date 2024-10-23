/* eslint-disable no-unused-expressions */
/* global describe before it afterEach */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

let commonScript;
// eslint-disable-next-line no-unused-vars
let lib;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('createElement', () => {
  let createElement;

  before(async () => {
    commonScript = await import('../../scripts/common.js');
    lib = await import('../../scripts/aem.js');

    createElement = commonScript.createElement;

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('should create an element with specified tag name', () => {
    const elem = createElement('span');
    expect(elem.tagName).to.equal('SPAN');
  });

  it('should add classes to the created element', () => {
    const elem = createElement('div', { classes: ['class1', 'class2'] });
    expect(elem.classList.contains('class1')).to.be.true;
    expect(elem.classList.contains('class2')).to.be.true;
  });

  it('should not add classes if classes option is not provided', () => {
    const elem = createElement('div');
    expect(elem.classList.length).to.equal(0);
  });

  it('should remove class attribute if classes array is empty', () => {
    const elem = createElement('p', { classes: [] });
    expect(elem.getAttribute('class')).to.be.null;
  });

  it('should set attributes on the created element', () => {
    const elem = createElement('a', { props: { href: 'https://example.com', target: '_blank' } });
    expect(elem.getAttribute('href')).to.equal('https://example.com');
    expect(elem.getAttribute('target')).to.equal('_blank');
  });

  it('should handle empty props object', () => {
    const elem = createElement('span', { props: {} });
    expect(elem.hasAttributes()).to.be.false;
  });

  it('should handle boolean attribute values', () => {
    const elem = createElement('input', { props: { checked: true } });
    expect(Boolean(elem.getAttribute('checked'))).to.be.true;
  });

  it('should handle both string and array of classes', () => {
    const elem = createElement('div', { classes: 'class-string' });
    expect(elem.classList.contains('class-string')).to.be.true;
  });
});

describe('addFavIcon', () => {
  afterEach(() => {
    // Clear the head after each test
    document.head.innerHTML = '';
  });

  it('should add a new favicon link to the head', () => {
    const newFavIconHref = 'new-favicon.svg';
    commonScript.addFavIcon(newFavIconHref);

    const link = document.querySelector('head link[rel="icon"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(newFavIconHref);
  });

  it('should replace existing favicon link with a new one', () => {
    const existingFavIconHref = 'existing-favicon.ico';
    const newFavIconHref = 'new-favicon.svg';

    const existingLink = commonScript.createElement('link', {
      props: { rel: 'icon', type: 'image/x-icon', href: existingFavIconHref },
    });
    document.head.appendChild(existingLink);

    commonScript.addFavIcon(newFavIconHref);

    const link = document.querySelector('head link[rel="icon"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(newFavIconHref);
  });
});

describe('slugify', () => {
  before(async () => {
    commonScript = await import('../../scripts/common.js');
  });

  it('should trim spaces', () => {
    const result = commonScript.slugify(' Cards   ');
    expect(result).to.equal('cards');
  });

  it('should convert uppercase to lowercase', () => {
    const result = commonScript.slugify('Cards');
    expect(result).to.equal('cards');
  });

  it('should convert spaces in hyphen', () => {
    const result = commonScript.slugify('Cards 1');
    expect(result).to.equal('cards-1');
  });

  it('should convert double hyphen in single hyphen', () => {
    const result = commonScript.slugify('Cards--1');
    expect(result).to.equal('cards-1');
  });

  it('should convert accents to characters', () => {
    const result = commonScript.slugify('Cárüñs');
    expect(result).to.equal('caruns');
  });

  it('should remove special characters', () => {
    const result = commonScript.slugify('传');
    expect(result).to.equal('');
  });
});

describe('checkOneTrustGroup', () => {
  it('should return true when the group is present with value 1', () => {
    // Simulate a cookie with the group 'group1' set to 1
    document.cookie = 'OptanonConsent=C0001:1;';

    const result = commonScript.checkOneTrustGroup('C0001');
    expect(result).to.be.true;
  });

  it('should return false when the group is present with a value other than 1', () => {
    // Simulate a cookie with the group 'group2' set to 0 (or any value other than 1)
    document.cookie = 'OptanonConsent=C0002:0;';

    const result = commonScript.checkOneTrustGroup('C0002');
    expect(result).to.be.false;
  });

  it('should return false when the group is not present in the cookie', () => {
    // Simulate an empty cookie
    document.cookie = '';

    const result = commonScript.checkOneTrustGroup('group3');
    expect(result).to.be.false;
  });

  it('should handle URL encoding of the group name', () => {
    // Simulate a cookie with a URL-encoded group name
    document.cookie = 'OptanonConsent=groupC0004:1;';

    const result = commonScript.checkOneTrustGroup('C0004');
    expect(result).to.be.true;
  });
});

describe('deepMerge', () => {
  let deepMerge;

  before(async () => {
    commonScript = await import('../../scripts/common.js');
    deepMerge = commonScript.deepMerge;
  });

  it('should merge two flat objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);
    expect(result).to.deep.equal({ a: 1, b: 3, c: 4 });
  });

  it('should deeply merge nested objects', () => {
    const target = { a: { x: 1 }, b: 2 };
    const source = { a: { y: 2 }, b: 3 };
    const result = deepMerge(target, source);
    expect(result).to.deep.equal({ a: { x: 1, y: 2 }, b: 3 });
  });

  it('should not merge arrays, but replace them', () => {
    const target = { a: [1, 2], b: 2 };
    const source = { a: [3, 4], b: 3 };
    const result = deepMerge(target, source);
    // Assuming the behavior is to replace arrays, not to merge them
    expect(result).to.deep.equal({ a: [3, 4], b: 3 });
  });

  it('should handle undefined and null values correctly', () => {
    const target = { a: undefined, b: null };
    const source = { a: 1, b: 2 };
    const result = deepMerge(target, source);
    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it('should not modify the source object', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    deepMerge(target, source);
    expect(source).to.deep.equal({ b: 2 });
  });

  it('should handle the target being undefined or null', () => {
    const source = { a: 1 };
    const resultWithUndefinedTarget = deepMerge(undefined, source);
    const resultWithNullTarget = deepMerge(null, source);
    // Assuming the behavior for undefined/null targets is to return a copy of the source
    expect(resultWithUndefinedTarget).to.deep.equal({ a: 1 });
    expect(resultWithNullTarget).to.deep.equal({ a: 1 });
  });

  it('should merge objects with different key sets', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    const result = deepMerge(target, source);
    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it('should directly assign arrays without merging them', () => {
    const target = { array: [1, 2] };
    const source = { array: [3, 4] };
    const result = deepMerge(target, source);
    expect(result.array).to.deep.equal([3, 4]);
  });

  it('should create a new object if the target is undefined', () => {
    const source = { a: 1 };
    const result = deepMerge(undefined, source);
    expect(result).to.deep.equal({ a: 1 });
  });

  it('should create a new object if the target is null', () => {
    const source = { a: 1 };
    const result = deepMerge(null, source);
    expect(result).to.deep.equal({ a: 1 });
  });

  it('should handle source properties that are not objects', () => {
    const target = { a: { x: 1 } };
    const source = { a: null, b: 3 };
    const result = deepMerge(target, source);
    expect(result).to.deep.equal({ a: null, b: 3 });
  });

  it('should directly assign non-plain object types like Date', () => {
    const target = { date: new Date('2020-01-01') };
    const source = { date: new Date('2021-01-01') };
    const result = deepMerge(target, source);
    expect(result.date).to.deep.equal(new Date('2021-01-01'));
  });
});
