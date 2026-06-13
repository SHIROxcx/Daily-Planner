import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import "../styles/AddEventForm.css";
const DEFAULT_COLORS = [
    "#00ff88",
    "#ff006e",
    "#00d9ff",
    "#ffa500",
    "#aa00ff",
    "#ff0055",
];
export const AddEventForm = ({ onAddEvent, defaultDate, }) => {
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        color: DEFAULT_COLORS[0],
        date: defaultDate,
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (formData.startTime >= formData.endTime) {
            newErrors.time = "End time must be after start time";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (_jsxs("form", { className: "add-event-form", onSubmit: handleSubmit, children: [_jsx("div", { className: "form-header", children: _jsx("h3", { children: "Add New Event" }) }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "title", children: "Event Title *" }), _jsx("input", { type: "text", id: "title", name: "title", value: formData.title, onChange: handleInputChange, placeholder: "Enter event title", className: errors.title ? "input-error" : "" }), errors.title && _jsx("span", { className: "error-message", children: errors.title })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "description", children: "Description" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleInputChange, placeholder: "Enter event description (optional)", rows: 3 })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "startTime", children: "Start Time *" }), _jsx("input", { type: "time", id: "startTime", name: "startTime", value: formData.startTime, onChange: handleInputChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "endTime", children: "End Time *" }), _jsx("input", { type: "time", id: "endTime", name: "endTime", value: formData.endTime, onChange: handleInputChange })] })] }), errors.time && (_jsx("div", { className: "form-error", children: _jsx("span", { className: "error-message", children: errors.time }) })), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "date", children: "Date *" }), _jsx("input", { type: "date", id: "date", name: "date", value: formData.date, onChange: handleInputChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "color", children: "Color" }), _jsx("div", { className: "color-picker", children: DEFAULT_COLORS.map((color) => (_jsx("button", { type: "button", className: `color-option ${formData.color === color ? "selected" : ""}`, style: { backgroundColor: color }, onClick: () => setFormData((prev) => ({
                                        ...prev,
                                        color,
                                    })), title: color }, color))) })] })] }), _jsx("button", { type: "submit", className: "btn-submit", children: "Add Event" })] }));
};
