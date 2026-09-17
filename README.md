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
| Project Workspace (template — 11 tabs) | `project-workspace.html` |
| Activities | `activities.html` |
| MERL | `merl.html` |
| Data Collection | `data-collection.html` |
| Beneficiaries | `beneficiaries.html` |
| Beneficiary Profile (template) | `beneficiary-profile.html` |
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

`project-workspace.html` and `beneficiary-profile.html` are single templates —
every project or beneficiary row/card in this prototype links to the same
demo record rather than to hundreds of individual pages. Wiring them to a
real per-record URL is the natural next step once this connects to actual
data. `project-workspace.html` itself now has the full 11-tab structure
(Overview, Activities, Indicators, Targets, Beneficiaries, Documents, Budget,
Reports, Photos, Learning, Data Collection) called for in the requirements.

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

When zoomed into a country, illustrative **district/site-level markers** also
appear (e.g. "Recycling Market — Sub-district 3", "Turkana Early-Warning
Station"), each tagged with a site type (Waste Site, Market, Climate Hotspot,
etc.), with a legend list below the map. Their coordinates are placed by eye
within each country's real shape, not from real district geodata — swap in
actual site coordinates once they're available.

## Role-based dashboards

Every page carries a **role switcher** in the top bar (hidden below 540px
width to save space — set it from a wider screen and it persists via
`localStorage` as you navigate, including in the mobile drawer). Six roles
stand in for the eleven in the requirements doc: Executive/Director,
Programme Manager, MERL Officer, Finance Manager, Field Officer, and
Partner/Donor.

Switching roles does two things, both driven by `assets/js/role.js`:
- **Sidebar navigation** shows only the sections that role's `data-roles`
  list includes (set per nav item in `gen_pages.py`'s `NAV` structure) —
  empty groups collapse automatically.
- **Section-level hiding** on the page itself, via a `data-role-hide="a,b"`
  attribute on any element. Right now this is applied to two sections on the
  Executive Overview (the Finance panel and the Decision Support panel) as a
  worked example — extending it to other pages just means adding the
  attribute to the relevant section and regenerating.

A banner at the top of the page content always states which role is active
and what it's scoped to, so the changing nav doesn't read as a bug.

This is a front-end simulation of RBAC for demonstration purposes — there's
no real authentication or server-side enforcement behind it (see Technology
Architecture below).

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

- **Technology Architecture**: this is a static front-end only — no
  database, API, authentication, PWA/offline support, or real RBAC
  enforcement. The role switcher is a client-side simulation for
  demonstration; a real build needs the backend described in the
  requirements doc (PostgreSQL, REST API, auth, encryption, audit logs).
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
