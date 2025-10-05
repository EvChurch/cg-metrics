export type Person = {
  id: number;
  name: string;
  profile: string;
  phoneNumber: string;
  isLeader: boolean;
};

export type AttendanceEntry = {
  didAttend: boolean;
  date: Date;
};

export type PersonAttendance = {
  person: Person;
  cgAttendance: AttendanceEntry[];
  churchAttendance: AttendanceEntry[];
  cgDropOff: number;
  churchDropOff: number;
};

export type Group = {
  members: PersonAttendance[];
};
