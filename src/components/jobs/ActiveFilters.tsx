import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface FilterState {
  jobTypes: string[];
  location: string;
  remote: string;
  experience: string;
  skills: string[];
  postedDate: string;
}

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
}

const filterLabels: Record<string, string> = {
  Stage: 'Stage',
  CDI: 'CDI',
  CDD: 'CDD',
  Freelance: 'Freelance',
  Alternance: 'Alternance',
  'sur-site': 'Sur site',
  'remote': 'Remote',
  'hybride': 'Hybride',
  'debutant': 'Débutant',
  'junior': 'Junior',
  'confirme': 'Confirmé',
  'today': "Aujourd'hui",
  'week': 'Cette semaine',
  'month': 'Ce mois'
};

export const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  const hasActiveFilters = 
    filters.jobTypes.length > 0 ||
    filters.location ||
    filters.remote ||
    filters.experience ||
    filters.skills.length > 0 ||
    filters.postedDate;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filtres actifs:</span>
      
      {filters.jobTypes.map(type => (
        <Badge key={type} variant="secondary" className="gap-1 pr-1">
          {filterLabels[type] || type}
          <button
            onClick={() => onRemoveFilter('jobTypes', type)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.location && (
        <Badge variant="secondary" className="gap-1 pr-1">
          📍 {filters.location}
          <button
            onClick={() => onRemoveFilter('location')}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.remote && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {filterLabels[filters.remote] || filters.remote}
          <button
            onClick={() => onRemoveFilter('remote')}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.experience && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {filterLabels[filters.experience] || filters.experience}
          <button
            onClick={() => onRemoveFilter('experience')}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.skills.map(skill => (
        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
          {skill}
          <button
            onClick={() => onRemoveFilter('skills', skill)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.postedDate && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {filterLabels[filters.postedDate] || filters.postedDate}
          <button
            onClick={() => onRemoveFilter('postedDate')}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-destructive hover:text-destructive"
      >
        Effacer tout
      </Button>
    </div>
  );
};
