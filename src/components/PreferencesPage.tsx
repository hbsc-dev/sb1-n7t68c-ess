import React from 'react';
import { Moon, Sun, Type } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function PreferencesPage() {
  const { settings, updateSettings } = useStore();

  const handleThemeChange = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize: size });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="modern-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">Preferences</h2>
        
        <div className="space-y-8">
          {/* Theme Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Theme
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose between light and dark theme
                </p>
              </div>
              <button
                onClick={handleThemeChange}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {settings.theme === 'light' ? (
                  <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Font Size Selection */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Font Size
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust the text size for better readability
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    settings.fontSize === size
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <span className={`
                    ${size === 'small' ? 'text-sm' : ''}
                    ${size === 'medium' ? 'text-base' : ''}
                    ${size === 'large' ? 'text-lg' : ''}
                  `}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}