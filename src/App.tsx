import { ReactFlowProvider } from "reactflow";
import "./App.css";
import testData from "./utils/cg-metrics-test.json";
import CoachMetrics from "./components/CoachMetrics.tsx";
import { CgReportProvider } from "./contexts/CgReportProvider.tsx";
import type { Group } from "./hooks/useCgMetricsData.ts";

function App() {
  return (
    <CgReportProvider>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <CoachMetrics groups={testData as Group[]} />
          </div>
        </div>
      </ReactFlowProvider>
    </CgReportProvider>
  );
}

export default App;
