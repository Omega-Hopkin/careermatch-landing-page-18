import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ReviewedJob {
  id: string;
  title: string;
  company: string;
  status: "approved" | "rejected" | "changes_requested";
  reviewedAt: string;
  reviewedBy: string;
  reason?: string;
}

interface ModerationHistoryProps {
  jobs: ReviewedJob[];
}

const getStatusBadge = (status: ReviewedJob["status"]) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Check className="h-3 w-3 mr-1" />
          Approuvée
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <X className="h-3 w-3 mr-1" />
          Rejetée
        </Badge>
      );
    case "changes_requested":
      return (
        <Badge variant="secondary">
          <MessageSquare className="h-3 w-3 mr-1" />
          Modifications demandées
        </Badge>
      );
    default:
      return null;
  }
};

export const ModerationHistory = ({ jobs }: ModerationHistoryProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">Aucun historique</p>
        <p className="text-sm">Les offres modérées apparaîtront ici</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre du poste</TableHead>
          <TableHead>Entreprise</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Modérateur</TableHead>
          <TableHead>Date de révision</TableHead>
          <TableHead>Raison</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.company}</TableCell>
            <TableCell>{getStatusBadge(job.status)}</TableCell>
            <TableCell>{job.reviewedBy}</TableCell>
            <TableCell>
              {format(new Date(job.reviewedAt), "dd MMM yyyy HH:mm", {
                locale: fr,
              })}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {job.reason || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
