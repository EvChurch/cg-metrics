import { use } from "react";

import { CgReportContext } from "../contexts/CgReportContext";

export function useCgReport() {
  const context = use(CgReportContext);
  if (context === undefined) {
    throw new Error("useCgReport must be used within a CgReportProvider");
  }
  return context;
}
