import { TreeCalculation, formatNumber } from '../utils/treeCalculations';

interface CutListProps {
  calculation: TreeCalculation | null;
}

export function CutList({ calculation }: CutListProps) {
  if (!calculation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-emerald-900 mb-3">Material Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-emerald-700">Number of Pieces:</span>
            <span className="font-semibold text-emerald-900">{calculation.numberOfLayers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Actual Height:</span>
            <span className="font-semibold text-emerald-900">{formatNumber(calculation.actualHeight)} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Cut Angle:</span>
            <span className="font-semibold text-emerald-900">{formatNumber(calculation.cutAngleDegrees, 2)}°</span>
          </div>
          <div className="flex justify-between border-t border-emerald-300 pt-2 mt-2">
            <span className="text-emerald-700">Stock Pieces Needed:</span>
            <span className="font-bold text-emerald-900">{calculation.stockMaterialNeeded.numberOfStockPieces}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Total Linear Length:</span>
            <span className="font-bold text-emerald-900">{formatNumber(calculation.stockMaterialNeeded.totalLinearMeters, 2)} m</span>
          </div>
        </div>
      </div>

      {/* Cut List Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Cut List</h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Piece
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Length (mm)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Width (mm)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Height (mm)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Angle (°)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calculation.pieces.map((piece, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(piece.length, 1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(piece.depth, 1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(piece.height, 1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(piece.cutAngle, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Cutting Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>All pieces should be cut with {formatNumber(calculation.cutAngleDegrees, 2)}° angles on both ends</li>
          <li>Ensure the angles are cut in opposite directions to create the taper</li>
          <li>Drill a center hole through each piece for the support rod</li>
          <li>Start assembly from the longest piece (Piece #1) at the bottom</li>
        </ul>
      </div>
    </div>
  );
}
