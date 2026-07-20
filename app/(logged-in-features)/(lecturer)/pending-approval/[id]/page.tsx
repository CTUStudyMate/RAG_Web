"use client";

import { ArrowLeft, Bot, CalendarClock, Check, CircleUserRound, CircleHelp, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import { AvailableCitations } from "@/components/component-items/available-citations";
import { CitedAnswerContent, type CitedAnswerSegment } from "@/components/component-items/cited-answer-content";
import { VerifiedMessageContent } from "@/components/component-items/verified-message-content";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import {
    parseGeneratedAnswer,
    prepareEditableAnswer,
} from "@/lib/verified-answer";
import { approveVerifiableQa } from "@/services/verifiable-qa";
import type { RelatedQa } from "@/types/verifiable-qa-related";
import { toast } from "@/components/ui/toast";

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

export default function PendingApprovalDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();
    const { data: qa, error, isLoading } = useSWR<RelatedQa>(
        id ? `/api/verifiable-qa/${id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    const [question, setQuestion] = useState("");
    const [questionDraft, setQuestionDraft] = useState("");
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [answer, setAnswer] = useState("");
    const [answerDraft, setAnswerDraft] = useState("");
    const [isEditingAnswer, setIsEditingAnswer] = useState(false);
    const [hasSavedEditedAnswer, setHasSavedEditedAnswer] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const loadedQaIdRef = useRef<number | null>(null);
    const answerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const generatedAnswerSegments = qa ? parseGeneratedAnswer(qa.generatedAnswer) : [];
    const preparedAnswer = useMemo(
        () => qa ? prepareEditableAnswer(qa.generatedAnswer) : null,
        [qa]
    );

    useEffect(() => {
        if (!qa || loadedQaIdRef.current === qa.verifiableQaId) {
            return;
        }

        const initialQuestion = qa.rewrittenQuestion ?? qa.originalQuestion;
        const generatedAnswer = preparedAnswer?.editedAnswer ?? qa.generatedAnswer;
        setQuestion(initialQuestion);
        setQuestionDraft(initialQuestion);
        setAnswer(generatedAnswer);
        setAnswerDraft(generatedAnswer);
        setHasSavedEditedAnswer(false);
        loadedQaIdRef.current = qa.verifiableQaId;
    }, [qa, preparedAnswer]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background py-3 text-foreground md:px-6">
                <p className="text-muted-foreground">Loading pending QA...</p>
            </main>
        );
    }

    if (error || !qa) {
        return (
            <main className="min-h-screen bg-background py-3 text-foreground md:px-6">
                <p className="text-destructive">Failed to load pending QA.</p>
            </main>
        );
    }

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

    function startEditingAnswer() {
        setAnswerDraft(answer);
        setIsEditingAnswer(true);
    }

    function saveAnswer() {
        setAnswer(answerDraft.trim() || answer);
        setHasSavedEditedAnswer(true);
        setIsEditingAnswer(false);
    }

    function cancelEditingAnswer() {
        setAnswerDraft(answer);
        setIsEditingAnswer(false);
    }

    function insertCitation(refId: string) {
        const token = `[#${refId}]`;
        const textarea = answerTextareaRef.current;

        if (!textarea) {
            setAnswerDraft((current) => `${current}${current ? " " : ""}${token}`);
            return;
        }

        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const nextAnswerDraft = `${answerDraft.slice(0, selectionStart)}${token}${answerDraft.slice(selectionEnd)}`;
        const nextCursorPosition = selectionStart + token.length;

        setAnswerDraft(nextAnswerDraft);
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
        });
    }

    async function handleApprove() {
        if (!answer.trim()) {
            toast({ type: "error", description: "Approved answer cannot be empty." });
            return;
        }

        if (!qa || !preparedAnswer) {
            toast({ type: "error", description: "Approved answer data is unavailable." });
            return;
        }

        setIsApproving(true);

        try {
            await approveVerifiableQa(qa.verifiableQaId, {
                editedAnswer: answer.trim(),
                citations: preparedAnswer.citations,
                citationMap: preparedAnswer.citationMap,
            });
            toast({ type: "success", description: "Verifiable QA approved successfully." });
            router.push("/pending-approval");
        } catch {
            toast({ type: "error", description: "Failed to approve verifiable QA." });
        } finally {
            setIsApproving(false);
        }
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
                        <span
                            className={qa.status === 0
                                ? "rounded-md border border-amber-500/30 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                                : "rounded-md border border-main-navy/15 bg-main-navy/8 px-2 py-1 text-xs font-medium text-main-navy"}
                        >
                            {getStatusLabel(qa.status)}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Review the generated question and answer before approval.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleApprove} disabled={isEditingAnswer || isApproving} className="bg-main-primary-light hover:bg-main-secondary cursor-pointer pr-5">
                        <Check className="size-4" />
                        {isApproving ? "Approving..." : "Approve"}
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

                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Question
                                    </p>
                                    {isEditingQuestion ? (
                                        <div className="flex gap-2 justify-end mb-2">
                                            <Button variant="outline" size="sm" onClick={cancelEditingQuestion}>
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={saveQuestion} className="bg-main-primary-light hover:bg-main-secondary">
                                                Save
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" onClick={startEditingQuestion}>
                                                <Pencil className="size-4" />
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-end">


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
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-main-navy">
                                <Bot className="size-4" />
                                <h2 className="text-base font-semibold">Generated answer</h2>
                            </div>
                            {isEditingAnswer ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={cancelEditingAnswer} disabled={isApproving}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={saveAnswer} disabled={isApproving} className="bg-main-primary-light hover:bg-main-secondary">
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={startEditingAnswer} disabled={isApproving}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {isEditingAnswer ? (
                                <>
                                    <textarea
                                        ref={answerTextareaRef}
                                        value={answerDraft}
                                        onChange={(event) => setAnswerDraft(event.target.value)}
                                        className="min-h-56 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-7 text-foreground outline-none transition-colors focus:border-main-navy/40 focus:ring-3 focus:ring-main-navy/10"
                                    />

                                    {preparedAnswer && (
                                        <AvailableCitations
                                            citations={preparedAnswer.citations}
                                            onAddCitation={insertCitation}
                                        />
                                    )}
                                </>
                            ) : hasSavedEditedAnswer && preparedAnswer ? (
                                <div className="rounded-lg border border-border/70 bg-background p-4 text-sm text-foreground">
                                    <VerifiedMessageContent
                                        editedAnswer={answer}
                                        citations={preparedAnswer.citations}
                                    />
                                </div>
                            ) : generatedAnswerSegments.length > 0 ? (
                                <div className="rounded-lg border border-border/70 bg-background p-4 text-sm text-foreground">
                                    <CitedAnswerContent segments={generatedAnswerSegments as CitedAnswerSegment[]} />
                                </div>
                            ) : answer ? (
                                <div className="whitespace-pre-line rounded-lg border border-border/70 bg-background p-4 text-sm leading-7 text-foreground">
                                    {answer}
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
                            <p className="font-medium text-foreground">{qa.user?.name ?? "Unknown user"}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{qa.user?.email ?? "Not provided"}</p>
                        </div>
                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Account status
                                </dt>
                                <dd className="mt-1 capitalize text-foreground">
                                    {qa.user?.accountStatus ?? "Not provided"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Major
                                </dt>
                                <dd className="mt-1 text-foreground">
                                    {qa.user?.majorName ?? "Not provided"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Cohort
                                </dt>
                                <dd className="mt-1 text-foreground">{qa.user?.cohort ?? "Not provided"}</dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </div>
        </main>
    );
}
