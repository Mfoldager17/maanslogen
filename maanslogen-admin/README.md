# Maanslogen Admin

Next.js-admin til Maanslogen API. Her kan du administrere kategorier, beverage-typer, drikke, attributedefinitioner, spørgsmål og se anmeldelser.

## Krav

- Node.js 18+
- Maanslogen API kører (fx `npm run start:dev` i `maanslogen-api`)

## Opsætning

```bash
npm install
```

Opret `.env.local` hvis API ikke kører på localhost:3000:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Kør udvikling

```bash
npm run dev
```

Åbn [http://localhost:3001](http://localhost:3001) (Next.js bruger 3001 når 3000 er optaget).

## API-klient (autogenereret)

Klienten er **autogenereret** med [@hey-api/openapi-ts](https://www.npmjs.com/package/@hey-api/openapi-ts) fra OpenAPI/Swagger. Der genereres én funktion per endpoint (fx `getAllCategories()`, `createCategory()`, `createBeverage()`), så frontend ikke skal kende URL’er.

- **Input:** Lokal fil `openapi.json` (ingen fetch – alt kører via npm).
- **Output:** `src/lib/api/` (client, sdk, types).

Efter ændringer i API’et:

1. Opdater `openapi.json` (fx hent fra kørende API: `curl http://localhost:3000/swagger-json > openapi.json`), eller
2. Kør `npm run generate:api:live` mens API kører på localhost:3000.

Derefter:

```bash
npm run generate:api
```

Dette genbygger `src/lib/api/` med de nye endpoints. `src/lib/api-client.ts` sætter kun baseUrl og re-eksporterer SDK + typer.

## Scripts

| Script | Beskrivelse |
|--------|-------------|
| `npm run dev` | Start udviklingsserver |
| `npm run build` | Byg til produktion |
| `npm run start` | Start produktionsserver |
| `npm run generate:api` | Generer API-klient fra `openapi.json` (lokal fil) |
| `npm run generate:api:live` | Generer API-klient fra kørende API (localhost:3000) |
