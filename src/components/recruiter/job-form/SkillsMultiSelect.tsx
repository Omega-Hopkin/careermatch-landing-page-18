import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const suggestedSkills = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile', 'Scrum',
  'Communication', 'Leadership', 'Problem Solving', 'Excel', 'Figma',
  'UI/UX', 'Marketing', 'Sales', 'Finance', 'Data Analysis'
];

interface SkillsMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  minSkills?: number;
  className?: string;
}

export function SkillsMultiSelect({ value, onChange, minSkills = 3, className }: SkillsMultiSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestedSkills.filter(
    skill => 
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (skill.trim() && !value.includes(skill.trim())) {
      onChange([...value, skill.trim()]);
      setInputValue('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue);
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une compétence..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => inputValue.trim() && addSkill(inputValue)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map(skill => (
              <button
                key={skill}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                onMouseDown={() => addSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map(skill => (
          <Badge
            key={skill}
            variant="secondary"
            className="pl-3 pr-1 py-1 gap-1"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:bg-muted-foreground/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {value.length < minSkills && (
        <p className="text-sm text-muted-foreground">
          Minimum {minSkills} compétences requises ({value.length}/{minSkills})
        </p>
      )}
    </div>
  );
}
