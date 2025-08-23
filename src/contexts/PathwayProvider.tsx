import { useReducer, useMemo } from "react";
import type { ReactNode } from "react";
import { PathwayContext } from "./PathwayContext";
import type { PathwayState, PathwayAction } from "./PathwayContext";

// Initial state
const initialState: PathwayState = {
  selectedTeamNode: null,
};

// Reducer
function pathwayReducer(
  state: PathwayState,
  action: PathwayAction
): PathwayState {
  switch (action.type) {
    case "SELECT_TEAM_NODE":
      return {
        ...state,
        selectedTeamNode: action.payload,
      };
    case "DESELECT_TEAM_NODE":
      return {
        ...state,
        selectedTeamNode: null,
      };
    default:
      return state;
  }
}

// Provider component
interface PathwayProviderProps {
  children: ReactNode;
}

export function PathwayProvider({ children }: PathwayProviderProps) {
  const [state, dispatch] = useReducer(pathwayReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <PathwayContext value={contextValue}>{children}</PathwayContext>;
}
