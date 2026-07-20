/**
 * Central brand + contact config. Edit these in one place to reskin the site.
 * Brand details are from the real Instagram/Facebook profiles and the dealer's
 * own materials. @autohavensg / fb.com/AutoHavenSg — sales (Auto Haven);
 * @revohaven / fb.com/RevoHaven — servicing (Revo Haven).
 */
export const site = {
  name: "Auto Haven",
  legalName: "Autohaven Pte Ltd",
  // Canonical site URL (update to the custom domain when you get one).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://auto-haven-jade.vercel.app",
  logo: "/logo-autohaven.jpg",
  tagline: "Driven to serve you better.",
  category: "Car dealership",
  description:
    "Autohaven Pte Ltd offers an extensive fleet of high-quality pre-owned vehicles that " +
    "cater to all budgets and needs. Our vehicles undergo thorough inspections to ensure " +
    "quality, reliability, and performance, giving you peace of mind with every purchase. " +
    "We're committed to making your car-buying experience seamless, transparent, and " +
    "tailored to your specific requirements.",
  // Condensed version for tight spots (e.g. the footer column).
  shortDescription:
    "Autohaven Pte Ltd offers an extensive fleet of high-quality pre-owned vehicles that " +
    "cater to all budgets and needs.",

  // Auto Haven contact — used everywhere EXCEPT the servicing page.
  contact: {
    phone: "+65 9657 9676",
    whatsapp: "6596579676", // digits only, for wa.me links
    email: "autohavensg@gmail.com",
    address: "1 Bukit Batok Crescent #05-22, WCEGA Plaza, Singapore 658064",
    team: [
      { name: "Ethan", phone: "8890 2010", whatsapp: "6588902010" },
      { name: "Steve", phone: "8790 0193", whatsapp: "6587900193" },
      { name: "Allen", phone: "8829 9383", whatsapp: "6588299383" },
    ],
  },

  // Real value propositions (from the dealer's sales banner).
  highlights: [
    { title: "Pre-Sales Full Car Inspected", icon: "🔍" },
    { title: "Warranty Package Provided", icon: "🛡️" },
    { title: "Free Servicing Package", icon: "🧰" },
    { title: "Lifetime Free Tow", icon: "🚚" },
    { title: "Own Workshop Support", icon: "🔧" },
  ],

  // Servicing / maintenance arm — RevoHaven Pte Ltd.
  servicing: {
    name: "Revo Haven",
    legalName: "RevoHaven Pte Ltd",
    logo: "/logo-revohaven.jpg",
    category: "Automotive Repair Shop",
    tagline: "Trusted servicing & maintenance for every make.",
    about:
      "Experienced automotive professionals providing everything from routine " +
      "maintenance to major repair works.",
    services: [
      "Routine servicing",
      "Preventive maintenance",
      "Major repair works",
      "Tyres, wheels & alignment",
    ],
    // Revo Haven contact — used on the servicing page.
    contact: {
      phone: "+65 8881 6731",
      whatsapp: "6588816731",
      email: "revohaven@gmail.com",
      address: "1 Bukit Batok Crescent #06-23, WCEGA Plaza, Singapore 658064",
    },
  },

  socials: {
    sales: "https://www.instagram.com/autohavensg",
    servicing: "https://www.instagram.com/revohaven",
    facebook: {
      sales: "https://www.facebook.com/AutoHavenSg",
      servicing: "https://www.facebook.com/RevoHaven",
    },
  },

  // Source of truth for inventory (crawled daily)
  sourceListing: "https://www.sgcarmart.com/used-cars/listing?dl=3647",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Buy a Car" },
  { href: "/servicing", label: "Servicing" },
  { href: "/about", label: "About" },
] as const;
