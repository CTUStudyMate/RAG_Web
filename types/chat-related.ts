import type { VerifiedAnswer } from "@/lib/verified-answer";

export type VerifiedCitationDto =
    | {
        mark_number: number;
        type: "text";
        doc_id: string;
        evidences: string[];
    }
    | {
        mark_number: number;
        type: "image";
        doc_id: string;
        image_id: string;
    };

export interface VerifiedAnswerDto {
    edited_answer: string;
    citations: Record<string, VerifiedCitationDto>;
    citation_map: Record<string, number>;
}

export interface ChatMessage {
    messageId: string;
    content: string;
    messageSegments?: RagSegment[] | null;
    isVerify: boolean;
    createdAt: string;
    senderType: "user" | "assistant";
    chatId: string;
    verifiedAnswer?: VerifiedAnswer | null;
}

export interface SendUserMessageRequest {
    messageId: string;
    content: string;
    senderType: "user" | "assistant";
    createdAt: string;
    chatId: string;
}

export type Chat = {
    chatId: string;
    chatTitle: string;
    createdAt: string;
    lastMessageAt: string;
};

export interface RagCitation {
    type: string;
    content?: string;
    imgId?: string;
    processedTexts?: string[][];
    processedInfo?: string[][];
}

export interface ProcessedCiteObj {
    texts: Record<string, string[]>;
    images: Record<string, string[]>;
}

export interface RagSegment {
    role: string;
    type: string;
    segment: string;
    citations?: RagCitation[];
    processedCiteObj?: ProcessedCiteObj;
    raw?: unknown;
}


// export interface ChatMessage {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   createdAt: Date;
//   parts?: RagSegment[];
// }
