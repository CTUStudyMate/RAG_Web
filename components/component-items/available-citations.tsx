"use client";

import { Button } from "@/components/ui/button";
import { CitationBadge } from "@/components/component-items/citation";
import type { CitationRegistry, VerifiedCitation } from "@/lib/verified-answer";
import type { RagSegment } from "@/types/chat-related";
import { Plus } from "lucide-react";

type AvailableCitationsProps = {
    citations: CitationRegistry;
    onAddCitation: (refId: string) => void;
};

function getCitationIndex(refId: string) {
    return Number(refId.replace("citation", ""));
}

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

export function AvailableCitations({
    citations,
    onAddCitation,
}: AvailableCitationsProps) {
    const citationEntries = Object.entries(citations).sort(
        ([leftRefId], [rightRefId]) =>
            getCitationIndex(leftRefId) - getCitationIndex(rightRefId)
    );

    if (citationEntries.length === 0) {
        return null;
    }

    return (
        <section className="mt-4 rounded-lg border border-border bg-background p-3">
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-main-navy">
                    Available citations
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                    Click the citation badge to view full source details.
                </p>
            </div>

            <div className="space-y-2">
                {citationEntries.map(([refId, citation]) => (
                    <div
                        key={refId}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
                    >
                        <div className="flex min-w-0 items-center gap-2 text-sm">
                            <span className="shrink-0">
                                <CitationBadge
                                    mark={citation.markNumber}
                                    type={citation.type}
                                    docId={citation.docId}
                                    segment={buildCitationSegment(citation)}
                                />
                            </span>

                            <span className="font-mono text-xs text-slate-600">
                                [#{refId}]
                            </span>

                            <span className="truncate text-xs text-slate-500">
                                {citation.type === "text"
                                    ? citation.evidences[0] || citation.docId
                                    : "[Figure]"}
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddCitation(refId)}
                            className="h-6 shrink-0 gap-1 px-1.5 text-[10px] font-semibold"
                        >
                            <Plus className="size-2.5" />
                            Insert
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}
