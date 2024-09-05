# Mack Trucks
Helix v5 sites for macktrucks.com

## Environments
- Preview: https://main--vg-macktrucks-com--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com--aemsites.hlx.live/

### Other markets:

#### macktrucks.bs
- Preview: https://main--vg-macktrucks-bs--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-bs--aemsites.hlx.live/

#### macktrucks.cl
- Preview: https://main--vg-macktrucks-cl--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-cl--aemsites.hlx.live/

#### macktrucks.com.ar
- Preview: https://main--vg-macktrucks-com-ar--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-ar--aemsites.hlx.live/

#### macktrucks.com.au
- Preview: https://main--vg-macktrucks-com-au--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-au--aemsites.hlx.live/

#### macktrucks.com.bo
- Preview: https://main--vg-macktrucks-com-bo--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-bo--aemsites.hlx.live/

#### macktrucks.com.co
- Preview: https://main--vg-macktrucks-com-co--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-co--aemsites.hlx.live/

#### macktrucks.com.do
- Preview: https://main--vg-macktrucks-com-do--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-do--aemsites.hlx.live/

#### macktrucks.com.ec
- Preview: https://main--vg-macktrucks-com-ec--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-ec--aemsites.hlx.live/

#### macktrucks.com.emea
- Preview: https://main--vg-macktrucks-com-emea--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-emea--aemsites.hlx.live/

#### macktrucks.com.gy
- Preview: https://main--vg-macktrucks-com-gy--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-gy--aemsites.hlx.live/

#### macktrucks.com.mx
- Preview: https://main--vg-macktrucks-com-mx--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-mx--aemsites.hlx.live/

#### macktrucks.com.museum
- Preview: https://main--vg-macktrucks-com-museum--aemsites.hlxge/
- Live: https://main--vg-macktrucks-com-museum--aemsites.hlx.live/

#### macktrucks.com.ng
- Preview: https://main--vg-macktrucks-com-ng--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-ng--aemsites.hlx.live/

#### macktrucks.com.ni
- Preview: https://main--vg-macktrucks-com-ni--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-ni--aemsites.hlx.live/

#### macktrucks.com.pa
- Preview: https://main--vg-macktrucks-com-pa--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-pa--aemsites.hlx.live/

#### macktrucks.com.pe
- Preview: https://main--vg-macktrucks-com-pe--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-pe--aemsites.hlx.live/

#### macktrucks.com.ve
- Preview: https://main--vg-macktrucks-com-ve--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-com-ve--aemsites.hlx.live/

#### macktrucks.cr
- Preview: https://main--vg-macktrucks-cr--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-cr--aemsites.hlx.live/

#### macktrucks.gt
- Preview: https://main--vg-macktrucks-gt--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-gt--aemsites.hlx.live/

#### macktrucks.hn
- Preview: https://main--vg-macktrucks-hn--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-hn--aemsites.hlx.live/

#### macktrucks.ht
- Preview: https://main--vg-macktrucks-ht--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-ht--aemsites.hlx.live/

#### macktrucks.sv
- Preview: https://main--vg-macktrucks-sv--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-sv--aemsites.hlx.live/

#### macktrucks.tt
- Preview: https://main--vg-macktrucks-tt--aemsites.hlx.page/
- Live: https://main--vg-macktrucks-tt--aemsites.hlx.live/

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

