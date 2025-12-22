import { useEffect, useState } from "react";
import { z } from "zod";

// import testData from "../../public/test-data.json";
import { countDropOff } from "../utils/attendanceStats";
import type { Group } from "../utils/types";

const buildAttendanceData = (
  attendance: z.infer<typeof attendanceSchema>[],
  personId: number
) => {
  return attendance
    .filter((att) => att.PersonId === personId)
    .map((att) => ({
      didAttend: att.DidAttend,
      date: new Date(att.Date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const buildGroupData = (rockGroup: z.infer<typeof groupSchema>): Group => {
  return {
    groupDetails: {
      name: rockGroup.groupName ?? "",
      healthy: rockGroup.healthy,
      leaders: rockGroup.members.filter((m) => m.IsLeader).map((m) => m.Name),
    },
    members: rockGroup.members.map((member) => {
      const cgAttendance = buildAttendanceData(
        rockGroup.cgAttendance,
        member.Id
      );
      const churchAttendance = buildAttendanceData(
        rockGroup.churchAttendance,
        member.Id
      );
      return {
        person: {
          id: member.Id,
          name: member.Name,
          profile: member.Profile,
          phoneNumber: member.PhoneNumber,
          birthDate: member.BirthDate,
          isLeader: Boolean(member.IsLeader),
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
  Id: z.number(),
  Name: z.string(),
  Profile: z.string(),
  PhoneNumber: z.string().nullable().optional(),
  BirthDate: z.string().nullable().optional(),
  IsLeader: z.number(),
});

const attendanceSchema = z.object({
  PersonId: z.number(),
  DidAttend: z.boolean(),
  Date: z.string(),
});

const groupSchema = z.object({
  members: z.array(personSchema),
  cgAttendance: z.array(attendanceSchema),
  churchAttendance: z.array(attendanceSchema),
  healthy: z.boolean(),
  groupName: z.string().nullable().optional(),
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
