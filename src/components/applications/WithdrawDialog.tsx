import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  jobTitle: string;
  companyName: string;
}

export const WithdrawDialog = ({
  open,
  onOpenChange,
  onConfirm,
  jobTitle,
  companyName,
}: WithdrawDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retirer votre candidature ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir retirer votre candidature pour le poste de{' '}
            <span className="font-medium text-foreground">{jobTitle}</span> chez{' '}
            <span className="font-medium text-foreground">{companyName}</span> ?
            <br /><br />
            Cette action est irréversible. Vous devrez postuler à nouveau si vous changez d'avis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Retirer ma candidature
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
