const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

import { httpPost } from "@/lib/utils";
import { ChatMessage } from "@/types/chat-related";

export async function sendUserMessage(message: ChatMessage) {
    const res = await httpPost<ChatMessage, ChatMessage>(
        `/api/chats/${message.chatId}/messages`,
        message
    )
    return res
}   