// @ts-check
/**
 * Auto Haven listing crawler.
 *
 * Fetches the dealer's own inventory from its sgcarmart dealer page
 * (dl=3647 = "Autohaven Pte Ltd"), where the listing data is server-rendered
 * into the page's Next.js RSC flight payload under `listing_data.data[]`.
 *
 * Outputs:
 *   - src/data/listings.json   current inventory snapshot (what the site renders)
 *   - src/data/history.json    append-only log of new / price-change / sold events
 *   - public/cars/<id>.jpg      downloaded primary photo for each car
 *
 * Run:  node scripts/crawl.mjs        (or `npm run crawl`)
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const IMG_DIR = path.join(ROOT, "public", "cars");

const DEALER_ID = process.env.AUTOHAVEN_DEALER_ID || "3647";
const BASE = "https://www.sgcarmart.com/used-cars/listing";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const MAX_PAGES = 20; // hard safety cap
const POLITE_DELAY_MS = 4000; // be gentle between page fetches

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fetch one listing page's raw HTML. */
// Full browser-like header set — some WAFs reject requests missing these.
const BROWSER_HEADERS = {
  "User-Agent": UA,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-SG,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Upgrade-Insecure-Requests": "1",
  "sec-ch-ua": '"Chromium";v="120", "Not A(Brand";v="24", "Google Chrome";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
};

