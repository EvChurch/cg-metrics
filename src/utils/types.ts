export interface Person {
  id: number;
  name: string;
  profile: string;
  phoneNumber?: string | null;
  birthDate?: string | null;
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

export interface GroupDetails {
  name: string;
  leaders: string[];
  healthy: boolean;
}

export interface Group {
  members: PersonAttendance[];
  groupDetails: GroupDetails;
}
