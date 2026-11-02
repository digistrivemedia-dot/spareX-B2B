# 5. Developer guide and open questions

**Part A** is for developers joining the project. **Part B** is every question still open with the
client, for the project lead to take to Kannali.

`CLAUDE.md` is the full product and engineering brief (business rules, design system, screen list).
`DECISIONS.md` records every choice made where the brief was silent (90 items).

---

# Part A: Developer guide

## 1. Getting started

```bash
nvm use            # Node 24 (.nvmrc)
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000, slow the first time each page opens
```

For demos or performance checks use the production build, which opens pages instantly:

```bash
npm run build && npm start
```

| Command                       | What it does                             |
| ----------------------------- | ---------------------------------------- |
| `npm run dev`                 | Development server                       |
| `npm run build` / `npm start` | Production build and server              |
| `npm run lint`                | ESLint (Next.js config)                  |
| `npm run typecheck`           | TypeScript, no output                    |
| `npm run format`              | Prettier, including Tailwind class order |

**Done means** lint, typecheck and build pass, there are no browser console errors, and the screen
has been checked at 1440, 1024, 768 and 375 px.

## 2. Demo logins

No backend is needed. Without signing in you are the garage owner. Any password of 8+ characters
works.

| Email                                             | Shows                                              |
| ------------------------------------------------- | -------------------------------------------------- |
| mahesh@srisaiworks.example.com                    | Owner, with 2-step verification (any 6 digits)     |
| ravi@srisaiworks.example.com                      | Manager / service advisor, HSR Layout              |
| imran@srisaiworks.example.com                     | Technician, Whitefield ("My jobs")                 |
| venkatesh@srisaiworks.example.com                 | Technician and spares, HSR Layout                  |
| shilpa@srisaiworks.example.com                    | Billing, QA and delivery                           |
| review@ / sentback@ / rejected@sparex.example.com | An application under review, sent back or rejected |
| new@sparex.example.com                            | First login (set a password)                       |

Demo changes are kept in server memory: they reset when the server restarts, and on Vercel they can
be lost between requests.

## 3. Folder structure

```
src/
  app/
    (auth)/            Sign in, registration, application status, passwords (centred card)
    (portal)/          Everything behind login (sidebar + top bar)
      dashboard/ catalog/ quick-order/ cart/ checkout/ quotations/ orders/ returns/
      credit/ payments/ invoices/ company/
      garage/          dashboard, bookings, jobs, my-jobs, customers, reviews, reports,
                       profile, branches
    globals.css        Tailwind theme: the only global CSS
  components/
    ui/                shadcn components (kebab-case) + our shared ones (PascalCase)
    layout/            AppSidebar, TopBar, BranchSwitcher, PageHeader, Logo
  features/<name>/     One folder per feature:
    types.ts             The API contract (request and response shapes)
    api.ts               The only place that picks demo or real data
    actions.ts           Server Actions for forms (return ActionResult<T>)
    schemas.ts           zod schemas for forms
    utils.ts             Labels, rules and helpers for the feature
    store.ts             Zustand store, when the feature keeps browser state
    components/          The feature's components (columns.tsx for table columns)
  lib/                 Shared helpers: api-client, config, format, gst, pricing, dates,
                       navigation, search-params, validation
  mocks/               Demo data and handlers, one file per feature (deleted at the end)
public/images/         products/ banners/ brand/ garage/ (credits in CREDITS.md)
public/documents/      Sample PDFs for the demo (deleted at the end)
docs/                  These documents
```

## 4. How a page works

```
app/(portal)/orders/page.tsx      Server Component: reads the URL, calls the API, renders
  → features/orders/api.ts        getOrders(filters): demo or real data
  → features/orders/components/   OrdersTable (client) uses the shared DataTable
form submit
  → features/orders/actions.ts    "use server": calls api.ts, revalidates, returns ActionResult
```

Rules every page follows:

- **Server Components by default**; `"use client"` only on the smallest interactive part.
- **The URL holds list state**: search, filters, sort and page are query parameters
  (`lib/search-params.ts`), so lists can be shared and survive a refresh.
- **Four states for every data area**: a `loading.tsx` skeleton, an empty state (text and an
  action), an error state (message and retry, from `error.tsx`) and the content.
- **Server Actions check the caller**: start each action's work with `authorizeAction(permission)`
  (or `authorizeJobAction(jobId, permission)` for job cards). Browser components never call
  `api.ts` directly; they call a Server Action, so every API call runs on the server.
