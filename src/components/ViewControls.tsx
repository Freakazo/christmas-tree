import { EngravingConfig } from '../types/engraving';

interface ViewControlsProps {
  viewMode: 'flat' | 'rotated';
  onViewModeChange: (mode: 'flat' | 'rotated') => void;
  rotationAngle: number;
  onRotationAngleChange: (angle: number) => void;
  calculatedAngle?: number;
  useManualAngle: boolean;
  manualCutAngle?: number;
  onAngleOverrideChange: (enabled: boolean, angle?: number) => void;
  engravingConfig: EngravingConfig;
  onEngravingConfigChange: (config: EngravingConfig) => void;
}

export function ViewControls({
  viewMode,
  onViewModeChange,
  rotationAngle,
  onRotationAngleChange,
  calculatedAngle,
  useManualAngle,
  manualCutAngle,
  onAngleOverrideChange,
  engravingConfig,
  onEngravingConfigChange,
}: ViewControlsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">View Controls</h3>
      
      {/* View Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          View Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('flat')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              viewMode === 'flat'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Flat
          </button>
          <button
            onClick={() => onViewModeChange('rotated')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              viewMode === 'rotated'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rotated
          </button>
        </div>
      </div>

      {/* Rotation Angle Slider (only visible when rotated) */}
      {viewMode === 'rotated' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation Angle: {rotationAngle}°
          </label>
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={rotationAngle}
            onChange={(e) => onRotationAngleChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0°</span>
            <span>45°</span>
          </div>
        </div>
      )}

      {/* Cut Angle Override */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Manual Cut Angle
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useManualAngle}
              onChange={(e) => onAngleOverrideChange(e.target.checked, manualCutAngle)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
        
        {calculatedAngle !== undefined && (
          <p className="text-xs text-gray-500 mb-2">
            Calculated: {calculatedAngle.toFixed(2)}°
          </p>
        )}
        
        {useManualAngle && (
          <div>
            <input
              type="number"
              value={manualCutAngle ?? calculatedAngle ?? 45}
              onChange={(e) => onAngleOverrideChange(true, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Angle in degrees"
              step="0.1"
              min="0"
              max="90"
            />
            <p className="text-xs text-gray-500 mt-1">
              Override the calculated angle (0-90°)
            </p>
          </div>
        )}
      </div>

      {/* Laser Engraving Controls */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Laser Engraving
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={engravingConfig.enabled}
              onChange={(e) => onEngravingConfigChange({
                ...engravingConfig,
                enabled: e.target.checked,
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
        
        {engravingConfig.enabled && (
          <div className="space-y-3">
            {/* Face Selection */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Engrave on:</p>
              <div className="grid grid-cols-2 gap-2">
                {(['top', 'bottom', 'front', 'back', 'left', 'right'] as const).map((face) => (
                  <label key={face} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={engravingConfig.targets[face]}
                      onChange={(e) => onEngravingConfigChange({
                        ...engravingConfig,
                        targets: {
                          ...engravingConfig.targets,
                          [face]: e.target.checked,
                        },
                      })}
                      className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="capitalize">{face}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Repeat Controls */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Pattern Repeat:</p>
              <div className="space-y-2">
                {(['top', 'bottom', 'front', 'back', 'left', 'right'] as const).map((face) => (
                  engravingConfig.targets[face] && (
                    <div key={face} className="flex items-center justify-between">
                      <label className="text-xs capitalize w-16">{face}:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={engravingConfig.repeat[face]}
                        onChange={(e) => onEngravingConfigChange({
                          ...engravingConfig,
                          repeat: {
                            ...engravingConfig.repeat,
                            [face]: parseInt(e.target.value),
                          },
                        })}
                        className="flex-1 mx-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <span className="text-xs text-gray-600 w-8 text-right">
                        {engravingConfig.repeat[face]}x
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Controls:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Left click + drag to rotate view</li>
          <li>Right click + drag to pan</li>
          <li>Scroll to zoom</li>
          <li>Hover over pieces for dimensions</li>
        </ul>
      </div>
    </div>
  );
}