async function fetchPage(page) {
  const url = `${BASE}?dl=${DEALER_ID}${page > 1 ? `&page=${page}` : ""}`;
  const res = await fetch(url, { headers: BROWSER_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return { html: await res.text(), url };
}

/**
 * Reconstruct the Next.js RSC flight payload by concatenating every
 * `self.__next_f.push([1, "<chunk>"])` string. The result is normal
 * (single-level-escaped) JSON-ish text we can parse/scan.
 */
function reconstructFlight(html) {
  const re = /self\.__next_f\.push\((\[[\s\S]*?\])\)/g;
  let m;
  let flight = "";
  while ((m = re.exec(html))) {
    try {
      const arr = JSON.parse(m[1]);
      if (Array.isArray(arr) && typeof arr[1] === "string") flight += arr[1];
    } catch {
      /* not a string chunk; skip */
    }
  }
  return flight;
}

/**
 * Extract & JSON-parse the `listing_data.data` array from a dealer listing page.
 * @returns {{ records: any[], meta: any }}
 */
function extractListings(html) {
  const flight = reconstructFlight(html);
  const key = flight.indexOf('"listing_data":');
  if (key === -1) return { records: [], meta: null };

  const arrStart = flight.indexOf("[", flight.indexOf('"data":', key));
  const arrText = sliceBalanced(flight, arrStart, "[", "]");
  const records = arrText ? JSON.parse(arrText) : [];

  // Pagination meta lives in the adverts payload: {"last_page":N,"total":T,...}
  let meta = null;
  const lp = flight.indexOf('"last_page":');
  if (lp !== -1) {
    const total = Number((flight.slice(lp, lp + 200).match(/"total":(\d+)/) || [])[1]);
    const lastPage = Number((flight.slice(lp, lp + 60).match(/"last_page":(\d+)/) || [])[1]);
    meta = { lastPage: lastPage || 1, total: total || records.length };
  }
  return { records, meta };
}

/** Return the substring from `start` through the balanced close of open/close, string-aware. */
function sliceBalanced(s, start, open, close) {
  if (start < 0) return null;
  let depth = 0,
    inStr = false,
    esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

/** Build a URL-friendly slug from the sgcarmart detail link, falling back to the id. */
function slugFromLink(link, id) {
  const m = typeof link === "string" && link.match(/\/info\/([a-z0-9-]+?)-\d+\/?/i);
  return m ? `${m[1]}-${id}` : String(id);
}

/** Map a raw sgcarmart record to the lean shape the site consumes. */
function normalize(r) {
  return {
    id: r.id,
    slug: slugFromLink(r.link, r.id),
    title: r.car_model,
    make: r.make ?? null,
    model: r.model ?? null,
    bodyType: r.type ?? null,
    price: typeof r.price === "number" ? r.price : null,
    depreciation: typeof r.depreciation === "number" ? r.depreciation : null,
    instalment: r.instalment?.installment ?? null,
    registrationDate: r.registration_date ?? null,
    coeLeft: r.coeLeft ?? null,
    mileage: r.mileage ?? null,
    engineCapacity: r.engine_capacity ?? null,
    transmission: r.transmission ?? null,
    fuelType: r.fuel_type ?? null,
    owners: r.owners ?? null,
    vehicleScheme: r.vehicle_scheme ?? null,
    driveRange: r.drive_range && r.drive_range !== "N.A." ? r.drive_range : null,
    description: (r.description ?? "").trim(),
    status: r.status ?? null, // 'a' = available, 's' = sold
    sourceLink: r.link ?? null,
    image: `/cars/${r.id}.jpg`,
    imageSource: r.image ?? null,
    dealer: r.dealer_lead?.name ?? "Autohaven Pte Ltd",
  };
}

/** Download the primary photo for a car if we don't already have it. */
async function downloadImage(car) {
  if (!car.imageSource) return;
  const dest = path.join(IMG_DIR, `${car.id}.jpg`);
  if (existsSync(dest)) return;
  try {
    const res = await fetch(car.imageSource, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`  ↓ image ${car.id}.jpg`);
  } catch (e) {
    console.warn(`  ! image ${car.id} failed: ${e.message}`);
  }
}

const GALLERY_MAX = 20; // cap photos per car
const DETAIL_DELAY_MS = 2500; // polite gap between detail-page fetches

/** Pull the ordered full-size gallery image URLs for a car from its detail-page flight. */
function extractGallery(flight, id) {
  const re =
    /"url":"(https:\/\/i\.i-sgcm\.com\/cars_used\/\d+\/[^"]+?\.jpg)","type":"image","display_order":(\d+)/g;
  const seen = new Set();
  const items = [];
  let m;
  while ((m = re.exec(flight))) {
    if (m[1].includes(`/${id}_`) && !seen.has(m[1])) {
      seen.add(m[1]);
      items.push({ url: m[1], order: Number(m[2]) });
    }
  }
  return items
    .sort((a, b) => a.order - b.order)
    .slice(0, GALLERY_MAX)
    .map((it) => it.url);
}

/**
 * Fetch a car's detail page, download every gallery photo into
 * public/cars/<id>/<n>.jpg, and return the local paths (or null on failure).
 */
async function fetchDetailGallery(car) {
  if (!car.sourceLink) return null;
  try {
    const res = await fetch(car.sourceLink, { headers: BROWSER_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const urls = extractGallery(reconstructFlight(await res.text()), car.id);
    if (urls.length === 0) return null;

    const dir = path.join(IMG_DIR, String(car.id));
    await mkdir(dir, { recursive: true });
    const paths = [];
    for (let i = 0; i < urls.length; i++) {
      const dest = path.join(dir, `${i + 1}.jpg`);
      if (!existsSync(dest)) {
        const r = await fetch(urls[i], { headers: { "User-Agent": UA } });
        if (!r.ok) continue;
        await writeFile(dest, Buffer.from(await r.arrayBuffer()));
      }
      paths.push(`/cars/${car.id}/${i + 1}.jpg`);
    }
    return paths.length ? paths : null;
  } catch (e) {
    console.warn(`  ! gallery ${car.id} failed: ${e.message}`);
    return null;
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(IMG_DIR, { recursive: true });

  console.log(`Crawling Auto Haven inventory (dealer ${DEALER_ID})…`);
  const all = [];
  let lastPage = 1;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { html, url } = await fetchPage(page);
    const { records, meta } = extractListings(html);
    console.log(`  page ${page}: ${records.length} listings  (${url})`);
    if (meta?.lastPage) lastPage = meta.lastPage;
    if (records.length === 0) break;
    all.push(...records);
    if (page >= lastPage) break;
    await sleep(POLITE_DELAY_MS);
  }

  // De-dupe by id, normalize.
  const byId = new Map();
  for (const r of all) if (!byId.has(r.id)) byId.set(r.id, normalize(r));
  const cars = [...byId.values()];
  console.log(`Collected ${cars.length} unique listings.`);

  // Diff against the previous snapshot for the history log.
  const prev = await readJson(path.join(DATA_DIR, "listings.json"), { cars: [] });
  const prevById = new Map((prev.cars || []).map((c) => [c.id, c]));

  // Safety guard: never overwrite good data with an empty or suspicious result
  // (e.g. if sgcarmart changes its page format or blocks the request). Fail loudly
  // instead, so the existing listings.json is preserved.
  const prevCount = prev.cars?.length ?? 0;
  if (cars.length === 0) {
    throw new Error("Crawl returned 0 listings — aborting without overwriting existing data.");
  }
  if (prevCount >= 5 && cars.length < prevCount / 2) {
    throw new Error(
      `Crawl returned only ${cars.length} listings vs ${prevCount} previously — ` +
        "aborting as a likely source/parse error.",
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const history = await readJson(path.join(DATA_DIR, "history.json"), []);
  const events = [];

  for (const car of cars) {
    const before = prevById.get(car.id);
    if (!before) {
      events.push({ date: today, type: "new", id: car.id, title: car.title, price: car.price });
    } else if (before.price !== car.price) {
      events.push({
        date: today,
        type: "price_change",
        id: car.id,
        title: car.title,
        from: before.price,
        to: car.price,
      });
    }
  }
  const currentIds = new Set(cars.map((c) => c.id));
  for (const before of prevById.values()) {
    if (!currentIds.has(before.id)) {
      events.push({ date: today, type: "sold", id: before.id, title: before.title, price: before.price });
    }
  }

  // Preserve first-seen dates across runs.
  for (const car of cars) {
    car.firstSeen = prevById.get(car.id)?.firstSeen || today;
    car.lastSeen = today;
  }

  console.log("Downloading thumbnails…");
  for (const car of cars) await downloadImage(car);

  // Resolve each car's detail-page photo gallery: reuse what we already have,
  // otherwise fetch the detail page and download the full set (new cars only).
  console.log("Resolving galleries…");
  for (const car of cars) {
    const dir = path.join(IMG_DIR, String(car.id));
    const prevImages = prevById.get(car.id)?.images;
    if (existsSync(dir) && Array.isArray(prevImages) && prevImages.length) {
      car.images = prevImages;
    } else {
      const gallery = await fetchDetailGallery(car);
      car.images = gallery && gallery.length ? gallery : [car.image];
      if (gallery) console.log(`  ↓ ${car.id}: ${gallery.length} photos`);
      await sleep(DETAIL_DELAY_MS);
    }
  }

  // Only write when the actual inventory changed. Compare ignoring the volatile
  // `lastSeen` field (and the top-level crawl timestamp), so an unchanged listing
  // leaves the files byte-identical and produces no commit.
  const signature = (list) =>
    JSON.stringify(
      [...list].sort((a, b) => a.id - b.id).map(({ lastSeen, ...rest }) => rest),
    );
  if (signature(cars) === signature(prev.cars || [])) {
    console.log(`\nNo inventory changes — ${cars.length} listings unchanged; nothing written.`);
    return;
  }

  const snapshot = {
    dealer: cars[0]?.dealer ?? "Autohaven Pte Ltd",
    dealerId: DEALER_ID,
    source: `${BASE}?dl=${DEALER_ID}`,
    crawledAt: new Date().toISOString(),
    count: cars.length,
    cars: cars.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)),
  };

  await writeFile(path.join(DATA_DIR, "listings.json"), JSON.stringify(snapshot, null, 2));
  if (events.length) {
    history.push(...events);
    await writeFile(path.join(DATA_DIR, "history.json"), JSON.stringify(history, null, 2));
  }

  console.log(`\nDone. ${cars.length} listings written.`);
  if (events.length) {
    console.log(`Changes this run:`);
    for (const e of events) {
      if (e.type === "new") console.log(`  + NEW    ${e.title} — $${e.price?.toLocaleString()}`);
      else if (e.type === "sold") console.log(`  - SOLD   ${e.title}`);
      else console.log(`  ~ PRICE  ${e.title}: $${e.from?.toLocaleString()} → $${e.to?.toLocaleString()}`);
    }
  } else {
    console.log("No changes since last run.");
  }
}

main().catch((e) => {
  console.error("Crawl failed:", e);
  process.exit(1);
});
