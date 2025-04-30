"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the theme colors
interface ThemeColors {
  accent: string; // Mustard Yellow
  accentForeground: string; // White or black depending on accent contrast
  background: string; // White
  foreground: string; // Powder Black for primary text
  foregroundSecondary: string; // Lighter black/gray for secondary text
  card: string; // Card background - typically same as background or slightly off-white
  cardForeground: string; // Card text - typically same as foreground
  // Add other colors as needed: borders, rings, etc.
  ring: string; // Accent color for rings
  muted: string; // Muted background like disabled elements (e.g., gray-200)
  mutedForeground: string; // Muted text (e.g., gray-500)
}

// Define the context props
interface ThemeContextProps {
  theme: ThemeColors;
  // setTheme: (theme: ThemeColors) => void; // Add if theme switching is needed later
}

// Define the default theme
// Using Tailwind CSS variable syntax for potential future dynamic theming
// For now, these map directly to the custom colors in tailwind.config.ts
const defaultTheme: ThemeColors = {
  accent: 'hsl(var(--accent))', 
  accentForeground: 'hsl(var(--accent-foreground))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  foregroundSecondary: 'hsl(var(--foreground-secondary))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  ring: 'hsl(var(--ring))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
};

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Create the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // For now, the theme is static. If dynamic themes are needed, use useState here.
  const [theme] = useState<ThemeColors>(defaultTheme); 
  // const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create the useTheme hook for easy access
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 