import type { Group } from "../hooks/useRockData";

import AttendanceBarChart from "./AttendanceBarChart";
import PeopleDroppingOffReport from "./PeopleDroppingOffReport";
import PersonCard from "./PersonCard";

interface CGMetricsProps {
  group: Group;
}

const CGMetrics = ({ group }: CGMetricsProps) => {
  return (
    <>
      <div className="text-5xl font-bold text-black mb-12">
        My Connect Group
      </div>
      <div className="text-3xl font-bold text-black mb-6">
        People Dropping Off
      </div>
      <PeopleDroppingOffReport group={group} />
      <div className="text-3xl font-bold text-black mt-14 mb-6">
        Average Monthly Attendance
      </div>
      <AttendanceBarChart />
      <div className="text-3xl font-bold text-black mt-14 mb-4">
        Individual Attendance
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {group.members.map((member) => (
          <PersonCard key={member.person.id} personAttendance={member} />
        ))}
      </div>
    </>
  );
};

export default CGMetrics;
