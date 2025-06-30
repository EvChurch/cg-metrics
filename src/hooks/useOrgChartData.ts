import { useQuery } from "@tanstack/react-query";

// Types based on your data structure
export interface Person {
  Id?: number;
  NickName?: string;
  LastName?: string;
  FullName?: string;
  Email?: string;
  Phone?: string | null;
  Gender?: number;
}

export interface GroupRole {
  Id: number;
  Name: string;
  IsLeader: boolean;
}

export interface GroupMember {
  Id: number;
  PersonId?: number;
  GroupRoleId?: number;
  GroupRole?: GroupRole;
  GroupMemberStatus?: number;
  HoursServing?: number;
  Role?: string;
  Person: Person;
}

export interface Group {
  Id: number;
  Name: string;
  ParentGroupId: number | null;
  GroupTypeId: number;
  GroupType?: string;
  GroupTypeName?: string;
  isOrgGroup?: boolean;
  Members: GroupMember[];
}

interface OrgChartData {
  people: Person[];
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

// Custom hook to fetch data from JSON file
export const useOrgChartData = () => {
  return useQuery({
    queryKey: ["orgChartData"],
    queryFn: async (): Promise<OrgChartData> => {
      try {
        const response = await fetch("/test-data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Handle the new {groups: [existing data]} structure
        if (data.groups && Array.isArray(data.groups)) {
          const normalizedGroups = normalizeGroupTypeId(data.groups);
          return {
            people: data.people || [],
            groups: normalizedGroups,
          };
        } else if (data.people && data.groups) {
          // Legacy format
          const normalizedGroups = normalizeGroupTypeId(data.groups);
          return {
            people: data.people || [],
            groups: normalizedGroups || [],
          };
        } else if (data.Id && data.Name) {
          // Single group object format
          const normalizedGroups = normalizeGroupTypeId([data]);
          return {
            people: [],
            groups: normalizedGroups,
          };
        } else {
          console.warn("Unexpected data structure:", data);
          return { people: [], groups: [] };
        }
      } catch (error) {
        console.error("Failed to fetch org chart data:", error);
        return { people: [], groups: [] };
      }
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};
