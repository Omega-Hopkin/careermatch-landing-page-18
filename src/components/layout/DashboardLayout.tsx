import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, UserRole } from "./AppSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  title?: string;
  headerActions?: ReactNode;
}

export const DashboardLayout = ({
  children,
  role,
  user,
  title,
  headerActions,
}: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar role={role} user={user} />
        </div>

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            {/* Desktop sidebar trigger */}
            <SidebarTrigger className="hidden md:flex -ml-1" />
            
            {/* Mobile sidebar */}
            <MobileSidebar role={role} user={user} />
            
            {title && (
              <>
                <Separator orientation="vertical" className="h-4 hidden md:block" />
                <h1 className="font-semibold text-lg">{title}</h1>
              </>
            )}
            
            {headerActions && (
              <div className="ml-auto flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
