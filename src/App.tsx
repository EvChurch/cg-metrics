import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "reactflow";
import "./App.css";
import OrgChart from "./components/OrgChart.tsx";

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

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* Header */}
          <div className="absolute z-10" style={{ top: "16px", left: "16px" }}>
            <h1 className="text-xl font-bold">EV Serving</h1>
          </div>
          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <OrgChart />
          </div>
        </div>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
