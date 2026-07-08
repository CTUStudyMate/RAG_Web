"use client"
import { useActiveChat } from "@/hooks/use-active-chat";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ChatHeader } from "../component-items/chat-header";
import { Messages } from "./messages";
import MessageInput from "../component-items/message-input";

export function ChatShell() {
    const {
        chatId,
        chatData,
        mutate,
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
                    "flex min-w-0 flex-col bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] w-full h-screen"
                )}
            >
                <ChatHeader
                    chatId={chatId}
                />

                <div className="relative flex min-h-0 flex-1 flex-col bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {
                            chatData &&
                            <Messages
                                chatId={`${chatId}`}
                                messages={chatData}
                                setMessages={mutate}
                                status={chatData.length > 0 ? "has-send" : "not-sending"}
                                isLoading
                            />
                        }
                    </div>

                    <div className="
                        mx-auto flex w-full max-w-4xl 
                        gap-2 px-2 pb-3 md:px-4 md:pb-4
                        bg-background
                    ">
                        <MessageInput sendMessage={sendMessage}/>
                    </div>

                </div>
            </div>
        </>
    )
}