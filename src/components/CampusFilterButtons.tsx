interface CampusFilterButtonsProps {
  onCampusFilter: (campusId: string | null) => void;
  selectedCampusId?: string | null;
}

const CampusFilterButtons = ({
  onCampusFilter,
  selectedCampusId,
}: CampusFilterButtonsProps) => {
  const campuses = [
    { id: "3", label: "Central" },
    { id: "2", label: "North" },
    { id: "4", label: "Unichurch" },
  ];

  return (
    <div className="absolute z-10 bottom-2 left-2 sm:bottom-4 sm:left-4 flex flex-row gap-1 sm:gap-2">
      {campuses.map((campus) => (
        <button
          key={campus.id}
          type="button"
          onClick={() =>
            { onCampusFilter(selectedCampusId === campus.id ? null : campus.id); }
          }
          className={`font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-md shadow-lg text-xs sm:text-sm border-0 focus:outline-none ${
            selectedCampusId === campus.id
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-white cursor-pointer"
          }`}
        >
          {campus.label}
        </button>
      ))}
    </div>
  );
};

export default CampusFilterButtons;
