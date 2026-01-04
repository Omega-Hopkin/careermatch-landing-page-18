import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Settings, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Voir utilisateurs",
      icon: Users,
      onClick: () => navigate("/admin/users"),
      variant: "default" as const,
    },
    {
      label: "Gérer les offres",
      icon: Briefcase,
      onClick: () => navigate("/admin/jobs"),
      variant: "secondary" as const,
    },
    {
      label: "Paramètres",
      icon: Settings,
      onClick: () => navigate("/admin/settings"),
      variant: "outline" as const,
    },
    {
      label: "Exporter données",
      icon: Download,
      onClick: () => {
        // TODO: Implement export
        console.log("Export data");
      },
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex flex-col gap-2"
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};