import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Save, Send, X, Eye, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { RecruiterSidebar } from '@/components/recruiter/RecruiterSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { RichTextEditor } from '@/components/recruiter/job-form/RichTextEditor';
import { SkillsMultiSelect } from '@/components/recruiter/job-form/SkillsMultiSelect';
import { LanguagesMultiSelect, LanguageRequirement } from '@/components/recruiter/job-form/LanguagesMultiSelect';
import { JobPreviewCard } from '@/components/recruiter/job-form/JobPreviewCard';
import { jobPostingSchema, JobPostingFormData } from '@/lib/validations/job-posting';

const jobTypes = [
  { value: 'stage', label: 'Stage' },
  { value: 'cdi', label: 'CDI' },
  { value: 'cdd', label: 'CDD' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'alternance', label: 'Alternance' },
];

const educationLevels = [
  { value: 'bac', label: 'Bac' },
  { value: 'bac+2', label: 'Bac+2' },
  { value: 'bac+3', label: 'Bac+3 (Licence)' },
  { value: 'bac+5', label: 'Bac+5 (Master)' },
  { value: 'bac+8', label: 'Bac+8 (Doctorat)' },
];

export default function JobPosting() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: '',
      jobType: undefined,
      duration: '',
      location: '',
      remote: false,
      description: '',
      missions: '',
      profile: '',
      benefits: '',
      educationLevel: '',
      experienceRequired: '',
      skills: [],
      languages: [],
      expirationDate: undefined,
      autoClose: false,
      emailNotifications: true,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isDirty) {
      setHasUnsavedChanges(true);
    }
  }, [isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Brouillon enregistré",
      description: "Votre offre a été sauvegardée en tant que brouillon.",
    });
    setHasUnsavedChanges(false);
    setIsSubmitting(false);
  };

  const handlePublish = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Offre publiée !",
      description: "Votre offre d'emploi est maintenant visible par les candidats.",
    });
    setHasUnsavedChanges(false);
    setIsSubmitting(false);
    setShowPublishDialog(false);
    navigate('/recruiter');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      navigate('/recruiter');
    }
  };

  const showDurationField = ['stage', 'cdd', 'alternance'].includes(watchedValues.jobType || '');

  return (
    <SidebarProvider>
      <RecruiterSidebar />
      <SidebarInset className="bg-background">
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold">Nouvelle offre d'emploi</h1>
                <p className="text-sm text-muted-foreground">Remplissez les informations de votre offre</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden lg:flex"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? 'Masquer' : 'Aperçu'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Brouillon
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPublishDialog(true)}
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publier
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className={cn("grid gap-6", showPreview ? "lg:grid-cols-2" : "max-w-4xl mx-auto")}>
              {/* Form */}
              <form onSubmit={handleSubmit(handlePublish)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations générales</CardTitle>
                    <CardDescription>Décrivez le poste proposé</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du poste *</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        placeholder="Ex: Développeur React Junior"
                        className={cn(errors.title && "border-destructive")}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground text-right">
                        {watchedValues.title?.length || 0}/100
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de contrat *</Label>
                        <Controller
                          name="jobType"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className={cn(errors.jobType && "border-destructive")}>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                {jobTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.jobType && (
                          <p className="text-sm text-destructive">{errors.jobType.message}</p>
                        )}
                      </div>

                      {showDurationField && (
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée</Label>
                          <Input
                            id="duration"
                            {...register('duration')}
                            placeholder="Ex: 6 mois"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation *</Label>
                      <Input
                        id="location"
                        {...register('location')}
                        placeholder="Ex: Paris, France"
                        className={cn(errors.location && "border-destructive")}
                      />
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="remote"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="remote"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="remote" className="font-normal cursor-pointer">
                        Télétravail possible
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description du poste</CardTitle>
                    <CardDescription>Détaillez les missions et le profil recherché</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description générale *</Label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Décrivez le poste..."
                            className={cn(errors.description && "border-destructive")}
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description.message}</p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Missions (optionnel)</Label>
                      <Controller
                        name="missions"
                        control={control}
                        render={({ field }) => (
                          <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Listez les missions principales..."
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profil recherché (optionnel)</Label>
                      <Controller
                        name="profile"
                        control={control}
                        render={({ field }) => (
                          <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Décrivez le profil idéal..."
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Avantages (optionnel)</Label>
                      <Controller
                        name="benefits"
                        control={control}
                        render={({ field }) => (
                          <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Listez les avantages du poste..."
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prérequis</CardTitle>
                    <CardDescription>Définissez les compétences et qualifications requises</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Niveau d'études *</Label>
                        <Controller
                          name="educationLevel"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className={cn(errors.educationLevel && "border-destructive")}>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                {educationLevels.map(level => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.educationLevel && (
                          <p className="text-sm text-destructive">{errors.educationLevel.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experienceRequired">Expérience requise</Label>
                        <Input
                          id="experienceRequired"
                          {...register('experienceRequired')}
                          placeholder="Ex: 1-2 ans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Compétences requises * (minimum 3)</Label>
                      <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                          <SkillsMultiSelect
                            value={field.value}
                            onChange={field.onChange}
                            minSkills={3}
                          />
                        )}
                      />
                      {errors.skills && (
                        <p className="text-sm text-destructive">{errors.skills.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Langues (optionnel)</Label>
                      <Controller
                        name="languages"
                        control={control}
                        render={({ field }) => (
                          <LanguagesMultiSelect
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Application Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres de candidature</CardTitle>
                    <CardDescription>Configurez les options de candidature</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Date d'expiration *</Label>
                      <Controller
                        name="expirationDate"
                        control={control}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  errors.expirationDate && "border-destructive"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, 'PPP', { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {errors.expirationDate && (
                        <p className="text-sm text-destructive">{errors.expirationDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="autoClose"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="autoClose"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="autoClose" className="font-normal cursor-pointer">
                          Fermer automatiquement quand le poste est pourvu
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="emailNotifications"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="emailNotifications"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="emailNotifications" className="font-normal cursor-pointer">
                          Recevoir des notifications par email pour les nouvelles candidatures
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile action buttons */}
                <div className="lg:hidden flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Brouillon
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setShowPublishDialog(true)}
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Publier
                  </Button>
                </div>
              </form>

              {/* Preview Panel */}
              {showPreview && (
                <div className="hidden lg:block sticky top-24 h-fit">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Aperçu de l'offre
                    </div>
                    <JobPreviewCard
                      data={{
                        title: watchedValues.title,
                        jobType: watchedValues.jobType || '',
                        location: watchedValues.location,
                        remote: watchedValues.remote,
                        description: watchedValues.description,
                        skills: watchedValues.skills,
                        educationLevel: watchedValues.educationLevel,
                        experienceRequired: watchedValues.experienceRequired || '',
                        expirationDate: watchedValues.expirationDate,
                        duration: watchedValues.duration,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publish Confirmation Dialog */}
        <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publier l'offre ?</DialogTitle>
              <DialogDescription>
                Votre offre sera visible par tous les candidats. Vous pourrez la modifier ou la retirer à tout moment.
              </DialogDescription>
            </DialogHeader>
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Veuillez corriger les erreurs dans le formulaire avant de publier.
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit(handlePublish)} disabled={isSubmitting}>
                {isSubmitting ? 'Publication...' : 'Confirmer la publication'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unsaved Changes Dialog */}
        <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifications non enregistrées</DialogTitle>
              <DialogDescription>
                Vous avez des modifications non enregistrées. Voulez-vous les sauvegarder avant de quitter ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUnsavedDialog(false);
                  navigate('/recruiter');
                }}
              >
                Quitter sans sauvegarder
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  await handleSaveDraft();
                  setShowUnsavedDialog(false);
                  navigate('/recruiter');
                }}
              >
                Sauvegarder et quitter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
