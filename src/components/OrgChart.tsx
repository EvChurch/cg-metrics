import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import { useMemo, useEffect, useCallback } from "react";
import TeamNode from "./TeamNode";
import { useOrgChartData } from "../hooks/useOrgChartData";
import { getInitialLayout } from "../utils/layoutUtils";
import {
  createNodesFromGroups,
  createEdgesFromGroups,
} from "../utils/nodeUtils";

// Define custom node types outside component to prevent re-renders
const nodeTypes = {
  teamNode: TeamNode,
};

const OrgChart = () => {
  const { data, isLoading, error } = useOrgChartData();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  // Transform data into React Flow nodes and edges
  const flowData = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes = createNodesFromGroups(data.groups, []);
    const edges = createEdgesFromGroups();

    return getInitialLayout(nodes, edges);
  }, [data]);

  // Set nodes and edges when data changes
  useEffect(() => {
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
  }, [flowData.nodes, flowData.edges, setNodes, setEdges]);

  // Fit view when nodes change
  const handleFitView = useCallback(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 2,
          duration: 800,
        });
      }, 200);
    }
  }, [nodes.length, fitView]);

  useEffect(() => {
    handleFitView();
  }, [handleFitView]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        // Auto-fit view when new nodes are added
        fitView={nodes.length > 0}
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 2,
          duration: 800,
        }}
        // @ts-expect-error - "hidden" is valid but not in TypeScript types yet
        attributionPosition="hidden"
        nodeOrigin={[0, 0]}
        // Enable drag selection and multi-node dragging
        nodesDraggable={true}
        nodesConnectable={false}
        selectNodesOnDrag={true}
        panOnDrag={true} // Allow panning with left mouse button
        // Selection box styling
        selectionMode={SelectionMode.Partial}
        // Enable Ctrl+Click for multi-selection
        multiSelectionKeyCode="Shift"
        // Better handling for large charts
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#E5E5E5" />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default OrgChart;
