# skrib

A customizable markdown editor for the browser.

Built using:

- React
- CodeMirror
- Marked

## Getting started locally

First install dependencies via:

```bash
npm ci
```

Then start the local dev server with:

```bash
npm run dev
```

And wallah! Navigate to http://localhost:5173 to see the application.

## Create a production build

To create a production build ensure dependencies are installed as noted above. Then simply run:

```bash
npm run build
```

After this, the static asset composing the site should be stored in the `./dist` folder. To host them quickly use:

```bash
npm run preview
```

And then navigate to http://localhost:4173.

## Deployment

Deployment is handled automagically via Vercel. See `vercel.json` for configuration details within Vercel.

## Other useful stuff

Below are some other useful scripts for development:

- `npm run analyze`: Run the vite bundle analyzer and launch the webpage with the results
- `npm run generate-assets`: Generates assets for PWA using `pwa-assets-generator`
- `npm run lint`: Lint source code via `eslint`

## Useful documentation

Links to documentation of the various technologies that make this possible:

- CodeMirror: https://codemirror.net/
- FileSystem Web API: https://developer.mozilla.org/en-US/docs/Web/API/FileSystem
- Marked: https://github.com/markedjs/marked
- Vercel Project Config: https://vercel.com/docs/projects/project-configuration
