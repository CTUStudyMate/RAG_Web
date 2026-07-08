import { ChatMessage } from "@/types/chat-related";

export function getTextChunksAndImgsIDs(message: ChatMessage) {
    if (!message.messageSegments) return
    const textChunkIds = new Set<string>()
    const imgIds = new Set<string>()

    for (var segment of message.messageSegments) {
        if (segment.citations) {
            for (var citation of segment.citations) {
                if (citation.processedTexts) {
                    for (const [docId, _] of citation.processedTexts) {
                        textChunkIds.add(docId)
                    }
                }
                else if (citation.processedInfo) {
                    for (const [_, imgId] of citation.processedInfo) {
                        imgIds.add(imgId)
                    }
                }
            }

        }
    }
    return {
        textChunkIds: Array.from(textChunkIds),
        imgIds: Array.from(imgIds)
    }
}


export function processCitationMark(message: ChatMessage): Record<string, number> {
    const result = new Map<string, number>();
    let currentMark = 1;

    if (!message.messageSegments) {
        console.log(`Citation process failed: Message ${message.messageId} does not have segment form.`)
        return {}
    }

    for (const segment of message.messageSegments) {
        const processed = segment.processedCiteObj;
        if (!processed) continue;

        // Text citations
        for (const docId of Object.keys(processed.texts ?? {})) {
            if (!result.has(docId)) {
                result.set(docId, currentMark++);
            }
        }

        // Image citations
        for (const docId of Object.keys(processed.images ?? {})) {
            if (!result.has(docId)) {
                result.set(docId, currentMark++);
            }
        }
    }

    return Object.fromEntries(result);
}