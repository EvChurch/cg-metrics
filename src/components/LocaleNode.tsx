import { memo, useRef } from "react";
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
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={nodeRef}
      className="bg-brand-mid-red border-2 border-brand-mid-red rounded-lg p-7 w-[560px] shadow-lg -mb-1"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-bold text-8xl text-brand-black">
          {position.Name.replace(/^~/, "")}
        </h4>
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
