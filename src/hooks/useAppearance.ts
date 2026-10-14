import { useEffect, useState } from "react";

type Appearance = "light" | "dark";

function currentAppearance(): Appearance {
  const selected = document.documentElement.dataset.theme;
  if (selected === "light" || selected === "dark") return selected;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>(currentAppearance);

  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (document.documentElement.dataset.theme === "system") {
        setAppearance(system.matches ? "dark" : "light");
      }
    };
    system.addEventListener("change", followSystem);
    return () => system.removeEventListener("change", followSystem);
  }, []);

  function toggleAppearance() {
    const next = appearance === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setAppearance(next);
    try {
      localStorage.setItem("ak-appearance", next);
    } catch {
      // A blocked storage API still allows switching for the current page.
    }
  }

  return { appearance, toggleAppearance };
}
