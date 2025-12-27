import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MoreHorizontal, ChevronDown, ChevronUp, Eye, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApplicationTableItem {
  id: string;
  studentName: string;
  studentAvatar?: string;
  studentEmail: string;
  jobTitle: string;
  jobId: string;
  matchScore: number;
  appliedAt: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  skills: string[];
  coverLetter?: string;
  cvUrl?: string;
}

interface ApplicationsTableProps {
  applications: ApplicationTableItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onViewDetails: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onMarkReviewed: (id: string) => void;
}

const getStatusConfig = (status: ApplicationTableItem["status"]) => {
  const configs = {
    pending: { label: "En attente", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    reviewed: { label: "Vue", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    accepted: { label: "Acceptée", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    rejected: { label: "Refusée", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  };
  return configs[status];
};

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const ApplicationsTable = ({
  applications,
  selectedIds,
  onSelectionChange,
  onViewDetails,
  onAccept,
  onReject,
  onMarkReviewed,
}: ApplicationsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelect = (id: string) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(applications.map((app) => app.id));
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune candidature</h3>
        <p className="text-muted-foreground">
          Les candidatures correspondant à vos critères apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === applications.length && applications.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-8"></TableHead>
            <TableHead>Candidat</TableHead>
            <TableHead>Offre</TableHead>
            <TableHead className="text-center">Match</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const isExpanded = expandedRows.includes(application.id);
            const statusConfig = getStatusConfig(application.status);

            return (
              <Collapsible key={application.id} asChild open={isExpanded}>
                <>
                  <TableRow
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedIds.includes(application.id) && "bg-muted/30"
                    )}
                    onClick={() => onViewDetails(application.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(application.id)}
                        onCheckedChange={() => toggleSelect(application.id)}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(application.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={application.studentAvatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {application.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.studentName}</p>
                          <p className="text-xs text-muted-foreground">{application.studentEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{application.jobTitle}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("font-semibold", getMatchScoreColor(application.matchScore))}>
                        {application.matchScore}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(application.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          {application.status === "pending" && (
                            <DropdownMenuItem onClick={() => onMarkReviewed(application.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Marquer comme vue
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {application.status !== "accepted" && (
                            <DropdownMenuItem onClick={() => onAccept(application.id)} className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accepter
                            </DropdownMenuItem>
                          )}
                          {application.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => onReject(application.id)} className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Refuser
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-muted/30 px-6 py-4 border-t border-border">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-medium mb-2 text-sm">Compétences</h4>
                              <div className="flex flex-wrap gap-1">
                                {application.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 text-sm">Lettre de motivation</h4>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {application.coverLetter || "Aucune lettre fournie"}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 text-sm">CV</h4>
                              {application.cvUrl ? (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={application.cvUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Voir le CV
                                  </a>
                                </Button>
                              ) : (
                                <p className="text-sm text-muted-foreground">Aucun CV fourni</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </CollapsibleContent>
                </>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
