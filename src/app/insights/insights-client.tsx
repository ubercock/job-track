"use client";

import * as React from "react";
import { JobApplication, STATUS_LABEL, STATUS_ORDER } from "@/lib/types";
import { STORAGE_KEYS, useLocalStorageState } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InsightsClient() {
  const [apps] = useLocalStorageState<JobApplication[]>(STORAGE_KEYS.apps, []);

  const totals = React.useMemo(() => {
    const total = apps.length;
    const counts = Object.fromEntries(
      STATUS_ORDER.map((s) => [s, apps.filter((a) => a.status === s).length])
    ) as Record<(typeof STATUS_ORDER)[number], number>;

    return { total, counts };
  }, [apps]);

  const topCompanies = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const a of apps) map.set(a.company, (map.get(a.company) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [apps]);

  const maxCount = Math.max(1, ...Object.values(totals.counts));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Lightweight analytics from your locally saved applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{totals.total}</CardContent>
        </Card>

        {STATUS_ORDER.slice(0, 3).map((s) => (
          <Card key={s} className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{STATUS_LABEL[s]}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{totals.counts[s]}</CardContent>
          </Card>
        ))}
      </div>

      {apps.length === 0 ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No data yet</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add some applications in the Tracker to see insights.
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Status breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Simple CSS bars (no chart libraries).
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {STATUS_ORDER.map((s) => {
                const n = totals.counts[s];
                const pct = Math.round((n / maxCount) * 100);
                return (
                  <div key={s} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium">{STATUS_LABEL[s]}</p>
                      <span className="text-muted-foreground">{n}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-foreground transition-[width]"
                        style={{ width: `${pct}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Top companies</CardTitle>
              <p className="text-sm text-muted-foreground">
                Helps you spot patterns and focus your applications.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCompanies.length === 0 ? (
                <p className="text-sm text-muted-foreground">No companies yet.</p>
              ) : (
                topCompanies.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3"
                  >
                    <p className="text-sm font-semibold">{name}</p>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
