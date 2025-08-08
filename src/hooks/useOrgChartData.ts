import { useQuery } from "@tanstack/react-query";

// Function to get initial groups data from script tag
function getInitialGroupsData() {
  const scriptTag = document.getElementById("initial-groups-data");
  if (!scriptTag || !scriptTag.textContent) return { groups: [] };

  try {
    return JSON.parse(scriptTag.textContent);
  } catch (e) {
    console.error("Failed to parse initial groups data", e);
    return { groups: [] };
  }
}

// Types based on your data structure
export interface Person {
  id: number;
  fullName: string;
  connectionStatusValueId: number;
  primaryCampusId: number;
}

export interface ConnectionStatus {
  name: string;
  description: string;
  people: Person[];
}

export interface Group {
  Id: number;
  name: string;
  description?: string;
  people: Person[];
  GroupTypeId?: number;
}

interface OrgChartData {
  groups: Group[];
}

// Function to transform connection status data to groups format
const transformConnectionStatusToGroups = (
  data: Record<string, ConnectionStatus>
): Group[] => {
  return Object.entries(data).map(([statusId, status]) => ({
    Id: parseInt(statusId),
    name: status.name,
    description: status.description,
    people: status.people,
    GroupTypeId: 23, // SERVING_TEAM
  }));
};

// Function to process groups for the new data structure
const processGroups = (groups: Group[]): Group[] => {
  return groups.map((group) => ({
    ...group,
    // Ensure all groups are treated as team nodes
    GroupTypeId: 23, // SERVING_TEAM
  }));
};

// Custom hook to fetch data from JSON file
export const useOrgChartData = () => {
  return useQuery({
    queryKey: ["orgChartData"],
    queryFn: async (): Promise<OrgChartData> => {
      try {
        // Toggle this flag to switch between dynamic data and test data
        const USE_DYNAMIC_DATA = false; // Set to false to use test data instead

        if (USE_DYNAMIC_DATA) {
          // Get data from script tag (dynamic data from database)
          const dynamicData = getInitialGroupsData();
          if (dynamicData.groups && dynamicData.groups.length > 0) {
            const processedGroups = processGroups(dynamicData.groups);
            return {
              groups: processedGroups,
            };
          }
          console.warn("No dynamic data available");
          return { groups: [] };
        } else {
          // Use test data from JSON file
          const response = await fetch("/test-data.json");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          console.log("Using test data");

          // Handle the new connection status structure
          if (typeof data === "object" && !data.groups) {
            // Transform connection status data to groups format
            const groups = transformConnectionStatusToGroups(data);
            console.log(
              "Transformed connection status data to groups:",
              groups
            );
            const processedGroups = processGroups(groups);
            return {
              groups: processedGroups,
            };
          }

          // Handle the current {groups: [existing data]} structure
          if (data.groups && Array.isArray(data.groups)) {
            const processedGroups = processGroups(data.groups);
            return {
              groups: processedGroups,
            };
          } else {
            console.warn("Unexpected data structure:", data);
            return { groups: [] };
          }
        }
      } catch (error) {
        console.error("Failed to fetch org chart data:", error);
        return { groups: [] };
      }
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};
