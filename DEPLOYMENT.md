# Superhero HQ deployment checklist

This project uses Next.js and Payload CMS in one service, NestJS as a separate submission API, MongoDB for Payload data, and a local `media/` upload directory.

## Required environment variables

Set these in the Next.js/Payload hosting environment:

- `NEXT_PUBLIC_SITE_URL`: the canonical public website origin, including `https://` and no trailing path.
- `NEXT_PUBLIC_API_URL`: the public NestJS API origin.
- `DATABASE_URL`: the MongoDB connection string used by `src/payload.config.ts`.
- `PAYLOAD_SECRET`: a strong, private Payload authentication secret.
- `INTERNAL_API_SECRET`: a long, private server-to-server secret shared with NestJS.

Set these in the NestJS hosting environment:

- `PORT`: the port supplied by the hosting platform, or `4000` for local development.
- `PAYLOAD_INTERNAL_BASE_URL`: the Next.js origin plus `/api/internal/submissions`.
- `INTERNAL_API_SECRET`: the same secret configured in Next.js.
- `FRONTEND_ORIGINS`: comma-separated allowed website origins; use the production website origin only in production.

Never use `NEXT_PUBLIC_` for a secret. Do not commit `.env`, `.env.local`, or production credentials.

## Hosting requirements

- Use managed MongoDB with backups and network access limited to the application.
- Configure durable media storage before deployment. The current Payload Media collection writes to the local `media/` directory, which can be ephemeral on hosted platforms.
- Deploy Next.js/Payload and NestJS as separate Node.js services. Configure HTTPS and the production API URL in the website service.
- Keep the Payload internal submission route reachable only through the shared secret and retain its input validation.
- Configure health monitoring against NestJS `GET /health` and review application logs without recording submitted messages or secrets.
- Add a spam protection service before accepting public production submissions.

## Release gate

Before deployment, run `pnpm build` at the repository root and `npm run build` in `backend-api`. Verify the home page, CMS detail routes, 404 behavior, contact/consultation/newsletter submissions, `/sitemap.xml`, and `/robots.txt` against the production environment. Test Payload Admin login with an authorized account and verify uploads persist after a redeploy.

Production deployment is not configured in this repository yet: no production domain, hosting project, managed database, or durable media provider is specified. Do not deploy until those are provisioned and the release gate passes.
