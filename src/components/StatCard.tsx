import React from "react";
import "../styles/StatisticsPanel.css";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string | React.ReactNode;
  suffix?: string;
  color?: "success" | "primary" | "warning" | "accent";
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  suffix,
  color = "primary",
  onClick,
}) => {
  return (
    <div
      className={`stat-card stat-card--${color}`}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : -1}
    >
      <div className="stat-card__header">
        {icon && <span className="stat-card__icon">{icon}</span>}
        <h3 className="stat-card__label">{label}</h3>
      </div>
      <div className="stat-card__value">
        {value}
        {suffix && <span className="stat-card__suffix">{suffix}</span>}
      </div>
    </div>
  );
};
