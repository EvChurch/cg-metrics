export interface Person {
  id: number;
  name: string;
  profile: string;
  mobile: string;
}

export interface PersonAttendance {
  person: Person;
  cgAttendance: boolean[];
  churchAttendance: boolean[];
}

export interface PersonDropOff {
  person: Person;
  churchDropOff: number;
  cgDropOff: number;
}

export interface Group {
  leaders: Person[];
  members: PersonAttendance[];
}
