import { createContext } from "react";
import type { Group, PersonAttendance } from "../hooks/useCgMetricsData";

interface CgReportContextType {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  selectedPerson: PersonAttendance | null;
  setSelectedPerson: (person: PersonAttendance | null) => void;
}

export const CgReportContext = createContext<CgReportContextType | undefined>(
  undefined
);
