# 4. Launch checklist

Tick every box before real businesses use the site. **Owner** says who does it: **FE** frontend,
**BE** backend, **Client** Kannali, **You** project lead / DevOps. Numbers in brackets point to
[02 Pending work and gaps](02-pending-work-and-gaps.md).

There are two milestones:

- **A. Client demo / UAT on Vercel**: demo data is fine, but it must be stable.
- **B. Go-live with real businesses**: everything below.

---

## A. Before the next client demo

- [ ] Review and commit the fixes from the client demo, then push to `main` (14) · You
- [x] Upgrade Next.js to the patched version; build passes every time (1) · FE
- [ ] Vercel deploy is green; open the live URL and walk the job-card flow once · You
- [ ] Decide how the live demo keeps its data: a shared demo store, or demo from a local production build only (24) · You
- [ ] Demo from a production build (`npm run build` then `npm start`), never `npm run dev` · You
- [ ] Have the demo logins ready (05, "Demo logins") · You

## B. Go-live

### 1. Code and build

- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass · FE
- [ ] Next.js and every dependency on a patched version; `npm audit` has no high or critical issues · FE
- [ ] Every feature in `src/lib/config.ts` is `"api"`; `src/mocks/` and `public/documents/` deleted · FE
- [ ] No demo hints, demo logins or "any code works" text left on any screen (13) · FE
- [x] CI runs lint, typecheck, format check and build on every push and pull request (18) · FE
- [ ] CI also runs the tests, once there are tests (18) · FE
- [ ] Unit tests for pricing, GST and job status rules; one end-to-end test per core flow (18) · FE

### 2. Security

- [ ] Real sign-in; not signed in → sign-in page (3) · BE, FE
- [x] Every Server Action checks the session and the role (4) · FE
- [ ] The backend checks role and branch on every endpoint (4) · BE
- [x] The session token is sent with every API call from the server (5) · FE
- [ ] Session cookie: httpOnly, Secure, SameSite=Lax (done), plus an expiry and idle timeout (21) · BE, FE
- [ ] Rate limiting on sign-in, 2-step and password reset (23) · BE
- [ ] Security headers: CSP, HSTS, X-Frame-Options / frame-ancestors, Referrer-Policy, Permissions-Policy (20) · FE
- [x] API address in a server-only variable (22) · FE
- [ ] Uploads: type and size checked on the server; files not executable; private URLs where needed (8) · BE
- [ ] Passwords hashed (bcrypt / argon2); reset links expire and work once · BE
- [ ] The backend CORS allows only the site's domain (most calls are server to server) · BE
- [ ] Penetration test or at least an OWASP Top 10 review of the API · BE

### 3. Backend and data

- [ ] Every endpoint in 03 returns the shapes in `types.ts`; money in paise, dates in ISO · BE
- [ ] 404 for missing records, readable `message` on every error (6) · BE, FE
- [ ] Business rules from 03 section 5 enforced on the server · BE
- [ ] Production database with backups and a tested restore · BE
- [ ] Separate staging and production environments · BE, You
- [ ] Admin panel can verify businesses, set the discount, enable credit, mark payments paid (10) · BE
- [ ] Real PIN code lookup · BE

### 4. Payments

- [ ] Razorpay live keys from Kannali; test mode passed first (7) · Client, BE
- [ ] Razorpay order creation, signature check and webhook on the backend (7) · BE
- [ ] Razorpay Checkout opens from checkout and "Pay dues" (7) · FE
- [ ] Kannali's real bank account on the bank transfer screens (`features/payments/bank-account.ts`) · Client, FE
- [ ] Refunds for cancelled paid orders tested · BE

### 5. Documents, email and SMS

- [ ] GST invoices and credit notes generated with Kannali's GSTIN (11) · BE, Client
- [ ] Quotation PDFs and statements generated · BE
- [ ] Email sending set up (domain with SPF / DKIM / DMARC): invites, password reset, application decisions (9) · BE, You
- [ ] SMS / WhatsApp provider for 2-step codes and customer updates, with DLT templates registered (India) (9) · BE, Client
- [ ] Every email and SMS template's wording approved · Client

### 6. Content and legal

- [ ] Terms of trade and privacy policy pages, linked from registration (05, Q8) · Client, FE
- [ ] Support phone / WhatsApp / email on "Need help" and the error pages (05, Q7) · Client, FE
- [ ] Logo and brand colours (`Logo.tsx`, `globals.css`) (05, Q9) · Client, FE
- [ ] Product photos in the catalogue · Client, BE
- [ ] Image licences listed (`public/images/CREDITS.md`) or images replaced · You
- [ ] Data protection (India's DPDP Act): consent wording at registration, retention, a way to ask for deletion · Client, BE

### 7. Hosting (Vercel)

- [ ] Production domain (e.g. `business.sparex.in`) with HTTPS · You, Client
- [ ] Environment variables set in Vercel for Production and Preview (`API_BASE_URL`, Razorpay key id) · You
- [ ] Function region close to the users and the API (Mumbai, `bom1`) · You
- [ ] Preview deployments protected (Vercel password or SSO) so the client and staff only see them · You
- [ ] Server Action body size (4 MB in `next.config.ts`) fits the upload plan (8) · FE

### 8. Monitoring and support

- [ ] Error tracking on the frontend and backend, with alerts (19) · You, FE, BE
- [ ] Uptime check on the site and the API · You
- [ ] Basic analytics (pages, sign-ins, orders placed) (19) · You
- [ ] Logs kept for at least 30 days, without passwords, tokens or card data · BE
- [ ] A named person and process for production issues · You

### 9. Testing (UAT)

- [ ] Every flow in 01 ("Flows tested end to end") passed on staging with real data · You, Client
- [ ] Every garage role signed in and checked: sees only its screens and its branch · You
- [ ] Non-garage business (dealer, fleet, retailer) checked: no Garage section, no Users tab · You
- [ ] Credit enabled and disabled accounts both checked · You
- [ ] Every screen at 1440, 1024, 768 and 375 px · You
- [ ] Chrome, Edge, Firefox, Safari on iPhone, Chrome on Android (29) · You
- [ ] Accessibility: keyboard only, one screen-reader pass, Lighthouse accessibility 90+ (28) · FE
- [ ] Performance: Lighthouse 80+ on catalogue, orders and job card; API under 500 ms for lists (30) · FE, BE
- [ ] The client signs off UAT · Client

### 10. Go-live day

- [ ] Freeze changes; tag the release in Git · You
- [ ] Database backup taken just before the switch · BE
- [ ] Deploy; smoke test: sign in, place an order with each payment method, open a job card, collect a payment · You
- [ ] First businesses verified in the admin panel · Client
- [ ] Rollback plan agreed (Vercel "Instant Rollback" to the previous deployment) · You

### 11. First week after launch

- [ ] Watch errors and payments every day · You
- [ ] Collect feedback from the first garages and buyers · Client
- [ ] Plan the post-launch items in 02 (P2) · You
