import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2 } from 'lucide-react';

interface SimilarJob {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
  postedAt: string;
}

interface SimilarJobsProps {
  jobs: SimilarJob[];
  onJobClick: (jobId: string) => void;
}

export const SimilarJobs = ({ jobs, onJobClick }: SimilarJobsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (score >= 50) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  if (jobs.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Offres similaires</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="min-w-[300px] max-w-[300px] cursor-pointer hover:shadow-md transition-shadow snap-start"
            onClick={() => onJobClick(job.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <Badge
                  variant="outline"
                  className={getMatchScoreColor(job.matchScore)}
                >
                  {job.matchScore}%
                </Badge>
              </div>

              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{job.company}</p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
                {job.isRemote && (
                  <Badge variant="secondary" className="text-xs py-0">
                    Remote
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {formatRelativeDate(job.postedAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
