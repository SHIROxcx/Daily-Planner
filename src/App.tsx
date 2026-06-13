import { useState, useEffect } from "react";
import { DailyView } from "./components/DailyView";
import { CalendarView } from "./components/CalendarView";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { UpcomingEventsPanel } from "./components/UpcomingEventsPanel";
import { NotificationContainer } from "./components/NotificationContainer";
import { NotificationSettings } from "./components/NotificationSettings";
import { useEvents } from "./hooks/useEvents";
import { Event } from "./types";
import "./styles/App.css";

// FORCE RELOAD - v2.0
type ViewType = "calendar" | "daily" | "dashboard";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventCompletion,
  } = useEvents();

  // Clear old localStorage and show calendar on first load
  useEffect(() => {
    console.log("=== APP MOUNTED - FORCING CALENDAR VIEW ===");
    localStorage.clear();
    setCurrentView("calendar");
    setShowSettings(true);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <span className="spinner"></span>
          <p>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    setCurrentView("daily");
  };

  const handleAddEvent = (dateString: string) => {
    setSelectedDate(dateString);
    setCurrentView("daily");
  };

  const handleBackToCalendar = () => {
    setCurrentView("calendar");
  };

  const handleUpcomingEdit = (event: Event) => {
    setSelectedDate(event.date);
    setCurrentView("daily");
  };

  return (
    <div className="app">
      <NotificationContainer />

      <div className="app-header">
        <div className="app-title">
          <h1>Time Dashboard</h1>
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${currentView === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentView("dashboard")}
            title="Dashboard View"
          >
            📊 Dashboard
          </button>
          <button
            className={`view-btn ${currentView === "calendar" ? "active" : ""}`}
            onClick={() => setCurrentView("calendar")}
            title="Calendar View"
          >
            📅 Calendar
          </button>
          <button
            className={`view-btn ${currentView === "daily" ? "active" : ""}`}
            onClick={() => setCurrentView("daily")}
            title="Daily View"
          >
            📋 Daily
          </button>
          <button
            className="view-btn settings-btn"
            onClick={() => setShowSettings(true)}
            title="Notification Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="app-content">
        {currentView === "dashboard" ? (
          <div className="dashboard-view">
            <StatisticsPanel events={events} />
            <UpcomingEventsPanel
              events={events}
              onUpdateEvent={updateEvent}
              onEditEvent={handleUpcomingEdit}
            />
          </div>
        ) : currentView === "calendar" ? (
          <CalendarView
            events={events}
            onDateSelect={handleDateSelect}
            onAddEvent={handleAddEvent}
          />
        ) : (
          <div className="daily-view-wrapper">
            <button
              className="back-to-calendar-btn"
              onClick={handleBackToCalendar}
            >
              ◀ Back to Calendar
            </button>
            <DailyView
              events={
                selectedDate
                  ? events.filter((e) => e.date === selectedDate)
                  : events
              }
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
              onToggleComplete={toggleEventCompletion}
            />
          </div>
        )}
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowSettings(false)}
        >
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <NotificationSettings
              events={events}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
