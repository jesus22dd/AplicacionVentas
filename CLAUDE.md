# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

This is a **pure front-end, no-build app**. There is no package manager, no bundler, and no compilation step.

To run it, simply open `index.html` in a browser (double-click or use a local server):
```
# Option 1: Python simple server
python -m http.server 8080

# Option 2: Open directly
start index.html
```

There are no tests, no linting commands, and no build process.

## Architecture

**ElectroShop POS** is a single-page business management system for a tech-products store. All data lives in memory — there is no backend, no database, and no API calls. Refreshing the page resets all changes made through the UI (except `DB.config`, which is persisted to `localStorage` via `saveDBConfig()`).

### Script load order (matters — no module bundler)

`index.html` loads scripts in this required order:
1. `js/data.js` — defines the global `DB` object (in-memory store)
2. `js/utils.js` — shared helpers; depends on `DB` and `currentUser`
3. `js/modules/*.js` — each module exports a `*Module` object with `render()` and optionally `init()`
4. `js/app.js` — Auth, router (`navigate()`), clock, and app bootstrap; depends on everything above

### Data layer (`js/data.js`)

`DB` is a plain JavaScript object that serves as the entire database:
- Collections: `DB.products`, `DB.categories`, `DB.sales`, `DB.customers`, `DB.workers`, `DB.suppliers`, `DB.purchases`, `DB.returns`, `DB.quotations`, `DB.pendientes`, `DB.roles`
- Config: `DB.config` (persisted to `localStorage` key `es_config`)
- Helper methods: `DB.getCat(id)`, `DB.getProduct(id)`, `DB.getCustomer(id)`, `DB.getWorker(id)`, `DB.getRole(id)`, etc.

All prices in `DB` are in **USD**. `formatPrice()` / `fmt()` in `utils.js` converts them to the display currency (Bs. by default) using `DB.config.exchangeRate`.

### Module pattern

Each module in `js/modules/` is a plain object:
```js
const FooModule = {
  render() { return '<html string>'; },  // returns HTML for contentArea
  init()   { /* attach events, draw charts */ }
};
```

The router in `app.js` calls `contentArea.innerHTML = module.render()` then `module.init()`. Modules must not use `document.querySelector` outside of `init()` because the DOM isn't ready during `render()`.

### Auth & permissions

- `SYSTEM_USERS` (in `app.js`) holds the three demo accounts; `currentUser` is the active session.
- Roles and granular CRUD permissions (`read`, `create`, `edit`, `delete`) live in `DB.roles`.
- Permission helpers in `utils.js`: `canRead(mod)`, `canCreate(mod)`, `canEdit(mod)`, `canDelete(mod)`.
- The sidebar nav hides items the user cannot `read`. Modules should gate action buttons with `canCreate`/`canEdit`/`canDelete`.

### Shared UI utilities (`js/utils.js`)

| Function | Purpose |
|---|---|
| `openModal(title, html, size?)` / `closeModalDirect()` | Global modal |
| `openConfirm(title, msg, cb)` | Confirmation dialog |
| `showToast(msg, type)` | Toast notifications |
| `Charts.create(id, type, data, opts)` / `Charts.destroyAll()` | Chart.js wrapper (must destroy before navigating) |
| `paginate(items, page, perPage)` + `paginationHTML(pag, fn)` | Pagination |
| `formatPrice(usd)` / `fmt(usd)` | Currency display |
| `generateInvoicePDF(sale, cash?)` | Full A4 invoice via jsPDF |

### External libraries (CDN, no install)

- **Chart.js 4.4** — charts
- **jsPDF 2.5 + jspdf-autotable 3.5** — PDF generation
- **QRCode.js** — QR codes on quotations/receipts
- **html2canvas 1.4** — receipt screenshot
- **Font Awesome 6.5** — icons
- **Inter** (Google Fonts) — typography

### Second page

`validar.html` is a standalone document-validation page. It reads a `?qr=` query param and looks up the sale/quotation by `qrHash` in `DB`. It has no shared JS with `index.html`.
