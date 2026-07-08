import { ChatMessage } from "@/types/chat-related";
import { Image } from "lucide-react";
import { RagSegment } from "@/types/chat-related";

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


export function CitationBadge({ mark, type }: { mark: number, type: "text" | "image" }) {
    if (type === "text") {
        return (
            <span className="ml-1 inline-flex w-4 h-4 items-center justify-center align-middle rounded-sm bg-gray-400 text-[10px] leading-none text-white font-mono cursor-pointer">
                {mark}
            </span>
        );
    }

    if (type === "image") {
        return (
            <span className="ml-1 inline-flex w-4 h-4 items-center justify-center align-middle leading-none rounded-sm cursor-pointer">
                <Image className="w-4 h-4 stroke-gray-500" />
            </span>
        );
    }
    return null;
}