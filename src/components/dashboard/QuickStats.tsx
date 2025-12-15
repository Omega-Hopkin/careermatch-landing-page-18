import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, FileText, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  colorClass: string;
}

const StatCard = ({ title, value, icon, trend, colorClass }: StatCardProps) => (
  <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-transform group-hover:scale-110",
          colorClass
        )}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickStatsProps {
  recommendations: number;
  applications: number;
  profileViews: number;
  savedJobs: number;
}

export const QuickStats = ({ 
  recommendations, 
  applications, 
  profileViews, 
  savedJobs 
}: QuickStatsProps) => {
  const stats = [
    {
      title: "Recommandations actives",
      value: recommendations,
      icon: <Sparkles className="h-5 w-5 text-primary-foreground" />,
      trend: "+5 nouvelles aujourd'hui",
      colorClass: "bg-primary",
    },
    {
      title: "Candidatures en cours",
      value: applications,
      icon: <FileText className="h-5 w-5 text-secondary-foreground" />,
      trend: "2 en attente de réponse",
      colorClass: "bg-secondary",
    },
    {
      title: "Profil vu par recruteurs",
      value: profileViews,
      icon: <Eye className="h-5 w-5 text-accent-foreground" />,
      trend: "+12% cette semaine",
      colorClass: "bg-accent",
    },
    {
      title: "Jobs sauvegardés",
      value: savedJobs,
      icon: <Heart className="h-5 w-5 text-destructive-foreground" />,
      colorClass: "bg-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};
