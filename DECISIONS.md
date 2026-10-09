# Decisions for review

Things that need your call, or assumptions made to keep building. Each item says what was done,
what the options are, and what I recommend. Nothing here blocks the demo; change any of them later.

**Status key:** 🟡 needs your input · 🔵 assumption, confirm or change · ⚪ technical, FYI

---

## Content and business rules

### 1. 🟡 Terms of trade (Screen 1, registration)

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

### 31. 🟡 What "Accept & convert to order" does

Accepting places the order immediately: at the quoted prices, on credit (Net 30), delivered to
the branch on the quotation, with an optional PO number. If the credit available is too low it
says so and nothing is ordered.
**Options:** (a) keep (fast, current); (b) send the quoted parts to checkout instead, so the buyer
can change branch or pay online.

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
