"use client";

import { useFormStatus } from "react-dom";

import { LoaderIcon } from "../bot-icons/icons";

import { Button } from "../ui/button";

export function SubmitButton({
    children,
    isSuccessful,
}: {
    children: React.ReactNode;
    isSuccessful: boolean;
}) {
    const { pending } = useFormStatus();

    return (
        <Button
            aria-disabled={pending || isSuccessful}
            className="relative"
            disabled={pending || isSuccessful}
            type={pending ? "button" : "submit"}
        >
            {children}

            {pending ? (
                <span className="absolute right-4 animate-spin">
                    <LoaderIcon />
                </span>
            ) : isSuccessful ? (
                // <span className="absolute right-4 text-green-500">
                //     Ok!
                // </span>
                <div></div>
            ) : null}

            <output aria-live="polite" className="sr-only">
                {pending || isSuccessful ? "Loading" : "Submit form"}
            </output>
        </Button>
    );
}
