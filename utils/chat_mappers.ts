import { ChatMessage, ProcessedCiteObj, RagCitation, RagSegment } from "@/types/chat-related";

function mapRagCitation(c: any): RagCitation {
    return {
        type: c.type,
        content: c.content ?? undefined,
        imgId: c.img_id ?? undefined,
        processedTexts: c.processed_texts ?? undefined,
        processedInfo: c.processed_info ?? undefined,
    };
}

function mapProcessedCiteObj(obj: any): ProcessedCiteObj {
    return {
        texts: obj?.texts ?? {},
        images: obj?.images ?? {},
    };
}

function mapRagSegment(s: any): RagSegment {
    return {
        role: s.role,
        type: s.type,
        segment: s.segment,
        citations: s.citations?.map(mapRagCitation),
        processedCiteObj: s.processed_cite_obj
            ? mapProcessedCiteObj(s.processed_cite_obj)
            : undefined,
        raw: s.raw ?? undefined,
    };
}

export function mapChatMessage(dto: any): ChatMessage {
    return {
        messageId: dto.messageId,
        content: dto.content,
        createdAt: dto.createdAt,
        senderType: dto.senderType,
        chatId: dto.chatId,
        messageSegments: dto.messageSegments?.map(mapRagSegment),
        isVerify: Boolean(dto.isVerify),
    };
}
