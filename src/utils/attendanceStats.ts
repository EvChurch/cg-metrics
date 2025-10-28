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

export const getCgMonthAverage = (
  cgAttendance: AttendanceEntry[],
  month: number,
  year: number
) => {
  const cgMonthAttendance = cgAttendance.filter(
    (att) => att.date.getMonth() === month && att.date.getFullYear() === year
  );

  console.log(month, cgMonthAttendance);

  return (
    (cgMonthAttendance.filter((att) => att.didAttend).length /
      cgMonthAttendance.length) *
    100
  );
};

export const getCgYearAverage = (cgAttendance: AttendanceEntry[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const cgYearAttendance = cgAttendance.filter(
    (att) => att.date.getFullYear() === currentYear
  );
  return (
    (cgYearAttendance.filter((att) => att.didAttend).length /
      cgYearAttendance.length) *
    100
  );
};

export const getChurchMonthAverage = (
  churchAttendance: AttendanceEntry[],
  month: number,
  year: number
) => {
  const churchMonthAttendance = churchAttendance.filter(
    (att) => att.date.getMonth() === month && att.date.getFullYear() === year
  );

  return (
    (churchMonthAttendance.filter((att) => att.didAttend).length /
      churchMonthAttendance.length) *
    100
  );
};

export const getChurchYearAverage = (churchAttendance: AttendanceEntry[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const churchYearAttendance = churchAttendance.filter(
    (att) => att.date.getFullYear() === currentYear
  );

  return (
    (churchYearAttendance.filter((att) => att.didAttend).length /
      churchYearAttendance.length) *
    100
  );
};
