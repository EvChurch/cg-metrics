import type { Group } from "../utils/types";

import AttendanceBarChart from "./AttendanceBarChart";
import PersonCard from "./PersonCard";

interface CGMetricsProps {
  group: Group;
}

const CGMetrics = ({ group }: CGMetricsProps) => {
  const peopleDroppingOff = group.members
    .filter((member) => member.cgDropOff >= 2 || member.churchDropOff >= 2)
    .sort(
      (a, b) => b.cgDropOff + b.churchDropOff - (a.cgDropOff + a.churchDropOff)
    );

  return (
    <>
      <div className="text-5xl font-bold text-black mb-12">
        My Connect Group
      </div>
      <div className="text-3xl font-bold text-black mb-6">
        People Dropping Off
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-[#505050] text-center">
                <th className="text-left rounded-l-2xl bg-gray-100 px-5 py-3 pl-8 font-bold">
                  Name
                </th>
                <th className="bg-gray-100 px-5 py-3 font-bold">
                  No. weeks missed CG
                </th>
                <th className="rounded-r-2xl bg-gray-100 px-5 py-3 font-bold">
                  No. weeks missed church
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {peopleDroppingOff.map((member) => (
                <tr key={member.person.id} className="border-b border-gray-200">
                  <td className="px-5 pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=64&h=64&fit=crop"
                        alt="Simeon Reed"
                        className="h-10 w-10 rounded-full object-cover"
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
      <div className="text-3xl font-bold text-black mt-14 mb-6">
        Average Monthly Attendance
      </div>
      <AttendanceBarChart group={group} />
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
