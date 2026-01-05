import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  User,
  Ban,
  CheckCircle,
  KeyRound,
  Trash2,
  Bell,
} from "lucide-react";

export interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: "student" | "recruiter";
  status: "active" | "suspended";
  createdAt: string;
  lastLoginAt?: string;
  jobsPosted?: number;
  applicationsSent?: number;
}

interface UserActionsDropdownProps {
  user: UserData;
  onViewProfile: (user: UserData) => void;
  onToggleStatus: (user: UserData) => void;
  onResetPassword: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  onSendNotification: (user: UserData) => void;
}

export const UserActionsDropdown = ({
  user,
  onViewProfile,
  onToggleStatus,
  onResetPassword,
  onDelete,
  onSendNotification,
}: UserActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewProfile(user)}>
          <User className="h-4 w-4 mr-2" />
          Voir le profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSendNotification(user)}>
          <Bell className="h-4 w-4 mr-2" />
          Envoyer une notification
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
          {user.status === "active" ? (
            <>
              <Ban className="h-4 w-4 mr-2" />
              Suspendre le compte
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Activer le compte
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <KeyRound className="h-4 w-4 mr-2" />
          Réinitialiser le mot de passe
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer le compte
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
