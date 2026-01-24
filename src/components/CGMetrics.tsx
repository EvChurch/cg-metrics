import { Icon } from "@iconify/react";
import { useState } from "react";

import type { Group } from "../utils/types";

import AttendanceBarChart from "./AttendanceBarChart";
import HealthToggle from "./HealthToggle";
import PersonCard from "./PersonCard";
import PersonPanel from "./PersonPanel";

interface CGMetricsProps {
  group: Group;
}

const CGMetrics = ({ group }: CGMetricsProps) => {
  const peopleDroppingOff = group.members
    .filter((member) => member.cgDropOff >= 2 || member.churchDropOff >= 2)
    .sort(
      (a, b) => b.cgDropOff + b.churchDropOff - (a.cgDropOff + a.churchDropOff),
    );

  const [healthy, setHealthy] = useState<boolean>(group.groupDetails.healthy);
  console.log("group: ", group);

  return (
    <>
      <div className="mb-12">
        <div className="text-4xl [@media(min-width:480px)]:text-5xl font-bold text-black mb-3">
          {group.groupDetails.name}
        </div>
        <div className="mb-5 flex items-center gap-2">
          <Icon icon="fluent:people-20-filled" color="#505050" height="32px" />
          <div className="font-bold text-2xl text-[#505050]">
            Leaders: {group.groupDetails.leaders.join(", ")}
          </div>
        </div>
        {group.groupDetails.isCoach && (
          <HealthToggle
            groupId={group.groupDetails.id}
            healthy={healthy}
            setHealthy={setHealthy}
          />
        )}
      </div>
      <div className="text-2xl [@media(min-width:480px)]:text-3xl font-bold text-black mb-6">
        People Dropping Off
      </div>
      <div className="">
        <div className="min-w-0">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-[#505050] text-center">
                <th className="text-left rounded-l-2xl bg-gray-100 px-5 py-3 pl-8 font-bold">
                  Name
                </th>
                <th className="bg-gray-100 px-5 py-3 font-bold whitespace-normal break-words min-w-0">
                  <span className="hidden [@media(min-width:480px)]:inline">
                    Last CG attended (weeks ago)
                  </span>
                  <span className="inline [@media(min-width:480px)]:hidden">
                    Last CG (weeks)
                  </span>
                </th>
                <th className="rounded-r-2xl bg-gray-100 px-5 py-3 font-bold whitespace-normal break-words min-w-0">
                  <span className="hidden [@media(min-width:480px)]:inline">
                    Last church attended (weeks ago)
                  </span>
                  <span className="inline [@media(min-width:480px)]:hidden">
                    Last Church (weeks)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {peopleDroppingOff.map((member) => (
                <tr key={member.person.id} className="border-b border-gray-200">
                  <td className="px-5 pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.person.profile}
                        alt={member.person.name}
                        className="h-10 w-10 rounded-full object-cover [@media(max-width:480px)]:hidden"
                      />
                      <div>
                        <div className="font-semibold">
                          {member.person.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {member.person.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">{member.cgDropOff}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">{member.churchDropOff}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between gap-10">
        <div className="flex-1">
          <div className="text-3xl font-bold text-black mt-14 mb-6">
            Average Monthly Attendance
          </div>
          <AttendanceBarChart group={group} />
        </div>
        {/* <div>
          <div className="text-3xl font-bold text-black mt-14 mb-6">
            Average Attendance This Year
          </div>
        </div> */}
      </div>

      <div
        id="individual-attendance"
        className="text-3xl font-bold text-black mt-14 mb-4">
        {`Individual Attendance (${group.members.length.toString()})`}
      </div>
      <PersonPanel />
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] mb-12">
        {group.members.map((member) => (
          <PersonCard key={member.person.id} personAttendance={member} />
        ))}
      </div>
    </>
  );
};

export default CGMetrics;
