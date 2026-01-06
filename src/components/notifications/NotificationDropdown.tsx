import { useState, useEffect } from "react";
import { Bell, Briefcase, MessageSquare, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type NotificationType = "NEW_MATCH" | "APPLICATION_STATUS" | "NEW_MESSAGE";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

const notificationConfig: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  NEW_MATCH: { icon: Sparkles, color: "text-yellow-500" },
  APPLICATION_STATUS: { icon: Briefcase, color: "text-blue-500" },
  NEW_MESSAGE: { icon: MessageSquare, color: "text-green-500" },
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "NEW_MATCH",
    title: "Nouveau job qui te correspond !",
    message: "Développeur Full Stack chez TechCorp - 95% de compatibilité",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    link: "/jobs/1",
  },
  {
    id: "2",
    type: "APPLICATION_STATUS",
    title: "Statut de candidature mis à jour",
    message: "Votre candidature chez StartupXYZ est passée en entretien",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    link: "/applications",
  },
  {
    id: "3",
    type: "NEW_MESSAGE",
    title: "Nouveau message du recruteur",
    message: "Marie Dupont de TechCorp vous a envoyé un message",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    link: "/messages/1",
  },
  {
    id: "4",
    type: "NEW_MATCH",
    title: "Nouveau job qui te correspond !",
    message: "Stage Data Analyst chez DataFlow - 88% de compatibilité",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
    link: "/jobs/2",
  },
  {
    id: "5",
    type: "APPLICATION_STATUS",
    title: "Statut de candidature mis à jour",
    message: "Votre candidature chez InnovateLab a été consultée",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    link: "/applications",
  },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Simulate real-time notification
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.9;
      if (shouldAddNotification && !isOpen) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "NEW_MATCH",
          title: "Nouveau job qui te correspond !",
          message: "Une nouvelle opportunité vient d'être publiée",
          timestamp: new Date(),
          isRead: false,
          link: "/jobs",
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell
            className={cn(
              "h-5 w-5 transition-transform",
              isAnimating && "animate-wiggle"
            )}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 bg-popover border border-border shadow-lg"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notification List */}
        {notifications.length > 0 ? (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const config = notificationConfig[notification.type];
                const Icon = config.icon;

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-accent/50",
                      !notification.isRead && "bg-accent/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-muted",
                        config.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-sm truncate",
                            !notification.isRead
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/80"
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Aucune notification</p>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              className="w-full text-primary hover:text-primary/80 hover:bg-accent"
              onClick={() => (window.location.href = "/notifications")}
            >
              Voir tout
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
