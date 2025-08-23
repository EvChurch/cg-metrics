import type { Person, Survey } from "../../hooks/usePeopleFlowData";
import PeopleListItem from "./PeopleListItem";

interface PeopleListProps {
  people: Person[];
  surveys: Survey[];
  label: string;
}

function PeopleList({ people, surveys, label }: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="text-center">
        <div className="text-xs text-gray-500">No people</div>
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
