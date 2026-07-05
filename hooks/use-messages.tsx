import { UseChatHelpers } from "@/lib/chat_helpers";
import { useEffect, useState } from "react";
import type { ChatMessage } from "@/types/chat-related";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

export function useMessages({
  status,
}: {
  status: UseChatHelpers["status"];
}) {
  const {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
    reset,
  } = useScrollToBottom();

  const [hasSentMessage, setHasSentMessage] = useState(false);

  useEffect(() => {
    if (status === "has-send") {
      setHasSentMessage(true);
    }
  }, [status]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
    reset,
  };
}
