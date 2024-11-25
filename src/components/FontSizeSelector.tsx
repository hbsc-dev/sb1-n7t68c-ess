import React from 'react';
import { useStore } from '../store/useStore';

export default function FontSizeSelector() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 dark:text-gray-300">Font Size:</span>
      <select
        value={settings.fontSize}
        onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
        className="form-input bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  );
}