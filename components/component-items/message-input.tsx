"use client";

import { useState, KeyboardEvent } from "react";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
    // onSend?: (message: string) => void;
    disabled?: boolean;
    sendMessage: (text: string) => Promise<void>;
}

export default function MessageInput({
    sendMessage,
    disabled = false,
}: MessageInputProps) {

    const [input, setInput] = useState("");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = input.trim();
        if (!message) return;
        sendMessage(message);
        setInput("");
    };


    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const message = input.trim();
            if (!message) return;
            sendMessage(message);
            setInput("");
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm"
        >
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                disabled={disabled}
                className={cn(
                    "max-h-40 min-h-10 flex-1 resize-none bg-transparent",
                    "px-2 py-2 text-sm outline-none",
                    "placeholder:text-muted-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                )}
            />

            <button
                type="submit"
                disabled={!input.trim() || disabled}
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "bg-primary text-primary-foreground transition",
                    "hover:bg-primary/90",
                    "disabled:pointer-events-none disabled:opacity-40"
                )}
            >
                <ArrowUpIcon size={18} />
            </button>
        </form>
    );
}