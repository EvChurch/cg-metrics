import { memo, useState, useEffect, useMemo } from "react";
import type { Group } from "../hooks/useOrgChartData";

interface FilterState {
  combinations: string[];
}

interface ChartFilterProps {
  onFilterChange: (filters: FilterState) => void;
  groups?: Group[];
}

const ChartFilter = memo(
  ({ onFilterChange, groups = [] }: ChartFilterProps) => {
    const categories = ["MAG", "MIS", "MEM", "MAT", "MIN", "M SUP", "KIDS"];
    const locations = ["CT", "NS", "UC", "HQ"];
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // Get valid combinations from groups data
    const validCombinations = useMemo(() => {
      const combinations = new Set<string>();

      groups.forEach((group) => {
        const name = group.Name.toUpperCase();
        const patterns = [/^(CT|NS|UC)\s+(.+)$/, /^(~HQ)\s+(.+)$/];

        patterns.forEach((pattern) => {
          const match = name.match(pattern);
          if (match) {
            const location = match[1] === "~HQ" ? "HQ" : match[1];
            const category = match[2];
            const validCategories = [
              "MAG",
              "MAT",
              "MIS",
              "MEM",
              "MIN",
              "M SUP",
              "KIDS",
            ];

            if (
              location &&
              category &&
              validCategories.includes(category.toUpperCase())
            ) {
              combinations.add(`${location} ${category.toUpperCase()}`);
            }
          }
        });
      });

      return combinations;
    }, [groups]);

    const toggleFilter = (location: string, category: string) => {
      const filterString = `${location} ${category}`;
      setSelectedFilters((prev) =>
        prev.includes(filterString)
          ? prev.filter((f) => f !== filterString)
          : [...prev, filterString]
      );
    };

    const isSelected = (location: string, category: string) => {
      return selectedFilters.includes(`${location} ${category}`);
    };

    const isValid = (location: string, category: string) => {
      return validCombinations.has(`${location} ${category}`);
    };

    // Convert selectedFilters to FilterState format
    useEffect(() => {
      onFilterChange({
        combinations: selectedFilters,
      });
    }, [selectedFilters, onFilterChange]);

    return (
      <div className="absolute left-4 bottom-4 z-10 bg-white border border-gray-300 rounded-lg shadow-md p-4 pointer-events-none">
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Filters</h3>
        <div className="flex space-x-2">
          {/* Location buttons */}
          <div className="flex flex-col items-center justify-end">
            <div className="flex flex-col space-y-1">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => {
                    const locationFilters = categories
                      .filter((cat) => isValid(location, cat))
                      .map((cat) => `${location} ${cat}`);

                    // If all location filters are selected, remove them all
                    const allSelected = locationFilters.every((filter) =>
                      selectedFilters.includes(filter)
                    );

                    if (allSelected) {
                      setSelectedFilters((prev) =>
                        prev.filter(
                          (filter) => !locationFilters.includes(filter)
                        )
                      );
                    } else {
                      // Add all valid location filters
                      setSelectedFilters((prev) => {
                        const newFilters = [...prev];
                        locationFilters.forEach((filter) => {
                          if (!newFilters.includes(filter)) {
                            newFilters.push(filter);
                          }
                        });
                        return newFilters;
                      });
                    }
                  }}
                  className={`font-bold text-white px-2 py-1 text-xs rounded transition-colors focus:outline-none pointer-events-auto ${
                    categories
                      .filter((cat) => isValid(location, cat))
                      .every((cat) => isSelected(location, cat))
                      ? "bg-brand-rich-red hover:bg-brand-deep-red"
                      : "bg-brand-mid-grey hover:bg-brand-rich-red hover:border-brand-rich-red"
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Category columns */}
          {categories.map((category) => (
            <div key={category} className="flex flex-col items-center">
              <button
                onClick={() => {
                  const categoryFilters = locations
                    .filter((loc) => isValid(loc, category))
                    .map((loc) => `${loc} ${category}`);

                  // If all category filters are selected, remove them all
                  const allSelected = categoryFilters.every((filter) =>
                    selectedFilters.includes(filter)
                  );

                  if (allSelected) {
                    setSelectedFilters((prev) =>
                      prev.filter((filter) => !categoryFilters.includes(filter))
                    );
                  } else {
                    // Add all valid category filters
                    setSelectedFilters((prev) => {
                      const newFilters = [...prev];
                      categoryFilters.forEach((filter) => {
                        if (!newFilters.includes(filter)) {
                          newFilters.push(filter);
                        }
                      });
                      return newFilters;
                    });
                  }
                }}
                className={`font-bold text-white px-2 py-1 rounded mb-2 transition-colors h-[30px] focus:outline-none pointer-events-auto ${
                  category === "M SUP" ? "text-xs" : "text-sm"
                } ${
                  locations
                    .filter((loc) => isValid(loc, category))
                    .every((loc) => isSelected(loc, category))
                    ? "bg-brand-rich-red hover:bg-brand-deep-red "
                    : "bg-brand-mid-grey hover:bg-brand-rich-red hover:border-brand-rich-red"
                }`}
              >
                {category}
              </button>
              <div className="flex flex-col space-y-1">
                {locations.map((location) => {
                  const valid = isValid(location, category);
                  const selected = isSelected(location, category);
                  return (
                    <button
                      key={location}
                      onClick={() => toggleFilter(location, category)}
                      disabled={!valid}
                      className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none pointer-events-auto ${
                        selected
                          ? "font-bold bg-brand-rich-red hover:bg-brand-rich-red text-white hover:border-brand-rich-red"
                          : "font-medium bg-brand-white text-brand-cool-grey hover:text-brand-mid-grey border-brand-cool-grey hover:bg-brand-cool-grey hover:border-brand-cool-grey"
                      }   ${!valid ? "invisible" : ""}`}
                    >
                      {location}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ChartFilter.displayName = "ChartFilter";

export default ChartFilter;
