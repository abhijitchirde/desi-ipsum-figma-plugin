import * as React from "react";

export interface FigmaTheme {
  theme: "light" | "dark";
  isDark: boolean;
  toggleTheme: () => void;
}

export function useFigmaTheme(): FigmaTheme {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  // Function to toggle theme
  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    // Notify Figma about theme change
    if (typeof parent !== "undefined" && parent.postMessage) {
      parent.postMessage(
        {
          pluginMessage: {
            type: "theme-changed",
            theme: newTheme,
          },
        },
        "*"
      );
    }
  }, [theme]);

  React.useEffect(() => {
    // Function to detect theme from Figma
    const detectTheme = () => {
      // Check if we're in Figma environment
      if (typeof parent !== "undefined" && parent.postMessage) {
        // Request theme information from Figma
        parent.postMessage(
          {
            pluginMessage: {
              type: "get-theme",
            },
          },
          "*"
        );
      } else {
        // Fallback: detect theme from system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const initialTheme = prefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
      }
    };

    // Listen for theme changes from Figma
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage?.type === "theme-changed") {
        const figmaTheme = event.data.pluginMessage.theme;
        setTheme(figmaTheme);
        document.documentElement.setAttribute("data-theme", figmaTheme);
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only apply system theme if we're not in Figma environment
      if (typeof parent === "undefined" || !parent.postMessage) {
        const systemTheme = e.matches ? "dark" : "light";
        setTheme(systemTheme);
        document.documentElement.setAttribute("data-theme", systemTheme);
      }
    };

    // Initial theme detection
    detectTheme();

    // Set up event listeners
    window.addEventListener("message", handleMessage);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
}
