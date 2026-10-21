# Decisions for review

Things that need your call, or assumptions made to keep building. Each item says what was done,
what the options are, and what I recommend. Nothing here blocks the demo; change any of them later.

**Status key:** 🟡 needs your input · 🔵 assumption, confirm or change · ⚪ technical, FYI

---

## Content and business rules

### 1. 🟡 Terms of trade (B03, registration)

The registration checkbox says "I agree to Kannali Garage's terms of trade for business customers"
with no link, because there is no terms document yet.
**Need:** a URL or the text, and whether a separate privacy policy link is wanted.

### 2. 🟡 Support contact (Screens 7 and 8)

"Need help" and the error pages say "call your Kannali account manager".
**Need:** a phone number, WhatsApp number and/or email to show instead.

### 3. 🟡 Product photos (Screen 3)

No product photos exist, so every part shows a neat category-icon placeholder. The two offer
banners use free Unsplash photos (credited in `public/images/CREDITS.md`).
**Need:** product photos from the client. Adding them needs no code change: the image URLs come
with the product data.

### 4. 🟡 Brand guide

Colours and the "SpareX Business" text logo are placeholders, as the brief says.
**Need:** the brand guide and logo files. Colours change in one place (`src/app/globals.css`);
the logo is one file (`src/components/layout/Logo.tsx`).

### 5. 🔵 Quotation attachments (Screen 6)

Two sample PDFs (QT-2026-0093, QT-2026-0088) are in `public/documents/`, clearly marked
"sample document for the demo". The real PDFs will come from the admin panel / backend.

### 6. 🔵 Delivery charge

Orders of ₹5,000 or more (excl. GST) are delivered free; smaller orders pay ₹250 + 18% GST.
The cart says so when the charge applies. Every demo order is above ₹5,000.
**Confirm:** the real rule (threshold, fee, per branch or per area?). It lives in one place:
`src/lib/pricing.ts`.

### 7. 🔵 Low-stock level

A part shows as "Low" at 10 units or fewer at the delivery branch.
**Confirm:** one number for all parts, or per product (e.g. per carton)?

### 8. 🔵 Out-of-stock parts can't be added to the cart

"Add" is disabled when the delivery branch has none.
**Options:** (a) keep (recommended for now); (b) allow back-orders with an "expected in X days" note.

### 9. 🔵 Frequently ordered (Screen 2)

The dashboard shows a fixed list of 6 parts. The real backend should work this out from each
business's order history.

### 10. 🔵 "2 quotations awaiting" wording (Screen 2)

The brief's example says 2; the demo data (as the brief also specifies) has exactly 1 quotation
awaiting a reply, so the dashboard says 1. Nothing to do unless you want a second one in the demo.

### 11. 🔵 MRP shown without "incl. GST"

In the catalogue, MRP reads "MRP ₹1,950". In India an MRP always includes all taxes, so the
extra label was dropped to make the table fit. Business prices still say "excl. GST" everywhere.

## Features added beyond the brief

### 12. 🔵 Forgot password page

The sign-in screen needed somewhere for "Forgot password?" to go, so `/forgot-password` asks for
an email and confirms without revealing whether the account exists.

### 13. 🔵 Notifications

The top-bar bell shows four demo notifications (order out for delivery, quotation ready, invoice
overdue, payment received). They will come from the backend.

### 14. 🔵 Demo-only hints and 2-step verification

Sign-in shows a dashed hint explaining the demo rules. 2-step verification appears only for
mahesh@srisaiworks.example.com (any 6 digits work). Both disappear automatically once real auth
is switched on in `src/lib/config.ts`.

## How screens behave

### 15. 🔵 Selected delivery branch is stored in the browser

The brief puts the chosen branch in browser storage, which the server can't read. So the
catalogue's "In stock at Whitefield" filter records the branch in the link (`?stock=br-whitefield`).
**Recommendation:** when the backend arrives, keep the selected branch in a cookie (or on the user's
profile) so pages can be rendered for the right branch from the start.

### 16. 🔵 Catalogue table columns

To fit at 1366 px and above without hiding anything, brand and fitment sit under the part name,
the bulk price under the price, and pack size / MOQ under the quantity box. All the information
the brief lists is still in every row.

