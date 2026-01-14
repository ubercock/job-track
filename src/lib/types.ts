export type JobStatus = "applied" | "interview" | "offer" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;

  // Optional fields
  appliedDate?: string; // yyyy-mm-dd
  link?: string;
  notes?: string;

  // Metadata for sorting
  createdAt: number; // Date.now()
  updatedAt: number; // Date.now()
};

export const STATUS_LABEL: Record<JobStatus, string> = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_ORDER: JobStatus[] = ["applied", "interview", "offer", "rejected"];
export type Density = "comfort" | "compact";

export type SortMode = "newest" | "oldest" | "company" | "status";

export type UserPrefs = {
  density: Density;
  defaultSort: SortMode;
};

export const DEFAULT_PREFS: UserPrefs = {
  density: "comfort",
  defaultSort: "newest",
};
