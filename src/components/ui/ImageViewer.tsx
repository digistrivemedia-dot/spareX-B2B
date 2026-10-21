"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type ImageViewerProps = {
  photos: string[];
  /** The photo on show; null when the viewer is closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** e.g. "Return photo", numbered for screen readers. */
  label: string;
};

/** A full-size photo with previous / next buttons; the arrow keys work too. */
export function ImageViewer({ photos, index, onIndexChange, label }: ImageViewerProps) {
  const count = photos.length;
  const go = (step: number) => index !== null && onIndexChange((index + step + count) % count);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onIndexChange(null)}>
      <DialogContent className="sm:max-w-3xl" onKeyDown={handleKeyDown}>
        <DialogTitle>
          {label} {index !== null ? index + 1 : ""} of {count}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Use the arrow keys to see the others.
        </DialogDescription>
        {index !== null && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={photos[index]}
              alt={`${label} ${index + 1}`}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-contain"
            />
          </div>
        )}
        {count > 1 && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => go(-1)}>
              <ChevronLeft aria-hidden />
              Previous
            </Button>
            <Button variant="outline" onClick={() => go(1)}>
              Next
              <ChevronRight aria-hidden />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
