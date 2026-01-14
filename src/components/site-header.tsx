"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/tracker", label: "Tracker" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl border bg-card shadow-sm">
            <span className="text-sm font-semibold tracking-tight">JT</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">JobTrack</p>
            <p className="text-xs text-muted-foreground">Application tracker</p>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  active && "bg-muted text-foreground shadow-sm"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/insights">View insights</Link>
          </Button>
          <Button asChild>
            <Link href="/tracker">Open tracker</Link>
          </Button>
        </div>
      </div>

      {/* Mobile nav (simple + clean) */}
      <div className="border-t bg-background md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-2 py-2 sm:px-6">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-2 py-2 text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  active && "bg-muted text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
