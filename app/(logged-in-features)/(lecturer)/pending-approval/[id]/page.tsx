"use client";

import { ArrowLeft, Bot, CalendarClock, Check, CircleUserRound, FileText, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { RelatedQa } from "@/types/verifiable-qa-related";

type GeneratedAnswerSegment = {
    role?: string;
    type?: string;
    segment?: string;
    processedCiteObj?: {
        texts?: Record<string, string[]>;
        images?: Record<string, string[]>;
    };
    processed_cite_obj?: {
        texts?: Record<string, string[]>;
        images?: Record<string, string[]>;
    };
};

const exampleQa: RelatedQa = {
    verifiableQaId: 2,
    messageId: "87f8aba0-d3b9-4a4f-837f-4280034d7f72",
    userId: 1,
    originalQuestion: "What is software engineering?",
    rewrittenQuestion: "What is software engineering",
    generatedAnswer:
        '[{"role":"paragraph","type":"cited","segment":"Software engineering is the use of knowledge of computers and computing to help solve problems, often related to computer systems, by first understanding the nature of the problem and then using technology as a tool to implement a solution if necessary.","processed_cite_obj":{"texts":{"se_theory_practice.pdf__chunk_128_129_39":["as software engineers we use our knowledge of computers and computing to help solve problems often the problem with which we are dealing is related to a computer or an existing computer system"]},"images":{}}},{"role":"paragraph","type":"cited","segment":"Software engineers use tools, techniques, procedures, and paradigms to enhance the quality of their software products, aiming to use efficient and productive approaches to generate effective solutions to problems.","processed_cite_obj":{"texts":{"se_theory_practice.pdf__chunk_137_139_42":["software engineers use tools techniques procedures and paradigms to enhance the quality of their software products"]},"images":{}}}]',
    status: 0,
    createdAt: "2026-07-15T16:21:57.728841Z",
    user: {
        userId: 1,
        majorId: 1,
        majorName: "Software Engineer",
        email: "kt01@gmail.com",
        name: "Kim Tran",
        cohort: "K48",
        accountStatus: "active",
    },
    courses: [
        {
            courseId: 1,
            courseCode: "CT114H",
            courseName: "Introduction to Software Engineering",
        },
    ],
};

function parseGeneratedAnswer(answer: string): GeneratedAnswerSegment[] {
    try {
        return JSON.parse(answer) as GeneratedAnswerSegment[];
    } catch {
        return [];
    }
}

function formatCreatedAt(value: string) {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function getStatusLabel(status: number) {
    if (status === 1) {
        return "Approved";
    }

    if (status === 2) {
        return "Rejected";
    }

    return "Pending";
}

function getProcessedCiteObj(segment: GeneratedAnswerSegment) {
    return segment.processedCiteObj ?? segment.processed_cite_obj;
}

function buildCitationMap(segments: GeneratedAnswerSegment[]) {
    const citationMap = new Map<string, number>();
    let currentMark = 1;

    for (const segment of segments) {
        const processedCiteObj = getProcessedCiteObj(segment);
        if (!processedCiteObj) continue;

        for (const docId of Object.keys(processedCiteObj.texts ?? {})) {
            if (!citationMap.has(docId)) {
                citationMap.set(docId, currentMark++);
            }
        }

        for (const docId of Object.keys(processedCiteObj.images ?? {})) {
            if (!citationMap.has(docId)) {
                citationMap.set(docId, currentMark++);
            }
        }
    }

    return citationMap;
}

function getSegmentCitationMarks(
    segment: GeneratedAnswerSegment,
    citationMap: Map<string, number>
) {
    const processedCiteObj = getProcessedCiteObj(segment);
    if (!processedCiteObj) return [];

    return [
        ...Object.keys(processedCiteObj.texts ?? {}),
        ...Object.keys(processedCiteObj.images ?? {}),
    ]
        .map((docId) => citationMap.get(docId))
        .filter((mark): mark is number => Boolean(mark));
}

function mapGeneratedAnswerToText(segments: GeneratedAnswerSegment[]) {
    const citationMap = buildCitationMap(segments);
    const lines: string[] = [];

    for (const segment of segments) {
    const text = segment.segment?.trim();
        if (!text) continue;

    const marks = getSegmentCitationMarks(segment, citationMap);
        const citationText = marks.map((mark) => `[#citation${mark}]`).join(" ");
        const textWithCitations = citationText ? `${text} ${citationText}` : text;

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

export default function PendingApprovalDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const qa = exampleQa;
    const [question, setQuestion] = useState(qa.rewrittenQuestion);
    const [questionDraft, setQuestionDraft] = useState(qa.rewrittenQuestion);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const answerSegments = parseGeneratedAnswer(qa.generatedAnswer);
    const generatedAnswerText = mapGeneratedAnswerToText(answerSegments);

    function startEditingQuestion() {
        setQuestionDraft(question);
        setIsEditingQuestion(true);
    }

    function saveQuestion() {
        setQuestion(questionDraft.trim() || question);
        setIsEditingQuestion(false);
    }

    function cancelEditingQuestion() {
        setQuestionDraft(question);
        setIsEditingQuestion(false);
    }

    return (
        <main className="min-h-screen bg-background py-3 text-foreground md:px-6">
            <header className="mb-6 flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
                        <Link href="/pending-approval">
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                        </Button>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-semibold text-main-navy">
                            Verifiable QA #{id}
                        </h1>
                        <span className="rounded-md border border-main-navy/15 bg-main-navy/8 px-2 py-1 text-xs font-medium text-main-navy">
                            {getStatusLabel(qa.status)}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Review the generated answer before approval.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="size-4" />
                        Edit answer
                    </Button>
                    <Button>
                        <Check className="size-4" />
                        Approve
                    </Button>
                </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className="space-y-5">
                    <div className="rounded-lg border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-main-navy">
                                <CircleHelp className="size-4 text-main-navy" />
                                <h2 className="text-base font-semibold">Question</h2>
                            </div>
                            {isEditingQuestion ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={cancelEditingQuestion}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={saveQuestion}>
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={startEditingQuestion}>
                                    <FileText className="size-3.5" />
                                    Edit
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Question
                                </p>
                                {isEditingQuestion ? (
                                    <textarea
                                        value={questionDraft}
                                        onChange={(event) => setQuestionDraft(event.target.value)}
                                        className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors focus:border-main-navy/40 focus:ring-3 focus:ring-main-navy/10"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-foreground">
                                        {question}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Original question
                                </p>
                                <p className="text-sm text-foreground">{qa.originalQuestion}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
                        <div className="mb-4 flex items-center gap-2 text-main-navy">
                            <Bot className="size-4" />
                            <h2 className="text-base font-semibold">Generated answer</h2>
                        </div>

                        <div className="space-y-3">
                            {answerSegments.length > 0 ? (
                                <div className="whitespace-pre-line rounded-lg border border-border/70 bg-background p-4 text-sm leading-7 text-foreground">
                                    {generatedAnswerText}
                                </div>
                            ) : (
                                <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                                    No generated answer available.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-5">
                    <div className="rounded-lg border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
                        <div className="mb-4 flex items-center gap-2 text-main-navy">
                            <CalendarClock className="size-4" />
                            <h2 className="text-base font-semibold">Metadata</h2>
                        </div>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Created
                                </dt>
                                <dd className="mt-1 text-foreground">{formatCreatedAt(qa.createdAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Courses
                                </dt>
                                <dd className="mt-2 flex flex-wrap gap-2">
                                    {qa.courses.map((course) => (
                                        <span
                                            key={course.courseId}
                                            className="rounded-md border border-main-navy/15 bg-main-navy/8 px-2 py-1 text-xs font-medium text-main-navy"
                                        >
                                            {course.courseCode} - {course.courseName}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
                        <div className="mb-4 flex items-center gap-2 text-main-navy">
                            <CircleUserRound className="size-4" />
                            <h2 className="text-base font-semibold">Asked by</h2>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{qa.user.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{qa.user.email}</p>
                        </div>
                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Account status
                                </dt>
                                <dd className="mt-1 capitalize text-foreground">
                                    {qa.user.accountStatus}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Major
                                </dt>
                                <dd className="mt-1 text-foreground">
                                    {qa.user.majorName ?? "Not provided"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Cohort
                                </dt>
                                <dd className="mt-1 text-foreground">{qa.user.cohort ?? "Not provided"}</dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </div>
        </main>
    );
}
