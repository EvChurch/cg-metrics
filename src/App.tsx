import { ReactFlowProvider } from 'reactflow';
import './App.css';
import { PathwayProvider } from './contexts/PathwayProvider.tsx';
import testData from './utils/cg-metrics-test.json';
import type { Group } from './utils/cgMetricsTypes.ts';
import CoachMetrics from './components/CoachMetrics.tsx';

function App() {
  return (
    <PathwayProvider>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          {/* React Flow Container */}
          <div className="flex-1 w-full overflow-hidden">
            <CoachMetrics groups={testData as Group[]} />
          </div>
        </div>
      </ReactFlowProvider>
    </PathwayProvider>
  );
}

export default App;
