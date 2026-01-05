import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActionsDropdown, UserData } from "./UserActionsDropdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UsersTableProps {
  users: UserData[];
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onViewProfile: (user: UserData) => void;
  onToggleStatus: (user: UserData) => void;
  onResetPassword: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  onSendNotification: (user: UserData) => void;
}

export const UsersTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onViewProfile,
  onToggleStatus,
  onResetPassword,
  onDelete,
  onSendNotification,
}: UsersTableProps) => {
  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return (f + l).toUpperCase() || "?";
  };

  const getRoleBadge = (role: "student" | "recruiter") => {
    switch (role) {
      case "student":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Étudiant
          </Badge>
        );
      case "recruiter":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            Recruteur
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: "active" | "suspended") => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Actif
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            Suspendu
          </Badge>
        );
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun utilisateur trouvé
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(ref) => {
                  if (ref) {
                    (ref as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={onSelectAll}
                aria-label="Sélectionner tout"
              />
            </TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                  aria-label={`Sélectionner ${user.firstName} ${user.lastName}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "Sans nom"}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(user.createdAt), "d MMM yyyy", { locale: fr })}
              </TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                <UserActionsDropdown
                  user={user}
                  onViewProfile={onViewProfile}
                  onToggleStatus={onToggleStatus}
                  onResetPassword={onResetPassword}
                  onDelete={onDelete}
                  onSendNotification={onSendNotification}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
