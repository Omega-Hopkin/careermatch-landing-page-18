import { Button } from "@/components/ui/button";
import { X, Bell, Download, Ban } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkNotification: () => void;
  onBulkExport: () => void;
  onBulkSuspend: () => void;
}

export const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkNotification,
  onBulkExport,
  onBulkSuspend,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-muted/50 border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {selectedCount} utilisateur{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBulkNotification}>
          <Bell className="h-4 w-4 mr-2" />
          Notifier
        </Button>
        <Button variant="outline" size="sm" onClick={onBulkExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
        <Button variant="outline" size="sm" onClick={onBulkSuspend} className="text-destructive hover:text-destructive">
          <Ban className="h-4 w-4 mr-2" />
          Suspendre
        </Button>
      </div>
    </div>
  );
};
