import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const availableLanguages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' },
  { code: 'pt', name: 'Portugais' },
  { code: 'ar', name: 'Arabe' },
  { code: 'zh', name: 'Chinois' },
  { code: 'ja', name: 'Japonais' },
];

const proficiencyLevels = [
  { value: 'basic', label: 'Notions' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'fluent', label: 'Courant' },
  { value: 'native', label: 'Natif' },
];

export interface LanguageRequirement {
  language: string;
  level: string;
}

interface LanguagesMultiSelectProps {
  value: LanguageRequirement[];
  onChange: (value: LanguageRequirement[]) => void;
  className?: string;
}

export function LanguagesMultiSelect({ value, onChange, className }: LanguagesMultiSelectProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('intermediate');

  const addLanguage = () => {
    if (selectedLanguage && !value.find(l => l.language === selectedLanguage)) {
      onChange([...value, { language: selectedLanguage, level: selectedLevel }]);
      setSelectedLanguage('');
      setSelectedLevel('intermediate');
    }
  };

  const removeLanguage = (language: string) => {
    onChange(value.filter(l => l.language !== language));
  };

  const availableToAdd = availableLanguages.filter(
    lang => !value.find(l => l.language === lang.code)
  );

  const getLanguageName = (code: string) => 
    availableLanguages.find(l => l.code === code)?.name || code;

  const getLevelLabel = (level: string) =>
    proficiencyLevels.find(l => l.value === level)?.label || level;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sélectionner une langue" />
          </SelectTrigger>
          <SelectContent>
            {availableToAdd.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {proficiencyLevels.map(level => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addLanguage}
          disabled={!selectedLanguage}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map(lang => (
          <Badge
            key={lang.language}
            variant="secondary"
            className="pl-3 pr-1 py-1 gap-1"
          >
            {getLanguageName(lang.language)} - {getLevelLabel(lang.level)}
            <button
              type="button"
              onClick={() => removeLanguage(lang.language)}
              className="ml-1 hover:bg-muted-foreground/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
