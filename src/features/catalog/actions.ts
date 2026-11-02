"use server";

import { authorizeAction } from "@/features/auth/session";
import { getCatalog, getProductsById, getProductsByPartNumber } from "@/features/catalog/api";
import type { Product } from "@/features/catalog/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/**
 * Catalogue look-ups for interactive screens. They run on the server, like every API call, so
 * the session goes with them and prices stay behind sign-in.
 */
export async function searchPartsAction(
  query: string,
  pageSize: number,
): Promise<ActionResult<Product[]>> {
  return toActionResult(async () => {
    // Any signed-in role may search: garage managers look parts up for estimates.
    await authorizeAction();
    return (await getCatalog({ q: query, pageSize })).items;
  });
}

export async function getCartProductsAction(ids: string[]): Promise<ActionResult<Product[]>> {
  return toActionResult(async () => {
    await authorizeAction("orders:place");
    return getProductsById(ids);
  });
}

export async function findPartNumbersAction(
  partNumbers: string[],
): Promise<ActionResult<Product[]>> {
  return toActionResult(async () => {
    await authorizeAction("orders:place");
    return getProductsByPartNumber(partNumbers);
  });
}
