import { useEffect, useState } from "react";
import { z } from "zod";

// import testData from "../../public/test-data.json";
import { countDropOff } from "../utils/attendanceStats";
import type { Group } from "../utils/types";

const buildAttendanceData = (
  attendance: z.infer<typeof attendanceSchema>[],
  personId: number,
) => {
  return attendance
    .filter((att) => att.personId === personId)
    .map((att) => ({
      didAttend: att.didAttend,
      date: new Date(att.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const buildGroupData = (rockGroup: z.infer<typeof groupSchema>): Group => {
  return {
    groupDetails: {
      id: rockGroup.groupId,
      name: rockGroup.groupName ?? "",
      healthy: rockGroup.healthy,
      leaders: rockGroup.members.filter((m) => m.isLeader).map((m) => m.name),
      isCoach: rockGroup.isCoach,
    },
    members: rockGroup.members.map((member) => {
      const cgAttendance = buildAttendanceData(
        rockGroup.cgAttendance,
        member.personId,
      );
      const churchAttendance = buildAttendanceData(
        rockGroup.churchAttendance,
        member.personId,
      );
      return {
        person: {
          id: member.personId,
          name: member.name,
          profile: member.profile,
          phoneNumber: member.phone,
          birthDate: member.birthDate,
          isLeader: member.isLeader,
        },
        cgAttendance,
        churchAttendance,
        cgDropOff: countDropOff(cgAttendance),
        churchDropOff: countDropOff(churchAttendance),
      };
    }),
  };
};

const personSchema = z.object({
  personId: z.number(),
  name: z.string(),
  profile: z.string(),
  phone: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  isLeader: z.boolean(),
});

const attendanceSchema = z.object({
  personId: z.number(),
  didAttend: z.boolean(),
  date: z.string(),
});

const groupSchema = z.object({
  members: z.array(personSchema),
  cgAttendance: z.array(attendanceSchema),
  churchAttendance: z.array(attendanceSchema),
  groupId: z.number(),
  healthy: z.boolean(),
  groupName: z.string().nullable().optional(),
  isCoach: z.boolean(),
});

const rockDataSchema = z.array(groupSchema);

export type Person = z.infer<typeof personSchema>;

const messageEventDataSchema = z.object({
  target: z.literal("cg-metrics"),
  data: z.unknown(),
});

export function useRockData(): {
  data: Group[];
  isLoading: boolean;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<Group[]>([]);

  useEffect(() => {
    // console.log(testData);
    // const data = rockDataSchema.parse(testData);
    // setData(data.map((group) => buildGroupData(group)));
    // console.log(data.map((group) => buildGroupData(group)));
    // setIsLoading(false);
    function onMessage(event: MessageEvent) {
      if (
        ![
          "https://www.ev.church",
          "http://localhost:5173",
          "https://evchurch.github.io",
        ].includes(event.origin)
      )
        return;

      const result = messageEventDataSchema.safeParse(event.data);
      if (!result.success) return;

      try {
        console.log("result: ", result.data.data);
        const data = rockDataSchema.parse(result.data.data);
        setData(data.map((group) => buildGroupData(group)));
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Failed to parse rock data"));
        }
        setIsLoading(false);
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
