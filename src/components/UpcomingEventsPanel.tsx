import React from "react";
import { Event } from "../types";
import { useUpcomingEvents, UpcomingDaysAhead, UpcomingSortMode } from "../hooks/useUpcomingEvents";
import { UpcomingEventItem } from "./UpcomingEventItem";
import "../styles/UpcomingEventsPanel.css";

interface UpcomingEventsPanelProps {
  events: Event[];
  onUpdateEvent: (id: string, updates: Partial<Event>) => void;
  onEditEvent?: (event: Event) => void;
}

const DAYS_OPTIONS: UpcomingDaysAhead[] = [3, 5, 7];
const SORT_OPTIONS: { value: UpcomingSortMode; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "priority", label: "Priority" },
  { value: "time", label: "Time" },
];

export const UpcomingEventsPanel: React.FC<UpcomingEventsPanelProps> = ({
  events,
  onUpdateEvent,
  onEditEvent,
}) => {
  const {
    upcomingEvents,
    daysAhead,
    sortBy,
    setDaysAhead,
    setSortBy,
    toggleImportant,
    setCustomReminder,
  } = useUpcomingEvents(events, { onUpdateEvent });

  const handleEditEvent = (event: Event) => {
    if (onEditEvent) {
      onEditEvent(event);
      return;
    }

    alert(`Open ${event.title} from the daily planner to edit details.`);
  };

  const handleSetReminder = (event: Event) => {
    const input = window.prompt(
      `Set reminder for \"${event.title}\" in how many minutes?`,
      event.reminderMinutes?.[0]?.toString() ?? "15",
    );

    if (input === null) {
      return;
    }

    const parsed = Number.parseInt(input, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      window.alert("Please enter a valid number of minutes.");
      return;
    }

    setCustomReminder(event.id, parsed);
  };

  return (
    <section className="upcoming-events-panel">
      <div className="upcoming-events-panel__header">
        <div>
          <h2 className="upcoming-events-panel__title">🔔 Upcoming Events</h2>
          <p className="upcoming-events-panel__subtitle">
            Events due in the next {daysAhead} days
          </p>
        </div>

        <div className="upcoming-events-panel__summary">
          <span className="upcoming-events-panel__count">{upcomingEvents.length} items</span>
        </div>
      </div>

      <div className="upcoming-events-panel__controls">
        <div className="upcoming-events-panel__segmented">
          {DAYS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`upcoming-events-panel__segment ${daysAhead === option ? "is-active" : ""}`}
              onClick={() => setDaysAhead(option)}
            >
              {option}d
            </button>
          ))}
        </div>

        <div className="upcoming-events-panel__segmented">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`upcoming-events-panel__segment ${sortBy === option.value ? "is-active" : ""}`}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="upcoming-events-panel__list">
        {upcomingEvents.length === 0 ? (
          <div className="upcoming-events-panel__empty">
            <p>No upcoming events in this window.</p>
            <span>Try expanding the range or adding a few events.</span>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <UpcomingEventItem
              key={event.id}
              event={event}
              onToggleImportant={toggleImportant}
              onEditEvent={handleEditEvent}
              onSetReminder={handleSetReminder}
            />
          ))
        )}
      </div>
    </section>
  );
};