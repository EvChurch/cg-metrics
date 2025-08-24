import type { Person, Survey } from "../../../hooks/usePeopleFlowData";

interface PeopleListItemProps {
  person: Person;
  survey: Survey | undefined;
  label?: string;
}

function PeopleListItem({ person, survey, label }: PeopleListItemProps) {
  const personName = person.fullName || "Unknown";
  const hasDoneSurvey = survey != null;

  return (
    <div className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors">
      {/* Person link - avatar and name */}
      <a
        className="flex items-center gap-2 grow cursor-pointer"
        href={`https://rock.ev.church/Person/${person.id.toString()}`}
        target="_parent"
        rel="noopener noreferrer"
      >
        <img
          src={`https://rock.ev.church/GetAvatar.ashx?PersonId=${person.id.toString()}&Size=32`}
          alt={personName}
          className="w-6 h-6 rounded-full"
        />
        <div className="font-semibold text-wrap text-gray-700">
          {personName}
        </div>
      </a>

      {/* Only show chips for Attending or Growing statuses */}
      {(label === "Attending" || label === "Growing") && (
        <>
          {/* Connect Group Chip */}
          <div
            className={`text-xs p-1 font-semibold flex items-center justify-center cursor-pointer transition-colors rounded ${
              person.cgGroup
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-500"
            }`}
            title={person.cgGroup ?? undefined}
          >
            CG
          </div>
          {/* Serving Chip */}
          {hasDoneSurvey ? (
            <a
              href={`https://rock.ev.church/Workflow/${survey.formId}`}
              target="_parent"
              rel="noopener noreferrer"
              className={`text-xs p-1 font-semibold cursor-pointer transition-colors flex items-center justify-center w-6 rounded ${
                person.isServing
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
              }`}
              title="View Survey"
            >
              S
            </a>
          ) : (
            <div
              className={`text-xs p-1 font-semibold flex items-center justify-center w-6 rounded ${
                person.isServing
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              S
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PeopleListItem;
