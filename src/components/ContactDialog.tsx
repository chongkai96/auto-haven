"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function ContactDialog({
  carTitle,
  price,
}: {
  carTitle: string;
  price: string;
}) {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const waText = encodeURIComponent(
    `Hi, I'm interested in the ${carTitle} (${price}). Is it still available?`,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full rounded-lg bg-accent px-5 py-3 text-center font-semibold text-white hover:bg-accent-strong"
      >
        Contact Us
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contact our team"
            className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">Contact our team</h2>
                <p className="mt-0.5 text-sm text-muted">About the {carTitle}.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 rounded-md p-1.5 text-muted hover:bg-background hover:text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {site.contact.team.map((m) => (
                <li
                  key={m.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div>
                    <div className="font-semibold text-ink">{m.name}</div>
                    <div className="text-sm text-muted">+65 {m.phone}</div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a
                      href={`tel:+65${m.phone.replace(/\s/g, "")}`}
                      className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-background"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${m.whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5d]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
