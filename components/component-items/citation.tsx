import { ChatMessage } from "@/types/chat-related";
import { Image } from "lucide-react";
import { RagSegment } from "@/types/chat-related";

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