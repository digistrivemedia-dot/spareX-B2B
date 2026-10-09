"use client";

import type { MouseEvent, ReactNode } from "react";

import { useProductDrawer } from "@/features/catalog/use-product-drawer";

type ProductLinkProps = {
  productId: string;
  children: ReactNode;
};

/** Opens the product drawer. A real link, so it also works in a new tab. */
export function ProductLink({ productId, children }: ProductLinkProps) {
  const { hrefFor, open } = useProductDrawer();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle ctrl/cmd/shift-click (new tab or window).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    open(productId);
  }

  return (
    <a
      href={hrefFor(productId)}
      onClick={handleClick}
      className="font-medium text-gray-900 hover:text-navy-700 hover:underline"
    >
      {children}
    </a>
  );
}
