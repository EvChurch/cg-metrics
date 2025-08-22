import { memo, useRef, useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Person, Survey } from "../hooks/usePeopleFlowData";
import { updateNodeDimensions } from "../utils/layoutUtils";
import PeopleList from "./PeopleList";

interface TeamNodeData {
  label?: string;
  description?: string;
  people: Person[];
  surveys?: Survey[];
}

const TeamNode = memo(({ data, id }: NodeProps<TeamNodeData>) => {
  const { label, description, people, surveys = [] } = data;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Measure and update node dimensions when content changes
  useEffect(() => {
    if (nodeRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          updateNodeDimensions(id, width, height);
        }
      });

      resizeObserver.observe(nodeRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [id, isExpanded]);

  const handleNodeClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={nodeRef}
      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 w-[400px] shadow-md -mt-1 cursor-pointer hover:border-gray-300 transition-all duration-300 ease-in-out"
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
      <div
        className="flex flex-col items-center transition-all duration-300 ease-in-out"
        style={{
          height: isExpanded ? "auto" : "fit-content",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <h4 className="font-bold text-lg text-brand-black break-words leading-tight mt-2">
            {label} ({people.length})
          </h4>
        </div>
        {description && (
          <div className="text-xs text-gray-600 mb-2 px-2">{description}</div>
        )}
        <div
          className="grid transition-all duration-300 ease-in-out w-full"
          style={{
            gridTemplateRows: isExpanded ? "1fr" : "0fr",
          }}
        >
          <div
            className={`overflow-hidden transition-opacity duration-300 ease-in-out ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            <PeopleList people={people} surveys={surveys} label={label ?? ""} />
          </div>
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
