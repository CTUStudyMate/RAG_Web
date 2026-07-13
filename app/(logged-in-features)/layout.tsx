// import { AppSidebar } from "@/components/chat/app-sidebar";
// import { getMe } from "@/lib/services/auth/me";
// import { ChatShell } from "@/components/chat/shell";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/layout-main/sidebar";
import { AppSidebar } from "@/components/layout-main/app-sidebar";
import { cookies } from "next/headers";
import { ActiveChatProvider } from "@/hooks/use-active-chat";
import { ChatShell } from "@/components/layout-main/chat-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <Suspense fallback={<div className="flex h-dvh bg-sidebar" />}>
          <SidebarShell>{children}</SidebarShell>
        </Suspense>
      </div>
    </>
  );
}

async function SidebarShell({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <SidebarProvider defaultOpen={!isCollapsed} className="bg-main-text">
      <AppSidebar />

      <SidebarInset>
        <Toaster
          position="top-center"
          theme="system"
          toastOptions={{
            className:
              "!bg-card !text-foreground !border-border/50 !shadow-[var(--shadow-float)]",
          }}
        />
        <Suspense fallback={<div className="flex h-dvh" />}>
          
          {/* <ActiveChatProvider>
            <ChatShell />
          </ActiveChatProvider> */}
          <div></div>
          {children}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
