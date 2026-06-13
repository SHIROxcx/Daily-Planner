/**
 * System Notification Utilities
 * Handles browser Notification API for OS-level notifications
 */
/**
 * Check if browser supports Notification API
 */
export const isNotificationSupported = () => {
    return "Notification" in window;
};
/**
 * Check current notification permission status
 */
export const getNotificationPermission = () => {
    if (!isNotificationSupported()) {
        return "denied";
    }
    return Notification.permission;
};
/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async () => {
    if (!isNotificationSupported()) {
        console.warn("Notifications not supported in this browser");
        return "denied";
    }
    if (Notification.permission === "granted") {
        return "granted";
    }
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission;
    }
    return "denied";
};
/**
 * Show system notification
 */
export const showSystemNotification = (title, options) => {
    if (!isNotificationSupported()) {
        console.warn("Notifications not supported");
        return null;
    }
    if (Notification.permission !== "granted") {
        console.warn("Notification permission not granted");
        return null;
    }
    try {
        const notification = new Notification(title, {
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            ...options,
        });
        return notification;
    }
    catch (error) {
        console.error("Failed to show notification:", error);
        return null;
    }
};
/**
 * Show event reminder notification
 */
export const showEventReminder = (eventTitle, eventTime, minutesUntilEvent) => {
    const message = minutesUntilEvent === 0
        ? `Event starting now!`
        : `Starting in ${minutesUntilEvent} minute${minutesUntilEvent !== 1 ? "s" : ""}`;
    return showSystemNotification(`📅 ${eventTitle}`, {
        body: `${eventTime} - ${message}`,
        tag: `event-${eventTitle}`,
        requireInteraction: minutesUntilEvent === 0,
    });
};
