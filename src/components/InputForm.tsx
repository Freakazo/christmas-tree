import { useState, useEffect } from 'react';
import { StockDimensions, TreeDimensions } from '../utils/treeCalculations';

interface InputFormProps {
  onCalculate: (stock: StockDimensions, tree: TreeDimensions) => void;
}

export function InputForm({ onCalculate }: InputFormProps) {
  // Stock dimensions
  const [stockDepth, setStockDepth] = useState<string>('90');
  const [stockHeight, setStockHeight] = useState<string>('35');
  const [stockLength, setStockLength] = useState<string>('2400');

  // Tree dimensions
  const [baseWidth, setBaseWidth] = useState<string>('600');
  const [targetHeight, setTargetHeight] = useState<string>('900');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stock: StockDimensions = {
      depth: parseFloat(stockDepth),
      height: parseFloat(stockHeight),
      length: parseFloat(stockLength),
    };

    const tree: TreeDimensions = {
      baseWidth: parseFloat(baseWidth),
      targetHeight: parseFloat(targetHeight),
    };

    onCalculate(stock, tree);
  };

  const handleChange = () => {
    // Auto-calculate on any input change
    if (stockDepth && stockHeight && stockLength && baseWidth && targetHeight) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  // Auto-calculate on initial load with default values
  useEffect(() => {
    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Material (mm)</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depth (Front to Back)
            </label>
            <input
              type="number"
              value={stockDepth}
              onChange={(e) => {
                setStockDepth(e.target.value);
                handleChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="90"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (Thickness)
            </label>
            <input
              type="number"
              value={stockHeight}
              onChange={(e) => {
                setStockHeight(e.target.value);
                handleChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="35"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Length
            </label>
            <input
              type="number"
              value={stockLength}
              onChange={(e) => {
                setStockLength(e.target.value);
                handleChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="2400"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tree Dimensions (mm)</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Width
            </label>
            <input
              type="number"
              value={baseWidth}
              onChange={(e) => {
                setBaseWidth(e.target.value);
                handleChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="600"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Height
            </label>
            <input
              type="number"
              value={targetHeight}
              onChange={(e) => {
                setTargetHeight(e.target.value);
                handleChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="900"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors font-medium"
      >
        Calculate Tree
      </button>
    </form>
  );
}
