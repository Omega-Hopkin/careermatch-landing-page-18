import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Loader2 } from "lucide-react";
import { JobCard, Job } from "./JobCard";
import { JobDetailModal } from "./JobDetailModal";

interface RecommendedJobsProps {
  jobs: Job[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const RecommendedJobs = ({ 
  jobs, 
  isLoading = false, 
  onLoadMore,
  hasMore = true 
}: RecommendedJobsProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore?.();
    setLoadingMore(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Recommandations pour toi</h2>
          <p className="text-sm text-muted-foreground">
            {jobs.length} offres correspondant à ton profil
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-muted/30 border border-dashed border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Aucune recommandation</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Complète ton profil pour recevoir des recommandations personnalisées
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={setSelectedJob}
              onSave={(id) => console.log("Save job:", id)}
              onApply={(id) => console.log("Apply to job:", id)}
            />
          ))}
        </div>
      )}

      {hasMore && jobs.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              "Voir plus de recommandations"
            )}
          </Button>
        </div>
      )}

      <JobDetailModal
        job={selectedJob}
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      />
    </div>
  );
};
