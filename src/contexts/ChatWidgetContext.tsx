import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Loader2, MessageCircle, RotateCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessage, fetchChatHistory, sendChatMessage } from "@/lib/chatApi";
import { cn } from "@/lib/utils";

type ChatWidgetContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

const SESSION_STORAGE_KEY = "aquapump.chat.session";

export const useChatWidget = (): ChatWidgetContextValue => {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  }
  return context;
};

const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [sessionId]);

  return { sessionId, setSessionId };
};

const FloatingLauncher = ({
  onClick,
  isBusy,
}: {
  onClick: () => void;
  isBusy: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        onClick={onClick}
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full border-0 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-[0_25px_45px_rgba(9,29,78,0.35)] transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
      >
        {isBusy ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        <span className="sr-only">Open Aqua AI assistant</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent className="text-xs">Chat with Aqua AI</TooltipContent>
  </Tooltip>
);

const roleLabels: Record<ChatMessage["role"], string> = {
  assistant: "Aqua AI",
  user: "You",
  system: "System",
};

export const ChatWidgetProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { sessionId, setSessionId } = useSessionId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasAttemptedRestore, setHasAttemptedRestore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !isOpen ||
      !sessionId ||
      hasAttemptedRestore ||
      isLoadingHistory ||
      messages.length > 0
    ) {
      if (!sessionId) {
        setHasAttemptedRestore(false);
      }
      return;
    }

    setIsLoadingHistory(true);
    setHasAttemptedRestore(true);

    fetchChatHistory(sessionId)
      .then((response) => {
        setMessages(response.messages);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Unable to load chat history";
        setError(message);
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  }, [
    hasAttemptedRestore,
    isLoadingHistory,
    isOpen,
    messages.length,
    sessionId,
  ]);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      setHasAttemptedRestore(false);
    }
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isSending ? "smooth" : "auto",
    });
  }, [isOpen, isSending, messages]);

  const resetChat = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setDraft("");
    setError(null);
    setHasAttemptedRestore(false);
  }, [setSessionId]);

  const sendDraft = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;

    const optimistic: ChatMessage = {
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    setIsSending(true);
    setError(null);

    try {
      const response = await sendChatMessage(sessionId, trimmed);
      setSessionId(response.session_id);
      setMessages(response.messages);
      setHasAttemptedRestore(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to send message";
      setError(message);
      setMessages((prev) => prev.filter((message) => message !== optimistic));
    } finally {
      setIsSending(false);
    }
  }, [draft, isSending, sessionId, setSessionId]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void sendDraft();
    },
    [sendDraft],
  );

  const handleTextareaKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void sendDraft();
      }
    },
    [sendDraft],
  );

  const contextValue = useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [setIsOpen],
  );

  const isResetDisabled = isSending || (messages.length === 0 && !sessionId);

  return (
    <ChatWidgetContext.Provider value={contextValue}>
      {children}
      {!isOpen && (
        <FloatingLauncher onClick={() => setIsOpen(true)} isBusy={isSending} />
      )}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={cn(
            "flex h-full flex-col overflow-hidden border-l border-border bg-background p-0 sm:max-w-lg",
            isMobile && "max-h-[92vh] border-l-0 border-t",
          )}
        >
          <SheetHeader className="space-y-1 px-6 pt-6 text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <SheetTitle className="text-xl">Aqua AI Assistant</SheetTitle>
                <SheetDescription className="text-sm">
                  Ask anything about AquaPump products and sustainability
                  practices.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Conversations persist automatically
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetChat}
                disabled={isResetDisabled}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-muted/40">
              <ScrollArea className="flex-1 px-4 py-5">
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <p className="text-sm text-muted-foreground">
                      Loading previous messages…
                    </p>
                  ) : null}
                  {messages.length === 0 && !isLoadingHistory ? (
                    <p className="text-sm text-muted-foreground">
                      Welcome! Ask about pump specifications, energy efficiency,
                      or installation guidance.
                    </p>
                  ) : null}
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}-${message.created_at ?? "na"}`}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground",
                        )}
                      >
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                          {roleLabels[message.role]}
                        </p>
                        <p className="whitespace-pre-line leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <form
                onSubmit={handleSubmit}
                className="border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
              >
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Ask Aqua AI anything about our pumps…"
                  rows={isMobile ? 4 : 3}
                  className="resize-none"
                  disabled={isSending}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Press Enter to send, Shift + Enter for a new line
                    </span>
                  )}
                  <Button type="submit" disabled={isSending || !draft.trim()}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ChatWidgetContext.Provider>
  );
};
