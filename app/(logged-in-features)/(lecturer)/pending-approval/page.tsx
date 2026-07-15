import { BookOpenCheck, CalendarClock, Check, CheckCircle2, CircleHelp, Clock3, Eye } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type {
    RelatedQa,
    RelatedQaResponse,
} from "@/types/verifiable-qa-related";

type GeneratedAnswerSegment = {
    segment?: string;
};

const exampleResponse: RelatedQaResponse = {
    total: 1,
    relatedQa: [
        {
            verifiableQaId: 2,
            messageId: "87f8aba0-d3b9-4a4f-837f-4280034d7f72",
            userId: 1,
            originalQuestion: "What is software engineering?",
            rewrittenQuestion: "What is software engineering",
            generatedAnswer:
                '[{"role":"paragraph","type":"cited","segment":"Software engineering is the use of knowledge of computers and computing to help solve problems, often related to computer systems, by first understanding the nature of the problem and then using technology as a tool to implement a solution if necessary.","citations":[{"type":"source_text","content":"As software engineers, we use our knowledge of computers and computing to help solve problems. Often the problem with which we are dealing is related to a computer or an existing computer system, but sometimes the difficulties underlying the problem have nothing to do with computers.Therefore, it is essential that we first understand the nature of the problem. In particular, we must be very careful not to impose computing machinery or techniques on every problem that comes our way. We must solve the problem first. Then, if need be, we can use technology as a tool to implement our solution.","img_id":null,"processed_texts":[["se_theory_practice.pdf__chunk_128_129_39","as software engineers we use our knowledge of computers and computing to help solve problems often the problem with which we are dealing is related to a computer or an existing computer system but sometimes the difficulties underlying the problem have nothing to do with computerstherefore it is essential that we first understand the nature of the problem in particular we must be very careful not to impose computing machinery or techniques on every problem that comes our way we must solve the problem first then if need be we can use technology as a tool to implement our solution"]],"processed_info":null}],"processed_cite_obj":{"texts":{"se_theory_practice.pdf__chunk_128_129_39":["as software engineers we use our knowledge of computers and computing to help solve problems often the problem with which we are dealing is related to a computer or an existing computer system but sometimes the difficulties underlying the problem have nothing to do with computerstherefore it is essential that we first understand the nature of the problem in particular we must be very careful not to impose computing machinery or techniques on every problem that comes our way we must solve the problem first then if need be we can use technology as a tool to implement our solution"]},"images":{}},"Raw":null},{"role":"paragraph","type":"cited","segment":"Software engineers use tools, techniques, procedures, and paradigms to enhance the quality of their software products, aiming to use efficient and productive approaches to generate effective solutions to problems.","citations":[{"type":"source_text","content":"Software engineers use tools, techniques, procedures, and paradigms to enhance the  quality  of  their  software  products. Their  aim  is  to  use  efficient  and  productive approaches to generate effective solutions to problems.","img_id":null,"processed_texts":[["se_theory_practice.pdf__chunk_137_139_42","software engineers use tools techniques procedures and paradigms to enhance the quality of their software products their aim is to use efficient and productive approaches to generate effective solutions to problems"]],"processed_info":null}],"processed_cite_obj":{"texts":{"se_theory_practice.pdf__chunk_137_139_42":["software engineers use tools techniques procedures and paradigms to enhance the quality of their software products their aim is to use efficient and productive approaches to generate effective solutions to problems"]},"images":{}},"Raw":null}]',
            status: 0,
            createdAt: "2026-07-15T16:21:57.728841Z",
            user: {
                userId: 1,
                majorId: null,
                majorName: null,
                email: "kt01@gmail.com",
                name: "Kim Tran",
                cohort: null,
                accountStatus: "active",
            },
            courses: [
                {
                    courseId: 1,
                    courseCode: "CT114H",
                    courseName: "Introduction to Software Engineering",
                },
            ],
        },
    ],
    undefinedCourseQa: [],
};

const pendingQas = [
    ...exampleResponse.relatedQa,
    ...exampleResponse.relatedQa,
    ...exampleResponse.relatedQa,
];

