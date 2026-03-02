import { useRockData } from "../hooks/useRockData";
import { calculateMonthlyAverageAttendanceManyCgs } from "../utils/attendanceStats";

import AttendanceBarChart from "./AttendanceBarChart";
import CGMetrics from "./CGMetrics";

const CoachMetrics = () => {
  const { data, isLoading } = useRockData();

  const monthlyAverageAttendances = calculateMonthlyAverageAttendanceManyCgs(
    data.map((d) => d.members.flat()),
  );

  return isLoading ? (
    <div style={{ padding: 24, textAlign: "center" }}>
      Loading group metrics…
    </div>
  ) : (
    <>
      {data.length > 0 && (
        <div className="mb-14">
          <div className="text-4xl [@media(min-width:480px)]:text-5xl font-bold text-black mb-3 mt-14">
            Overall Stats
          </div>
          <AttendanceBarChart dataVals={monthlyAverageAttendances} />
        </div>
      )}
      {data.map((group) => (
        <CGMetrics key={group.groupDetails.id} group={group} />
      ))}
    </>
  );
};

export default CoachMetrics;
