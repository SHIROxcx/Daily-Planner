import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CalendarDay = ({ day, onSelect, onDayDoubleClick, }) => {
    const handleClick = () => {
        onSelect(day.dateString);
    };
    const handleDoubleClick = () => {
        if (onDayDoubleClick) {
            onDayDoubleClick(day.dateString);
        }
    };
    return (_jsxs("div", { className: `calendar-day ${day.isCurrentMonth ? "current-month" : "other-month"} ${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`, onClick: handleClick, onDoubleClick: handleDoubleClick, children: [_jsxs("div", { className: "calendar-day-header", children: [_jsx("span", { className: "calendar-day-number", children: day.dayOfMonth }), day.hasImportant && _jsx("span", { className: "important-indicator", children: "\u2605" })] }), day.eventCount > 0 && (_jsxs("div", { className: "calendar-day-content", children: [_jsx("div", { className: "event-count-badge", children: day.eventCount }), day.eventColors.length > 0 && (_jsxs("div", { className: "event-colors", children: [day.eventColors.slice(0, 4).map((color, index) => (_jsx("div", { className: "event-color-dot", style: { backgroundColor: color }, title: `${day.eventCount} event${day.eventCount !== 1 ? "s" : ""}` }, index))), day.eventColors.length > 4 && (_jsxs("div", { className: "event-color-more", children: ["+", day.eventColors.length - 4] }))] }))] })), day.eventCount === 0 && day.isCurrentMonth && (_jsx("div", { className: "calendar-day-empty" }))] }));
};
