import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Euro,
  Flag,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

export interface ModerationJobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedAt: string;
  recruiterEmail: string;
  isFlagged: boolean;
  flagCount?: number;
  flagReasons?: string[];
}

interface ModerationChecklist {
  appropriateContent: boolean;
  noSpamScam: boolean;
  validRequirements: boolean;
  companyVerified: boolean;
}

interface JobReviewModalProps {
  job: ModerationJobDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (jobId: string, notes: string) => void;
  onReject: (jobId: string) => void;
  onRequestChanges: (jobId: string, notes: string) => void;
}

export const JobReviewModal = ({
  job,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onRequestChanges,
}: JobReviewModalProps) => {
  const [checklist, setChecklist] = useState<ModerationChecklist>({
    appropriateContent: false,
    noSpamScam: false,
    validRequirements: false,
    companyVerified: false,
  });
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (open) {
      setChecklist({
        appropriateContent: false,
        noSpamScam: false,
        validRequirements: false,
        companyVerified: false,
      });
      setAdminNotes("");
    }
  }, [open, job?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || !job) return;
      
      if (e.key === "a" && !e.ctrlKey && !e.metaKey && e.target === document.body) {
        e.preventDefault();
        handleApprove();
      } else if (e.key === "r" && !e.ctrlKey && !e.metaKey && e.target === document.body) {
        e.preventDefault();
        onReject(job.id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, job]);

  const handleApprove = () => {
    if (job) {
      onApprove(job.id, adminNotes);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {job.company}
              </DialogDescription>
            </div>
            {job.isFlagged && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                Signalée ({job.flagCount})
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {job.type}
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  {job.salary}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(job.postedAt), "dd MMM yyyy", { locale: fr })}
              </div>
            </div>

            <Separator />

            {/* Flag Reasons */}
            {job.isFlagged && job.flagReasons && job.flagReasons.length > 0 && (
              <>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Raisons des signalements
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {job.flagReasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
              </>
            )}

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description du poste</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <Separator />

            {/* Requirements */}
            <div>
              <h4 className="font-medium mb-2">Exigences</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Moderation Checklist */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-4">Checklist de modération</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="appropriate"
                    checked={checklist.appropriateContent}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({
                        ...prev,
                        appropriateContent: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="appropriate" className="text-sm cursor-pointer">
                    Contenu approprié et professionnel
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="nospam"
                    checked={checklist.noSpamScam}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({
                        ...prev,
                        noSpamScam: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="nospam" className="text-sm cursor-pointer">
                    Pas de spam ni d'arnaque détecté
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="validreq"
                    checked={checklist.validRequirements}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({
                        ...prev,
                        validRequirements: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="validreq" className="text-sm cursor-pointer">
                    Exigences valides et réalistes
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="verified"
                    checked={checklist.companyVerified}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({
                        ...prev,
                        companyVerified: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="verified" className="text-sm cursor-pointer">
                    Entreprise vérifiée
                  </Label>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <Label htmlFor="notes" className="mb-2 block">
                Notes administrateur
              </Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes internes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="text-xs text-muted-foreground mr-auto">
            Raccourcis: <kbd className="px-1 py-0.5 bg-muted rounded text-xs">A</kbd> Approuver,{" "}
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> Rejeter
          </div>
          <Button
            variant="outline"
            onClick={() => job && onRequestChanges(job.id, adminNotes)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Demander des modifications
          </Button>
          <Button
            variant="destructive"
            onClick={() => job && onReject(job.id)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Rejeter
          </Button>
          <Button
            onClick={handleApprove}
            disabled={!allChecked}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
