import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  SelectionMode,
} from "reactflow";
import type { Edge } from "reactflow";
import { useMemo, useEffect } from "react";
import TeamNode from "./TeamNode";
import StaticNode from "./StaticNode";
import { usePeopleFlowData } from "../hooks/usePeopleFlowData";
import { getInitialLayout } from "../utils/layoutUtils";
import { createNodesFromStatuses } from "../utils/nodeUtils";
import { usePathway } from "../hooks/usePathway";
import { selectTeamNode } from "../contexts/pathwayActions";
import type { SelectedTeamNode } from "../contexts/PathwayContext";

// Define custom node types outside component to prevent re-renders
const nodeTypes = {
  teamNode: TeamNode,
  staticNode: StaticNode,
};

interface PeopleFlowProps {
  campusFilter?: string | null;
}

const PeopleFlow = ({ campusFilter }: PeopleFlowProps) => {
  const { data, isLoading, error } = usePeopleFlowData(campusFilter);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    state: { selectedTeamNode },
    dispatch,
  } = usePathway();

  // Transform data into React Flow nodes and edges
  const flowData = useMemo(() => {
    if (isLoading) return { nodes: [], edges: [] };

    const nodes = createNodesFromStatuses(
      data.connectionStatuses,
      data.surveys
    );
    const edges: Edge[] = []; // No edges needed for flat data

    return getInitialLayout(nodes, edges);
  }, [data, isLoading]);

  // Set nodes and edges when data changes
  useEffect(() => {
    if (selectedTeamNode) {
      const teamNode = flowData.nodes.find(
        (node) => node.id == selectedTeamNode.id
      );
      if (teamNode) {
        dispatch(selectTeamNode(teamNode as unknown as SelectedTeamNode));
      }
    }
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowData.nodes, flowData.edges, setNodes, setEdges]);

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
    <div
      className={`h-full relative transition-all duration-300 ease-in-out ${
        selectedTeamNode ? "w-[calc(100%-320px)]" : "w-full"
      }`}
    >
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

export default PeopleFlow;
