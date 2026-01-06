import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  FileText,
  Heart,
  User,
  Bell,
  LogOut,
  Briefcase,
  Users,
  Building2,
  Plus,
  LayoutDashboard,
  FileCheck,
  BarChart3,
  Settings,
  Shield,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export type UserRole = "student" | "recruiter" | "admin";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const studentNavigation: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Recommandations", url: "/dashboard/recommendations", icon: Sparkles },
      { title: "Rechercher des jobs", url: "/jobs", icon: Search },
      { title: "Mes candidatures", url: "/applications", icon: FileText },
      { title: "Jobs sauvegardés", url: "/dashboard/saved", icon: Heart },
    ],
  },
  {
    label: "Compte",
    items: [
      { title: "Mon profil", url: "/profile", icon: User },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell, badge: 3 },
    ],
  },
];

const recruiterNavigation: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/recruiter", icon: Home },
      { title: "Mes offres", url: "/recruiter/jobs", icon: Briefcase },
      { title: "Candidatures", url: "/recruiter/applications", icon: Users },
      { title: "Publier une offre", url: "/recruiter/jobs/new", icon: Plus },
    ],
  },
  {
    label: "Entreprise",
    items: [
      { title: "Mon entreprise", url: "/recruiter/company", icon: Building2 },
      { title: "Notifications", url: "/recruiter/notifications", icon: Bell, badge: 5 },
    ],
  },
];

const adminNavigation: NavGroup[] = [
  {
    label: "Gestion",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { title: "Utilisateurs", url: "/admin/users", icon: Users },
      { title: "Modération", url: "/admin/moderation", icon: FileCheck },
      { title: "Statistiques", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "Paramètres", url: "/admin/settings", icon: Settings },
    ],
  },
];

interface MobileSidebarProps {
  role: UserRole;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const roleConfig = {
  student: {
    navigation: studentNavigation,
    label: "Étudiant",
    badgeVariant: "default" as const,
    logoIcon: Briefcase,
    logoColor: "gradient-bg",
    title: "CareerMatch",
  },
  recruiter: {
    navigation: recruiterNavigation,
    label: "Recruteur",
    badgeVariant: "secondary" as const,
    logoIcon: Briefcase,
    logoColor: "bg-primary",
    title: "CareerMatch",
  },
  admin: {
    navigation: adminNavigation,
    label: "Admin",
    badgeVariant: "destructive" as const,
    logoIcon: Shield,
    logoColor: "bg-destructive",
    title: "Admin Panel",
  },
};

export const MobileSidebar = ({ role, user }: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const config = roleConfig[role];
  const LogoIcon = config.logoIcon;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
      navigate("/");
    }
    setOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/recruiter" || path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleNavigation = (url: string) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  config.logoColor
                )}
              >
                <LogoIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">{config.title}</span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <Badge variant={config.badgeVariant} className="mt-1 text-xs">
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {config.navigation.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavigation(item.url)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                          isActive(item.url)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge
                            variant={isActive(item.url) ? "secondary" : "destructive"}
                            className="text-xs h-5 min-w-5 flex items-center justify-center"
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
