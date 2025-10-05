import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { Plugin, ChartData, ChartOptions, TooltipItem } from "chart.js";
import { type JSX } from "react";
import { Bar } from "react-chartjs-2";
import type { Group, PersonAttendance } from "../utils/types";

interface AttendanceBarChartProps {
  group: Group;
}

export default function AttendanceBarChart({
  group,
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

  const labels = [
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const calculateMonthlyAverageAttendance = (members: PersonAttendance[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastMonth = now.getMonth() - 1;
    const months = Array.from({ length: lastMonth }, (_, i) => i);
    months.map((month) => {
      console.log("month: ", month);
      const monthAttendance =
        members
          .map((member) =>
            member.cgAttendance.filter(
              (att) => att.date.getMonth() === month && att.didAttend
            )
          )
          .flat().length /
        members[0].cgAttendance.filter((att) => att.date.getMonth()).length;
      console.log("monthAttendance: ", monthAttendance);
      return monthAttendance;
    });

    return [];
  };

  const monthlyAverageData = calculateMonthlyAverageAttendance(group.members);

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: monthlyAverageData,
        backgroundColor: "#E3342F", // red
        borderRadius: 16,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">): string =>
            `${String(ctx.parsed.y)}%`,
        },
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280", // gray-500
          font: { weight: "bold" },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value: string | number): string => `${String(value)}%`,
          color: "#6B7280",
        },
        grid: {
          color: "#E5E7EB", // gray-200
          // drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="w-full rounded-2xl bg-white">
      <div className="h-64 sm:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
