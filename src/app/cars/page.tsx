import type { Metadata } from "next";
import { getAllCars, getBodyTypes, getMakes } from "@/lib/cars";
import ListingsBrowser from "@/components/ListingsBrowser";

export const metadata: Metadata = {
  title: "Used Cars for Sale",
  description: "Browse AutoHaven's full range of quality pre-owned cars in Singapore.",
};

export default function CarsPage() {
  const cars = getAllCars();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Cars for sale</h1>
        <p className="mt-2 text-muted">
          Our complete showroom inventory, refreshed daily from our listing.
        </p>
      </header>
      <ListingsBrowser cars={cars} makes={getMakes()} bodyTypes={getBodyTypes()} />
    </div>
  );
}
