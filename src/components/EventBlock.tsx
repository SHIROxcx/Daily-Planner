import React from "react";
import { Event } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import { getEventDuration } from "../utils/timeUtils";
import "../styles/EventBlock.css";

interface EventBlockProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onToggleComplete: (eventId: string) => void;
}

export const EventBlock: React.FC<EventBlockProps> = ({
  event,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const { addNotification } = useNotification();
  const duration = getEventDuration(event);
  const heightPercentage = (duration / 60) * 100; // Assuming 60px per hour

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
      addNotification(`Event "${event.title}" deleted`, "info", 3000);
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(event.id);
    const message = event.completed
      ? `Event "${event.title}" marked as incomplete`
      : `Event "${event.title}" completed! 🎉`;
    addNotification(message, event.completed ? "info" : "success", 3000);
  };

  return (
    <div
      className={`event-block ${event.completed ? "completed" : ""}`}
      style={{
        backgroundColor: event.color,
        minHeight: `${Math.max(heightPercentage, 40)}px`,
        borderColor: event.color,
      }}
      onClick={() => onEdit(event)}
      title={event.title}
    >
      <div className="event-block-content">
        <div className="event-block-header">
          <h4 className="event-block-title">{event.title}</h4>
          <div className="event-block-actions">
            <button
              className="event-block-action-btn complete-btn"
              onClick={handleToggleComplete}
              title={event.completed ? "Mark incomplete" : "Mark complete"}
            >
              {event.completed ? "✓" : "○"}
            </button>
            <button
              className="event-block-action-btn delete-btn"
              onClick={handleDelete}
              title="Delete event"
            >
              ×
            </button>
          </div>
        </div>
        <p className="event-block-time">
          {event.startTime} - {event.endTime}
        </p>
        {event.description && (
          <p className="event-block-description">{event.description}</p>
        )}
      </div>
    </div>
  );
};
