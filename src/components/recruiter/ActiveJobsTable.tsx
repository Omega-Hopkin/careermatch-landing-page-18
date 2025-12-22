import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Pencil, 
  Users, 
  Copy, 
  Archive, 
  LayoutGrid, 
  LayoutList,
  Briefcase,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface RecruiterJob {
  id: string;
  title: string;
  type: string;
  applicationsCount: number;
  status: 'draft' | 'published' | 'closed' | 'archived';
  views: number;
  createdAt: string;
  location: string;
}

interface ActiveJobsTableProps {
  jobs: RecruiterJob[];
  onEditJob: (jobId: string) => void;
  onViewApplications: (jobId: string) => void;
  onDuplicateJob: (jobId: string) => void;
  onArchiveJob: (jobId: string) => void;
}

const statusConfig = {
  draft: { label: "Brouillon", variant: "secondary" as const },
  published: { label: "Publiée", variant: "default" as const },
  closed: { label: "Fermée", variant: "outline" as const },
  archived: { label: "Archivée", variant: "secondary" as const },
};

export const ActiveJobsTable = ({
  jobs,
  onEditJob,
  onViewApplications,
  onDuplicateJob,
  onArchiveJob,
}: ActiveJobsTableProps) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucune offre active</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Commencez à publier des offres d'emploi pour attirer les meilleurs talents.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Mes offres</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('table')}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'table' ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Candidatures</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Vues</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.location} · {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{job.applicationsCount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[job.status].variant}>
                        {statusConfig[job.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span className="text-sm">{job.views}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditJob(job.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewApplications(job.id)}>
                            <Users className="h-4 w-4 mr-2" />
                            Voir les candidatures
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDuplicateJob(job.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onArchiveJob(job.id)}
                            className="text-destructive"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{job.title}</h4>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                  </div>
                  <Badge variant={statusConfig[job.status].variant}>
                    {statusConfig[job.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.applicationsCount} candidatures
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {job.views} vues
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEditJob(job.id)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onViewApplications(job.id)}>
                    <Users className="h-3 w-3 mr-1" />
                    Candidatures
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
