# Audience export

Leads and watch events live in the Cloudflare D1 database bound as `AUDIENCE_DB`.

## List unique leads

```powershell
npx wrangler d1 execute golden-wings-audience --remote --command "SELECT email, name, phone, source, created_at, updated_at FROM leads ORDER BY created_at DESC;"
```

## Export leads as JSON

```powershell
npx wrangler d1 execute golden-wings-audience --remote --json --command "SELECT * FROM leads ORDER BY created_at DESC;" > audience-leads.json
```

## Recent watch events

```powershell
npx wrangler d1 execute golden-wings-audience --remote --command "SELECT email, page, created_at FROM watch_events ORDER BY created_at DESC LIMIT 100;"
```

Use the leads export for Kickstarter invites, merchandise drops, and screening follow-ups.
