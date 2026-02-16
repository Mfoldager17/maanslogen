"use client";

import { useCallback, useState } from "react";

const THEMES = [
  { id: "", label: "Standard" },
  { id: "dark", label: "Mørk" },
] as const;

const STORAGE_KEY = "maanslogen-admin-theme";
const COOKIE_NAME = "maanslogen-admin-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 år

function setThemeCookie(value: string) {
  const sameSite = "Lax";
  const path = "/";
  if (value) {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=${path}; max-age=${COOKIE_MAX_AGE}; SameSite=${sameSite}`;
  } else {
    document.cookie = `${COOKIE_NAME}=; path=${path}; max-age=0; SameSite=${sameSite}`;
  }
}

export function ThemeSwitcher({ initialTheme = "" }: { initialTheme?: string }) {
  const [theme, setThemeState] = useState<string>(initialTheme);

  const setTheme = useCallback((id: string) => {
    setThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    setThemeCookie(id);
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground-muted text-xs font-medium">Tema</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="rounded border border-border bg-background-elevated text-foreground shadow-sm px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent"
        aria-label="Vælg tema"
      >
        {THEMES.map((t) => (
          <option key={t.id || "default"} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
