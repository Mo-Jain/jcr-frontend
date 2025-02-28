"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ToggleButton } from "./toggle-button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isToggled, setIsToggled] = useState(theme == "light" ? true : false);

  useEffect(() => {
    if (isToggled) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [isToggled, setTheme]);

  return <ToggleButton isToggled={isToggled} setIsToggle={setIsToggled} />;
}
