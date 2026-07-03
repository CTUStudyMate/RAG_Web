"use client"

import { UseChatHelpers } from "@/lib/chat_helpers";
import { ChatMessage } from "@/types/chat-related";
import { type ReactNode } from "react"

type ActiveChatContextValue = {
    chatId: string;
    messages: ChatMessage[]
    setMessages: UseChatHelpers["setMessages"];
    sendMessage: UseChatHelpers["sendMessage"];
}



// type CreateUIMessage<UI_MESSAGE extends ChatMessage> = Omit<UI_MESSAGE, 'id' | 'role'> & {
//     id?: UI_MESSAGE['id'];
//     role?: UI_MESSAGE['role'];
// };


export function ActiveChatProvider({ children }: { children: ReactNode }) {

}