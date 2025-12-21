import { FileSearch, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ApplicationsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export const ApplicationsEmptyState = ({ hasFilters, onClearFilters }: ApplicationsEmptyStateProps) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-accent p-4 mb-4">
          <FileSearch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Aucune candidature ne correspond à vos critères de recherche.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Effacer les filtres
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <FileSearch className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Aucune candidature</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Vous n'avez pas encore postulé à des offres. Découvrez les opportunités 
        qui correspondent à votre profil et lancez-vous !
      </p>
      <Button onClick={() => navigate('/jobs')} className="gap-2">
        Découvrir des opportunités
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
