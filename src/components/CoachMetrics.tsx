import { useRockData } from "../hooks/useRockData";

import CGMetrics from "./CGMetrics";

const CoachMetrics = () => {
  const { data } = useRockData();

  return (
    <>
      {data.map((group) => (
        <CGMetrics key={group.groupDetails.id} group={group} />
      ))}
    </>
  );
};

export default CoachMetrics;
