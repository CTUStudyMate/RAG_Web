const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

import { fetcher, httpPost, messagesFetcher } from "@/lib/utils";
import { ChatMessage } from "@/types/chat-related";
import { mapChatMessage } from "@/utils/chat_mappers";

export async function sendUserMessage(message: ChatMessage) {
    const res = await httpPost<ChatMessage, ChatMessage>(
        `/api/chats/${message.chatId}/messages`,
        message
    )
    const data = mapChatMessage(res)
    return data
}