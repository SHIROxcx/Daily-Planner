/**
 * Generate a unique ID for events
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Check if two time ranges overlap
 */
export const timeRangesOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
};
/**
 * Convert time string (HH:mm) to minutes since midnight
 */
export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
/**
 * Convert minutes since midnight to time string (HH:mm)
 */
export const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
/**
 * Calculate event duration in minutes
 */
export const getEventDuration = (event) => {
    return timeToMinutes(event.endTime) - timeToMinutes(event.startTime);
};
/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
    return formatDate(new Date());
};
/**
 * Sort events by start time
 */
export const sortEventsByTime = (events) => {
    return [...events].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
};
/**
 * Get events for a specific date
 */
export const getEventsForDate = (events, date) => {
    return events.filter((event) => event.date === date);
};
