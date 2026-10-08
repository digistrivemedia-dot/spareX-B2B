import type { Notification } from "@/features/notifications/types";
import { daysFromToday, simulateLatency } from "@/mocks/utils";

const notifications: Notification[] = [
  {
    id: "ntf-4",
    title: "ORD-2026-0414 is out for delivery",
    description: "Arriving at HSR Layout by 5 pm today.",
    createdAt: daysFromToday(0, 9, 5),
    href: "/orders/ord-0414",
    tone: "info",
    isRead: false,
  },
  {
    id: "ntf-3",
    title: "Quotation QT-2026-0093 is ready",
    description: "Kannali has quoted ₹54,848.76 (incl. GST). Valid for 5 more days.",
    createdAt: daysFromToday(-2, 15, 30),
    href: "/quotations/qt-0093",
    tone: "warning",
    isRead: false,
  },
  {
    id: "ntf-2",
    title: "Invoice KG/26-27/1037 is overdue",
    description: "₹12,800 was due 9 days ago.",
    createdAt: daysFromToday(-8, 9),
    href: "/credit",
    tone: "danger",
    isRead: false,
  },
  {
    id: "ntf-1",
    title: "Payment received",
    description: "₹15,000 against KG/26-27/1004. Thank you.",
    createdAt: daysFromToday(-20, 11),
    href: "/credit",
    tone: "success",
    isRead: true,
  },
];

export async function getNotificationsMock(): Promise<Notification[]> {
  await simulateLatency();
  return notifications;
}
