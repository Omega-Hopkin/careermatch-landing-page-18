import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  year: string;
  filiere: string;
  avatar?: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    period: string;
  }[];
}

interface ApplicationDetail {
  id: string;
  student: StudentProfile;
  jobTitle: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  coverLetter: string;
  cvUrl?: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  recruiterNotes?: string;
}

interface ApplicationDetailModalProps {
  application: ApplicationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onMarkReviewed: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const ApplicationDetailModal = ({
  application,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onMarkReviewed,
  onSaveNotes,
}: ApplicationDetailModalProps) => {
  const [notes, setNotes] = useState(application?.recruiterNotes || "");

  if (!application) return null;

  const { student, matchScore, matchingSkills, missingSkills, coverLetter, cvUrl, status } = application;

  const handleNotesChange = (value: string) => {
    setNotes(value);
    // Debounced save would be handled by parent
    onSaveNotes(application.id, value);
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: "En attente", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
      reviewed: { label: "Vue", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      accepted: { label: "Acceptée", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      rejected: { label: "Refusée", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{student.name}</DialogTitle>
                <p className="text-muted-foreground">{application.jobTitle}</p>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{matchScore}%</div>
              <div className="text-sm text-muted-foreground">Match</div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${student.email}`} className="text-primary hover:underline">
                  {student.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.location || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{student.year} - {student.filiere}</span>
              </div>
            </div>

            <Separator />

            {/* Match Analysis */}
            <div>
              <h4 className="font-semibold mb-3">Analyse du matching</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Compétences correspondantes</p>
                  <div className="flex flex-wrap gap-2">
                    {matchingSkills.map((skill) => (
                      <Badge key={skill} className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Compétences manquantes</p>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-muted-foreground">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Aucune</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Experience Timeline */}
            <div>
              <h4 className="font-semibold mb-3">Expériences</h4>
              <div className="space-y-3">
                {student.experiences.map((exp, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">{exp.company} · {exp.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* CV */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                CV
              </h4>
              {cvUrl ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir le CV
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={cvUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun CV fourni</p>
              )}
            </div>

            <Separator />

            {/* Cover Letter */}
            <div>
              <h4 className="font-semibold mb-3">Lettre de motivation</h4>
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                {coverLetter || "Aucune lettre de motivation fournie."}
              </div>
            </div>

            <Separator />

            {/* Recruiter Notes */}
            <div>
              <h4 className="font-semibold mb-3">Notes du recruteur</h4>
              <Textarea
                placeholder="Ajoutez vos notes sur cette candidature..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">Sauvegarde automatique</p>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          {status === "pending" && (
            <Button variant="outline" onClick={() => onMarkReviewed(application.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Marquer comme vue
            </Button>
          )}
          {status !== "accepted" && (
            <Button onClick={() => onAccept(application.id)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accepter
            </Button>
          )}
          {status !== "rejected" && (
            <Button variant="destructive" onClick={() => onReject(application.id)}>
              <XCircle className="h-4 w-4 mr-2" />
              Refuser
            </Button>
          )}
          <Button variant="outline" asChild className="ml-auto">
            <a href={`mailto:${student.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Contacter
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
