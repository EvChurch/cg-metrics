import { useQuery } from "@tanstack/react-query";

// Function to get initial groups data from script tag
function getInitialGroupsData() {
  const scriptTag = document.getElementById("initial-groups-data");
  if (!scriptTag || !scriptTag.textContent) {
    console.warn("Script tag 'initial-groups-data' not found or empty");
    return {};
  }

  try {
    return JSON.parse(scriptTag.textContent);
  } catch (e) {
    console.error("Failed to parse initial groups data", e);
    return {};
  }
}

// Types based on your data structure
export interface Person {
  id: number;
  fullName: string;
  connectionStatusValueId: number;
  primaryCampusId?: number;
}

export interface ConnectionStatus {
  name: string;
  description: string;
  people: Person[];
}

interface Survey {
  personId: string;
  formId: string;
}

interface TestData {
  surveys?: Survey[];
  groups?: Record<string, ConnectionStatus>;
  connectionStatuses?: Record<string, ConnectionStatus>;
}

interface PeopleFlowData {
  connectionStatuses: Record<string, ConnectionStatus>;
}

// Custom hook to fetch data from JSON file
export const usePeopleFlowData = () => {
  return useQuery({
    queryKey: ["peopleFlowData"],
    queryFn: async (): Promise<PeopleFlowData> => {
      try {
        // Toggle this flag to switch between dynamic data and test data
        const USE_DYNAMIC_DATA = false; // Set to false to use test data instead

        if (USE_DYNAMIC_DATA) {
          // Get data from script tag (dynamic data from database)
          const dynamicData = getInitialGroupsData();
          if (dynamicData && Object.keys(dynamicData).length > 0) {
            console.log(
              "Processing dynamic connection statuses:",
              Object.keys(dynamicData).length,
              "statuses"
            );
            return {
              connectionStatuses: dynamicData,
            };
          }
          console.warn("No dynamic data available, falling back to test data");
        }

        // Use test data from JSON file (either as fallback or primary)
        const response = await fetch("/test-data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TestData = await response.json();

        console.log("Using test data");

        // Handle new structure with groups or fallback to old structure
        const connectionStatuses = data.groups || data.connectionStatuses || {};

        return {
          connectionStatuses,
        };
      } catch (error) {
        console.error("Failed to fetch people flow data:", error);
        return { connectionStatuses: {} };
      }
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};
