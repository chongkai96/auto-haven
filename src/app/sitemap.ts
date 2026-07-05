import type { MetadataRoute } from "next";
import { getAllCars } from "@/lib/cars";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cars`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/servicing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const carPages: MetadataRoute.Sitemap = getAllCars().map((c) => ({
    url: `${base}/cars/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...carPages];
}
