import { memo, useMemo, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Group, Person } from "../hooks/usePeopleFlowData";
import { updateNodeDimensions } from "../utils/layoutUtils";

interface TeamNodeData {
  label?: string;
  position: Group;
  people: Person[];
  level: number | null;
}

const TeamNode = memo(({ data, id }: NodeProps<TeamNodeData>) => {
  const { position } = data;
  const nodeRef = useRef<HTMLDivElement>(null);

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
  }, [id]);

  // Memoize the people list to prevent unnecessary re-renders
  const peopleList = useMemo(() => {
    if (!position.people || position.people.length === 0) {
      return (
        <div className="text-center">
          <div className="text-xs text-gray-500">No people</div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {position.people.map((person) => {
          const personName = person.fullName || "Unknown";
          const rockUrl = `https://rock.ev.church/Person/${person.id}`;

          return (
            <div key={person.id} className="flex">
              <a
                href={rockUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs p-1 rounded font-semibold text-wrap flex-1 text-center bg-brand-cool-grey text-brand-mid-grey hover:bg-gray-300 hover:text-gray-700 transition-colors text-decoration-none cursor-pointer`}
              >
                {personName}
              </a>
            </div>
          );
        })}
      </div>
    );
  }, [position.people]);

  return (
    <div
      ref={nodeRef}
      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 w-[290px] shadow-md -mt-1"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-semibold text-lg text-brand-black mb-2 break-words leading-tight mt-2">
          {position.name} ({position.people.length})
        </h4>
        {position.description && (
          <div className="text-xs text-gray-600 mb-2 px-2">
            {position.description}
          </div>
        )}
        {peopleList}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
    </div>
  );
});

TeamNode.displayName = "TeamNode";

export default TeamNode;
