const EVENTS_KEY = "time_dashboard_events";
/**
 * Load events from localStorage
 */
export const loadEvents = () => {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch (error) {
        console.error("Failed to load events from localStorage:", error);
        return [];
    }
};
/**
 * Save events to localStorage
 */
export const saveEvents = (events) => {
    try {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
    catch (error) {
        console.error("Failed to save events to localStorage:", error);
    }
};
/**
 * Clear all events from localStorage
 */
export const clearEvents = () => {
    try {
        localStorage.removeItem(EVENTS_KEY);
    }
    catch (error) {
        console.error("Failed to clear events from localStorage:", error);
    }
};
