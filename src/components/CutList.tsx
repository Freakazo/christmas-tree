import { TreeCalculation, formatNumber } from '../utils/treeCalculations';

interface CutListProps {
  calculation: TreeCalculation | null;
}

export function CutList({ calculation }: CutListProps) {
  if (!calculation) {
    return null;
  }

  const {
    numberOfLayers,
    totalLayers,
    actualHeight,
    cutAngleDegrees,
    reservedTopPiece,
    warnings,
    stockMaterialNeeded,
  } = calculation;

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2">Heads up</h3>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-emerald-900 mb-3">Material Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-emerald-700">Usable Tree Pieces:</span>
            <span className="font-semibold text-emerald-900">{numberOfLayers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Total Layers Cut (incl. star platform):</span>
            <span className="font-semibold text-emerald-900">{totalLayers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Actual Tree Height:</span>
            <span className="font-semibold text-emerald-900">{formatNumber(actualHeight)} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Cut Angle:</span>
            <span className="font-semibold text-emerald-900">{formatNumber(cutAngleDegrees, 2)}°</span>
          </div>
          <div className="flex justify-between border-t border-emerald-300 pt-2 mt-2">
            <span className="text-emerald-700">Stock Pieces Needed:</span>
            <span className="font-bold text-emerald-900">{stockMaterialNeeded.numberOfStockPieces}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-700">Total Linear Length (incl. star platform):</span>
            <span className="font-bold text-emerald-900">{formatNumber(stockMaterialNeeded.totalLinearMeters, 2)} m</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>Tree Body Linear Length:</span>
            <span className="font-semibold text-emerald-900">{formatNumber(stockMaterialNeeded.usableLinearMeters, 2)} m</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>Reserved Star Platform Length:</span>
            <span className="font-semibold text-emerald-900">
              {reservedTopPiece ? `${formatNumber(stockMaterialNeeded.starPlatformLinearMeters, 3)} m` : '0 m'}
            </span>
          </div>
        </div>
      </div>

      {reservedTopPiece && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <h3 className="text-base font-semibold text-amber-900 mb-2">Reserved Star Platform</h3>
          <p className="text-amber-900 mb-2">
            Cut this piece but keep it flat in storage. It ensures the top of the tree stays level so you can mount a star or topper securely.
          </p>
          <dl className="grid grid-cols-2 gap-2 text-amber-900">
            <div>
              <dt className="text-xs uppercase tracking-wide">Length</dt>
              <dd className="font-semibold">{formatNumber(reservedTopPiece.length, 1)} mm</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Thickness</dt>
              <dd className="font-semibold">{formatNumber(reservedTopPiece.height, 1)} mm</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Width</dt>
              <dd className="font-semibold">{formatNumber(reservedTopPiece.depth, 1)} mm</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Cut Angle</dt>
              <dd className="font-semibold">{formatNumber(reservedTopPiece.cutAngle, 2)}°</dd>
            </div>
          </dl>
        </div>
      )}

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
              {calculation.pieces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    No usable layers remain. Increase the target height or reduce the stock thickness so you can keep a flat star platform.
                  </td>
                </tr>
              ) : (
                calculation.pieces.map((piece, index) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Cutting Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>All pieces should be cut with {formatNumber(cutAngleDegrees, 2)}° angles on both ends</li>
          <li>Ensure the angles are cut in opposite directions to create the taper</li>
          <li>Drill a center hole through each piece for the support rod</li>
          <li>Start assembly from the longest piece (Piece #1) at the bottom</li>
          <li>
            Keep the reserved star platform piece flat; it is counted in your materials but stays off the stack to leave a mounting surface.
          </li>
        </ul>
      </div>
    </div>
  );
}
