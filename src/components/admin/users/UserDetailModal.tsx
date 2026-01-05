import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  Save,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { UserData } from "./UserActionsDropdown";

interface ActivityLogItem {
  id: string;
  type: "login" | "application" | "job_post" | "profile_update";
  description: string;
  timestamp: string;
}

interface UserDetailModalProps {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveNotes: (userId: string, notes: string) => void;
}

// Mock activity log
const mockActivityLog: ActivityLogItem[] = [
  {
    id: "1",
    type: "login",
    description: "Connexion depuis Paris, France",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "profile_update",
    description: "Mise à jour du profil",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "application",
    description: "Candidature envoyée pour 'Développeur React'",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "login",
    description: "Connexion depuis Lyon, France",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const UserDetailModal = ({
  user,
  open,
  onOpenChange,
  onSaveNotes,
}: UserDetailModalProps) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  if (!user) return null;

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return (f + l).toUpperCase() || "?";
  };

  const getRoleBadge = (role: "student" | "recruiter") => {
    switch (role) {
      case "student":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Étudiant
          </Badge>
        );
      case "recruiter":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            Recruteur
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: "active" | "suspended") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Actif
          </Badge>
        );
      case "suspended":
        return <Badge variant="destructive">Suspendu</Badge>;
    }
  };

  const getActivityIcon = (type: ActivityLogItem["type"]) => {
    switch (type) {
      case "login":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "job_post":
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case "profile_update":
        return <Calendar className="h-4 w-4 text-purple-500" />;
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSaveNotes(user.id, adminNotes);
    setIsSavingNotes(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
        </DialogHeader>

        {/* User Header */}
        <div className="flex items-start gap-4 py-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="text-lg">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {user.firstName || user.lastName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : "Sans nom"}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.status)}
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="notes">Notes admin</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            {/* Profile Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Date d'inscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(user.createdAt), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Dernière connexion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user.lastLoginAt
                        ? formatDistanceToNow(new Date(user.lastLoginAt), {
                            addSuffix: true,
                            locale: fr,
                          })
                        : "Jamais"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {user.role === "student" ? (
                    <>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">
                          {user.applicationsSent || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Candidatures envoyées
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">12</div>
                        <div className="text-sm text-muted-foreground">
                          Jobs sauvegardés
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">
                          {user.jobsPosted || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Offres publiées
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">45</div>
                        <div className="text-sm text-muted-foreground">
                          Candidatures reçues
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Journal d'activité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes administrateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ajouter des notes sur cet utilisateur..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                />
                <Button onClick={handleSaveNotes} disabled={isSavingNotes}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingNotes ? "Enregistrement..." : "Enregistrer les notes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
