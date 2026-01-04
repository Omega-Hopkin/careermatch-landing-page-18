import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  FileText,
  AlertTriangle,
  Activity,
  Server,
} from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    students: number;
    recruiters: number;
    activeJobs: number;
    totalApplications: number;
    pendingModeration: number;
    weeklyActivity: number;
    monthlyActivity: number;
    systemHealth: "healthy" | "warning" | "critical";
  };
}

export const AdminStatsCards = ({ stats }: AdminStatsProps) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getHealthText = (health: string) => {
    switch (health) {
      case "healthy":
        return "Opérationnel";
      case "warning":
        return "Attention requise";
      case "critical":
        return "Critique";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {stats.students} étudiants
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.recruiters} recruteurs
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offres actives</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeJobs}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Offres publiées sur la plateforme
          </p>
        </CardContent>
      </Card>

      {/* Total Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Total des candidatures soumises
          </p>
        </CardContent>
      </Card>

      {/* Pending Moderation */}
      <Card className={stats.pendingModeration > 0 ? "border-destructive" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Modération</CardTitle>
          <AlertTriangle
            className={`h-4 w-4 ${
              stats.pendingModeration > 0
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{stats.pendingModeration}</span>
            {stats.pendingModeration > 0 && (
              <Badge variant="destructive" className="text-xs">
                Action requise
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Offres en attente d'approbation
          </p>
        </CardContent>
      </Card>

      {/* Platform Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activité</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyActivity}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Cette semaine</span>
            <span className="text-xs text-green-600">
              vs {stats.monthlyActivity} ce mois
            </span>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">État système</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getHealthColor(
                stats.systemHealth
              )}`}
            />
            <span className="text-lg font-semibold">
              {getHealthText(stats.systemHealth)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tous les services fonctionnent normalement
          </p>
        </CardContent>
      </Card>
    </div>
  );
};