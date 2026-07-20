const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

import { fetcher, httpPost, messagesFetcher } from "@/lib/utils";
import { ChatMessage, SendUserMessageRequest } from "@/types/chat-related";
import { mapChatMessage } from "@/utils/chat_mappers";

export async function sendUserMessage(message: SendUserMessageRequest) {
    const request: SendUserMessageRequest = {
        messageId: message.messageId,
        content: message.content,
        senderType: message.senderType,
        createdAt: message.createdAt,
        chatId: message.chatId,
    };

    const res = await httpPost<ChatMessage, SendUserMessageRequest>(
        `/api/chats/${message.chatId}/messages`,
        request
    )
    const data = mapChatMessage(res)
    return data
}
