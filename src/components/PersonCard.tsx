import { useCgReport } from "../hooks/useCgReport";
import {
  getCgMonthAverage,
  getCgYearAverage,
  getChurchMonthAverage,
  getChurchYearAverage,
} from "../utils/attendanceStats";
import type { PersonAttendance } from "../utils/types";

interface PersonCardProps {
  personAttendance: PersonAttendance;
}

const PersonCard = ({ personAttendance }: PersonCardProps) => {
  const { selectedPerson, setSelectedPerson } = useCgReport();
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const yearOfLastMonth =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const cgMonthAverage = getCgMonthAverage(
    personAttendance.cgAttendance,
    lastMonth,
    yearOfLastMonth
  );
  const cgYearAverage = getCgYearAverage(personAttendance.cgAttendance);

  const churchMonthAverage = getChurchMonthAverage(
    personAttendance.churchAttendance,
    lastMonth,
    yearOfLastMonth
  );

  const churchYearAverage = getChurchYearAverage(
    personAttendance.churchAttendance
  );

  return (
    <div className="flex flex-col rounded-2xl border-2 border-[#DDDDDD] bg-white py-6 px-9 shadow-[2px_2px_14px_0_rgba(0,0,0,0.05)]">
      <div className="mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-white">
        <img
          src={personAttendance.person.profile}
          alt={personAttendance.person.name}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
        {personAttendance.person.name}
      </h3>
      <div className="mt-4 grid grid-cols-[auto_1fr_1fr] items-center gap-y-2 text-sm">
        <div></div>
        <div className="text-center text-gray-500">Last month</div>
        <div className="text-center text-gray-500">This year</div>

        <div className="text-gray-600 text-right mr-6">CG</div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${String(Math.round(cgMonthAverage))}%`}
        </div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${String(Math.round(cgYearAverage))}%`}
        </div>

        <div className="text-gray-600 text-right mr-6">Church</div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${String(Math.round(churchMonthAverage))}%`}
        </div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${String(Math.round(churchYearAverage))}%`}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        {selectedPerson?.person.id === personAttendance.person.id ? (
          <div
            onClick={() => {
              setSelectedPerson(null);
            }}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#E22A30] bg-[#E22A30] px-5 py-2 text-sm font-bold text-white hover:bg-[#89161a] hover:border-[#89161a] focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer">
            Close Stats
          </div>
        ) : (
          <div
            onClick={() => {
              // const el = document.getElementById("individual-attendance");

              // if (el) {
              //   const y =
              //     el.getBoundingClientRect().top + window.pageYOffset - 100; // go 100px lower

              //   window.scrollTo({
              //     top: y,
              //     behavior: "smooth",
              //   });
              // }
              document.getElementById("individual-attendance")?.scrollIntoView({
                behavior: "smooth",
              });
              setSelectedPerson(personAttendance);
            }}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#E22A30] px-5 py-2 text-sm font-medium text-[#E22A30] hover:bg-red-50 hover:!text-[#E22A30] focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer">
            View Stats
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
