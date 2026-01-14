/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  DEFAULT_PREFS,
  JobApplication,
  JobStatus,
  STATUS_LABEL,
  STATUS_ORDER,
  SortMode,
  UserPrefs,
} from "@/lib/types";
import { STORAGE_KEYS, useLocalStorageState } from "@/lib/storage";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function formatYMD(ymd: string) {
  // yyyy-mm-dd -> readable local date
  try {
    const d = new Date(ymd + "T00:00:00");
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
  } catch {
    return ymd;
  }
}

function formatTimestamp(ts: number) {
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(new Date(ts));
  } catch {
    return String(ts);
  }
}

function badgeClasses(status: JobStatus) {
  // Consistent, subtle, premium (no loud colors)
  const map: Record<JobStatus, string> = {
    applied: "bg-muted text-foreground border-border",
    interview: "bg-amber-50 text-amber-900 border-amber-200",
    offer: "bg-emerald-50 text-emerald-900 border-emerald-200",
    rejected: "bg-rose-50 text-rose-900 border-rose-200",
  };
  return map[status];
}

export function TrackerClient() {
  const [apps, setApps] = useLocalStorageState<JobApplication[]>(STORAGE_KEYS.apps, []);
  const [prefs] = useLocalStorageState<UserPrefs>(STORAGE_KEYS.prefs, DEFAULT_PREFS);

  // Controls
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<JobStatus | "all">("all");
  const [sort, setSort] = React.useState<SortMode>(prefs.defaultSort);

  // Dialog + form state
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Destructive dialogs
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<JobApplication | null>(null);

  const [clearOpen, setClearOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    company: "",
    role: "",
    status: "" as JobStatus | "",
    appliedDate: "",
    link: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = apps.slice();

    if (q) {
      list = list.filter((a) => `${a.company} ${a.role}`.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    list.sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "oldest") return a.createdAt - b.createdAt;
      return b.createdAt - a.createdAt;
    });

    return list;
  }, [apps, query, statusFilter, sort]);

  const grouped = React.useMemo(() => {
    const map: Record<JobStatus, JobApplication[]> = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
    };
    for (const app of filtered) map[app.status].push(app);
    return map;
  }, [filtered]);

  const stats = React.useMemo(() => {
    const total = apps.length;
    const byStatus = {
      applied: apps.filter((a) => a.status === "applied").length,
      interview: apps.filter((a) => a.status === "interview").length,
      offer: apps.filter((a) => a.status === "offer").length,
      rejected: apps.filter((a) => a.status === "rejected").length,
    };
    return { total, ...byStatus };
  }, [apps]);

  function resetForm() {
    setEditingId(null);
    setForm({ company: "", role: "", status: "", appliedDate: "", link: "", notes: "" });
    setErrors({});
  }

  function openAdd() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(app: JobApplication) {
    setEditingId(app.id);
    setForm({
      company: app.company,
      role: app.role,
      status: app.status,
      appliedDate: app.appliedDate ?? "",
      link: app.link ?? "",
      notes: app.notes ?? "",
    });
    setErrors({});
    setFormOpen(true);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters.";
    if (form.role.trim().length < 2) e.role = "Role must be at least 2 characters.";
    if (!form.status) e.status = "Please select a status.";
    if (form.link.trim() && !isValidUrl(form.link.trim())) e.link = "Enter a valid URL (include https://).";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function upsert() {
    if (!validate()) {
      toast.error("Fix the highlighted fields.");
      return;
    }

    const now = Date.now();
    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status as JobStatus,
      appliedDate: form.appliedDate || undefined,
      link: form.link.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    if (editingId) {
      setApps((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...payload, updatedAt: now } : a))
      );
      toast.success("Application updated.");
    } else {
      const newApp: JobApplication = {
        id: makeId(),
        createdAt: now,
        updatedAt: now,
        ...payload,
      };
      setApps((prev) => [newApp, ...prev]);
      toast.success("Application added.");
    }

    setFormOpen(false);
    resetForm();
  }

  function requestDelete(app: JobApplication) {
    setDeleteTarget(app);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setApps((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    toast.success("Deleted.");
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  function seedDemo() {
    const now = Date.now();
    const demo: JobApplication[] = [
      {
        id: makeId(),
        company: "Canva",
        role: "Junior Frontend Developer",
        status: "interview",
        createdAt: now - 1000 * 60 * 60 * 24 * 2,
        updatedAt: now - 1000 * 60 * 60 * 24 * 2,
        notes: "Prepare accessibility examples + explain state handling.",
      },
      {
        id: makeId(),
        company: "Atlassian",
        role: "Software Engineer (Grad)",
        status: "applied",
        createdAt: now - 1000 * 60 * 60 * 24 * 5,
        updatedAt: now - 1000 * 60 * 60 * 24 * 5,
        link: "https://example.com",
      },
      {
        id: makeId(),
        company: "Shopify",
        role: "Frontend Engineer (Junior)",
        status: "offer",
        createdAt: now - 1000 * 60 * 60 * 24 * 10,
        updatedAt: now - 1000 * 60 * 60 * 24 * 10,
        notes: "Document tradeoffs + deploy to Vercel.",
      },
    ];
    setApps(demo);
    toast.success("Demo data loaded.");
  }

  function requestClearAll() {
    setClearOpen(true);
  }

  function confirmClearAll() {
    setApps([]);
    toast.success("All applications cleared.");
    setClearOpen(false);
  }

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setSort(prefs.defaultSort);
    toast.message("Filters reset.");
  }

  const noData = apps.length === 0;
  const filteredToZero = apps.length > 0 && filtered.length === 0;

  return (
    <div className="flex flex-col gap-[var(--jt-space)]">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Add applications, filter instantly, and keep your pipeline consistent — persisted in localStorage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={seedDemo}>
            Load demo data
          </Button>
          <Button variant="outline" onClick={requestClearAll} disabled={noData}>
            Clear all
          </Button>
          <Button onClick={openAdd}>Add application</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.total}</CardContent>
        </Card>

        {STATUS_ORDER.map((s) => (
          <Card key={s} className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{STATUS_LABEL[s]}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{stats[s]}</CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search by company/role, filter by status, and sort your results.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company or role…"
              aria-label="Search applications"
            />
          </div>

          <div className="md:col-span-3">
            <select
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              aria-label="Sort applications"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company A–Z</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="md:col-span-12 flex items-center justify-between pt-1 text-sm text-muted-foreground">
            <p>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              of <span className="font-semibold text-foreground">{apps.length}</span>
            </p>
            <Link className="underline underline-offset-4 hover:text-foreground" href="/insights">
              View insights →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Empty states */}
      {noData ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No applications yet</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add your first role — it will persist after refresh. Or load demo data for a quick showcase.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={openAdd}>Add application</Button>
            <Button variant="secondary" onClick={seedDemo}>
              Load demo data
            </Button>
          </CardContent>
        </Card>
      ) : filteredToZero ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No results</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your filters/search removed everything. Reset filters to see all items again.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={resetFilters}>
              Reset filters
            </Button>
            <Button onClick={openAdd}>Add application</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {STATUS_ORDER.map((status) => (
            <Card key={status} className="rounded-3xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{STATUS_LABEL[status]}</CardTitle>
                  <span className="text-xs text-muted-foreground">{grouped[status].length}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {grouped[status].length === 0 ? (
                  <div className="rounded-2xl border bg-card p-4">
                    <p className="text-sm font-semibold">Empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No items in this column right now.
                    </p>
                  </div>
                ) : (
                  grouped[status].map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{app.company}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{app.role}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                              className={cn("rounded-full border px-2 py-0.5 text-xs", badgeClasses(app.status))}
                            >
                              {STATUS_LABEL[app.status]}
                            </Badge>

                            <span className="text-xs text-muted-foreground">
                              {app.appliedDate
                                ? `Applied ${formatYMD(app.appliedDate)}`
                                : `Added ${formatTimestamp(app.createdAt)}`}
                            </span>
                          </div>

                          {app.link ? (
                            <a
                              className="mt-2 inline-block text-xs font-semibold underline underline-offset-4 hover:text-foreground"
                              href={app.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open link
                            </a>
                          ) : null}

                          {app.notes ? (
                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                              {app.notes}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 flex-col gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(app)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => requestDelete(app)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit application" : "Add application"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Company *</label>
              <Input
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                placeholder="e.g., Canva"
                aria-invalid={!!errors.company}
              />
              {errors.company ? <p className="text-sm text-rose-700">{errors.company}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Role *</label>
              <Input
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="e.g., Junior Frontend Developer"
                aria-invalid={!!errors.role}
              />
              {errors.role ? <p className="text-sm text-rose-700">{errors.role}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Status *</label>
              <select
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                value={form.status}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
                aria-invalid={!!errors.status}
              >
                <option value="">Select…</option>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              {errors.status ? <p className="text-sm text-rose-700">{errors.status}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Applied date</label>
              <Input
                type="date"
                value={form.appliedDate}
                onChange={(e) => setForm((p) => ({ ...p, appliedDate: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Job link</label>
              <Input
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                placeholder="https://…"
                aria-invalid={!!errors.link}
              />
              {errors.link ? (
                <p className="text-sm text-rose-700">{errors.link}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Optional, but useful for quick access.</p>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Notes</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Follow up next Monday…"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={upsert}>{editingId ? "Save changes" : "Add application"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget ? `${deleteTarget.company} — ${deleteTarget.role}` : "this item"}
              </span>{" "}
              from this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All AlertDialog */}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all applications?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all saved applications from this browser. Preferences remain in Settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAll}>Clear all</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}