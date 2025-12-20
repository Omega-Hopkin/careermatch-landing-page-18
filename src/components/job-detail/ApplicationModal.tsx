import { useState } from 'react';
import { Send, FileText, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  onSubmit: (data: { coverLetter: string; useProfileCV: boolean }) => void;
}

export const ApplicationModal = ({
  open,
  onOpenChange,
  jobTitle,
  companyName,
  onSubmit,
}: ApplicationModalProps) => {
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [useProfileCV, setUseProfileCV] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({ coverLetter, useProfileCV });
    
    toast({
      title: 'Candidature envoyée!',
      description: `Votre candidature pour ${jobTitle} a été transmise à ${companyName}.`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    setCoverLetter('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Postuler à cette offre
          </DialogTitle>
          <DialogDescription>
            {jobTitle} chez {companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* CV Selection */}
          <div className="space-y-3">
            <Label>CV à utiliser</Label>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-accent/50">
              <Checkbox
                id="use-profile-cv"
                checked={useProfileCV}
                onCheckedChange={(checked) => setUseProfileCV(!!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="use-profile-cv" className="cursor-pointer font-medium">
                  Utiliser le CV de mon profil
                </Label>
                <p className="text-sm text-muted-foreground">
                  Votre CV actuel sera joint à la candidature
                </p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            {!useProfileCV && (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Glissez votre CV ici ou cliquez pour le télécharger
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF uniquement, max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-3">
            <Label htmlFor="cover-letter">
              Lettre de motivation (optionnel)
            </Label>
            <Textarea
              id="cover-letter"
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {coverLetter.length}/2000 caractères
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer ma candidature
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
