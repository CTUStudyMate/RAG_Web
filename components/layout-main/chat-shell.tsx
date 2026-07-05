"use client"
import { useActiveChat } from "@/hooks/use-active-chat";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ChatHeader } from "../component-items/chat-header";
import { Messages } from "./messages";

export function ChatShell() {
    const {
        chatId,
        messages,
        setMessages,
        sendMessage,
        input,
        setInput,
        isLoading,
        isSending
    } = useActiveChat();

    const prevChatIdRef = useRef(chatId);
    useEffect(() => {
        if (prevChatIdRef.current !== chatId) {
            prevChatIdRef.current = chatId;
        }
    }, [chatId]);
    return (
        <>
            <div
                className={cn(
                    "flex min-w-0 flex-col bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] w-full"
                )}
            >
                <ChatHeader
                    chatId={chatId}
                />

                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
                    <Messages chatId={`${chatId}`}
                        messages={messages}
                        setMessages={setMessages}
                        status={messages.length > 0 ? "has-send": "not-sending"}
                        isLoading>

                    </Messages>
                </div>
            </div>
        </>
    )
}