import type { Group } from "../hooks/useRockData";

interface PeopleDroppingOffReportProps {
  group: Group;
}

const PeopleDroppingOffReport = ({ group }: PeopleDroppingOffReportProps) => {
  const peopleDroppingOffList = group.members.filter(
    (member) => member.cgDropOff >= 2 || member.churchDropOff >= 2
  );

  return (
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
            {peopleDroppingOffList.map((member) => (
              <tr key={member.person.id} className="border-b border-gray-200">
                <td className="px-5 pl-8 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=64&h=64&fit=crop"
                      alt="Simeon Reed"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{member.person.name}</div>
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
            {peopleDroppingOffList.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center pt-8 pb-4">
                  No people dropping off
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeopleDroppingOffReport;
