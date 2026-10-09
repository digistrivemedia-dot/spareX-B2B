import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Offer } from "@/features/promotions/types";

type OfferSlideProps = {
  offer: Offer;
  /** Only the first slide's image loads eagerly. */
  isFirst: boolean;
};

export function OfferSlide({ offer, isFirst }: OfferSlideProps) {
  return (
    <div className="relative flex h-72 flex-col justify-end overflow-hidden bg-navy-900 p-6 sm:h-56 sm:justify-center sm:p-8">
      <Image
        src={offer.imageUrl}
        alt={offer.imageAlt}
        fill
        sizes="(min-width: 768px) 80vw, 100vw"
        preload={isFirst}
        className="object-cover"
      />
      {/* Darkens the photo behind the text so white copy stays readable (WCAG AA). */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/85 to-navy-900/20 sm:bg-linear-to-r sm:via-navy-900/70 sm:to-transparent"
      />
      <div className="relative flex max-w-md flex-col items-start gap-2 pb-6 sm:pb-0">
        <span className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
          Business offer
        </span>
        <h3 className="text-lg leading-snug font-semibold text-white">{offer.title}</h3>
        <p className="text-sm text-navy-200">{offer.description}</p>
        <Button asChild size="sm" className="mt-2">
          <Link href={offer.href}>{offer.ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
