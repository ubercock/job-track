"use client";

import * as React from "react";
import { DEFAULT_PREFS, UserPrefs } from "@/lib/types";
import { STORAGE_KEYS, useLocalStorageState } from "@/lib/storage";

/**
 * PrefsSync
 * - Reads saved prefs from localStorage
 * - Applies global attributes (density) to <html>
 * - Keeps UI consistent across pages without needing Context
 */
export function PrefsSync() {
  const [prefs] = useLocalStorageState<UserPrefs>(STORAGE_KEYS.prefs, DEFAULT_PREFS);

  React.useEffect(() => {
    document.documentElement.dataset.density = prefs.density;
  }, [prefs.density]);

  return null;
}
