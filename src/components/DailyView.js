import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Timeline } from "./Timeline";
import { AddEventForm } from "./AddEventForm";
import { EventModal } from "./EventModal";
import { NotificationSettings } from "./NotificationSettings";
import { useSystemNotifications } from "../hooks/useSystemNotifications";
import { getEventsForDate, getTodayDate } from "../utils/timeUtils";
import "../styles/DailyView.css";
export const DailyView = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent, onToggleComplete, }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // Initialize system notifications hook
    useSystemNotifications(events);
    const dailyEvents = getEventsForDate(events, selectedDate);
    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    const handleSaveEvent = (event) => {
        onUpdateEvent(event.id, event);
        setIsModalOpen(false);
    };
    const handleDeleteEvent = (eventId) => {
        onDeleteEvent(eventId);
        setIsModalOpen(false);
    };
    const handlePreviousDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - 1);
        setSelectedDate(date.toISOString().split("T")[0]);
    };
    const handleNextDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        setSelectedDate(date.toISOString().split("T")[0]);
    };
    const handleToday = () => {
        setSelectedDate(getTodayDate());
    };
    const formatDisplayDate = (dateStr) => {
        const date = new Date(dateStr + "T00:00:00");
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };
    return (_jsxs("div", { className: "daily-view", children: [_jsxs("div", { className: "daily-view-header", children: [_jsxs("div", { className: "date-navigation", children: [_jsx("button", { className: "nav-btn prev-btn", onClick: handlePreviousDay, title: "Previous day", children: "\u25C0" }), _jsxs("div", { className: "date-display", children: [_jsx("h1", { className: "date-title", children: formatDisplayDate(selectedDate) }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "date-picker" })] }), _jsx("button", { className: "nav-btn next-btn", onClick: handleNextDay, title: "Next day", children: "\u25B6" })] }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { className: "btn-today", onClick: handleToday, children: "Today" }), _jsx("button", { className: "btn-settings", onClick: () => setIsSettingsOpen(true), title: "Notification settings", children: "\uD83D\uDD14" })] })] }), _jsxs("div", { className: "daily-view-content", children: [_jsx("aside", { className: "daily-view-sidebar", children: _jsx(AddEventForm, { onAddEvent: onAddEvent, defaultDate: selectedDate }) }), _jsx("main", { className: "daily-view-main", children: _jsx(Timeline, { events: dailyEvents, onEditEvent: handleEditEvent, onDeleteEvent: onDeleteEvent, onToggleComplete: onToggleComplete }) })] }), _jsx(EventModal, { event: selectedEvent, isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSave: handleSaveEvent, onDelete: handleDeleteEvent }), isSettingsOpen && (_jsx("div", { className: "modal-backdrop", onClick: () => setIsSettingsOpen(false), children: _jsx("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: _jsx(NotificationSettings, { events: events, onClose: () => setIsSettingsOpen(false) }) }) }))] }));
};
