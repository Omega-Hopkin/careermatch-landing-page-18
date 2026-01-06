import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { ActivityFeed, ActivityItem } from "@/components/admin/ActivityFeed";
import { ModerationQueue, ModerationJob } from "@/components/admin/ModerationQueue";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { QuickActions } from "@/components/admin/QuickActions";
import { useToast } from "@/hooks/use-toast";

// Mock data for the admin dashboard
const mockStats = {
  totalUsers: 1247,
  students: 1089,
  recruiters: 158,
  activeJobs: 342,
  totalApplications: 4521,
  pendingModeration: 5,
  weeklyActivity: 892,
  monthlyActivity: 3456,
  systemHealth: "healthy" as const,
};

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "user_registration",
    title: "Nouvel utilisateur inscrit",
    description: "Marie Dupont s'est inscrite en tant qu'étudiante",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "job_posting",
    title: "Nouvelle offre publiée",
    description: "TechCorp a publié 'Développeur Full Stack'",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "application",
    title: "Candidature soumise",
    description: "Jean Martin a postulé chez DataFlow",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "moderation",
    title: "Offre signalée",
    description: "L'offre 'Marketing Manager' nécessite une vérification",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "user_registration",
    title: "Nouveau recruteur",
    description: "StartupXYZ a créé un compte entreprise",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const mockModerationJobs: ModerationJob[] = [
  {
    id: "1",
    title: "Développeur Python Senior",
    company: "AI Solutions",
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "GrowthHackers",
    postedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "UX Designer Lead",
    company: "DesignStudio Pro",
    postedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

const mockUserGrowthData = [
  { month: "Jan", students: 120, recruiters: 15 },
  { month: "Fév", students: 180, recruiters: 22 },
  { month: "Mar", students: 250, recruiters: 28 },
  { month: "Avr", students: 310, recruiters: 35 },
  { month: "Mai", students: 420, recruiters: 48 },
  { month: "Juin", students: 580, recruiters: 62 },
  { month: "Juil", students: 720, recruiters: 78 },
  { month: "Août", students: 850, recruiters: 95 },
  { month: "Sep", students: 920, recruiters: 112 },
  { month: "Oct", students: 1020, recruiters: 138 },
  { month: "Nov", students: 1089, recruiters: 158 },
];

const mockJobCategoryData = [
  { name: "Tech", value: 145 },
  { name: "Marketing", value: 68 },
  { name: "Design", value: 52 },
  { name: "Finance", value: 38 },
  { name: "RH", value: 25 },
  { name: "Autre", value: 14 },
];

const mockApplicationsData = [
  { month: "Jan", applications: 180 },
  { month: "Fév", applications: 250 },
  { month: "Mar", applications: 320 },
  { month: "Avr", applications: 410 },
  { month: "Mai", applications: 520 },
  { month: "Juin", applications: 680 },
  { month: "Juil", applications: 750 },
  { month: "Août", applications: 620 },
  { month: "Sep", applications: 890 },
  { month: "Oct", applications: 980 },
  { month: "Nov", applications: 1100 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [moderationJobs, setModerationJobs] = useState(mockModerationJobs);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUserEmail(user.email || "");
      // TODO: Check if user has admin role
      // For now, just allow access for development
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleApproveJob = (id: string) => {
    setModerationJobs((prev) => prev.filter((job) => job.id !== id));
    toast({
      title: "Offre approuvée",
      description: "L'offre a été publiée sur la plateforme.",
    });
  };

  const handleRejectJob = (id: string, reason: string) => {
    setModerationJobs((prev) => prev.filter((job) => job.id !== id));
    toast({
      title: "Offre rejetée",
      description: "Le recruteur a été notifié.",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="admin"
      user={{
        name: "Administrateur",
        email: userEmail,
      }}
      title="Administration"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-bold">Tableau de bord Admin</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme CareerMatch
          </p>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards
          stats={{
            ...mockStats,
            pendingModeration: moderationJobs.length,
          }}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ModerationQueue
              jobs={moderationJobs}
              onApprove={handleApproveJob}
              onReject={handleRejectJob}
            />
            <ActivityFeed activities={mockActivities} />
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Charts Section */}
        <AdminCharts
          userGrowthData={mockUserGrowthData}
          jobCategoryData={mockJobCategoryData}
          applicationsData={mockApplicationsData}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
