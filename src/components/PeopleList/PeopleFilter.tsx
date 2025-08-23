import { useState, useMemo } from "react";
import type { Person } from "../../hooks/usePeopleFlowData";

interface PeopleFilterProps {
  people: Person[];
  onFilterChange: (filteredPeople: Person[]) => void;
}

function PeopleFilter({ people, onFilterChange }: PeopleFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyCG, setShowOnlyCG] = useState(false);
  const [showOnlyServing, setShowOnlyServing] = useState(false);

  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => {
        // Text search filter
        const matchesSearch = person.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // CG group filter
        const matchesCG = !showOnlyCG || person.cgGroup;

        // Serving filter
        const matchesServing = !showOnlyServing || person.isServing;

        return matchesSearch && matchesCG && matchesServing;
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [people, searchTerm, showOnlyCG, showOnlyServing]);

  // Update parent component when filters change
  useMemo(() => {
    onFilterChange(filteredPeople);
  }, [filteredPeople, onFilterChange]);

  const cgCount = people.filter((p) => p.cgGroup).length;
  const servingCount = people.filter((p) => p.isServing).length;

  return (
    <div className="mb-4 space-y-3">
      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search people by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
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
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {/* CG Filter Chip - only show if there are people with CG groups */}
        {cgCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setShowOnlyCG(!showOnlyCG);
            }}
            className={`text-xs px-3 py-1.5 font-semibold rounded-full transition-colors ${
              showOnlyCG
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            CG ({cgCount})
          </button>
        )}

        {/* Serving Filter Chip - only show if there are people serving */}
        {servingCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setShowOnlyServing(!showOnlyServing);
            }}
            className={`text-xs px-3 py-1.5 font-semibold rounded-full transition-colors ${
              showOnlyServing
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-400"
            }`}
          >
            S ({servingCount})
          </button>
        )}

        {/* Clear Filters Button */}
        {(searchTerm || showOnlyCG || showOnlyServing) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setShowOnlyCG(false);
              setShowOnlyServing(false);
            }}
            className="text-xs px-3 py-1.5 font-semibold rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500">
        Showing {filteredPeople.length} of {people.length} people
      </div>
    </div>
  );
}

export default PeopleFilter;
