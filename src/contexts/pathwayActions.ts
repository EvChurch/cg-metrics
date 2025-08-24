import type { SelectedTeamNode, PathwayAction } from "./PathwayContext";

// Action creators
export const selectTeamNode = (teamNode: SelectedTeamNode): PathwayAction => ({
  type: "SELECT_TEAM_NODE",
  payload: teamNode,
});

export const deselectTeamNode = (): PathwayAction => ({
  type: "DESELECT_TEAM_NODE",
});
