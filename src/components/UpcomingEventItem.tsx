import React from "react";
import { Star, Edit2, Bell } from "lucide-react";
import { UpcomingEvent } from "../hooks/useUpcomingEvents";

interface UpcomingEventItemProps {
  event: UpcomingEvent;
  onToggleImportant: (eventId: string) => void;
  onEditEvent: (event: UpcomingEvent) => void;
  onSetReminder: (event: UpcomingEvent) => void;
}

export const UpcomingEventItem: React.FC<UpcomingEventItemProps> = ({
  event,
  onToggleImportant,
  onEditEvent,
  onSetReminder,
}) => {
  const eventDate = new Date(`${event.date}T00:00:00`);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(eventDate);

  return (
    <article className="upcoming-event-item">
      <div
        className="upcoming-event-item__accent"
        style={{ backgroundColor: event.color }}
      />

      <div className="upcoming-event-item__content">
        <div className="upcoming-event-item__top-row">
          <div className="upcoming-event-item__titles">
            <div className="upcoming-event-item__meta">
              <span
                className={`upcoming-event-item__badge upcoming-event-item__badge--${event.statusLabel.toLowerCase()}`}
              >
                {event.statusLabel}
              </span>
              <span className="upcoming-event-item__countdown">
                {event.countdownLabel}
              </span>
            </div>
            <h3 className="upcoming-event-item__title">{event.title}</h3>
            <p className="upcoming-event-item__datetime">
              {dateLabel} • {event.startTime} - {event.endTime}
            </p>
          </div>

          <div className="upcoming-event-item__flags">
            {event.isImportant && (
              <span className="upcoming-event-item__flag upcoming-event-item__flag--important">
                ★ Important
              </span>
            )}
            <span className="upcoming-event-item__flag upcoming-event-item__flag--color">
              {event.color}
            </span>
          </div>
        </div>

        {event.description && (
          <p className="upcoming-event-item__description">
            {event.description}
          </p>
        )}

        <div className="upcoming-event-item__footer">
          <span className="upcoming-event-item__reminder">
            {event.reminderLabel}
          </span>

          <div className="upcoming-event-item__actions">
            <button
              type="button"
              className={`upcoming-event-item__action ${event.isImportant ? "is-active" : ""}`}
              onClick={() => onToggleImportant(event.id)}
              aria-pressed={event.isImportant}
              title={
                event.isImportant
                  ? "Remove important flag"
                  : "Mark as important"
              }
            >
              <Star
                size={18}
                fill={event.isImportant ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              className="upcoming-event-item__action"
              onClick={() => onEditEvent(event)}
              title="Edit event"
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              className="upcoming-event-item__action"
              onClick={() => onSetReminder(event)}
              title="Set custom reminder"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
