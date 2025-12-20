import { useState } from 'react';
import { Filter, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FilterState } from './ActiveFilters';

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

const jobTypes = [
  { value: 'Stage', label: 'Stage' },
  { value: 'CDI', label: 'CDI' },
  { value: 'CDD', label: 'CDD' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Alternance', label: 'Alternance' },
];

const availableSkills = [
  'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js',
  'SQL', 'Docker', 'AWS', 'Git', 'Figma', 'Marketing Digital',
  'SEO', 'Data Analysis', 'Machine Learning', 'Java', 'C++'
];

const locationSuggestions = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
  'Nantes', 'Lille', 'Strasbourg', 'Nice', 'Montpellier'
];

export const FiltersSidebar = ({ filters, onFiltersChange, onClearAll }: FiltersSidebarProps) => {
  const isMobile = useIsMobile();
  const [skillSearch, setSkillSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.jobTypes, type]
      : filters.jobTypes.filter(t => t !== type);
    onFiltersChange({ ...filters, jobTypes: newTypes });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Type de contrat</Label>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={filters.jobTypes.includes(type.value)}
                onCheckedChange={(checked) => handleJobTypeChange(type.value, !!checked)}
              />
              <Label htmlFor={type.value} className="cursor-pointer font-normal">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Localisation</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ville, région..."
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            onFocus={() => setShowLocationSuggestions(true)}
            onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
            className="pl-10"
          />
          {showLocationSuggestions && filters.location === '' && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
              {locationSuggestions.slice(0, 5).map(loc => (
                <button
                  key={loc}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                  onMouseDown={() => onFiltersChange({ ...filters, location: loc })}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Remote */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Mode de travail</Label>
        <RadioGroup
          value={filters.remote}
          onValueChange={(value) => onFiltersChange({ ...filters, remote: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="remote-all" />
            <Label htmlFor="remote-all" className="cursor-pointer font-normal">Tous</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sur-site" id="remote-onsite" />
            <Label htmlFor="remote-onsite" className="cursor-pointer font-normal">Sur site</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="remote" id="remote-remote" />
            <Label htmlFor="remote-remote" className="cursor-pointer font-normal">Remote</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybride" id="remote-hybrid" />
            <Label htmlFor="remote-hybrid" className="cursor-pointer font-normal">Hybride</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Niveau d'expérience</Label>
        <Select
          value={filters.experience}
          onValueChange={(value) => onFiltersChange({ ...filters, experience: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les niveaux</SelectItem>
            <SelectItem value="debutant">Débutant</SelectItem>
            <SelectItem value="junior">Junior (1-3 ans)</SelectItem>
            <SelectItem value="confirme">Confirmé (3+ ans)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Compétences</Label>
        <Input
          placeholder="Rechercher une compétence..."
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {filteredSkills.map(skill => (
            <Badge
              key={skill}
              variant={filters.skills.includes(skill) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
              {filters.skills.includes(skill) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posted Date */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Date de publication</Label>
        <RadioGroup
          value={filters.postedDate}
          onValueChange={(value) => onFiltersChange({ ...filters, postedDate: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="date-all" />
            <Label htmlFor="date-all" className="cursor-pointer font-normal">Toutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="today" id="date-today" />
            <Label htmlFor="date-today" className="cursor-pointer font-normal">Aujourd'hui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="date-week" />
            <Label htmlFor="date-week" className="cursor-pointer font-normal">Cette semaine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="date-month" />
            <Label htmlFor="date-month" className="cursor-pointer font-normal">Ce mois</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Clear All */}
      <Button variant="outline" className="w-full" onClick={onClearAll}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
            {(filters.jobTypes.length > 0 || filters.location || filters.remote || 
              filters.experience || filters.skills.length > 0 || filters.postedDate) && (
              <Badge variant="secondary" className="ml-1">
                {filters.jobTypes.length + (filters.location ? 1 : 0) + 
                 (filters.remote ? 1 : 0) + (filters.experience ? 1 : 0) +
                 filters.skills.length + (filters.postedDate ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Filtres</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(85vh-120px)] mt-4">
            <div className="pr-4">
              <FilterContent />
            </div>
          </ScrollArea>
          <SheetFooter className="mt-4">
            <Button className="w-full">Appliquer les filtres</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-72 shrink-0">
      <div className="bg-card border border-border rounded-lg p-5 sticky top-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="pr-4">
            <FilterContent />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
