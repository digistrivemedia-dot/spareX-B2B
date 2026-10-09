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

### 5. 🟡 Quotation attachments (Screen 6)

The demo quotations list PDF attachments that don't exist yet.
**Options:** (a) add sample PDFs to the demo (recommended); (b) drop attachments from the demo.

### 6. 🔵 Delivery charge

Orders over ₹5,000 are delivered free; every demo order is above that, so delivery shows ₹0.
**Confirm:** the real rule (free over an amount? flat fee? per branch?).

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
