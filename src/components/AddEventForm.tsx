import React, { useState } from "react";
import { Event } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import "../styles/AddEventForm.css";

interface AddEventFormProps {
  onAddEvent: (event: Omit<Event, "id">) => void;
  defaultDate: string;
}

const DEFAULT_COLORS = [
  "#00ff88",
  "#ff006e",
  "#00d9ff",
  "#ffa500",
  "#aa00ff",
  "#ff0055",
];

export const AddEventForm: React.FC<AddEventFormProps> = ({
  onAddEvent,
  defaultDate,
}) => {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    color: DEFAULT_COLORS[0],
    date: defaultDate,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.time = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventTitle = formData.title.trim();
    onAddEvent({
      title: eventTitle,
      description: formData.description.trim(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: formData.color,
      date: formData.date,
      completed: false,
    });

    // Show notification
    addNotification(`Event "${eventTitle}" created!`, "success", 3000);

    // Reset form
    setFormData({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      color: DEFAULT_COLORS[0],
      date: defaultDate,
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Add New Event</h3>
      </div>

      <div className="form-group">
        <label htmlFor="title">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter event title"
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter event description (optional)"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startTime">Start Time *</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time *</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {errors.time && (
        <div className="form-error">
          <span className="error-message">{errors.time}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <div className="color-picker">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    color,
                  }))
                }
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Add Event
      </button>
    </form>
  );
};
