import {
    ChatMessage,
    ProcessedCiteObj,
    RagCitation,
    RagSegment,
    VerifiedAnswerDto,
} from "@/types/chat-related";
import type { CitationRegistry, VerifiedAnswer } from "@/lib/verified-answer";

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

function mapVerifiedAnswer(dto: VerifiedAnswerDto): VerifiedAnswer {
    const citations: CitationRegistry = {};

    for (const [refId, citation] of Object.entries(dto.citations ?? {})) {
        if (citation.type === "image") {
            citations[refId] = {
                markNumber: citation.mark_number,
                type: "image",
                docId: citation.doc_id,
                imageId: citation.image_id,
            };
            continue;
        }

        citations[refId] = {
            markNumber: citation.mark_number,
            type: "text",
            docId: citation.doc_id,
            evidences: citation.evidences,
        };
    }

    return {
        editedAnswer: dto.edited_answer,
        citations,
        citationMap: dto.citation_map ?? {},
    };
}

export function mapChatMessage(dto: any): ChatMessage {
    return {
        messageId: dto.messageId,
        content: dto.content ?? "",
        createdAt: dto.createdAt ?? "",
        senderType: dto.senderType,
        chatId: dto.chatId,
        messageSegments: dto.messageSegments?.map(mapRagSegment),
        isVerify: Boolean(dto.isVerify),
        verifiedAnswer: dto.verifiedAnswer
            ? mapVerifiedAnswer(dto.verifiedAnswer)
            : null,
    };
}
