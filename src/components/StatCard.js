import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../styles/StatisticsPanel.css";
export const StatCard = ({ label, value, icon, suffix, color = "primary", onClick, }) => {
    return (_jsxs("div", { className: `stat-card stat-card--${color}`, onClick: onClick, role: "button", tabIndex: onClick ? 0 : -1, children: [_jsxs("div", { className: "stat-card__header", children: [icon && _jsx("span", { className: "stat-card__icon", children: icon }), _jsx("h3", { className: "stat-card__label", children: label })] }), _jsxs("div", { className: "stat-card__value", children: [value, suffix && _jsx("span", { className: "stat-card__suffix", children: suffix })] })] }));
};
