import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  MapPin, 
  Calendar, 
  MoreHorizontal,
  Eye,
  XCircle,
  MessageSquare,
  FileText,
  Download,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  appliedAt: string;
  status: ApplicationStatus;
  lastUpdatedAt: string;
  coverLetter?: string;
  cvUrl?: string;
  recruiterNotes?: string;
  statusHistory: Array<{
    status: ApplicationStatus;
    date: string;
    note?: string;
  }>;
}

interface ApplicationCardProps {
  application: Application;
  onWithdraw: (id: string) => void;
  onViewJob: (jobId: string) => void;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  pending: { 
    label: 'En attente', 
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
  },
  reviewed: { 
    label: 'Vue par le recruteur', 
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
  },
  accepted: { 
    label: 'Acceptée', 
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
  },
  rejected: { 
    label: 'Refusée', 
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
  },
  withdrawn: { 
    label: 'Retirée', 
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' 
  },
};

export const ApplicationCard = ({ application, onWithdraw, onViewJob }: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[application.status];

  const formatRelativeDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
  };

  const canWithdraw = application.status === 'pending' || application.status === 'reviewed';

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="p-0">
          {/* Main Row */}
          <div className="flex items-center gap-4 p-4">
            {/* Company Logo */}
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 overflow-hidden">
              {application.companyLogo ? (
                <img 
                  src={application.companyLogo} 
                  alt={application.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <button 
                onClick={() => onViewJob(application.jobId)}
                className="font-semibold text-foreground hover:text-primary transition-colors text-left truncate block w-full"
              >
                {application.jobTitle}
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <span className="truncate">{application.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.location}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <Badge className={cn("flex-shrink-0", status.className)}>
              {status.label}
            </Badge>

            {/* Date */}
            <div className="hidden sm:flex flex-col items-end text-sm flex-shrink-0">
              <span className="text-muted-foreground">
                {formatRelativeDate(application.appliedAt)}
              </span>
              {application.lastUpdatedAt !== application.appliedAt && (
                <span className="text-xs text-muted-foreground">
                  Màj: {formatRelativeDate(application.lastUpdatedAt)}
                </span>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewJob(application.jobId)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir l'offre
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacter le recruteur
                </DropdownMenuItem>
                {canWithdraw && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onWithdraw(application.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Retirer ma candidature
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Expand Toggle */}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Expanded Content */}
          <CollapsibleContent>
            <div className="border-t border-border px-4 py-4 bg-accent/30">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Documents */}
                <div className="space-y-4">
                  {/* CV */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CV envoyé
                    </h4>
                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm flex-1">CV_profil.pdf</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Lettre de motivation</h4>
                      <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Recruiter Notes */}
                  {application.recruiterNotes && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">
                        Notes du recruteur
                      </h4>
                      <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 p-3 rounded-lg">
                        {application.recruiterNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Historique
                  </h4>
                  <div className="space-y-3">
                    {application.statusHistory.map((event, index) => {
                      const eventStatus = statusConfig[event.status];
                      return (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "h-3 w-3 rounded-full",
                              event.status === 'accepted' && "bg-green-500",
                              event.status === 'rejected' && "bg-red-500",
                              event.status === 'reviewed' && "bg-blue-500",
                              event.status === 'pending' && "bg-amber-500",
                              event.status === 'withdrawn' && "bg-gray-500",
                            )} />
                            {index < application.statusHistory.length - 1 && (
                              <div className="w-px h-full bg-border min-h-[20px]" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-sm font-medium">{eventStatus.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                            </p>
                            {event.note && (
                              <p className="text-xs text-muted-foreground mt-1">{event.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canWithdraw && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onWithdraw(application.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Retirer ma candidature
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
