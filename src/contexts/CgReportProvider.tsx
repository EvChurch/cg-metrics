import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Group } from "../utils/types";

import { CgReportContext } from "./CgReportContext";

interface CgReportProviderProps {
  children: ReactNode;
}

export function CgReportProvider({ children }: CgReportProviderProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const contextValue = useMemo(
    () => ({ groups, setGroups, selectedPersonId, setSelectedPersonId }),
    [groups, setGroups, selectedPersonId, setSelectedPersonId]
  );

  return <CgReportContext value={contextValue}>{children}</CgReportContext>;
}
