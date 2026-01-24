import { Icon } from "@iconify/react";
import type { ActiveElement, ChartEvent } from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

import { useCgReport } from "../hooks/useCgReport";
import { getAttendanceMonthAverage } from "../utils/attendanceStats";
import { barChartData, barChartOptions } from "../utils/barChart";
import type { AttendanceEntry } from "../utils/types";

const PersonPanel = () => {
  const { selectedPerson } = useCgReport();

  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 0 : now.getMonth() - 1;
  const currentYear = now.getFullYear();
  const [selectedMonthCg, setSelectedMonthCg] = useState<number>(lastMonth);
  const [selectedMonthChurch, setSelectedMonthChurch] =
    useState<number>(lastMonth);

  // const summaryMetrics = () => {
  //   const cgMonthAverage = getCgMonthAverage(
  //     selectedPerson.cgAttendance,
  //     lastMonth,
  //     currentYear
  //   );
  //   const cgYearAverage = getCgYearAverage(selectedPerson.cgAttendance);

  //   const churchMonthAverage = getChurchMonthAverage(
  //     selectedPerson.churchAttendance,
  //     lastMonth,
  //     currentYear
  //   );

  //   const churchYearAverage = getChurchYearAverage(
  //     selectedPerson.churchAttendance
  //   );

  //   return (
  //     <div className="mt-10 mb-16 grid grid-cols-[auto_1fr_1fr] items-center gap-y-6 text-2xl">
  //       <div></div>
  //       <div className="text-center text-gray-500">Last month</div>
  //       <div className="text-center text-gray-500">This year</div>

  //       <div className="text-gray-600 text-left mr-6">CG</div>
  //       <div className="text-center text-4xl font-semibold text-zinc-900">
  //         {`${String(Math.round(cgMonthAverage))}%`}
  //       </div>
  //       <div className="text-center text-4xl font-semibold text-zinc-900">
  //         {`${String(Math.round(cgYearAverage))}%`}
  //       </div>

  //       <div className="text-gray-600 text-left mr-6">Church</div>
  //       <div className="text-center text-4xl font-semibold text-zinc-900">
  //         {`${String(Math.round(churchMonthAverage))}%`}
  //       </div>
  //       <div className="text-center text-4xl font-semibold text-zinc-900">
  //         {`${String(Math.round(churchYearAverage))}%`}
  //       </div>
  //     </div>
  //   );
  // };

  const monthlyAttendanceChart = (
    attendance: AttendanceEntry[],
    cg: boolean,
  ) => {
    const now = new Date();
    const labels = Array.from({ length: 13 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 12 + i, 1);
      return d.toLocaleString("default", { month: "short" });
    });
    const monthlyAverageData = Array.from(
      { length: 13 },
      (_, i) => (now.getMonth() - 12 + i + 13) % 13,
    ).map((month) => getAttendanceMonthAverage(attendance, month));
    console.log("monthlyAverageData: ", monthlyAverageData);
    const chartData = barChartData(
      labels,
      monthlyAverageData,
      cg ? selectedMonthCg : selectedMonthChurch,
    );

    const onClick = (_event: ChartEvent, activeElements: ActiveElement[]) => {
      if (activeElements.length > 0) {
        console.log(activeElements);
        const activeElement = activeElements[0];
        const dataIndex = activeElement.index;
        if (cg) {
          setSelectedMonthCg(dataIndex);
        } else {
          setSelectedMonthChurch(dataIndex);
        }
      }
    };

    const chartOptions = barChartOptions(onClick);
    return (
      <div className="h-30 sm:h-30 mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  };

  const getAttendanceGridStyle = (status: boolean | null) => {
    return status === null
      ? "border-[3px] border-[#D9D9D9]"
      : status
        ? "bg-[#CEF0C7]"
        : "border-[3px] border-[#F4C6CF]";
  };

  const getAttendanceGridIcon = (status: boolean | null) => {
    return status === null ? (
      <Icon icon="fa7-solid:minus" color="#898E9B" height="30" />
    ) : status ? (
      <Icon icon="fa7-solid:check-circle" color="#6EC45D" height="26" />
    ) : (
      <Icon icon="fa7-solid:xmark" color="#B03E60" height="26" />
    );
  };

  const getAttendanceGrid = (status: boolean | null) => {
    return (
      <div
        className={`w-full h-[65px] rounded-[10px] flex items-center justify-center ${getAttendanceGridStyle(
          status,
        )}`}>
        {getAttendanceGridIcon(status)}
      </div>
    );
  };

  const weeklyAttendanceGrid = (attendance: AttendanceEntry[], cg: boolean) => {
    if (!attendance.length) return <></>;

    const selectedMonth = cg ? selectedMonthCg : selectedMonthChurch;
    const cgMonthAverage = getAttendanceMonthAverage(attendance, selectedMonth);
    const dayOfWeek = new Date(attendance[0].date).getDay();
    const numDaysInMonth = new Date(
      currentYear,
      selectedMonth + 1,
      0,
    ).getDate();

    const daysInMonth = Array.from(
      { length: numDaysInMonth },
      (_, i) => new Date(currentYear, selectedMonth, i + 1),
    ).filter((d) => d.getDay() === dayOfWeek);

    return (
      <div>
        <div className="text-center [@media(min-width:480px)]:text-left text-xl font-semibold text-zinc-900 mb-4">
          {`${new Date(0, selectedMonth).toLocaleString("default", {
            month: "long",
          })} Attendance (${
            cgMonthAverage ? `${String(Math.round(cgMonthAverage))}%` : "–"
          })`}
        </div>
        <div className="flex gap-2 [@media(min-width:480px)]:gap-8 w-full">
          {daysInMonth.map((date, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {getAttendanceGrid(
                attendance.find((a) => a.date.getTime() === date.getTime())
                  ?.didAttend ?? null,
              )}
              <div className="[@media(min-width:480px)]:text-base text-sm mt-2">
                {date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    // <div
    //   className="fixed inset-0 p-6 bg-black/35"
    //   onClick={() => {
    //     setSelectedPerson(null);
    //   }}>
    <div
      className={`mb-10 ml-auto h-auto w-full rounded-2xl ${
        selectedPerson ? "border-2 border-[#DDDDDD]" : ""
      }  bg-white shadow-[2px_2px_14px_0_rgba(0,0,0,0.05)] overflow-hidden transition-[max-height] duration-500 ease-in-out`}
      style={{ maxHeight: selectedPerson ? "2000px" : 0 }}>
      <div className="w-full h-[125px] bg-[#F2F2F2] rounded-t-2xl"></div>
      <div className="pr-8 [@media(min-width:480px)]:pr-16 pl-8 [@media(min-width:480px)]:pl-16 pb-12 flex flex-col -mt-[88px] h-[calc(100%-72px)]">
        <img
          className="[@media(min-width:480px)]:self-start self-center relative h-44 w-44 shrink-0 rounded-full border-[8px] border-white mb-5"
          src={selectedPerson?.person.profile}
          alt={selectedPerson?.person.name}
        />
        <h1 className="text-center [@media(min-width:480px)]:text-left text-3xl font-semibold leading-tight tracking-tight text-zinc-900">
          {selectedPerson?.person.name}
        </h1>
        <div className="text-center [@media(min-width:480px)]:text-left mt-2 flex flex-wrap items-center gap-5 text-sm text-zinc-500">
          {selectedPerson?.person.phoneNumber && (
            <div className="flex items-center gap-2">
              <Icon icon="fa7-solid:phone" color="#898E9B" />
              {selectedPerson.person.phoneNumber}
            </div>
          )}
          {selectedPerson?.person.birthDate && (
            <div className="flex items-center gap-2 text-lg font-medium text-[#898E9B]">
              <Icon
                className="mb-[4px]"
                icon="fa7-solid:birthday-cake"
                color="#898E9B"
              />
              {new Date(selectedPerson.person.birthDate).toLocaleDateString()}
            </div>
          )}
        </div>
        <div>
          {/* {summaryMetrics()} */}

          <h1 className="text-center [@media(min-width:480px)]:text-left mt-5 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 mb-6">
            Monthly CG Attendance
          </h1>
          {monthlyAttendanceChart(selectedPerson?.cgAttendance ?? [], true)}
          {weeklyAttendanceGrid(selectedPerson?.cgAttendance ?? [], true)}
          <h1 className="text-center [@media(min-width:480px)]:text-left text-2xl font-semibold leading-tight tracking-tight text-zinc-900 mt-16 mb-6">
            Monthly Church Attendance
          </h1>
          {monthlyAttendanceChart(
            selectedPerson?.churchAttendance ?? [],
            false,
          )}
          {weeklyAttendanceGrid(selectedPerson?.churchAttendance ?? [], false)}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default PersonPanel;
