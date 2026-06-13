import React from "react";
import { CalendarDay as CalendarDayType } from "../hooks/useCalendar";

interface CalendarDayProps {
  day: CalendarDayType;
  onSelect: (dateString: string) => void;
  onDayDoubleClick?: (dateString: string) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onSelect,
  onDayDoubleClick,
}) => {
  const handleClick = () => {
    onSelect(day.dateString);
  };

  const handleDoubleClick = () => {
    if (onDayDoubleClick) {
      onDayDoubleClick(day.dateString);
    }
  };

  return (
    <div
      className={`calendar-day ${
        day.isCurrentMonth ? "current-month" : "other-month"
      } ${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="calendar-day-header">
        <span className="calendar-day-number">{day.dayOfMonth}</span>
        {day.hasImportant && <span className="important-indicator">★</span>}
      </div>

      {day.eventCount > 0 && (
        <div className="calendar-day-content">
          <div className="event-count-badge">{day.eventCount}</div>

          {day.eventColors.length > 0 && (
            <div className="event-colors">
              {day.eventColors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="event-color-dot"
                  style={{ backgroundColor: color }}
                  title={`${day.eventCount} event${day.eventCount !== 1 ? "s" : ""}`}
                />
              ))}
              {day.eventColors.length > 4 && (
                <div className="event-color-more">
                  +{day.eventColors.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {day.eventCount === 0 && day.isCurrentMonth && (
        <div className="calendar-day-empty" />
      )}
    </div>
  );
};
