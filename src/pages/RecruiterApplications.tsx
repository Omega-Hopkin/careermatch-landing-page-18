import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { ApplicationFilters, ApplicationStatus, SortOption } from "@/components/recruiter/applications/ApplicationFilters";
import { ApplicationsTable, ApplicationTableItem } from "@/components/recruiter/applications/ApplicationsTable";
import { ApplicationDetailModal } from "@/components/recruiter/applications/ApplicationDetailModal";
import { BulkActionsBar } from "@/components/recruiter/applications/BulkActionsBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Users } from "lucide-react";

// Mock data
const mockJobs = [
  { id: "1", title: "Développeur Full Stack Junior" },
  { id: "2", title: "Data Analyst Stagiaire" },
  { id: "3", title: "UX/UI Designer Alternance" },
];

const mockApplications: ApplicationTableItem[] = [
  {
    id: "1",
    studentName: "Marie Dupont",
    studentEmail: "marie.dupont@email.com",
    studentAvatar: "",
    jobTitle: "Développeur Full Stack Junior",
    jobId: "1",
    matchScore: 92,
    status: "pending",
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    coverLetter: "Passionnée par le développement web, je souhaite rejoindre votre équipe pour contribuer à des projets innovants...",
    cvUrl: "#",
  },
  {
    id: "2",
    studentName: "Thomas Martin",
    studentEmail: "thomas.martin@email.com",
    jobTitle: "Data Analyst Stagiaire",
    jobId: "2",
    matchScore: 78,
    status: "pending",
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    skills: ["Python", "SQL", "Tableau", "Excel"],
    coverLetter: "Fort d'une formation en statistiques et d'une expérience en analyse de données...",
  },
  {
    id: "3",
    studentName: "Sophie Bernard",
    studentEmail: "sophie.bernard@email.com",
    studentAvatar: "",
    jobTitle: "Développeur Full Stack Junior",
    jobId: "1",
    matchScore: 85,
    status: "reviewed",
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    skills: ["Vue.js", "JavaScript", "Firebase", "CSS"],
    coverLetter: "Développeuse passionnée avec une forte appétence pour les technologies front-end...",
    cvUrl: "#",
  },
  {
    id: "4",
    studentName: "Lucas Petit",
    studentEmail: "lucas.petit@email.com",
    jobTitle: "UX/UI Designer Alternance",
    jobId: "3",
    matchScore: 65,
    status: "pending",
    appliedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    coverLetter: "Designer créatif avec une approche centrée utilisateur...",
  },
  {
    id: "5",
    studentName: "Emma Leroy",
    studentEmail: "emma.leroy@email.com",
    jobTitle: "Data Analyst Stagiaire",
    jobId: "2",
    matchScore: 88,
    status: "accepted",
    appliedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    skills: ["R", "Python", "Power BI", "Machine Learning"],
    coverLetter: "Data scientist en formation, je suis motivée à apprendre et contribuer...",
    cvUrl: "#",
  },
  {
    id: "6",
    studentName: "Pierre Moreau",
    studentEmail: "pierre.moreau@email.com",
    jobTitle: "Développeur Full Stack Junior",
    jobId: "1",
    matchScore: 45,
    status: "rejected",
    appliedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    skills: ["HTML", "CSS", "JavaScript"],
    coverLetter: "Développeur débutant cherchant à acquérir de l'expérience...",
  },
];

