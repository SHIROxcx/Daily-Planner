import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import "../styles/EventModal.css";
const DEFAULT_COLORS = [
    "#00ff88",
    "#ff006e",
    "#00d9ff",
    "#ffa500",
    "#aa00ff",
    "#ff0055",
];
export const EventModal = ({ event, isOpen, onClose, onSave, onDelete, }) => {
    const [formData, setFormData] = useState(event);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setFormData(event);
    }, [event]);
    if (!isOpen || !formData) {
        return null;
    }
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
        onSave(formData);
        onClose();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this event?")) {
            onDelete(formData.id);
            onClose();
        }
    };
    return (_jsx("div", { className: "event-modal-overlay", onClick: onClose, children: _jsxs("div", { className: "event-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: "Edit Event" }), _jsx("button", { className: "modal-close-btn", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "title", children: "Event Title *" }), _jsx("input", { type: "text", id: "title", name: "title", value: formData.title, onChange: handleInputChange, className: errors.title ? "input-error" : "" }), errors.title && (_jsx("span", { className: "error-message", children: errors.title }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "description", children: "Description" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleInputChange, rows: 3 })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "startTime", children: "Start Time *" }), _jsx("input", { type: "time", id: "startTime", name: "startTime", value: formData.startTime, onChange: handleInputChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "endTime", children: "End Time *" }), _jsx("input", { type: "time", id: "endTime", name: "endTime", value: formData.endTime, onChange: handleInputChange })] })] }), errors.time && (_jsx("div", { className: "form-error", children: _jsx("span", { className: "error-message", children: errors.time }) })), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "date", children: "Date *" }), _jsx("input", { type: "date", id: "date", name: "date", value: formData.date, onChange: handleInputChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Color" }), _jsx("div", { className: "color-picker", children: DEFAULT_COLORS.map((color) => (_jsx("button", { type: "button", className: `color-option ${formData.color === color ? "selected" : ""}`, style: { backgroundColor: color }, onClick: () => setFormData((prev) => (prev ? { ...prev, color } : null)) }, color))) })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "submit", className: "btn-save", children: "Save Changes" }), _jsx("button", { type: "button", className: "btn-delete", onClick: handleDelete, children: "Delete Event" }), _jsx("button", { type: "button", className: "btn-cancel", onClick: onClose, children: "Cancel" })] })] })] }) }));
};
