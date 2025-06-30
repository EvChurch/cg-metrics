import dagre from "dagre";
import type { Node, Edge } from "reactflow";

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
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 25, ranksep: 30 });

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
