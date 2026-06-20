"use client";

import { useMemo, useState } from "react";
import type { Car } from "@/lib/cars";
import CarCard from "./CarCard";

type SortKey = "price-asc" | "price-desc" | "depre-asc" | "mileage-asc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Latest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "depre-asc", label: "Lowest Depreciation" },
  { key: "mileage-asc", label: "Lowest Mileage" },
];

export default function ListingsBrowser({
  cars,
  makes,
  bodyTypes,
}: {
  cars: Car[];
  makes: string[];
  bodyTypes: string[];
}) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("");
  const [body, setBody] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cap = maxPrice ? Number(maxPrice) : Infinity;

    const result = cars.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q)) return false;
      if (make && c.make !== make) return false;
      if (body && c.bodyType !== body) return false;
      if ((c.price ?? Infinity) > cap) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "price-desc":
          return (b.price ?? -Infinity) - (a.price ?? -Infinity);
        case "depre-asc":
          return (a.depreciation ?? Infinity) - (b.depreciation ?? Infinity);
        case "mileage-asc":
          return (a.mileage ?? Infinity) - (b.mileage ?? Infinity);
        case "newest":
        default:
          return (b.firstSeen ?? "").localeCompare(a.firstSeen ?? "") || b.id - a.id;
      }
    });
    return result;
  }, [cars, query, make, body, maxPrice, sort]);

  const reset = () => {
    setQuery("");
    setMake("");
    setBody("");
    setMaxPrice("");
    setSort("newest");
  };

  const fieldClass =
    "h-10 rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className={`${fieldClass} lg:col-span-2`}
            placeholder="Search make or model…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className={fieldClass} value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">All makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select className={fieldClass} value={body} onChange={(e) => setBody(e.target.value)}>
            <option value="">All body types</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            type="number"
            className={fieldClass}
            placeholder="Max price ($)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Sort</span>
            <select
              className={fieldClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={reset} className="text-sm font-medium text-accent-strong hover:underline">
            Reset filters
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        Showing <span className="font-semibold text-ink">{filtered.length}</span> of {cars.length} cars
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted">
          No cars match your filters. Try widening your search.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
