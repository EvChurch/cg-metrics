import type { Group } from "../hooks/useRockData";

import AttendanceBarChart from "./AttendanceBarChart";
import PersonCard from "./PersonCard";

interface CGMetricsProps {
  group: Group;
}

const CGMetrics = ({ group }: CGMetricsProps) => {
  const getPeopleDroppingOffList = () => {
    return group.members.filter(
      (member) => member.cgDropOff >= 2 || member.churchDropOff >= 2
    );
  };

  const peopleDroppingOff = () => {
    return (
      <>
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
                {getPeopleDroppingOffList().map((member) => (
                  <tr
                    key={member.person.id}
                    className="border-b border-gray-200"
                  >
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
                            {member.person.mobile}
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

                <tr className="border-b border-gray-200">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=64&h=64&fit=crop"
                        alt="Isabella Garcia"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">Isabella Garcia</div>
                        <div className="text-gray-500 text-sm">0223882912</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">3</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">2</span>
                  </td>
                </tr>
                <tr className="">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=64&h=64&fit=crop"
                        alt="Ethan Brooks"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">Ethan Brooks</div>
                        <div className="text-gray-500 text-sm">0271021992</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">1</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold">2</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const monthlyAttendance = () => {
    return (
      <>
        <div className="text-3xl font-bold text-black mt-14 mb-6">
          Average Monthly Attendance
        </div>
        <AttendanceBarChart />
      </>
    );
  };

  const individualAttendance = () => {
    return (
      <>
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

  return (
    <div className="px-10 py-20 border-[3px]">
      <div className="text-5xl font-bold text-black mb-12">
        My Connect Group
      </div>
      {peopleDroppingOff()}
      {monthlyAttendance()}
      {individualAttendance()}
    </div>
  );
};

export default CGMetrics;
