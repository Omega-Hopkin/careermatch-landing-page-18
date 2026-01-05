import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ModerationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  moderatorFilter: string;
  onModeratorFilterChange: (value: string) => void;
  moderators: string[];
}

export const ModerationFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  moderatorFilter,
  onModeratorFilterChange,
  moderators,
}: ModerationFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou entreprise..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="approved">Approuvées</SelectItem>
          <SelectItem value="rejected">Rejetées</SelectItem>
          <SelectItem value="changes_requested">Modifications demandées</SelectItem>
        </SelectContent>
      </Select>

      <Select value={moderatorFilter} onValueChange={onModeratorFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Modérateur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les modérateurs</SelectItem>
          {moderators.map((moderator) => (
            <SelectItem key={moderator} value={moderator}>
              {moderator}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
