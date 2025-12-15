import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Building2, Clock, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
  skills: string[];
  postedAt: string;
  logoUrl?: string;
}

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onClick?: (job: Job) => void;
  isSaved?: boolean;
}

const getMatchScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 bg-green-100";
  if (score >= 50) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
};

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${diffDays >= 14 ? 's' : ''}`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
};

export const JobCard = ({ job, onSave, onApply, onClick, isSaved = false }: JobCardProps) => {
  const [saved, setSaved] = useState(isSaved);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setSaved(!saved);
    onSave?.(job.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
      onClick={() => onClick?.(job)}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {job.logoUrl ? (
              <img src={job.logoUrl} alt={job.company} className="w-8 h-8 rounded" />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              
              {/* Match Score */}
              <Badge className={cn("shrink-0 font-bold", getMatchScoreColor(job.matchScore))}>
                {job.matchScore}% match
              </Badge>
            </div>

            {/* Location & Remote */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              {job.isRemote && (
                <Badge variant="outline" className="text-xs py-0">
                  <Wifi className="w-3 h-3 mr-1" />
                  Remote
                </Badge>
              )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 3}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {formatRelativeDate(job.postedAt)}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-all",
                    saved && "text-red-500",
                    isAnimating && "scale-125"
                  )}
                  onClick={handleSave}
                >
                  <Heart className={cn("w-4 h-4", saved && "fill-current")} />
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleApply}
                  className="text-xs"
                >
                  Postuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
