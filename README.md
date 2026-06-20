# Auto Haven

A second-hand car–listing website for **Auto Haven** (Autohaven Pte Ltd), with a
servicing/maintenance section for its workshop arm, **Revo Haven**.

Inventory is crawled daily from the dealer's own sgcarmart listing
(`dl=3647`) — no manual data entry.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- Inventory stored as JSON in the repo (`src/data/listings.json`), images in `public/cars/`
- Daily refresh via **GitHub Actions** cron

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Crawling inventory

```bash
npm run crawl        # fetch latest listings + images, write src/data/*.json
```

The crawler (`scripts/crawl.mjs`):

1. Fetches every page of the dealer listing and extracts the listing data that
   sgcarmart server-renders into the page (no headless browser needed).
2. Normalizes each car into a lean shape (`src/lib/cars.ts` defines the type).
3. Downloads each car's primary photo into `public/cars/<id>.jpg`.
4. Writes:
   - `src/data/listings.json` — current inventory snapshot the site renders.
   - `src/data/history.json` — append-only log of **new**, **price change** and
     **sold** events, with `firstSeen` / `lastSeen` dates per car.

Change the dealer via env var if needed: `AUTOHAVEN_DEALER_ID=3647 npm run crawl`.

## Daily automation (runs locally)

sgcarmart blocks cloud/datacenter IPs (GitHub Actions gets HTTP 403), so the
daily refresh runs **on a local machine** with an allowed connection.

`scripts/refresh.ps1` runs the crawler, then commits & pushes any changes (which
triggers the Vercel redeploy). It only commits if the crawl succeeds, and the
crawler itself aborts rather than overwrite good data if it ever returns an
empty/suspicious result.

Register it as a daily Windows Scheduled Task (09:00):

```powershell
schtasks /Create /TN "AutoHaven Daily Crawl" /SC DAILY /ST 09:00 /F `
  /TR "powershell -NoProfile -ExecutionPolicy Bypass -File \"<repo>\scripts\refresh.ps1\""
```

Run it manually any time with `powershell -File scripts/refresh.ps1`, or just
`npm run crawl` to refresh data without committing.

## Project structure

```
scripts/crawl.mjs          # the daily crawler
src/data/                  # listings.json + history.json (generated)
src/lib/site.ts            # brand + contact config (edit placeholders here)
src/lib/cars.ts            # Car type + data-access helpers
src/components/            # Navbar, Footer, CarCard, ListingsBrowser
src/app/                   # / , /cars , /cars/[slug] , /servicing , /about
public/cars/               # downloaded car photos (generated)
```

## To do before launch

- Replace contact placeholders (phone, WhatsApp, email, address) in
  `src/lib/site.ts`.
- Confirm branding/colors (theme variables live in `src/app/globals.css`).
