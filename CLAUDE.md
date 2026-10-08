# SpareX B2B: Kannali Garage business portal

> **Agent: read this whole file before any work.** It is the complete brief: product, roadmap, stack, design system,
> data approach, screens and demo data. **Do not look for or read any other project documents** (proposals, quotes,
> PDFs). If something is not covered here, choose the simplest option that follows these rules, then mention it in your
> report. Don't ask questions about anything this file already decides.

---

## 1. The five pillars (every decision is checked against these)

1. **Easy to maintain**: a new developer understands any file at first glance.
2. **Easy to scale**: new features slot in as new folders and routes without touching existing ones.
3. **Clean**: no duplication, no dead code, no clever tricks, no unnecessary code.
4. **No compromise on design**: polished, consistent, excellent UX on desktop, tablet and mobile.
5. **Industry standard**: conventional Next.js + React patterns that any experienced developer recognises.

---

## 2. The product

**Kannali Garage** is a two-wheeler (bike and scooter) service and spare-parts business in Bengaluru, India.
**SpareX** is its spare-parts platform. This repository is the **B2B portal**, where businesses buy parts in bulk:

- **Who uses it:** garage and workshop owners, fleet operators, two-wheeler dealers, spare-parts retailers, resellers
  and corporate customers.
- **What it is:** the same products and stock as the consumer site, seen from a business's side. That means business
  pricing (per customer, category or quantity), minimum order quantities, bulk carts, quick ordering by part number,
  quotations, purchase orders, credit accounts and GST invoices.
- **Who it isn't for:** consumers, who use the separate B2C site.

Business users work fast and repeat orders often. The UI should be **efficient, dense but calm, and trustworthy**:
tables, quick actions, keyboard-friendly. It uses the same brand as the B2C site, but is more of a tool than a shop.

### The wider platform (what exists beyond this repo)

| Part | Repo | Status |
|---|---|---|
| B2C website (consumers) | separate repo | Building in parallel |
| **B2B portal** (businesses) | **this repo** | Building now |
| Admin panel (Kannali staff approve businesses, set prices, create quotations, manage orders) | separate repo | Later |
| Backend API (Node.js + MongoDB) | separate repo | Later |
| Mobile apps (React Native), including a garage staff and technician app | separate repos | Later |

### Roadmap for this repo: build now, but design so later phases slot in

- **Now (demo batch for client approval):** the screens in §9, with realistic demo data.
- **Phase 1 (business buying):** registration with admin approval, company profile and branches, users,
  catalogue with business pricing, quick order, bulk cart, quotations, purchase orders, credit account, orders, invoices
  and documents, fleet vehicles (for parts compatibility).
- **Phase 2: Garage OS (garage management for garage businesses):** appointments, vehicle check-in with photos,
  digital job cards, inspections, estimates and customer approval of extra work, technicians and their jobs,
  parts used per job, service completion reports, garage invoices and payments, garage inventory (stock in/out, low-stock
  alerts, valuation), suppliers, the garage's own customers and vehicles, multi-branch management, and role-based access
  (Owner, Manager, Service advisor, Technician, Inventory manager, Accountant) with an audit trail.

So the account has a **business type** (`garage`, `fleet`, `dealer`, `retailer`, `reseller`, `corporate`) and users have
**roles**. Navigation is driven by config, so Garage OS modules can later appear only for `garage` accounts and only for
permitted roles. Feature folders, nav config and types must allow this **without reworking existing screens**.

---

## 3. Stack and libraries (fixed)

