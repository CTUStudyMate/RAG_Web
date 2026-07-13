"use client";

import { ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./sidebar";
import { LoaderIcon } from "../bot-icons/icons";
import { toast } from "../ui/toast";
import { CookieUser, UIUser } from "@/types/user-related";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function emailToHue(email: string): number {
    let hash = 0;
    for (const char of email) {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}

export function SidebarUserNav({ user }: { user: UIUser }) {
    const { data, error, isLoading } = useSWR<CookieUser>(
        "/api/auth/me",
        fetcher
    );
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                toast({ type: "error", description: "Logout failed!" });
                return;
            }

            await mutate(() => true, undefined, { revalidate: false });

            toast({ type: "success", description: "Logged out successfully!" });
            router.push("/login");
            router.refresh();
        } catch {
            toast({ type: "error", description: "Network error!" });
        }
    };
    const { setTheme, resolvedTheme } = useTheme();


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {isLoading == true ? (
                            <SidebarMenuButton className="h-10 justify-between rounded-lg bg-transparent text-sidebar-foreground/50 transition-colors duration-150 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <div className="flex flex-row items-center gap-2">
                                    <div className="size-6 animate-pulse rounded-full bg-sidebar-foreground/10" />
                                    <span className="animate-pulse rounded-md bg-sidebar-foreground/10 text-transparent text-[13px]">
                                        Loading...
                                    </span>
                                </div>
                                <div className="animate-spin text-sidebar-foreground/50">
                                    <LoaderIcon />
                                </div>
                            </SidebarMenuButton>
                        ) : (
                            <SidebarMenuButton
                                className="h-8 px-2 rounded-lg bg-transparent text-sidebar-foreground/70 transition-colors duration-150 hover:text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                data-testid="user-nav-button"
                            >
                                <div
                                    className="size-5 shrink-0 rounded-full ring-1 ring-sidebar-border/50"
                                    style={{
                                        background: `linear-gradient(135deg, oklch(0.35 0.08 ${emailToHue(user.email ?? "")}), oklch(0.25 0.05 ${emailToHue(user.email ?? "") + 40}))`,
                                    }}
                                />
                                <span className="truncate text-[13px]" data-testid="user-email">
                                    {user?.email}
                                </span>
                                <ChevronUp className="ml-auto size-3.5 text-sidebar-foreground/50" />
                            </SidebarMenuButton>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-popper-anchor-width) rounded-lg border border-border/60 bg-card/95 backdrop-blur-xl shadow-[var(--shadow-float)]"
                        data-testid="user-nav-menu"
                        side="top"
                    >
                        <DropdownMenuItem
                            className="cursor-pointer text-[13px]"
                            data-testid="user-nav-item-theme"
                            onSelect={() =>
                                setTheme(resolvedTheme === "dark" ? "light" : "dark")
                            }
                        >
                            {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
                        </DropdownMenuItem>

                        {/* <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                            <button
                                className="w-full cursor-pointer text-[13px]"
                                onClick={() => {
                                    if (status === "loading") {
                                        toast({
                                            type: "error",
                                            description:
                                                "Checking authentication status, please try again!",
                                        });

                                        return;
                                    }

                                }}
                                type="button"
                            >
                            </button>
                        </DropdownMenuItem> */}

                        <DropdownMenuItem onClick={handleLogout}
                            className="cursor-pointer text-[13px]"
                        >Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
