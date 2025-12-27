import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Eye, Download, CheckCircle, XCircle } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkReviewed: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onExport: () => void;
}

export const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onMarkReviewed,
  onAcceptAll,
  onRejectAll,
  onExport,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 mx-auto max-w-2xl">
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onMarkReviewed}>
            <Eye className="h-4 w-4 mr-2" />
            Marquer comme vues
          </Button>
          <Button variant="outline" size="sm" onClick={onAcceptAll} className="text-green-600 hover:text-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Accepter
          </Button>
          <Button variant="outline" size="sm" onClick={onRejectAll} className="text-destructive hover:text-destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Refuser
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );
};
