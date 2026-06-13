import React, { useMemo } from "react";
import { Event } from "../types";
import { EventBlock } from "./EventBlock";
import "../styles/Timeline.css";

interface TimelineProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleComplete: (eventId: string) => void;
  startHour?: number;
  endHour?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onToggleComplete,
  startHour = 6,
  endHour = 23,
}) => {
  const hours = useMemo(() => {
    const result = [];
    for (let i = startHour; i <= endHour; i++) {
      result.push(i);
    }
    return result;
  }, [startHour, endHour]);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = parseInt(event.startTime.split(":")[0]);
      return eventStart === hour;
    });
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>Daily Timeline</h2>
      </div>
      <div className="timeline-content">
        {hours.map((hour) => (
          <div key={hour} className="timeline-hour-block">
            <div className="timeline-hour-label">
              <span className="hour-time">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
            <div className="timeline-hour-events">
              {getEventsForHour(hour).length > 0 ? (
                getEventsForHour(hour).map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              ) : (
                <div className="timeline-empty-slot">No events</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
