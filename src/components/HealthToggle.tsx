import { forwardRef } from "react";

import { updateGroupAttributeValue } from "../api/groups";

interface HealthToggleProps {
  groupId: number;
  healthy: boolean;
  setHealthy: (healthy: boolean) => void;
}

const HealthToggle = forwardRef<HTMLInputElement, HealthToggleProps>(
  ({ groupId, healthy, setHealthy }, ref) => {
    const onChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHealthy(e.target.checked);
      updateGroupAttributeValue(
        groupId,
        "Healthy",
        e.target.checked ? "True" : "False",
      );
    };

    return (
      <>
        <input
          id={groupId.toString()}
          type="checkbox"
          className="hidden"
          ref={ref}
          checked={healthy}
          onChange={onChangeToggle}
        />

        <label
          htmlFor={groupId.toString()}
          className="cursor-pointer inline-block select-none">
          <div className="w-[260px] h-12 p-[8px] rounded-[6px] transition-colors duration-300 bg-[#F2F2F2] relative">
            <div
              className={`w-[128px] h-[32px] absolute text-[#898E9B] font-bold items-center justify-center ml-[-6px] ${
                healthy ? "flex" : "hidden"
              }`}>
              NOT HEALTHY
            </div>
            <div
              className={`w-[128px] h-[32px] absolute right-0 text-[#898E9B] font-bold items-center justify-center ml-[-6px] ${
                healthy ? "hidden" : "flex"
              }`}>
              HEALTHY
            </div>
            <div
              className={`w-[122px] h-full p-0.5 shadow-sm rounded-[6px] transition-all duration-300 text-white font-bold flex items-center justify-center ${
                healthy ? `bg-[#6EC45D] translate-x-[122px]` : "bg-[#B03E60]"
              }`}>
              {healthy ? "HEALTHY" : "NOT HEALTHY"}
            </div>
          </div>
        </label>
      </>
    );
  },
);

export default HealthToggle;
