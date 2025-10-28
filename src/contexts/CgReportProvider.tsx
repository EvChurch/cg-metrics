import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Group, PersonAttendance } from "../utils/types";

import { CgReportContext } from "./CgReportContext";

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
