import "./App.css";
import CoachMetrics from "./components/CoachMetrics.tsx";
import PersonPanel from "./components/PersonPanel.tsx";
import { CgReportProvider } from "./contexts/CgReportProvider.tsx";

function App() {
  return (
    <CgReportProvider>
      <CoachMetrics />
      <PersonPanel />
    </CgReportProvider>
  );
}

export default App;
