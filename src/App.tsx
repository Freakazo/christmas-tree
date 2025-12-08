import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { TreeViewer3D } from './components/TreeViewer3D';
import { CutList } from './components/CutList';
import { ViewControls } from './components/ViewControls';
import {
  StockDimensions,
  TreeDimensions,
  TreeCalculation,
  calculateTree,
} from './utils/treeCalculations';

function App() {
  const [calculation, setCalculation] = useState<TreeCalculation | null>(null);
  const [viewMode, setViewMode] = useState<'flat' | 'rotated'>('rotated');
  const [rotationAngle, setRotationAngle] = useState<number>(25);
  const [manualCutAngle, setManualCutAngle] = useState<number | undefined>(undefined);
  const [useManualAngle, setUseManualAngle] = useState<boolean>(false);
  const [stockDims, setStockDims] = useState<StockDimensions | null>(null);
  const [treeDims, setTreeDims] = useState<TreeDimensions | null>(null);

  const handleCalculate = (stock: StockDimensions, tree: TreeDimensions) => {
    setStockDims(stock);
    setTreeDims(tree);
    const angleOverride = useManualAngle ? manualCutAngle : undefined;
    const result = calculateTree(stock, tree, angleOverride);
    setCalculation(result);
  };

  const handleAngleOverrideChange = (enabled: boolean, angle?: number) => {
    setUseManualAngle(enabled);
    if (angle !== undefined) {
      setManualCutAngle(angle);
    }
    // Recalculate if we have dimensions
    if (stockDims && treeDims) {
      const angleOverride = enabled ? (angle ?? manualCutAngle) : undefined;
      const result = calculateTree(stockDims, treeDims, angleOverride);
      setCalculation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Christmas Tree Designer
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Design your wooden Christmas tree with precision
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Inputs and Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Dimensions</h2>
              <InputForm onCalculate={handleCalculate} />
            </div>

            {calculation && (
              <ViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                rotationAngle={rotationAngle}
                onRotationAngleChange={setRotationAngle}
                calculatedAngle={calculation.cutAngleDegrees}
                useManualAngle={useManualAngle}
                manualCutAngle={manualCutAngle}
                onAngleOverrideChange={handleAngleOverrideChange}
              />
            )}
          </div>

          {/* Center - 3D Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
              <TreeViewer3D
                calculation={calculation}
                rotationAngle={rotationAngle}
                viewMode={viewMode}
              />
            </div>

            {/* Cut List */}
            {calculation && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <CutList calculation={calculation} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            A tool to help you design and build your wooden Christmas tree
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
