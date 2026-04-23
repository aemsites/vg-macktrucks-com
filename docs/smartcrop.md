# Smart Crop Asset Block

## Feature Overview: 

In the standard image transformation from `<a>` tags to `<picture>` tags in EDS, as outlined in [external sources](https://github.com/hlxsites/franklin-assets-selector/blob/ext-images/EXTERNAL_IMAGES.md), smart crop assets from DM with OpenAPI were not considered. This resulted in all assets retaining their original image content, thus losing the point of focus when viewed especially on smaller devices. This newly added functionality addresses this gap by rendering the appropriate smart crop image that matches the viewport the window is rendered upon.

## Advantages: 

This functionality enables content authors to embed smart crop assets directly into their EDS pages. It enhances user interaction on smaller screens by maintaining the focus point of the image, ensuring a consistently engaging viewing experience.

## Functionality: 

This block reduces overhead by rendering the appropriate smart crop asset variation based on the viewport dimensions. This ensures that the image displayed is optimized for the device, maintaining focus and enhancing the user experience.

## Usages

The Image Smart crop usecase is defined in such a way that it can be very well integrated at any level including site, page, block or section level. All user need to define is to add required cooresponding meta tag or classname or section metadata with key as `smartcrop` with value as `true`.

## Knowledge Base

### Where I need to define the available smart crops?

For the project to be aware of all available smart crops, users need to make sure that `window.hlx.aemassets.smartCrops` is initialised with target smartcrop presets available options. 
```
window.hlx.aemassets.smartCrops = {
    "Small": { minWidth: 0, maxWidth: 767 },
    "Medium": { minWidth: 768, maxWidth: 1023 },
    "Large": { minWidth: 1024, maxWidth: 9999 }
  };
```

### What if any of the smart crops not availble with server?

In that case, the image will appear as a broken link.

### Are the smart crop name case-sensitive?

Yes, the smart crop name is case-sensitive and must match exactly. For example, a smart crop with the name Large must be requested with `?smartcrop=Large`. Using `?smartcrop=LARGE` or `?smartcrop=large` will result in an error.

### How do I generate smart crop for any Asset

Users can create an Image Profile in the AEM author environment with the desired smart crops and ingest the asset. Once processed and approved, the asset becomes available in the Asset Selector to be copied into the target document.

### Why the copied asset from Asset Selector not showing any smart crops by default?

Currently, it's not possible to get the smart crop references directly from the asset picker. Users need to obtain the base URL for any target asset. To get the smart crop variation, they must manually update the smart crop config file to match the presets defined in the Image Profile within the AEM author environment.

### How to define smartcrop rendering at Domain / website level?

Use the [bulkmetadata](https://www.aem.live/docs/bulk-metadata) and set below for all paths.
```
key = "smartcrop" , value ="true"
```

### How to define smartcrop rendering at webpage level?

In content authoring, add page metadata with key as `smartcrop` and value as `true`

### How to define smartcrop rendering at Block level?

Add the block modifier `smartcrop` to the block while content authoring. For e.g. `cards(smartcrop)`

### How to define smartcrop rendering at section level?

In content authoring, add section metadata with key as `smartcrop` and value as `true`.