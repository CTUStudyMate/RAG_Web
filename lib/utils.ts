import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


import { ChatbotError, ErrorCode } from "@/types/error";
// import { ChatMessage, MessageDto, RagSegment } from "@/types/chat-related";
import { ChatMessage } from "@/types/chat-related";
import { mapChatMessage } from "@/utils/chat_mappers";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${backendUrl}${url}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const { code, cause } = await res.json();
    throw new ChatbotError(code as ErrorCode, cause);
  }

  return res.json();
}

export async function messagesFetcher(url: string): Promise<ChatMessage[]> {
  console.log("call fetcher")
  const data = await fetcher<any>(url);
  return data.map(mapChatMessage);
}

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatbotError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatbotError('offline:chat');
    }

    throw error;
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

// export function convertToChatMessages(
//   messages: MessageDto[]
// ): ChatMessage[] {
//   return messages.map((message) => ({
//     id: message.messageId,
//     role: message.senderType,
//     content: message.content,
//     createdAt: new Date(message.createdAt),
//     parts: message.messageSegments,
//   }));
// }



export function getTextFromMessage(message: ChatMessage): string {
  return message.content;
}

export async function httpPost<TResponse, TRequest>(
  url: string,
  body: TRequest
): Promise<TResponse> {
  const res = await fetch(`${backendUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<TResponse>;
}
