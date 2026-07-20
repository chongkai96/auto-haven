import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src={site.logo}
            alt={site.name}
            width={170}
            height={55}
            className="h-11 w-auto object-contain"
          />
          <p className="mt-3 max-w-xs text-sm text-white/60">{site.shortDescription}</p>
          <p className="mt-2 text-xs italic text-green">{site.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/60 hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>{site.contact.phone}</li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-accent">
                {site.contact.email}
              </a>
            </li>
            <li>{site.contact.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Follow</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>
              <a href={site.socials.sales} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                Instagram — @autohavensg
              </a>
            </li>
            <li>
              <a href={site.socials.facebook.sales} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                Facebook — AutoHaven SG
              </a>
            </li>
            <li>
              <a href={site.socials.servicing} target="_blank" rel="noopener noreferrer" className="hover:text-revo">
                Instagram — @revohaven
              </a>
            </li>
            <li>
              <a href={site.socials.facebook.servicing} target="_blank" rel="noopener noreferrer" className="hover:text-revo">
                Facebook — RevoHaven
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {site.legalName}. Inventory sourced from our{" "}
        <a href={site.sourceListing} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
          sgcarmart listing
        </a>
        , updated daily.
      </div>
    </footer>
  );
}