const RecruiterApplications = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [selectedJob, setSelectedJob] = useState("all");
  const [status, setStatus] = useState<ApplicationStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [matchScoreRange, setMatchScoreRange] = useState<[number, number]>([0, 100]);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal state
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Veuillez vous connecter");
        navigate("/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Filter and sort applications
  const filteredApplications = mockApplications
    .filter((app) => {
      if (selectedJob !== "all" && app.jobId !== selectedJob) return false;
      if (status !== "all" && app.status !== status) return false;
      if (debouncedSearch && !app.studentName.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (app.matchScore < matchScoreRange[0] || app.matchScore > matchScoreRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.matchScore - a.matchScore;
        case "name":
          return a.studentName.localeCompare(b.studentName);
        case "recent":
        default:
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      }
    });

  const handleViewDetails = useCallback((id: string) => {
    setSelectedApplicationId(id);
    setIsDetailModalOpen(true);
  }, []);

  const handleAccept = useCallback((id: string) => {
    toast.success("Candidature acceptée");
    // TODO: Update in database
  }, []);

  const handleReject = useCallback((id: string) => {
    toast.success("Candidature refusée");
    // TODO: Update in database
  }, []);

  const handleMarkReviewed = useCallback((id: string) => {
    toast.success("Candidature marquée comme vue");
    // TODO: Update in database
  }, []);

  const handleSaveNotes = useCallback((id: string, notes: string) => {
    // Debounced save to database
    console.log("Saving notes for", id, notes);
  }, []);

  const handleBulkMarkReviewed = useCallback(() => {
    toast.success(`${selectedIds.length} candidatures marquées comme vues`);
    setSelectedIds([]);
  }, [selectedIds]);

  const handleBulkAccept = useCallback(() => {
    toast.success(`${selectedIds.length} candidatures acceptées`);
    setSelectedIds([]);
  }, [selectedIds]);

  const handleBulkReject = useCallback(() => {
    toast.success(`${selectedIds.length} candidatures refusées`);
    setSelectedIds([]);
  }, [selectedIds]);

  const handleExport = useCallback(() => {
    toast.success("Export en cours...");
    // TODO: Implement CSV/PDF export
  }, []);

  // Build application detail data
  const selectedApplication = selectedApplicationId
    ? mockApplications.find((a) => a.id === selectedApplicationId)
    : null;

  const applicationDetail = selectedApplication
    ? {
        id: selectedApplication.id,
        student: {
          name: selectedApplication.studentName,
          email: selectedApplication.studentEmail,
          phone: "+33 6 12 34 56 78",
          location: "Paris, France",
          year: "M2",
          filiere: "Informatique",
          avatar: selectedApplication.studentAvatar,
          skills: selectedApplication.skills,
          experiences: [
            { title: "Stage Développeur", company: "TechCorp", period: "Juin 2023 - Sept 2023" },
            { title: "Projet personnel", company: "Open Source", period: "2022 - Present" },
          ],
        },
        jobTitle: selectedApplication.jobTitle,
        matchScore: selectedApplication.matchScore,
        matchingSkills: selectedApplication.skills.slice(0, 3),
        missingSkills: ["Docker", "AWS"],
        coverLetter: selectedApplication.coverLetter || "",
        cvUrl: selectedApplication.cvUrl,
        appliedAt: selectedApplication.appliedAt,
        status: selectedApplication.status,
        recruiterNotes: "",
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <RecruiterSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Candidatures Reçues</h1>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <ApplicationFilters
              jobs={mockJobs}
              selectedJob={selectedJob}
              onJobChange={setSelectedJob}
              status={status}
              onStatusChange={setStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              matchScoreRange={matchScoreRange}
              onMatchScoreChange={setMatchScoreRange}
            />

            <ApplicationsTable
              applications={filteredApplications}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onViewDetails={handleViewDetails}
              onAccept={handleAccept}
              onReject={handleReject}
              onMarkReviewed={handleMarkReviewed}
            />

            <BulkActionsBar
              selectedCount={selectedIds.length}
              onClearSelection={() => setSelectedIds([])}
              onMarkReviewed={handleBulkMarkReviewed}
              onAcceptAll={handleBulkAccept}
              onRejectAll={handleBulkReject}
              onExport={handleExport}
            />
          </main>
        </SidebarInset>
      </div>

      <ApplicationDetailModal
        application={applicationDetail}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onAccept={handleAccept}
        onReject={handleReject}
        onMarkReviewed={handleMarkReviewed}
        onSaveNotes={handleSaveNotes}
      />
    </SidebarProvider>
  );
};

export default RecruiterApplications;
