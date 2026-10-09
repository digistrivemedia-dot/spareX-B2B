import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

const frameVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-gray-400",
  {
    variants: {
      size: {
        sm: "size-10",
        md: "size-16",
        lg: "aspect-video w-full",
      },
    },
  },
);

const iconVariants = cva("", {
  variants: {
    size: { sm: "size-5", md: "size-7", lg: "size-12" },
  },
});

const IMAGE_SIZES = { sm: "40px", md: "64px", lg: "(min-width: 768px) 320px, 100vw" };

type ProductImageProps = {
  /** The product's first photo, if it has one. */
  src?: string;
  alt: string;
  /** Shown when there's no photo; usually the product's category icon. */
  fallbackIcon: LucideIcon;
  size: "sm" | "md" | "lg";
};

/** A product photo, or a tidy placeholder until the client sends photos. */
export function ProductImage({ src, alt, fallbackIcon: Icon, size }: ProductImageProps) {
  return (
    <span className={frameVariants({ size })}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={IMAGE_SIZES[size]} className="object-contain p-1" />
      ) : (
        <Icon aria-hidden className={iconVariants({ size })} />
      )}
    </span>
  );
}
