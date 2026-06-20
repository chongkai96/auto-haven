"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({
  images,
  alt,
  sold = false,
}: {
  images: string[];
  alt: string;
  sold?: boolean;
}) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card">
        {current && (
          <Image
            key={current}
            src={current}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        )}
        {sold && (
          <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
            Sold
          </span>
        )}
        {list.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-white">
            {active + 1} / {list.length}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                i === active ? "border-accent ring-1 ring-accent" : "border-border hover:border-accent/60"
              }`}
            >
              <Image src={src} alt={`${alt} photo ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
