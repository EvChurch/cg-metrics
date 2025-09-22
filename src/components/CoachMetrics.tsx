import type { Group } from '../utils/cgMetricsTypes';
import CGMetrics from './CGMetrics';

interface CoachMetricsProps {
  groups: Group[];
}

const CoachMetrics = ({ groups }: CoachMetricsProps) => {
  return (
    <div className="overflow-y-auto max-h-[100vh] border-none">
      {groups.map((group, index) => (
        <CGMetrics key={index} group={group} />
      ))}
    </div>
  );
};

export default CoachMetrics;
