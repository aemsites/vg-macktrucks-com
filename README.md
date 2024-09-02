# Mack Trucks
Helix v5 sites for macktrucks.com

## Environments
- Preview: https://main--vg-macktrucks-com--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com--aemsites.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start Franklin Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Best practices using fonts

* We are using [fallback fonts](https://github.com/pixel-point/fontpie) that avoid CLS.
* The fallback fonts are specific to the font family and style (bold, italic etc)
* For this reason, please don't use the font-style properties in css. Instead, use the font family variables defined in `styles/styles.css`
* Eg. for subheadings instead of using `font-weight: 500`, use `font-family: var(--ff-subheadings-medium);`

