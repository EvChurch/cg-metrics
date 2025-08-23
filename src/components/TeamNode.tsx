import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { usePathway } from "../hooks/usePathway";
import { selectTeamNode, deselectTeamNode } from "../contexts/pathwayActions";
import type { TeamNodeData } from "../contexts/PathwayContext";

const TeamNode = memo(({ data, id }: NodeProps<TeamNodeData>) => {
  const { label, people } = data;
  const {
    state: { selectedTeamNode },
    dispatch,
  } = usePathway();

  const isSelected = selectedTeamNode?.id === id;

  const handleNodeClick = () => {
    if (isSelected) {
      // If already selected, deselect it
      dispatch(deselectTeamNode());
    } else {
      // Select this team node
      dispatch(
        selectTeamNode({
          data,
          id,
        })
      );
    }
  };

  return (
    <div
      className={`bg-gray-50 border-2 rounded-lg p-2 w-[400px] shadow-md -mt-1 cursor-pointer transition-all duration-300 ease-in-out ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={handleNodeClick}
    >
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <Handle
        id="top-out"
        type="source"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h4 className="font-bold text-lg text-brand-black break-words leading-tight mt-2">
            {label} ({people.length})
          </h4>
        </div>
      </div>
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
      <Handle
        id="bottom-in"
        type="target"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
        style={{ bottom: "6px" }}
      />
    </div>
  );
});

TeamNode.displayName = "TeamNode";

export default TeamNode;
