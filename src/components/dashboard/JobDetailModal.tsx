import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Building2, 
  Clock, 
  Wifi, 
  Heart, 
  ExternalLink,
  Briefcase,
  Euro
} from "lucide-react";
import { Job } from "./JobCard";
import { cn } from "@/lib/utils";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getMatchScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 bg-green-100";
  if (score >= 50) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
};

export const JobDetailModal = ({ job, open, onOpenChange }: JobDetailModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
              {job.logoUrl ? (
                <img src={job.logoUrl} alt={job.company} className="w-12 h-12 rounded" />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-foreground">
                {job.title}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">{job.company}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                {job.isRemote && (
                  <Badge variant="outline" className="text-xs">
                    <Wifi className="w-3 h-3 mr-1" />
                    Remote
                  </Badge>
                )}
              </div>
            </div>
            <Badge className={cn("shrink-0 font-bold text-lg px-3 py-1", getMatchScoreColor(job.matchScore))}>
              {job.matchScore}%
            </Badge>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Briefcase className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">CDI</p>
              <p className="text-xs text-muted-foreground">Type de contrat</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Euro className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">35-45k€</p>
              <p className="text-xs text-muted-foreground">Salaire annuel</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Temps plein</p>
              <p className="text-xs text-muted-foreground">Horaires</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Compétences recherchées</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Description du poste</h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                Nous recherchons un(e) {job.title} passionné(e) pour rejoindre notre équipe 
                dynamique chez {job.company}. Vous travaillerez sur des projets innovants 
                et aurez l'opportunité de développer vos compétences.
              </p>
              <p>
                <strong>Responsabilités :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Participer au développement de nouvelles fonctionnalités</li>
                <li>Collaborer avec l'équipe sur les projets en cours</li>
                <li>Contribuer à l'amélioration continue des processus</li>
                <li>Assurer la qualité du code et la documentation</li>
              </ul>
            </div>
          </div>

          {/* Why you match */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-lg">✨</span>
              Pourquoi tu corresponds
            </h3>
            <p className="text-sm text-muted-foreground">
              Ton profil correspond à {job.matchScore}% des critères recherchés. 
              Tes compétences en {job.skills.slice(0, 2).join(" et ")} sont 
              particulièrement appréciées pour ce poste.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir l'entreprise
            </Button>
            <Button variant="gradient">
              Postuler maintenant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
