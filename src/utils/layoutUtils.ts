import dagre from "dagre";
import type { Node, Edge } from "reactflow";

// Store previous node positions to detect new vs existing nodes
const previousNodePositions = new Map<string, { x: number; y: number }>();

// Store actual node dimensions
const actualNodeDimensions = new Map<
  string,
  { width: number; height: number }
>();

// Callback to notify when dimensions change
let onDimensionsChange: ((nodeId: string) => void) | null = null;

// Function to set the callback
export const setDimensionsChangeCallback = (
  callback: ((nodeId: string) => void) | null
) => {
  onDimensionsChange = callback;
};

// Function to update actual node dimensions
export const updateNodeDimensions = (
  nodeId: string,
  width: number,
  height: number
) => {
  const existing = actualNodeDimensions.get(nodeId);
  if (!existing || existing.width !== width || existing.height !== height) {
    actualNodeDimensions.set(nodeId, { width, height });
    // Notify that dimensions have changed for this specific node
    if (onDimensionsChange) {
      onDimensionsChange(nodeId);
    }
  }
};

// Function to get children of a specific node
const getChildrenOfNode = (nodeId: string, edges: Edge[]): string[] => {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);
};

// Function to get all descendants of a node (children, grandchildren, etc.)
const getAllDescendants = (nodeId: string, edges: Edge[]): string[] => {
  const descendants = new Set<string>();

  const addDescendants = (parentId: string) => {
    const children = getChildrenOfNode(parentId, edges);
    children.forEach((childId) => {
      if (!descendants.has(childId)) {
        descendants.add(childId);
        addDescendants(childId);
      }
    });
  };

  addDescendants(nodeId);
  return Array.from(descendants);
};

// Function to reposition children of a specific parent node
export const repositionChildrenOfNode = (
  parentNodeId: string,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  const parentNode = nodes.find((node) => node.id === parentNodeId);
  if (!parentNode) return nodes;

  // Get the actual dimensions of the parent node, or use defaults if not available
  const parentDimensions = actualNodeDimensions.get(parentNodeId);
  const parentHeight = parentDimensions?.height || 150; // Default height if not measured yet

  // Get all descendants of this parent
  const descendantIds = getAllDescendants(parentNodeId, edges);

  // Calculate the new Y position for the first level children
  const parentBottom = parentNode.position.y + parentHeight;
  const spacing = 50; // Vertical spacing between levels

  // Create a map of node levels relative to the parent
  const nodeLevels = new Map<string, number>();
  nodeLevels.set(parentNodeId, 0);

  // Calculate levels for all descendants
  const calculateLevels = (currentNodeId: string, level: number) => {
    const children = getChildrenOfNode(currentNodeId, edges);
    children.forEach((childId) => {
      if (descendantIds.includes(childId)) {
        nodeLevels.set(childId, level + 1);
        calculateLevels(childId, level + 1);
      }
    });
  };
  calculateLevels(parentNodeId, 0);

  // Update positions for descendants
  const updatedNodes = nodes.map((node) => {
    if (descendantIds.includes(node.id)) {
      const level = nodeLevels.get(node.id) || 0;
      const newY = parentBottom + spacing + level * spacing;

      return {
        ...node,
        position: { ...node.position, y: newY },
        positionAbsolute: { ...node.position, y: newY },
      };
    }
    return node;
  });

  return updatedNodes;
};

