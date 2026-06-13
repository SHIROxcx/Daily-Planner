import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CalendarHeader = ({ displayMonth, onPreviousMonth, onNextMonth, onToday, }) => {
    return (_jsxs("div", { className: "calendar-header", children: [_jsx("button", { className: "calendar-nav-btn", onClick: onPreviousMonth, "aria-label": "Previous month", title: "Previous month", children: "\u25C0 Prev" }), _jsxs("div", { className: "calendar-title", children: [_jsx("h2", { children: displayMonth }), _jsx("button", { className: "calendar-today-btn", onClick: onToday, children: "Today" })] }), _jsx("button", { className: "calendar-nav-btn", onClick: onNextMonth, "aria-label": "Next month", title: "Next month", children: "Next \u25B6" })] }));
};
