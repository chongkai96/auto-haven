import listings from "@/data/listings.json";

export type Car = {
  id: number;
  slug: string;
  title: string;
  make: string | null;
  model: string | null;
  bodyType: string | null;
  price: number | null;
  depreciation: number | null;
  instalment: number | null;
  registrationDate: string | null;
  coeLeft: string | null;
  mileage: number | null;
  engineCapacity: string | null;
  transmission: string | null;
  fuelType: string | null;
  owners: string | null;
  vehicleScheme: string | null;
  driveRange: string | null;
  description: string;
  status: string | null;
  sourceLink: string | null;
  image: string;
  images?: string[];
  imageSource: string | null;
  dealer: string;
  firstSeen?: string;
  lastSeen?: string;
};

export type Inventory = {
  dealer: string;
  dealerId: string;
  source: string;
  crawledAt: string;
  count: number;
  cars: Car[];
};

const inventory = listings as Inventory;

export function getInventory(): Inventory {
  return inventory;
}

export function getAllCars(): Car[] {
  return inventory.cars;
}

export function getCar(slug: string): Car | undefined {
  return inventory.cars.find((c) => c.slug === slug);
}

/** Newest first by first-seen date, then by id. */
export function getLatestCars(limit?: number): Car[] {
  const sorted = [...inventory.cars].sort((a, b) => {
    const d = (b.firstSeen ?? "").localeCompare(a.firstSeen ?? "");
    return d !== 0 ? d : b.id - a.id;
  });
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getMakes(): string[] {
  return [...new Set(inventory.cars.map((c) => c.make).filter(Boolean) as string[])].sort();
}

export function getBodyTypes(): string[] {
  return [...new Set(inventory.cars.map((c) => c.bodyType).filter(Boolean) as string[])].sort();
}

/** Cars most like the given one: same body type / make first, then closest price. */
export function getSimilarCars(car: Car, limit = 4): Car[] {
  const score = (c: Car) => {
    let s = 0;
    if (c.bodyType && c.bodyType === car.bodyType) s += 3;
    if (c.make && c.make === car.make) s += 2;
    const priceGap = Math.abs((c.price ?? 0) - (car.price ?? 0));
    return s * 10_000_000 - priceGap; // matches dominate, then nearest price
  };
  return inventory.cars
    .filter((c) => c.id !== car.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
