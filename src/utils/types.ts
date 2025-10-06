export interface Person {
  id: number;
  name: string;
  profile: string;
  phoneNumber: string;
  isLeader: boolean;
}

export interface AttendanceEntry {
  didAttend: boolean;
  date: Date;
}

export interface PersonAttendance {
  person: Person;
  cgAttendance: AttendanceEntry[];
  churchAttendance: AttendanceEntry[];
  cgDropOff: number;
  churchDropOff: number;
}

export interface Group {
  members: PersonAttendance[];
}
