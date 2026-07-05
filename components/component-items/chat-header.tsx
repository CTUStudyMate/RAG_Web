"use client"

import { PanelLeftIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../layout-main/sidebar";
import { VercelIcon } from "../bot-icons/icons";

function PureChatHeader({ chatId }: { chatId: string }) {
    const { state, toggleSidebar } = useSidebar();

    // if (state === "collapsed") {
    //     return null;
    // }
    return (
        <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
            <Button
                className="md:hidden"
                onClick={toggleSidebar}
                size="icon-sm"
                variant="ghost"
            >
                <PanelLeftIcon className="size-4" />
            </Button>

            <Link
                className="flex size-8 items-center justify-center rounded-lg md:hidden"
                href="https://vercel.com/templates/next.js/chatbot"
                rel="noopener noreferrer"
                target="_blank"
            >
                <VercelIcon size={14} />
            </Link>
        </header>
    );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
    return (
        prevProps.chatId === nextProps.chatId
    );
});