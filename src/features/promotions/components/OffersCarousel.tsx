"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { OfferSlide } from "@/features/promotions/components/OfferSlide";
import type { Offer } from "@/features/promotions/types";
import { cn } from "@/lib/utils";

/** Business offers, one per slide. Swipe, use the arrow keys, or pick a dot. */
export function OffersCarousel({ offers }: { offers: Offer[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (offers.length === 0) return null;

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      aria-label="Business offers"
      className="overflow-hidden rounded-xl shadow-sm"
    >
      <CarouselContent className="ml-0">
        {offers.map((offer, index) => (
          <CarouselItem
            key={offer.id}
            className="pl-0"
            aria-label={`${index + 1} of ${offers.length}`}
          >
            <OfferSlide offer={offer} isFirst={index === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {offers.length > 1 && (
        <div className="absolute bottom-3 left-6 flex gap-1 sm:right-6 sm:left-auto">
          {offers.map((offer, index) => (
            <button
              key={offer.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Show offer ${index + 1}: ${offer.title}`}
              aria-current={index === current}
              // The visible dot is small; the padding gives it a comfortable tap target.
              className="group rounded-full p-1.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  index === current ? "w-5 bg-white" : "w-1.5 bg-navy-200 group-hover:bg-white",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </Carousel>
  );
}
