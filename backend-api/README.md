# NestJS submission API

NestJS validates browser submissions and forwards them to Payload's protected internal route. Payload remains the source of truth for stored content.

## Local setup

1. Copy `backend-api/.env.example` to `backend-api/.env` and `.env.local.example` to the Next.js root as `.env.local`.
2. Generate one random secret and set the same `INTERNAL_API_SECRET` in both files. Keep both files private.
3. Confirm `PAYLOAD_INTERNAL_BASE_URL` points to the port used by Next.js. The checked-in example uses port 3001; use 3000 if that's where Next.js is running.
4. Start Next.js from the repository root with `pnpm dev`.
5. Start NestJS from `backend-api` with `npm run start:dev`.

NestJS listens on port 4000. The frontend API base is set by `NEXT_PUBLIC_API_URL`.

## Endpoints

- `GET /health`
- `POST /contact-inquiries`
- `POST /consultation-requests`
- `POST /newsletter-subscriptions`

Submission endpoints validate and rate-limit input before forwarding it to Next.js. The internal Next.js route requires `x-internal-api-secret`; this secret is never sent to the browser. Payload collection reads remain staff-only, and direct public creates are disabled.

## Tests

Run `npm test`, `npm run test:e2e`, and `npm run build` from this directory. The e2e suite covers health, validation, and endpoint responses with a mocked internal Payload route; live persistence also requires both applications and a reachable Payload database.
