import { createContext } from "react";

import type { Group } from "../utils/types";

interface CgReportContextType {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
}

export const CgReportContext = createContext<CgReportContextType | undefined>(
  undefined,
);
