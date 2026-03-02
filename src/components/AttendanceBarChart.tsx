import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { Plugin } from "chart.js";
import { type JSX } from "react";
import { Bar } from "react-chartjs-2";

import {
  barChartData,
  barChartLabels,
  barChartOptions,
} from "../utils/barChart";

interface AttendanceBarChartProps {
  dataVals: (number | null)[];
}

export default function AttendanceBarChart({
  dataVals,
}: AttendanceBarChartProps): JSX.Element {
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  // Typed plugin (no any)
  const ValueInsideBarPlugin: Plugin<"bar"> = {
    id: "valueInsideBar",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      // Only draw for the first dataset
      const meta = chart.getDatasetMeta(0);

      // Guard against non-number data
      const numbers: number[] = [];

      ctx.save();
      ctx.font = "bold 12px Inter, ui-sans-serif, system-ui, -apple-system";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      meta.data.forEach((el, idx) => {
        const val = numbers[idx];
        if (!Number.isFinite(val)) return;

        // el is a RectangleElement for bar charts and has x/y
        // Types: el as unknown as { x: number; y: number }
        const { x, y } = el.getProps(["x", "y"], true) as {
          x: number;
          y: number;
        };

        // ~18px down from the top of the bar
        ctx.fillText(`${String(val)}%`, x, y + 18);
      });

      ctx.restore();
    },
  };

  ChartJS.register(ValueInsideBarPlugin);

  const labels = barChartLabels();

  const data = barChartData(labels, dataVals);
  const options = barChartOptions();

  return (
    <div className="w-full rounded-2xl bg-white">
      <div className="h-64 sm:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
