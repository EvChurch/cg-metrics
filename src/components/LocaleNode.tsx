import { memo, useMemo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Group, Person } from "../hooks/useOrgChartData";

interface LocaleNodeData {
  label?: string;
  position: Group;
  people: Person[];
  level: number | null;
}

const LocaleNode = memo(({ data }: NodeProps<LocaleNodeData>) => {
  const { position } = data;

  // Memoize the leaders list to prevent unnecessary re-renders
  const leadersList = useMemo(() => {
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
          <div key={member.Id} className="flex pt-4">
            <div className="text-m p-2 rounded font-semibold text-wrap flex-1 text-center bg-brand-rich-red text-white">
              {member.Person.FullName || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    );
  }, [position.Members]);

  return (
    <div className="bg-brand-mid-red border-2 border-brand-mid-red rounded-lg p-7 pb-5 w-[560px] shadow-lg -mb-1">
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-bold text-8xl text-brand-black">
          {position.Name.replace(/^~/, "")}
        </h4>
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

LocaleNode.displayName = "LocaleNode";

export default LocaleNode;
