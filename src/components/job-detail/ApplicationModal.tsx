import { useState, useEffect } from 'react';
import { Send, FileText, Upload, CheckCircle, Sparkles, AlertCircle, User, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  onSubmit: (data: { coverLetter: string; cvSource: 'profile' | 'upload'; cvFile?: File }) => void;
  hasApplied?: boolean;
}

// Mock profile data - in real app, fetch from Supabase
const mockProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  hasCv: true,
  cvName: 'CV_Jean_Dupont.pdf',
};

export const ApplicationModal = ({
  open,
  onOpenChange,
  jobTitle,
  companyName,
  onSubmit,
  hasApplied = false,
}: ApplicationModalProps) => {
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [cvSource, setCvSource] = useState<'profile' | 'upload'>('profile');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCoverLetterWarning, setShowCoverLetterWarning] = useState(false);

  const maxCoverLetterLength = 1000;
  const coverLetterLength = coverLetter.length;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCoverLetter('');
      setCvSource('profile');
      setCvFile(null);
      setIsConfirmed(false);
      setIsSubmitting(false);
      setIsSuccess(false);
      setShowCoverLetterWarning(false);
    }
  }, [open]);

  // Auto-close after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onOpenChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Format invalide',
          description: 'Veuillez sélectionner un fichier PDF.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Fichier trop volumineux',
          description: 'La taille maximale est de 5 Mo.',
          variant: 'destructive',
        });
        return;
      }
      setCvFile(file);
    }
  };

  const validateForm = (): boolean => {
    // Check CV
    if (cvSource === 'profile' && !mockProfile.hasCv) {
      toast({
        title: 'CV requis',
        description: 'Veuillez ajouter un CV à votre profil ou télécharger un nouveau CV.',
        variant: 'destructive',
      });
      return false;
    }
    if (cvSource === 'upload' && !cvFile) {
      toast({
        title: 'CV requis',
        description: 'Veuillez télécharger un CV.',
        variant: 'destructive',
      });
      return false;
    }

    // Check confirmation
    if (!isConfirmed) {
      toast({
        title: 'Confirmation requise',
        description: 'Veuillez confirmer que vos informations sont à jour.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Show warning if no cover letter
    if (!coverLetter.trim() && !showCoverLetterWarning) {
      setShowCoverLetterWarning(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit({ 
      coverLetter, 
      cvSource, 
      cvFile: cvFile || undefined 
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: 'Candidature envoyée!',
      description: `Votre candidature pour ${jobTitle} a été transmise à ${companyName}.`,
    });
  };

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 animate-in zoom-in duration-300" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Candidature envoyée avec succès !
            </h2>
            <p className="mb-6 text-muted-foreground">
              {companyName} a bien reçu votre candidature pour le poste de {jobTitle}.
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Voir mes candidatures
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Cette fenêtre se fermera automatiquement...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Already applied state
  if (hasApplied) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">
              Vous avez déjà postulé
            </h2>
            <p className="mb-6 text-muted-foreground">
              Votre candidature pour ce poste a été envoyée le 15 décembre 2024.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
              <Button>
                Voir ma candidature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Postuler à cette offre
          </DialogTitle>
          <DialogDescription className="text-base">
            <span className="font-medium text-foreground">{jobTitle}</span>
            <span className="mx-2">•</span>
            <span>{companyName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* CV Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">CV à utiliser *</Label>
            <RadioGroup
              value={cvSource}
              onValueChange={(value) => setCvSource(value as 'profile' | 'upload')}
              className="space-y-3"
            >
              {/* Profile CV Option */}
              <div className={cn(
                "flex items-center space-x-3 p-4 border rounded-lg transition-colors",
                cvSource === 'profile' 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/50"
              )}>
                <RadioGroupItem value="profile" id="profile-cv" />
                <div className="flex-1">
                  <Label htmlFor="profile-cv" className="cursor-pointer font-medium">
                    Utiliser le CV de mon profil
                  </Label>
                  {mockProfile.hasCv ? (
                    <div className="flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {mockProfile.cvName}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-destructive mt-1">
                      Aucun CV dans votre profil
                    </p>
                  )}
                </div>
              </div>

              {/* Upload New CV Option */}
              <div className={cn(
                "flex items-center space-x-3 p-4 border rounded-lg transition-colors",
                cvSource === 'upload' 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/50"
              )}>
                <RadioGroupItem value="upload" id="upload-cv" />
                <div className="flex-1">
                  <Label htmlFor="upload-cv" className="cursor-pointer font-medium">
                    Télécharger un nouveau CV
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    PDF uniquement, max 5 Mo
                  </p>
                </div>
              </div>
            </RadioGroup>

            {/* File Upload Area */}
            {cvSource === 'upload' && (
              <div className="mt-3">
                {cvFile ? (
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{cvFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCvFile(null)}
                    >
                      Changer
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Cliquez pour sélectionner un fichier
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover-letter" className="text-base font-semibold">
                Lettre de motivation
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (recommandée)
                </span>
              </Label>
              <Button variant="outline" size="sm" disabled className="gap-2">
                <Sparkles className="h-4 w-4" />
                Générer avec l'IA
                <Badge variant="secondary" className="ml-1 text-xs">
                  Bientôt
                </Badge>
              </Button>
            </div>
            
            <Textarea
              id="cover-letter"
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              value={coverLetter}
              onChange={(e) => {
                if (e.target.value.length <= maxCoverLetterLength) {
                  setCoverLetter(e.target.value);
                  setShowCoverLetterWarning(false);
                }
              }}
              rows={6}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between">
              {showCoverLetterWarning && !coverLetter.trim() && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Une lettre de motivation augmente vos chances
                  </span>
                </div>
              )}
              <p className={cn(
                "text-xs ml-auto",
                coverLetterLength > maxCoverLetterLength * 0.9 
                  ? "text-amber-600 dark:text-amber-400" 
                  : "text-muted-foreground"
              )}>
                {coverLetterLength}/{maxCoverLetterLength} caractères
              </p>
            </div>
          </div>

          {/* Profile Preview & Confirmation */}
          <div className="space-y-4 pt-2">
            <Label className="text-base font-semibold">Vos coordonnées</Label>
            <div className="p-4 bg-accent/50 rounded-lg space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {mockProfile.firstName} {mockProfile.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockProfile.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
              <Checkbox
                id="confirm"
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(!!checked)}
              />
              <div>
                <Label htmlFor="confirm" className="cursor-pointer font-medium">
                  Je confirme que mes informations sont à jour
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  En soumettant cette candidature, vous acceptez que vos informations soient partagées avec {companyName}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {showCoverLetterWarning && !coverLetter.trim() 
                  ? "Envoyer quand même" 
                  : "Envoyer ma candidature"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
