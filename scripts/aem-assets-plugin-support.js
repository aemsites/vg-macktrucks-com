import {
  loadBlock,
  createOptimizedPicture,
  decorateExternalImages,
  createOptimizedPictureForDMOpenAPI,
  createOptimizedPictureForDM,
} from '../plugins/aem-assets-plugin/scripts/aem-assets.js';

// The based path of the aem-assets-plugin code.
const codeBasePath = `${window.hlx?.codeBasePath}/plugins/aem-assets-plugin`;

// The blocks that are to be used from the aem-assets-plugin.
const blocks = [];

// Initialize the aem-assets-plugin.
export default async function assetsInit() {
  window.hlx = window.hlx || {};
  window.hlx.aemassets = {
    codeBasePath,
    blocks,
    loadBlock,
    createOptimizedPicture,
    decorateExternalImages,
    createOptimizedPictureForDMOpenAPI,
    createOptimizedPictureForDM,
    smartCrops: {
      Small: { minWidth: 0, maxWidth: 767 },
      Medium: { minWidth: 768, maxWidth: 1023 },
      Large: { minWidth: 1024, maxWidth: 9999 },
    },
    externalImageUrlPrefixes: [['https://publish-p107394-e1241111.adobeaemcloud.com/', createOptimizedPictureForDMOpenAPI]],
  };
}
