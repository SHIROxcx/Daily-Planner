import React from "react";
import { Event } from "../types";
import { useCalendar } from "../hooks/useCalendar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";
import "../styles/Calendar.css";

interface CalendarViewProps {
  events: Event[];
  onDateSelect: (dateString: string) => void;
  onAddEvent?: (dateString: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onDateSelect,
  onAddEvent,
}) => {
  const calendar = useCalendar(events);

  const handleDateSelect = (dateString: string) => {
    calendar.selectDate(dateString);
    onDateSelect(dateString);
  };

  const handleDayDoubleClick = (dateString: string) => {
    if (onAddEvent) {
      onAddEvent(dateString);
    }
  };

  return (
    <div className="calendar-view">
      <CalendarHeader
        displayMonth={calendar.displayMonth}
        onPreviousMonth={calendar.previousMonth}
        onNextMonth={calendar.nextMonth}
        onToday={calendar.goToToday}
      />

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {calendar.weekdays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {calendar.calendarData.days.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              onSelect={handleDateSelect}
              onDayDoubleClick={handleDayDoubleClick}
            />
          ))}
        </div>
      </div>

      {calendar.selectedDate && (
        <div className="calendar-selected-info">
          <h3>
            {new Date(calendar.selectedDate + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </h3>
          <p>
            {calendar.selectedDateEvents.length} event
            {calendar.selectedDateEvents.length !== 1 ? "s" : ""}
          </p>
          {onAddEvent && (
            <button
              className="calendar-add-btn"
              onClick={() => onAddEvent(calendar.selectedDate!)}
            >
              + Add Event
            </button>
          )}
        </div>
      )}
    </div>
  );
};
