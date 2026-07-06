import { ChatMessage } from "@/types/chat-related";
import useSWR from "swr";

export type ChatStatus = "is-sending" | "not-sending" | "has-send"; // has-send just means for UI

export interface ChatState {
    status: ChatStatus;
    error?: Error;
    messages: ChatMessage[];

    pushMessage(message: ChatMessage): void;
    popMessage(): void;
    replaceMessage(index: number, message: ChatMessage): void;
    snapshot<T>(thing: T): T;
}

export interface UseChatHelpers {
    id: string;

    messages: ChatMessage[];

    status: ChatStatus;

    error?: Error;

    sendMessage(text: string): Promise<void>;

    clearError(): void;

    setMessages: ReturnType<typeof useSWR<ChatMessage[]>>["mutate"];
}

export abstract class AbstractChat implements UseChatHelpers {
    readonly id: string;

    protected state: ChatState;

    constructor({
        id,
        state,
    }: {
        id: string;
        state: ChatState;
    }) {
        this.id = id;
        this.state = state;
    }

    get messages(): ChatMessage[] {
        return this.state.messages;
    }

    set messages(messages: ChatMessage[]) {
        this.state.messages = messages;
    }

    get status(): ChatStatus {
        return this.state.status;
    }

    get error(): Error | undefined {
        return this.state.error;
    }

    abstract sendMessage(message: string): Promise<void>;

    abstract stop(): Promise<void>;

    clearError(): void {
        this.state.error = undefined;
        this.state.status = "not-sending";
    }

    setMessages(
        messages:
            | ChatMessage[]
            | ((messages: ChatMessage[]) => ChatMessage[])
    ): void {
        if (typeof messages === "function") {
            this.state.messages = messages(this.state.messages);
        } else {
            this.state.messages = messages;
        }
    }
}
