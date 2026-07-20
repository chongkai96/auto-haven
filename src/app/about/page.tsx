import type { Metadata } from "next";
import { getInventory } from "@/lib/cars";
import { site } from "@/lib/site";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "About & Contact",
  description: `About ${site.name} and ${site.servicing.name}, and how to reach us.`,
};

export default function AboutPage() {
  const inventory = getInventory();
  const c = site.contact;
  const sc = site.servicing.contact;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">About {site.name}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{site.description}</p>
      <p className="mt-4 leading-relaxed text-ink-soft">
        We keep a tight, hand-picked selection of quality pre-owned cars and back every one with our
        own workshop, <strong>{site.servicing.name}</strong>, so the relationship doesn&apos;t end at
        the sale. Our inventory is updated daily — {inventory.count} cars are in stock right now.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Photo
          src="/images/showroom-1.jpg"
          alt="AutoHaven showroom"
          className="aspect-[4/3] w-full rounded-xl"
        />
        <Photo
          src="/images/workshop-1.jpg"
          alt="Revo Haven workshop"
          className="aspect-[4/3] w-full rounded-xl"
        />
      </div>

      {/* Two companies, two contacts */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-ink">{site.name} — Sales</h2>
          <p className="text-xs text-muted">{site.legalName}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>{c.address}</li>
            <li>
              <span className="text-muted">Phone:</span> {c.phone}
            </li>
            <li>
              <span className="text-muted">Email:</span>{" "}
              <a href={`mailto:${c.email}`} className="text-accent-strong hover:underline">
                {c.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <a href={site.socials.sales} target="_blank" rel="noopener noreferrer" className="text-accent-strong hover:underline">
              Instagram
            </a>
            <a href={site.socials.facebook.sales} target="_blank" rel="noopener noreferrer" className="text-accent-strong hover:underline">
              Facebook
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-ink">{site.servicing.name} — Servicing</h2>
          <p className="text-xs text-muted">{site.servicing.legalName}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>{sc.address}</li>
            <li>
              <span className="text-muted">Phone:</span> {sc.phone}
            </li>
            <li>
              <span className="text-muted">Email:</span>{" "}
              <a href={`mailto:${sc.email}`} className="text-revo hover:underline">
                {sc.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <a href={site.socials.servicing} target="_blank" rel="noopener noreferrer" className="text-revo hover:underline">
              Instagram
            </a>
            <a href={site.socials.facebook.servicing} target="_blank" rel="noopener noreferrer" className="text-revo hover:underline">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Sales team */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold text-ink">Speak to our sales team</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {c.team.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-background p-4">
              <div className="font-semibold text-ink">{m.name}</div>
              <a
                href={`https://wa.me/${m.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-accent-strong hover:underline"
              >
                {m.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
