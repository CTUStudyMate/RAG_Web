"use client"

import { fetcher, generateUUID, messagesFetcher } from "@/lib/utils";
import { sendUserMessage } from "@/services/backendCalls/sendMessage";
import { ChatMessage } from "@/types/chat-related";
import { usePathname } from "next/navigation";
import { type ReactNode, type SetStateAction, type Dispatch, createContext, useRef, useState, useEffect, useMemo, useContext } from "react"
import useSWR from "swr";

type ActiveChatContextValue = {
    chatId: string;
    chatData: ChatMessage[] | undefined;
    mutate: ReturnType<typeof useSWR<ChatMessage[]>>["mutate"];
    sendMessage: (text: string) => Promise<void>;
    setInput: Dispatch<SetStateAction<string>>;
    input: string;
    isSending: boolean;
    isLoading: boolean;
};

const ActiveChatContext = createContext<ActiveChatContextValue | null>(null);

function extractChatId(pathname: string): string | null {
    const match = pathname.match(/\/chat\/([^/]+)/);
    return match ? match[1] : null;
}

export function ActiveChatProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const chatIdFromUrl = extractChatId(pathname);
    const isNewChat = !chatIdFromUrl;
    const prevPathnameRef = useRef(pathname);

    const newChatIdRef = useRef(generateUUID());

    if (isNewChat && prevPathnameRef.current !== pathname) {
        newChatIdRef.current = generateUUID();
    }
    prevPathnameRef.current = pathname;


    const chatId = chatIdFromUrl ?? newChatIdRef.current;
    const [input, setInput] = useState("");

    const { data: chatData, isLoading, mutate } = useSWR<ChatMessage[]>(
        isNewChat ? null : `/api/chats/${chatId}/messages`,
        messagesFetcher,
        { revalidateOnFocus: false }
    );

    const [isSending, setIsSending] = useState(false);

    // const [messages, setMessages] = useState<ChatMessage[]>([]);

    // const sendMessage = async (text: string) => {
    //     setIsSending(true);

    //     const userMessage: ChatMessage = {
    //         messageId: crypto.randomUUID(),
    //         content: text,
    //         senderType: "user",
    //         createdAt: new Date().toISOString(),
    //         chatId,
    //     };

    //     setMessages(prev => [...prev, userMessage]);

    //     var assistantMessage = await sendUserMessage(userMessage)

    //     setMessages(prev => [...prev, assistantMessage]);

    //     setIsSending(false);
    // };


    const sendMessage = async (text: string) => {
        setIsSending(true);

        const userMessage: ChatMessage = {
            messageId: crypto.randomUUID(),
            content: text,
            senderType: "user",
            createdAt: new Date().toISOString(),
            chatId,
        };

        mutate(
            (prev: ChatMessage[] = []) => [...prev, userMessage],
            false
        );

        const assistantMessage = await sendUserMessage(userMessage);

        mutate(
            (prev: ChatMessage[] = []) => [...prev, assistantMessage],
            false
        );

        setIsSending(false);
    };

    const loadedChatIds = useRef(new Set<string>());

    if (isNewChat && !loadedChatIds.current.has(newChatIdRef.current)) {
        loadedChatIds.current.add(newChatIdRef.current);
    }

    useEffect(() => {
        console.log("Chatid has changed.")

        if (loadedChatIds.current.has(chatId)) {
            return;
        }
        if (chatData) {
            console.log("has not loaded")
            console.log(chatData)
            loadedChatIds.current.add(chatId);
            mutate(chatData);
        }
    }, [chatId, chatData]);

    const prevChatIdRef = useRef(chatId);
    useEffect(() => {
        if (prevChatIdRef.current !== chatId) {
            prevChatIdRef.current = chatId;
            if (isNewChat) {
                mutate([], false);
            }
        }
    }, [chatId, isNewChat]);


    const hasAppendedQueryRef = useRef(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("query");
        if (query && !hasAppendedQueryRef.current) {
            hasAppendedQueryRef.current = true;
            window.history.replaceState(
                {},
                "",
                `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/chat/${chatId}`
            );
            sendMessage(query);
        }
    }, [sendMessage, chatId]);

    const value: ActiveChatContextValue = useMemo(() => ({
        chatId,
        chatData,
        mutate,
        sendMessage,
        input,
        setInput,
        isSending,
        isLoading,
    }), [
        chatId,
        chatData,
        sendMessage,
        input,
        setInput,
        isSending,
        isLoading,
    ]);
    return (
        <ActiveChatContext.Provider value={value}>
            {children}
        </ActiveChatContext.Provider>
    );
}

export function useActiveChat() {
    const context = useContext(ActiveChatContext);
    if (!context) {
        throw new Error("useActiveChat must be used within ActiveChatProvider");
    }
    return context;
}


