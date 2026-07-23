import type { RelatedQa } from "@/types/verifiable-qa-related";
import type { VerifiedAnswer } from "@/lib/verified-answer";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

type ApproveVerifiableQaPayload = {
    approvedAnswer: VerifiedAnswer;
    rewrittenQuestion?: string;
};

export async function approveVerifiableQa(
    verifiableQaId: number,
    { approvedAnswer, rewrittenQuestion }: ApproveVerifiableQaPayload
): Promise<RelatedQa> {
    const res = await fetch(
        `${backendUrl}/api/verifiable-qa/${verifiableQaId}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                approvedAnswer: JSON.stringify(approvedAnswer),
                ...(rewrittenQuestion !== undefined ? { rewrittenQuestion } : {}),
            }),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to approve verifiable QA.");
    }

    return res.json();
}
