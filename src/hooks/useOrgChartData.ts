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
  FullName?: string;
  Email?: string;
  Phone?: string | null;
  Gender?: number;
}

export interface GroupMember {
  Id: number;
  Role?: string;
  Person: Person;
}

export interface Group {
  Id: number;
  Name: string;
  ParentGroupId: number | null;
  GroupTypeId: number;
  Members: GroupMember[];
}

interface OrgChartData {
  groups: Group[];
}

// Function to normalize GroupTypeId for MAG groups and their area children
const normalizeGroupTypeId = (groups: Group[]): Group[] => {
  // First pass: identify all MAG locale groups and build a map of their IDs
  const magLocaleIds = new Set<number>();

  groups.forEach((group) => {
    const name = group.Name.toUpperCase();
    const magPattern = /^(~?)(CT|NS|UC|HQ)\s+MAG$/;
    if (magPattern.test(name)) {
      magLocaleIds.add(group.Id);
    }
  });

  // Second pass: normalize groups based on the complete MAG locale ID set
  return groups.map((group) => {
    const name = group.Name.toUpperCase();

    // Check if group name matches the pattern: [Location] MAG
    const magPattern = /^(~?)(CT|NS|UC|HQ)\s+MAG$/;

    if (magPattern.test(name)) {
      // Normalize MAG groups to locale group (GroupTypeId 39)
      return {
        ...group,
        GroupTypeId: 39,
      };
    }

    // Check if this is an area group that's a child of a MAG locale group
    const isAreaName =
      name === "CENTRAL" || name === "NORTH" || name === "UNICHURCH";
    if (
      isAreaName &&
      group.ParentGroupId &&
      magLocaleIds.has(group.ParentGroupId)
    ) {
      // Normalize area groups to Area (GroupTypeId 40)
      return {
        ...group,
        GroupTypeId: 40,
      };
    }

    return group;
  });
};

// Function to filter out "Member" role people from Area and Locale groups
const filterMemberRoles = (groups: Group[]): Group[] => {
  return groups.map((group) => {
    // Filter out "Member" role for Area (GroupTypeId 40) and Locale (GroupTypeId 39) groups
    if (group.GroupTypeId === 40 || group.GroupTypeId === 39) {
      return {
        ...group,
        Members: group.Members.filter((member) => member.Role !== "Member"),
      };
    }
    return group;
  });
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
            const normalizedGroups = normalizeGroupTypeId(dynamicData.groups);
            const filteredGroups = filterMemberRoles(normalizedGroups);
            return {
              groups: filteredGroups,
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

          // Handle the current {groups: [existing data]} structure
          if (data.groups && Array.isArray(data.groups)) {
            const normalizedGroups = normalizeGroupTypeId(data.groups);
            const filteredGroups = filterMemberRoles(normalizedGroups);
            return {
              groups: filteredGroups,
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
