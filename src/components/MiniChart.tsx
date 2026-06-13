import React, { useMemo } from "react";
import "../styles/StatisticsPanel.css";

export interface BarChartData {
  label: string;
  value: number;
}

export interface MiniChartProps {
  data: BarChartData[];
  title: string;
  maxValue?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  title,
  maxValue,
}) => {
  const max = useMemo(() => {
    if (maxValue) return maxValue;
    return Math.max(...data.map((d) => d.value), 1);
  }, [data, maxValue]);

  const getBarColor = (index: number): string => {
    const colors = [
      "rgba(0, 255, 136, 0.8)",
      "rgba(0, 217, 255, 0.8)",
      "rgba(255, 0, 110, 0.8)",
      "rgba(255, 165, 0, 0.8)",
      "rgba(0, 255, 136, 0.6)",
      "rgba(0, 217, 255, 0.6)",
      "rgba(255, 0, 110, 0.6)",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mini-chart">
      <h3 className="mini-chart__title">{title}</h3>
      <div className="mini-chart__container">
        {data.length === 0 ? (
          <p className="mini-chart__empty">No data available</p>
        ) : (
          <div className="mini-chart__bars">
            {data.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="mini-chart__bar-wrapper"
              >
                <div className="mini-chart__bar-container">
                  <div
                    className="mini-chart__bar"
                    style={{
                      height: `${(item.value / max) * 100}%`,
                      backgroundColor: getBarColor(index),
                    }}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
                <span className="mini-chart__label">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