- **Permissions in one place**: `can(roles, permission)` from `features/auth/permissions.ts`.
  Pages call `requirePermission(permission, businessTypes)`, which shows "page not found" to anyone
  else. Garage pages use `loadJobForPage()` or `scopeToBranch()` to keep staff to their branch.
- **Navigation in one place**: `lib/navigation.ts`. Each item has `permission`, `businessTypes`
  and `requiresCredit`, so the menu changes by role and business type.
- **Every page sets `metadata`** (its title).

## 5. Shared building blocks (check here before building anything)

| Need                                      | Use                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Any list of records                       | `components/ui/data-table/DataTable` (sorting, columns, pagination, empty and loading states; turns into cards when narrow) |
| Status pill                               | `StatusBadge` (every status in the app maps to one colour here)                                                             |
| Money                                     | `Price`, `formatPrice(paise)` from `lib/format.ts` (`₹1,24,999`)                                                            |
| Page title and actions                    | `layout/PageHeader`                                                                                                         |
| Titled card section                       | `SectionCard` (`isDone` adds a "Done" tick)                                                                                 |
| Label / value pairs                       | `DetailList`, `DetailItem`                                                                                                  |
| Filters                                   | `SearchFilter`, `FilterSelect`, `DateRangeFilter`, `QueryTabs`                                                              |
| Confirm before destructive actions        | `ConfirmDialog`, `ReasonDialog`                                                                                             |
| Photos                                    | `PhotoUpload`, `PhotoGallery`, `ImageViewer`                                                                                |
| Empty / error                             | `EmptyState`, `ErrorState`                                                                                                  |
| Form fields                               | `FormTextField`, `FormAlert`, `SubmitButton` (react-hook-form + zod)                                                        |
| Timeline, checklist, usage bar, stat card | `Timeline`, `Checklist`, `UsageBar`, `StatCard`                                                                             |
| GST, PAN, state from GSTIN                | `lib/gst.ts`                                                                                                                |
| Business price                            | `getBusinessPrice()` in `lib/pricing.ts`                                                                                    |
| Dates and India time                      | `lib/dates.ts`, `formatDate` / `formatDateTime` in `lib/format.ts`                                                          |

## 6. Adding things

**A new screen in an existing feature**

1. Add the types to `features/<x>/types.ts`, then the function to `api.ts` with its mock in
   `src/mocks/<x>.ts` (async, filters and paginates like a server).
2. Add `app/(portal)/<route>/page.tsx` (with `metadata` and a permission check) and a
   `loading.tsx` if it loads data.
3. Build the components in `features/<x>/components/`, reusing `components/ui`.
4. Add a menu item in `lib/navigation.ts` if it needs one.

**A new feature**: a new folder in `src/features/`, a new switch in `src/lib/config.ts`, a new
mock file. Nothing existing changes.

**A new permission**: add it to `ALL_PERMISSIONS` and to the roles that get it in
`features/auth/permissions.ts`.

## 7. Code rules (short version of `CLAUDE.md` §8)

- One component per file, `PascalCase.tsx`, named exports, about 150 lines at most.
- Only the theme's colours (Tailwind's default palette is removed); no inline styles; no arbitrary
  values without a comment.
- Orange is for the one main action per section; status colours only for status.
- No `any`, no `@ts-ignore`, no `console.log`, no commented-out code.
- Comments explain why, not what.
- Copy is plain Indian English, sentence case on buttons. Money says "excl. GST" or "incl. GST".
- Libraries are fixed (`CLAUDE.md` §4); anything new needs the lead's approval.

## 8. Known quirks

