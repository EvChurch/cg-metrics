import { memo, useMemo, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Group, Person } from "../hooks/useOrgChartData";
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

  // Memoize the members list to prevent unnecessary re-renders
  const membersList = useMemo(() => {
    if (!position.Members || position.Members.length === 0) {
      return (
        <div className="text-center">
          <div className="text-xs text-gray-500">No members</div>
        </div>
      );
    }

    // Sort members: leaders first, then others
    const sortedMembers = [...position.Members].sort((a, b) => {
      const aIsLeader = a.Role === "Leader";
      const bIsLeader = b.Role === "Leader";

      if (aIsLeader && !bIsLeader) return -1;
      if (!aIsLeader && bIsLeader) return 1;
      return 0;
    });

    return (
      <div className="space-y-2">
        {sortedMembers.map((member) => {
          const isLeader = member.Role === "Leader";
          const personName = member.Person.FullName || "Unknown";

          return (
            <div key={member.Id} className="flex pt-2 ">
              <div
                className={`text-m p-2 rounded font-semibold text-wrap flex-1 text-center ${
                  isLeader
                    ? "bg-brand-rich-red text-brand-white"
                    : "bg-brand-cool-grey text-gray-500"
                }`}
              >
                {personName}
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
      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 w-[190px] shadow-md -mt-1"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-semibold text-lg text-brand-black mb-2 break-words leading-tight mt-2">
          {position.Name}
        </h4>
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

TeamNode.displayName = "TeamNode";

export default TeamNode;
