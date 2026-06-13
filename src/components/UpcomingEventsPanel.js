import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { UpcomingEventItem } from "./UpcomingEventItem";
import "../styles/UpcomingEventsPanel.css";
const DAYS_OPTIONS = [3, 5, 7];
const SORT_OPTIONS = [
    { value: "date", label: "Date" },
    { value: "priority", label: "Priority" },
    { value: "time", label: "Time" },
];
export const UpcomingEventsPanel = ({ events, onUpdateEvent, onEditEvent, }) => {
    const { upcomingEvents, daysAhead, sortBy, setDaysAhead, setSortBy, toggleImportant, setCustomReminder, } = useUpcomingEvents(events, { onUpdateEvent });
    const handleEditEvent = (event) => {
        if (onEditEvent) {
            onEditEvent(event);
            return;
        }
        alert(`Open ${event.title} from the daily planner to edit details.`);
    };
    const handleSetReminder = (event) => {
        const input = window.prompt(`Set reminder for \"${event.title}\" in how many minutes?`, event.reminderMinutes?.[0]?.toString() ?? "15");
        if (input === null) {
            return;
        }
        const parsed = Number.parseInt(input, 10);
        if (Number.isNaN(parsed) || parsed < 0) {
            window.alert("Please enter a valid number of minutes.");
            return;
        }
        setCustomReminder(event.id, parsed);
    };
    return (_jsxs("section", { className: "upcoming-events-panel", children: [_jsxs("div", { className: "upcoming-events-panel__header", children: [_jsxs("div", { children: [_jsx("h2", { className: "upcoming-events-panel__title", children: "\uD83D\uDD14 Upcoming Events" }), _jsxs("p", { className: "upcoming-events-panel__subtitle", children: ["Events due in the next ", daysAhead, " days"] })] }), _jsx("div", { className: "upcoming-events-panel__summary", children: _jsxs("span", { className: "upcoming-events-panel__count", children: [upcomingEvents.length, " items"] }) })] }), _jsxs("div", { className: "upcoming-events-panel__controls", children: [_jsx("div", { className: "upcoming-events-panel__segmented", children: DAYS_OPTIONS.map((option) => (_jsxs("button", { type: "button", className: `upcoming-events-panel__segment ${daysAhead === option ? "is-active" : ""}`, onClick: () => setDaysAhead(option), children: [option, "d"] }, option))) }), _jsx("div", { className: "upcoming-events-panel__segmented", children: SORT_OPTIONS.map((option) => (_jsx("button", { type: "button", className: `upcoming-events-panel__segment ${sortBy === option.value ? "is-active" : ""}`, onClick: () => setSortBy(option.value), children: option.label }, option.value))) })] }), _jsx("div", { className: "upcoming-events-panel__list", children: upcomingEvents.length === 0 ? (_jsxs("div", { className: "upcoming-events-panel__empty", children: [_jsx("p", { children: "No upcoming events in this window." }), _jsx("span", { children: "Try expanding the range or adding a few events." })] })) : (upcomingEvents.map((event) => (_jsx(UpcomingEventItem, { event: event, onToggleImportant: toggleImportant, onEditEvent: handleEditEvent, onSetReminder: handleSetReminder }, event.id)))) })] }));
};
