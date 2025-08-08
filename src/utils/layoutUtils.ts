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

// Simple initial layout function for flat node positioning
export const getInitialLayout = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 });

  // Set default node dimensions for initial layout
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 150 });
  });

  // Set edges (though we don't have any in flat layout)
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
