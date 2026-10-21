"use client";

import { CircleAlert, TriangleAlert } from "lucide-react";

import { ProductImage } from "@/components/ui/ProductImage";
import { useBranchStock } from "@/features/catalog/use-branch-stock";
import { getCategoryIcon, getPackLabel } from "@/features/catalog/utils";
import type { CartLine } from "@/features/cart/types";
import { getCartIssue } from "@/features/cart/utils";
import { cn } from "@/lib/utils";

/** The part, the pack it ships in, and any stock problem with the line. */
export function CartLinePart({ line }: { line: CartLine }) {
  const { product } = line;
  const issue = getCartIssue(line, useBranchStock(product));
  const Icon = issue?.isBlocking ? CircleAlert : TriangleAlert;

  return (
    <div className="flex items-start gap-3">
      <ProductImage
        src={product.images[0]}
        alt=""
        fallbackIcon={getCategoryIcon(product.category.id)}
        size="sm"
      />
      <div className="flex max-w-72 min-w-0 flex-col gap-0.5 whitespace-normal">
        <span className="font-medium text-gray-900">{product.name}</span>
        <span className="text-xs text-gray-500">
          {product.partNumber} · {product.brand} · {getPackLabel(product)}
        </span>
        {issue && (
          <span
            className={cn(
              "mt-1 flex items-start gap-1.5 text-xs font-medium",
              issue.isBlocking ? "text-danger-700" : "text-warning-700",
            )}
          >
            <Icon aria-hidden className="mt-px size-3.5 shrink-0" />
            <span>{issue.message}</span>
          </span>
        )}
      </div>
    </div>
  );
}
