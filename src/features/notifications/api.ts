import type { Notification } from "@/features/notifications/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getNotificationsMock } from "@/mocks/notifications";

export async function getNotifications(): Promise<Notification[]> {
  if (dataSource.notifications === "mock") return getNotificationsMock();
  return apiClient<Notification[]>("/notifications");
}
