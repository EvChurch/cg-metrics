import { useEffect, useState } from "react";
import { z } from "zod";

const personSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile: z.string().optional(),
  mobile: z.string().optional(),
});

const personAttendanceSchema = z.object({
  person: personSchema,
  cgAttendance: z.array(z.boolean()),
  churchAttendance: z.array(z.boolean()),
});

const personDropOffSchema = z.object({
  person: personSchema,
  churchDropOff: z.number(),
  cgDropOff: z.number(),
});

const groupSchema = z.object({
  leaders: z.array(personSchema),
  members: z.array(personAttendanceSchema),
});

const cgMetricsDataSchema = z.array(groupSchema);

export type Person = z.infer<typeof personSchema>;
export type PersonAttendance = z.infer<typeof personAttendanceSchema>;
export type PersonDropOff = z.infer<typeof personDropOffSchema>;
export type Group = z.infer<typeof groupSchema>;
type CgMetricsData = z.infer<typeof cgMetricsDataSchema>;

const messageEventDataSchema = z.object({
  target: z.literal("cg-metrics"),
  data: z.unknown(),
});

export function useCgMetricsData(): {
  data: CgMetricsData;
  isLoading: boolean;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [cgMetricsData, setCgMetricsData] = useState<CgMetricsData>([]);

  // const filteredData = useMemo(() => {
  //   let filteredConnectionStatuses = connectionStatuses;
  //   if (campusFilter && campusFilter.length > 0) {
  //     filteredConnectionStatuses = Object.fromEntries(
  //       Object.entries(connectionStatuses).map(([key, status]) => [
  //         key,
  //         {
  //           ...status,
  //           people: status.people.filter((person) =>
  //             campusFilter.includes(person.primaryCampusId?.toString() ?? '')
  //           ),
  //         },
  //       ])
  //     );
  //   }
  //   return {
  //     connectionStatuses: filteredConnectionStatuses,
  //     surveys,
  //   };
  // }, [connectionStatuses, surveys, campusFilter]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        ![
          "https://rock.ev.church",
          "http://localhost:5173",
          "https://ev-pathways.netlify.app",
          "https://evchurch.github.io",
        ].includes(event.origin)
      )
        return;

      const result = messageEventDataSchema.safeParse(event.data);
      if (!result.success) {
        console.error("Invalid message event", event);
        return;
      }

      try {
        const data = cgMetricsDataSchema.parse(result.data.data);
        setCgMetricsData(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Failed to parse cg metrics data"));
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
    data: cgMetricsData,
    isLoading,
    error,
  };
}
