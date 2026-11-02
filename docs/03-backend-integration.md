# 3. Backend integration guide

For the backend team (Node.js + MongoDB) and the frontend developer who switches each feature over.
The frontend is finished on demo data; this document is the contract the API must meet so that
**no screen changes** when it goes live.

---

## 1. How the frontend gets data

```
Page or component           never knows where data comes from
   ↓ calls getOrders(filters)
features/<x>/api.ts         the only place that switches between demo and real data
   ├─ demo: src/mocks/<x>.ts         (today)
   └─ real: lib/api-client.ts → API  (when the feature is switched)
```

- **One switch per feature** in `src/lib/config.ts` (`dataSource.orders = "api"`), so features
  go live one at a time.
- **All API calls run on the Next.js server** (Server Components and Server Actions), never in the
  browser. The browser never sees the API's address or the token.
- **Types are the contract.** Every request and response shape is in `src/features/<x>/types.ts`.
  The API must return exactly those shapes; if a shape has to change, change the type first and
  let TypeScript show every screen it affects.

## 2. Rules every endpoint follows

| Rule                       | Detail                                                                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base URL                   | `/api/v1`, set by an environment variable (see section 5)                                                                                                                                                        |
| Format                     | JSON in and out; `Content-Type: application/json`                                                                                                                                                                |
| IDs                        | Strings                                                                                                                                                                                                          |
| Dates                      | ISO 8601 strings with time zone (`2026-10-12T10:30:00+05:30` or UTC `Z`)                                                                                                                                         |
| Money                      | **Integer paise** (₹1,249.50 = `124950`). Never floats, never rupees                                                                                                                                             |
| Lists                      | `Paginated<T> = { items: T[]; page: number; pageSize: number; total: number }`, with `page` starting at 1                                                                                                        |
| List parameters            | Query string: `page`, `pageSize`, `sort`, `order` (`asc` / `desc`), `q` for search, plus each list's filters (see its `*Filters` type). Multi-value filters are comma-separated (`statuses=placed,packed`)       |
| Filtering, sorting, paging | Done by the API. The screens never filter raw arrays                                                                                                                                                             |
| Not found                  | HTTP 404                                                                                                                                                                                                         |
| Errors                     | Any non-2xx with `{ message: string; code?: string; details?: Record<string, string[]> }`. `message` is shown to the user as is, so write it in plain English ("This order has shipped and can't be cancelled.") |
| Validation                 | 422 with `details` keyed by field name                                                                                                                                                                           |
| Conflicts                  | 409 when the record has moved on (e.g. a job already past that step)                                                                                                                                             |
| Auth                       | `Authorization: Bearer <token>` on every request except sign-in, registration and password reset                                                                                                                 |
| Empty success              | 204                                                                                                                                                                                                              |

## 3. Authentication and session

- Sign-in (`POST /auth/sign-in`) returns a `SignInResult`: signed in (with a `sessionToken`),
  2-step needed (with a `challengeId`), first login (set a password) or not yet verified (with the
  application reference). See `features/auth/types.ts`.
- The frontend keeps the token in an **httpOnly, Secure, SameSite=Lax cookie**
  (`sparex-session`); the page's JavaScript never sees it.
- `GET /auth/session` returns the `Session`:
  `{ user, business, roles, branchId, approvalStatus }`. The frontend calls it once per request
  (`features/auth/session.ts`), and every permission decision on screen uses it.
- **Roles** (several per user): `owner`, `manager`, `technician`, `spares`, `billing`.
  Single-login businesses (non-garages) are `owner`. Each user belongs to **one branch**.
- **The backend must enforce permissions and branch scoping on every request.** The frontend hides
  what a role can't do, but that is not security. The starting matrix (still to be confirmed by the
  client) is in `src/features/auth/permissions.ts`:

