import React, { useState } from "react";
import { Notification as NotificationType } from "../types/notification";
import { useNotification } from "../contexts/NotificationContext";
import { SNOOZE_DURATIONS, SnoozeDuration } from "../utils/snoozeUtils";
import "../styles/Notification.css";

interface NotificationItemProps {
  notification: NotificationType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { removeNotification, snoozeNotification } = useNotification();
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  const handleSnooze = (duration: SnoozeDuration) => {
    snoozeNotification(notification.id, duration);
    setShowSnoozeMenu(false);
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-message">{notification.message}</div>
      <div className="notification-actions">
        <div className="snooze-menu-wrapper">
          <button
            className="notification-snooze"
            onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
            aria-label="Snooze notification"
            title="Snooze this notification"
          >
            ⏰
          </button>
          {showSnoozeMenu && (
            <div className="snooze-menu">
              {SNOOZE_DURATIONS.map((duration) => (
                <button
                  key={duration}
                  className="snooze-option"
                  onClick={() => handleSnooze(duration)}
                >
                  {duration} min
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="notification-close"
          onClick={() => removeNotification(notification.id)}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
