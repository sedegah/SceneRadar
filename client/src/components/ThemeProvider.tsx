import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access browser APIs if running in the browser
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const storedTheme = localStorage.getItem("theme") as Theme;
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
      
      // Then check user's system preferences
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    
    return "light";
  });

  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // Remove the previous theme class
      root.classList.remove("dark", "light");
      
      // Add the current theme class
      if (theme === "dark") {
        root.classList.add("dark");
      }
      
      // Store the theme preference in localStorage
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
