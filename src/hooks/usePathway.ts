import { use } from "react";
import { PathwayContext } from "../contexts/PathwayContext";

export function usePathway() {
  const context = use(PathwayContext);
  if (context === undefined) {
    throw new Error("usePathway must be used within a PathwayProvider");
  }
  return context;
}
