import React, { useMemo } from "react";
import { Event } from "../types";
import { useStatistics } from "../hooks/useStatistics";
import { StatCard } from "./StatCard";
import { MiniChart, BarChartData } from "./MiniChart";
import "../styles/StatisticsPanel.css";

interface StatisticsPanelProps {
  events: Event[];
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ events }) => {
  const stats = useStatistics(events);

  // Format time in hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Prepare data for weekly chart
  const weekChartData: BarChartData[] = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames.map((day, index) => {
      const eventCount =
        Array.from(Object.values(stats.eventsByDay))[index] || 0;
      return {
        label: day,
        value: eventCount,
      };
    });
  }, [stats.eventsByDay]);

  // Determine completion color
  const getCompletionColor = (
    percent: number,
  ): "success" | "primary" | "warning" => {
    if (percent === 0) return "primary";
    if (percent >= 75) return "success";
    if (percent >= 50) return "primary";
    return "warning";
  };

  return (
    <div className="statistics-panel">
      <h2 className="statistics-panel__title">📊 Statistics Dashboard</h2>

      {/* Overview Section */}
      <section className="statistics-section">
        <h3 className="statistics-section__title">Today's Overview</h3>
        <div className="statistics-grid">
          <StatCard
            label="Events Today"
            value={stats.totalEventsToday}
            icon="📅"
            color="primary"
          />
          <StatCard
            label="Completed"
            value={stats.completedEventsToday}
            icon="✅"
            color="success"
          />
          <StatCard
            label="Completion Rate"
            value={stats.completionRatePercent}
            icon="🎯"
            suffix="%"
            color={getCompletionColor(stats.completionRatePercent)}
          />
          <StatCard
            label="Time Allocated"
            value={formatTime(stats.totalTimeAllocatedToday)}
            icon="⏱️"
            color="primary"
          />
        </div>
      </section>

      {/* Weekly Stats Section */}
      <section className="statistics-section">
        <h3 className="statistics-section__title">This Week</h3>
        <div className="statistics-weekly">
          <div className="statistics-weekly__cards">
            <StatCard
              label="Events Next 7 Days"
              value={stats.eventsNextSevenDays}
              icon="🗓️"
              color="primary"
            />
            <StatCard
              label="Busiest Day"
              value={`${stats.busiestDayThisWeek.day} (${stats.busiestDayThisWeek.count})`}
              icon="🔥"
              color="accent"
            />
            <StatCard
              label="Avg Events/Day"
              value={stats.averageEventsPerDay}
              icon="📈"
              color="primary"
            />
          </div>
          <div className="statistics-weekly__chart">
            <MiniChart data={weekChartData} title="Events by Day" />
          </div>
        </div>
      </section>

      {/* Productivity Insights Section */}
      <section className="statistics-section">
        <h3 className="statistics-section__title">Productivity Insights</h3>
        <div className="statistics-grid">
          <StatCard
            label="Current Streak"
            value={stats.streak}
            icon="🔥"
            suffix=" days"
            color={stats.streak > 0 ? "success" : "primary"}
          />
          <StatCard
            label="Avg Event Duration"
            value={formatTime(stats.averageEventDuration)}
            icon="⏳"
            color="primary"
          />
          <StatCard
            label="Most Used Category"
            value=""
            icon={stats.mostUsedColor.color === "#00ff88" ? "🟢" : "●"}
            color="primary"
          />
          {stats.peakBusyHours.length > 0 && (
            <StatCard
              label="Peak Hours"
              value={stats.peakBusyHours.map((h) => `${h}:00`).join(", ")}
              icon="⏰"
              color="warning"
            />
          )}
        </div>
      </section>

      {/* Color Legend */}
      <section className="statistics-section">
        <h3 className="statistics-section__title">Legend</h3>
        <div className="statistics-legend">
          <div className="statistics-legend__item">
            <div
              className="statistics-legend__color"
              style={{ backgroundColor: stats.mostUsedColor.color }}
            />
            <span className="statistics-legend__label">
              Most Used Color ({stats.mostUsedColor.count} events)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
