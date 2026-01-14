import { InsightsClient } from "./insights-client";

export const metadata = {
  title: "Insights",
  description:
    "Lightweight analytics from your saved job applications — frontend-only.",
};

export default function InsightsPage() {
  return <InsightsClient />;
}
