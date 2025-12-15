import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeHeaderProps {
  firstName: string;
  profileCompletion: number;
}

export const WelcomeHeader = ({ firstName, profileCompletion }: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Bonjour, {firstName} ! 👋
        </h1>
        <p className="text-muted-foreground">
          Voici vos opportunités de carrière personnalisées
        </p>
      </div>
      
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 min-w-[280px]">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Profil complété</span>
            <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>
        {profileCompletion < 100 && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/profile">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
