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
