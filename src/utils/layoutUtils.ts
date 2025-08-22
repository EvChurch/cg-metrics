import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";

// Define the expected node data structure
interface NodeData {
  label: string;
  description?: string;
  isStatic?: boolean;
}

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
export const getCustomLayout = (nodes: Node<NodeData>[], edges: Edge[]) => {
  // Create static nodes
  const staticNodes: Node<NodeData>[] = [
    {
      id: "awareness",
      type: "staticNode",
      position: { x: 0, y: 0 },
      draggable: false,
      data: {
        label: "Awareness",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "firstContact",
      type: "staticNode",
      position: { x: 500, y: 0 },
      draggable: false,
      data: {
        label: "1st Contact",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "integration",
      type: "staticNode",
      position: { x: 1200, y: 400 },
      draggable: false,
      data: {
        label: "Integration",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "churchLife",
      type: "staticNode",
      position: { x: 1650, y: 400 },
      draggable: false,
      data: {
        label: "Church Life",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "growth",
      type: "staticNode",
      position: { x: 2150, y: 400 },
      draggable: false,
      data: {
        label: "Growth",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "serving",
      type: "staticNode",
      position: { x: 2550, y: 400 },
      draggable: false,
      data: {
        label: "Serving",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "sending",
      type: "staticNode",
      position: { x: 2900, y: 400 },
      draggable: false,
      data: {
        label: "Sending",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "conversion",
      type: "staticNode",
      position: { x: 1200, y: -400 },
      draggable: false,
      data: {
        label: "Conversion",
        description: "Description",
        isStatic: true,
      },
    },
    {
      id: "followUp",
      type: "staticNode",
      position: { x: 1700, y: -400 },
      draggable: false,
      data: {
        label: "Follow Up",
        description: "Description",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of 1st Contact to Conversion edge
    {
      id: "custom-position-1stContact-conversion",
      type: "staticNode",
      position: { x: 980, y: -200 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of Conversion to Follow Up edge
    {
      id: "custom-position-conversion-followUp",
      type: "staticNode",
      position: { x: 1550, y: -360 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of 1st Contact to Integration edge
    {
      id: "custom-position-1stContact-integration",
      type: "staticNode",
      position: { x: 920, y: 120 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of Follow Up to Integration edge
    {
      id: "custom-position-followUp-integration",
      type: "staticNode",
      position: { x: 1330, y: 270 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of 2nd Visit to Integration edge
    {
      id: "custom-position-2ndVisit-integration",
      type: "staticNode",
      position: { x: 1040, y: 360 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of Integration to Church Life edge
    {
      id: "custom-position-integration-churchLife",
      type: "staticNode",
      position: { x: 1550, y: 400 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
    // Custom position node for the midpoint of Church Life to Growth edge
    {
      id: "custom-position-churchLife-growth",
      type: "staticNode",
      position: { x: 2000, y: 400 },
      draggable: false,
      data: {
        label: "",
        description: "",
        isStatic: true,
      },
    },
  ];

  // Create static edges
  const staticEdges: Edge[] = [
    // Main pathway flow
    {
      id: "edge-1",
      source: "awareness",
      target: "firstContact",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-step2-step3",
      source: "firstContact",
      target: "integration",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      label: "2nd Visit",
      labelStyle: { fill: "#ffffff", fontWeight: 500 },
      labelBgStyle: { fill: "#374151" },
      labelBgPadding: [12, 12],
      labelBgBorderRadius: 4,
    },
    {
      id: "edge-step3-step4",
      source: "integration",
      target: "churchLife",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-step4-step4b",
      source: "churchLife",
      target: "growth",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-step4b-step5",
      source: "growth",
      target: "serving",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-step5-step6",
      source: "serving",
      target: "sending",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    // Mission pathway flow
    {
      id: "edge-step2-step2mis",
      source: "firstContact",
      target: "conversion",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-step2mis-step3mis",
      source: "conversion",
      target: "followUp",
      type: "default",
      sourceHandle: "right",
      targetHandle: "left",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    // Connection from mission back to main pathway
    {
      id: "edge-step3mis-step3",
      source: "followUp",
      target: "integration",
      type: "default",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#000000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    // New connections from 1st Contact to Fringe and Supporter
    {
      id: "edge-firstContact-fringe",
      source: "firstContact",
      target: "203",
      type: "smoothstep",
      sourceHandle: "top-out",
      targetHandle: "bottom-in",
      style: { stroke: "#000000", strokeWidth: 2, strokeDasharray: "5,5" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    {
      id: "edge-firstContact-supporter",
      source: "firstContact",
      target: "1232",
      type: "smoothstep",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#000000", strokeWidth: 2, strokeDasharray: "5,5" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
    },
    // Edge from Investigating to the edge between 1st Contact and Conversion
    {
      id: "edge-investigating-to-edge",
      source: "65",
      target: "custom-position-1stContact-conversion",
      type: "default",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Establishing (in faith) to the edge between Conversion and Follow Up
    {
      id: "edge-establishing-to-edge",
      source: "1407",
      target: "custom-position-conversion-followUp",
      type: "default",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Visiting to the edge between 1st Contact and Integration
    {
      id: "edge-visiting-to-edge",
      source: "66",
      target: "custom-position-1stContact-integration",
      type: "default",
      sourceHandle: "top-out",
      targetHandle: "left",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Joining to the edge between Follow Up and Integration
    {
      id: "edge-joining-to-followUp-integration",
      source: "1406",
      target: "custom-position-followUp-integration",
      type: "default",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Joining to the edge between 2nd Visit and Integration
    {
      id: "edge-joining-to-2ndVisit-integration",
      source: "1406",
      target: "custom-position-2ndVisit-integration",
      type: "default",
      sourceHandle: "bottom",
      targetHandle: "top",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Attending to the edge between Integration and Church Life
    {
      id: "edge-attending-to-integration-churchLife",
      source: "146",
      target: "custom-position-integration-churchLife",
      type: "default",
      sourceHandle: "top-out",
      targetHandle: "bottom",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
    // Edge from Growing to the edge between Church Life and Growth
    {
      id: "edge-growing-to-churchLife-growth",
      source: "1229",
      target: "custom-position-churchLife-growth",
      type: "default",
      sourceHandle: "top-out",
      targetHandle: "bottom",
      style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#e5e7eb",
      },
    },
  ];

  // Layout the data-driven nodes
  const layoutedNodes = nodes.map((node, index) => {
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
          position: { x: 500, y: 300 },
        };
      case "Joining":
        return {
          ...node,
          position: { x: 1100, y: -200 },
        };
      case "Attending":
        return {
          ...node,
          position: { x: 1350, y: 600 },
        };
      case "Growing":
        return {
          ...node,
          position: { x: 1850, y: 600 },
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

  // Combine static and data-driven edges
  const allEdges = [...staticEdges, ...edges];

  return { nodes: allNodes, edges: allEdges };
};

// Keep the old function name for compatibility
export const getInitialLayout = getCustomLayout;
