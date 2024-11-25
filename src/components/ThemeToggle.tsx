import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ThemeToggle() {
  const { settings, updateSettings } = useStore();
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {settings.theme === 'light' ? (
        <Moon className="w-5 h-5 text-[#8E8E93] hover:text-white" />
      ) : (
        <Sun className="w-5 h-5 text-[#98989D] hover:text-white" />
      )}
    </button>
  );
}