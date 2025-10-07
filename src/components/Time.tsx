import React from "react";

interface LinhaProps {
  data: { Manual: number; Aplicativo: number; conferencia: string }[];
  width: number;
  height: number;
  margin?: { top: number; bottom: number; left: number; right: number };
}

const LinhaPercentual: React.FC<LinhaProps> = ({ data, width, height, margin }) => {
  const m = margin || { top: 20, bottom: 20, left: 20, right: 20 };
  const chartWidth = width - m.left - m.right;
  const chartHeight = height - m.top - m.bottom;
  const barWidth = chartWidth / data.length / 2;
  const maxValue = Math.max(...data.flatMap((d) => [d.Manual, d.Aplicativo]));

  return (
    <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      {data.map((d, i) => {
        const xManual = m.left + i * barWidth * 2 + barWidth / 2;
        const xAplicativo = xManual + barWidth;
        const yManual = m.top + chartHeight * (1 - d.Manual / maxValue);
        const yAplicativo = m.top + chartHeight * (1 - d.Aplicativo / maxValue);

        const perc = ((1 - d.Aplicativo / d.Manual) * 100).toFixed(1);
        const isReducao = Number(perc) >= 0;

        return (
          <g key={i}>
            <line
              x1={xManual}
              y1={yManual}
              x2={xAplicativo}
              y2={yAplicativo}
              stroke={isReducao ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
            />
            <text
              x={(xManual + xAplicativo) / 2}
              y={(yManual + yAplicativo) / 2 - 5}
              textAnchor="middle"
              fill={isReducao ? "#16a34a" : "#dc2626"}
              fontSize={12}
              fontWeight="bold"
            >
              {isReducao ? `-${perc}%` : `+${Math.abs(Number(perc))}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default LinhaPercentual;
