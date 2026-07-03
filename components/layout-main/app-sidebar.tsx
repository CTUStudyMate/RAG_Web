"use client"

import { UIUser } from "@/types/user-related";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "./sidebar";
// import { useSWRConfig } from "swr";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LogInIcon, MessageSquareIcon, PanelLeftIcon, PenSquareIcon } from "lucide-react";
import { SidebarHistory } from "./sidebar-history";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { SidebarUserNav } from "./sidebar-user-nav";
import { useCurrentUser } from "@/lib/hooks";

export function AppSidebar() {
    const { data: user, isLoading, error } = useCurrentUser();
    const router = useRouter();
    const { toggleSidebar } = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader className="pb-0 pt-3">
                    <SidebarMenu>
                        <SidebarMenuItem className="flex flex-row items-center justify-between">
                            <div className="group/logo relative flex items-center justify-center">
                                <SidebarMenuButton
                                    asChild
                                    className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:group-hover/logo:opacity-0"
                                    tooltip="Chatbot"
                                >
                                    <Link href="/">
                                        <MessageSquareIcon className="size-4 text-sidebar-foreground/50" />
                                    </Link>
                                </SidebarMenuButton>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SidebarMenuButton
                                            className="pointer-events-none absolute inset-0 size-8 opacity-0 group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:group-hover/logo:opacity-100"
                                            onClick={() => toggleSidebar()}
                                        >
                                            <PanelLeftIcon className="size-4" />
                                        </SidebarMenuButton>
                                    </TooltipTrigger>
                                    <TooltipContent className="hidden md:block" side="right">
                                        Open sidebar
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="group-data-[collapsible=icon]:hidden">
                                <SidebarTrigger className="text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-foreground" />
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="pt-1">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        className="h-8 rounded-lg border border-sidebar-border text-[13px] text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        onClick={() => {
                                            router.push("/");
                                        }}
                                        tooltip="New Chat"
                                    >
                                        <PenSquareIcon className="size-4" />
                                        <span className="font-medium">New chat</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {/* {user && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            className="rounded-lg text-sidebar-foreground/40 transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setShowDeleteAllDialog(true)}
                                            tooltip="Delete All Chats"
                                        >
                                            <TrashIcon className="size-4" />
                                            <span className="text-[13px]">Delete all</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )} */}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarHistory user={user} />
                </SidebarContent>
                <SidebarFooter className="border-t border-sidebar-border pt-2 pb-3">
                    {user ? (
                        <SidebarUserNav user={user} />
                    ) : (
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/login")}
                                >
                                    <LogInIcon className="size-4" />
                                    <span className="text-[13px]">Login</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )}
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            {/* <AlertDialog
                onOpenChange={setShowDeleteAllDialog}
                open={showDeleteAllDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all
                            your chats and remove them from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAll}>
                            Delete All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
        </>
    );
}