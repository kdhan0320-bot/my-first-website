import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const ThemeModeContext = createContext({ mode: 'light', toggleMode: () => {} });

const getInitialMode = () => {
  try {
    const stored = localStorage.getItem('portfolio-theme-mode');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme-mode', mode); } catch {}
    document.documentElement.setAttribute('data-color-scheme', mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const toggleMode = useCallback(
    () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
