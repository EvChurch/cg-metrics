import { useRockData } from "../hooks/useRockData";
import CGMetrics from "./CGMetrics";

const CoachMetrics = () => {
  const { data } = useRockData();

  return (
    <div className="overflow-y-auto max-h-[100vh] border-none">
      {data.map((group, index) => (
        <CGMetrics key={index} group={group} />
      ))}
    </div>
  );
};

export default CoachMetrics;
