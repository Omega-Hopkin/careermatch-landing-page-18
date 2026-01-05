import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ModerationQueueTable } from "@/components/admin/moderation/ModerationQueueTable";
import { JobReviewModal, ModerationJobDetail } from "@/components/admin/moderation/JobReviewModal";
import { ModerationHistory, ReviewedJob } from "@/components/admin/moderation/ModerationHistory";
import { ModerationFilters } from "@/components/admin/moderation/ModerationFilters";
import { RejectReasonDialog } from "@/components/admin/moderation/RejectReasonDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, FileCheck, History } from "lucide-react";

// Mock data for pending jobs
const mockPendingJobs: ModerationJobDetail[] = [
  {
    id: "1",
    title: "Développeur Full Stack React/Node.js",
    company: "TechStart SAS",
    location: "Paris, France",
    type: "stage",
    salary: "1200€ - 1500€/mois",
    description:
      "Nous recherchons un stagiaire passionné par le développement web pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.",
    requirements: [
      "Connaissance de React et Node.js",
      "Bases en TypeScript",
      "Capacité à travailler en équipe",
      "Curiosité et envie d'apprendre",
    ],
    postedAt: "2024-01-15T10:30:00",
    recruiterEmail: "recrutement@techstart.fr",
    isFlagged: false,
  },
  {
    id: "2",
    title: "Data Analyst Junior",
    company: "DataCorp",
    location: "Lyon, France",
    type: "alternance",
    salary: "900€ - 1100€/mois",
    description:
      "Rejoignez notre équipe data pour analyser de grandes quantités de données et produire des insights business.",
    requirements: [
      "Python et SQL",
      "Notions de statistiques",
      "Excel avancé",
      "Power BI ou Tableau",
    ],
    postedAt: "2024-01-14T14:00:00",
    recruiterEmail: "jobs@datacorp.fr",
    isFlagged: true,
    flagCount: 3,
    flagReasons: [
      "Salaire potentiellement sous le SMIC",
      "Description vague des missions",
    ],
  },
  {
    id: "3",
    title: "Marketing Digital Intern",
    company: "GrowthAgency",
    location: "Remote",
    type: "stage",
    description:
      "Stage en marketing digital avec focus sur le SEO, les réseaux sociaux et l'email marketing.",
    requirements: [
      "Connaissance des réseaux sociaux",
      "Notions de SEO",
      "Créativité",
      "Bon niveau d'anglais",
    ],
    postedAt: "2024-01-13T09:15:00",
    recruiterEmail: "hr@growthagency.com",
    isFlagged: false,
  },
  {
    id: "4",
    title: "URGENT: Gagnez 5000€/mois facilement!!!",
    company: "SuccessNow",
    location: "Partout",
    type: "freelance",
    description:
      "Opportunité incroyable! Travaillez de chez vous et gagnez des milliers d'euros. Formation gratuite incluse!",
    requirements: ["Aucune expérience requise", "Motivation"],
    postedAt: "2024-01-12T16:45:00",
    recruiterEmail: "contact@successnow.biz",
    isFlagged: true,
    flagCount: 12,
    flagReasons: [
      "Semble être une arnaque",
      "Promesses irréalistes",
      "Description non professionnelle",
    ],
  },
];

// Mock data for reviewed jobs
const mockReviewedJobs: ReviewedJob[] = [
  {
    id: "r1",
    title: "Développeur Python Senior",
    company: "AI Solutions",
    status: "approved",
    reviewedAt: "2024-01-10T11:00:00",
    reviewedBy: "Admin Martin",
  },
  {
    id: "r2",
    title: "Vendeur à domicile indépendant",
    company: "MLM Corp",
    status: "rejected",
    reviewedAt: "2024-01-09T15:30:00",
    reviewedBy: "Admin Sophie",
    reason: "Spam ou arnaque - Schéma de type MLM détecté",
  },
  {
    id: "r3",
    title: "Designer UX/UI",
    company: "Creative Studio",
    status: "changes_requested",
    reviewedAt: "2024-01-08T09:45:00",
    reviewedBy: "Admin Martin",
    reason: "Description incomplète - Merci de préciser les outils utilisés",
  },
  {
    id: "r4",
    title: "Comptable Junior",
    company: "Cabinet Expertise",
    status: "approved",
    reviewedAt: "2024-01-07T14:20:00",
    reviewedBy: "Admin Sophie",
  },
];

const moderators = ["Admin Martin", "Admin Sophie", "Admin Julie"];

