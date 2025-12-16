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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Language {
  id: string;
  language_name: string;
  proficiency_level: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  onAddLanguage: (name: string, level: string) => Promise<void>;
  onRemoveLanguage: (id: string) => Promise<void>;
  isLoading: boolean;
}

const LANGUAGE_OPTIONS = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
  "Portugais",
  "Arabe",
  "Chinois",
  "Japonais",
  "Russe",
  "Autre",
];

const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Débutant (A1-A2)" },
  { value: "intermediate", label: "Intermédiaire (B1-B2)" },
  { value: "advanced", label: "Avancé (C1-C2)" },
  { value: "native", label: "Langue maternelle" },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "advanced":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "native":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getLevelLabel = (level: string) => {
  return PROFICIENCY_LEVELS.find((l) => l.value === level)?.label || level;
};

export function LanguagesSection({
  languages,
  onAddLanguage,
  onRemoveLanguage,
  isLoading,
}: LanguagesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("intermediate");

  const availableLanguages = LANGUAGE_OPTIONS.filter(
    (lang) => !languages.some((l) => l.language_name === lang)
  );

  const handleAddLanguage = async () => {
    if (!selectedLanguage) return;
    await onAddLanguage(selectedLanguage, selectedLevel);
    setSelectedLanguage("");
    setSelectedLevel("intermediate");
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Langues</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={availableLanguages.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une langue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proficiency">Niveau</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddLanguage}
                disabled={!selectedLanguage || isLoading}
                className="w-full"
              >
                {isLoading ? "Ajout..." : "Ajouter la langue"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {languages.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune langue ajoutée. Indiquez les langues que vous maîtrisez.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Badge
                key={lang.id}
                variant="secondary"
                className={`${getLevelColor(lang.proficiency_level)} px-3 py-1.5 flex items-center gap-2`}
              >
                <span>{lang.language_name}</span>
                <span className="text-xs opacity-70">
                  ({getLevelLabel(lang.proficiency_level)})
                </span>
                <button
                  onClick={() => onRemoveLanguage(lang.id)}
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
