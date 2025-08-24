import { usePathway } from "../hooks/usePathway";
import { deselectTeamNode } from "../contexts/pathwayActions";
import PeopleList from "./PeopleList";
import { PeopleFilter } from "./PeopleList";
import { useState, useMemo } from "react";
import type { Person } from "../hooks/usePeopleFlowData";

function TeamNodeDrawer() {
  const { state, dispatch } = usePathway();
  const { selectedTeamNode } = state;
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  const handleClose = () => {
    dispatch(deselectTeamNode());
  };

  // Initialize filtered people when selectedTeamNode changes
  useMemo(() => {
    if (selectedTeamNode) {
      setFilteredPeople(selectedTeamNode.data.people);
    }
  }, [selectedTeamNode]);

  const handleFilterChange = (newFilteredPeople: Person[]) => {
    setFilteredPeople(newFilteredPeople);
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
        selectedTeamNode ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedTeamNode?.data.label ?? "Team Details"}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close drawer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="grow overflow-y-auto">
        <div className="p-4">
          {selectedTeamNode ? (
            <>
              {/* Description - scrolls normally */}
              {selectedTeamNode.data.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedTeamNode.data.description}
                </p>
              )}

              {/* Sticky Filter - sticks to top when scrolled */}
              <div className="sticky top-0 bg-white z-10 pt-4 -mx-4 px-4 border-b border-gray-100">
                <PeopleFilter
                  key={selectedTeamNode.id}
                  people={selectedTeamNode.data.people}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* People List */}
              <div>
                <PeopleList
                  people={filteredPeople}
                  surveys={[]}
                  label={selectedTeamNode.data.label}
                  hasActiveFilters={
                    filteredPeople.length !==
                    selectedTeamNode.data.people.length
                  }
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a team node to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamNodeDrawer;
