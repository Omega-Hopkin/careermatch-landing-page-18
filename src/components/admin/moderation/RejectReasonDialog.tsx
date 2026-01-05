import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const REJECTION_REASONS = [
  { value: "inappropriate_content", label: "Contenu inapproprié" },
  { value: "spam_scam", label: "Spam ou arnaque" },
  { value: "invalid_requirements", label: "Exigences invalides" },
  { value: "unverified_company", label: "Entreprise non vérifiée" },
  { value: "duplicate", label: "Offre en double" },
  { value: "incomplete", label: "Informations incomplètes" },
  { value: "other", label: "Autre" },
];

interface RejectReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  onConfirm: (reason: string, details: string) => void;
}

export const RejectReasonDialog = ({
  open,
  onOpenChange,
  jobTitle,
  onConfirm,
}: RejectReasonDialogProps) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleConfirm = () => {
    if (reason) {
      const reasonLabel = REJECTION_REASONS.find((r) => r.value === reason)?.label || reason;
      onConfirm(reasonLabel, details);
      setReason("");
      setDetails("");
    }
  };

  const handleCancel = () => {
    setReason("");
    setDetails("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rejeter l'offre</DialogTitle>
          <DialogDescription>
            Indiquez la raison du rejet pour "{jobTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du rejet *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Détails supplémentaires</Label>
            <Textarea
              id="details"
              placeholder="Ajoutez des détails pour le recruteur..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason}
          >
            Rejeter l'offre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