| Role                      | Can                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner                     | Everything, every branch                                                                                                                              |
| Manager / Service Advisor | Garage dashboard, bookings, walk-ins, check-in, job cards, inspection, estimates, assigning technicians, QA, delivery, customers, reviews; own branch |
| Technician                | Own assigned jobs ("My jobs"), inspection, progress, ticking tasks; own branch                                                                        |
| Spares & Inventory        | Buying (catalogue, orders, quotations), view job cards, parts for jobs; own branch                                                                    |
| Billing, QA & Delivery    | Garage dashboard, view job cards, QA, invoice, collect payment, delivery, customers; own branch                                                       |

## 4. Endpoints

Request and response types are in `src/features/<feature>/types.ts`. `{id}` is the record's id.

### Auth and registration (`features/auth`)

| Method | Path                      | Request                                                | Response                                     |
| ------ | ------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| POST   | `/auth/sign-in`           | `SignInRequest`                                        | `SignInResult`                               |
| POST   | `/auth/two-factor/verify` | `TwoFactorRequest`                                     | `TwoFactorResult` (with `sessionToken`)      |
| POST   | `/auth/two-factor/resend` | `{ challengeId }`                                      | 204                                          |
| POST   | `/auth/password-reset`    | `{ email }`                                            | 204 (never reveals whether the email exists) |
| POST   | `/auth/password`          | `SetPasswordRequest` (reset token or first login)      | 204                                          |
| GET    | `/auth/session`           |                                                        | `Session`                                    |
| POST   | `/registrations`          | `RegistrationApplication`                              | `RegistrationReceipt`                        |
| GET    | `/registrations/{ref}`    |                                                        | `ApplicationStatus`                          |
| PUT    | `/registrations/{ref}`    | `RegistrationApplication` (resubmit after "sent back") | `RegistrationReceipt`                        |

### Catalogue (`features/catalog`)

