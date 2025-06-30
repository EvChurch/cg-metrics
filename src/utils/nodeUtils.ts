import type { Node, Edge } from "reactflow";
import type { Group, Person } from "../hooks/useOrgChartData";

// Group type ID constants
export const GROUP_TYPE_IDS = {
  SERVING_TEAM: 23,
  AREA: 40,
  LOCALE: 39,
} as const;

// Filter out test groups from Area and Serving Team types
export const filterTestGroups = (groups: Group[]): Group[] => {
  return groups.filter((group) => {
    // Exclude Area and Serving Team groups with "Test" in the name
    if (
      (group.GroupTypeId === GROUP_TYPE_IDS.AREA ||
        group.GroupTypeId === GROUP_TYPE_IDS.SERVING_TEAM) &&
      group.Name.toUpperCase().includes("TEST")
    ) {
      return false;
    }

    return true;
  });
};

// New filtering function that handles specific combinations
export const filterGroupsByCategoriesAndLocations = (
  groups: Group[],
  combinations: string[]
): Group[] => {
  // First filter out test groups
  const filteredGroups = filterTestGroups(groups);

  // If no combinations selected, return empty array
  if (combinations.length === 0) {
    return [];
  }

  // Create a set of group IDs that belong to the selected hierarchies
  const selectedHierarchyIds = new Set<number>();

  // Helper function to check if a group name matches any of the selected combinations
  const matchesFilter = (groupName: string): boolean => {
    const upperName = groupName.toUpperCase();

    return combinations.some((combination) => {
      const combinationUpper = combination.toUpperCase();

      // Handle "M SUP" specially - check for exact pattern match
      if (combinationUpper.includes("M SUP")) {
        // Check for exact pattern: LOCATION M SUP
        const expectedPattern = combinationUpper;
        return (
          upperName === expectedPattern || upperName === `~${expectedPattern}`
        );
      }

      // For other combinations, check for exact pattern
      return (
        upperName === combinationUpper || upperName === `~${combinationUpper}`
      );
    });
  };

  // Find all groups that match the filter criteria (not just locale groups)
  const matchingGroups = filteredGroups.filter((group) =>
    matchesFilter(group.Name)
  );

  if (matchingGroups.length === 0) {
    return [];
  }

  // Add all matching groups themselves
  matchingGroups.forEach((group) => {
    selectedHierarchyIds.add(group.Id);
  });

  // Recursive function to add all children
  const addChildren = (parentId: number) => {
    filteredGroups.forEach((group) => {
      if (group.ParentGroupId === parentId) {
        selectedHierarchyIds.add(group.Id);
        addChildren(group.Id);
      }
    });
  };

  // Start from all matching groups
  matchingGroups.forEach((group) => {
    addChildren(group.Id);
  });

  // Filter groups to only include those in the selected hierarchies
  return filteredGroups.filter((group) => selectedHierarchyIds.has(group.Id));
};

// Get node type based on group type ID
export const getNodeType = (groupTypeId: number): string => {
  switch (groupTypeId) {
    case GROUP_TYPE_IDS.LOCALE:
      return "localeNode";
    case GROUP_TYPE_IDS.AREA:
      return "areaNode";
    case GROUP_TYPE_IDS.SERVING_TEAM:
      return "teamNode";
    default:
      return "teamNode";
  }
};

// Get people for a specific group
export const getPeopleForGroup = (group: Group): Person[] => {
  // People are accessed through group members, not directly
  return group.Members.map((member) => member.Person).filter(
    Boolean
  ) as Person[];
};

// Create nodes from groups data
export const createNodesFromGroups = (
  groups: Group[],
  combinations: string[]
): Node[] => {
  const filteredGroups = filterGroupsByCategoriesAndLocations(
    groups,
    combinations
  );

  return filteredGroups.map((group) => {
    const nodeType = getNodeType(group.GroupTypeId);
    const nodeId = `group-${group.Id}`;

    return {
      id: nodeId,
      type: nodeType,
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: {
        label: group.Name,
        position: group,
        people: getPeopleForGroup(group),
        level: group.ParentGroupId,
      },
    };
  });
};

// Create edges from groups data
export const createEdgesFromGroups = (
  groups: Group[],
  combinations: string[]
): Edge[] => {
  const filteredGroups = filterGroupsByCategoriesAndLocations(
    groups,
    combinations
  );

  const edges: Edge[] = [];

  filteredGroups.forEach((group) => {
    if (group.ParentGroupId) {
      const sourceId = `group-${group.ParentGroupId}`;
      const targetId = `group-${group.Id}`;

      // Check if both parent and child nodes exist in filtered groups
      const parentExists = filteredGroups.some(
        (g) => g.Id === group.ParentGroupId
      );
      const childExists = filteredGroups.some((g) => g.Id === group.Id);

      if (parentExists && childExists) {
        const edge: Edge = {
          id: `edge-${group.ParentGroupId}-${group.Id}`,
          source: sourceId,
          target: targetId,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#E5E5E5", strokeWidth: 2 },
        };
        edges.push(edge);
      }
    }
  });

  return edges;
};
