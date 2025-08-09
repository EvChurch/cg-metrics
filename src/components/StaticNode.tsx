import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface StaticNodeData {
  label?: string;
  description?: string;
  isStatic?: boolean;
}

const StaticNode = memo(({ data }: NodeProps<StaticNodeData>) => {
  const { label, description } = data;

  // If label is empty, make the node invisible (for custom position nodes)
  if (!label) {
    return (
      <div className="w-8 h-8 opacity-0 relative">
        {/* Invisible handles for custom position nodes */}
        <Handle
          id="top"
          type="target"
          position={Position.Top}
          className="w-0 h-0 opacity-0"
          style={{ top: "-4px" }}
        />
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          className="w-0 h-0 opacity-0"
        />
        <Handle
          id="bottom"
          type="target"
          position={Position.Bottom}
          className="w-0 h-0 opacity-0"
          style={{ bottom: "-4px" }}
        />
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 w-[250px] shadow-sm cursor-grab">
      {/* Left handle for incoming edges */}
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="w-0 h-0 opacity-0"
      />
      {/* Top handle for incoming edges */}
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
        style={{ top: "-6px" }}
      />
      {/* Top handle for outgoing edges */}
      <Handle
        id="top-out"
        type="source"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
        style={{ top: "6px" }}
      />
      <div className="text-center">
        <h4 className="font-semibold text-lg text-blue-800 break-words leading-tight">
          {label}
        </h4>
        {description && (
          <div className="text-xs text-blue-600 mt-1">{description}</div>
        )}
      </div>
      {/* Right handle for outgoing edges */}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="w-0 h-0 opacity-0"
      />
      {/* Bottom handle for outgoing edges */}
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
    </div>
  );
});

StaticNode.displayName = "StaticNode";
export default StaticNode;
