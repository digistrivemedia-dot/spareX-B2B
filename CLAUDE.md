# SpareX B2B: Kannali Garage business portal

> **Agent: read this whole file before any work.** It is the complete brief: product, business rules, stack, design
> system, data approach, screens and demo data. **Do not look for or read any other project documents** (proposals,
> quotes, PDFs). If something is not covered here, choose the simplest option that follows these rules, log it in
> `DECISIONS.md`, then mention it in your report. Don't ask questions about anything this file already decides.

---

## 1. The five pillars (every decision is checked against these)

1. **Easy to maintain**: a new developer understands any file at first glance.
2. **Easy to scale**: new features slot in as new folders and routes without touching existing ones.
3. **Clean**: no duplication, no dead code, no clever tricks, no unnecessary code.
4. **No compromise on design**: polished, consistent, excellent UX on desktop, tablet and mobile.
5. **Industry standard**: conventional Next.js + React patterns that any experienced developer recognises.

---

## 2. The product

**Kannali Garage** is a vehicle service and spare-parts business in Bengaluru, India. **SpareX** is its spare-parts
platform. This repository is the **B2B website**, used by verified businesses. It has two jobs:

1. **Buying (every business):** buy parts from SpareX at business prices: catalogue, quick order, cart, quotations,
   orders, invoices, payments and (when enabled) credit.
2. **Garage (garage / workshop businesses only):** run the garage: bookings, walk-ins, vehicle check-in, job cards,
   inspections, estimates, technicians, quality check, billing, payment, delivery, customers and reviews.

- **Who uses it:** garages / workshops, fleet operators, dealers, spare-parts retailers, resellers and corporate
  customers, plus a garage's own staff.
- **Who it isn't for:** consumers, who use the separate B2C site.
- **The catalogue covers all vehicle types.** Don't assume two-wheelers in types, filters or copy.

Business users work fast and repeat orders often; garage staff work on the shop floor. The UI should be **efficient,
dense but calm, and trustworthy**: tables, quick actions, keyboard-friendly, and fully usable on a phone. It uses the
same brand as the B2C site, but is more of a tool than a shop. **The B2B mobile app (later) uses the same screens.**

### The wider platform (what exists beyond this repo)

| Part | Repo | Status |
|---|---|---|
| B2C website (consumers) | separate repo | Building in parallel |
| **B2B website** (businesses + garage management) | **this repo** | Building now |
| Admin panel (Kannali staff verify businesses, set the B2B discount, enable credit, manage orders and payments) | separate repo | Later |
| Backend API (Node.js + MongoDB) | separate repo | Later |
| B2B mobile app (React Native), same screens as this site | separate repo | Later |

### Sections and who sees them

| Section | Who sees it |
|---|---|
| Access | Everyone before login |
| Buying | Every verified business: garage, fleet, dealer / retailer / reseller, corporate |
| Company | Every business; **Users** only for garages |
| Garage | Garage / workshop businesses only, filtered by the logged-in user's roles and branch |

Navigation is driven by config (`lib/navigation.ts`): items carry `businessTypes`, `permission` and, for credit,
a `requiresCredit` flag, so a section appears only for the accounts and roles allowed to see it.

---

## 3. Business rules (the screens must follow these)

**Access**
- Every business is **verified by admin** before it can use B2B.
- Registration: **required**: business name, business type, email, phone, location, photos. **Optional**: contact
  person (if different), GSTIN, PAN, shop / trade licence, other government registration.
- Admin can **send an application back** for corrections; rejected businesses can **reapply anytime**.
- Login is business **email + password**, with optional 2-step verification. Garage staff log in the same way.
  New users set their password on first login.

**Buying**
- **B2B price = B2C price minus one admin-set discount %** for that business. There are no per-business price lists,
  no tier prices and **no minimum order quantity**. Prices show **excluding GST**, with GST as a separate line.
- Quotations are auto-priced, **valid 7 days**, and can be accepted, rejected or sent back for revision.
- Payment: **Razorpay**, **bank transfer** or **COD**. Admin marks non-Razorpay payments as paid.
  **Credit** only if admin enabled it for that business. Credit screens appear **only when credit is enabled**.
- Customers can **cancel an order until it is shipped**.

**Company and garage**
- **Only garages can add users.** Other business types have one login.
- Garage roles are **fixed** (below); a garage can add **unlimited users**. One person can hold **several roles**.
  There are **no custom permissions**.
