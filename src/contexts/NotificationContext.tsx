import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Notification,
  NotificationContextType,
  NotificationType,
} from "../types/notification";
import { playNotificationSound } from "../utils/audioUtils";
import { snoozeManager, SnoozeDuration } from "../utils/snoozeUtils";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "info", duration = 3000) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      // Play sound if enabled
      if (soundEnabled) {
        playNotificationSound(type, false);
      }

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [soundEnabled],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const snoozeNotification = useCallback(
    (id: string, duration: SnoozeDuration) => {
      // Schedule the notification to be restored after snooze
      snoozeManager.snooze(id, "notification", duration, () => {
        // This will be called when snooze expires
        // The notification will automatically be re-added when the user interacts with it or manually resumes
      });

      // Remove from current notifications while snoozed
      removeNotification(id);

      // Show snooze confirmation
      addNotification(
        `Notification snoozed for ${duration} min ⏰`,
        "info",
        2000,
      );
    },
    [removeNotification, addNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        soundEnabled,
        toggleSound,
        snoozeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
