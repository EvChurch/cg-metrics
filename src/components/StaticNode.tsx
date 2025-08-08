import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface StaticNodeData {
  label?: string;
  description?: string;
  isStatic?: boolean;
}

const StaticNode = memo(({ data }: NodeProps<StaticNodeData>) => {
  const { label, description } = data;

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 w-[250px] shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div className="text-center">
        <h4 className="font-semibold text-lg text-blue-800 break-words leading-tight">
          {label}
        </h4>
        {description && (
          <div className="text-xs text-blue-600 mt-1">{description}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
    </div>
  );
});

StaticNode.displayName = "StaticNode";
export default StaticNode;
