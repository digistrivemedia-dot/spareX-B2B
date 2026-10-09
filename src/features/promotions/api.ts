import type { Offer } from "@/features/promotions/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getOffersMock } from "@/mocks/promotions";

/** Business offers currently running, for the dashboard banner. */
export async function getOffers(): Promise<Offer[]> {
  if (dataSource.promotions === "mock") return getOffersMock();
  return apiClient<Offer[]>("/promotions/offers");
}
