# 1. Project status

**Kannali Garage OS**: the B2B website of Kannali Garage's SpareX platform.
Status as of 29 Oct 2026. Read with [02 Pending work and gaps](02-pending-work-and-gaps.md).

---

## In one paragraph

The whole launch scope is designed and built on **demo data**: **50 of the 52 launch screens** are
built, and the remaining 2 are waiting for client answers. Every screen works end to end in the
browser, on desktop and phone, for every garage role. There is **no backend yet**: data comes from
demo files that live in the server's memory, payments are simulated, and nothing is emailed or sent
by SMS. The frontend is written so that each feature can be switched to the real backend one at a
time without changing the screens (see [03 Backend integration](03-backend-integration.md)).

## Numbers

|                                    |                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| Launch screens                     | **52**: 50 built, 2 waiting for the client (B41, B51)                                            |
| Pages (routes)                     | 53, plus one CSV download route                                                                  |
| Feature modules                    | 21 (`src/features/*`)                                                                            |
| Backend calls the frontend expects | 82 API functions (81 in `api.ts` files plus the session), each with a typed request and response |
| Server Actions (form submissions)  | 40                                                                                               |
| User roles                         | Owner, plus 5 garage roles (Manager, Technician, Spares, Billing / QA / Delivery)                |
| Code                               | about 470 files, about 30,600 lines of TypeScript                                                |
| Automated tests                    | none yet (see 02)                                                                                |

## What the product does

