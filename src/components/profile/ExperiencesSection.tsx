import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Edit2, Trash2, Briefcase, Calendar } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const experienceSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  company: z.string().min(1, "Entreprise requise"),
  experience_type: z.string().min(1, "Type requis"),
  start_date: z.string().min(1, "Date de début requise"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

export interface Experience {
  id: string;
  title: string;
  company: string;
  experience_type: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface ExperiencesSectionProps {
  experiences: Experience[];
  onAddExperience: (data: ExperienceFormData) => Promise<void>;
  onUpdateExperience: (id: string, data: ExperienceFormData) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
  isLoading: boolean;
}

const EXPERIENCE_TYPES = [
  { value: "stage", label: "Stage" },
  { value: "emploi", label: "Emploi" },
  { value: "projet", label: "Projet" },
  { value: "alternance", label: "Alternance" },
];

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "stage":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "emploi":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "projet":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "alternance":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeLabel = (type: string) => {
  return EXPERIENCE_TYPES.find((t) => t.value === type)?.label || type;
};

function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
  isLoading,
}: {
  experience?: Experience;
  onSubmit: (data: ExperienceFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience
      ? {
          ...experience,
          start_date: experience.start_date,
          end_date: experience.end_date || "",
          is_current: experience.is_current,
          description: experience.description || "",
        }
      : {
          title: "",
          company: "",
          experience_type: "stage",
          start_date: "",
          end_date: "",
          is_current: false,
          description: "",
        },
  });

  const isCurrent = watch("is_current");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du poste</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Ex: Développeur Frontend"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Ex: Google"
            className={errors.company ? "border-destructive" : ""}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience_type">Type</Label>
        <Select
          value={watch("experience_type")}
          onValueChange={(value) => setValue("experience_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date")}
            className={errors.start_date ? "border-destructive" : ""}
          />
          {errors.start_date && (
            <p className="text-sm text-destructive">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
            disabled={isCurrent}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_current"
          checked={isCurrent}
          onCheckedChange={(checked) => {
            setValue("is_current", checked as boolean);
            if (checked) setValue("end_date", "");
          }}
        />
        <Label htmlFor="is_current" className="font-normal cursor-pointer">
          Actuellement en poste
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Décrivez vos missions et réalisations..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : experience ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

export function ExperiencesSection({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  isLoading,
}: ExperiencesSectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const handleAdd = async (data: ExperienceFormData) => {
    await onAddExperience(data);
    setIsAddOpen(false);
  };

  const handleUpdate = async (data: ExperienceFormData) => {
    if (editingExperience) {
      await onUpdateExperience(editingExperience.id, data);
      setEditingExperience(null);
    }
  };

  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Expériences</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter une expérience</DialogTitle>
            </DialogHeader>
            <ExperienceForm
              onSubmit={handleAdd}
              onCancel={() => setIsAddOpen(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {experiences.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune expérience ajoutée. Ajoutez vos stages, emplois et projets.
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {sortedExperiences.map((exp) => (
                <div key={exp.id} className="relative pl-10">
                  <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-foreground">{exp.title}</h4>
                          <Badge className={getTypeBadgeColor(exp.experience_type)}>
                            {getTypeLabel(exp.experience_type)}
                          </Badge>
                          {exp.is_current && (
                            <Badge variant="outline" className="text-primary border-primary">
                              En cours
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(exp.start_date), "MMM yyyy", { locale: fr })} -{" "}
                            {exp.is_current
                              ? "Présent"
                              : exp.end_date
                              ? format(new Date(exp.end_date), "MMM yyyy", { locale: fr })
                              : ""}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Dialog
                          open={editingExperience?.id === exp.id}
                          onOpenChange={(open) => !open && setEditingExperience(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingExperience(exp)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Modifier l'expérience</DialogTitle>
                            </DialogHeader>
                            <ExperienceForm
                              experience={exp}
                              onSubmit={handleUpdate}
                              onCancel={() => setEditingExperience(null)}
                              isLoading={isLoading}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette expérience ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. L'expérience sera définitivement
                                supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteExperience(exp.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
