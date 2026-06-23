import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCars, getCar, getSimilarCars } from "@/lib/cars";
import Gallery from "@/components/Gallery";
import ContactDialog from "@/components/ContactDialog";
import CarCard from "@/components/CarCard";
import { formatPrice, formatMileage } from "@/lib/format";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllCars().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return { title: "Car not found" };
  return {
    title: car.title,
    description: `${car.title} for sale at ${formatPrice(car.price)} — ${site.name}.`,
  };
}

export default async function CarDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();

  const specs: { label: string; value: string | null }[] = [
    { label: "Registration", value: car.registrationDate },
    { label: "COE left", value: car.coeLeft },
    { label: "Mileage", value: formatMileage(car.mileage) },
    { label: "Engine", value: car.engineCapacity },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel", value: car.fuelType },
    { label: "Body type", value: car.bodyType },
    { label: "Owners", value: car.owners },
    { label: "Scheme", value: car.vehicleScheme },
    { label: "Range (EV)", value: car.driveRange },
  ];

  const similar = getSimilarCars(car, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-28 lg:pb-10">
      <Link href="/cars" className="text-sm font-medium text-accent-strong hover:underline">
        ← Back to all cars
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Gallery */}
        <div>
          <Gallery
            images={car.images?.length ? car.images : [car.image]}
            alt={car.title}
            sold={car.status === "s"}
          />

          {car.description && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold text-ink">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {car.description}
              </p>
            </div>
          )}
        </div>

        {/* Summary / CTA */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {car.make && (
              <div className="text-sm font-medium text-accent-strong">{car.make}</div>
            )}
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{car.title}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-ink">{formatPrice(car.price)}</span>
              {car.instalment != null && (
                <span className="text-sm text-muted">
                  ~{formatPrice(car.instalment)}/mo
                </span>
              )}
            </div>
            {car.depreciation != null && (
              <div className="mt-1 text-sm text-muted">
                Depreciation {formatPrice(car.depreciation)}/yr
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-6 text-sm">
              {specs
                .filter((s) => s.value && s.value !== "—")
                .map((s) => (
                  <div key={s.label}>
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
            </dl>

            <div className="mt-6 space-y-2">
              <ContactDialog carTitle={car.title} price={formatPrice(car.price)} />
              {car.sourceLink && (
                <a
                  href={car.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-center text-xs text-muted hover:text-accent-strong"
                >
                  View original listing on sgcarmart ↗
                </a>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-ink p-5 text-sm text-white/80">
            <div className="font-semibold text-white">Need it serviced?</div>
            <p className="mt-1 text-white/60">
              {site.servicing.name} handles servicing & maintenance for this car and any other make.
            </p>
            <Link href="/servicing" className="mt-2 inline-block font-semibold text-revo">
              Learn more →
            </Link>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">Similar cars</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-xs text-muted">{car.title}</div>
            <div className="text-lg font-extrabold text-ink">{formatPrice(car.price)}</div>
          </div>
          <div className="shrink-0">
            <ContactDialog carTitle={car.title} price={formatPrice(car.price)} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
