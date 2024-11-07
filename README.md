# Mack Trucks
Helix v5 sites for macktrucks.com

## Environments
- Preview: https://main--vg-macktrucks-com--volvogroup.aem.page/
- Live: https://main--vg-macktrucks-com--volvogroup.aem.live/

### Other markets:

#### macktrucks.bs
- Preview: https://main--macktrucks-bs--volvogroup.aem.page/
- Live: https://main--macktrucks-bs--volvogroup.aem.live/

#### macktrucks.ca
- Preview: https://main--macktrucks-ca--volvogroup.aem.page/
- Live: https://main--macktrucks-ca--volvogroup.aem.live/

#### macktrucks.cl
- Preview: https://main--macktrucks-cl--volvogroup.aem.page/
- Live: https://main--macktrucks-cl--volvogroup.aem.live/

#### macktrucks.co.nz
- Preview: https://main--macktrucks-co-nz--volvogroup.aem.page/
- Live: https://main--macktrucks-co-nz--volvogroup.aem.live/

#### macktrucks.com.ar
- Preview: https://main--macktrucks-com-ar--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ar--volvogroup.aem.live/

#### macktrucks.com.au
- Preview: https://main--macktrucks-com-au--volvogroup.aem.page/
- Live: https://main--macktrucks-com-au--volvogroup.aem.live/

#### macktrucks.com.bo
- Preview: https://main--macktrucks-com-bo--volvogroup.aem.page/
- Live: https://main--macktrucks-com-bo--volvogroup.aem.live/

#### macktrucks.com.co
- Preview: https://main--macktrucks-com-co--volvogroup.aem.page/
- Live: https://main--macktrucks-com-co--volvogroup.aem.live/

#### macktrucks.com.do
- Preview: https://main--macktrucks-com-do--volvogroup.aem.page/
- Live: https://main--macktrucks-com-do--volvogroup.aem.live/

#### macktrucks.com.ec
- Preview: https://main--macktrucks-com-ec--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ec--volvogroup.aem.live/

#### macktrucks.com.emea
- Preview: https://main--macktrucks-com-emea--volvogroup.aem.page/
- Live: https://main--macktrucks-com-emea--volvogroup.aem.live/

#### macktrucksguyana.com
- Preview: https://main--macktrucks-com-gy--volvogroup.aem.page/
- Live: https://main--macktrucks-com-gy--volvogroup.aem.live/

#### macktrucks.com.mx
- Preview: https://main--macktrucks-com-mx--volvogroup.aem.page/
- Live: https://main--macktrucks-com-mx--volvogroup.aem.live/

#### macktrucks.com.museum
- Preview: https://main--macktrucks-com-museum--volvogroup.aem.page/
- Live: https://main--macktrucks-com-museum--volvogroup.aem.live/

#### macktrucks.com.ng
- Preview: https://main--macktrucks-com-ng--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ng--volvogroup.aem.live/

#### macktrucks.com.ni
- Preview: https://main--macktrucks-com-ni--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ni--volvogroup.aem.live/

#### macktrucks.com.pa
- Preview: https://main--macktrucks-com-pa--volvogroup.aem.page/
- Live: https://main--macktrucks-com-pa--volvogroup.aem.live/

#### macktrucks.com.pe
- Preview: https://main--macktrucks-com-pe--volvogroup.aem.page/
- Live: https://main--macktrucks-com-pe--volvogroup.aem.live/

#### macktrucks.com.ve
- Preview: https://main--macktrucks-com-ve--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ve--volvogroup.aem.live/

#### macktrucks.cr
- Preview: https://main--macktrucks-cr--volvogroup.aem.page/
- Live: https://main--macktrucks-cr--volvogroup.aem.live/

#### macktrucks.gt
- Preview: https://main--macktrucks-gt--volvogroup.aem.page/
- Live: https://main--macktrucks-gt--volvogroup.aem.live/

#### macktrucks.hn
- Preview: https://main--macktrucks-hn--volvogroup.aem.page/
- Live: https://main--macktrucks-hn--volvogroup.aem.live/

#### macktrucks.ht
- Preview: https://main--macktrucks-ht--volvogroup.aem.page/
- Live: https://main--macktrucks-ht--volvogroup.aem.live/

#### macktrucks.sv
- Preview: https://main--macktrucks-sv--volvogroup.aem.page/
- Live: https://main--macktrucks-sv--volvogroup.aem.live/

#### macktrucks.tt
- Preview: https://main--macktrucks-tt--volvogroup.aem.page/
- Live: https://main--macktrucks-tt--volvogroup.aem.live/

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

