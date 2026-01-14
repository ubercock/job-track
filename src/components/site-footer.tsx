export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">JobTrack</p>
          <p className="text-muted-foreground">
            Built with Next.js • TypeScript • Tailwind • shadcn/ui
          </p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Portfolio demo: frontend-only, persisted in localStorage.
        </p>
      </div>
    </footer>
  );
}
