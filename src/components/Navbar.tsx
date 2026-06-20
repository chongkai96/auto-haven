"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const onServicing = pathname?.startsWith("/servicing");
  const logo = onServicing ? site.servicing.logo : site.logo;
  const logoAlt = onServicing ? site.servicing.name : site.name;
  const enquireWa = onServicing ? site.servicing.contact.whatsapp : site.contact.whatsapp;

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10"
      // Match the displayed logo's own background so the logo blends in seamlessly
      // (AutoHaven logo bg = #000000, RevoHaven logo bg = #101010).
      style={{ backgroundColor: onServicing ? "#101010" : "#000000" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex shrink-0 items-center" aria-label={site.name} onClick={() => setOpen(false)}>
          <Image
            src={logo}
            alt={logoAlt}
            width={150}
            height={48}
            priority
            className="h-8 w-auto object-contain sm:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${enquireWa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
          >
            Enquire
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-1 inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 sm:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-white/10 px-4 py-3 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${enquireWa}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-accent px-3 py-2.5 text-center text-base font-semibold text-white hover:bg-accent-strong"
          >
            Enquire on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
