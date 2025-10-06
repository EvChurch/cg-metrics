import { createContext } from "react";

import type { Group } from "../utils/types";

interface CgReportContextType {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  selectedPersonId: number | null;
  setSelectedPersonId: (id: number | null) => void;
}

export const CgReportContext = createContext<CgReportContextType | undefined>(
  undefined
);
