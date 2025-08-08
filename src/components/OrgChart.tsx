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
import {
  getInitialLayout,
  repositionChildrenOfNode,
} from "../utils/layoutUtils";
import {
  createNodesFromGroups,
  createEdgesFromGroups,
} from "../utils/nodeUtils";
import { GROUP_TYPE_IDS } from "../utils/nodeUtils";

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

  // Fit view when nodes change - use useCallback to prevent unnecessary re-renders
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

  // Initial re-layout after all nodes have been measured
  useEffect(() => {
    if (nodes.length > 0) {
      // Wait for all nodes to be rendered and measured
      const timeoutId = window.setTimeout(() => {
        // Find all TeamNodes that have children
        const nodesWithChildren = nodes.filter((node) => {
          const nodeData = node.data as { position?: { GroupTypeId?: number } };
          return (
            nodeData?.position?.GroupTypeId === GROUP_TYPE_IDS.SERVING_TEAM
          );
        });

        // Sort nodes by hierarchy level (top to bottom)
        // Nodes with no parents come first, then their children, etc.
        const sortedNodes = [...nodesWithChildren].sort((a, b) => {
          const aData = a.data as { position?: { ParentGroupId?: number } };
          const bData = b.data as { position?: { ParentGroupId?: number } };

          // If one has no parent and the other does, the one without parent comes first
          if (!aData?.position?.ParentGroupId && bData?.position?.ParentGroupId)
            return -1;
          if (aData?.position?.ParentGroupId && !bData?.position?.ParentGroupId)
            return 1;

          // If both have parents, sort by parent ID (this ensures children of the same parent are grouped)
          if (
            aData?.position?.ParentGroupId &&
            bData?.position?.ParentGroupId
          ) {
            return aData.position.ParentGroupId - bData.position.ParentGroupId;
          }

          return 0;
        });

        let updatedNodes = [...nodes];
        sortedNodes.forEach((parentNode) => {
          updatedNodes = repositionChildrenOfNode(
            parentNode.id,
            updatedNodes,
            edges
          );
        });

        if (JSON.stringify(updatedNodes) !== JSON.stringify(nodes)) {
          setNodes(updatedNodes);
        }
      }, 200); // Longer delay to ensure all nodes are measured

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [nodes.length, edges.length, setNodes]);

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
