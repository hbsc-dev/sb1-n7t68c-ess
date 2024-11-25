import { AppSettings } from '../types';

const SETTINGS_KEY = 'app-settings';

const defaultSettings: AppSettings = {
  fontSize: 'medium',
  theme: 'dark',
  fleetCount: {
    birdUnits: 0,
    eMoobUnits: 0
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  
  // Apply theme
  if (settings.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Apply font size
  document.body.className = `text-size-${settings.fontSize}`;
};