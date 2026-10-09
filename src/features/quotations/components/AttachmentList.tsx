import { FileDown } from "lucide-react";

import type { Attachment } from "@/features/quotations/types";

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) {
    return <p className="text-sm text-gray-500">No attachments.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a
            href={attachment.url}
            download
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <FileDown aria-hidden className="size-4 text-navy-700" />
            <span className="flex-1 font-medium text-gray-900">{attachment.name}</span>
            <span className="text-xs text-gray-500">
              PDF · {formatSize(attachment.sizeInBytes)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
