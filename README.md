# MIOMS — GAYO Digital Operating System (Prototype)

**MERL Integrated Organizational Management System** — GAYO's digital operating
system for programmes, performance & evidence.

This is a static, front-end-only prototype of MIOMS: 20 fully linked pages
sharing one consistent sidebar, top bar and footer, built to match the GAYO
brand guidelines (colours, logo, tone). Every sidebar link, table row, card
and quick action goes to a real page — nothing dead-ends.

There is no backend. All figures are illustrative demo data, clearly labelled
as such in the footer of every page — swap in real data once this is wired to
an actual data source.

## Pages

| Page | File |
|---|---|
| Executive Overview | `index.html` |
| My Workspace | `workspace.html` |
| Thematic Areas | `thematic-areas.html` |
| Projects | `projects.html` |
| Project Workspace (template) | `project-workspace.html` |
| Activities | `activities.html` |
| MERL | `merl.html` |
| Data Collection | `data-collection.html` |
| Beneficiaries | `beneficiaries.html` |
| GIS & Locations | `gis.html` |
| Finance | `finance.html` |
| Departments | `departments.html` |
| Country Offices | `country-offices.html` |
| Documents | `documents.html` |
| Knowledge Centre | `knowledge-centre.html` |
| Evidence Repository | `evidence-repository.html` |
| Reports & Analytics | `reports-analytics.html` |
| Notifications | `notifications.html` |
| Integrations | `integrations.html` |
| Administration | `administration.html` |

`project-workspace.html` is a single template — in this prototype every
project row and card links to the same demo project (Zero Waste Accra) rather
than to 245 individual pages. Wiring it to a real per-project URL is the
natural next step once this connects to actual data.

## The Africa map

`GIS & Locations` (and the "Where GAYO Works" panel on the Executive
Overview) render a **real map of Africa** — actual country boundaries from
Natural Earth data (via the `world-atlas`/`topojson` public datasets), not a
stylized icon. Office markers sit at each country's real geographic centroid.

Clicking a marker, or a country in the office list, zooms into that
country's real, accurate shape with a "Full map" button to return. The same
zoom can be deep-linked directly: `gis.html?focus=Kenya` opens already zoomed
into Kenya — this is what the Country Offices cards' "View on map" links use.

The map data lives in `assets/js/africa-map-data.js` (generated once at
authoring time from real boundary data, not hand-drawn) and is rendered by
`assets/js/africa-map.js`. Extending the focus countries beyond the current
six (Ghana, Kenya, Nigeria, Uganda, Botswana, Senegal) means re-running the
generation step against the same public dataset for the new country names.

## What's inside

```
gayo-mioms-prototype/
├── index.html, workspace.html, projects.html, ... (20 pages)
├── assets/
│   ├── css/styles.css         ← design tokens + every component style, shared by all pages
│   ├── js/app.js               ← chart setup, tabs, filters, drawer nav
│   ├── img/                   ← official GAYO logo + brandmark (SVG)
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
   git commit -m "MIOMS Prototype — full multi-page build"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source** = *Deploy
   from a branch*, branch = `main`, folder = `/ (root)`. Save.

3. Your prototype will be live at:
   `https://<your-username>.github.io/<repo-name>/`

## Editing this later

Every page shares identical sidebar/top bar/footer markup, generated from one
source so a change (like the logo fix) only has to happen once. If you're
working in code rather than by hand, the same approach — one shared header/
footer include, one content block per page — will save you from having to
hand-edit 20 files every time something in the shell changes.

## Notes for the next phase

- **Per-project pages**: `project-workspace.html` is currently one template
  shared by every project link. A real build would generate one per project
  (or load data dynamically via query string / backend).
- **Thematic Area Intelligence**: the thematic cards currently link to
  `thematic-areas.html`. This is where the existing GAYO Environmental
  Intelligence Platform could plug in as the dedicated Zero Waste Cities
  workspace.
- **Forms**: Data Collection, Add Indicator, Register Beneficiary and similar
  "create" actions currently link to their list page rather than opening a
  form — the next layer of interactivity is wiring up actual input forms.
