"use client";

import { useState } from "react";

/**
 * An <img> that falls back to a branded placeholder tile if the file isn't
 * present yet (e.g. before the showroom/workshop photos have been added to
 * /public/images). Once the file exists, the real photo shows automatically.
 */
export default function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-ink to-ink-soft p-4 text-center ${className}`}
      >
        <span className="text-xs font-medium text-white/45">{alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
