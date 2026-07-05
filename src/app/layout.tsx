import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  verification: {
    google: "NUOawR-iW0ewJNg7HsGlC3H31pKE1QPMx5ePP_dC-Nc",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: ["/images/showroom-1.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const dealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  image: `${site.url}${site.logo}`,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1 Bukit Batok Crescent #05-22, WCEGA Plaza",
    addressLocality: "Singapore",
    postalCode: "658064",
    addressCountry: "SG",
  },
  sameAs: [
    site.socials.sales,
    site.socials.facebook.sales,
    site.socials.servicing,
    site.socials.facebook.servicing,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={dealerJsonLd} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
