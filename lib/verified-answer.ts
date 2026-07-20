export type ProcessedCitationObject = {
    texts?: Record<string, string[]>;
    images?: Record<string, string[]>;
};

export type GeneratedAnswerSegment = {
    role?: string;
    type?: string;
    segment?: string;
    processedCiteObj?: ProcessedCitationObject;
    processed_cite_obj?: ProcessedCitationObject;
};

export type VerifiedCitation =
    | {
        markNumber: number;
        type: "text";
        docId: string;
        evidences: string[];
    }
    | {
        markNumber: number;
        type: "image";
        docId: string;
        imageId: string;
    };

export type CitationRegistry = Record<string, VerifiedCitation>;

export type VerifiedAnswer = {
    editedAnswer: string;
    citations: CitationRegistry;
    citationMap: Record<string, number>;
};

export type CollectedCitations = {
    citations: CitationRegistry;
    citationMap: Record<string, number>;
    citationRefsBySegment: string[][];
};

const CITATION_TOKEN_PATTERN = /\[#(citation\d+)\]/g;

export function parseGeneratedAnswer(answer: string): GeneratedAnswerSegment[] {
    try {
        const parsedAnswer: unknown = JSON.parse(answer);
        return Array.isArray(parsedAnswer)
            ? parsedAnswer as GeneratedAnswerSegment[]
            : [];
    } catch {
        return [];
    }
}

function getProcessedCiteObj(segment: GeneratedAnswerSegment) {
    return segment.processedCiteObj ?? segment.processed_cite_obj;
}

export function collectCitationOccurrences(
    segments: GeneratedAnswerSegment[]
): CollectedCitations {
    const citations: CitationRegistry = {};
    const sourceMarks = new Map<string, number>();
    const citationRefsBySegment: string[][] = [];
    let nextCitationNumber = 1;
    let nextSourceMark = 1;

    for (const segment of segments) {
        const segmentRefs: string[] = [];
        const processedCiteObj = getProcessedCiteObj(segment);
        citationRefsBySegment.push(segmentRefs);
        if (!processedCiteObj) continue;

        for (const [docId, evidences] of Object.entries(processedCiteObj.texts ?? {})) {
            let markNumber = sourceMarks.get(docId);
            if (!markNumber) {
                markNumber = nextSourceMark++;
                sourceMarks.set(docId, markNumber);
            }

            const refId = `citation${nextCitationNumber++}`;
            segmentRefs.push(refId);
            citations[refId] = {
                markNumber,
                type: "text",
                docId,
                evidences,
            };
        }

        for (const [docId, imageIds] of Object.entries(processedCiteObj.images ?? {})) {
            const imageId = imageIds[0];
            if (!imageId) continue;

            let markNumber = sourceMarks.get(docId);
            if (!markNumber) {
                markNumber = nextSourceMark++;
                sourceMarks.set(docId, markNumber);
            }

            const refId = `citation${nextCitationNumber++}`;
            segmentRefs.push(refId);
            citations[refId] = {
                markNumber,
                type: "image",
                docId,
                imageId,
            };
        }
    }

    return {
        citations,
        citationMap: Object.fromEntries(sourceMarks),
        citationRefsBySegment,
    };
}

export function buildCitationRegistry(segments: GeneratedAnswerSegment[]): CitationRegistry {
    return collectCitationOccurrences(segments).citations;
}

export function getSegmentCitationMarks(
    segmentIndex: number,
    citationRefsBySegment: string[][]
): number[] {
    return (citationRefsBySegment[segmentIndex] ?? []).map((refId) =>
        Number(refId.replace("citation", ""))
    );
}

export function convertSegmentsToEditableText(segments: GeneratedAnswerSegment[]): string {
    const { citationRefsBySegment } = collectCitationOccurrences(segments);
    const lines: string[] = [];

    for (const [segmentIndex, segment] of segments.entries()) {
        const text = segment.segment?.trim();
        if (!text) continue;

        const citationMarks = getSegmentCitationMarks(
            segmentIndex,
            citationRefsBySegment
        );
        const citationTokens = citationMarks
            .map((mark) => `[#citation${mark}]`)
            .join(" ");
        const textWithCitations = citationTokens
            ? `${text} ${citationTokens}`
            : text;

        if (segment.role === "bullet") {
            lines.push(`- ${textWithCitations}`);
            continue;
        }

        if (segment.role === "sentence") {
            const lastIndex = lines.length - 1;

            if (lastIndex >= 0 && lines[lastIndex] && !lines[lastIndex].startsWith("- ")) {
                lines[lastIndex] = `${lines[lastIndex]} ${textWithCitations}`;
            } else {
                lines.push(textWithCitations);
            }
            continue;
        }

        if (segment.role === "bullet_intro") {
            lines.push(textWithCitations);
            continue;
        }

        if (lines.length > 0) {
            lines.push("");
        }

        lines.push(textWithCitations);
    }

    return lines.join("\n");
}

export function extractCitationRefs(editedAnswer: string): string[] {
    const refIds = new Set<string>();

    for (const match of editedAnswer.matchAll(CITATION_TOKEN_PATTERN)) {
        refIds.add(match[1]);
    }

    return Array.from(refIds);
}

export function prepareEditableAnswer(generatedAnswer: string): VerifiedAnswer {
    const segments = parseGeneratedAnswer(generatedAnswer);
    const { citations, citationMap } = collectCitationOccurrences(segments);

    return {
        editedAnswer: convertSegmentsToEditableText(segments) || generatedAnswer,
        citations,
        citationMap,
    };
}