| Job | Choice |
|---|---|
| Framework | **Next.js** (latest stable), App Router, `src/` directory, TypeScript `strict` |
| Styling | **Tailwind CSS v4**, using the theme in §6 only |
| Components | **shadcn/ui**: components copied into `src/components/ui` and restyled with our theme |
| Tables | **TanStack Table** (through shadcn's data-table pattern) |
| Icons | **lucide-react** |
| Forms and validation | **react-hook-form + zod** (through shadcn's Form) |
| Carousels | **Embla Carousel** (through shadcn's Carousel), for dashboard offers only |
| Toasts | **sonner** (through shadcn) |
| Client state (cart, selected branch) | **Zustand**, with the `persist` middleware |
| Fonts and images | `next/font/google` (**Inter**), `next/image` |
| Code quality | ESLint (Next config), Prettier + `prettier-plugin-tailwindcss` |
| Package manager | npm |

Rules:
- Packages the shadcn CLI installs (Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, etc.) are allowed.
- **Nothing else** without the lead's approval. One library per job.
- **Never** use pre-styled design kits (MUI, Bootstrap, Ant Design, Chakra, Mantine, DaisyUI).
- Later, for the backend phase only: TanStack Query. Don't add it now.

Setup note: this folder already contains `CLAUDE.md`, so `create-next-app .` will refuse to run. Scaffold into a temporary
sub-folder, move the files up, then delete the sub-folder. Initialise git, and add `.gitignore`, `.env.example`
and `.nvmrc` (Node LTS).

---

## 4. Data layer: demo data now, real backend later with minimal change

This is the most important architectural rule. **Screens must never need rework when the backend arrives.**

```
Screen / component             never knows where data comes from
   ↓ calls getOrders(filters)
features/<x>/api.ts            the ONLY place that switches between demo and real data
   ├─ demo:  src/mocks/<x>.ts       (now)
   └─ real:  lib/api-client.ts → backend   (later)
```

1. **Types are the contract.** Every data shape lives in `features/<x>/types.ts` and is written the way a real REST API
   would return it: string `id`s, ISO date strings, **money as integer paise**, lists as
   `Paginated<T> = { items: T[]; page: number; pageSize: number; total: number }`.
   The backend team will build their API to return exactly these shapes.
2. **Screens never import from `src/mocks/`.** They call async functions in `features/<x>/api.ts`
   (`getCatalog(filters)`, `getQuotation(id)`, `getCreditSummary()`, `getSession()`…).
3. **One switch per feature** in `src/lib/config.ts`: `dataSource = { catalog: "mock", orders: "mock", ... }`.
   Each `api.ts` function returns mock data or calls `apiClient` based on this. Features can go live one at a time.
4. **Mock functions behave like a real server.** They are async, and they filter, sort and paginate on the same
   parameters the UI sends. The UI never filters raw arrays itself.
5. `src/lib/api-client.ts` is a small typed `fetch` wrapper: base URL from env, JSON, auth header slot, and a typed `ApiError`.
   Write it now (unused until the backend exists).
6. **Auth in one place:** `features/auth/session.ts` exports `getSession()`, which returns
   `{ user, business, role, approvalStatus }`. It returns the demo user for now. The app layout redirects to `/login`
   without a session. Real auth later replaces only this file. A single `can(role, permission)` helper in
   `features/auth/permissions.ts` is the only place permissions are checked; for now every permission is allowed.
7. The cart and selected delivery branch live in Zustand stores, persisted to `localStorage`.
8. When every feature is live, **`src/mocks/` is deleted** and nothing else breaks.

**Pricing rule:** B2B prices are shown **excluding GST**, with GST as a separate line (18% on all demo items). A product
has `mrpInPaise`, a `businessPriceInPaise` (this customer's price) and optional `tierPrices`
(`[{ minQty: 10, priceInPaise }]`). Prices only ever show to a logged-in, approved business.

---

## 5. Folder structure

```
src/
  app/
    (auth)/                    login, register, register/submitted (centred card layout, no sidebar)
    (portal)/                  App shell: sidebar + top bar. Everything behind login.
      dashboard/  catalog/  quick-order/  cart/  checkout/  quotations/  orders/  credit/  company/
    globals.css                Tailwind + theme. The only global CSS file.
    not-found.tsx  error.tsx
  components/
    ui/                        shadcn components + our own generic ones (Price, StatusBadge, DataTable, EmptyState, StatCard…)
    layout/                    AppSidebar, TopBar, BranchSwitcher, Container, Logo, PageHeader
  features/
    auth/  catalog/  cart/  checkout/  quick-order/  quotations/  orders/  credit/  company/  promotions/
      └─ each: components/, api.ts, types.ts (+ store.ts, schemas.ts or utils.ts when needed)
  lib/                         api-client.ts, config.ts, format.ts, utils.ts (cn), navigation.ts, constants.ts, gst.ts
  mocks/                       Demo data + mock handlers, one file per feature
public/images/                 products/, banners/, brand/
```

- One component per file; `PascalCase.tsx` for components; `kebab-case` folders; named exports.
- Used by one feature → it lives in that feature. Used by two or more → `components/ui` or `lib`.
- Check `components/ui` before creating anything. Only build what a screen needs.
- **Navigation lives in one place** (`lib/navigation.ts`): each item has `label`, `href`, `icon`, and optional
  `businessTypes` / `permission`. The sidebar renders from it. A new module is one entry.
- **One reusable `DataTable`** (TanStack Table): sorting, column visibility, pagination, row actions, empty and loading
  states. Every table in the app uses it. Below `md`, tables switch to stacked cards.
- Each route segment that loads data has a `loading.tsx` (skeleton). Use `error.tsx` and `not-found.tsx` where useful.

---

## 6. Design system

### Palette (theme in `globals.css`; identical to the B2C repo. Brand values are placeholders until the client sends a brand guide; change them only here)

Remove Tailwind's default palette (`--color-*: initial;`) so **only these colours exist**:

| Token | Values | Use |
|---|---|---|
| `navy-50…900` | 50 `#f2f6fb` · 100 `#e6eef8` · 200 `#c5d6ec` · 600 `#24599b` · 700 `#1d4e89` · 800 `#13315c` · 900 `#0b2545` | Brand structure: sidebar, headings, links |
| `orange-50…800` | 50 `#fff7ed` · 100 `#ffedd5` · 500 `#f97316` · 600 `#ea580c` · 700 `#c2410c` · 800 `#9a3412` | **Action colour**: primary buttons, key highlights |
| `gray-50…900` | 50 `#f8fafc` · 100 `#f1f5f9` · 200 `#e2e8f0` · 300 `#cbd5e1` · 400 `#94a3b8` · 500 `#64748b` · 600 `#475569` · 700 `#334155` · 800 `#1e293b` · 900 `#0f172a` | Text, borders, backgrounds |
| `success` | 50 `#f0fdf4` · 600 `#16a34a` · 700 `#15803d` | Delivered, paid, in stock, accepted |
| `warning` | 50 `#fffbeb` · 500 `#f59e0b` · 700 `#b45309` | Due soon, low stock, awaiting action |
| `danger` | 50 `#fef2f2` · 600 `#dc2626` · 700 `#b91c1c` | Overdue, rejected, errors, out of stock |
| `info` | 50 `#eff6ff` · 700 `#1d4ed8` | Information, in progress |
| `white`, `black` | | |

Map shadcn's semantic variables: `primary` = orange-700 (white text), `secondary` = navy-50 / navy-800,
`accent` (shadcn's hover background) = gray-100, `muted` = gray-100 / gray-500, `destructive` = danger-700,
`border` = gray-200, `input` = gray-300, `ring` = navy-600, `background` = gray-50, `card` and `popover` = white,
`foreground` = gray-900. `sidebar` = navy-900 with white/navy-200 text. Light mode only.

### Look and feel
- **Efficient, calm, trustworthy.** A professional tool: denser than the consumer site, never cramped.
- App shell: a navy-900 sidebar (collapsible on desktop; a drawer on mobile) and a white top bar.
- Page background gray-50; content on white cards (`rounded-xl border border-gray-200`, `shadow-sm` at most).
- Radius: cards `rounded-xl`, buttons and inputs `rounded-lg`, badges `rounded-full`.
- **Orange is for action**, with one primary button per section. Status colours only for status
  (a single `StatusBadge` maps every status to a colour).
- Tables: compact rows (`h-12`), right-aligned numbers with `tabular-nums`, sticky header, clear zebra or hover state.
- Tailwind's default spacing scale only. **No arbitrary values** unless unavoidable, with a comment saying why.

### Typography (Inter)
- Page title `text-2xl font-semibold text-gray-900` (inside `PageHeader`, with optional description and actions)
- Section title `text-lg font-semibold` · Body `text-sm text-gray-700` · Muted `text-gray-500`
- Numbers and money: `font-semibold tabular-nums`
- Copy: plain, professional Indian English. Sentence case on buttons ("Add to cart", "Request quotation").

### UX rules (non-negotiable)
- **Desktop-first for density, but fully responsive.** Check every screen at **1440px, 1024px, 768px and 375px**. No
  horizontal page scroll; wide tables scroll inside their own container or switch to cards below `md`.
- Every data area has **four states**: loading (a skeleton), empty (friendly text + an action), error (message + retry), success.
- Whatever needs the user's attention comes first (overdue payments, quotations awaiting a response).
- **Speed for repeat buyers:** quantity inputs directly in lists, "Reorder" everywhere, search by part number from the
  top bar, `/` focuses search, and Enter adds to cart in Quick Order.
- Money: `formatPrice(paise)` → `₹1,24,999` (Intl `en-IN`). Always label whether an amount is "excl. GST" or "incl. GST".
- Validation: GSTIN `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`. PAN is GSTIN characters 3–12 (auto-fill it);
  the state comes from the first 2 digits (29 = Karnataka). The `lib/gst.ts` helpers do this.
- Dates `12 Oct 2026` · mobile `+91 98450 12345`.
- Accessibility: semantic HTML, a label on every input, visible focus rings, keyboard-operable tables, menus and dialogs,
  WCAG AA contrast. White text only on `-700` shades or darker (or navy-900).
- Feedback: actions show a sonner toast ("12 items added to cart").

---

## 7. Code rules

- **Server Components by default.** `"use client"` only on the smallest interactive leaf (tables, forms, steppers, dialogs, stores).
- **No inline styles** (`style={{}}`). The only exception is a truly dynamic value (e.g. a credit-usage %) passed as a CSS variable.
- No hard-coded colours or sizes; theme tokens only.
- Repeated class combinations become a component, and variants use `cva`. Pages read like a table of contents.
- A `className` prop on our components is for outer layout only, never for overriding colours.
- Components stay around 150 lines max; split when bigger. Table column definitions live in their own `columns.tsx`.
- TypeScript: no `any`, no `@ts-ignore`, no non-null `!` without a comment.
- **The URL is the source of truth for list state**: search, filters, sort and page live in query params.
- Forms: react-hook-form + a zod schema in the feature's `schemas.ts`. Validation messages are friendly and specific.
- Every page sets `metadata` (title).
- Comments explain **why**, not what. No commented-out code, no `console.log`, no unused files or exports.
- Secrets and URLs only through env variables, documented in `.env.example`.
- **Done means:** `npm run lint`, `npm run typecheck` (`tsc --noEmit`) and `npm run build` pass, there are no browser console
  errors, and the screen has been checked at 1440 / 1024 / 768 / 375px.

---

## 8. How to work

1. The lead gives one task at a time ("Step 0", "Screen 3"…). Build exactly what §9 specifies for it.
2. After each task, **stop** and report in 5–10 lines: what you built, the routes, decisions you made, anything that needs input.
3. Commit after each finished task with a conventional message (`feat(quotations): quotation list and detail`).
4. Don't change files unrelated to the task. Don't refactor earlier screens unless asked.

---

## 9. Demo batch: screens to build (in this order)

### Step 0: Foundation
Project setup (§3), theme (§6), fonts, ESLint and Prettier, shadcn init, folder structure (§5), `lib/` helpers
(`format`, `gst`, `api-client`, `config`, `navigation`), auth `getSession` + `can()`, Zustand stores (cart, branch),
the reusable `DataTable`, `StatusBadge`, `StatCard`, `PageHeader`, all demo data (§10), and the layouts:
- **App shell:** a navy sidebar with logo ("SpareX Business", by Kannali Garage) and nav from `navigation.ts`:
  Dashboard · Catalogue · Quick order · Quotations · Orders · Credit & payments · Company. Collapsible on desktop,
  a drawer on mobile.
- **Top bar:** global search ("Search by part number or name", `/` to focus) · **branch switcher** (delivery branch) ·
  cart with item count · notifications · account menu (business name, user, role, sign out).
- **Auth layout:** a centred card on gray-50, with a slim brand panel on desktop.
- A tidy **"Coming soon"** page for sections outside this batch, so no link is ever dead.

### Screen 1: Sign in, Register, Submitted `/login`, `/register`, `/register/submitted`
- **Sign in:** business email + password, "Forgot password?", link to register. Optional 2-step verification (a 6-digit
  code step, shown as an option in account settings later). Demo: any email + any password of 8+ characters.
- **Register:** 3 steps with a progress indicator:
  1. Business: business name, business type (Garage/workshop, Fleet operator, Dealer, Spare-parts retailer, Reseller,
     Corporate), GSTIN (validated; auto-fills PAN and state), PAN.
  2. Contact: contact person, business email, mobile, main address (PIN → city and state).
  3. Review: a summary + terms checkbox → Submit.
- **Submitted:** "Application received. Our team will verify your business. Once approved, we'll email your login
  details." Shows a reference number and what happens next (3 short steps).

### Screen 2: Dashboard `/dashboard`
1. **Attention bar** (only when needed): "1 invoice overdue · ₹12,800 · Pay now" and "2 quotations awaiting your response".
2. **Stat cards (4):** Credit available (with a usage bar: used of limit) · Outstanding (next due date) ·
   Open orders · Quotations awaiting you.
3. **Quick actions:** Quick order (primary) · Request quotation · Reorder last order.
4. **Recent orders** (DataTable, 5 rows): order no., PO no., date, branch, items, amount, status → "View all".
5. **Business offers** banner carousel (2 slides).
6. **Frequently ordered:** 6 compact product rows with a quantity input + "Add".

### Screen 3: Catalogue `/catalog`
- PageHeader + search (name, part number, brand).
- Filters: desktop left panel, mobile sheet. Category, brand, fits bike (brand → model), in stock only.
- **Table view (default):** image thumb · part name + part no. · brand · fits (e.g. "KTM Duke 200, RC 200 +3") ·
  stock (In stock 240 / Low 8 / Out) · pack / MOQ · **your price (excl. GST)** + MRP · tier hint ("₹420 for 10+") ·
  quantity input (respects MOQ and pack size) + "Add".
- Toggle to **grid view** (cards) for browsing.
- Clicking a product opens a **detail drawer** (no separate page): images, specs, all compatible bikes, the tier price
  table, stock per branch, add to cart.
- Pagination; empty state.

### Screen 4: Quick order `/quick-order`
- An editable grid: **Part number** (autocomplete by number or name) · product found · stock · MOQ · unit price · qty ·
  line total · remove. "Add row"; Enter moves to the next row.
- **"Paste a list"**: a textarea that accepts one `part number, quantity` per line → parse → rows are validated and flagged:
  not found (danger), below MOQ (warning, auto-corrected to MOQ with a note), out of stock (danger), OK (success).
- Footer: item count, subtotal excl. GST → "Add all to cart" (primary) or "Request quotation for these".

### Screen 5: Cart and checkout `/cart` → `/checkout` → order placed
- **Cart:** DataTable of items (product, part no., unit price, qty with MOQ and pack rules, tier saving shown, line total),
  remove, "Save as quotation request". Warnings for MOQ or stock issues.
- **Summary:** subtotal (excl. GST) · tier/contract savings · GST 18% · delivery · **total (incl. GST)**.
- **Checkout:** delivery branch (radio cards for branches; can't be split per item in this batch) · **your PO number**
  (optional) + PO date · notes for the warehouse · **payment:** "Use credit" (shows available credit and terms "Net 30";
  disabled with an explanation if over the limit) or "Pay online" (UPI / Net banking / Card, demo).
- Place order → a confirmation page: order no., PO no., branch, expected delivery, payment terms, "View order".

### Screen 6: Quotations `/quotations` and `/quotations/[id]`
- **List** (DataTable): quote no., requested on, items, quoted amount, valid until, status
  (Requested · Quoted (awaiting you) · Accepted · Rejected · Expired). Filter tabs by status. "Request quotation" button.
- **Request quotation** (dialog or page): add products + quantities (reuses the Quick order rows), delivery branch, notes.
- **Detail:** status timeline, line items with list price vs quoted price and discount %, GST, total, validity countdown,
  notes from Kannali, attachments. Actions: **Accept & convert to order** (primary) · Ask for revision (comment) · Reject.

### Screen 7: Orders and invoices `/orders` and `/orders/[id]`
- **List** (DataTable): order no., PO no., date, branch, items, amount, payment (Credit · due date / Paid), status.
  Filters: status, date range, branch; search by order or PO number.
- **Detail:** status timeline (Placed → Confirmed → Processing → Packed → Shipped → Out for delivery → Delivered),
  items, delivery branch, PO details, price breakdown with GST, **Download GST invoice**, payment status and due date,
  **Reorder**, Need help.

### Screen 8: Credit and payments `/credit`
- Summary cards: credit limit · used · available (usage bar) · overdue amount · terms (Net 30).
- **Upcoming and overdue dues** (DataTable): invoice no., invoice date, due date, amount, days left / days overdue
  (coloured), "Pay".
- **Statement** (DataTable): date, reference (invoice / payment / credit note), debit, credit, running balance. Filter by
  date range; "Download statement".
- "Pay now" dialog: select invoices, total, payment method (demo).

### Screen 9 (optional): Company `/company`
Tabs: Business profile (GSTIN, PAN, type: read-only after approval) · Branches and delivery addresses (list + add) ·
Users (name, email, role, status; invite user) · Fleet vehicles (list of bikes for compatibility; add vehicle).

---

## 10. Demo data (realistic, decent, sensible amounts)

All of it lives in `src/mocks/`, typed with the feature types. It must look real.

- **Business:** Sri Sai Two Wheeler Works · type: garage · GSTIN `29AAKFS4821M1Z3` · PAN `AAKFS4821M` · approved.
- **User:** Mahesh Kumar (Owner) · mahesh@srisaiworks.example.com · +91 98860 44120. Two more users: Ravi (Manager), Shilpa (Accountant).
- **Branches:** Whitefield (main) · HSR Layout. Both in Bengaluru, with full addresses and PINs.
- **Credit:** limit ₹3,00,000 · used ₹1,18,450 · terms Net 30 · one overdue invoice of ₹12,800 (9 days overdue) ·
  two due in the next 10 days.
- **Catalogue: about 40 products**, using the same categories and real brands as the consumer site (Motul, Castrol,
  Shell, Rolon, Bosch, Uno Minda, Exide, Amaron, MRF, TVS Eurogrip, Philips, Steelbird, plus OEM parts from KTM, Honda,
  Bajaj and Royal Enfield). Each has a part number, HSN code, GST 18%, MRP, a business price about 12–20% below MRP excl. GST, pack size
  (e.g. oil in cartons of 12, brake pads in pairs), MOQ, stock per branch (a few low, one or two out of stock),
  compatible bikes, and tier prices on about a third of them.
- **Orders: 6** across all statuses, most with PO numbers (`PO/SSW/2026/041`), amounts ₹8,000–₹75,000.
- **Quotations: 4.** One quoted and awaiting response (valid 5 more days), one requested, one accepted (linked to an
  order), one expired.
- **Statement:** about 12 entries over the last 2 months (invoices, payments, one credit note), with correct running balances.
- **Offers (2 banners):** "Bulk engine-oil deal: extra 5% on 5+ cartons" · "New: Rolon chain kits now in stock".
- **Fleet vehicles:** 4 (for the optional Company screen).
- **Images:** put them in `public/images/`. Until the client sends photos, use free-licence images (Unsplash or Pexels; list
  them in `public/images/CREDITS.md`) **downloaded locally, never hotlinked**; otherwise use the placeholder component.
  The logo is a text wordmark ("SpareX Business", with "by Kannali Garage") inside the `Logo` component, so swapping in
  the real logo is a one-file change.
