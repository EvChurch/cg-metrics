import { Icon } from "@iconify/react";
import { useState } from "react";

import {
  average,
  calculateMonthlyAverageCgAttendance,
} from "../utils/attendanceStats";
import { barChartMonths } from "../utils/barChart";
import type { Group, PersonAttendance } from "../utils/types";

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
  const [selectedPerson, setSelectedPerson] = useState<PersonAttendance | null>(
    null,
  );

  const now = new Date();
  const currentYear = now.getFullYear();

  const monthlyAverageData = calculateMonthlyAverageCgAttendance(group.members);
  const months = barChartMonths();
  const currentYearIndex = months.findIndex(
    (month) => month.getFullYear() === currentYear,
  );
  const monthlyAverageDataCurrentYear = monthlyAverageData
    .slice(currentYearIndex)
    .filter((data) => !!data);
  const averageThisYear = Math.round(average(monthlyAverageDataCurrentYear));

  const currentMonth = new Date().getMonth();
  const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
  const quarterStartIndex = months.findIndex(
    (month) =>
      month.getFullYear() === currentYear &&
      month.getMonth() === quarterStartMonth,
  );

  const monthlyAverageDataCurrentQuarter = monthlyAverageData
    .slice(quarterStartIndex, quarterStartIndex + 3)
    .filter((data) => !!data);
  const averageThisQuarter = Math.round(
    average(monthlyAverageDataCurrentQuarter),
  );
  console.log("monthlyAverageDataCurrentQuarter", quarterStartIndex);

  return (
    <div className="mb-14">
      <div className="mb-12">
        <div className="flex gap-8 justify-between">
          <div>
            <div className="text-4xl [@media(min-width:480px)]:text-5xl font-bold text-black mb-3">
              {group.groupDetails.name}
            </div>
            <div className="mb-5 flex items-center gap-2">
              <Icon
                icon="fluent:people-20-filled"
                color="#505050"
                height="32px"
              />
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
          <div className="flex gap-3">
            <div className="border-[4px] border-solid border-[#DDDDDD] rounded-2xl py-[14px] px-[40px] flex flex-col items-center justify-between text-center h-fit">
              <div className="text-[5.5rem] font-bold text-[#E22A30] leading-none">
                {averageThisYear}%
              </div>
              <div className="font-bold text-[#505050] text-[1.5rem] leading-[1.3]">
                Average Attendance <br />
                This Year
              </div>
            </div>
            <div className="border-[4px] border-solid border-[#DDDDDD] rounded-2xl py-[14px] px-[40px] flex flex-col items-center justify-between text-center h-fit">
              <div className="text-[5.5rem] font-bold text-[#E22A30] leading-none">
                {averageThisQuarter}%
              </div>
              <div className="font-bold text-[#505050] text-[1.5rem] leading-[1.3]">
                Average Attendance <br />
                Jan - Mar
              </div>
            </div>
          </div>
        </div>
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
                    No. of CGs missed
                  </span>
                  <span className="inline [@media(min-width:480px)]:hidden">
                    # CG missed
                  </span>
                </th>
                <th className="rounded-r-2xl bg-gray-100 px-5 py-3 font-bold whitespace-normal break-words min-w-0">
                  <span className="hidden [@media(min-width:480px)]:inline">
                    No. of church services missed
                  </span>
                  <span className="inline [@media(min-width:480px)]:hidden">
                    # Church missed
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
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-3xl font-bold text-black mt-14 mb-6">
            Average Monthly Attendance
          </div>
          <AttendanceBarChart dataVals={monthlyAverageData} />
        </div>
      </div>

      <div
        id={`individual-attendance-${String(group.groupDetails.id)}`}
        className="text-3xl font-bold text-black mt-14 mb-4">
        {`Individual Attendance (${group.members.length.toString()})`}
      </div>
      <PersonPanel selectedPerson={selectedPerson} />
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {group.members.map((member) => (
          <PersonCard
            key={member.person.id}
            personAttendance={member}
            groupId={group.groupDetails.id}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
          />
        ))}
      </div>
    </div>
  );
};

export default CGMetrics;
