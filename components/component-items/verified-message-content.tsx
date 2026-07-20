import { CitationBadge } from "@/components/component-items/citation";
import type { CitationRegistry, VerifiedCitation } from "@/lib/verified-answer";
import type { RagSegment } from "@/types/chat-related";

type VerifiedMessageContentProps = {
    editedAnswer: string;
    citations: CitationRegistry;
};

const CITATION_TOKEN_PATTERN = /\[#(citation\d+)\]/g;

function buildCitationSegment(citation: VerifiedCitation): RagSegment {
    return {
        role: "sentence",
        type: "cited",
        segment: "",
        processedCiteObj: {
            texts: citation.type === "text"
                ? { [citation.docId]: citation.evidences }
                : {},
            images: citation.type === "image"
                ? { [citation.docId]: [citation.imageId] }
                : {},
        },
    };
}

function renderLine(line: string, citations: CitationRegistry) {
    const content: React.ReactNode[] = [];
    let cursor = 0;

    for (const match of line.matchAll(CITATION_TOKEN_PATTERN)) {
        const [token, refId] = match;
        const citation = citations[refId];
        const tokenIndex = match.index ?? cursor;

        if (tokenIndex > cursor) {
            content.push(line.slice(cursor, tokenIndex));
        }

        if (citation) {
            content.push(
                <CitationBadge
                    key={`${refId}-${tokenIndex}`}
                    mark={citation.markNumber}
                    type={citation.type}
                    docId={citation.docId}
                    segment={buildCitationSegment(citation)}
                />
            );
        } else {
            content.push(token);
        }

        cursor = tokenIndex + token.length;
    }

    if (cursor < line.length) {
        content.push(line.slice(cursor));
    }

    return content;
}

export function VerifiedMessageContent({
    editedAnswer,
    citations,
}: VerifiedMessageContentProps) {
    const lines = editedAnswer.split("\n");

    return (
        <div className="whitespace-pre-wrap leading-7">
            {lines.map((line, index) => (
                <span key={index}>
                    {renderLine(line, citations)}
                    {index < lines.length - 1 && "\n"}
                </span>
            ))}
        </div>
    );
}
