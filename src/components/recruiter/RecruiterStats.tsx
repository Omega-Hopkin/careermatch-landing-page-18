import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Bell, Eye } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  badge?: number;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, badge }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {badge !== undefined && badge > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  +{badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend !== undefined && (
              <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}% vs semaine dernière
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecruiterStatsProps {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  profileViews: number;
}

export const RecruiterStats = ({
  totalJobs,
  activeJobs,
  totalApplications,
  newApplications,
  profileViews,
}: RecruiterStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Offres publiées"
        value={totalJobs}
        subtitle={`${activeJobs} actives`}
        icon={Briefcase}
      />
      <StatCard
        title="Candidatures reçues"
        value={totalApplications}
        icon={Users}
        trend={12}
      />
      <StatCard
        title="Nouvelles candidatures"
        value={newApplications}
        subtitle="Cette semaine"
        icon={Bell}
        badge={newApplications}
      />
      <StatCard
        title="Vues du profil"
        value={profileViews}
        icon={Eye}
        trend={8}
      />
    </div>
  );
};
