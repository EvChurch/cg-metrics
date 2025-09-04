import { ReactFlowProvider } from "reactflow";
import { useState } from "react";
import "./App.css";
import PeopleFlow from "./components/PeopleFlow.tsx";
import CampusFilterButtons from "./components/CampusFilterButtons.tsx";
import TeamNodeDrawer from "./components/TeamNodeDrawer.tsx";
import { PathwayProvider } from "./contexts/PathwayProvider.tsx";

function App() {
  const [selectedCampusIds, setSelectedCampusIds] = useState<string[]>(["3"]);

  return (
    <PathwayProvider>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* Campus Filter Buttons */}
          <CampusFilterButtons
            onCampusFilter={setSelectedCampusIds}
            selectedCampusIds={selectedCampusIds}
          />

          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <PeopleFlow campusFilter={selectedCampusIds} />
          </div>

          {/* Team Node Drawer */}
          <TeamNodeDrawer />
        </div>
      </ReactFlowProvider>
    </PathwayProvider>
  );
}

export default App;
