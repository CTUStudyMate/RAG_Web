import { Sparkles } from "lucide-react";

export function Greeting() {
    return (
        <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl text-main-navy">
                <Sparkles className="size-5" fill="#00afef" stroke="#00afef" />
            </div>
            <h2 className="text-lg text-foreground text-main-navy">
                What would you like to learn?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ask a question about your course materials to get started.
            </p>
        </div>
    );
}
