import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  UserFilters,
  RoleFilter,
  StatusFilter,
  SortOption,
} from "@/components/admin/users/UserFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { BulkActionsBar } from "@/components/admin/users/BulkActionsBar";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import { DeleteUserDialog } from "@/components/admin/users/DeleteUserDialog";
import { SendNotificationDialog } from "@/components/admin/users/SendNotificationDialog";
import { UserData } from "@/components/admin/users/UserActionsDropdown";

// Mock users data
const mockUsers: UserData[] = [
  {
    id: "1",
    email: "marie.dupont@email.com",
    firstName: "Marie",
    lastName: "Dupont",
    avatarUrl: null,
    role: "student",
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    applicationsSent: 12,
  },
  {
    id: "2",
    email: "jean.martin@techcorp.com",
    firstName: "Jean",
    lastName: "Martin",
    avatarUrl: null,
    role: "recruiter",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    jobsPosted: 8,
  },
  {
    id: "3",
    email: "sophie.bernard@email.com",
    firstName: "Sophie",
    lastName: "Bernard",
    avatarUrl: null,
    role: "student",
    status: "suspended",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    applicationsSent: 5,
  },
  {
    id: "4",
    email: "pierre.leroy@startup.io",
    firstName: "Pierre",
    lastName: "Leroy",
    avatarUrl: null,
    role: "recruiter",
    status: "active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    jobsPosted: 3,
  },
  {
    id: "5",
    email: "emma.petit@email.com",
    firstName: "Emma",
    lastName: "Petit",
    avatarUrl: null,
    role: "student",
    status: "active",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    applicationsSent: 2,
  },
  {
    id: "6",
    email: "lucas.moreau@bigcorp.fr",
    firstName: "Lucas",
    lastName: "Moreau",
    avatarUrl: null,
    role: "recruiter",
    status: "active",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    jobsPosted: 15,
  },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  // Selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Users state
  const [users, setUsers] = useState<UserData[]>(mockUsers);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isBulkNotificationOpen, setIsBulkNotificationOpen] = useState(false);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query)
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.firstName || "").localeCompare(b.firstName || "");
        case "name_desc":
          return (b.firstName || "").localeCompare(a.firstName || "");
        case "date_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date_desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "role":
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  // Selection handlers
  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers((prev) =>
      selected ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? filteredUsers.map((u) => u.id) : []);
  };

  // Action handlers
  const handleViewProfile = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleToggleStatus = (user: UserData) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    toast({
      title: newStatus === "suspended" ? "Compte suspendu" : "Compte activé",
      description: `Le compte de ${user.firstName} ${user.lastName} a été ${newStatus === "suspended" ? "suspendu" : "activé"}.`,
    });
  };

  const handleResetPassword = (user: UserData) => {
    toast({
      title: "Email envoyé",
      description: `Un email de réinitialisation a été envoyé à ${user.email}.`,
    });
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    toast({
      title: "Compte supprimé",
      description: "Le compte utilisateur a été supprimé avec succès.",
      variant: "destructive",
    });
  };

  const handleSendNotification = (user: UserData) => {
    setSelectedUser(user);
    setIsNotificationDialogOpen(true);
  };

  const handleSaveNotes = (userId: string, notes: string) => {
    toast({
      title: "Notes enregistrées",
      description: "Les notes administrateur ont été sauvegardées.",
    });
  };

  // Bulk actions
  const handleBulkNotification = () => {
    setIsBulkNotificationOpen(true);
  };

  const handleBulkExport = () => {
    const selectedData = users.filter((u) => selectedUsers.includes(u.id));
    const csvContent = [
      ["ID", "Email", "Prénom", "Nom", "Rôle", "Statut", "Date d'inscription"].join(","),
      ...selectedData.map((u) =>
        [u.id, u.email, u.firstName, u.lastName, u.role, u.status, u.createdAt].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${selectedUsers.length} utilisateur(s) exporté(s).`,
    });
  };

  const handleBulkSuspend = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedUsers.includes(u.id) ? { ...u, status: "suspended" as const } : u
      )
    );
    toast({
      title: "Comptes suspendus",
      description: `${selectedUsers.length} compte(s) ont été suspendus.`,
      variant: "destructive",
    });
    setSelectedUsers([]);
  };

  const handleSendBulkNotification = (title: string, message: string) => {
    toast({
      title: "Notifications envoyées",
      description: `${selectedUsers.length} notification(s) envoyée(s).`,
    });
    setSelectedUsers([]);
  };

  const handleSendSingleNotification = (title: string, message: string) => {
    toast({
      title: "Notification envoyée",
      description: `La notification a été envoyée à ${selectedUser?.email}.`,
    });
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const studentCount = users.filter((u) => u.role === "student").length;
  const recruiterCount = users.filter((u) => u.role === "recruiter").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Gestion des utilisateurs</h1>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total utilisateurs
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Utilisateurs actifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Étudiants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{studentCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recruteurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{recruiterCount}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Bar */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter tout
                </Button>
              </div>

              {/* Filters */}
              <UserFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Bulk Actions */}
              <BulkActionsBar
                selectedCount={selectedUsers.length}
                onClearSelection={() => setSelectedUsers([])}
                onBulkNotification={handleBulkNotification}
                onBulkExport={handleBulkExport}
                onBulkSuspend={handleBulkSuspend}
              />

              {/* Users Table */}
              <UsersTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onViewProfile={handleViewProfile}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
                onDelete={handleDeleteUser}
                onSendNotification={handleSendNotification}
              />
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onSaveNotes={handleSaveNotes}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
      />

      <SendNotificationDialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
        recipientCount={1}
        recipientName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : undefined}
        onSend={handleSendSingleNotification}
      />

      <SendNotificationDialog
        open={isBulkNotificationOpen}
        onOpenChange={setIsBulkNotificationOpen}
        recipientCount={selectedUsers.length}
        onSend={handleSendBulkNotification}
      />
    </SidebarProvider>
  );
};

export default AdminUsers;
