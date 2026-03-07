import { barChartMonths } from "./barChart";
import type { AttendanceEntry, PersonAttendance } from "./types";

export const countDropOff = (attendance: AttendanceEntry[]) => {
  let count = 0;
  for (let i = attendance.length - 1; i >= 0; i--) {
    if (!attendance[i].didAttend) {
      count++;
    } else {
      break;
    }
  }
  return count;
};

export const getAttendanceMonthAverage = (
  attendance: AttendanceEntry[],
  month: Date,
) => {
  const monthAttendance = attendance.filter(
    (att) =>
      att.date.getMonth() === month.getMonth() &&
      att.date.getFullYear() === month.getFullYear(),
  );

  return (
    (monthAttendance.filter((att) => att.didAttend).length /
      monthAttendance.length) *
    100
  );
};

export const getAttendanceYearAverage = (attendance: AttendanceEntry[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const cgYearAttendance = attendance.filter(
    (att) => att.date.getFullYear() === currentYear,
  );
  return (
    (cgYearAttendance.filter((att) => att.didAttend).length /
      cgYearAttendance.length) *
    100
  );
};

export const calculateMonthlyAverageCgAttendance = (
  members: PersonAttendance[],
) => {
  const maxAttendance = members.reduce((max, member) =>
    member.cgAttendance.length > max.cgAttendance.length ? member : max,
  );
  const months = barChartMonths();

  return months.map((month) => {
    const attendanceDate = members.find((m) => m.cgAttendance.length > 0)
      ?.cgAttendance[0].date;
    if (attendanceDate) {
      const maxMonthAttendance =
        maxAttendance.cgAttendance.filter(
          (att) =>
            att.date.getMonth() === month.getMonth() &&
            att.date.getFullYear() === month.getFullYear(),
        ).length * members.length;
      const monthAttendance = maxMonthAttendance
        ? (members
            .map((member) =>
              member.cgAttendance.filter(
                (att) =>
                  att.date.getMonth() === month.getMonth() &&
                  att.date.getFullYear() === month.getFullYear() &&
                  att.didAttend,
              ),
            )
            .flat().length /
            maxMonthAttendance) *
          100
        : 0;
      return Math.round(monthAttendance);
    }
    return null;
  });
};

export const average = (arr: (number | null)[]) => {
  const filteredArr = arr.filter((n) => n !== null);
  return filteredArr.length
    ? filteredArr.reduce((sum, n) => sum + n, 0) / filteredArr.length
    : 0;
};

export const calculateMonthlyAverageAttendanceManyCgs = (
  groups: PersonAttendance[][],
) => {
  const monthlyAverages = groups.map((g) =>
    calculateMonthlyAverageCgAttendance(g),
  );
  return barChartMonths()
    .map((_, index) => monthlyAverages.map((a) => a[index]))
    .map((m) => average(m));
};

export const getQuarterRangeLabel = (monthIndex: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const quarterStart = Math.floor(monthIndex / 3) * 3;
  const quarterEnd = quarterStart + 2;

  return `${months[quarterStart]} - ${months[quarterEnd]}`;
};
