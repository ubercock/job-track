import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Tracker",
  description:
    "Track job applications with client-side search/filter/sort and local persistence.",
};

export default function TrackerPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            This is the core product. Next sprint: CRUD + localStorage + dialog
            form + validation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/settings">Preferences</Link>
          </Button>
          <Button>Add application</Button>
        </div>
      </div>

      {/* Toolbar skeleton-ish structure (real controls next sprint) */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Pipeline controls</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search, filter by status, and sort by date/company.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-10 rounded-xl border bg-background" />
            <div className="h-10 rounded-xl border bg-background" />
            <div className="h-10 rounded-xl border bg-background" />
          </div>
        </CardContent>
      </Card>

      {/* List area placeholder */}
      <div className="grid gap-4 lg:grid-cols-3">
        {["Applied", "Interview", "Offer"].map((col) => (
          <Card key={col} className="rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{col}</CardTitle>
              <p className="text-xs text-muted-foreground">0 items</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm font-semibold">Empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an application to populate this column.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
