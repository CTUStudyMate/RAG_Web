import { UseChatHelpers } from "@/lib/chat_helpers";
import { ChatMessage } from "@/types/chat-related";
import { useMessages } from "@/hooks/use-messages";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message, ThinkingMessage } from "../component-items/message";
import { ArrowDownIcon } from "lucide-react";

type MessagesProps = {
    chatId: string;
    status: UseChatHelpers["status"];
    messages: ChatMessage[];
    setMessages: UseChatHelpers["setMessages"];
    isLoading: boolean;
};

function PureMessages({ chatId, status, messages, setMessages, isLoading }: MessagesProps) {
    const {
        containerRef: messagesContainerRef,
        endRef: messagesEndRef,
        isAtBottom,
        scrollToBottom,
        hasSentMessage,
        reset,
    } = useMessages({
        status,
    });

    const prevChatIdRef = useRef(chatId);
    useEffect(() => {
        if (prevChatIdRef.current !== chatId) {
            prevChatIdRef.current = chatId;
            reset();
        }
    }, [chatId, reset]);

    return (
        // <div className="relative flex-1 bg-background bg-black h-[200px]">
        <div className="flex flex-col h-full overflow-hidden text-sm">
            {messages.length === 0 && !isLoading && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    {/* <Greeting /> */}
                    hihihi
                </div>
            )}
            <div
                className={cn(
                    // "absolute inset-0 touch-pan-y overflow-y-auto",
                    "flex-1 overflow-y-auto",
                    messages.length > 0 ? "bg-background" : "bg-transparent"
                )}
                ref={messagesContainerRef}
            >
                <div className="mx-auto flex min-h-full min-w-0 max-w-4xl flex-col gap-5 px-2 py-6 md:gap-7 md:px-4">
                    {messages.map((message, index) => (
                        <Message
                            isLoading={isLoading} key={`${message.messageId}`}
                            message={message}
                            requiresScrollPadding={
                                hasSentMessage && index === messages.length - 1
                            }
                            setMessages={setMessages}
                        >
                        </Message>
                    ))}

                    {status === "is-sending" && messages.at(-1)?.senderType !== "assistant" && (
                        <ThinkingMessage />
                        // <div>hahaha</div>
                    )}

                    <div
                        className="min-h-[24px] min-w-[24px] shrink-0"
                        ref={messagesEndRef}
                    />
                </div>
            </div>

            <button
                aria-label="Scroll to bottom"
                className={`absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-border/50 bg-card/90 px-3.5 shadow-[var(--shadow-float)] backdrop-blur-lg transition-all duration-200 h-7 text-[10px] ${isAtBottom
                    ? "pointer-events-none scale-90 opacity-0"
                    : "pointer-events-auto scale-100 opacity-100"
                    }`}
                onClick={() => scrollToBottom("smooth")}
                type="button"
            >
                <ArrowDownIcon className="size-3 text-muted-foreground" />
            </button>
        </div>
    );
}

export const Messages = PureMessages;