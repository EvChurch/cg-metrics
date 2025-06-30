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
  const leadersList = useMemo(() => {
    if (!position.Members || position.Members.length === 0) {
      return null;
    }

    // Filter to show leaders and assistants
    const leadersAndAssistants = position.Members.filter(
      (member) => member.Role === "Leader" || member.Role === "Assistant"
    );

    if (leadersAndAssistants.length === 0) {
      return null;
    }

    // Sort: leaders first, then assistants
    const sortedMembers = leadersAndAssistants.sort((a, b) => {
      const aIsLeader = a.Role === "Leader";
      const bIsLeader = b.Role === "Leader";
      if (aIsLeader && !bIsLeader) return -1;
      if (!aIsLeader && bIsLeader) return 1;
      return 0;
    });

    return (
      <div>
        {sortedMembers.map((member) => {
          const isAssistant = member.Role === "Assistant";

          let pillClass = "bg-brand-rich-red text-white";
          if (isAssistant) {
            pillClass = "bg-brand-orange text-white";
          }

          return (
            <div key={member.Id} className="flex pt-2">
              <div
                className={`text-m p-2 rounded font-semibold text-wrap flex-1 text-center ${pillClass}`}
              >
                {member.Person.FullName || "Unknown"}
              </div>
            </div>
          );
        })}
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

        {leadersList}
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
