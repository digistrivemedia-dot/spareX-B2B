# SpareX Business

The B2B website of Kannali Garage's SpareX platform. Verified businesses (garages, fleets,
dealers, retailers) buy parts at business prices, and garages run their workshop: bookings, job
cards, estimates, technicians, billing and customers. `CLAUDE.md` is the full product and
engineering brief; `DECISIONS.md` lists the open questions.

## Getting started

```bash
nvm use            # Node 24 (see .nvmrc)
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Every feature reads demo data for now, so no backend is needed. Without signing in you are the
owner of the demo garage. Any password of 8+ characters works; these emails show other views:

| Email                                             | Shows                                              |
| ------------------------------------------------- | -------------------------------------------------- |
| mahesh@srisaiworks.example.com                    | Owner, with 2-step verification (any code)         |
| ravi@srisaiworks.example.com                      | Manager / service advisor, HSR Layout              |
| imran@srisaiworks.example.com                     | Technician, Whitefield ("My jobs")                 |
| venkatesh@srisaiworks.example.com                 | Technician and spares, HSR Layout                  |
| shilpa@srisaiworks.example.com                    | Billing, QA & delivery                             |
| review@ / sentback@ / rejected@sparex.example.com | An application under review, sent back or rejected |
| new@sparex.example.com                            | A first login (set a password)                     |

Demo changes (orders, payments, jobs) are kept in server memory, so they reset when the server
restarts.

## Scripts

| Command                       | What it does                               |
| ----------------------------- | ------------------------------------------ |
| `npm run dev`                 | Development server                         |
| `npm run build` / `npm start` | Production build and server                |
| `npm run lint`                | ESLint (Next.js config)                    |
| `npm run typecheck`           | TypeScript, no emit                        |
| `npm run format`              | Prettier, including Tailwind class sorting |

## Where things live

```
src/app/(auth)       Sign in and registration (centred card layout)
src/app/(portal)     Everything behind login (sidebar + top bar)
src/components/ui    shadcn components (kebab-case files) and our generic ones (PascalCase)
src/components/layout  App shell: sidebar, top bar, page header
src/features/<name>  types.ts (the API contract), api.ts, components/, store.ts
src/lib              Formatting, GST, pricing, navigation, API client, config
src/mocks            Demo data and mock handlers (deleted once the backend is live)
```

## Data: demo now, backend later

Screens call `features/<name>/api.ts` and never import from `src/mocks/`. Each feature has a
switch in `src/lib/config.ts`; set it to `"api"` and that feature reads from the backend via
`lib/api-client.ts` (base URL from `NEXT_PUBLIC_API_BASE_URL`). Money is integer paise, dates are
ISO strings, and lists are `Paginated<T>`.

Navigation is config-driven (`src/lib/navigation.ts`): a new module is one entry, optionally
limited to business types or a permission.
