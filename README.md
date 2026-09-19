# RemonYounan.github.io

Portfolio site for Remon Younan. Plain HTML, CSS and JavaScript — no framework
and no dependencies.

The repository is named after the hostname because that is what GitHub requires
of a user site: only a repository called `<username>.github.io` is served from
the root of `remonyounan.github.io`. Any other name would put the site in a
subdirectory.

## Layout

```
public/            Everything that gets deployed
  index.html       Home
  projects.html    Project index
  project.html     Project detail (reads ?p= from the query string)
  config.js        All site content — copy, projects, testimonials, links
  styles/          CSS
  js/              JavaScript
  assets/img/      Generated WebP the site loads (committed, see below)
  assets/brand/    Favicons and the social preview card (generated, committed)
  robots.txt       Search directives (generated)
  sitemap.xml      Search index, one entry per case study (generated)
```

That is the whole repository: the published site and nothing else. Editing the
site's text means editing `public/config.js`. The markup rarely needs to
change.

## Generated files

Several of the committed files are build output rather than hand-written
source. The generators are deliberately **not** in this repository — they are
large, they need the full-resolution screenshot masters, and none of it is ever
served. They live alongside the repository in the authoring workspace, and
`.gitignore` already has entries for `tools/` and `assets-src/` so a local copy
of either can sit here without being staged.

| Committed | Built from | By |
| --- | --- | --- |
| `public/assets/img/` | screenshot masters | `tools/images/build.py` |
| `public/assets/brand/` | the site's own colour and type tokens | `tools/brand/` |
| `robots.txt`, `sitemap.xml` | the project list in `config.js` | `tools/seo/build.py` |

There is no build step at deploy time, so whatever is committed is exactly what
ships. Anything regenerated has to be committed with the change that caused it.

### Images

`config.js` refers to images as `assets/projects/<name>.<ext>`. That string is
a logical id, not a path on the server: `imgSrc`/`imgSrcset` in `js/main.js`
turn it into a real derivative URL, at 800px and 1600px. Adding or replacing a
screenshot therefore means re-running the image build and committing the new
WebP files, not just dropping a file in.

### Brand assets

The favicon is the letter R set in Bricolage Grotesque, the site's display
face, flattened to an SVG path — favicons do not load webfonts, so the outline
has to be baked in. `og.png` is a 1200x630 card screenshotted from an HTML
template with the same self-hosted faces, which is the size every social
platform crops against.

`og:image` must be an absolute URL or scrapers ignore it, so the canonical host
is written into the tags. Moving hosts means editing the `og:*`/`canonical`
block in the three HTML files and regenerating `sitemap.xml` and `robots.txt`.

### Search

Case studies live behind a query string on one HTML file, so the sitemap lists
each `project.html?p=<slug>` explicitly — there is no links-only route a
crawler could follow to all of them. Regenerate it after adding or removing a
project.

Crawlers that run JavaScript also get a per-project `description` and
`canonical`, rewritten by `js/main.js` as the case study renders. Social
scrapers do not run scripts, so the static `og:*` tags stay generic on
`project.html` rather than claiming to describe a specific app.

## Running locally

```sh
cd public && python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` from the filesystem does
not work — `config.js` is fetched over HTTP.

## Deployment

The site is published twice from the same `public/` directory:

- **GitHub Pages** — <https://remonyounan.github.io>, the canonical host.
  `.github/workflows/pages.yml` uploads `public/` on every push to `main`.
  Pages can only serve a branch's root or `/docs`, which is why a workflow does
  it rather than the "deploy from a branch" setting. Enable it once under
  **Settings → Pages → Source: GitHub Actions**.
- **Cloudflare Worker** — <https://portfolio.remon-younan-dev.workers.dev>,
  serving `public/` as static assets over the GitHub integration. Pushing to
  `main` deploys.

Neither has a build command: the WebP derivatives and the brand assets are
committed, so a deploy is a plain upload. Only the contents of `public/` are
published; anything else at the repository root stays out of the deployed
site.

Because both hosts serve the same pages, every page carries a `canonical`
pointing at the GitHub Pages URL, so search engines treat the pair as one site
rather than as duplicates.

Two behaviours worth knowing on the Worker, both defaults of its static-asset
handler rather than anything this repository sets:

- Requests for `/foo.html` are 307-redirected to `/foo`. Query strings survive,
  so `project.html?p=aklne` still resolves, but every internal link costs one
  extra round trip. GitHub Pages does not do this, so the same links cost
  nothing there.
- Assets are served `cache-control: public, max-age=0, must-revalidate`, so
  repeat visitors revalidate and get cheap 304s rather than true cache hits.
  Long-lived immutable caching would be faster, but only once the derivative
  filenames include a content hash — otherwise replacing a screenshot under the
  same name would serve the old one for as long as the max-age.
