import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCalendar } from "../hooks/useCalendar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";
import "../styles/Calendar.css";
export const CalendarView = ({ events, onDateSelect, onAddEvent, }) => {
    const calendar = useCalendar(events);
    const handleDateSelect = (dateString) => {
        calendar.selectDate(dateString);
        onDateSelect(dateString);
    };
    const handleDayDoubleClick = (dateString) => {
        if (onAddEvent) {
            onAddEvent(dateString);
        }
    };
    return (_jsxs("div", { className: "calendar-view", children: [_jsx(CalendarHeader, { displayMonth: calendar.displayMonth, onPreviousMonth: calendar.previousMonth, onNextMonth: calendar.nextMonth, onToday: calendar.goToToday }), _jsxs("div", { className: "calendar-grid", children: [_jsx("div", { className: "calendar-weekdays", children: calendar.weekdays.map((day) => (_jsx("div", { className: "calendar-weekday", children: day }, day))) }), _jsx("div", { className: "calendar-days", children: calendar.calendarData.days.map((day, index) => (_jsx(CalendarDay, { day: day, onSelect: handleDateSelect, onDayDoubleClick: handleDayDoubleClick }, index))) })] }), calendar.selectedDate && (_jsxs("div", { className: "calendar-selected-info", children: [_jsx("h3", { children: new Date(calendar.selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) }), _jsxs("p", { children: [calendar.selectedDateEvents.length, " event", calendar.selectedDateEvents.length !== 1 ? "s" : ""] }), onAddEvent && (_jsx("button", { className: "calendar-add-btn", onClick: () => onAddEvent(calendar.selectedDate), children: "+ Add Event" }))] }))] }));
};
