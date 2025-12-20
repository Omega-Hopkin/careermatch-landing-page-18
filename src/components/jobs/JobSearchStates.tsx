import { SearchX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Nous n'avons pas trouvé d'offres correspondant à vos critères. 
        Essayez de modifier vos filtres ou d'élargir votre recherche.
      </p>
      <Button variant="outline" onClick={onClearFilters} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Réinitialiser les filtres
      </Button>
    </div>
  );
};

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Une erreur est survenue</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Nous n'avons pas pu charger les offres. Veuillez réessayer.
      </p>
      <Button onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
};
