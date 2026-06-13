import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { SNOOZE_DURATIONS } from "../utils/snoozeUtils";
import "../styles/Notification.css";
const NotificationItem = ({ notification, }) => {
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
    const handleSnooze = (duration) => {
        snoozeNotification(notification.id, duration);
        setShowSnoozeMenu(false);
    };
    return (_jsxs("div", { className: `notification notification-${notification.type}`, children: [_jsx("div", { className: "notification-icon", children: getIcon() }), _jsx("div", { className: "notification-message", children: notification.message }), _jsxs("div", { className: "notification-actions", children: [_jsxs("div", { className: "snooze-menu-wrapper", children: [_jsx("button", { className: "notification-snooze", onClick: () => setShowSnoozeMenu(!showSnoozeMenu), "aria-label": "Snooze notification", title: "Snooze this notification", children: "\u23F0" }), showSnoozeMenu && (_jsx("div", { className: "snooze-menu", children: SNOOZE_DURATIONS.map((duration) => (_jsxs("button", { className: "snooze-option", onClick: () => handleSnooze(duration), children: [duration, " min"] }, duration))) }))] }), _jsx("button", { className: "notification-close", onClick: () => removeNotification(notification.id), "aria-label": "Close notification", children: "\u2715" })] })] }));
};
export const NotificationContainer = () => {
    const { notifications } = useNotification();
    return (_jsx("div", { className: "notification-container", children: notifications.map((notification) => (_jsx(NotificationItem, { notification: notification }, notification.id))) }));
};
