import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "Servicing & Maintenance",
  description: `${site.servicing.legalName} — trusted car servicing and maintenance in Singapore for every make and model.`,
};

const sv = site.servicing;
const c = sv.contact;

const packages = [
  {
    name: "Routine Servicing",
    blurb: "Keep things running smoothly between intervals.",
    items: ["Engine oil & oil filter", "Fluid top-ups", "Multi-point safety check", "Tyre & brake inspection"],
  },
  {
    name: "Preventive Maintenance",
    blurb: "Catch issues early, before they get expensive.",
    items: ["Belts, plugs & filters", "Brakes & suspension", "Battery & electrical check", "Computer diagnostics"],
    featured: true,
  },
  {
    name: "Major Repair Works",
    blurb: "Bigger jobs handled in-house.",
    items: ["Engine & transmission", "Air-conditioning", "Electrical faults", "Overhauls & replacements"],
  },
  {
    name: "Tyres, Wheels & Alignment",
    blurb: "Grip, comfort and straight-line stability.",
    items: ["New tyres & fitting", "Wheel balancing", "Wheel alignment", "Rim repair advice"],
  },
];

export default function ServicingPage() {
  const waBook = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(
    `Hi ${sv.name}, I'd like to book a service.`,
  )}`;

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <Image
            src={sv.logo}
            alt={sv.name}
            width={170}
            height={60}
            className="h-12 w-auto object-contain"
          />
          <span className="mt-5 block text-sm font-semibold uppercase tracking-wide text-revo">
            {sv.legalName} · {sv.category}
          </span>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Servicing & maintenance you can trust
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            {sv.about} We service every make and model — not just cars bought from {site.name}.
          </p>
          <a
            href={waBook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-revo px-6 py-3 font-semibold text-white hover:bg-revo-strong"
          >
            Book a service on WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">What we offer</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                p.featured ? "border-revo bg-card shadow-md" : "border-border bg-card shadow-sm"
              }`}
            >
              {p.featured && (
                <span className="mb-3 w-fit rounded-full bg-revo px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-revo">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Pricing depends on your car&apos;s make, model and condition. Message us for a quote.
        </p>
      </section>

      {/* Workshop gallery */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Inside our workshop</h2>
          <p className="mt-2 max-w-2xl text-muted">
            A fully-equipped workshop stocked with quality parts and Motul lubricants.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Photo src="/images/workshop-1.jpg" alt="Revo Haven workshop" className="aspect-[4/3] w-full rounded-xl" />
            <Photo src="/images/workshop-2.jpg" alt="Servicing bay" className="aspect-[4/3] w-full rounded-xl" />
            <Photo src="/images/workshop-3.jpg" alt="Car on the lift" className="aspect-[4/3] w-full rounded-xl" />
            <Photo src="/images/workshop-4.jpg" alt="Tools & equipment" className="aspect-[4/3] w-full rounded-xl" />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["1. Tell us your car", "Send your car model and the issue or service you need."],
              ["2. Get a quote & slot", "We confirm the work, price and a workshop appointment."],
              ["3. Drive away serviced", "We service it properly and keep you posted throughout."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-card p-6">
                <div className="font-semibold text-ink">{t}</div>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between">
            <div className="text-sm text-ink-soft">
              <div className="font-bold text-ink">{sv.legalName}</div>
              <div className="mt-1">{c.address}</div>
              <div className="mt-1">
                {c.phone} ·{" "}
                <a href={`mailto:${c.email}`} className="text-revo hover:underline">
                  {c.email}
                </a>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
              <a
                href={waBook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-revo px-6 py-3 font-semibold text-white hover:bg-revo-strong"
              >
                Book on WhatsApp
              </a>
              <Link
                href="/cars"
                className="rounded-lg border border-border px-6 py-3 font-semibold text-ink hover:bg-background"
              >
                Looking to buy instead?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
