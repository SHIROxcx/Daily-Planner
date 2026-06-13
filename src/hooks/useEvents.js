import { useState, useEffect, useCallback } from "react";
import { loadEvents, saveEvents } from "../utils/storageUtils";
import { generateId } from "../utils/timeUtils";
export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Load events from localStorage on mount
    useEffect(() => {
        const stored = loadEvents();
        setEvents(stored);
        setIsLoading(false);
    }, []);
    // Save events whenever they change
    useEffect(() => {
        if (!isLoading) {
            saveEvents(events);
        }
    }, [events, isLoading]);
    const addEvent = useCallback((event) => {
        const newEvent = {
            ...event,
            id: generateId(),
        };
        setEvents((prev) => [...prev, newEvent]);
        return newEvent;
    }, []);
    const updateEvent = useCallback((id, updates) => {
        setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...updates } : event)));
    }, []);
    const deleteEvent = useCallback((id) => {
        setEvents((prev) => prev.filter((event) => event.id !== id));
    }, []);
    const toggleEventCompletion = useCallback((id) => {
        setEvents((prev) => prev.map((event) => event.id === id ? { ...event, completed: !event.completed } : event));
    }, []);
    return {
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventCompletion,
    };
};
