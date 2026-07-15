"use client"
import { useActiveChat } from "@/hooks/use-active-chat";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
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
                                status={isSending==true? "is-sending" : "not-sending" }
                                isLoading={isLoading}
                            />
                        }
                        {
                            !chatData && 
                            <div className="flex h-full w-full items-center justify-center px-4">
                                <div className="flex max-w-md flex-col items-center text-center">
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-main-navy/8 text-main-navy ring-1 ring-main-navy/10">
                                        <GraduationCap className="size-6" />
                                    </div>
                                    <h1 className="text-2xl font-semibold text-main-navy">
                                        Hello, what would you like to study?
                                    </h1>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                        Ask a question, explore your course materials, or start with a topic you want to understand better.
                                    </p>
                                </div>
                            </div>
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
