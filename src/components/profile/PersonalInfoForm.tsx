import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const personalInfoSchema = z.object({
  first_name: z.string().min(1, "Prénom requis").max(50),
  last_name: z.string().min(1, "Nom requis").max(50),
  filiere: z.string().optional(),
  year: z.string().optional(),
  bio: z.string().max(500, "Maximum 500 caractères").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  remote_preference: z.string().default("hybrid"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  data: PersonalInfoFormData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (data: PersonalInfoFormData) => Promise<void>;
  isSaving: boolean;
}

const FILIERES = [
  "Informatique",
  "Gestion",
  "Marketing",
  "Finance",
  "Ressources Humaines",
  "Commerce",
  "Communication",
  "Droit",
  "Ingénierie",
  "Autre",
];

const YEARS = [
  "1ère année",
  "2ème année",
  "3ème année",
  "4ème année",
  "5ème année",
  "Master",
  "Doctorat",
];

export function PersonalInfoForm({
  data,
  isEditing,
  onToggleEdit,
  onSave,
  isSaving,
}: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const bioLength = watch("bio")?.length || 0;

  const handleCancel = () => {
    reset(data);
    onToggleEdit();
  };

  const onSubmit = async (formData: PersonalInfoFormData) => {
    await onSave(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Informations personnelles</CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={onToggleEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              {...register("first_name")}
              disabled={!isEditing}
              className={errors.first_name ? "border-destructive" : ""}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              {...register("last_name")}
              disabled={!isEditing}
              className={errors.last_name ? "border-destructive" : ""}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="filiere">Filière</Label>
            <Select
              disabled={!isEditing}
              value={watch("filiere") || ""}
              onValueChange={(value) => setValue("filiere", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {FILIERES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Année d'études</Label>
            <Select
              disabled={!isEditing}
              value={watch("year") || ""}
              onValueChange={(value) => setValue("year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...register("phone")}
              disabled={!isEditing}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              {...register("location")}
              disabled={!isEditing}
              placeholder="Paris, France"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between">
              <Label htmlFor="bio">Bio</Label>
              <span className="text-sm text-muted-foreground">{bioLength}/500</span>
            </div>
            <Textarea
              id="bio"
              {...register("bio")}
              disabled={!isEditing}
              placeholder="Décrivez-vous en quelques mots..."
              rows={4}
              className={errors.bio ? "border-destructive" : ""}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label>Préférence de travail</Label>
            <RadioGroup
              disabled={!isEditing}
              value={watch("remote_preference")}
              onValueChange={(value) => setValue("remote_preference", value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onsite" id="onsite" />
                <Label htmlFor="onsite" className="font-normal cursor-pointer">
                  Sur site
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote" className="font-normal cursor-pointer">
                  Remote
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="font-normal cursor-pointer">
                  Hybride
                </Label>
              </div>
            </RadioGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
