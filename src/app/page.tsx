import Link from "next/link";
import { getInventory, getLatestCars, getMakes } from "@/lib/cars";
import { site } from "@/lib/site";
import CarCard from "@/components/CarCard";
import Photo from "@/components/Photo";

// Consistent line icons for the value-prop cards (same order as site.highlights).
const HIGHLIGHT_ICONS = [
  // Pre-sales inspected — magnifier
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>,
  // Warranty — shield with check
  <>
    <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>,
  // Free servicing package — gift box
  <>
    <rect x="3" y="9" width="18" height="12" rx="1" />
    <path d="M3 13h18M12 9v12" />
    <path d="M7.5 9a2.5 2.5 0 0 1 0-5C10 4 12 9 12 9M16.5 9a2.5 2.5 0 0 0 0-5C14 4 12 9 12 9" />
  </>,
  // Lifetime free tow — truck
  <>
    <rect x="1" y="6" width="12" height="9" rx="1" />
    <path d="M13 9h4l3 3v3h-7z" />
    <circle cx="5" cy="17" r="1.6" />
    <circle cx="17" cy="17" r="1.6" />
  </>,
  // Own workshop support — wrench
  <>
    <path d="M14.7 6.3a4 4 0 0 0-5.66 5.66l-6.34 6.34a2 2 0 0 0 2.83 2.83l6.34-6.34a4 4 0 0 0 5.66-5.66l-2.83 2.83-2.83-2.83 2.83-2.83z" />
  </>,
];

// Icons for the servicing teaser cards (same order as site.servicing.services:
// routine servicing, preventive maintenance, major repair works, tyres/wheels).
const SERVICE_ICONS = [
  // Routine servicing — oil drop
  <path key="i" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  // Preventive maintenance — gauge / diagnostics
  <>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 14l3.5-3.5" />
    <circle cx="12" cy="14" r="1.2" />
  </>,
  // Major repair works — wrench
  <path
    key="i"
    d="M14.7 6.3a4 4 0 0 0-5.66 5.66l-6.34 6.34a2 2 0 0 0 2.83 2.83l6.34-6.34a4 4 0 0 0 5.66-5.66l-2.83 2.83-2.83-2.83 2.83-2.83z"
  />,
  // Tyres, wheels & alignment — wheel
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </>,
];

export default function Home() {
  const inventory = getInventory();
  const featured = getLatestCars(6);
  const makeCount = getMakes().length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_0%,rgba(34,147,196,0.20),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {inventory.count} cars in stock · updated daily
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Quality pre-owned cars,
            <span className="text-accent"> honestly priced.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            {site.name} hand-picks every car in our showroom — and our own workshop,{" "}
            {site.servicing.name}, keeps it running long after you drive away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-strong"
            >
              Browse the stock
            </Link>
            <Link
              href="/servicing"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Book a service
            </Link>
          </div>

          <dl className="mt-12 flex max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {[
              { label: "Cars in stock", value: inventory.count },
              { label: "Brands", value: makeCount },
              { label: "Updated", value: "Daily" },
            ].map((s, i) => (
              <div key={s.label} className={`flex-1 px-4 py-4 text-center ${i > 0 ? "border-l border-white/10" : ""}`}>
                <dt className="text-2xl font-extrabold text-accent">{s.value}</dt>
                <dd className="mt-0.5 text-xs text-white/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Real value props (from the dealer's banner) */}
      <section className="border-b border-border bg-card">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 sm:gap-4 sm:py-10 lg:grid-cols-5">
          {site.highlights.map((h, i) => {
            const lastOdd =
              i === site.highlights.length - 1 && site.highlights.length % 2 === 1;
            return (
              <li
                key={h.title}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background px-3 py-6 text-center ${
                  lastOdd ? "col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/10 text-accent-strong">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {HIGHLIGHT_ICONS[i]}
                  </svg>
                </span>
                <span className="text-sm font-semibold leading-snug text-ink">{h.title}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Latest arrivals</h2>
            <p className="mt-1 text-muted">Fresh into the showroom.</p>
          </div>
          <Link href="/cars" className="text-sm font-semibold text-accent-strong hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Showroom */}
      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
              Our showroom
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
              Come see them in person
            </h2>
            <p className="mt-4 text-muted">
              Drop by our showroom at WCEGA Plaza to view our cars up close. No pressure — just
              honest advice and a coffee.
            </p>
            <p className="mt-4 text-sm font-medium text-ink">{site.contact.address}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-strong"
              >
                WhatsApp us
              </a>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="rounded-lg border border-border px-6 py-3 font-semibold text-ink hover:bg-background"
              >
                Call {site.contact.phone}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Photo
              src="/images/showroom-1.jpg"
              alt="AutoHaven showroom"
              className="col-span-2 aspect-[16/9] w-full rounded-xl"
            />
            <Photo
              src="/images/showroom-2.jpg"
              alt="Showroom interior"
              className="aspect-square w-full rounded-xl"
            />
            <Photo
              src="/images/showroom-3.jpg"
              alt="Cars on display"
              className="aspect-square w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Servicing teaser */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-revo">
              {site.servicing.name}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
              Servicing & maintenance for every make
            </h2>
            <p className="mt-4 text-muted">
              {site.servicing.tagline} From routine servicing to major repairs, our workshop keeps
              your car healthy — whether you bought it from us or not.
            </p>
            <Link
              href="/servicing"
              className="mt-6 inline-block rounded-lg bg-ink px-6 py-3 font-semibold text-white hover:bg-ink-soft"
            >
              Explore servicing
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {site.servicing.services.map((s, i) => (
              <div key={s} className="rounded-xl border border-border bg-card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-revo/10 text-revo">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {SERVICE_ICONS[i]}
                  </svg>
                </span>
                <div className="mt-3 font-semibold text-ink">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
