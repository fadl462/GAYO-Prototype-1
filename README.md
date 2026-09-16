# MIOMS — Executive Overview (Prototype 01)

**MERL Integrated Organizational Management System** — GAYO's digital operating
system for programmes, performance & evidence.

This is a static, front-end-only prototype of the first MIOMS screen: the
Executive Overview. It's built to match the GAYO brand guidelines (colours,
tone) and the MIOMS Prototype 01 specification — organization-wide portfolio,
MERL, finance, beneficiary, geographic and decision-support intelligence in a
single command-centre view.

There is no backend. All figures are illustrative demo data, clearly labelled
as such in the footer of the page — swap in real data once this is wired to
an actual data source.

## What's inside

```
gayo-mioms-prototype/
├── index.html                 ← the whole page
├── assets/
│   ├── css/styles.css         ← design tokens + all component styles
│   ├── js/app.js               ← chart setup, tabs, filters, drawer nav
│   ├── img/                   ← brandmark + decorative ring motif (SVG)
│   └── vendor/chart.umd.min.js ← Chart.js, vendored locally (no CDN dependency)
└── README.md
```

Everything is self-contained — no build step, no `npm install`, no external
CDN calls at runtime (Chart.js is vendored; only Google Fonts is loaded
remotely, and it degrades gracefully to system fonts if unavailable).

## Preview locally

Open `index.html` directly in a browser, or serve it so relative paths behave
exactly as they will on GitHub Pages:

```bash
cd gayo-mioms-prototype
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Publish to GitHub Pages

1. Create a new repo (or use an existing one) and push this folder's contents
   to its root — e.g.:

   ```bash
   cd gayo-mioms-prototype
   git init
   git add .
   git commit -m "MIOMS Prototype 01: Executive Overview"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source** = *Deploy
   from a branch*, branch = `main`, folder = `/ (root)`. Save.

3. Your prototype will be live at:
   `https://<your-username>.github.io/<repo-name>/`

   (If you're publishing into an existing platform repo — e.g. alongside
   `gayo-intelligence-platform` — you can instead push this into a
   subdirectory, or into its own repo and link to it from wherever you're
   collecting prototype links.)

## Notes for the next prototype in the suite

Per the product hierarchy this prototype establishes (MIOMS → Thematic Area →
Project → Data → MERL → Evidence → Intelligence → Decision), the natural next
screens are:

- **Project Workspace** — opened when a row in the Project Portfolio table is
  clicked
- **Thematic Area Intelligence** — opened from a thematic card's "View
  Intelligence" link (this is where the existing GAYO Environmental
  Intelligence Platform can plug in as the Zero Waste Cities workspace)
- **MERL / Data Collection** workspace
- **GIS & Locations** full-screen explorer

The sidebar navigation, header, and design tokens in `styles.css` are already
structured so those screens can reuse the same shell.
