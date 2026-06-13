import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { EventBlock } from "./EventBlock";
import "../styles/Timeline.css";
export const Timeline = ({ events, onEditEvent, onDeleteEvent, onToggleComplete, startHour = 6, endHour = 23, }) => {
    const hours = useMemo(() => {
        const result = [];
        for (let i = startHour; i <= endHour; i++) {
            result.push(i);
        }
        return result;
    }, [startHour, endHour]);
    const getEventsForHour = (hour) => {
        return events.filter((event) => {
            const eventStart = parseInt(event.startTime.split(":")[0]);
            return eventStart === hour;
        });
    };
    return (_jsxs("div", { className: "timeline-container", children: [_jsx("div", { className: "timeline-header", children: _jsx("h2", { children: "Daily Timeline" }) }), _jsx("div", { className: "timeline-content", children: hours.map((hour) => (_jsxs("div", { className: "timeline-hour-block", children: [_jsx("div", { className: "timeline-hour-label", children: _jsxs("span", { className: "hour-time", children: [String(hour).padStart(2, "0"), ":00"] }) }), _jsx("div", { className: "timeline-hour-events", children: getEventsForHour(hour).length > 0 ? (getEventsForHour(hour).map((event) => (_jsx(EventBlock, { event: event, onEdit: onEditEvent, onDelete: onDeleteEvent, onToggleComplete: onToggleComplete }, event.id)))) : (_jsx("div", { className: "timeline-empty-slot", children: "No events" })) })] }, hour))) })] }));
};
