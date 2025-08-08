import type { Node } from "reactflow";
import type { ConnectionStatus } from "../hooks/usePeopleFlowData";

// Create nodes from connection status data
export const createNodesFromStatuses = (
  statuses: Record<string, ConnectionStatus>
): Node[] => {
  // Filter out test statuses
  const filteredStatuses: Record<string, ConnectionStatus> = {};

  Object.entries(statuses).forEach(([statusId, status]) => {
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
      },
    };
  });
};
