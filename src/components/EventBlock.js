import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNotification } from "../contexts/NotificationContext";
import { getEventDuration } from "../utils/timeUtils";
import "../styles/EventBlock.css";
export const EventBlock = ({ event, onEdit, onDelete, onToggleComplete, }) => {
    const { addNotification } = useNotification();
    const duration = getEventDuration(event);
    const heightPercentage = (duration / 60) * 100; // Assuming 60px per hour
    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this event?")) {
            onDelete(event.id);
            addNotification(`Event "${event.title}" deleted`, "info", 3000);
        }
    };
    const handleToggleComplete = (e) => {
        e.stopPropagation();
        onToggleComplete(event.id);
        const message = event.completed
            ? `Event "${event.title}" marked as incomplete`
            : `Event "${event.title}" completed! 🎉`;
        addNotification(message, event.completed ? "info" : "success", 3000);
    };
    return (_jsx("div", { className: `event-block ${event.completed ? "completed" : ""}`, style: {
            backgroundColor: event.color,
            minHeight: `${Math.max(heightPercentage, 40)}px`,
            borderColor: event.color,
        }, onClick: () => onEdit(event), title: event.title, children: _jsxs("div", { className: "event-block-content", children: [_jsxs("div", { className: "event-block-header", children: [_jsx("h4", { className: "event-block-title", children: event.title }), _jsxs("div", { className: "event-block-actions", children: [_jsx("button", { className: "event-block-action-btn complete-btn", onClick: handleToggleComplete, title: event.completed ? "Mark incomplete" : "Mark complete", children: event.completed ? "✓" : "○" }), _jsx("button", { className: "event-block-action-btn delete-btn", onClick: handleDelete, title: "Delete event", children: "\u00D7" })] })] }), _jsxs("p", { className: "event-block-time", children: [event.startTime, " - ", event.endTime] }), event.description && (_jsx("p", { className: "event-block-description", children: event.description }))] }) }));
};
