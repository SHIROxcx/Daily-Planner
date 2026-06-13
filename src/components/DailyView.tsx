import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Event } from "../types";
import { Timeline } from "./Timeline";
import { AddEventForm } from "./AddEventForm";
import { EventModal } from "./EventModal";
import { NotificationSettings } from "./NotificationSettings";
import { useSystemNotifications } from "../hooks/useSystemNotifications";
import { getEventsForDate, getTodayDate } from "../utils/timeUtils";
import "../styles/DailyView.css";

interface DailyViewProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, "id">) => void;
  onUpdateEvent: (id: string, updates: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onToggleComplete,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize system notifications hook
  useSystemNotifications(events);

  const dailyEvents = getEventsForDate(events, selectedDate);

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    onUpdateEvent(event.id, event);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent(eventId);
    setIsModalOpen(false);
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDate());
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="daily-view">
      <div className="daily-view-header">
        <div className="date-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={handlePreviousDay}
            title="Previous day"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="date-display">
            <h1 className="date-title">{formatDisplayDate(selectedDate)}</h1>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
          </div>
          <button
            className="nav-btn next-btn"
            onClick={handleNextDay}
            title="Next day"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="header-actions">
          <button className="btn-today" onClick={handleToday}>
            Today
          </button>
          <button
            className="btn-settings"
            onClick={() => setIsSettingsOpen(true)}
            title="Notification settings"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="daily-view-content">
        <aside className="daily-view-sidebar">
          <AddEventForm onAddEvent={onAddEvent} defaultDate={selectedDate} />
        </aside>

        <main className="daily-view-main">
          <Timeline
            events={dailyEvents}
            onEditEvent={handleEditEvent}
            onDeleteEvent={onDeleteEvent}
            onToggleComplete={onToggleComplete}
          />
        </main>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {isSettingsOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <NotificationSettings
              events={events}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
