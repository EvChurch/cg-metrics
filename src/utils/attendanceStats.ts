import type { AttendanceEntry } from "./types";

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
  month: number
) => {
  const cgMonthAttendance = attendance.filter(
    (att) => att.date.getMonth() === month
  );

  return (
    (cgMonthAttendance.filter((att) => att.didAttend).length /
      cgMonthAttendance.length) *
    100
  );
};

export const getAttendanceYearAverage = (attendance: AttendanceEntry[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const cgYearAttendance = attendance.filter(
    (att) => att.date.getFullYear() === currentYear
  );
  return (
    (cgYearAttendance.filter((att) => att.didAttend).length /
      cgYearAttendance.length) *
    100
  );
};
