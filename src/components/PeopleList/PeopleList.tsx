import type { Person, Survey } from "../../hooks/usePeopleFlowData";
import PeopleListItem from "./PeopleListItem";

interface PeopleListProps {
  people: Person[];
  surveys: Survey[];
  label?: string;
  hasActiveFilters?: boolean;
}

function PeopleList({
  people,
  surveys,
  label,
  hasActiveFilters,
}: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="text-center mt-4">
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg py-3 px-4 border border-gray-200">
          {hasActiveFilters
            ? "No people match your filters."
            : `No people in this ${label ?? "category"}`}
        </div>
      </div>
    );
  }

  const surveyMap = new Map(surveys.map((survey) => [survey.personId, survey]));

  return (
    <div className="flex flex-col divide-y-2 divide-gray-100 mx-[-16px]">
      {people.map((person) => (
        <PeopleListItem
          key={person.id}
          person={person}
          survey={surveyMap.get(person.id.toString())}
          label={label}
        />
      ))}
    </div>
  );
}

export default PeopleList;
