import { SnoozeDuration } from "../utils/snoozeUtils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // ms, optional (default 3000)
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number,
  ) => void;
  removeNotification: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  snoozeNotification: (id: string, duration: SnoozeDuration) => void;
}
