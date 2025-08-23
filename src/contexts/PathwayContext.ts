import { createContext } from "react";
import type { Person } from "../hooks/usePeopleFlowData";

// Types
export interface TeamNodeData {
  id: string;
  name: string;
  description: string;
  people: Person[];
}

export interface SelectedTeamNode {
  data: TeamNodeData;
  id: string;
}

export interface PathwayState {
  selectedTeamNode: SelectedTeamNode | null;
}

export type PathwayAction =
  | { type: "SELECT_TEAM_NODE"; payload: SelectedTeamNode }
  | { type: "DESELECT_TEAM_NODE" };

// Context
interface PathwayContextType {
  state: PathwayState;
  dispatch: React.Dispatch<PathwayAction>;
}

export const PathwayContext = createContext<PathwayContextType | undefined>(
  undefined
);
