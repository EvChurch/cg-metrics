import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CgReportContext } from "./CgReportContext";
import type { Group, PersonAttendance } from "../hooks/useCgMetricsData";

interface CgReportProviderProps {
  children: ReactNode;
}

export function CgReportProvider({ children }: CgReportProviderProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonAttendance | null>(
    null
  );

  const contextValue = useMemo(
    () => ({ groups, setGroups, selectedPerson, setSelectedPerson }),
    [groups, setGroups, selectedPerson, setSelectedPerson]
  );

  return <CgReportContext value={contextValue}>{children}</CgReportContext>;
}
