import type { Node } from "reactflow";
import type { ConnectionStatus, Survey } from "../hooks/usePeopleFlowData";

// Create nodes from connection status data
export const createNodesFromStatuses = (
  statuses: Record<string, ConnectionStatus>,
  surveys: Survey[] = []
): Node[] => {
  // Filter out test statuses
  const filteredStatuses: Record<string, ConnectionStatus> = {};

  Object.entries(statuses).forEach(([statusId, status]) => {
    // Check if this is actually a ConnectionStatus object with a name property
    if (
      !status ||
      typeof status !== "object" ||
      !("name" in status) ||
      typeof status.name !== "string"
    ) {
      console.warn(
        `Skipping invalid status object for statusId ${statusId}:`,
        status
      );
      return; // Skip if not a valid ConnectionStatus object
    }

    if (
      status.name.toUpperCase().includes("TEST") ||
      status.name === "Prospect" ||
      status.name === "Community"
    ) {
      return; // Skip this status
    }
    filteredStatuses[statusId] = status;
  });

  return Object.entries(filteredStatuses).map(([statusId, status]) => {
    return {
      id: statusId,
      type: "teamNode",
      position: { x: 0, y: 0 }, // Position will be set by custom layout
      data: {
        label: status.name,
        description: status.description,
        people: status.people || [],
        surveys: surveys,
      },
    };
  });
};
