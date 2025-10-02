import type { Group } from "../hooks/useCgMetricsData";
import CgMetrics from "./CgMetrics";

interface CoachMetricsProps {
  groups: Group[];
}

const CoachMetrics = ({ groups }: CoachMetricsProps) => {
  return (
    <div className="overflow-y-auto max-h-[100vh] border-none">
      {groups.map((group, index) => (
        <CgMetrics key={index} group={group} />
      ))}
    </div>
  );
};

export default CoachMetrics;
