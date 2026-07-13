"use client"

import { UIUser, UserRole } from "@/types/user-related";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "./sidebar";
// import { useSWRConfig } from "swr";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ClipboardCheckIcon, FolderIcon, LogInIcon, MessageSquareIcon, PanelLeftIcon, PenSquareIcon } from "lucide-react";
import { SidebarHistory } from "./sidebar-history";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { SidebarUserNav } from "./sidebar-user-nav";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
    const { data: user, isLoading, error } = useCurrentUser();
    const router = useRouter();
    const { toggleSidebar } = useSidebar();
    const [chatOpen, setChatOpen] = useState(true);

    const isLecturer = user?.role === UserRole.Lecturer

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader className="pb-0 pt-3">
                    <SidebarMenu>
                        {isLecturer && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/pending-approval")}
                                >
                                    <ClipboardCheckIcon className="size-4" />
                                    <span>Pending Approval</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        <SidebarMenuItem className="flex flex-row items-center justify-between mb-3">
                            <div className="group/logo relative flex items-center justify-center">
                                <SidebarMenuButton
                                    asChild
                                    className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:hidden"
                                    tooltip="Chatbot"
                                >
                                    <Link href="/home" className="ml-1">
                                        <Image
                                            src="/images/CTU_logo.png"
                                            alt="Logo"
                                            width={25}
                                            height={25}
                                            unoptimized
                                        />
                                    </Link>
                                </SidebarMenuButton>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SidebarMenuButton
                                            className="hidden size-8 items-center justify-center group-data-[collapsible=icon]:flex"
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
                            {/* <SidebarMenu>
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
                            </SidebarMenu> */}


                            <SidebarMenu>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/documents")}
                                    >
                                        <FolderIcon className="size-4" />
                                        <span>My Documents</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/review")}
                                    >
                                        <ClipboardCheckIcon className="size-4" />
                                        <span>Review</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => setChatOpen(!chatOpen)}
                                    >
                                        <MessageSquareIcon className="size-4" />

                                        <span>Chat</span>

                                        {chatOpen ? (
                                            <ChevronDown className="ml-auto size-4" />
                                        ) : (
                                            <ChevronRight className="ml-auto size-4" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {/* <SidebarHistory user={user} /> */}
                    {chatOpen && (
                        <div className="pl-1">
                            <SidebarGroup className="pt-1">
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                className="h-8 rounded-lg border border-sidebar-border"
                                                onClick={() => router.push("/chat")}
                                            >
                                                <PenSquareIcon className="size-4" />
                                                <span>New Chat</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarHistory user={user} />
                        </div>
                    )}
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
        </>
    );
}