// Simple initial layout function for first-time positioning
export const getInitialLayout = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 15, ranksep: 50 });

  // Set default node dimensions for initial layout
  nodes.forEach((node) => {
    // Check if this is a locale node and use appropriate dimensions
    const nodeData = node.data as { position?: { GroupTypeId?: number } };
    const isLocaleNode = nodeData?.position?.GroupTypeId === 39;

    if (isLocaleNode) {
      dagreGraph.setNode(node.id, { width: 550, height: 200 });
    } else {
      dagreGraph.setNode(node.id, { width: 180, height: 150 });
    }
  });

  // Set edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const x = nodeWithPosition.x - nodeWithPosition.width / 2;
    const y = nodeWithPosition.y - nodeWithPosition.height / 2;

    return {
      ...node,
      position: { x, y },
      positionAbsolute: { x, y },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Dagre layout function for automatic node positioning
export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 15, ranksep: 50 }); // Increased ranksep for better spacing

  // Set node dimensions - use actual dimensions if available, otherwise use defaults
  nodes.forEach((node) => {
    const actualDimensions = actualNodeDimensions.get(node.id);
    const width = actualDimensions?.width || 180;
    const height = actualDimensions?.height || 150;
    dagreGraph.setNode(node.id, { width, height });
  });

  // Set edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Find the bottommost position and X position of existing locale nodes
  let bottommostExistingY = -Infinity;
  let existingLocaleX = 0;
  let existingLocaleCount = 0;

  nodes.forEach((node) => {
    if (previousNodePositions.has(node.id)) {
      const prevPos = previousNodePositions.get(node.id)!;
      bottommostExistingY = Math.max(bottommostExistingY, prevPos.y);

      // Check if this is a locale node (GroupTypeId 39)
      const nodeData = node.data as { position?: { GroupTypeId?: number } };
      if (nodeData?.position?.GroupTypeId === 39) {
        existingLocaleX += prevPos.x;
        existingLocaleCount++;
      }
    }
  });

  // Calculate average X position of existing locale nodes
  if (existingLocaleCount > 0) {
    existingLocaleX = existingLocaleX / existingLocaleCount;
  }

  // Calculate offset for new locale nodes
  let localeXOffset = 0;
  let localeYOffset = 0;

  // Find the first new locale node to calculate the offset
  const newLocaleNode = nodes.find((node) => {
    const isNewNode = !previousNodePositions.has(node.id);
    const nodeData = node.data as { position?: { GroupTypeId?: number } };
    const isLocaleNode = nodeData?.position?.GroupTypeId === 39;
    return isNewNode && isLocaleNode;
  });

  if (newLocaleNode && existingLocaleCount > 0) {
    const nodeWithPosition = dagreGraph.node(newLocaleNode.id);
    const originalX = nodeWithPosition.x - nodeWithPosition.width / 2;
    const originalY = nodeWithPosition.y - nodeWithPosition.height / 2;

    localeXOffset = existingLocaleX - originalX;
    localeYOffset =
      (bottommostExistingY > -Infinity
        ? bottommostExistingY + 500
        : originalY) - originalY;
  }

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isNewNode = !previousNodePositions.has(node.id);

    // Check if this is a locale node (GroupTypeId 39)
    const nodeData = node.data as { position?: { GroupTypeId?: number } };
    const isLocaleNode = nodeData?.position?.GroupTypeId === 39;

    let x = nodeWithPosition.x - nodeWithPosition.width / 2;
    let y = nodeWithPosition.y - nodeWithPosition.height / 2;

    // Apply positioning
    if (isNewNode && isLocaleNode && existingLocaleCount > 0) {
      // Position new locale nodes below existing charts
      x = existingLocaleX;
      y = bottommostExistingY > -Infinity ? bottommostExistingY + 500 : y;
    } else if (isNewNode && !isLocaleNode) {
      // For new child nodes, apply the same offset as their locale node
      x += localeXOffset;
      y += localeYOffset;
    } else if (!isNewNode) {
      // For existing nodes, keep their current positions
      const prevPos = previousNodePositions.get(node.id)!;
      x = prevPos.x;
      y = prevPos.y;
    }

    return {
      ...node,
      position: { x, y },
      positionAbsolute: { x, y },
    };
  });

  // Update previous node positions
  previousNodePositions.clear();
  layoutedNodes.forEach((node) => {
    previousNodePositions.set(node.id, node.position);
  });

  return { nodes: layoutedNodes, edges };
};
