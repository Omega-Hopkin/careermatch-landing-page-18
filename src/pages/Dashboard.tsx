import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecommendedJobs } from "@/components/dashboard/RecommendedJobs";
import { RecentApplications, Application } from "@/components/dashboard/RecentApplications";
import { Job } from "@/components/dashboard/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock data - in production this would come from the API
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Développeur Full Stack Junior",
    company: "TechStart SAS",
    location: "Paris, France",
    isRemote: true,
    matchScore: 92,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Data Analyst Stagiaire",
    company: "DataCorp",
    location: "Lyon, France",
    isRemote: false,
    matchScore: 78,
    skills: ["Python", "SQL", "Tableau", "Excel"],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "Creative Agency",
    location: "Bordeaux, France",
    isRemote: true,
    matchScore: 65,
    skills: ["Figma", "Adobe XD", "Prototypage", "User Research"],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Marketing Digital Assistant",
    company: "GrowthHub",
    location: "Nantes, France",
    isRemote: true,
    matchScore: 45,
    skills: ["SEO", "Google Ads", "Social Media", "Analytics"],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Développeur Frontend React",
    company: "InnoTech",
    status: "reviewed",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    jobTitle: "Stage Développement Web",
    company: "WebAgency Pro",
    status: "pending",
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    jobTitle: "Alternance Data Science",
    company: "AI Solutions",
    status: "accepted",
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("Utilisateur");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Veuillez vous connecter pour accéder au tableau de bord");
        navigate("/login");
        return;
      }

      // Get user's email and extract first name
      const email = session.user.email || "";
      setUserEmail(email);
      const name = email.split("@")[0];
      setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="student"
      user={{
        name: firstName,
        email: userEmail,
      }}
    >
      <div className="space-y-6">
        <WelcomeHeader firstName={firstName} profileCompletion={65} />
        
        <QuickStats
          recommendations={12}
          applications={5}
          profileViews={28}
          savedJobs={8}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecommendedJobs jobs={mockJobs} />
          </div>
          <div>
            <RecentApplications applications={mockApplications} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
