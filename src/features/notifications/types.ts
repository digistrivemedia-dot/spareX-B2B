export type NotificationTone = "info" | "success" | "warning" | "danger";

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  href: string;
  tone: NotificationTone;
  isRead: boolean;
};
