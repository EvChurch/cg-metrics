import { ReactFlowProvider } from "reactflow";
import { useState } from "react";
import "./App.css";
import PeopleFlow from "./components/PeopleFlow.tsx";
import CampusFilterButtons from "./components/CampusFilterButtons.tsx";
import TeamNodeDrawer from "./components/TeamNodeDrawer.tsx";
import { PathwayProvider } from "./contexts/PathwayProvider.tsx";

function App() {
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>("3");

  return (
    <PathwayProvider>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* Campus Filter Buttons */}
          <CampusFilterButtons
            onCampusFilter={setSelectedCampusId}
            selectedCampusId={selectedCampusId}
          />

          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <PeopleFlow campusFilter={selectedCampusId} />
          </div>

          {/* Team Node Drawer */}
          <TeamNodeDrawer />
        </div>
      </ReactFlowProvider>
    </PathwayProvider>
  );
}

export default App;
