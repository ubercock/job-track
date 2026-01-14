import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Insights",
  description:
    "Lightweight analytics from your saved job applications — frontend-only.",
};

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Next sprint: compute metrics from localStorage and show simple charts
          (no heavy libraries).
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Total", "Applied", "Interview", "Offer"].map((kpi) => (
          <Card key={kpi} className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {kpi}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">0</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart placeholders */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Status breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">
              Simple bar chart from stored applications.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Applied", "Interview", "Offer", "Rejected"].map((x) => (
              <div key={x} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium">{x}</p>
                  <span className="text-muted-foreground">0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[0%] rounded-full bg-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Top companies</CardTitle>
            <p className="text-sm text-muted-foreground">
              Which companies you apply to most (helps focus).
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3"
              >
                <p className="text-sm font-semibold">—</p>
                <span className="text-xs text-muted-foreground">0</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
