import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "reactflow";
import { useState } from "react";
import "./App.css";
import PeopleFlow from "./components/PeopleFlow.tsx";
import CampusFilterButtons from "./components/CampusFilterButtons.tsx";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000, // 10 seconds
      refetchInterval: 30000, // 30 seconds
      refetchIntervalInBackground: true,
    },
  },
});

function App() {
  console.log("App component rendering");
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>("3");

  const handleCampusFilter = (campusId: string | null) => {
    setSelectedCampusId(campusId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* Campus Filter Buttons */}
          <CampusFilterButtons
            onCampusFilter={handleCampusFilter}
            selectedCampusId={selectedCampusId}
          />

          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <PeopleFlow campusFilter={selectedCampusId} />
          </div>
        </div>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
