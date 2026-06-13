import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import "../styles/StatisticsPanel.css";
export const MiniChart = ({ data, title, maxValue, }) => {
    const max = useMemo(() => {
        if (maxValue)
            return maxValue;
        return Math.max(...data.map((d) => d.value), 1);
    }, [data, maxValue]);
    const getBarColor = (index) => {
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
    return (_jsxs("div", { className: "mini-chart", children: [_jsx("h3", { className: "mini-chart__title", children: title }), _jsx("div", { className: "mini-chart__container", children: data.length === 0 ? (_jsx("p", { className: "mini-chart__empty", children: "No data available" })) : (_jsx("div", { className: "mini-chart__bars", children: data.map((item, index) => (_jsxs("div", { className: "mini-chart__bar-wrapper", children: [_jsx("div", { className: "mini-chart__bar-container", children: _jsx("div", { className: "mini-chart__bar", style: {
                                        height: `${(item.value / max) * 100}%`,
                                        backgroundColor: getBarColor(index),
                                    }, title: `${item.label}: ${item.value}` }) }), _jsx("span", { className: "mini-chart__label", children: item.label })] }, `${item.label}-${index}`))) })) })] }));
};
