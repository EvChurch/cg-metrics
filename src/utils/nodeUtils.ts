import type { Node, Edge } from "reactflow";
import type { Group, Person } from "../hooks/usePeopleFlowData";

// Filter out test groups
export const filterTestGroups = (groups: Group[]): Group[] => {
  return groups.filter((group) => {
    if (
      group.name.toUpperCase().includes("TEST") ||
      group.name === "Prospect" ||
      group.name === "Community"
    ) {
      return false;
    }

    return true;
  });
};

// Simple filtering function for the new data structure
export const filterGroupsByCategoriesAndLocations = (
  groups: Group[],
  combinations: string[]
): Group[] => {
  // First filter out test groups
  const filteredGroups = filterTestGroups(groups);

  // If no combinations selected, return all groups
  if (combinations.length === 0) {
    return filteredGroups;
  }

  // For now, return all groups since the new data doesn't have hierarchical relationships
  return filteredGroups;
};

// Get people for a specific group
export const getPeopleForGroup = (group: Group): Person[] => {
  // People are accessed directly from the group
  return group.people || [];
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
    const nodeId = `group-${group.Id}`;

    return {
      id: nodeId,
      type: "teamNode",
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: {
        label: group.name,
        position: group,
        people: getPeopleForGroup(group),
        level: null,
        description: group.description || "",
      },
    };
  });
};

// Create edges from groups data
export const createEdgesFromGroups = (): Edge[] => {
  // Since the new data doesn't have hierarchical relationships, return empty edges
  return [];
};
