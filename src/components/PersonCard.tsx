import type { PersonAttendance } from "../utils/types";

interface PersonCardProps {
  personAttendance: PersonAttendance;
}

const PersonCard = ({ personAttendance }: PersonCardProps) => {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const yearOfLastMonth =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const currentYear = now.getFullYear();

  const cgMonthAttendance = personAttendance.cgAttendance.filter(
    (att) =>
      att.date.getMonth() === lastMonth &&
      att.date.getFullYear() === yearOfLastMonth
  );
  const cgMonth =
    (cgMonthAttendance.filter((att) => att.didAttend).length /
      cgMonthAttendance.length) *
    100;

  const cgYearAttendance = personAttendance.cgAttendance.filter(
    (att) => att.date.getFullYear() === currentYear
  );
  const cgYear =
    (cgYearAttendance.filter((att) => att.didAttend).length /
      cgYearAttendance.length) *
    100;

  const churchMonthAttendance = personAttendance.churchAttendance.filter(
    (att) =>
      att.date.getMonth() === lastMonth &&
      att.date.getFullYear() === yearOfLastMonth
  );
  const churchMonth =
    (churchMonthAttendance.filter((att) => att.didAttend).length /
      churchMonthAttendance.length) *
    100;

  const churchYearAttendance = personAttendance.churchAttendance.filter(
    (att) => att.date.getFullYear() === currentYear
  );
  const churchYear =
    (churchYearAttendance.filter((att) => att.didAttend).length /
      churchYearAttendance.length) *
    100;

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
          {`${cgMonth.toFixed(0)}%`}
        </div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${cgYear.toFixed(0)}%`}
        </div>

        <div className="text-gray-600 text-right mr-6">Church</div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${churchMonth.toFixed(0)}%`}
        </div>
        <div className="text-center text-2xl font-semibold text-gray-900">
          {`${churchYear.toFixed(0)}%`}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full border-2 border-[#E22A30] px-5 py-2 text-sm font-medium text-[#E22A30] hover:bg-red-50 hover:!text-[#E22A30] focus:outline-none focus:ring-2 focus:ring-red-500/50">
          View Stats
        </a>
      </div>
    </div>
  );
};

export default PersonCard;
