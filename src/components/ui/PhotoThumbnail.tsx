import Image from "next/image";

type PhotoThumbnailProps = {
  src: string;
  /** e.g. "Open return photo 2". */
  label: string;
  onOpen: () => void;
};

/** A square photo thumbnail that opens the full-size viewer. */
export function PhotoThumbnail({ src, label, onOpen }: PhotoThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="relative block aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Image src={src} alt="" fill sizes="160px" className="object-cover" />
    </button>
  );
}
