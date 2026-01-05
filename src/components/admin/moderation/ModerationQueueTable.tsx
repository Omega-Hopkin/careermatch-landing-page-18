import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X, Eye, Flag, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ModerationJobDetail } from "./JobReviewModal";

interface ModerationQueueTableProps {
  jobs: ModerationJobDetail[];
  onReview: (job: ModerationJobDetail) => void;
  onQuickApprove: (jobId: string) => void;
  onQuickReject: (jobId: string) => void;
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    stage: "Stage",
    alternance: "Alternance",
    cdi: "CDI",
    cdd: "CDD",
    freelance: "Freelance",
  };
  return types[type] || type;
};

const getTypeBadgeVariant = (type: string) => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    stage: "secondary",
    alternance: "default",
    cdi: "outline",
    cdd: "outline",
    freelance: "secondary",
  };
  return variants[type] || "default";
};

export const ModerationQueueTable = ({
  jobs,
  onReview,
  onQuickApprove,
  onQuickReject,
}: ModerationQueueTableProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <p className="text-lg font-medium">File d'attente vide</p>
        <p className="text-sm">Aucune offre en attente de modération</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Titre du poste</TableHead>
          <TableHead>Entreprise</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date de soumission</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job.id}
            className={cn(
              job.isFlagged && "bg-destructive/5 border-l-2 border-l-destructive"
            )}
          >
            <TableCell>
              {job.isFlagged && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center">
                      <Flag className="h-4 w-4 text-destructive" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{job.flagCount} signalement(s)</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TableCell>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.company}</TableCell>
            <TableCell>
              <Badge variant={getTypeBadgeVariant(job.type)}>
                {getTypeLabel(job.type)}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(job.postedAt), "dd MMM yyyy HH:mm", {
                locale: fr,
              })}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReview(job)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Examiner</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700 hover:bg-green-100"
                      onClick={() => onQuickApprove(job.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Approuver rapidement</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onQuickReject(job.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rejeter</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
