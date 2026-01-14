"use client";

import * as React from "react";
import { toast } from "sonner";

import { DEFAULT_PREFS, JobApplication, SortMode, UserPrefs } from "@/lib/types";
import { STORAGE_KEYS, useLocalStorageState } from "@/lib/storage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function toCsv(apps: JobApplication[]) {
  const headers = [
    "company",
    "role",
    "status",
    "appliedDate",
    "link",
    "notes",
    "createdAt",
    "updatedAt",
  ];

  const escape = (v: unknown) => {
    const s = String(v ?? "");
    // CSV escaping: wrap with quotes and escape quotes by doubling
    return `"${s.replaceAll(`"`, `""`)}"`;
  };

  const rows = apps.map((a) => [
    a.company,
    a.role,
    a.status,
    a.appliedDate ?? "",
    a.link ?? "",
    a.notes ?? "",
    a.createdAt,
    a.updatedAt,
  ]);

  return [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

export function SettingsClient() {
  const [apps, setApps] = useLocalStorageState<JobApplication[]>(STORAGE_KEYS.apps, []);
  const [prefs, setPrefs] = useLocalStorageState<UserPrefs>(STORAGE_KEYS.prefs, DEFAULT_PREFS);

  const appCount = apps.length;

  function toggleDensity() {
    setPrefs((p) => ({
      ...p,
      density: p.density === "compact" ? "comfort" : "compact",
    }));
    toast.success("Density updated.");
  }

  function setDefaultSort(next: SortMode) {
    setPrefs((p) => ({ ...p, defaultSort: next }));
    toast.success("Default sort saved.");
  }

  function exportJson() {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), apps, prefs },
      null,
      2
    );
    downloadTextFile("jobtrack-export.json", payload, "application/json");
    toast.success("Exported JSON.");
  }

  function exportCsv() {
    const csv = toCsv(apps);
    downloadTextFile("jobtrack-applications.csv", csv, "text/csv");
    toast.success("Exported CSV.");
  }

  function clearAppsOnly() {
    setApps([]);
    toast.success("Applications cleared.");
  }

  function clearEverything() {
    setApps([]);
    setPrefs(DEFAULT_PREFS);

    // Also remove keys (clean reset)
    localStorage.removeItem(STORAGE_KEYS.apps);
    localStorage.removeItem(STORAGE_KEYS.prefs);

    toast.success("All data cleared (apps + prefs).");
  }

  return (
    <div className="flex flex-col gap-[var(--jt-space)]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Preferences and data controls. Everything is stored locally in your browser.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Preferences */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">UI preferences</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stored in localStorage so it persists across refresh.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-[var(--jt-space-sm)]">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Density</p>
                <p className="text-sm text-muted-foreground">
                  Current: <span className="font-semibold text-foreground">{prefs.density}</span>
                </p>
              </div>
              <Button variant="secondary" onClick={toggleDensity}>
                Toggle
              </Button>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Default sort</p>
                <p className="text-sm text-muted-foreground">
                  Used as the starting sort on the Tracker page.
                </p>
              </div>

              <select
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                value={prefs.defaultSort}
                onChange={(e) => setDefaultSort(e.target.value as SortMode)}
                aria-label="Default sort"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="company">Company A–Z</option>
                <option value="status">Status</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Data</CardTitle>
            <p className="text-sm text-muted-foreground">
              Export for backup or clear to reset your demo.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-[var(--jt-space-sm)]">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Export</p>
                <p className="text-sm text-muted-foreground">
                  {appCount} application{appCount === 1 ? "" : "s"} stored
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={exportJson}>
                  JSON
                </Button>
                <Button variant="outline" onClick={exportCsv}>
                  CSV
                </Button>
              </div>
            </div>

            {/* Clear applications only */}
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Clear applications</p>
                <p className="text-sm text-muted-foreground">
                  Keeps preferences.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Clear</Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear applications?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes all saved applications from this browser. Preferences will remain.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAppsOnly}>
                      Clear applications
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Clear everything */}
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Factory reset</p>
                <p className="text-sm text-muted-foreground">
                  Clears apps + prefs (full reset).
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary">Reset</Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset everything?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This clears applications and preferences from localStorage. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearEverything}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}