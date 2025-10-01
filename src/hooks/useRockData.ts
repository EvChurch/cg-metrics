import { useEffect, useState } from "react";
import { z } from "zod";

const countDropOff = (attendance: boolean[]) => {
  let count = 0;
  for (let i = attendance.length - 1; i >= 0; i--) {
    if (!attendance[i]) {
      count++;
    } else {
      break;
    }
  }
  return count;
};

const personSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile: z.string(),
  mobile: z.string(),
});

const personAttendanceSchema = z
  .object({
    person: personSchema,
    cgAttendance: z.array(z.boolean()),
    churchAttendance: z.array(z.boolean()),
  })
  .transform((data) => ({
    ...data,
    cgDropOff: countDropOff(data.cgAttendance),
    churchDropOff: countDropOff(data.churchAttendance),
  }));

const groupSchema = z.object({
  leaders: z.array(personSchema).optional(),
  members: z.array(personAttendanceSchema),
});

const rockDataSchema = z.array(groupSchema);

export type Person = z.infer<typeof personSchema>;
export type PersonAttendance = z.infer<typeof personAttendanceSchema>;
export type Group = z.infer<typeof groupSchema>;

type RockData = z.infer<typeof rockDataSchema>;

const messageEventDataSchema = z.object({
  target: z.literal("cg-metrics"),
  data: z.unknown(),
});

export function useRockData(): {
  data: RockData;
  isLoading: boolean;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<RockData>([]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        ![
          "https://rock.ev.church",
          "http://localhost:5173",
          "https://evchurch.github.io",
        ].includes(event.origin)
      )
        return;

      const result = messageEventDataSchema.safeParse(event.data);
      if (!result.success) return;

      try {
        const data = rockDataSchema.parse(result.data.data);
        setData(data);
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
