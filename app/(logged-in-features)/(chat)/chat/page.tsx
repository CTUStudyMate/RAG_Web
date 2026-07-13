import { ChatShell } from "@/components/layout-main/chat-shell";
import { ActiveChatProvider } from "@/hooks/use-active-chat";

export default function Page() {
  return (
    <ActiveChatProvider>
      <ChatShell />
    </ActiveChatProvider>
  );
}
