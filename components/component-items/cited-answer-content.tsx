import { CitationBadge } from "./citation";
import type { ProcessedCiteObj, RagSegment } from "@/types/chat-related";

export type CitedAnswerSegment = {
    role?: string;
    type?: string;
    segment?: string;
    processedCiteObj?: ProcessedCiteObj;
    processed_cite_obj?: ProcessedCiteObj;
};

function getProcessedCiteObj(segment: CitedAnswerSegment) {
    return segment.processedCiteObj ?? segment.processed_cite_obj;
}

function buildCitationMap(segments: CitedAnswerSegment[]) {
    const citationMap = new Map<string, number>();
    let nextMark = 1;

    for (const segment of segments) {
        const processedCiteObj = getProcessedCiteObj(segment);
        if (!processedCiteObj) continue;

        for (const docId of Object.keys(processedCiteObj.texts ?? {})) {
            if (!citationMap.has(docId)) {
                citationMap.set(docId, nextMark++);
            }
        }

        for (const docId of Object.keys(processedCiteObj.images ?? {})) {
            if (!citationMap.has(docId)) {
                citationMap.set(docId, nextMark++);
            }
        }
    }

    return citationMap;
}

function toRagSegment(segment: CitedAnswerSegment): RagSegment {
    return {
        role: segment.role ?? "paragraph",
        type: segment.type ?? "cited",
        segment: segment.segment ?? "",
        processedCiteObj: getProcessedCiteObj(segment),
    };
}

function CitationBadges({
    segment,
    citationMap,
}: {
    segment: CitedAnswerSegment;
    citationMap: Map<string, number>;
}) {
    const processedCiteObj = getProcessedCiteObj(segment);
    if (!processedCiteObj) return null;

    const ragSegment = toRagSegment(segment);

    return (
        <>
            {Object.keys(processedCiteObj.texts ?? {}).map((docId) => {
                const mark = citationMap.get(docId);
                if (!mark) return null;

                return <CitationBadge key={`text-${docId}`} mark={mark} type="text" docId={docId} segment={ragSegment} />;
            })}
            {Object.keys(processedCiteObj.images ?? {}).map((docId) => {
                const mark = citationMap.get(docId);
                if (!mark) return null;

                return <CitationBadge key={`image-${docId}`} mark={mark} type="image" docId={docId} segment={ragSegment} />;
            })}
        </>
    );
}

export function CitedAnswerContent({ segments }: { segments: CitedAnswerSegment[] }) {
    const citationMap = buildCitationMap(segments);

    return (
        <div className="leading-[1.7]">
            {segments.map((segment, index) => {
                const content = (
                    <>
                        {segment.segment}
                        <CitationBadges segment={segment} citationMap={citationMap} />
                    </>
                );

                switch (segment.role) {
                    case "sentence":
                        return <span key={index}>{content}</span>;
                    case "bullet":
                        return <li key={index} className="ml-5 list-disc">{content}</li>;
                    case "bullet_intro":
                        return <div key={index}>{content}</div>;
                    default:
                        return <p key={index} className="mb-3">{content}</p>;
                }
            })}
        </div>
    );
}
