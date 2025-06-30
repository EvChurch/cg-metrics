import { memo, useMemo } from "react";
import type { Node } from "reactflow";
import type { GroupMember } from "../hooks/useOrgChartData";

interface AnalyticsProps {
  nodes: Node[];
  selectedNodes: Node[];
}

// Add staff list to exclude them from the analytics

const Analytics = memo(({ nodes, selectedNodes }: AnalyticsProps) => {
  // Calculate all metrics based on displayed or selected nodes
  const { totalServing, totalLeaders, totalMembers, totalAssistants } =
    useMemo(() => {
      const nodesToCount = selectedNodes.length > 0 ? selectedNodes : nodes;

      // Map to track each person's highest priority role
      const personRoles = new Map<string, string>();

      nodesToCount.forEach((node) => {
        const nodeData = node.data as {
          position?: { Members?: GroupMember[] };
        };
        if (nodeData?.position?.Members) {
          nodeData.position.Members.forEach((member) => {
            if (member.Person.FullName) {
              const personName = member.Person.FullName;
              const currentRole = personRoles.get(personName);
              const newRole = member.Role || "Unknown";

              // Define role priority (higher number = higher priority)
              const rolePriority = {
                Leader: 3,
                Assistant: 2,
                Member: 1,
                Unknown: 0,
              };

              // Keep the highest priority role for each person
              if (
                !currentRole ||
                rolePriority[newRole as keyof typeof rolePriority] >
                  rolePriority[currentRole as keyof typeof rolePriority]
              ) {
                personRoles.set(personName, newRole);
              }
            }
          });
        }
      });

      // Count people by their highest priority role
      let leaders = 0;
      let members = 0;
      let assistants = 0;

      personRoles.forEach((role) => {
        if (role === "Leader") {
          leaders++;
        } else if (role === "Member") {
          members++;
        } else {
          assistants++;
        }
      });

      return {
        totalServing: personRoles.size,
        totalLeaders: leaders,
        totalMembers: members,
        totalAssistants: assistants,
      };
    }, [nodes, selectedNodes]);

  return (
    <div className="absolute right-14 bottom-4 z-10 bg-white border border-gray-300 rounded-lg shadow-md p-4 pointer-events-none">
      <h3 className="font-semibold text-sm text-gray-800 mb-3">Analytics</h3>
      <div className="flex space-x-6">
        {/* Left column - Existing metrics */}
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-medium">Total serving: </span>
            <span className="font-bold text-brand-rich-red">
              {totalServing}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Total leaders: </span>
            <span className="font-bold text-brand-rich-red">
              {totalLeaders}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Total assistants: </span>
            <span className="font-bold text-brand-rich-red">
              {totalAssistants}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Total members: </span>
            <span className="font-bold text-brand-rich-red">
              {totalMembers}
            </span>
          </div>
        </div>

        {/* Right column - Role-based metrics */}
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-medium">Total open roles: </span>
            <span className="font-bold text-brand-rich-red">-</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Open crucial roles: </span>
            <span className="font-bold text-brand-rich-red">-</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Open ideal roles: </span>
            <span className="font-bold text-brand-rich-red">-</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Analytics.displayName = "Analytics";

export default Analytics;
