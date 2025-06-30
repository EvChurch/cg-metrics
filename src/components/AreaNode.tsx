import { memo, useMemo, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Group, Person } from "../hooks/useOrgChartData";
import { updateNodeDimensions } from "../utils/layoutUtils";

interface AreaNodeData {
  label?: string;
  position: Group;
  people: Person[];
  level: number | null;
}

const AreaNode = memo(({ data, id }: NodeProps<AreaNodeData>) => {
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

  // Memoize the members list to prevent unnecessary re-renders
  const membersList = useMemo(() => {
    if (!position.Members || position.Members.length === 0) {
      return null;
    }

    // Filter to only show leaders
    const leaders = position.Members.filter(
      (member) => member.Role === "Leader"
    );

    if (leaders.length === 0) {
      return null;
    }

    return (
      <div>
        {leaders.map((member) => (
          <div key={member.Id} className="flex pt-2">
            <div className="text-m p-2 rounded font-semibold text-wrap flex-1 text-center bg-brand-rich-red text-white">
              {member.Person.FullName || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    );
  }, [position.Members]);

  return (
    <div
      ref={nodeRef}
      className="bg-brand-pale-red border-2 border-brand-pale-red rounded-lg p-3 w-[190px] shadow-lg -mt-1 -mb-1"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-bold text-2xl text-brand-black">{position.Name}</h4>

        {membersList}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
    </div>
  );
});

AreaNode.displayName = "AreaNode";

export default AreaNode;