function parseGeneratedAnswer(answer: string): GeneratedAnswerSegment[] {
    try {
        return JSON.parse(answer) as GeneratedAnswerSegment[];
    } catch {
        return [];
    }
}

function getAnswerPreview(qa: RelatedQa) {
    const segments = parseGeneratedAnswer(qa.generatedAnswer);

    return (
        segments
            .map((segment) => segment.segment)
            .filter(Boolean)
            .join(" ") || "No generated answer."
    );
}

function formatCreatedAt(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function isCreatedToday(value: string) {
    const createdAt = new Date(value);
    const today = new Date();

    return (
        createdAt.getFullYear() === today.getFullYear() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getDate() === today.getDate()
    );
}

export default function PendingApprovalPage() {
    const pendingCount = pendingQas.length;
    const pendingToday = pendingQas.filter((qa) => isCreatedToday(qa.createdAt)).length;
    const undefinedCourseCount = exampleResponse.undefinedCourseQa.length;
    const approvedTotal = 0;
    const approvedToday = 0;

    const summaryItems = [
        {
            label: "Total Pending",
            value: pendingCount,
            icon: Clock3,
        },
        {
            label: "New today",
            value: pendingToday,
            detail: "Created today",
            icon: CalendarClock,
        },
        {
            label: "Related to your courses",
            value: approvedTotal,
            detail: "All time",
            icon: BookOpenCheck,
        },
        {
            label: "Undefined course",
            value: undefinedCourseCount,
            detail: "",
            icon: CircleHelp,
        },
        {
            label: "Approved today",
            value: approvedToday,
            detail: "Current day",
            icon: CheckCircle2,
        },
    ];

    return (
        <main className="min-h-screen bg-background py-3 text-foreground md:pl-6 md:pr-6">
            <header id="page-header" className="mb-6">
                <h1 className="mt-1 text-2xl font-semibold text-main-navy">Pending Approval</h1>
            </header>

            <section
                id="pending-page-summary"
                className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
            >
                {summaryItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-lg border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold tabular-nums text-main-navy">
                                        {item.value}
                                    </p>
                                </div>
                                <span className="flex size-9 items-center justify-center rounded-md bg-main-navy/8 text-main-navy">
                                    <Icon className="size-4" />
                                </span>
                            </div>
                            {"detail" in item && item.detail ? (
                                <p className="mt-3 text-xs text-muted-foreground">{item.detail}</p>
                            ) : null}
                        </div>
                    );
                })}
            </section>

            <section className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                    <div>
                        <h2 className="text-base font-semibold text-main-navy">Pending QA list</h2>
                        <p className="text-sm text-muted-foreground">
                            Review generated answers before publishing them to course knowledge.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="w-[150px] px-4 py-3 font-semibold">Created</th>
                                <th className="w-[180px] px-4 py-3 font-semibold">Question</th>
                                <th className="px-4 py-3 font-semibold">Generated answer</th>
                                <th className="w-[220px] px-4 py-3 font-semibold">Courses</th>
                                <th className="w-[190px] px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/70">
                            {pendingQas.map((qa, index) => (
                                <tr
                                    key={`${qa.verifiableQaId}-${index}`}
                                    className="align-top transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-4 text-muted-foreground">
                                        <div className="font-medium text-foreground">
                                            {formatCreatedAt(qa.createdAt)}
                                        </div>
                                        <div className="mt-1 text-xs">{qa.user.name}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="line-clamp-3 font-medium text-foreground">
                                            {qa.originalQuestion}
                                        </p>
                                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                            Rewritten: {qa.rewrittenQuestion}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="line-clamp-5 text-muted-foreground">
                                            {getAnswerPreview(qa)}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {qa.courses.map((course) => (
                                                <span
                                                    key={course.courseId}
                                                    className="rounded-md border border-main-navy/15 bg-main-navy/8 px-2 py-1 text-xs font-medium text-main-navy"
                                                    title={course.courseName}
                                                >
                                                    {course.courseCode} - {course.courseName}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm">
                                                <Check className="size-3.5" />
                                                Approve
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/pending-approval/${qa.verifiableQaId}`}>
                                                    <Eye className="size-3.5" />
                                                    Detail
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
