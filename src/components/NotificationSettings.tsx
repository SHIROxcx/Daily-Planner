import React, { useState } from "react";
import { useSystemNotifications } from "../hooks/useSystemNotifications";
import { Event } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import { playNotificationSound } from "../utils/audioUtils";
import "../styles/NotificationSettings.css";

interface NotificationSettingsProps {
  events: Event[];
  onClose: () => void;
}

const PRESET_REMINDERS = [
  { label: "At event start", value: 0 },
  { label: "5 minutes before", value: 5 },
  { label: "10 minutes before", value: 10 },
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before", value: 60 },
];

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  events,
  onClose,
}) => {
  const {
    settings,
    permission,
    enableNotifications,
    disableNotifications,
    setReminderMinutes,
  } = useSystemNotifications(events);
  const { addNotification, soundEnabled, toggleSound } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setIsLoading(true);

    if (settings.enabled) {
      disableNotifications();
      addNotification("System notifications disabled", "info", 3000);
    } else {
      const success = await enableNotifications();
      if (success) {
        addNotification("System notifications enabled! 🔔", "success", 3000);
      } else {
        addNotification(
          "Failed to enable notifications or permission denied",
          "error",
          3000,
        );
      }
    }

    setIsLoading(false);
  };

  const handleToggleReminder = (minute: number) => {
    const current = settings.reminderMinutes;
    const updated = current.includes(minute)
      ? current.filter((m) => m !== minute)
      : [...current, minute].sort((a, b) => b - a); // Sort descending

    setReminderMinutes(updated);
  };

  const handleTestSound = async () => {
    await playNotificationSound("reminder", false);
    addNotification("Test sound played! 🔊", "info", 2000);
  };

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close settings"
        >
          ✕
        </button>
      </div>

      <div className="settings-content">
        {/* System Notifications Toggle */}
        <div className="settings-section">
          <h4>System Notifications</h4>
          <p className="settings-description">
            Get OS-level notifications for your upcoming events
          </p>

          <div className="settings-toggle">
            <button
              className={`toggle-btn ${settings.enabled ? "enabled" : "disabled"}`}
              onClick={handleToggleNotifications}
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : settings.enabled
                  ? "Enabled"
                  : "Disabled"}
            </button>
            <span className="permission-status">
              {permission === "granted" && (
                <span className="status-granted">✓ Granted</span>
              )}
              {permission === "denied" && (
                <span className="status-denied">
                  ✕ Denied - Enable in browser settings
                </span>
              )}
              {permission === "default" && (
                <span className="status-default">⚠ Not requested yet</span>
              )}
            </span>
          </div>
        </div>

        {/* Reminder Times */}
        {settings.enabled && permission === "granted" && (
          <div className="settings-section">
            <h4>Reminder Times</h4>
            <p className="settings-description">
              Choose when you want to be reminded about upcoming events
            </p>

            <div className="reminder-options">
              {PRESET_REMINDERS.map((preset) => (
                <label key={preset.value} className="reminder-option">
                  <input
                    type="checkbox"
                    checked={settings.reminderMinutes.includes(preset.value)}
                    onChange={() => handleToggleReminder(preset.value)}
                  />
                  <span>{preset.label}</span>
                </label>
              ))}
            </div>

            {settings.reminderMinutes.length === 0 && (
              <p className="warning-text">
                ⚠ Select at least one reminder time
              </p>
            )}
          </div>
        )}

        {/* Info Message */}
        <div className="settings-info">
          <p>
            <strong>💡 Tip:</strong> System notifications work even when the app
            is closed or in the background.
          </p>
        </div>

        {/* Sound Settings */}
        {settings.enabled && (
          <div className="settings-section">
            <h4>Sound Alerts</h4>
            <p className="settings-description">
              Play sound when notification reminders are triggered
            </p>

            <div className="sound-settings">
              <div className="sound-toggle-group">
                <button
                  className={`toggle-btn sound-toggle ${soundEnabled ? "enabled" : "disabled"}`}
                  onClick={toggleSound}
                >
                  {soundEnabled ? "🔊 Enabled" : "🔇 Muted"}
                </button>
                {soundEnabled && (
                  <button className="test-sound-btn" onClick={handleTestSound}>
                    Play Test Sound
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
