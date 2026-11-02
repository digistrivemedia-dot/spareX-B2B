# 2. Pending work and gaps

Everything that isn't finished, from a full review of the code and an end-to-end test of every
flow (29 Oct 2026). Grouped by priority:

- **P0**: blocks go-live. Must be done before real businesses use the site.
- **P1**: should be done for launch; the site works without it but with a real risk or a gap.
- **P2**: improvements; safe to do after launch.

The "Who" column says who unblocks it: **FE** frontend, **BE** backend, **Client** Kannali,
**You** project lead / DevOps.

---

## Fixed on 30 Oct 2026

Items 1, 4, 5, 6, 16 and 22 are fixed; 18 and 20 are partly done (details in their rows). Every
workflow was then tested end to end again; see 01, "Flows tested end to end".

---

## Screens not built

| #   | Screen                                        | Why                                                                                                                                               | Who             |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| B41 | Parts for this job (order from SpareX, stock) | Waiting for the client's answer on garage inventory: light or full. Today the job card lists the approved parts and the technician ticks them off | Client, then FE |
| B51 | Fleet                                         | Keep or remove? Not in the menu; nothing built                                                                                                    | Client          |

All 50 other launch screens are built. There are no half-built pages.

---

## P0: blocks go-live

| #   | Gap                                                         | Detail                                                                                                                                                                                                                                                        | Who                            |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | ✅ **Next.js security vulnerability**: fixed 30 Oct         | Upgraded to Next.js 16.4.3 (and zod 4.6.6 plus the shadcn CLI's packages via `npm audit fix`). Builds pass every time. Three low findings remain inside the shadcn CLI only, which never runs in the app                                                      | Done                           |
| 2   | **No backend**                                              | Every feature reads demo data (`src/lib/config.ts`: all `"mock"`). Orders, payments and jobs live in server memory: they reset on restart and **are lost between requests on Vercel**. Many "page not found" errors on the live demo come from this           | BE                             |
| 3   | **Anyone is signed in**                                     | The demo session never returns "signed out": visiting the site without logging in makes you the garage owner. Real auth (`features/auth/session.ts`) must replace the demo session                                                                            | BE, FE                         |
| 4   | ✅ **Server Actions check who is calling**: fixed 30 Oct    | Every action now checks the session and role (`authorizeAction` in `features/auth/session.ts`); job actions also check the branch (`authorizeJobAction`). The backend must still check every request                                                          | Done (FE), BE                  |
| 5   | ✅ **The API client sends the session token**: fixed 30 Oct | `lib/api-client.ts` reads the session cookie on the server and sends it as a Bearer token. Browser components no longer call `api.ts` directly; they go through Server Actions                                                                                | Done                           |
| 6   | ✅ **"Not found" from the API**: fixed 30 Oct               | `apiClientOrNull()` turns a 404 into `null` for every "get one" call, so missing records show the not-found page                                                                                                                                              | Done                           |
| 7   | **Payments are simulated**                                  | Razorpay (UPI / card / net banking) marks orders paid without a gateway. Needed: backend creates the Razorpay order, the frontend opens Razorpay Checkout, the backend verifies the signature and handles webhooks; admin marks bank transfers / COD paid     | BE, FE, Client (Razorpay keys) |
| 8   | **Photos are sent inside the form**                         | Registration, returns, check-in, inspection, progress and handover photos are resized in the browser and sent as data inside the request (limit 4 MB, `next.config.ts`). The backend needs an upload endpoint (or signed upload URLs) that returns photo URLs | BE, FE                         |
| 9   | **Nothing is emailed or sent by SMS**                       | User invites, password reset links, 2-step codes, application decisions, booking and job updates to the garage's customers                                                                                                                                    | BE                             |
| 10  | **Admin panel**                                             | Verifying businesses, setting the discount %, enabling credit, marking bank transfer / COD paid, issuing GST invoices and credit notes. Separate repo, not started                                                                                            | BE                             |
| 11  | **Real documents**                                          | GST invoices, credit notes and quotation PDFs are clearly-marked samples in `public/documents/`. The backend must generate the real ones with Kannali's GSTIN                                                                                                 | BE, Client (GSTIN)             |
| 12  | **Client content**                                          | Kannali's bank account, GSTIN, support contact, terms of trade and privacy policy, logo and brand colours, product photos (see doc 05, open questions)                                                                                                        | Client                         |
| 13  | **Demo-only parts still switched on**                       | Demo hints on sign-in, "any 6 digits" 2-step codes and demo logins. They switch off with `dataSource.auth = "api"`; check the sign-in page after the switch                                                                                                   | FE                             |
| 14  | **Uncommitted fixes**                                       | The fixes after the client demo (28 files) are waiting for your local review; commit and push before the next deploy                                                                                                                                          | You                            |

---

## P1: should be done for launch

