import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useStatistics } from "../hooks/useStatistics";
import { StatCard } from "./StatCard";
import { MiniChart } from "./MiniChart";
import "../styles/StatisticsPanel.css";
export const StatisticsPanel = ({ events }) => {
    const stats = useStatistics(events);
    // Format time in hours and minutes
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };
    // Prepare data for weekly chart
    const weekChartData = useMemo(() => {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayNames.map((day, index) => {
            const eventCount = Array.from(Object.values(stats.eventsByDay))[index] || 0;
            return {
                label: day,
                value: eventCount,
            };
        });
    }, [stats.eventsByDay]);
    // Determine completion color
    const getCompletionColor = (percent) => {
        if (percent === 0)
            return "primary";
        if (percent >= 75)
            return "success";
        if (percent >= 50)
            return "primary";
        return "warning";
    };
    return (_jsxs("div", { className: "statistics-panel", children: [_jsx("h2", { className: "statistics-panel__title", children: "\uD83D\uDCCA Statistics Dashboard" }), _jsxs("section", { className: "statistics-section", children: [_jsx("h3", { className: "statistics-section__title", children: "Today's Overview" }), _jsxs("div", { className: "statistics-grid", children: [_jsx(StatCard, { label: "Events Today", value: stats.totalEventsToday, icon: "\uD83D\uDCC5", color: "primary" }), _jsx(StatCard, { label: "Completed", value: stats.completedEventsToday, icon: "\u2705", color: "success" }), _jsx(StatCard, { label: "Completion Rate", value: stats.completionRatePercent, icon: "\uD83C\uDFAF", suffix: "%", color: getCompletionColor(stats.completionRatePercent) }), _jsx(StatCard, { label: "Time Allocated", value: formatTime(stats.totalTimeAllocatedToday), icon: "\u23F1\uFE0F", color: "primary" })] })] }), _jsxs("section", { className: "statistics-section", children: [_jsx("h3", { className: "statistics-section__title", children: "This Week" }), _jsxs("div", { className: "statistics-weekly", children: [_jsxs("div", { className: "statistics-weekly__cards", children: [_jsx(StatCard, { label: "Events Next 7 Days", value: stats.eventsNextSevenDays, icon: "\uD83D\uDDD3\uFE0F", color: "primary" }), _jsx(StatCard, { label: "Busiest Day", value: `${stats.busiestDayThisWeek.day} (${stats.busiestDayThisWeek.count})`, icon: "\uD83D\uDD25", color: "accent" }), _jsx(StatCard, { label: "Avg Events/Day", value: stats.averageEventsPerDay, icon: "\uD83D\uDCC8", color: "primary" })] }), _jsx("div", { className: "statistics-weekly__chart", children: _jsx(MiniChart, { data: weekChartData, title: "Events by Day" }) })] })] }), _jsxs("section", { className: "statistics-section", children: [_jsx("h3", { className: "statistics-section__title", children: "Productivity Insights" }), _jsxs("div", { className: "statistics-grid", children: [_jsx(StatCard, { label: "Current Streak", value: stats.streak, icon: "\uD83D\uDD25", suffix: " days", color: stats.streak > 0 ? "success" : "primary" }), _jsx(StatCard, { label: "Avg Event Duration", value: formatTime(stats.averageEventDuration), icon: "\u23F3", color: "primary" }), _jsx(StatCard, { label: "Most Used Category", value: "", icon: stats.mostUsedColor.color === "#00ff88" ? "🟢" : "●", color: "primary" }), stats.peakBusyHours.length > 0 && (_jsx(StatCard, { label: "Peak Hours", value: stats.peakBusyHours.map((h) => `${h}:00`).join(", "), icon: "\u23F0", color: "warning" }))] })] }), _jsxs("section", { className: "statistics-section", children: [_jsx("h3", { className: "statistics-section__title", children: "Legend" }), _jsx("div", { className: "statistics-legend", children: _jsxs("div", { className: "statistics-legend__item", children: [_jsx("div", { className: "statistics-legend__color", style: { backgroundColor: stats.mostUsedColor.color } }), _jsxs("span", { className: "statistics-legend__label", children: ["Most Used Color (", stats.mostUsedColor.count, " events)"] })] }) })] })] }));
};
