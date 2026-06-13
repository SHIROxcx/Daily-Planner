import { useState, useCallback, useMemo } from "react";
import { Event } from "../types";

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: Event[];
  eventCount: number;
  hasImportant: boolean;
  eventColors: string[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
  weeks: CalendarDay[][];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Hook for managing calendar state and logic
 */
export const useCalendar = (events: Event[]) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Format date to YYYY-MM-DD
  const formatDateString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Get today's date string
  const todayString = useMemo(() => {
    return formatDateString(new Date());
  }, [formatDateString]);

  // Build calendar days for the current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month's days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayOfMonth = prevMonthLastDay - i;
      const date = new Date(year, month - 1, dayOfMonth);
      const dateString = formatDateString(date);

      days.push({
        date,
        dateString,
        dayOfMonth,
        isCurrentMonth: false,
        isToday: dateString === todayString,
        isSelected: dateString === selectedDate,
        events: events.filter((e) => e.date === dateString),
        eventCount: events.filter((e) => e.date === dateString).length,
        hasImportant: events
          .filter((e) => e.date === dateString)
          .some((e) => e.isImportant),
        eventColors: [
          ...new Set(
            events
              .filter((e) => e.date === dateString)
              .map((e) => e.color || "#00aaff"),
          ),
        ],
      });
    }

    // Current month's days
    for (let dayOfMonth = 1; dayOfMonth <= lastDay.getDate(); dayOfMonth++) {
      const date = new Date(year, month, dayOfMonth);
      const dateString = formatDateString(date);

      days.push({
        date,
        dateString,
        dayOfMonth,
        isCurrentMonth: true,
        isToday: dateString === todayString,
        isSelected: dateString === selectedDate,
        events: events.filter((e) => e.date === dateString),
        eventCount: events.filter((e) => e.date === dateString).length,
        hasImportant: events
          .filter((e) => e.date === dateString)
          .some((e) => e.isImportant),
        eventColors: [
          ...new Set(
            events
              .filter((e) => e.date === dateString)
              .map((e) => e.color || "#00aaff"),
          ),
        ],
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let dayOfMonth = 1; dayOfMonth <= remainingDays; dayOfMonth++) {
      const date = new Date(year, month + 1, dayOfMonth);
      const dateString = formatDateString(date);

      days.push({
        date,
        dateString,
        dayOfMonth,
        isCurrentMonth: false,
        isToday: dateString === todayString,
        isSelected: dateString === selectedDate,
        events: events.filter((e) => e.date === dateString),
        eventCount: events.filter((e) => e.date === dateString).length,
        hasImportant: events
          .filter((e) => e.date === dateString)
          .some((e) => e.isImportant),
        eventColors: [
          ...new Set(
            events
              .filter((e) => e.date === dateString)
              .map((e) => e.color || "#00aaff"),
          ),
        ],
      });
    }

    // Split into weeks
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return {
      year,
      month,
      days,
      weeks,
    } as CalendarMonth;
  }, [currentDate, events, selectedDate, formatDateString, todayString]);

  // Navigate to previous month
  const previousMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  // Navigate to next month
  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(todayString);
  }, [todayString]);

  // Select a specific date
  const selectDate = useCallback((dateString: string) => {
    setSelectedDate(dateString);
  }, []);

  // Get display month/year
  const displayMonth = useMemo(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[calendarData.month]} ${calendarData.year}`;
  }, [calendarData.month, calendarData.year]);

  // Get selected date's events
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e.date === selectedDate);
  }, [selectedDate, events]);

  return {
    currentDate,
    selectedDate,
    selectedDateEvents,
    calendarData,
    displayMonth,
    previousMonth,
    nextMonth,
    goToToday,
    selectDate,
    weekdays: WEEKDAYS,
  };
};