- `next dev` compiles each page on first visit (10–20 s on Windows); the app isn't stuck.
- Don't run `next dev` and `next start` at the same time: they share `.next/`.
- `AGENTS.md` is written by `next dev`; leave it in place.
- shadcn components import `cn` from the `cn` package (shadcn's own helper); our code imports it
  from `@/lib/utils`. Both are the same function.

---

# Part B: Open questions for the client

**Blocking** questions decide what gets built. **Confirm** questions are about choices already built,
each usually a one-line change. The `#` points to `DECISIONS.md`.

## Blocking: needed before go-live

| #   | Question                                                                                                                                                          | Affects                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Q1  | **Garage parts stock**: do garages need stock tracking for parts (light or full), or is the SpareX order history enough? (#72)                                    | B41                           |
| Q2  | **Fleet**: keep or remove the Fleet screen? (#63)                                                                                                                 | B51                           |
| Q3  | **Final permissions for each garage role**, including who does the quality check: Service Advisor, Billing/QA/Delivery Executive, or both (both today) (#68, #73) | All garage screens, Users     |
| Q4  | **Kannali's bank account** for bank transfers: name, bank, account number, IFSC (#44)                                                                             | Checkout, Pay dues            |
| Q5  | **Razorpay account** and keys (#29)                                                                                                                               | Checkout, Pay dues            |
| Q6  | **Kannali's GSTIN** and registered address for GST invoices and credit notes (#35, #56)                                                                           | Invoices                      |
| Q7  | **Support contact**: phone, WhatsApp, email (#2, #36)                                                                                                             | Help links, error pages       |
| Q8  | **Terms of trade and privacy policy**: text or links (#1)                                                                                                         | Registration                  |
| Q9  | **Brand guide, logo files and product photos** (#3, #4)                                                                                                           | Whole site                    |
| Q10 | **Returns for business buyers**: allowed? If yes, the return window, the reasons and who pays for pickup (#50)                                                    | B15                           |
| Q11 | **Pick-up & drop details** (built): photos or an OTP at the door, driver tracking, and what happens when a pick-up fails (#89)                                    | Bookings, job cards, My trips |
| Q12 | **Branches for non-garage businesses** (dealers, fleets): several delivery addresses, or one?                                                                     | B24                           |
| Q13 | **Out-of-state buyers**: do any businesses outside Karnataka buy? If yes, invoices need IGST                                                                      | Pricing, invoices             |
| Q14 | **SMS / WhatsApp provider** for 2-step codes and customer updates (DLT-registered sender in India)                                                                | Sign-in, garage updates       |

## Confirm: already built, easy to change

**Buying**

| #   | Question                                                                            | Today                                                      |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Q15 | Can a business use credit while an invoice is overdue? (#27)                        | Yes, with a warning                                        |
| Q16 | Delivery charge rule (#6)                                                           | Free from ₹5,000; otherwise ₹250 + GST                     |
| Q17 | Back-orders: order more than the branch has in stock? Out-of-stock parts? (#8, #26) | More than stock: yes. Out of stock: no                     |
| Q18 | Low-stock level (#7)                                                                | 10 units, the same for every part                          |
| Q19 | Business price rounding (#41)                                                       | To the nearest rupee                                       |
| Q20 | Quotations (#48)                                                                    | Priced at once, valid 7 days; "Requested" = revision asked |
| Q21 | Cancelling orders: part-cancellations? Refund wording? (#49)                        | Whole order only; "5–7 working days"                       |
| Q22 | Credit dues: part-payment of an invoice? PDF statement as well as Excel? (#53, #54) | Whole invoices; CSV only                                   |
| Q23 | Vehicle types (#45)                                                                 | Two-wheeler, three-wheeler, car, commercial                |
| Q24 | Quick order keys (#23)                                                              | Enter: next row; Ctrl+Enter: add all to cart               |

**Access**

| #   | Question                                                                       | Today                                    |
| --- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| Q25 | Registration: email required; licences as photos only, or PDFs too? (#38, #57) | Email required; photos only              |
| Q26 | Password rule (#59)                                                            | 8+ characters with a letter and a number |
| Q27 | How long a sign-in lasts before asking again                                   | Not set yet                              |

**Garage**

| #   | Question                                                                               | Today                                       |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| Q28 | One garage profile for all branches, or hours and prices per branch? (#61)             | One for all                                 |
| Q29 | Default price of a part on a garage estimate (#70)                                     | MRP excl. GST                               |
| Q30 | Garage invoice number format; bill of supply for garages without GSTIN? (#74)          | SSW/26-27/0001; always a tax invoice        |
| Q31 | Default next-service reminder (#76)                                                    | 3 months or 3,000 km                        |
| Q32 | Can the Manager hand vehicles over? (#81)                                              | Yes, like the Billing/QA/Delivery Executive |
| Q33 | Only the Owner edits the garage profile, branches and users? (#64)                     | Yes                                         |
| Q34 | Owners switch garage branch from the top bar, or with each page's Branch filter? (#65) | Branch filter per page                      |
| Q35 | Should the Spares executive see customer history on job cards?                         | No (the link is a known gap, 02 #16)        |
