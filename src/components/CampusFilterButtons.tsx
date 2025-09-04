interface CampusFilterButtonsProps {
  onCampusFilter: (campusIds: string[]) => void;
  selectedCampusIds: string[];
}

const CampusFilterButtons = ({
  onCampusFilter,
  selectedCampusIds,
}: CampusFilterButtonsProps) => {
  const campuses = [
    { id: "3", label: "Central" },
    { id: "2", label: "North" },
    { id: "4", label: "Unichurch" },
  ];

  const handleCampusToggle = (campusId: string) => {
    if (selectedCampusIds.includes(campusId)) {
      // Remove campus from selection
      onCampusFilter(selectedCampusIds.filter((id) => id !== campusId));
    } else {
      // Add campus to selection
      onCampusFilter([...selectedCampusIds, campusId]);
    }
  };

  const handleAllToggle = () => {
    if (selectedCampusIds.length === campuses.length) {
      // If all are selected, deselect all
      onCampusFilter([]);
    } else {
      // Select all campuses
      onCampusFilter(campuses.map((campus) => campus.id));
    }
  };

  const allSelected = selectedCampusIds.length === campuses.length;

  return (
    <div className="absolute z-10 bottom-2 left-2 sm:bottom-4 sm:left-4 flex flex-row gap-1 sm:gap-2">
      {/* ALL Button */}
      <button
        type="button"
        onClick={handleAllToggle}
        className={`font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md shadow-lg text-sm sm:text-base border-0 focus:outline-none ${
          allSelected
            ? "bg-green-500 text-white"
            : "bg-gray-300 hover:bg-gray-400 text-white cursor-pointer"
        }`}
      >
        ALL
      </button>

      {/* Individual Campus Buttons */}
      {campuses.map((campus) => (
        <button
          key={campus.id}
          type="button"
          onClick={() => {
            handleCampusToggle(campus.id);
          }}
          className={`font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md shadow-lg text-sm sm:text-base border-0 focus:outline-none ${
            selectedCampusIds.includes(campus.id)
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
