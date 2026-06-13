import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { DailyView } from "./components/DailyView";
import { CalendarView } from "./components/CalendarView";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { UpcomingEventsPanel } from "./components/UpcomingEventsPanel";
import { NotificationContainer } from "./components/NotificationContainer";
import { NotificationSettings } from "./components/NotificationSettings";
import { useEvents } from "./hooks/useEvents";
import "./styles/App.css";
function App() {
    const [currentView, setCurrentView] = useState("calendar");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const { events, isLoading, addEvent, updateEvent, deleteEvent, toggleEventCompletion, } = useEvents();
    // Clear old localStorage and show calendar on first load
    useEffect(() => {
        console.log("=== APP MOUNTED - FORCING CALENDAR VIEW ===");
        localStorage.clear();
        setCurrentView("calendar");
        setShowSettings(true);
    }, []);
    if (isLoading) {
        return (_jsx("div", { className: "loading-container", children: _jsxs("div", { className: "loading-spinner", children: [_jsx("span", { className: "spinner" }), _jsx("p", { children: "Loading your schedule..." })] }) }));
    }
    const handleDateSelect = (dateString) => {
        setSelectedDate(dateString);
        setCurrentView("daily");
    };
    const handleAddEvent = (dateString) => {
        setSelectedDate(dateString);
        setCurrentView("daily");
    };
    const handleBackToCalendar = () => {
        setCurrentView("calendar");
    };
    const handleUpcomingEdit = (event) => {
        setSelectedDate(event.date);
        setCurrentView("daily");
    };
    return (_jsxs("div", { className: "app", children: [_jsx(NotificationContainer, {}), _jsxs("div", { className: "app-header", children: [_jsx("div", { className: "app-title", children: _jsx("h1", { children: "Time Dashboard" }) }), _jsxs("div", { className: "view-toggle", children: [_jsx("button", { className: `view-btn ${currentView === "dashboard" ? "active" : ""}`, onClick: () => setCurrentView("dashboard"), title: "Dashboard View", children: "\uD83D\uDCCA Dashboard" }), _jsx("button", { className: `view-btn ${currentView === "calendar" ? "active" : ""}`, onClick: () => setCurrentView("calendar"), title: "Calendar View", children: "\uD83D\uDCC5 Calendar" }), _jsx("button", { className: `view-btn ${currentView === "daily" ? "active" : ""}`, onClick: () => setCurrentView("daily"), title: "Daily View", children: "\uD83D\uDCCB Daily" }), _jsx("button", { className: "view-btn settings-btn", onClick: () => setShowSettings(true), title: "Notification Settings", children: "\u2699\uFE0F" })] })] }), _jsx("div", { className: "app-content", children: currentView === "dashboard" ? (_jsxs("div", { className: "dashboard-view", children: [_jsx(StatisticsPanel, { events: events }), _jsx(UpcomingEventsPanel, { events: events, onUpdateEvent: updateEvent, onEditEvent: handleUpcomingEdit })] })) : currentView === "calendar" ? (_jsx(CalendarView, { events: events, onDateSelect: handleDateSelect, onAddEvent: handleAddEvent })) : (_jsxs("div", { className: "daily-view-wrapper", children: [_jsx("button", { className: "back-to-calendar-btn", onClick: handleBackToCalendar, children: "\u25C0 Back to Calendar" }), _jsx(DailyView, { events: selectedDate
                                ? events.filter((e) => e.date === selectedDate)
                                : events, onAddEvent: addEvent, onUpdateEvent: updateEvent, onDeleteEvent: deleteEvent, onToggleComplete: toggleEventCompletion })] })) }), showSettings && (_jsx("div", { className: "settings-modal-overlay", onClick: () => setShowSettings(false), children: _jsx("div", { className: "settings-modal", onClick: (e) => e.stopPropagation(), children: _jsx(NotificationSettings, { events: events, onClose: () => setShowSettings(false) }) }) }))] }));
}
export default App;
