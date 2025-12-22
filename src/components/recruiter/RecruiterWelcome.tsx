import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";

interface RecruiterWelcomeProps {
  companyName: string;
  onCreateJob: () => void;
}

export const RecruiterWelcome = ({ companyName, onCreateJob }: RecruiterWelcomeProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{companyName}</h1>
          <p className="text-muted-foreground">Tableau de bord recruteur</p>
        </div>
      </div>
      <Button onClick={onCreateJob} className="gap-2">
        <Plus className="h-4 w-4" />
        Publier une offre
      </Button>
    </div>
  );
};
