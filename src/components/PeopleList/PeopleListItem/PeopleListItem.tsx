import type { Person, Survey } from "../../../hooks/usePeopleFlowData";

interface PeopleListItemProps {
  person: Person;
  survey: Survey | undefined;
  label: string;
}

function PeopleListItem({ person, survey, label }: PeopleListItemProps) {
  const personName = person.fullName || "Unknown";
  const rockUrl = `https://rock.ev.church/Person/${person.id.toString()}`;
  const hasDoneSurvey = survey != null;

  const buttonClass =
    "block text-xs p-1 rounded-l font-semibold text-wrap w-full text-center bg-brand-cool-grey text-brand-dark-grey text-decoration-none hover:bg-gray-300 hover:text-gray-700 transition-colors cursor-pointer";

  return (
    <div className="w-full">
      <div className="flex items-center gap-0">
        <a
          href={rockUrl}
          target="_parent"
          rel="noopener noreferrer"
          className={`flex-1 ${buttonClass}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {personName}
        </a>
        {/* Only show chips for Attending or Growing statuses */}
        {(label === "Attending" || label === "Growing") && (
          <>
            {/* Connect Group Chip */}
            <div
              className={`text-xs p-1 font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                person.cgGroup
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={(e) => {
                e.stopPropagation();
              }}
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
                className={`text-xs p-1 font-semibold cursor-pointer transition-colors flex items-center justify-center w-6 rounded-r ${
                  person.isServing
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title="View Survey"
              >
                S
              </a>
            ) : (
              <div
                className={`text-xs p-1 font-semibold flex items-center justify-center w-6 rounded-r ${
                  person.isServing
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                S
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PeopleListItem;
