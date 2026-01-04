import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Briefcase, FileText, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface ActivityItem {
  id: string;
  type: "user_registration" | "job_posting" | "application" | "moderation";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    userId?: string;
    jobId?: string;
    userName?: string;
    companyName?: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const [filter, setFilter] = useState<string>("all");

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user_registration":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "job_posting":
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case "application":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "moderation":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getTypeBadge = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user_registration":
        return <Badge variant="secondary">Inscription</Badge>;
      case "job_posting":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Offre</Badge>;
      case "application":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Candidature</Badge>;
      case "moderation":
        return <Badge variant="destructive">Modération</Badge>;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activité récente</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="user_registration">Inscriptions</SelectItem>
            <SelectItem value="job_posting">Offres</SelectItem>
            <SelectItem value="application">Candidatures</SelectItem>
            <SelectItem value="moderation">Modération</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune activité récente
            </p>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {activity.title}
                    </span>
                    {getTypeBadge(activity.type)}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {filteredActivities.length > 0 && (
          <Button variant="ghost" className="w-full mt-4">
            Voir toute l'activité
          </Button>
        )}
      </CardContent>
    </Card>
  );
};