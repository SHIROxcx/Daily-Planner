import { useEffect, useState, useCallback } from "react";
import { Event } from "../types";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showEventReminder,
} from "../utils/systemNotificationUtils";
import { playNotificationSound } from "../utils/audioUtils";
import { useNotification } from "../contexts/NotificationContext";
import { snoozeManager } from "../utils/snoozeUtils";

interface SystemNotificationSettings {
  enabled: boolean;
  reminderMinutes: number[];
}

const STORAGE_KEY = "system-notification-settings";

const DEFAULT_SETTINGS: SystemNotificationSettings = {
  enabled: false,
  reminderMinutes: [15, 0], // 15 minutes before and at event start
};

/**
 * Hook for managing system notifications and event reminders
 */
export const useSystemNotifications = (events: Event[]) => {
  const { soundEnabled } = useNotification();
  const [settings, setSettings] =
    useState<SystemNotificationSettings>(DEFAULT_SETTINGS);
  const [permission, setPermission] = useState<NotificationPermission>(
    getNotificationPermission(),
  );
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse notification settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback(
    (newSettings: SystemNotificationSettings) => {
      setSettings(newSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    },
    [],
  );

  // Request notification permission
  const enableNotifications = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);

    if (result === "granted") {
      updateSettings({ ...settings, enabled: true });
      return true;
    }
    return false;
  }, [settings, updateSettings]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    updateSettings({ ...settings, enabled: false });
  }, [settings, updateSettings]);

  // Update reminder minutes
  const setReminderMinutes = useCallback(
    (minutes: number[]) => {
      updateSettings({ ...settings, reminderMinutes: minutes });
    },
    [settings, updateSettings],
  );

  // Check for upcoming events and send reminders
  useEffect(() => {
    if (!settings.enabled || permission !== "granted") {
      return;
    }

    const checkUpcomingEvents = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      events.forEach((event) => {
        if (event.date !== today) return; // Only check today's events

        const [hours, minutes] = event.startTime.split(":").map(Number);
        const eventTime = new Date();
        eventTime.setHours(hours, minutes, 0, 0);

        const minutesUntilEvent = Math.round(
          (eventTime.getTime() - now.getTime()) / 60000,
        );

        settings.reminderMinutes.forEach((reminderMinute) => {
          if (minutesUntilEvent === reminderMinute) {
            const reminderId = `${event.id}-${reminderMinute}`;

            // Check if this reminder is snoozed
            if (snoozeManager.isSnoozed(reminderId)) {
              return; // Skip if snoozed
            }

            if (!reminders.has(reminderId)) {
              showEventReminder(event.title, event.startTime, reminderMinute);

              // Play notification sound if enabled (global setting)
              if (soundEnabled) {
                playNotificationSound("reminder", false);
              }

              setReminders((prev) => new Set(prev).add(reminderId));
            }
          }
        });
      });
    };

    // Check immediately
    checkUpcomingEvents();

    // Check every minute
    const interval = setInterval(checkUpcomingEvents, 60000);

    return () => clearInterval(interval);
  }, [events, settings, permission, reminders, soundEnabled]);

  return {
    settings,
    permission,
    enableNotifications,
    disableNotifications,
    setReminderMinutes,
    isSupported: permission !== "denied",
  };
};
