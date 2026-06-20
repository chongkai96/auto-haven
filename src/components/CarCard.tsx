import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/cars";
import { formatPrice, formatMileage, regYear } from "@/lib/format";

export default function CarCard({ car }: { car: Car }) {
  const isSold = car.status === "s";
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <Image
          src={car.image}
          alt={car.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {car.bodyType && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-medium text-white">
            {car.bodyType}
          </span>
        )}
        {isSold && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            Sold
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-ink group-hover:text-accent-strong">
          {car.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          <span>{regYear(car.registrationDate)}</span>
          <span>·</span>
          <span>{formatMileage(car.mileage)}</span>
          {car.transmission && (
            <>
              <span>·</span>
              <span>{car.transmission}</span>
            </>
          )}
        </div>

        <div className="mt-auto pt-4">
          <div className="text-lg font-extrabold text-ink">{formatPrice(car.price)}</div>
          {car.depreciation != null && (
            <div className="text-xs text-muted">
              Depreciation {formatPrice(car.depreciation)}/yr
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
