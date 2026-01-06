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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

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

interface AppSidebarProps {
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

export const AppSidebar = ({ role, user }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header with Logo */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
              config.logoColor
            )}
          >
            <LogoIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">
              {config.title}
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* User Info */}
      {user && (
        <div
          className={cn(
            "p-4 border-b border-sidebar-border",
            isCollapsed && "p-2"
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar className={cn("shrink-0", isCollapsed ? "h-8 w-8" : "h-10 w-10")}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant={config.badgeVariant}
                    className="text-xs px-1.5 py-0"
                  >
                    {config.label}
                  </Badge>
                </div>
              </div>
            )}
            {!isCollapsed && <NotificationDropdown />}
          </div>
          {isCollapsed && (
            <div className="mt-2 flex justify-center">
              <NotificationDropdown />
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <SidebarContent className="px-2">
        {config.navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isActive(item.url) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      )}
                    >
                      <Link to={item.url} className="relative">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge
                            variant="destructive"
                            className={cn(
                              "ml-auto text-xs h-5 min-w-5 flex items-center justify-center",
                              isCollapsed && "absolute -top-1 -right-1 h-4 min-w-4 text-[10px] p-0"
                            )}
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Déconnexion"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