**Buying (every verified business):** catalogue at the business price (B2C price minus the
business's discount), quick order by part number, cart, checkout with Razorpay / bank transfer /
cash on delivery / credit, orders with cancel and reorder, returns, quotations (auto-priced, valid
7 days), credit summary and statement, payments history, GST invoices and documents.

**Garage (garage businesses only):** dashboard, bookings (accept / decline), walk-ins, vehicle
check-in, job cards with a status timeline, inspection, estimate and customer approval, extra work,
technician assignment and "My jobs" on the phone, quality check, the garage's own GST invoice,
collecting payment, handover, completion report, customers with vehicle history, reviews and branch
reports.

**Company:** business profile, delivery addresses / branches, users and roles (garages only), garage
profile with services, prices and opening hours.

## Stack

Next.js 16 (App Router, TypeScript strict) · Tailwind CSS v4 · shadcn/ui · TanStack Table ·
react-hook-form + zod · Zustand (cart, selected branch) · sonner · lucide-react · Embla.
Hosted on Vercel from the GitHub repo `digistrivemedia-dot/spareX-B2B` (branch `main`).

## Screens by phase

Legend: ✅ built on demo data · ⏸ waiting for the client.

### Phase 1: pricing and payment ✅

| #   | Screen                       | Route               | Status |
| --- | ---------------------------- | ------------------- | ------ |
| B07 | Dashboard                    | `/dashboard`        | ✅     |
| B08 | Catalogue and product drawer | `/catalog`          | ✅     |
| B09 | Quick order                  | `/quick-order`      | ✅     |
| B10 | Cart                         | `/cart`             | ✅     |
| B11 | Checkout                     | `/checkout`         | ✅     |
| B12 | Order placed                 | `/checkout/success` | ✅     |
| B17 | New quotation                | `/quotations/new`   | ✅     |

### Phase 2: orders, returns and quotations ✅

| #   | Screen                                    | Route                                              | Status |
| --- | ----------------------------------------- | -------------------------------------------------- | ------ |
| B13 | Orders list and reorder                   | `/orders`                                          | ✅     |
| B14 | Order detail, tracking, invoice, cancel   | `/orders/[id]`                                     | ✅     |
| B15 | Return request and status                 | `/orders/[id]/return`, `/returns`, `/returns/[id]` | ✅     |
| B16 | Quotations list                           | `/quotations`                                      | ✅     |
| B18 | Quotation detail (accept, reject, revise) | `/quotations/[id]`                                 | ✅     |

### Phase 3: credit, payments and documents ✅

| #   | Screen                        | Route                                 | Status |
| --- | ----------------------------- | ------------------------------------- | ------ |
| B19 | Credit summary and statement  | `/credit`                             | ✅     |
| B20 | Pay dues                      | dialog on `/credit`                   | ✅     |
| B21 | Payments history and receipts | `/payments`, `/payments/[id]/receipt` | ✅     |
| B22 | Invoices and documents        | `/invoices`                           | ✅     |

### Phase 4: access ✅

| #   | Screen                          | Route                                 | Status |
| --- | ------------------------------- | ------------------------------------- | ------ |
| B01 | Sign in and 2-step verification | `/login`                              | ✅     |
| B02 | Forgot / reset password         | `/forgot-password`, `/reset-password` | ✅     |
| B03 | Registration (4 steps)          | `/register`                           | ✅     |
| B04 | Application submitted           | `/register/submitted`                 | ✅     |
| B05 | Application status              | `/application`                        | ✅     |
| B06 | First login: set password       | `/set-password`                       | ✅     |

### Phase 5: company, users and garage setup

| #   | Screen                | Route                                       | Status            |
| --- | --------------------- | ------------------------------------------- | ----------------- |
| B23 | Business profile      | `/company`                                  | ✅                |
| B24 | Delivery addresses    | `/company/addresses`                        | ✅                |
| B25 | Users list            | `/company/users`                            | ✅                |
| B26 | Add / edit user       | `/company/users/new`, `/company/users/[id]` | ✅                |
| B28 | Garage profile editor | `/garage/profile`                           | ✅                |
| B29 | Branches              | `/garage/branches`                          | ✅                |
| B51 | Fleet                 | none                                        | ⏸ keep or remove? |

### Phase 6: garage dashboard, bookings, walk-ins and job cards ✅

| #   | Screen                       | Route                        | Status |
| --- | ---------------------------- | ---------------------------- | ------ |
| B27 | Garage dashboard             | `/garage`                    | ✅     |
| B30 | Bookings list                | `/garage/bookings`           | ✅     |
| B31 | Booking detail               | `/garage/bookings/[id]`      | ✅     |
| B32 | New walk-in job              | `/garage/jobs/new`           | ✅     |
| B33 | Vehicle check-in             | `/garage/jobs/[id]/check-in` | ✅     |
| B34 | Job cards list               | `/garage/jobs`               | ✅     |
| B35 | Job card detail and timeline | `/garage/jobs/[id]`          | ✅     |

### Phase 7: inspection, estimates, technicians and quality check

| #   | Screen                                 | Route                                     | Status                       |
| --- | -------------------------------------- | ----------------------------------------- | ---------------------------- |
| B36 | Inspection checklist and photos        | `/garage/jobs/[id]/inspection`            | ✅                           |
| B37 | Estimate builder and customer approval | `/garage/jobs/[id]/estimate`              | ✅                           |
| B38 | Revised estimate (extra work)          | `/garage/jobs/[id]/estimate/revision`     | ✅                           |
| B39 | Assign technician                      | dialog on the job card                    | ✅                           |
| B40 | My jobs (technician, phone-first)      | `/garage/my-jobs`, `/garage/my-jobs/[id]` | ✅                           |
| B41 | Parts for this job                     | section on the job card                   | ⏸ needs the inventory answer |
| B42 | Quality check                          | `/garage/jobs/[id]/quality-check`         | ✅                           |

### Phase 8: billing, handover, customers, reviews and reports ✅

| #   | Screen                       | Route                        | Status |
| --- | ---------------------------- | ---------------------------- | ------ |
| B43 | Completion report            | `/garage/jobs/[id]/report`   | ✅     |
| B44 | Billing and invoice          | `/garage/jobs/[id]/invoice`  | ✅     |
| B45 | Collect payment              | dialog on the invoice        | ✅     |
| B46 | Delivery / handover          | `/garage/jobs/[id]/handover` | ✅     |
| B47 | Customers list               | `/garage/customers`          | ✅     |
| B48 | Customer and vehicle history | `/garage/customers/[id]`     | ✅     |
| B49 | Reviews received             | `/garage/reviews`            | ✅     |
| B50 | Branch reports               | `/garage/reports`            | ✅     |
| B52 | 404 / error pages            | global                       | ✅     |

## Flows tested end to end

Tested in a real browser on a production build, as the relevant role:

| Flow                                                                                                                                                                      | Result                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Catalogue → cart → checkout (all 4 payment methods) → order placed                                                                                                        | ✅                                       |
| Quick order by part number → cart                                                                                                                                         | ✅                                       |
| Quotation request → accept → checkout at quoted prices; reject; ask for revision                                                                                          | ✅                                       |
| Order cancel (until shipped) and return request → returns list → return detail                                                                                            | ✅                                       |
| Credit: pay dues online / by bank transfer → statement updates                                                                                                            | ✅                                       |
| Registration → submitted → application status (under review, sent back, rejected)                                                                                         | ✅                                       |
| Sign in, 2-step verification, first-login password, forgot / reset password                                                                                               | ✅                                       |
| Company: profile, addresses, users (add, edit, disable, resend invite)                                                                                                    | ✅                                       |
| Booking → accept → check-in → inspection → estimate → approval → assign technician → technician accepts and ticks tasks → QA pass → invoice → payment → handover → report | ✅                                       |
| Walk-in by number plate (new and existing vehicle)                                                                                                                        | ✅                                       |
| Side paths: extra work → approval again; QA rework → back to technician; all items turned down → job closed with no fee                                                   | ✅                                       |
| Every link on every page, as Owner, Manager, Billing and Technician: no "page not found"                                                                                  | ✅ (one gap for the Spares role, see 02) |
| Every page at 1440, 1024, 768 and 375 px: no horizontal scroll, no console errors                                                                                         | ✅                                       |

## Added on 2 Nov 2026

- **Bookings, Job cards and My jobs** rebuilt as work queues: each row shows the vehicle, its stage
  and the next step. New booking alert with a 5-second timer (Accept or Decline).
- **Pick-up & drop**: garage setting, trips on the job card, My trips for drivers, cash at the door.
- The job card shows a tick for every finished stage and step. The customer's answer is Approve or
  Reject.

## Fixes on 30 Oct 2026

- Next.js upgraded to 16.4.3 (security fix); builds pass every time.
- Every page and Server Action checks the role; job actions also check the branch.
- The API client sends the session token, treats a 404 as "not found", and reads a server-only
  address. The browser no longer calls the API directly.
- Security headers on every page; CI (lint, typecheck, format, build) on GitHub.
- Inspection answers line up from row to row; "1 item needs work" wording; the Spares role no
  longer sees a dead "Service history" link.
- Every workflow above was tested end to end again after these changes, as each role involved.

## Fixes after the client demo (28 Oct 2026)

These are done but **not committed yet**; they're waiting for your local review:

- The job card shows nine stages with a tick for each finished one, plus "Done" on each section.
- Services booked by the customer now start the estimate at the garage's prices.
- No role sees a button or link to a page it can't open (this caused the "page not found" seen in
  the demo). The Manager can now hand vehicles over, as the brief says.
- Buttons keep spinning until the next page opens (the screen used to look frozen in dev mode).
- Demo dates use India's calendar day (they were a day off before 5.30 am).
- Number plates no longer stretch on phones; clearer billing and inspection sections.
