import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createServer } from "vite";

let server;
let stats;
let chart;
before(async () => {
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false, watch: null },
    appType: "custom",
  });
  stats = await server.ssrLoadModule("/src/utils/attendanceStats.ts");
  chart = await server.ssrLoadModule("/src/utils/barChart.ts");
});
after(async () => { await server?.close(); });

const entry = (year, month, day, didAttend) => ({
  date: new Date(year, month, day), didAttend,
});
const member = (cgAttendance) => ({ cgAttendance });
const freezeJanuary = (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date(2026, 0, 15).getTime() });
};

test("month and year averages exclude attendance across the year boundary", (t) => {
  freezeJanuary(t);
  const attendance = [
    entry(2025, 0, 1, true), entry(2025, 11, 31, true),
    entry(2026, 0, 1, true), entry(2026, 0, 8, false),
    entry(2026, 1, 1, false),
  ];
  assert.equal(stats.getAttendanceMonthAverage(attendance, new Date(2026, 0, 1)), 50);
  assert.ok(Math.abs(stats.getAttendanceYearAverage(attendance) - 100 / 3) < 1e-10);
});

test("monthly aggregation combines members and groups over the rolling year", (t) => {
  freezeJanuary(t);
  const group = [
    member([entry(2025, 11, 1, true), entry(2026, 0, 1, true), entry(2026, 0, 8, false)]),
    member([entry(2025, 11, 1, false), entry(2026, 0, 1, true), entry(2026, 0, 8, true)]),
  ];
  const otherGroup = [member([entry(2026, 0, 1, false)])];
  assert.deepEqual(chart.barChartMonths().map(d => [d.getFullYear(), d.getMonth(), d.getDate()]),
    Array.from({ length: 12 }, (_, month) => [2025, month, 1]).concat([[2026, 0, 1]]));
  assert.deepEqual(stats.calculateMonthlyAverageCgAttendance(group), Array(11).fill(0).concat([50, 75]));
  assert.equal(stats.calculateMonthlyAverageAttendanceManyCgs([group, otherGroup])[12], 37.5);
});

test("empty groups have the same missing-data series as members without attendance", (t) => {
  freezeJanuary(t);
  assert.deepEqual(stats.calculateMonthlyAverageCgAttendance([member([])]), Array(13).fill(null));
  assert.deepEqual(stats.calculateMonthlyAverageCgAttendance([]), Array(13).fill(null));
  assert.deepEqual(stats.calculateMonthlyAverageAttendanceManyCgs([]), Array(13).fill(0));
  const group = [member([entry(2026, 0, 1, true)])];
  assert.equal(stats.calculateMonthlyAverageAttendanceManyCgs([[], group])[12], 100);
});

test("drop-off counts only consecutive absences at the end", () => {
  assert.equal(stats.countDropOff([]), 0);
  assert.equal(stats.countDropOff([
    entry(2026, 0, 1, false), entry(2026, 0, 8, true),
    entry(2026, 0, 15, false), entry(2026, 0, 22, false),
  ]), 2);
});

test("chart selection highlights the first bar as well as later bars", () => {
  for (const selectedIndex of [0, 1]) {
    const dataset = chart.barChartData(["Dec", "Jan"], [50, 75], selectedIndex).datasets[0];
    assert.equal(typeof dataset.backgroundColor, "function");
    assert.equal(dataset.backgroundColor({ dataIndex: selectedIndex }), "#8A161A");
    assert.equal(dataset.backgroundColor({ dataIndex: 1 - selectedIndex }), "#E22A30");
  }
  assert.equal(chart.barChartData([], []).datasets[0].backgroundColor, "#E22A30");
});
