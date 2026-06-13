import React from "react";

interface CalendarHeaderProps {
  displayMonth: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <div className="calendar-header">
      <button
        className="calendar-nav-btn"
        onClick={onPreviousMonth}
        aria-label="Previous month"
        title="Previous month"
      >
        ◀ Prev
      </button>

      <div className="calendar-title">
        <h2>{displayMonth}</h2>
        <button className="calendar-today-btn" onClick={onToday}>
          Today
        </button>
      </div>

      <button
        className="calendar-nav-btn"
        onClick={onNextMonth}
        aria-label="Next month"
        title="Next month"
      >
        Next ▶
      </button>
    </div>
  );
};
