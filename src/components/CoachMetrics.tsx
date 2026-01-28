import { useRockData } from "../hooks/useRockData";

import CGMetrics from "./CGMetrics";

const CoachMetrics = () => {
  const { data, isLoading } = useRockData();

  return isLoading ? (
    <div style={{ padding: 24, textAlign: "center" }}>
      Loading group metrics…
    </div>
  ) : (
    <>
      {data.map((group) => (
        <CGMetrics key={group.groupDetails.id} group={group} />
      ))}
    </>
  );
};

export default CoachMetrics;
