# Mack Trucks
Helix v5 sites for macktrucks.com

## Environments
- Preview: https://main--vg-macktrucks-com--volvogroup.aem.page/
- Live: https://main--vg-macktrucks-com--volvogroup.aem.live/

### Other markets:

#### bahamas.macktrucks.com
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

#### macktrucksemea.com
- Preview: https://main--macktrucks-com-emea--volvogroup.aem.page/
- Live: https://main--macktrucks-com-emea--volvogroup.aem.live/

#### macktrucksguyana.com
- Preview: https://main--macktrucks-com-gy--volvogroup.aem.page/
- Live: https://main--macktrucks-com-gy--volvogroup.aem.live/

#### macktrucks.com.mx
- Preview: https://main--macktrucks-com-mx--volvogroup.aem.page/
- Live: https://main--macktrucks-com-mx--volvogroup.aem.live/

#### https://www.macktruckshistoricalmuseum.org
- Preview: https://main--macktrucks-com-museum--volvogroup.aem.page/
- Live: https://main--macktrucks-com-museum--volvogroup.aem.live/

#### macktrucksnigeria.com
- Preview: https://main--macktrucks-com-ng--volvogroup.aem.page/
- Live: https://main--macktrucks-com-ng--volvogroup.aem.live/

#### macktrucksnicaragua.com
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

#### sv.macktrucks.com
- Preview: https://main--macktrucks-sv--volvogroup.aem.page/
- Live: https://main--macktrucks-sv--volvogroup.aem.live/

#### tt.macktrucks.com
- Preview: https://main--macktrucks-tt--volvogroup.aem.page/
- Live: https://main--macktrucks-tt--volvogroup.aem.live/


## Local Development

1. Install the [Helix CLI](https://github.com/adobe/aem-cli): `npm install -g @adobe/aem-cli` and install dev dependencies:

```sh
npm ci
```

2. Start the local development environment with a single command:

```sh
npm start
```

This runs the AEM proxy `aem up` and the build `npm run watch` in parallel (via `npm-run-all`), so you get automatic rebuilds and the AEM proxy in one step.

3. If you prefer the old workflow, you can still run the commands separately:

- `aem up` — start the AEM proxy
- `npm run watch` — start the incremental build with sourcemaps

4. Open the `{repo}` directory in your favorite IDE and start coding :)


## Volvo Design System Setup

1. Configure your local environment to be able to install the Volvo Design System packages. Follow the guide [here](https://developer.designsystem.volvogroup.com/?path=/docs/web-getting-started-installation--docs).
2. Configure your PAT token and email in your user-level `.npmrc` (e.g., `~/.npmrc`), not in the project directory, to avoid authentication issues.
Refer to the [official documentation](https://developer.designsystem.volvogroup.com/?path=/docs/web-discover-more-authentication-azure-devops--docs) for details (2.1 Authentication).

To follow the “Copy the token and base64 encode the string” step from the instructions, you can generate the base64-encoded PAT like this:
```sh
echo -n YOUR_PAT_HERE | base64
```
Use the resulting string as the value for the `_password` field in your `.npmrc`.


## Debugging Production Code Using Local Sourcemaps

Production builds do not include sourcemaps.

To debug a production issue:
1. Check out the exact commit currently deployed to production (usually the latest commit on main, or a specific commit SHA if needed).
2. Build locally (sourcemaps enabled):
```sh
npm run build:dev
```
3. Open the production page in your browser and access its developer tools, then navigate to the panel where source files are displayed (e.g. Sources).
4. Add your local `dist/` folder to the workspace / file system mapping (name varies by browser).

You can then use your local sourcemaps to inspect and debug the original source code behind the minified production files. Depending on the browser, the mapping may happen automatically or may require a manual file-to-file association within the developer tools.

