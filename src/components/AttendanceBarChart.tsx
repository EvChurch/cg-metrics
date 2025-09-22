import { type JSX } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Plugin, ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Typed plugin (no any)
const ValueInsideBarPlugin: Plugin<'bar'> = {
  id: 'valueInsideBar',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    // Only draw for the first dataset
    const meta = chart.getDatasetMeta(0);

    // Guard against non-number data
    const numbers: number[] = [];

    ctx.save();
    ctx.font = 'bold 12px Inter, ui-sans-serif, system-ui, -apple-system';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    meta.data.forEach((el, idx) => {
      const val = numbers[idx];
      if (!Number.isFinite(val)) return;

      // el is a RectangleElement for bar charts and has x/y
      // Types: el as unknown as { x: number; y: number }
      const { x, y } = el.getProps(['x', 'y'], true) as {
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
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
const values: number[] = [77, 73, 91, 87, 76, 70, 92, 83, 90, 95];

const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
      label: 'Attendance',
      data: values,
      backgroundColor: '#E3342F', // red
      borderRadius: 16,
      borderSkipped: false,
      categoryPercentage: 0.8,
      barPercentage: 1,
    },
  ],
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>): string => `${String(ctx.parsed.y)}%`,
      },
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6B7280', // gray-500
        font: { weight: 'bold' },
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 25,
        callback: (value: string | number): string => `${String(value)}%`,
        color: '#6B7280',
      },
      grid: {
        color: '#E5E7EB', // gray-200
        // drawBorder: false,
      },
    },
  },
};

export default function AttendanceBarChart(): JSX.Element {
  return (
    <div className="w-full rounded-2xl bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <div className="h-64 sm:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
