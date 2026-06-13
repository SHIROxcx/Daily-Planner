import { useCallback, useMemo, useState } from "react";
import { getTodayDate, timeToMinutes } from "../utils/timeUtils";
const clampDaysAhead = (value) => {
    if (value <= 3)
        return 3;
    if (value <= 5)
        return 5;
    return 7;
};
const formatCountdownLabel = (minutesUntilStart) => {
    if (minutesUntilStart <= 0) {
        if (minutesUntilStart >= -15) {
            return "Starting now";
        }
        const overdueMinutes = Math.abs(minutesUntilStart);
        if (overdueMinutes < 60) {
            return `Overdue by ${overdueMinutes} min`;
        }
        const overdueHours = Math.max(1, Math.ceil(overdueMinutes / 60));
        return `Overdue by ${overdueHours}h`;
    }
    if (minutesUntilStart < 60) {
        return `In ${minutesUntilStart} min`;
    }
    if (minutesUntilStart < 24 * 60) {
        const hours = Math.ceil(minutesUntilStart / 60);
        return `In ${hours}h`;
    }
    const days = Math.ceil(minutesUntilStart / (24 * 60));
    return `In ${days} day${days === 1 ? "" : "s"}`;
};
const formatStatusLabel = (minutesUntilStart) => {
    if (minutesUntilStart <= 0) {
        return minutesUntilStart >= -15 ? "Starting" : "Overdue";
    }
    if (minutesUntilStart < 60) {
        return "Soon";
    }
    if (minutesUntilStart < 24 * 60) {
        return "Today";
    }
    return "Upcoming";
};
const getEventReminderLabel = (event) => {
    if (!event.reminderMinutes || event.reminderMinutes.length === 0) {
        return "No reminder";
    }
    const sorted = [...event.reminderMinutes].sort((a, b) => b - a);
    return `Reminder ${sorted[0]}m before`;
};
const toEventDateTime = (event) => {
    return new Date(`${event.date}T${event.startTime}:00`);
};
export const useUpcomingEvents = (events, options = {}) => {
    const [daysAhead, setDaysAheadState] = useState(options.defaultDaysAhead ?? 7);
    const [sortBy, setSortByState] = useState(options.defaultSortBy ?? "date");
    const setDaysAhead = useCallback((value) => {
        setDaysAheadState(clampDaysAhead(value));
    }, []);
    const setSortBy = useCallback((value) => {
        setSortByState(value);
    }, []);
    const upcomingEvents = useMemo(() => {
        const today = new Date(`${getTodayDate()}T00:00:00`);
        const rangeEnd = new Date(today);
        rangeEnd.setDate(rangeEnd.getDate() + daysAhead);
        const filtered = events
            .filter((event) => {
            if (event.completed) {
                return false;
            }
            const eventDate = new Date(`${event.date}T00:00:00`);
            return eventDate >= today && eventDate <= rangeEnd;
        })
            .map((event) => {
            const eventDateTime = toEventDateTime(event);
            const minutesUntilStart = Math.round((eventDateTime.getTime() - Date.now()) / 60000);
            return {
                ...event,
                countdownLabel: formatCountdownLabel(minutesUntilStart),
                statusLabel: formatStatusLabel(minutesUntilStart),
                minutesUntilStart,
                reminderLabel: getEventReminderLabel(event),
            };
        });
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "priority") {
                if ((a.isImportant ? 1 : 0) !== (b.isImportant ? 1 : 0)) {
                    return a.isImportant ? -1 : 1;
                }
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
            }
            if (sortBy === "time") {
                const timeDifference = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
                if (timeDifference !== 0) {
                    return timeDifference;
                }
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return a.title.localeCompare(b.title);
            }
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
        return sorted;
    }, [daysAhead, events, sortBy]);
    const toggleImportant = useCallback((eventId) => {
        if (!options.onUpdateEvent) {
            return;
        }
        const event = events.find((item) => item.id === eventId);
        if (!event) {
            return;
        }
        options.onUpdateEvent(eventId, {
            isImportant: !event.isImportant,
        });
    }, [events, options]);
    const setCustomReminder = useCallback((eventId, minutesBefore) => {
        if (!options.onUpdateEvent) {
            return;
        }
        const reminderMinutes = Math.max(0, Math.round(minutesBefore));
        options.onUpdateEvent(eventId, {
            reminderMinutes: [reminderMinutes],
        });
    }, [options]);
    return {
        upcomingEvents,
        daysAhead,
        sortBy,
        setDaysAhead,
        setSortBy,
        toggleImportant,
        setCustomReminder,
    };
};
