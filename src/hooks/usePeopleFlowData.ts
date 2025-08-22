import { useEffect, useMemo, useState } from "react";
import z from "zod";

const personSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  connectionStatusValueId: z.number(),
  primaryCampusId: z.number().optional().nullable(),
  isServing: z.boolean().optional(),
  cgGroup: z.string().optional(),
});

const surveySchema = z.object({
  personId: z.string(),
  formId: z.string(),
});

const connectionStatusSchema = z.object({
  name: z.string(),
  description: z.string(),
  people: z.array(personSchema),
});

const peopleFlowDataSchema = z
  .object({
    groups: z.record(z.string(), connectionStatusSchema),
    surveys: z.array(surveySchema).optional(),
  })
  .transform((data) => ({
    connectionStatuses: data.groups,
    surveys: data.surveys ?? [],
  }));

export type Person = z.infer<typeof personSchema>;
export type Survey = z.infer<typeof surveySchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
type PeopleFlowData = z.infer<typeof peopleFlowDataSchema>;

const messageEventDataSchema = z.object({
  target: z.literal("ev-pathways"),
  data: z.unknown(),
});

export function usePeopleFlowData(campusFilter?: string | null): {
  data: PeopleFlowData;
  isLoading: boolean;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [{ connectionStatuses, surveys }, setData] = useState<PeopleFlowData>({
    connectionStatuses: {},
    surveys: [],
  });
  const filteredData = useMemo(() => {
    let filteredConnectionStatuses = connectionStatuses;
    if (campusFilter != null) {
      filteredConnectionStatuses = Object.fromEntries(
        Object.entries(connectionStatuses).map(([key, status]) => [
          key,
          {
            ...status,
            people: status.people.filter(
              (person) => person.primaryCampusId?.toString() === campusFilter
            ),
          },
        ])
      );
    }
    return {
      connectionStatuses: filteredConnectionStatuses,
      surveys,
    };
  }, [connectionStatuses, surveys, campusFilter]);

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
        const data = peopleFlowDataSchema.parse(result.data.data);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Failed to parse people flow data"));
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
    data: filteredData,
    isLoading,
    error,
  };
}
