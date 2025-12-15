import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Building2, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
}

interface RecentApplicationsProps {
  applications: Application[];
  isLoading?: boolean;
}

const statusConfig = {
  pending: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  reviewed: {
    label: "En cours d'examen",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  accepted: {
    label: "Acceptée",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Refusée",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

export const RecentApplications = ({ applications, isLoading = false }: RecentApplicationsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Candidatures récentes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/applications" className="text-primary">
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Aucune candidature pour le moment
            </p>
            <Button variant="link" size="sm" className="mt-2" asChild>
              <Link to="/dashboard">Découvrir les offres</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {application.jobTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusConfig[application.status].className)}
                  >
                    {statusConfig[application.status].label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
