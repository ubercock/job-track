import { TrackerClient } from "./tracker-client";

export const metadata = {
  title: "Tracker",
  description:
    "Track job applications with client-side search/filter/sort and local persistence.",
};

export default function TrackerPage() {
  return <TrackerClient />;
}