### 17. 🔵 Tables switch to cards by available width

The brief says tables become cards below `md` (768 px screen). They now switch when the table's
own space is under 768 px, which also covers a laptop with the sidebar open (two cards per row
there). Wide tables therefore never hide columns off to the side.

## Technical

### 18. ⚪ Next.js "Cache Components" is off

New Next.js 16 projects turn it on by default. It is off here because every page shows per-user
data; it would only add complexity. It can be turned on later in `next.config.ts`.

### 19. ⚪ TanStack Table version 9

The current stable version is used. shadcn's documentation still shows version 8; the
DataTable pattern is the same.

### 20. ⚪ Forms use shadcn's `Field` components

This shadcn version replaced its `Form` component with `Field` + react-hook-form's `Controller`.
The brief's "react-hook-form + zod through shadcn" is followed with the current components.

### 21. ⚪ Small fixes to generated shadcn code

The sidebar's mobile check, the carousel's scroll buttons and the toast theme were rewritten to
pass the project's lint rules (no state updates inside effects; light theme only).

## Quick order (Screen 4)

### 22. 🔵 Rows are an entry form, not the shared DataTable

The brief says every table uses the one DataTable. Quick order's rows are a form you type into
(inputs, suggestions, Enter to move on), so they use their own row layout with the same look.
Lists of records (orders, invoices, the catalogue) all still use the DataTable.

### 23. 🔵 Keyboard

Enter picks a suggestion, then Enter in the quantity box moves to the next row (adding one if
needed), as Screen 4 describes. The general UX rule "Enter adds to cart in Quick Order" is
covered by **Ctrl+Enter** (Cmd+Enter on a Mac), which adds every ready row to the cart.
**Confirm** that this split works for your users.

### 24. 🔵 What "Add all to cart" takes

Rows that are ready, adjusted (MOQ or pack size) or above the branch's stock go to the cart;
the cart will warn about stock. Rows that are not found or out of stock stay on the page.
Quick order rows are not saved if you leave the page.

### 25. ⚪ "Request quotation for these"

Passes the parts and quantities to the quotation request page in its link
(`/quotations/new?items=…`); that page is built in Screen 6.

## Cart and checkout (Screen 5)

### 26. 🔵 What stops checkout

Lines that are out of stock at the delivery branch, or below the MOQ / not a whole number of
packs, must be fixed first (the cart offers a one-click "Change to 10"). Lines above the
branch's stock can still be ordered, with a note that the rest follows when it arrives.
**Confirm:** should Kannali accept back-orders like this, or cap orders at stock?

### 27. 🟡 Credit when invoices are overdue

"Use credit" is allowed while an invoice is overdue, with a warning. It is disabled only when
the order total is more than the credit available.
**Options:** (a) keep (current); (b) block credit orders while anything is overdue;
(c) block only after N days overdue.

### 28. 🔵 Delivery branch at checkout is the top-bar branch

Choosing a branch at checkout changes the delivery branch everywhere (and its stock warnings),
so there is only ever one "delivering to" choice.

### 29. 🟡 Online payment

"Pay online" (UPI / net banking / card) is a demo: no gateway is called and the order is marked
paid. **Need:** the payment gateway Kannali uses or prefers (e.g. Razorpay, PayU, Cashfree)
before Phase 1.

### 30. ⚪ Placing an order runs on the server

Checkout calls a Next.js Server Action, which calls the orders API. In the demo the new order is
kept in server memory, so it appears in orders until the server restarts.

## Quotations (Screen 6)

### 31. 🔵 What "Accept & checkout" does

Now option (b): accepting opens checkout with the quoted parts at the quoted prices, delivered to
the quotation's branch. The buyer adds a PO number and picks any payment method. The cart isn't
touched. Changing the branch means asking for a revision.

### 32. 🔵 Asking for a revision

The quotation goes back to "Requested" with your comment in its history; the old quoted prices
stay visible until Kannali sends new ones. The brief's five statuses are kept (no separate
"revision requested" status).

### 33. 🔵 Requesting a quotation for out-of-stock parts

Allowed (it is often the reason to ask). The rows still show their stock status.

### 34. ⚪ Compact tables

