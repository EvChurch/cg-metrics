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

// Custom layout function - you can modify this to create your desired layout
export const getCustomLayout = (nodes: Node[], edges: Edge[]) => {
  // Create static nodes
  const staticNodes: Node[] = [
    {
      id: "step-1",
      type: "staticNode",
      position: { x: 0, y: 0 },
      data: {
        label: "Awareness",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-2",
      type: "staticNode",
      position: { x: 500, y: 0 },
      data: {
        label: "1st Contact",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-3",
      type: "staticNode",
      position: { x: 1200, y: 400 },
      data: {
        label: "Integration",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-4",
      type: "staticNode",
      position: { x: 1700, y: 400 },
      data: {
        label: "Church Life",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-5",
      type: "staticNode",
      position: { x: 2100, y: 400 },
      data: {
        label: "Serving",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-6",
      type: "staticNode",
      position: { x: 2500, y: 400 },
      data: {
        label: "Sending",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-2-mis",
      type: "staticNode",
      position: { x: 1200, y: -400 },
      data: {
        label: "Conversion",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "step-3-mis",
      type: "staticNode",
      position: { x: 1700, y: -400 },
      data: {
        label: "Follow Up",
        description: "Description",
        isStatic: true,
      },
    },
  ];

  // Layout the data-driven nodes
  const layoutedNodes = nodes.map((node, index) => {
    console.log(node);

    switch (node.data.label) {
      case "Supporter":
        return {
          ...node,
          position: { x: 0, y: 300 },
        };
      case "Fringe":
        return {
          ...node,
          position: { x: 150, y: -600 },
        };
      case "Visiting":
        return {
          ...node,
          position: { x: 500, y: 200 },
        };
      case "Joining":
        return {
          ...node,
          position: { x: 1200, y: 0 },
        };
      case "Attending":
        return {
          ...node,
          position: { x: 1450, y: 600 },
        };
      case "Growing":
        return {
          ...node,
          position: { x: 1900, y: 600 },
        };
      case "Investigating":
        return {
          ...node,
          position: { x: 800, y: -600 },
        };
      case "Establishing (in faith)":
        return {
          ...node,
          position: { x: 1500, y: -600 },
        };
      default:
        return {
          ...node,
          position: { x: index * 400 + 100, y: (index % 2) * 200 + 100 },
        };
    }
  });

  // Combine static and data-driven nodes
  const allNodes = [...staticNodes, ...layoutedNodes];

  return { nodes: allNodes, edges };
};

// Keep the old function name for compatibility
export const getInitialLayout = getCustomLayout;
