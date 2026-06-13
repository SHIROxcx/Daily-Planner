import { useMemo } from "react";
import { Event } from "../types";
import { getTodayDate, timeToMinutes } from "../utils/timeUtils";

export interface StatisticsData {
  totalEventsToday: number;
  completedEventsToday: number;
  completionRatePercent: number;
  eventsNextSevenDays: number;
  busiestDayThisWeek: {
    day: string;
    count: number;
  };
  averageEventsPerDay: number;
  mostUsedColor: {
    color: string;
    count: number;
  };
  streak: number;
  totalTimeAllocatedToday: number; // in minutes
  averageEventDuration: number; // in minutes
  peakBusyHours: number[]; // array of hours 0-23
  eventsByDay: Record<string, number>; // for chart data
}

export const useStatistics = (events: Event[]): StatisticsData => {
  return useMemo(() => {
    const today = getTodayDate();
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Total events today and completed today
    const todayEvents = events.filter((e) => e.date === today);
    const totalEventsToday = todayEvents.length;
    const completedEventsToday = todayEvents.filter((e) => e.completed).length;

    // Completion rate
    const completionRatePercent =
      totalEventsToday > 0
        ? Math.round((completedEventsToday / totalEventsToday) * 100)
        : 0;

    // Events scheduled for upcoming 7 days
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDaysEnd = sevenDaysFromNow.toISOString().split("T")[0];

    const eventsNextSevenDays = events.filter((e) => {
      return e.date > today && e.date <= sevenDaysEnd;
    }).length;

    // Events by day this week (for calculations)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split("T")[0];
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const eventsByDay: Record<string, number> = {};
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      eventsByDay[dateStr] = events.filter((e) => e.date === dateStr).length;
    }

    // Busiest day this week
    let busiestDay = "Monday";
    let busiestCount = 0;
    Object.entries(eventsByDay).forEach(([dateStr, count]) => {
      if (count > busiestCount) {
        const date = new Date(dateStr);
        busiestDay = dayNames[date.getDay()];
        busiestCount = count;
      }
    });

    // Average events per day (all time from available data)
    const uniqueDates = new Set(events.map((e) => e.date));
    const averageEventsPerDay =
      uniqueDates.size > 0 ? Math.round(events.length / uniqueDates.size) : 0;

    // Most used color
    const colorCounts: Record<string, number> = {};
    events.forEach((e) => {
      colorCounts[e.color] = (colorCounts[e.color] || 0) + 1;
    });
    const mostUsedColorEntry = Object.entries(colorCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const mostUsedColor = mostUsedColorEntry
      ? {
          color: mostUsedColorEntry[0],
          count: mostUsedColorEntry[1],
        }
      : { color: "#00ff88", count: 0 };

    // Streak (consecutive days with events)
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const hasEvent = events.some((e) => e.date === dateStr);
      if (hasEvent) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Total time allocated today (sum of event durations)
    let totalTimeAllocatedToday = 0;
    todayEvents.forEach((e) => {
      const startMinutes = timeToMinutes(e.startTime);
      const endMinutes = timeToMinutes(e.endTime);
      const duration = endMinutes - startMinutes;
      totalTimeAllocatedToday += Math.max(0, duration);
    });

    // Average event duration
    let totalDuration = 0;
    let eventCount = 0;
    events.forEach((e) => {
      const startMinutes = timeToMinutes(e.startTime);
      const endMinutes = timeToMinutes(e.endTime);
      const duration = endMinutes - startMinutes;
      if (duration > 0) {
        totalDuration += duration;
        eventCount++;
      }
    });
    const averageEventDuration =
      eventCount > 0 ? Math.round(totalDuration / eventCount) : 0;

    // Peak busy hours (which hours have the most events)
    const hourCounts: Record<number, number> = {};
    events.forEach((e) => {
      const startHour = parseInt(e.startTime.split(":")[0]);
      hourCounts[startHour] = (hourCounts[startHour] || 0) + 1;
    });

    const peakBusyHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      totalEventsToday,
      completedEventsToday,
      completionRatePercent,
      eventsNextSevenDays,
      busiestDayThisWeek: {
        day: busiestDay,
        count: busiestCount,
      },
      averageEventsPerDay,
      mostUsedColor,
      streak,
      totalTimeAllocatedToday,
      averageEventDuration,
      peakBusyHours,
      eventsByDay,
    };
  }, [events]);
};
