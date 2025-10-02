import { useRockData } from "../hooks/useRockData";

import CGMetrics from "./CGMetrics";

const CoachMetrics = () => {
  const { data } = useRockData();

  return (
    <>
      {data.map((group, index) => (
        <CGMetrics key={index} group={group} />
      ))}
    </>
  );
};

export default CoachMetrics;
