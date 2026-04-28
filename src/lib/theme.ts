/** Persisted preference for `document.documentElement` light/dark (see `index.css` `html.dark`). */
export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark";

export function getStoredTheme(): ThemePreference | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* ignore */
  }
  return null;
}

/** Sync `<html>` class `dark` with preference; persists when `persist` is true. */
export function applyTheme(preference: ThemePreference, persist: boolean) {
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      /* ignore */
    }
  }
  document.documentElement.classList.toggle("dark", preference === "dark");
}

export function resolvedTheme(initial: ThemePreference | null): ThemePreference {
  return initial ?? "light";
}
