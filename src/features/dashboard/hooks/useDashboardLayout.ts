import { useState, useEffect } from 'react';

export interface DashboardSettings {
  visibleWidgets: Record<string, boolean>;
  heroAtStart: boolean;
}

const STORAGE_KEY = 'aline_dashboard_settings';

const DEFAULT_SETTINGS: DashboardSettings = {
  visibleWidgets: {
    'stats-leads': true,
    'stats-conv': true,
    'stats-pipeline': true,
    'hero': true,
    'revenue': true,
    'breakdown': true,
    'winrate': true,
    'calendar': true,
    'tasks': true,
    'campaigns': true,
    'leads-contacts': true,
  },
  heroAtStart: false,
};

export const useDashboardLayout = () => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse dashboard settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const onToggleWidget = (id: string) => {
    setSettings(prev => ({
      ...prev,
      visibleWidgets: {
        ...prev.visibleWidgets,
        [id]: !prev.visibleWidgets[id]
      }
    }));
  };

  const setHeroAtStart = (atStart: boolean) => {
    setSettings(prev => ({
      ...prev,
      heroAtStart: atStart
    }));
  };

  const onResetLayout = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    isCustomizerOpen,
    setIsCustomizerOpen,
    visibleWidgets: settings.visibleWidgets,
    heroAtStart: settings.heroAtStart,
    onToggleWidget,
    setHeroAtStart,
    onResetLayout,
  };
};
