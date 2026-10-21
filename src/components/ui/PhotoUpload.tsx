"use client";

import { Camera, LoaderCircle, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { PhotoThumbnail } from "@/components/ui/PhotoThumbnail";
import { resizeImage } from "@/lib/images";

type PhotoUploadProps = {
  id: string;
  value: string[];
  onChange: (photos: string[]) => void;
  max: number;
  /** e.g. "Return photo", for the viewer and screen readers. */
  label: string;
  isInvalid?: boolean;
  /** The id of the text that describes the field, for aria-describedby. */
  describedBy?: string;
};

/**
 * Take or choose photos (phones offer the camera), shrunk before upload. Thumbnails open full
 * size; each can be removed.
 */
export function PhotoUpload({
  id,
  value,
  onChange,
  max,
  label,
  isInvalid,
  describedBy,
}: PhotoUploadProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])].slice(0, max - value.length);
    event.target.value = "";
    if (files.length === 0) return;
    setIsPreparing(true);
    setError(undefined);
    try {
      onChange([...value, ...(await Promise.all(files.map((file) => resizeImage(file))))]);
    } catch {
      setError("That file couldn't be read. Try a JPG or PNG photo.");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((photo, index) => (
          <li key={photo.slice(-32) + index} className="relative">
            <PhotoThumbnail
              src={photo}
              label={`Open ${label.toLowerCase()} ${index + 1}`}
              onOpen={() => setOpenIndex(index)}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:text-danger-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X aria-hidden className="size-4" />
            </button>
          </li>
        ))}
        {value.length < max && (
          <li>
            <label
              htmlFor={id}
              data-invalid={isInvalid || undefined}
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white text-xs font-medium text-navy-700 hover:bg-gray-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring data-invalid:border-danger-600"
            >
              {isPreparing ? (
                <LoaderCircle aria-hidden className="size-5 animate-spin" />
              ) : (
                <Camera aria-hidden className="size-5" />
              )}
              {isPreparing ? "Preparing…" : "Add photo"}
              <input
                id={id}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={isPreparing}
                aria-describedby={describedBy}
                className="sr-only"
              />
            </label>
          </li>
        )}
      </ul>
      {error && <p className="text-sm text-danger-700">{error}</p>}
      <ImageViewer photos={value} index={openIndex} onIndexChange={setOpenIndex} label={label} />
    </div>
  );
}
