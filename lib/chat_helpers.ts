import { ChatMessage } from "@/types/chat-related";

export type ChatStatus = "submitted" | "ready" | "error";

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

    sendMessage(message: ChatMessage): Promise<void>;

    stop(): Promise<void>;

    clearError(): void;

    setMessages(
        messages:
            | ChatMessage[]
            | ((messages: ChatMessage[]) => ChatMessage[])
    ): void;
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

    abstract sendMessage(message: ChatMessage): Promise<void>;

    abstract stop(): Promise<void>;

    clearError(): void {
        this.state.error = undefined;
        this.state.status = "ready";
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

/* -------------------------------------------------------------------------- */
/*                         Temporary implementation                           */
/* -------------------------------------------------------------------------- */

export class Chat extends AbstractChat {
    async sendMessage(message: ChatMessage): Promise<void> {
        console.log("sendMessage", message);
    }

    async stop(): Promise<void> {
        console.log("stop");
    }
}

export const createChatState = (): ChatState => ({
    status: "ready",

    error: undefined,

    messages: [],

    pushMessage(message) {
        console.log("pushMessage", message);
    },

    popMessage() {
        console.log("popMessage");
    },

    replaceMessage(index, message) {
        console.log("replaceMessage", index, message);
    },

    snapshot<T>(thing: T): T {
        console.log("snapshot", thing);
        return thing;
    },
});