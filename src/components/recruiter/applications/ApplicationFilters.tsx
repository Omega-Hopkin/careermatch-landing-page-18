import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export type ApplicationStatus = "all" | "pending" | "reviewed" | "accepted" | "rejected";
export type SortOption = "recent" | "match" | "name";

interface Job {
  id: string;
  title: string;
}

interface ApplicationFiltersProps {
  jobs: Job[];
  selectedJob: string;
  onJobChange: (jobId: string) => void;
  status: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchScoreRange: [number, number];
  onMatchScoreChange: (range: [number, number]) => void;
}

export const ApplicationFilters = ({
  jobs,
  selectedJob,
  onJobChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  matchScoreRange,
  onMatchScoreChange,
}: ApplicationFiltersProps) => {
  const [localMatchRange, setLocalMatchRange] = useState(matchScoreRange);

  const handleMatchRangeChange = (values: number[]) => {
    const range: [number, number] = [values[0], values[1]];
    setLocalMatchRange(range);
  };

  const handleMatchRangeCommit = () => {
    onMatchScoreChange(localMatchRange);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom d'étudiant..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedJob} onValueChange={onJobChange}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Toutes les offres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les offres</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(val) => onSortChange(val as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récentes</SelectItem>
            <SelectItem value="match">Score de matching</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Score de matching</Label>
                <div className="pt-2">
                  <Slider
                    value={localMatchRange}
                    onValueChange={handleMatchRangeChange}
                    onValueCommit={handleMatchRangeCommit}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{localMatchRange[0]}%</span>
                    <span>{localMatchRange[1]}%</span>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs value={status} onValueChange={(val) => onStatusChange(val as ApplicationStatus)}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="reviewed">Vues</TabsTrigger>
          <TabsTrigger value="accepted">Acceptées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