| #   | Gap                                        | Detail                                                                                                                                                                                                                                                                                                     | Who                        |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 15  | **Final permissions per garage role**      | `features/auth/permissions.ts` uses the brief's starting table. The client still has to confirm it, including who owns the quality check                                                                                                                                                                   | Client, then FE (one file) |
| 16  | ✅ **Spares role dead link**: fixed 30 Oct | "Service history" shows only to roles that can see customers                                                                                                                                                                                                                                               | Done                       |
| 17  | **Branch switching for garage owners**     | The brief says owners switch branch from the top bar. Today the top bar's "Deliver to" is for parts orders only; garage lists use a Branch filter on each page (DECISIONS #65). Confirm or change                                                                                                          | Client, FE                 |
| 18  | **No automated tests** (CI added 30 Oct)   | GitHub Actions now runs lint, typecheck, format check and build on every push and pull request (`.github/workflows/ci.yml`). Still missing: unit tests for `lib/pricing`, `lib/gst` and the job status rules, and one end-to-end test per core flow (needs a test runner, which needs the lead's approval) | FE                         |
| 19  | **No error monitoring or analytics**       | Production errors are invisible today. Add an error tracker (e.g. Sentry) and basic analytics. The brief needs the lead's approval for new libraries                                                                                                                                                       | You, FE                    |
| 20  | **Security headers** (partly done 30 Oct)  | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy are set in `next.config.ts`. Still missing: a Content-Security-Policy, once the outside services (Razorpay, monitoring) are known                                                                                    | FE                         |
| 21  | **Session lifetime**                       | The session cookie has no expiry and there is no refresh or "sign out everywhere". Decide the session length and idle timeout with the backend                                                                                                                                                             | BE, FE                     |
| 22  | ✅ **API URL variable**: fixed 30 Oct      | Now the server-only `API_BASE_URL` (`.env.example`)                                                                                                                                                                                                                                                        | Done                       |
| 23  | **Sign-in protection**                     | Rate limiting and lock-out on sign-in, 2-step codes and password reset                                                                                                                                                                                                                                     | BE                         |
| 24  | **Live demo keeps losing data**            | Until the backend exists, the Vercel demo loses changes between clicks (P0 #2). If the client keeps testing on Vercel, add a small shared demo store (free Upstash Redis on Vercel)                                                                                                                        | You, FE                    |
| 25  | **Returns for B2B**                        | Built as listed, but the client hasn't confirmed B2B returns, the return window or who pays for pickup                                                                                                                                                                                                     | Client                     |
| 26  | ✅ **Pick-up & drop**: built               | Garage profile setting, booking alert, job card trips, My trips, cash at the door. Details still to confirm with the client (DECISIONS #89)                                                                                                                                                                | Client                     |
| 27  | **Inter-state GST (IGST)**                 | Invoices and totals split GST into CGST + SGST only. If any buyer is outside Karnataka, IGST is needed; the backend should return the split                                                                                                                                                                | Client, BE, FE             |

---

## P2: after launch

| #   | Item                                                       | Detail                                                                                                                              |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 28  | Accessibility audit                                        | Built to WCAG AA (labels, focus, contrast, keyboard). Still do a screen-reader pass (NVDA, VoiceOver) and Lighthouse on key screens |
| 29  | Browser and device test                                    | Tested in Chrome at 4 widths. Test Safari on iPhone, Chrome on Android, Edge and Firefox                                            |
| 30  | Performance check                                          | Lighthouse and Vercel Speed Insights on the catalogue, orders and job card after the backend is live; check the API response times  |
| 31  | Remove demo data                                           | When every feature is live, delete `src/mocks/` and the sample PDFs (see 03)                                                        |
| 32  | Frequently ordered                                         | The dashboard shows a fixed list; the backend should work it out from each business's orders                                        |
| 33  | Review replies, PDF statement, PDF uploads in registration | Mentioned in DECISIONS; not in the launch list                                                                                      |
| 34  | B2B mobile app                                             | Reuses these screens' API contract; separate repo, later                                                                            |
| 35  | `shadcn` package                                           | Stays in `dependencies`: `globals.css` imports `shadcn/tailwind.css` at build time. No change needed                                |

---

## Demo-only behaviour (works now, must become real)

| Area                                   | Today (demo)                                             | With the backend                       |
| -------------------------------------- | -------------------------------------------------------- | -------------------------------------- |
| Sign-in                                | Any password of 8+ characters; demo emails pick the role | Real accounts, hashed passwords        |
| 2-step verification                    | Any 6 digits                                             | Code sent by SMS or email, expiring    |
| Session                                | Not signed in = owner                                    | Not signed in = sign-in page           |
| Data                                   | Server memory, resets                                    | Database                               |
| Razorpay                               | Marked paid at once                                      | Real gateway and webhook               |
| Bank transfer / COD                    | Shows "awaiting" until the demo marks it                 | Admin marks it paid                    |
| Garage "online" payment                | Reference noted only                                     | Payment link / UPI from the gateway    |
| Photos                                 | Kept in memory as data                                   | Stored files, returned as URLs         |
| Invoices, credit notes, quotation PDFs | Sample PDFs                                              | Generated by the backend               |
| Notifications (bell)                   | Four fixed items                                         | From the backend                       |
| PIN code → city and state              | A few demo PINs                                          | Real PIN lookup                        |
| Reviews                                | Demo reviews                                             | Written by customers in the SpareX app |

---

## Known limits by design (not bugs)

- **Dev mode is slow to open a page the first time** (10–20 s on Windows while it compiles). Use
  `npm run build` then `npm start` for demos.
- **Branch scoping**: staff see only their own branch, by design.
- **Other garages' history** on a vehicle shows without prices, by design.
- **No garage stock module or supplier list**: out of launch scope (Phase 2 of the product).