Short tables (like a quotation's parts) stay a table down to 42rem instead of 48rem, so they
don't become cards beside the side panel on a laptop.

## Orders and invoices (Screen 7)

### 35. 🔵 GST invoices

Invoices are raised when an order ships, so open orders show "Raised when the order ships" and
the download appears after dispatch. The three demo invoices are sample PDFs generated from the
order data (CGST + SGST 9% each, as both parties are in Karnataka), clearly marked as samples.
The real invoice PDF will come from the backend; Kannali's own GSTIN is needed for it.

### 36. 🟡 "Need help with this order?"

Opens an email to a placeholder address with the order number in the subject. Depends on the
support contact in item 2 (phone, WhatsApp or email).

### 37. 🔵 Orders list filters

Search by order or PO number (ignores spaces and slashes), status (including "Open"), branch,
and the date the order was placed. Payment shows "Credit · due <date>" (amber within 3 days, red
when overdue), "Paid" or "Credit · invoiced at dispatch".

## New screen list (21 Oct 2026)

The brief (`CLAUDE.md`) now follows the 52-screen launch list. Phase 1 removed MOQ, pack rules and
tier prices, so items 24 and 26 now only concern stock, and item 29 is answered (Razorpay).

### 38. 🔵 Email is required at registration

The list makes only name, phone, location and photos required, but login is by business email,
so email (and business type, which decides the Garage section) are required too.

### 39. 🔵 Pack sizes

"No minimum order quantity" is read as: buyers can order any number of units. Pack size
("carton of 12") stays as product information only, not a rule.

### 40. 🔵 Corrections to the screen list

- **Counts:** the summary didn't match the tables. With the changes below it is 8 BUILT,
  8 UPDATE, 5 PLACEHOLDER, 30 TO BUILD and 1 WAIT.
- **B52 (404 / error):** marked BUILT, as both pages already exist.
- **B25 (Users list):** marked TO BUILD, as it was never built.
- **B09 (Quick order) and B10 (Cart):** marked UPDATE, as they still check MOQ and pack sizes.

## Phase 1: pricing and payment (B07–B12, B17)

### 41. 🔵 Business prices are rounded to whole rupees

Business price = B2C price × (100 − discount %) ÷ 100, rounded to the nearest rupee
(`getBusinessPrice` in `src/lib/pricing.ts`). The demo business has a 15% discount. The real
backend should return the same number. **Confirm** the rounding rule.

### 42. 🔵 Who can buy until the role permissions are final

Owner: everything. Spares & inventory executive: catalogue, quick order, cart, orders and
quotations. Manager, technician and billing see only the dashboard until the Garage screens
arrive; credit and company are owner-only. One list per role in `src/features/auth/permissions.ts`.

### 43. 🔵 Pasted lines without a quantity

A pasted line with only a part number asks for 1 unit, with no warning, since there is no
minimum quantity any more.

### 44. 🟡 Kannali's bank account

Bank transfer shows placeholder account details (`src/features/payments/bank-account.ts`).
**Need:** Kannali's real account name, bank, account number and IFSC.

### 45. 🔵 Vehicle types

The catalogue now covers Two-wheeler, Three-wheeler, Car and Commercial vehicle, filtered type →
make → model. Five car and three-wheeler parts were added to the demo (45 parts in all).
**Confirm** the list of vehicle types.

### 46. ⚪ Fleet vehicles removed from the demo data

B51 (Fleet) stays out of the app until the client decides, so its unused demo data was removed.

### 47. 🔵 Bank transfer and cash on delivery

Bank transfer orders show as "Awaiting bank transfer" and are dispatched once Kannali marks them
paid; the buyer may add a UTR at checkout. Cash on delivery shows as "Cash on delivery" until
paid. Razorpay is a demo: the order is marked paid at once.

## Phase 2: orders, returns and quotations (B13–B16, B18)

### 48. 🔵 "Auto-priced" quotations

A new quotation is priced at once at the business prices and is "Awaiting you" for 7 days.
"Requested" now means the buyer asked for a revision and Kannali is preparing new prices.
**Confirm** this reading of "quotations are auto-priced".

### 49. 🔵 Cancelling an order

Any order not yet shipped (placed, confirmed, processing, packed) can be cancelled as a whole,
with a reason from a fixed list and an optional note. Paid orders show "Refunded" and the message
"refunded in 5–7 working days". **Confirm** the refund wording and whether part-cancellations are needed.

### 50. 🟡 Returns rules (built, can be switched off)

Built as listed in B15, pending the client's answer on B2B returns. Assumptions: any delivered
order can be returned, with no time limit; a photo is required for "damaged" and "defective";
credit orders are refunded as a credit note, others to the way they paid; Kannali arranges the
pickup. **Need:** the return window, the reasons list and who pays for pickup.

### 51. ⚪ Shared photo upload

Photos are resized in the browser to about 1280 px (around 150 KB) before upload. The demo keeps
them in server memory; the backend will store them and return URLs.

## Phase 3: credit, payments and documents (B19–B22)

### 52. 🔵 Menu for money pages

"Credit & payments" is now three items under Account: **Credit** (only when credit is enabled),
**Payments** and **Invoices & documents** (for every business).

### 53. 🔵 Paying dues

Paying online (Razorpay, demo) settles the chosen invoices at once and raises the credit
available. Paying by bank transfer needs the UTR; the invoice then shows "Transfer being
checked" until Kannali confirms it. Part-payments of one invoice aren't offered.
**Confirm** both rules.

### 54. 🔵 Statement download is a CSV file

"Download statement" gives a CSV that opens in Excel, for the dates shown, with opening and
closing balances. **Confirm** whether a PDF statement is also needed.

### 55. 🔵 Receipts print from the browser

Each successful payment has a receipt page with "Print or save as PDF". The same approach will
serve garage invoices and completion reports (B43, B44).

### 56. ⚪ Demo invoices and credit notes

Every invoice and credit note in the demo has a sample PDF in `public/documents/`, marked as a
sample. Kannali's own GSTIN (shown as a placeholder) is needed for real ones.

## Phase 4: access (B01–B06)

### 57. 🔵 Registration fields

Four steps: Business (name, type, optional GSTIN which fills PAN and state, optional PAN,
optional licence number, other registration and certificate photos) · Contact and location
(optional contact person, email, mobile, address with PIN lookup) · Shop photos (1 to 6) ·
Review. Licences and certificates are uploaded as photos; PDFs aren't accepted yet.
**Confirm** whether PDF uploads are needed.

### 58. 🔵 Application status

Unverified accounts land on `/application` after sign-in: under review, sent back (with
Kannali's notes and "Correct and resubmit", which keeps the same reference) or rejected (with the
reason and "Apply again", which starts a new application with the old details filled in). The
demo shows each state with review@, sentback@ and rejected@sparex.example.com.

### 59. 🔵 Passwords

New passwords need 8+ characters with a letter and a number, shown as a live checklist. First
login (demo: new@sparex.example.com) asks for a new password before the dashboard; the reset
link opens `/reset-password`. **Confirm** the password rules.

## Phase 5: company, users and garage setup (B23–B29, B51)

### 60. 🔵 Branches and delivery addresses are the same thing

Each branch is a delivery address for parts. **Company › Delivery addresses** (every business)
lists them as cards with add, edit, make main and remove; **Garage › Branches** (garages) shows the
same branches with staff count and hours. Both use one add/edit form. The main branch is the
default and can't be removed, nor can a branch that still has staff.

### 61. 🔵 One garage profile for every branch

Photos, about, services and prices, vehicle types, opening hours, the daily booking limit
(per branch) and holidays are set once and apply to all branches. **Confirm** whether branches
need their own hours or prices.

### 62. 🔵 Users

New users are "Invited" until they set their password; disabling keeps their history. The
account must always keep at least one active Owner / admin. Users is a Company tab shown only to
garages.

### 63. 🔵 Fleet (B51)

Not built and not in the menu, as listed; waiting for the client's decision.

### 64. 🔵 Who can open garage set-up

Garage profile, Branches and Users are for the Owner / admin role only for now
(`src/features/auth/permissions.ts`).

## Phase 6: garage dashboard, bookings and job cards (B27, B30–B35)

### 65. 🔵 Branch for garage lists

Owners see every branch and can pick one with a "Branch" filter; everyone else only ever sees
their own branch (lists and detail pages both check). The top bar's "Deliver to" is still only
for parts orders.

### 66. 🔵 Accepting a booking

Accepting confirms the slot and opens a job card at "Confirmed", unless the branch already has
its daily booking limit of accepted bookings that day. A new customer or plate from a booking is
added to the garage's customers. Declining needs a reason, which the customer sees.

### 67. 🔵 Walk-ins and check-in

A walk-in starts with the number plate: a plate on file brings up the vehicle and owner, a new
one asks for make, model, owner's name and mobile (an owner already on file by mobile is reused).
Check-in records odometer, fuel, complaints, damage with photos and vehicle photos, and moves the
job to "Job card created". Plates are checked against the usual Indian format and BH series.

### 68. 🔵 Who does what in the garage (until the client confirms)

Manager / service advisor: dashboard, bookings, walk-ins, check-in and job cards. Billing:
dashboard and job cards. Technician: only "My jobs" (Phase 7). Spares: job cards (for parts) and
buying. Owner: everything. Each role's home page follows from this.

## Phase 7: inspection, estimates, technicians and quality check (B36–B42)

### 69. 🔵 Demo sign-in as a team member

Signing in now keeps a session cookie, as real sign-in will. In the demo, team members' emails
sign in as them: ravi@ (manager, HSR), imran@ (technician, Whitefield), venkatesh@ (technician
and spares, HSR), shilpa@ (billing) at srisaiworks.example.com. Without signing in, the demo is
the owner. Disabled users can't sign in; invited ones are asked for a password first.

### 70. 🔵 The estimate

Built from the inspection (one line per item that needs work). Services come from the garage's
price list; parts are searched in the SpareX catalogue and default to their MRP (excl. GST), since
garages sell parts on at retail. GST per line (18% by default). The customer's answer is recorded
line by line with how they answered (in person, phone, WhatsApp, app). All turned down on a first
estimate → the job closes with no fee. **Confirm** the default part price.

### 71. 🔵 Technicians accept their jobs

Assigning a technician (branch technicians, with how many jobs each has on) leaves the job at
"Approved" until they accept in My jobs, which starts the service; they can hand it back with a
reason. They tick off tasks and parts, add updates with photos, flag extra work for the manager,
and send the vehicle to quality check once everything is ticked.

### 72. 🟡 Parts for this job (B41)

Waiting for the inventory answer. The job card's Parts section lists the approved parts and the
technician ticks them as fitted; ordering from SpareX and stock tracking are not built.

### 73. 🔵 Quality check

Every check must be ticked to pass ("Ready for delivery"); "Send back for rework" needs a note
and returns the job to the technician. Both the manager and the billing, QA & delivery role can
do it until the client decides who owns QA.

## Phase 8: billing, handover, customers, reviews and reports (B43–B50, B52)

### 74. 🔵 The garage's invoice

Raised once the vehicle passes QA, from the approved lines, in the garage's name, branch address
and GSTIN, with GST split into CGST and SGST (both in Karnataka). Numbered SSW/26-27/0001 onwards.
It prints or saves as a PDF from the browser, like receipts. **Confirm** the invoice number format
and whether a garage without GSTIN gets a bill of supply instead.

### 75. 🔵 Collecting payment

Online (the UPI or payment-link reference is noted; no link is really sent in the demo) or cash
(the amount handed over, with the change to give back). Billing, QA & delivery and the owner can
collect; the job then waits for handover.

### 76. 🔵 Handover and completion report

The handover asks for four ticks (vehicle back, old parts shown, belongings returned, invoice
and report shared), the odometer, and the next service (default: 3 months or 3,000 km). The
completion report (printable) lists work done, parts replaced, the QA result, before and after
photos and the next service. **Confirm** the default next-service interval.

### 77. 🔵 Customers and history

Customers are listed with their vehicles, last visit and job count, and can be added before
they first come in. Each vehicle's history shows this garage's jobs with prices and visits to
other SpareX garages (matched by plate) without prices.

### 78. 🔵 Reviews and reports

Reviews come from the SpareX app after a job; the page shows the average, the split by stars
and each review, filtered by stars and branch. Replying to reviews isn't built. Branch reports
cover the last 30 days by default: jobs completed, revenue (payments received), average job
value, open jobs by status, technician workload and the top services. Six recently completed
jobs were added to the demo so the reports have data.
