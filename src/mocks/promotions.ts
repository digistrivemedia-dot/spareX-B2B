import type { Offer } from "@/features/promotions/types";

export const offers: Offer[] = [
  {
    id: "offer-oil-cartons",
    title: "Bulk engine-oil deal: extra 5% on 5+ cartons",
    description:
      "Motul, Castrol and Shell. Mix brands and grades; the discount applies at checkout.",
    ctaLabel: "Shop engine oils",
    href: "/catalog?category=oils",
    imageUrl: "/images/banners/engine-oil.jpg",
    imageAlt: "Golden engine oil pouring from a metal spout",
  },
  {
    id: "offer-rolon-kits",
    title: "New: Rolon chain kits now in stock",
    description:
      "Chain and sprocket kits for Pulsar, Classic 350, Duke 200 and Splendor, ready to ship.",
    ctaLabel: "View chain kits",
    href: "/catalog?category=chain",
    imageUrl: "/images/banners/chain-kits.jpg",
    imageAlt: "Motorcycle chain with front and rear sprockets",
  },
];
