import { UseChatHelpers } from "@/lib/chat_helpers";
import { cn } from "@/lib/utils";
import { ChatMessage, RagSegment } from "@/types/chat-related";
import { ChatbotError } from "@/types/error";
import { Image } from "lucide-react";

function processCitationMark(message: ChatMessage): Record<string, number> {
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

function renderCitationBadge(
    docId: string,
    mark: number,
    type: "text" | "image"
) {
    if (type === "text") {
        return (
            <span className="ml-1 inline-flex items-center justify-center rounded-sm bg-gray-200 px-1.5 text-[10px] font-medium">
                {mark}
            </span>
        );
    }

    if (type === "image") {
        return (
            <span className="inline-flex items-center justify-center w-4 h-4 align-middle leading-none shrink-0 ml-1">
                <Image className="w-full h-full object-contain block" />
            </span>
        );
    }

    return null;
}

function renderSegment(
    segment: RagSegment,
    citationMap: Record<string, number>
) {

    const textCitations = Object.entries(
        segment.processedCiteObj?.texts ?? {}
    ).map(([docId]) => {
        const mark = citationMap[docId];
        if (!mark) return null;

        return (
            <span key={docId}>
                {renderCitationBadge(docId, mark, "text")}
            </span>
        );
    });

    const imageCitations = Object.entries(
        segment.processedCiteObj?.images ?? {}
    ).map(([docId]) => {
        const mark = citationMap[docId];
        if (!mark) return null;

        return (
            <span key={docId}>
                {renderCitationBadge(docId, mark, "image")}
            </span>
        );
    });

    const text = segment.segment;
    var segmentEl

    switch (segment.role) {
        case "paragraph":
            segmentEl = <p className="mb-3 leading-[1.7]">{text}{textCitations}{imageCitations}</p>;
            break;

        case "sentence":
            segmentEl = <span className="leading-[1.7]">{text}{textCitations}{imageCitations}</span>;
            break;

        case "bullet":
            segmentEl = <li className="ml-5 list-disc leading-[1.6] gap-1">{text}{textCitations}{imageCitations}</li>;
            break;

        case "bullet_intro":
            segmentEl = <div className="font-medium items-center">{text}{textCitations}{imageCitations}</div>;
            break;

        default:
            segmentEl = <p className="items-center">{text}{textCitations}{imageCitations}</p>;
    }

    return (
        segmentEl
    );
}

function MessageContent({ message }: { message: ChatMessage }) {
    if (!message.messageSegments) {
        return (
            <div className="bg-blue-500">
                {message.content}
            </div>
        );
    }

    const citations = processCitationMark(message);

    return (
        <div className="text-[13px] leading-[1.65]">
            {message.messageSegments.map((segment, index) => (
                <div key={index}>
                    {renderSegment(segment, citations)}
                </div>
            ))}
        </div>
    );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
    return (
        <MessageContent message={message}></MessageContent>
    )
}

function UserMessage({ message }: { message: ChatMessage }) {
    return (
        <h2 className="text-foreground h-10">
            {message.content ?? "empty"}
        </h2>
    );
}

export function Message({ message, isLoading, requiresScrollPadding, setMessages }:
    {
        message: ChatMessage,
        isLoading: boolean,
        requiresScrollPadding: boolean;
        setMessages: UseChatHelpers["setMessages"]
    }
) {
    console.log("senderType:", message.senderType);
    if (message.senderType == "assistant")
        return <AssistantMessage message={message} ></AssistantMessage>
    else if (message.senderType == "user")
        return <UserMessage message={message}></UserMessage>
    else {
        console.log("Invalid message:")
        console.log(message)
        return null
    }
}