- Staff belong to **one branch** and see only that branch's jobs. Garage owners switch branch from the top bar.
- There is **no garage stock module and no supplier list**. A garage's parts record is its SpareX order history.
- Garages set their **own service prices**, and **accept or decline** bookings only; there is no reschedule.
- Service invoices are in the **garage's** name and GST. Customers pay the garage **online or cash**.
- A **walk-in** vehicle is added by number plate. When the customer later adds the same plate, the history links to them.
- Another garage's service history on a vehicle is visible **without prices**.

### Garage roles

Fixed roles; final permissions are being confirmed with the client. Until then `can(roles, permission)` grants each
role the screens below.

| Role | Main screens |
|---|---|
| Garage Owner / Admin | Everything in the Garage section, plus Users and Branches |
| Garage Manager / Service Advisor | Bookings, walk-ins, check-in, job cards, estimates, assigning technicians, QA, delivery |
| Technician / Mechanic | My jobs, inspection, progress updates, parts used |
| Spares & Inventory Executive | Parts for this job, ordering from SpareX |
| Billing, QA & Delivery Executive | Quality check, billing, collect payment, delivery |

### Job card statuses (garage view)

Booked → Confirmed → Vehicle received → Job card created → Inspection → Waiting for customer approval → Approved →
Service in progress → Quality check → Ready for delivery → Payment pending → Paid → Completed

- **Walk-in** starts at Vehicle received.
- **Every item rejected:** the job closes with no fee.
- **Extra work found:** back to Waiting for customer approval.
- **QA failed:** back to Service in progress.

### Not in launch (Phase 2)

Garage stock levels, suppliers, procurement, warranty claims, approval workflows, courier tracking integration.
Don't build for these, but don't block them either.

---

## 4. Stack and libraries (fixed)