| Method | Path                          | Request                                                                                              | Response                                  |
| ------ | ----------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| GET    | `/catalog/products`           | `CatalogFilters` (search, category, brand, vehicle type → make → model, stock at branch, sort, page) | `Paginated<Product>`                      |
| GET    | `/catalog/products?ids=a,b`   | ids                                                                                                  | `Product[]`                               |
| GET    | `/catalog/products/{id}`      |                                                                                                      | `Product`                                 |
| POST   | `/catalog/products/lookup`    | `{ partNumbers: string[] }` (quick order)                                                            | `Product[]`                               |
| GET    | `/catalog/filters`            |                                                                                                      | `CatalogFilterOptions`                    |
| GET    | `/catalog/frequently-ordered` |                                                                                                      | `Product[]` (from this business's orders) |

### Orders, returns, quotations (`features/orders`, `returns`, `quotations`)

| Method | Path                               | Request                                                                                                  | Response                      |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------- |
| GET    | `/orders`                          | `OrderFilters`                                                                                           | `Paginated<OrderSummary>`     |
| GET    | `/orders/{id}`                     |                                                                                                          | `Order`                       |
| POST   | `/orders`                          | `PlaceOrderRequest` (lines, branch, PO number, payment method; `quotationId` when accepting a quotation) | `PlacedOrder`                 |
| POST   | `/orders/{id}/cancel`              | `CancelOrderRequest`                                                                                     | `Order`                       |
| GET    | `/orders/{id}/returned-quantities` |                                                                                                          | `Record<productId, quantity>` |
| GET    | `/returns`                         | `ReturnFilters`                                                                                          | `Paginated<ReturnSummary>`    |
| GET    | `/returns/{id}`                    |                                                                                                          | `ReturnRequest`               |
| POST   | `/returns`                         | `CreateReturnRequest`                                                                                    | `ReturnRequest`               |
| GET    | `/quotations`                      | `QuotationFilters`                                                                                       | `Paginated<QuotationSummary>` |
| GET    | `/quotations/{id}`                 |                                                                                                          | `Quotation`                   |
| POST   | `/quotations`                      | `QuotationRequest`                                                                                       | `Quotation`                   |
| POST   | `/quotations/{id}/revision`        | `{ comment }`                                                                                            | `Quotation`                   |
| POST   | `/quotations/{id}/reject`          | `{ reason? }`                                                                                            | `Quotation`                   |

### Credit, payments, documents (`features/credit`, `payments`, `documents`)

| Method | Path                             | Request                                | Response                                                 |
| ------ | -------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| GET    | `/credit/summary`                |                                        | `CreditSummary`                                          |
| GET    | `/credit/invoices?status=unpaid` |                                        | `Invoice[]`                                              |
| GET    | `/credit/statement`              | `StatementFilters` (from, to)          | `Statement` (with opening and closing balance)           |
| POST   | `/credit/payments`               | `PayInvoicesRequest`                   | `PayInvoicesResult`                                      |
| GET    | `/payments`                      | `PaymentFilters`                       | `Paginated<Payment>`                                     |
| GET    | `/payments/{id}`                 |                                        | `Payment`                                                |
| GET    | `/documents`                     | `DocumentFilters` (type, date, search) | `Paginated<BusinessDocument>` (each with a download URL) |

### Company (`features/company`)

| Method | Path                          | Request                                            | Response                                        |
| ------ | ----------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| PATCH  | `/company/profile`            | `BusinessContactUpdate`                            | `Business`                                      |
| GET    | `/company/branches`           |                                                    | `Branch[]`                                      |
| POST   | `/company/branches`           | `BranchInput`                                      | `Branch`                                        |
| PUT    | `/company/branches/{id}`      | `BranchInput`                                      | `Branch`                                        |
| DELETE | `/company/branches/{id}`      |                                                    | 204 (refuse the main branch, or one with staff) |
| POST   | `/company/branches/{id}/main` |                                                    | 204                                             |
| GET    | `/pincodes/{pin}`             |                                                    | `PincodeDetails` (city, state)                  |
| GET    | `/company/users`              | `CompanyUserFilters` (role, branch)                | `Paginated<CompanyUser>`                        |
| GET    | `/company/users/{id}`         |                                                    | `CompanyUser`                                   |
| POST   | `/company/users`              | `CompanyUserInput` (garages only; sends an invite) | `CompanyUser`                                   |
| PUT    | `/company/users/{id}`         | `CompanyUserInput`                                 | `CompanyUser`                                   |
| POST   | `/company/users/{id}/status`  | `{ status: "active" \| "disabled" }`               | `CompanyUser`                                   |
| POST   | `/company/users/{id}/invite`  |                                                    | 204                                             |

### Garage set-up, customers, reviews, reports

| Method | Path                                | Request                            | Response                                      |
| ------ | ----------------------------------- | ---------------------------------- | --------------------------------------------- |
| GET    | `/garage/profile`                   |                                    | `GarageProfile`                               |
| PUT    | `/garage/profile`                   | `GarageProfile`                    | `GarageProfile`                               |
| GET    | `/garage/branches`                  |                                    | `GarageBranch[]` (with hours and staff count) |
| GET    | `/garage/vehicles/lookup?plate=`    |                                    | `VehicleLookup` (vehicle and owner, or none)  |
| GET    | `/garage/customers`                 | `CustomerFilters`                  | `Paginated<CustomerSummary>`                  |
| GET    | `/garage/customers/{id}`            |                                    | `CustomerDetail` (vehicles with full history) |
| POST   | `/garage/customers`                 | `NewCustomerRequest`               | `{ id }`                                      |
| GET    | `/garage/reviews`                   | `ReviewFilters`                    | `Paginated<Review>`                           |
| GET    | `/garage/reviews/summary?branchId=` |                                    | `ReviewSummary`                               |
| GET    | `/garage/reports`                   | `ReportFilters` (branch, from, to) | `BranchReport`                                |

### Bookings and job cards (`features/bookings`, `job-cards`)

| Method | Path                                       | Request                                                                                        | Response                                                                                  |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/garage/bookings`                         | `BookingFilters` (status, `view`: upcoming or past, branch, date, sort by slot or `respondBy`) | `Paginated<Booking>` (each with `respondBy`; unanswered requests past it become `missed`) |
| GET    | `/garage/bookings/{id}`                    |                                                                                                | `Booking`                                                                                 |
| POST   | `/garage/bookings/{id}/accept`             |                                                                                                | `JobCard` (new, at "Confirmed")                                                           |
| POST   | `/garage/bookings/{id}/decline`            | `{ reason }`                                                                                   | `Booking`                                                                                 |
| GET    | `/garage/jobs`                             | `JobCardFilters` (statuses, branch, technician, q, sort `dueAt` or `createdAt`)                | `Paginated<JobCardSummary>` (with `tasks` done / total)                                   |
| GET    | `/garage/jobs/{id}`                        |                                                                                                | `JobCard`                                                                                 |
| POST   | `/garage/jobs`                             | `WalkInRequest`                                                                                | `JobCard` (at "Vehicle received")                                                         |
| POST   | `/garage/jobs/{id}/check-in`               | `CheckInRequest`                                                                               | `JobCard`                                                                                 |
| PUT    | `/garage/jobs/{id}/inspection`             | `InspectionRequest`                                                                            | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/estimate`               | `EstimateRequest`                                                                              | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/estimate/revision`      | `EstimateRequest` (extra work)                                                                 | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/estimate/approval`      | `ApprovalRequest` (answer per line)                                                            | `JobCard`                                                                                 |
| GET    | `/garage/technicians?branchId=`            |                                                                                                | `TechnicianLoad[]`                                                                        |
| PUT    | `/garage/jobs/{id}/technician`             | `{ technicianId }`                                                                             | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/response`               | `{ accept: true }` or `{ accept: false, reason }`                                              | `JobCard`                                                                                 |
| PATCH  | `/garage/jobs/{id}/lines/{lineId}`         | `{ isDone }`                                                                                   | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/progress`               | `ProgressRequest`                                                                              | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/finish`                 |                                                                                                | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/quality-check`          | `QualityCheckRequest`                                                                          | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/invoice`                |                                                                                                | `JobCard` (with the garage's invoice)                                                     |
| POST   | `/garage/jobs/{id}/payment`                | `CollectPaymentRequest`                                                                        | `JobCard`                                                                                 |
| POST   | `/garage/jobs/{id}/handover`               | `HandoverRequest`                                                                              | `JobCard`                                                                                 |
| GET    | `/garage/staff?branchId=`                  |                                                                                                | `DriverLoad[]` (active staff at the branch, with trips now)                               |
| PUT    | `/garage/jobs/{id}/trips/{pickup or drop}` | `{ driverId }`                                                                                 | `JobCard` (at "Out for pick-up" or "Out for delivery")                                    |

### Other

| Method | Path                 | Response                      |
| ------ | -------------------- | ----------------------------- |
| GET    | `/promotions/offers` | `Offer[]` (dashboard banners) |
| GET    | `/notifications`     | `Notification[]`              |

**Still needed, not used by the frontend yet:** photo upload (see section 6), Razorpay order
creation and webhook (section 7), and the admin panel's own endpoints.

## 5. Business rules the backend must own

The demo mocks implement these; the backend must do the same (and is the source of truth).

**Pricing**

- Business price = `round(b2cPriceInPaise × (100 − discountPercent) / 100)` to **whole rupees**,
  excluding GST. One discount % per business, set by admin. No tier prices, no MOQ.
  Same formula as `getBusinessPrice()` in `src/lib/pricing.ts`.
- GST is a separate line (18% on all demo items), split into CGST + SGST because every demo party is in Karnataka. The frontend has no IGST (inter-state) case yet: the backend should return the split, and the client should confirm whether out-of-state buyers exist.
- Prices are returned only to a signed-in, verified business.

**Orders and quotations**

- Cancel only while not shipped (placed, confirmed, processing, packed).
- Quotations are priced at once at the business price and are **valid 7 days**; accept places an
  order at the quoted prices; revision sends it back to "Requested".
- Credit: only when admin enabled it for the business; refuse when the order total exceeds the
  credit available.

**Job cards**

- Status flow: Booked → Confirmed → Vehicle received → Job card created → Inspection → Waiting for
  customer approval → Approved → Service in progress → Quality check → Ready for delivery → Payment
  pending → Paid → Completed.
- Walk-ins start at Vehicle received. Every estimate line turned down on the first estimate → job
  **Closed** with no fee. Extra work → back to Waiting for customer approval. QA rework → back to
  Service in progress (work lines un-ticked).
- Each step refuses a job that isn't at the right status (409).
- Pick-up & drop: a booking may carry `pickupDrop` (addresses and the garage's flat fee), which the job card keeps. Confirmed → Out for pick-up (driver assigned) → Vehicle received (check-in recorded at the door). Payment pending or Paid → Out for delivery (driver assigned) → Completed (handover at the door). If the bill is unpaid at handover, `cashAtDoorInPaise` must cover it. The assigned driver may record their own trip whatever their role.
- Booking accept respects the garage's daily booking limit per branch; no reschedule. A new request must be answered by its `respondBy` (15 minutes after it arrives, to be confirmed); after that it is `missed` and the customer is told.
- A walk-in plate that's already on file links to the existing vehicle; when a customer later adds
  the same plate in the app, the history links to them.
- Another garage's history on a vehicle is returned **without prices**.
- The garage invoice is in the **garage's** name and GSTIN, from the approved lines only.
- Staff see and change only their own branch's records; technicians only their assigned jobs.

## 6. Photos and files

Today photos are resized in the browser (about 1280 px, 150 KB) and sent inside the JSON body.
For the real API, recommended:

1. `POST /uploads` (or a signed upload URL per file) returns `{ url }`.
2. Forms send the photo URLs instead of the image data. The types already hold `photos: string[]`,
   so the screens don't change; only `components/ui/PhotoUpload` uploads before saving.
3. Documents (invoices, credit notes, quotations, statements) are returned as download URLs.

## 7. Payments (Razorpay)

1. Checkout and "Pay dues" ask the backend to create a Razorpay order.
2. The frontend opens Razorpay Checkout (Razorpay's script, which needs the lead's approval as an
   external dependency).
3. The backend verifies the payment signature and listens to Razorpay webhooks; the order or
   invoice is marked paid only after verification.
4. Bank transfer (with UTR) and COD are marked paid by admin.

## 8. Frontend changes when the backend arrives

These small changes are in shared files, not in the screens. Four are already done (30 Oct):

| Change                                                                   | File                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| ✅ Send the session token from the cookie with every request (done)      | `src/lib/api-client.ts`                                             |
| ✅ Turn a 404 into `null` for detail functions (done: `apiClientOrNull`) | `src/lib/api-client.ts`                                             |
| ✅ Read the API address from a server-only `API_BASE_URL` (done)         | `src/lib/api-client.ts`, `.env.example`                             |
| Replace the demo session with `GET /auth/session`                        | `src/features/auth/session.ts` (already written, behind the switch) |
| ✅ Check the session and role in every Server Action (done)              | `src/features/*/actions.ts`                                         |
| Upload photos before saving                                              | `src/components/ui/PhotoUpload.tsx`                                 |
| Open Razorpay Checkout                                                   | `src/features/checkout`, `src/features/credit`                      |

## 9. Switching a feature over

1. Build and test the feature's endpoints against its `types.ts`.
2. Set `dataSource.<feature> = "api"` in `src/lib/config.ts`.
3. Run `npm run typecheck`, `npm run lint`, `npm run build`, then walk the feature's flows
   (see 01, "Flows tested end to end").
4. When every feature is `"api"`, delete `src/mocks/` and `public/documents/`; nothing else imports
   them.

**Suggested order** (each step unblocks the next):

1. `auth` + `company` (session, business, branches, users)
2. `catalog` (prices, stock)
3. `orders` + `payments` (checkout, Razorpay)
4. `quotations`, `returns`
5. `credit`, `documents`
6. `garage`, `customers`, `bookings`, `jobCards`
7. `reviews`, `reports`, `promotions`, `notifications`

## 10. Dependencies on other parts of the platform

| Needs                                                                                                       | From                           |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Business verification, discount %, credit limit and terms, marking payments paid, invoices and credit notes | Admin panel (separate repo)    |
| Bookings, customer approvals in the app, reviews, customers adding their plates                             | B2C site / app (separate repo) |
| The same API for the B2B mobile app                                                                         | B2B app (later)                |
