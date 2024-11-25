import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function FleetCountSection() {
  const { settings, updateSettings } = useStore();
  const { fleetCount = { birdUnits: 0, eMoobUnits: 0 } } = settings || {};
  
  // Initialize local state with current values from store
  const [localFleetCount, setLocalFleetCount] = useState({
    birdUnits: fleetCount.birdUnits || 0,
    eMoobUnits: fleetCount.eMoobUnits || 0
  });

  // Update local state when store values change
  useEffect(() => {
    setLocalFleetCount({
      birdUnits: fleetCount.birdUnits || 0,
      eMoobUnits: fleetCount.eMoobUnits || 0
    });
  }, [fleetCount.birdUnits, fleetCount.eMoobUnits]);

  const handleUnitChange = (type: 'birdUnits' | 'eMoobUnits', value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalFleetCount(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handleApplyChanges = () => {
    updateSettings({
      fleetCount: localFleetCount
    });
  };

  const hasChanges = 
    localFleetCount.birdUnits !== fleetCount.birdUnits || 
    localFleetCount.eMoobUnits !== fleetCount.eMoobUnits;

  return (
    <div className="settings-card mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="settings-title">Fleet Count</h2>
        <button
          onClick={handleApplyChanges}
          disabled={!hasChanges}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            hasChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          Apply Changes
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            BIRD Units
          </label>
          <input
            type="number"
            min="0"
            value={localFleetCount.birdUnits}
            onChange={(e) => handleUnitChange('birdUnits', e.target.value)}
            className="form-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            e-Moob Units
          </label>
          <input
            type="number"
            min="0"
            value={localFleetCount.eMoobUnits}
            onChange={(e) => handleUnitChange('eMoobUnits', e.target.value)}
            className="form-input w-full"
          />
        </div>
      </div>
    </div>
  );
}