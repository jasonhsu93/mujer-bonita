# Mujer Bonita

A Spanish-language, responsive fashion landing page inspired by the editorial presentation of Zara Canada, using Mujer Bonita's existing campaign images and a soft pink brand palette inspired by its Instagram profile.

Run `npm run dev` and open http://localhost:3000. Requires Node.js 22 or later; no package installation is needed. Set `PORT` to use another port.

The page includes a campaign carousel, collection filters, search, and favorites saved in the browser. Collection and contact links lead to the existing Mujer Bonita store and social accounts. Featured looks are editorial selections, not a live product or inventory feed. Fonts load from Google Fonts with local system fallbacks.

Run `npm run check` for JavaScript syntax checks. Original image files remain in `assets/mujerbonita`.

## GitHub Pages

Live site: https://jasonhsu93.github.io/mujer-bonita/

Pushes to `main` automatically build and deploy the site using `.github/workflows/pages.yml`. GitHub Pages uses GitHub Actions as its publishing source. You can also run the workflow manually from the Actions tab.

`npm run build` produces the static site in `dist/`, containing only HTML, CSS, JavaScript, and image assets. No server is required in production. All asset URLs are relative so the site works under the repository's `/mujer-bonita/` path.