| Job | Choice |
|---|---|
| Framework | **Next.js** (latest stable), App Router, `src/` directory, TypeScript `strict` |
| Styling | **Tailwind CSS v4**, using the theme in §7 only |
| Components | **shadcn/ui**: components copied into `src/components/ui` and restyled with our theme |
| Tables | **TanStack Table** (through shadcn's data-table pattern) |
| Icons | **lucide-react** |
| Forms and validation | **react-hook-form + zod** (through shadcn's Field components) |
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

---

## 5. Data layer: demo data now, real backend later with minimal change

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
2. **Screens never import from `src/mocks/`.** They call async functions in `features/<x>/api.ts`.
3. **One switch per feature** in `src/lib/config.ts`: `dataSource = { catalog: "mock", orders: "mock", ... }`.
   Features can go live one at a time.
4. **Mock functions behave like a real server.** They are async, and they filter, sort and paginate on the same
   parameters the UI sends. The UI never filters raw arrays itself.
5. **Mutations go through Server Actions** that call the feature's `api.ts` and return `ActionResult<T>`.
6. **Auth in one place:** `features/auth/session.ts` exports `getSession()`, which returns
   `{ user, business, roles, branchId, approvalStatus }`. It returns the demo user for now. The app layout redirects to
   `/login` without a session. A single `can(roles, permission)` helper in `features/auth/permissions.ts` is the only
   place permissions are checked.
7. The cart and selected branch live in Zustand stores, persisted to `localStorage`.
8. When every feature is live, **`src/mocks/` is deleted** and nothing else breaks.

**Pricing rule:** a product has `mrpInPaise` and `b2cPriceInPaise`; the business has `discountPercent` (set by admin).
The business price is `b2cPrice × (1 − discount%)`, excluding GST (18% on all demo items), calculated in one helper in
`lib/pricing.ts`. Prices only ever show to a logged-in, verified business.

---

## 6. Folder structure

```
src/
  app/
    (auth)/                    login, register, application status, set password (centred card layout, no sidebar)
    (portal)/                  App shell: sidebar + top bar. Everything behind login.
      dashboard/  catalog/  quick-order/  cart/  checkout/  quotations/  orders/  returns/  credit/
      payments/  invoices/  company/
      garage/                  dashboard, profile, branches, bookings, jobs, my-jobs, customers, reviews, reports
    globals.css                Tailwind + theme. The only global CSS file.
    not-found.tsx  error.tsx
  components/
    ui/                        shadcn components + our own generic ones (Price, StatusBadge, DataTable, EmptyState…)
    layout/                    AppSidebar, TopBar, BranchSwitcher, Container, Logo, PageHeader
  features/
    auth/ catalog/ cart/ checkout/ quick-order/ quotations/ orders/ returns/ credit/ payments/ company/ promotions/
    garage/ bookings/ job-cards/ customers/ reviews/ …   (one folder per garage feature)
      └─ each: components/, api.ts, types.ts (+ store.ts, schemas.ts, actions.ts or utils.ts when needed)
  lib/                         api-client.ts, config.ts, format.ts, utils.ts (cn), navigation.ts, gst.ts, pricing.ts…
  mocks/                       Demo data + mock handlers, one file per feature
public/images/                 products/, banners/, brand/, garage/
```

- One component per file; `PascalCase.tsx` for components; `kebab-case` folders; named exports.
- Used by one feature → it lives in that feature. Used by two or more → `components/ui` or `lib`.
- Check `components/ui` before creating anything. Only build what a screen needs.
- **Navigation lives in one place** (`lib/navigation.ts`). A new module is one entry.
- **One reusable `DataTable`** (TanStack Table): sorting, column visibility, pagination, row actions, empty and loading
  states. Every list of records uses it. Narrow spaces switch to stacked cards.
- Each route segment that loads data has a `loading.tsx` (skeleton). Use `error.tsx` and `not-found.tsx` where useful.

**Shared components, built once and reused:** header and sidebar navigation (change by role) · branch switcher ·
data tables · loading, empty and error states · toasts and confirm dialogs · photo upload and image viewer.

---

## 7. Design system

### Palette (theme in `globals.css`; identical to the B2C repo. Brand values are placeholders until the client sends a brand guide; change them only here)

Remove Tailwind's default palette (`--color-*: initial;`) so **only these colours exist**:

| Token | Values | Use |
|---|---|---|
| `navy-50…900` | 50 `#f2f6fb` · 100 `#e6eef8` · 200 `#c5d6ec` · 600 `#24599b` · 700 `#1d4e89` · 800 `#13315c` · 900 `#0b2545` | Brand structure: sidebar, headings, links |
| `orange-50…800` | 50 `#fff7ed` · 100 `#ffedd5` · 500 `#f97316` · 600 `#ea580c` · 700 `#c2410c` · 800 `#9a3412` | **Action colour**: primary buttons, key highlights |
| `gray-50…900` | 50 `#f8fafc` · 100 `#f1f5f9` · 200 `#e2e8f0` · 300 `#cbd5e1` · 400 `#94a3b8` · 500 `#64748b` · 600 `#475569` · 700 `#334155` · 800 `#1e293b` · 900 `#0f172a` | Text, borders, backgrounds |
| `success` | 50 `#f0fdf4` · 600 `#16a34a` · 700 `#15803d` | Delivered, paid, in stock, accepted, QA passed |
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
- Tables: compact rows (`h-12`), right-aligned numbers with `tabular-nums`, sticky header, clear hover state.
- Tailwind's default spacing scale only. **No arbitrary values** unless unavoidable, with a comment saying why.

### Typography (Inter)
- Page title `text-2xl font-semibold text-gray-900` (inside `PageHeader`, with optional description and actions)
- Section title `text-lg font-semibold` · Body `text-sm text-gray-700` · Muted `text-gray-500`
- Numbers and money: `font-semibold tabular-nums`
- Copy: plain, professional Indian English. Sentence case on buttons ("Add to cart", "Request quotation").

### UX rules (non-negotiable)
- **Desktop-first for density, but fully responsive.** Check every screen at **1440px, 1024px, 768px and 375px**. No
  horizontal page scroll; wide tables scroll inside their own container or switch to cards.
- Garage floor screens (my jobs, check-in, inspection, QA) are used on phones: large touch targets, camera-friendly
  photo upload, one task per screen.
- Every data area has **four states**: loading (a skeleton), empty (friendly text + an action), error (message + retry), success.
- Whatever needs the user's attention comes first (overdue payments, quotations awaiting a response, new bookings).
- **Speed for repeat buyers:** quantity inputs directly in lists, "Reorder" everywhere, search by part number from the
  top bar, `/` focuses search, and Enter moves through Quick Order.
- Money: `formatPrice(paise)` → `₹1,24,999` (Intl `en-IN`). Always label whether an amount is "excl. GST" or "incl. GST".
- Validation: GSTIN (when given) `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`. PAN is GSTIN characters 3–12
  (auto-fill it); the state comes from the first 2 digits (29 = Karnataka). The `lib/gst.ts` helpers do this.
- Dates `12 Oct 2026` · mobile `+91 98450 12345` · number plates `KA 01 AB 1234`.
- Accessibility: semantic HTML, a label on every input, visible focus rings, keyboard-operable tables, menus and dialogs,
  WCAG AA contrast. White text only on `-700` shades or darker (or navy-900).
- Feedback: actions show a sonner toast ("12 items added to cart"); destructive actions use a confirm dialog.

---

## 8. Code rules

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

## 9. How to work

1. The lead gives one task at a time, by screen number or group ("B05", "B19–B21", "Garage jobs"). Build exactly what
   §10 specifies for it, following §3.
2. After each task, **stop** and report in 5–10 lines: what you built, the routes, decisions you made, anything that needs input.
3. Anything that needs the client's or lead's decision goes in `DECISIONS.md`; keep building with the simplest option.
4. Update the screen's status in §10 when it is done. Commit after each finished task with a conventional message
   (`feat(garage): job cards list and detail`).
5. Don't change files unrelated to the task. Don't refactor earlier screens unless asked.

---

## 10. Screens (52 for launch)

**Status:** BUILT = done on demo data · UPDATE = built, needs the change in Notes · PLACEHOLDER = page exists, no
content yet · TO BUILD = new screen · WAIT = design waits for a client answer.

| Status | Count |
|---|---|
| BUILT | 8 |
| UPDATE | 8 |
| PLACEHOLDER | 5 |
| TO BUILD | 30 |
| WAIT | 1 |
| **Total** | **52** |

### Access

| # | Screen | Status | Notes |
|---|---|---|---|
| B01 | Sign in + 2-step | BUILT | |
| B02 | Forgot / reset password | BUILT | |
| B03 | Registration | UPDATE | Name, type, email, phone, location, photos required; contact person, GSTIN, PAN, licences optional |
| B04 | Application submitted | BUILT | |
| B05 | Application status | TO BUILD | Under review; sent back + resubmit; rejected + reapply |
| B06 | First login: set password | TO BUILD | |

### Buying (all businesses)

| # | Screen | Status | Notes |
|---|---|---|---|
| B07 | Dashboard | BUILT | Credit cards hide when credit is not enabled |
| B08 | Catalogue + product drawer | UPDATE | B2B price = B2C price − discount %; no MOQ or tier prices; all vehicle types |
| B09 | Quick order | UPDATE | Remove MOQ and pack-size checks |
| B10 | Cart | UPDATE | No minimum quantity; no tier savings |
| B11 | Checkout | UPDATE | Razorpay, bank transfer, COD; credit only if enabled |
| B12 | Order placed | BUILT | |
| B13 | Orders list + reorder | UPDATE | Garages' purchase history lives here |
| B14 | Order detail + tracking + invoice | UPDATE | Cancel until shipped; return button |
| B15 | Return request + status | TO BUILD | If B2B returns are confirmed |
| B16 | Quotations list | BUILT | |
| B17 | New quotation | BUILT | Follows B09's changes |
| B18 | Quotation detail | UPDATE | 7-day validity; accept, reject, ask for revision |
| B19 | Credit summary + statement | PLACEHOLDER | Shown only if admin enabled credit |
| B20 | Pay dues | PLACEHOLDER | |
| B21 | Payments history | TO BUILD | |
| B22 | Invoices + documents | TO BUILD | |

### Company

| # | Screen | Status | Notes |
|---|---|---|---|
| B23 | Business profile | PLACEHOLDER | |
| B24 | Delivery addresses | PLACEHOLDER | |
| B25 | Users list | TO BUILD | Garages only; 5 fixed roles, unlimited users |
| B26 | Add / edit user | TO BUILD | Pick role(s) and branch; no custom permissions |
| B51 | Fleet | PLACEHOLDER | Remove, unless the client keeps it |

### Garage (garage businesses only)

| # | Screen | Status | Notes |
|---|---|---|---|
| B27 | Garage dashboard | TO BUILD | Today: new bookings, received, awaiting approval, in progress, ready, payment pending |
| B28 | Garage profile editor | TO BUILD | Photos, services + own prices, vehicle types, hours, daily limit, holidays |
| B29 | Branches | TO BUILD | |
| B30 | Bookings list | TO BUILD | |
| B31 | Booking detail: accept / decline | TO BUILD | |
| B32 | New walk-in job | TO BUILD | Vehicle by number plate |
| B33 | Vehicle check-in | TO BUILD | Odometer, fuel, damage, complaints, photos |
| B34 | Job cards list | TO BUILD | Filter by status, branch, technician |
| B35 | Job card detail + timeline | TO BUILD | |
| B36 | Inspection checklist + photos | TO BUILD | |
| B37 | Estimate builder | TO BUILD | Labour, services, parts, consumables, taxes; record approval for the customer |
| B38 | Revised estimate (extra work) | TO BUILD | |
| B39 | Assign technician | TO BUILD | |
| B40 | My jobs (technician) | TO BUILD | Accept / reject an assigned job; update progress |
| B41 | Parts for this job | WAIT | Parts used + order from SpareX; full stock is Phase 2 |
| B42 | Quality check | TO BUILD | Checklist; pass or rework |
| B43 | Completion report | TO BUILD | |
| B44 | Billing + invoice | TO BUILD | In the garage's name and GST |
| B45 | Collect payment | TO BUILD | Online or cash |
| B46 | Delivery / handover | TO BUILD | Closes the job |
| B47 | Customers list | TO BUILD | |
| B48 | Customer + vehicle history | TO BUILD | Other garages' prices hidden |
| B49 | Reviews received | TO BUILD | |
| B50 | Branch reports | TO BUILD | |

### Global

| # | Screen | Status | Notes |
|---|---|---|---|
| B52 | 404 / error | BUILT | |

### Waiting on client answers

| Item | Affects |
|---|---|
| Garage inventory (light or full) | B41 |
| Returns for B2B buyers | B15 |
| Final permissions per garage role | B25, B26, all Garage screens |
| QA owner: Service Advisor or Billing/QA Executive | B42 |
| Branches / addresses for non-garage businesses | B24 |
| Keep or remove Fleet | B51 |
| Pickup and drop, doorstep service | B28, B31 |

---

## 11. Demo data (realistic, decent, sensible amounts)

All of it lives in `src/mocks/`, typed with the feature types. It must look real.

- **Business:** Sri Sai Two Wheeler Works · type: garage · GSTIN `29AAKFS4821M1Z3` · PAN `AAKFS4821M` · verified ·
  B2B discount 15% · credit enabled.
- **Users:** Mahesh Kumar (Garage Owner) · mahesh@srisaiworks.example.com · +91 98860 44120. Ravi (Manager / Service
  Advisor), Shilpa (Billing, QA & Delivery), two technicians and one Spares executive, spread over both branches; at
  least one person holds two roles.
- **Branches:** Whitefield (main) · HSR Layout. Both in Bengaluru, with full addresses and PINs.
- **Credit:** limit ₹3,00,000 · used ₹1,18,450 · terms Net 30 · one overdue invoice of ₹12,800 (9 days overdue) ·
  two due in the next 10 days.
- **Catalogue: about 40 products** using real brands (Motul, Castrol, Shell, Rolon, Bosch, Uno Minda, Exide, Amaron,
  MRF, TVS Eurogrip, Philips, Steelbird, plus OEM parts), each with a part number, HSN code, GST 18%, MRP, B2C price,
  stock per branch (a few low, one or two out of stock) and compatible vehicles.
- **Orders: 6** across all statuses, most with PO numbers (`PO/SSW/2026/041`), amounts ₹8,000–₹75,000.
- **Quotations: 4.** One quoted and awaiting response (valid 5 more days of 7), one requested, one accepted (linked to
  an order), one expired.
- **Statement:** about 12 entries over the last 2 months (invoices, payments, one credit note), with correct running balances.
- **Offers (2 banners):** "Bulk engine-oil deal: extra 5% on 5+ cartons" · "New: Rolon chain kits now in stock".
- **Garage:** about 15 job cards across every status and both branches (including a walk-in, one with extra work, one
  QA rework), 6 bookings (new, accepted, declined), about 12 customers with vehicles and history, the garage's
  services with its own prices, and 8 reviews.
- **Images:** put them in `public/images/`. Until the client sends photos, use free-licence images (Unsplash or Pexels;
  list them in `public/images/CREDITS.md`) **downloaded locally, never hotlinked**; otherwise use the placeholder
  component. The logo is a text wordmark ("SpareX Business", with "by Kannali Garage") inside the `Logo` component, so
  swapping in the real logo is a one-file change.
