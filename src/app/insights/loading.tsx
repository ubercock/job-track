import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                <Skeleton className="h-3 w-16" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">
                <Skeleton className="h-4 w-36" />
              </CardTitle>
              <Skeleton className="mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((__, j) => (
                <div key={j} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