export default function AdminModeration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingJobs, setPendingJobs] = useState<ModerationJobDetail[]>(mockPendingJobs);
  const [reviewedJobs, setReviewedJobs] = useState<ReviewedJob[]>(mockReviewedJobs);
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState<ModerationJobDetail | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [jobToReject, setJobToReject] = useState<ModerationJobDetail | null>(null);

  // Filter states for history
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moderatorFilter, setModeratorFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Keyboard shortcuts for quick actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReviewModalOpen || isRejectDialogOpen) return;
      if (e.target !== document.body) return;

      // No global shortcuts when modal is closed - shortcuts work inside modal
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isReviewModalOpen, isRejectDialogOpen]);

  const handleReview = (job: ModerationJobDetail) => {
    setSelectedJob(job);
    setIsReviewModalOpen(true);
  };

  const handleQuickApprove = (jobId: string) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (!job) return;

    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    setReviewedJobs((prev) => [
      {
        id: jobId,
        title: job.title,
        company: job.company,
        status: "approved",
        reviewedAt: new Date().toISOString(),
        reviewedBy: "Admin Actuel",
      },
      ...prev,
    ]);
    toast.success(`"${job.title}" a été approuvée`);
  };

  const handleApprove = (jobId: string, notes: string) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (!job) return;

    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    setReviewedJobs((prev) => [
      {
        id: jobId,
        title: job.title,
        company: job.company,
        status: "approved",
        reviewedAt: new Date().toISOString(),
        reviewedBy: "Admin Actuel",
        reason: notes || undefined,
      },
      ...prev,
    ]);
    setIsReviewModalOpen(false);
    toast.success(`"${job.title}" a été approuvée`);
  };

  const handleQuickReject = (jobId: string) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (!job) return;

    setJobToReject(job);
    setIsRejectDialogOpen(true);
  };

  const handleRejectFromModal = (jobId: string) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (!job) return;

    setJobToReject(job);
    setIsReviewModalOpen(false);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = (reason: string, details: string) => {
    if (!jobToReject) return;

    const fullReason = details ? `${reason} - ${details}` : reason;

    setPendingJobs((prev) => prev.filter((j) => j.id !== jobToReject.id));
    setReviewedJobs((prev) => [
      {
        id: jobToReject.id,
        title: jobToReject.title,
        company: jobToReject.company,
        status: "rejected",
        reviewedAt: new Date().toISOString(),
        reviewedBy: "Admin Actuel",
        reason: fullReason,
      },
      ...prev,
    ]);
    setIsRejectDialogOpen(false);
    setJobToReject(null);
    toast.success(`"${jobToReject.title}" a été rejetée`);
  };

  const handleRequestChanges = (jobId: string, notes: string) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (!job) return;

    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    setReviewedJobs((prev) => [
      {
        id: jobId,
        title: job.title,
        company: job.company,
        status: "changes_requested",
        reviewedAt: new Date().toISOString(),
        reviewedBy: "Admin Actuel",
        reason: notes || "Modifications demandées",
      },
      ...prev,
    ]);
    setIsReviewModalOpen(false);
    toast.success(`Des modifications ont été demandées pour "${job.title}"`);
  };

  // Filter reviewed jobs
  const filteredReviewedJobs = reviewedJobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;

    const matchesModerator =
      moderatorFilter === "all" || job.reviewedBy === moderatorFilter;

    return matchesSearch && matchesStatus && matchesModerator;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Modération des offres</h1>
            <p className="text-muted-foreground">
              Examinez et validez les offres d'emploi soumises par les recruteurs
            </p>
          </div>

          <Tabs defaultValue="queue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="queue" className="gap-2">
                <FileCheck className="h-4 w-4" />
                File d'attente
                {pendingJobs.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {pendingJobs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Offres en attente de modération</span>
                    <div className="text-sm font-normal text-muted-foreground">
                      Raccourcis: <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">A</kbd> Approuver,{" "}
                      <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">R</kbd> Rejeter (dans le modal)
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ModerationQueueTable
                    jobs={pendingJobs}
                    onReview={handleReview}
                    onQuickApprove={handleQuickApprove}
                    onQuickReject={handleQuickReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des modérations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ModerationFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    moderatorFilter={moderatorFilter}
                    onModeratorFilterChange={setModeratorFilter}
                    moderators={moderators}
                  />
                  <ModerationHistory jobs={filteredReviewedJobs} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <JobReviewModal
          job={selectedJob}
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          onApprove={handleApprove}
          onReject={handleRejectFromModal}
          onRequestChanges={handleRequestChanges}
        />

        <RejectReasonDialog
          open={isRejectDialogOpen}
          onOpenChange={setIsRejectDialogOpen}
          jobTitle={jobToReject?.title || ""}
          onConfirm={handleConfirmReject}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
