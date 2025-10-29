import "./App.css";
import CoachMetrics from "./components/CoachMetrics.tsx";
import { CgReportProvider } from "./contexts/CgReportProvider.tsx";

function App() {
  return (
    <CgReportProvider>
      <CoachMetrics />
    </CgReportProvider>
  );
}

export default App;
