import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Group } from "../utils/types";

import { CgReportContext } from "./CgReportContext";

interface CgReportProviderProps {
  children: ReactNode;
}

export function CgReportProvider({ children }: CgReportProviderProps) {
  const [groups, setGroups] = useState<Group[]>([]);

  const contextValue = useMemo(
    () => ({ groups, setGroups }),
    [groups, setGroups],
  );

  return <CgReportContext value={contextValue}>{children}</CgReportContext>;
}
