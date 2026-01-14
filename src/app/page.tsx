import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Home",
  description:
    "JobTrack helps you manage your job applications with a clean pipeline, fast filtering, and insights.",
};

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            Frontend-only • LocalStorage • Recruiter-readable
          </p>

          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            A job application tracker that feels like a real internal tool.
          </h1>

          <p className="mt-4 max-w-prose text-pretty text-base text-muted-foreground sm:text-lg">
            Add applications, update statuses, filter instantly, and review
            lightweight insights. Built with Next.js + TypeScript + Tailwind +
            shadcn/ui — no backend required.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="min-w-40">
              <Link href="/tracker">Start tracking</Link>
            </Button>
            <Button asChild variant="outline" className="min-w-40">
              <Link href="/insights">See insights</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Pipeline UI", v: "Clear statuses + scan-friendly layout" },
              { k: "Fast controls", v: "Search + filter + sort client-side" },
              { k: "Good UX states", v: "Empty / error / success handling" },
            ].map((x) => (
              <Card key={x.k} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{x.k}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {x.v}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right preview */}
        <div className="lg:col-span-5">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sprint 2 will wire real CRUD + persistence.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              {["Applied", "Interview", "Offer"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3"
                >
                  <p className="text-sm font-semibold">{label}</p>
                  <span className="text-xs text-muted-foreground">0</span>
                </div>
              ))}
              <Button asChild variant="secondary" className="w-full">
                <Link href="/tracker">Go to tracker</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "1) Add applications",
            desc: "Company, role, status, link, notes — validated and clean.",
          },
          {
            title: "2) Filter your pipeline",
            desc: "Search + filter + sort instantly (no backend).",
          },
          {
            title: "3) Review insights",
            desc: "Lightweight analytics to stay consistent and focused.",
          },
        ].map((x) => (
          <Card key={x.title} className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">{x.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{x.desc}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to use the tracker?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything saves locally — refresh-safe and demo-friendly.
            </p>
          </div>
          <Button asChild className="min-w-44">
            <Link href="/tracker">Open tracker</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
