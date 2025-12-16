import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Skill {
  id: string;
  skill_name: string;
  skill_level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  onAddSkill: (name: string, level: string) => Promise<void>;
  onRemoveSkill: (id: string) => Promise<void>;
  isLoading: boolean;
}

const SKILL_LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

const SKILL_SUGGESTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "Git",
  "Docker",
  "AWS",
  "Excel",
  "PowerPoint",
  "Communication",
  "Gestion de projet",
  "Marketing digital",
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "advanced":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getLevelLabel = (level: string) => {
  return SKILL_LEVELS.find((l) => l.value === level)?.label || level;
};

export function SkillsSection({
  skills,
  onAddSkill,
  onRemoveSkill,
  isLoading,
}: SkillsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("intermediate");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setNewSkillName(value);
    if (value.length > 0) {
      const filtered = SKILL_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !skills.some((skill) => skill.skill_name.toLowerCase() === s.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    await onAddSkill(newSkillName.trim(), newSkillLevel);
    setNewSkillName("");
    setNewSkillLevel("intermediate");
    setFilteredSuggestions([]);
    setIsOpen(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setNewSkillName(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Mes Compétences</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une compétence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="skill-name">Compétence</Label>
                <div className="relative">
                  <Input
                    id="skill-name"
                    value={newSkillName}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Ex: React, Python, Excel..."
                  />
                  {filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                      {filteredSuggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => selectSuggestion(s)}
                          className="w-full px-3 py-2 text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill-level">Niveau</Label>
                <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddSkill}
                disabled={!newSkillName.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? "Ajout..." : "Ajouter la compétence"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune compétence ajoutée. Ajoutez vos compétences pour améliorer vos recommandations.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className={`${getLevelColor(skill.skill_level)} px-3 py-1.5 flex items-center gap-2`}
              >
                <span>{skill.skill_name}</span>
                <span className="text-xs opacity-70">({getLevelLabel(skill.skill_level)})</span>
                <button
                  onClick={() => onRemoveSkill(skill.id)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
