import { useTheme } from "next-themes";

export function useDark() {
  const { theme, setTheme } = useTheme();

  function toggle() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return {
    isDark: theme === "dark",
    toggle,
  };
}
