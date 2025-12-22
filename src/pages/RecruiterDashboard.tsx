import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { RecruiterWelcome } from "@/components/recruiter/RecruiterWelcome";
import { RecruiterStats } from "@/components/recruiter/RecruiterStats";
import { ActiveJobsTable, RecruiterJob } from "@/components/recruiter/ActiveJobsTable";
import { RecentApplicationsRecruiter, RecruiterApplication } from "@/components/recruiter/RecentApplicationsRecruiter";
import { ApplicationsChart } from "@/components/recruiter/ApplicationsChart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock data - will be replaced with real data from Supabase
const mockJobs: RecruiterJob[] = [
  {
    id: "1",
    title: "Développeur Full Stack Junior",
    type: "CDI",
    applicationsCount: 24,
    status: "published",
    views: 342,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Paris, France",
  },
  {
    id: "2",
    title: "Data Analyst Stagiaire",
    type: "Stage",
    applicationsCount: 18,
    status: "published",
    views: 256,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Lyon, France",
  },
  {
    id: "3",
    title: "UX/UI Designer Alternance",
    type: "Alternance",
    applicationsCount: 12,
    status: "draft",
    views: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Remote",
  },
  {
    id: "4",
    title: "Product Manager Junior",
    type: "CDI",
    applicationsCount: 45,
    status: "closed",
    views: 512,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Paris, France",
  },
];

const mockApplications: RecruiterApplication[] = [
  {
    id: "1",
    studentName: "Marie Dupont",
    studentAvatar: "",
    jobTitle: "Développeur Full Stack Junior",
    matchScore: 92,
    status: "pending",
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    studentName: "Thomas Martin",
    jobTitle: "Data Analyst Stagiaire",
    matchScore: 78,
    status: "pending",
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    studentName: "Sophie Bernard",
    jobTitle: "Développeur Full Stack Junior",
    matchScore: 85,
    status: "reviewed",
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    studentName: "Lucas Petit",
    jobTitle: "UX/UI Designer Alternance",
    matchScore: 65,
    status: "pending",
    appliedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    studentName: "Emma Leroy",
    jobTitle: "Data Analyst Stagiaire",
    matchScore: 88,
    status: "accepted",
    appliedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

const applicationsPerJobData = [
  { jobTitle: "Dev Full Stack", applications: 24 },
  { jobTitle: "Data Analyst", applications: 18 },
  { jobTitle: "UX/UI Designer", applications: 12 },
  { jobTitle: "Product Manager", applications: 45 },
];

const applicationsOverTimeData = [
  { date: "Lun", applications: 5 },
  { date: "Mar", applications: 8 },
  { date: "Mer", applications: 12 },
  { date: "Jeu", applications: 7 },
  { date: "Ven", applications: 15 },
  { date: "Sam", applications: 3 },
  { date: "Dim", applications: 2 },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("TechStart SAS");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Veuillez vous connecter pour accéder au tableau de bord");
        navigate("/login");
        return;
      }

      // TODO: Check if user has recruiter role and fetch company info
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

  const handleCreateJob = () => {
    navigate('/recruiter/jobs/new');
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/recruiter/jobs/${jobId}/edit`);
  };

  const handleViewApplications = (jobId: string) => {
    navigate(`/recruiter/jobs/${jobId}/applications`);
  };

  const handleDuplicateJob = (jobId: string) => {
    toast.success("Offre dupliquée avec succès");
  };

  const handleArchiveJob = (jobId: string) => {
    toast.success("Offre archivée");
  };

  const handleAcceptApplication = (applicationId: string) => {
    toast.success("Candidature acceptée");
  };

  const handleRejectApplication = (applicationId: string) => {
    toast.success("Candidature refusée");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const activeJobs = mockJobs.filter(j => j.status === 'published').length;
  const totalApplications = mockJobs.reduce((sum, job) => sum + job.applicationsCount, 0);
  const newApplications = mockApplications.filter(a => a.status === 'pending').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <RecruiterSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6 space-y-6">
            <RecruiterWelcome 
              companyName={companyName} 
              onCreateJob={handleCreateJob} 
            />
            
            <RecruiterStats
              totalJobs={mockJobs.length}
              activeJobs={activeJobs}
              totalApplications={totalApplications}
              newApplications={newApplications}
              profileViews={1247}
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ActiveJobsTable
                  jobs={mockJobs}
                  onEditJob={handleEditJob}
                  onViewApplications={handleViewApplications}
                  onDuplicateJob={handleDuplicateJob}
                  onArchiveJob={handleArchiveJob}
                />
                <ApplicationsChart
                  applicationsPerJob={applicationsPerJobData}
                  applicationsOverTime={applicationsOverTimeData}
                />
              </div>
              <div>
                <RecentApplicationsRecruiter
                  applications={mockApplications}
                  onAccept={handleAcceptApplication}
                  onReject={handleRejectApplication}
                />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RecruiterDashboard;
