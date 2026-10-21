"use client";

import { useState } from "react";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { PhotoThumbnail } from "@/components/ui/PhotoThumbnail";

type PhotoGalleryProps = {
  photos: string[];
  /** e.g. "Return photo". */
  label: string;
};

/** Thumbnails that open full size in the image viewer. */
export function PhotoGallery({ photos, label }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.slice(-32) + index}>
            <PhotoThumbnail
              src={photo}
              label={`Open ${label.toLowerCase()} ${index + 1}`}
              onOpen={() => setOpenIndex(index)}
            />
          </li>
        ))}
      </ul>
      <ImageViewer photos={photos} index={openIndex} onIndexChange={setOpenIndex} label={label} />
    </>
  );
}
