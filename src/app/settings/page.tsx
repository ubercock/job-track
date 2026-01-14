import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Settings",
  description:
    "Preferences and data controls for JobTrack (stored locally).",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Next sprint: localStorage preferences (density, defaults) + export/clear
          with safe confirmations.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">UI preferences</CardTitle>
            <p className="text-sm text-muted-foreground">
              Saved locally so your preference persists.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Density</p>
                <p className="text-sm text-muted-foreground">
                  Compact vs comfort spacing.
                </p>
              </div>
              <Button variant="secondary">Toggle</Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Default sort</p>
                <p className="text-sm text-muted-foreground">
                  Choose how lists sort by default.
                </p>
              </div>
              <Button variant="outline">Edit</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Data</CardTitle>
            <p className="text-sm text-muted-foreground">
              Export for backup or clear to reset demo.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Export</p>
                <p className="text-sm text-muted-foreground">
                  Download JSON/CSV (frontend-only).
                </p>
              </div>
              <Button variant="secondary">Export</Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Clear all</p>
                <p className="text-sm text-muted-foreground">
                  Remove saved applications and preferences.
                </p>
              </div>
              <Button variant="outline">Clear</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
