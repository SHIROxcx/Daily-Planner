import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useSystemNotifications } from "../hooks/useSystemNotifications";
import { useNotification } from "../contexts/NotificationContext";
import { playNotificationSound } from "../utils/audioUtils";
import "../styles/NotificationSettings.css";
const PRESET_REMINDERS = [
    { label: "At event start", value: 0 },
    { label: "5 minutes before", value: 5 },
    { label: "10 minutes before", value: 10 },
    { label: "15 minutes before", value: 15 },
    { label: "30 minutes before", value: 30 },
    { label: "1 hour before", value: 60 },
];
export const NotificationSettings = ({ events, onClose, }) => {
    const { settings, permission, enableNotifications, disableNotifications, setReminderMinutes, } = useSystemNotifications(events);
    const { addNotification, soundEnabled, toggleSound } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const handleToggleNotifications = async () => {
        setIsLoading(true);
        if (settings.enabled) {
            disableNotifications();
            addNotification("System notifications disabled", "info", 3000);
        }
        else {
            const success = await enableNotifications();
            if (success) {
                addNotification("System notifications enabled! 🔔", "success", 3000);
            }
            else {
                addNotification("Failed to enable notifications or permission denied", "error", 3000);
            }
        }
        setIsLoading(false);
    };
    const handleToggleReminder = (minute) => {
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
    return (_jsxs("div", { className: "notification-settings", children: [_jsxs("div", { className: "settings-header", children: [_jsx("h3", { children: "Notification Settings" }), _jsx("button", { className: "close-btn", onClick: onClose, "aria-label": "Close settings", children: "\u2715" })] }), _jsxs("div", { className: "settings-content", children: [_jsxs("div", { className: "settings-section", children: [_jsx("h4", { children: "System Notifications" }), _jsx("p", { className: "settings-description", children: "Get OS-level notifications for your upcoming events" }), _jsxs("div", { className: "settings-toggle", children: [_jsx("button", { className: `toggle-btn ${settings.enabled ? "enabled" : "disabled"}`, onClick: handleToggleNotifications, disabled: isLoading, children: isLoading
                                            ? "Loading..."
                                            : settings.enabled
                                                ? "Enabled"
                                                : "Disabled" }), _jsxs("span", { className: "permission-status", children: [permission === "granted" && (_jsx("span", { className: "status-granted", children: "\u2713 Granted" })), permission === "denied" && (_jsx("span", { className: "status-denied", children: "\u2715 Denied - Enable in browser settings" })), permission === "default" && (_jsx("span", { className: "status-default", children: "\u26A0 Not requested yet" }))] })] })] }), settings.enabled && permission === "granted" && (_jsxs("div", { className: "settings-section", children: [_jsx("h4", { children: "Reminder Times" }), _jsx("p", { className: "settings-description", children: "Choose when you want to be reminded about upcoming events" }), _jsx("div", { className: "reminder-options", children: PRESET_REMINDERS.map((preset) => (_jsxs("label", { className: "reminder-option", children: [_jsx("input", { type: "checkbox", checked: settings.reminderMinutes.includes(preset.value), onChange: () => handleToggleReminder(preset.value) }), _jsx("span", { children: preset.label })] }, preset.value))) }), settings.reminderMinutes.length === 0 && (_jsx("p", { className: "warning-text", children: "\u26A0 Select at least one reminder time" }))] })), _jsx("div", { className: "settings-info", children: _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCA1 Tip:" }), " System notifications work even when the app is closed or in the background."] }) }), settings.enabled && (_jsxs("div", { className: "settings-section", children: [_jsx("h4", { children: "Sound Alerts" }), _jsx("p", { className: "settings-description", children: "Play sound when notification reminders are triggered" }), _jsx("div", { className: "sound-settings", children: _jsxs("div", { className: "sound-toggle-group", children: [_jsx("button", { className: `toggle-btn sound-toggle ${soundEnabled ? "enabled" : "disabled"}`, onClick: toggleSound, children: soundEnabled ? "🔊 Enabled" : "🔇 Muted" }), soundEnabled && (_jsx("button", { className: "test-sound-btn", onClick: handleTestSound, children: "Play Test Sound" }))] }) })] }))] })] }));
};
