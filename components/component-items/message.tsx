import { UseChatHelpers } from "@/lib/chat_helpers";
import { ChatMessage, RagSegment } from "@/types/chat-related";
import { CitationBadge } from "./citation";
import { processCitationMark } from "@/lib/message_helpers";

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
                <CitationBadge mark={mark} type="text"></CitationBadge>
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
                <CitationBadge mark={mark} type="image"></CitationBadge>
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
            segmentEl = <div className="items-center">{text}{textCitations}{imageCitations}</div>;
            break;

        default:
            segmentEl = <p className="items-center">{text}{textCitations}{imageCitations}</p>;
    }

    return (
        segmentEl
    );
}

function MessageContent({ message }: { message: ChatMessage }) {
    console.log("Render assistant message.")
    console.log(message.messageSegments)
    if (!message.messageSegments) {
        console.log("message has no message segment")
        console.log(message.content)
        return (
            <div className="bg-blue-500">
                {message.content}
            </div>
        );
    }

    const citations = processCitationMark(message);
    console.log("message id:", message.messageId);
    console.log("citation map:", citations);

    return (
        <div className="leading-[1.65]">
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
        <div className="flex justify-end w-full">
            <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-user-bubble text-gray-900 bg-neutral-100">
                {message.content ?? "empty"}
            </div>
        </div>
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