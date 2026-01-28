import type {
  ActiveElement,
  ChartData,
  ChartEvent,
  ChartOptions,
  ScriptableContext,
  TooltipItem,
} from "chart.js";

export const barChartData = (
  labels: string[],
  data: number[],
  selectedIndex?: number,
): ChartData<"bar"> => {
  console.log("barchart: ", data);
  return {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: data,
        backgroundColor: selectedIndex
          ? function (context: ScriptableContext<"bar">) {
              return context.dataIndex === selectedIndex
                ? "#8A161A"
                : "#E22A30";
            }
          : "#E22A30",
        borderRadius: 16,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 1,
        minBarLength: 7,
      },
    ],
  };
};

export const barChartOptions = (
  onClick?: (event: ChartEvent, activeElements: ActiveElement[]) => void,
): ChartOptions<"bar"> => {
  return {
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
    onClick,
    onHover: (event, elements) => {
      if (event.native?.target) {
        (event.native.target as HTMLCanvasElement).style.cursor =
          elements.length ? "pointer" : "default";
      }
    },
  };
};

export const barChartMonths = () => {
  const now = new Date();
  return Array.from({ length: 13 }, (_, i) => {
    return new Date(now.getFullYear(), now.getMonth() - 12 + i, 1);
  });
};

export const barChartLabels = () => {
  return barChartMonths().map((month) =>
    month.toLocaleString("default", { month: "short" }),
  );
};
