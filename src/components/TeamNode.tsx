import { memo, useMemo, useRef, useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { Person } from "../hooks/usePeopleFlowData";
import { updateNodeDimensions } from "../utils/layoutUtils";

interface Survey {
  personId: string;
  formId: string;
}

interface TeamNodeData {
  label?: string;
  description?: string;
  people: Person[];
  surveys?: Survey[];
}

const TeamNode = memo(({ data, id }: NodeProps<TeamNodeData>) => {
  const { label, description, people, surveys = [] } = data;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Measure and update node dimensions when content changes
  useEffect(() => {
    if (nodeRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          updateNodeDimensions(id, width, height);
        }
      });

      resizeObserver.observe(nodeRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [id, isExpanded]);

  // Memoize the people list to prevent unnecessary re-renders
  const peopleList = useMemo(() => {
    if (!people || people.length === 0) {
      return (
        <div className="text-center">
          <div className="text-xs text-gray-500">No people</div>
        </div>
      );
    }

    // Create a map of person ID to survey for quick lookup
    const surveyMap = new Map(
      surveys.map((survey) => [survey.personId, survey])
    );

    return (
      <div className="grid grid-cols-2 gap-2 w-full">
        {people.map((person) => {
          const personName = person.fullName || "Unknown";
          const rockUrl = `https://rock.ev.church/Person/${person.id}`;
          const survey = surveyMap.get(person.id.toString());
          const hasDoneSurvey = !!survey;

          const buttonClass =
            "block text-xs p-1 rounded-l font-semibold text-wrap w-full text-center bg-brand-cool-grey text-brand-dark-grey text-decoration-none hover:bg-gray-300 hover:text-gray-700 transition-colors cursor-pointer";

          return (
            <div key={person.id} className="w-full">
              <div className="flex items-center gap-0">
                <a
                  href={rockUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 ${buttonClass}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {personName}
                </a>
                {/* Only show chips for Attending or Growing statuses */}
                {(label === "Attending" || label === "Growing") && (
                  <>
                    {/* Connect Group Chip */}
                    <div
                      className={`text-xs p-1 font-semibold flex items-center justify-center ${
                        person.isInCG
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      CG
                    </div>
                    {/* Serving Chip */}
                    {hasDoneSurvey && survey ? (
                      <a
                        href={`https://rock.ev.church/Workflow/${survey.formId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs p-1 font-semibold cursor-pointer transition-colors flex items-center justify-center w-6 rounded-r ${
                          person.isServing
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                        }`}
                        onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        S
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [people, surveys]);

  const handleNodeClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={nodeRef}
      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 w-[400px] shadow-md -mt-1 cursor-pointer hover:border-gray-300 transition-all duration-300 ease-in-out"
      onClick={handleNodeClick}
    >
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <Handle
        id="top-out"
        type="source"
        position={Position.Top}
        className="w-0 h-0 opacity-0"
      />
      <div
        className="flex flex-col items-center transition-all duration-300 ease-in-out"
        style={{
          height: isExpanded ? "auto" : "fit-content",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <h4 className="font-semibold text-lg text-brand-black break-words leading-tight mt-2">
            {label} ({people.length})
          </h4>
          <div className="text-gray-400 text-sm">{isExpanded ? "▼" : "▶"}</div>
        </div>
        {description && (
          <div className="text-xs text-gray-600 mb-2 px-2">{description}</div>
        )}
        <div
          className={`overflow-hidden w-full transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-max opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {peopleList}
        </div>
      </div>
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
      />
      <Handle
        id="bottom-in"
        type="target"
        position={Position.Bottom}
        className="w-0 h-0 opacity-0"
        style={{ bottom: "6px" }}
      />
    </div>
  );
});

TeamNode.displayName = "TeamNode";

export default TeamNode;
