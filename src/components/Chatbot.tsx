import { type CSSProperties, useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import useScrollReveal from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { ChatMessage, fetchChatHistory, sendChatMessage } from "@/lib/chatApi";

const SESSION_STORAGE_KEY = "aquapump.chat.session";

const roleLabels: Record<ChatMessage["role"], string> = {
  user: "You",
  assistant: "Aqua AI",
  system: "System",
};

const Chatbot = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollReveal(sectionRef, { threshold: 0.15 });

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setIsFetchingHistory(true);
    fetchChatHistory(sessionId)
      .then((response) => {
        setMessages(response.messages);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load history";
        setError(message);
      })
      .finally(() => {
        setIsFetchingHistory(false);
      });
  }, [sessionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!sessionId) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }, [sessionId]);

  const isEmpty = messages.length === 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);

    const optimisticMessage: ChatMessage = {
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    try {
      const response = await sendChatMessage(sessionId, trimmed);
      setSessionId(response.session_id);
      setMessages(response.messages);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send message";
      setError(message);
      setMessages((prev) => prev.filter((msg) => msg !== optimisticMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSessionId(null);
    setMessages([]);
    setInput("");
    setError(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-muted/30 py-24 px-6 md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,63,123,0.14)_0%,_transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl" data-animate="fade-in">
        <Card className="border border-border/80 bg-background/90 shadow-2xl backdrop-blur">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold">AI Support Assistant</CardTitle>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Ask product questions and get instant answers powered by our AI assistant.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading || (isEmpty && !sessionId)}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reset chat
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,_1.6fr)_minmax(0,_1fr)]">
            <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {isFetchingHistory && (
                    <p className="text-sm text-muted-foreground">Loading previous messages…</p>
                  )}
                  {isEmpty && !isFetchingHistory ? (
                    <p className="text-sm text-muted-foreground">
                      Start the conversation by asking about pump specs, availability, or sustainability details.
                    </p>
                  ) : null}
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                      >
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                          {roleLabels[message.role]}
                        </p>
                        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSubmit} className="border-t border-border/70 bg-background/70 p-4 backdrop-blur">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask Aqua AI anything about our pumps…"
                    className="min-h-[88px] flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading} className="sm:self-end">
                    {isLoading ? "Sending…" : "Send"}
                  </Button>
                </div>
                {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
              </form>
            </div>
            <aside
              className="rounded-2xl border border-border/70 bg-card/70 p-6 text-sm leading-relaxed text-muted-foreground backdrop-blur"
              data-animate="slide-right"
              style={{ "--stagger-delay": "120ms" } as CSSProperties}
            >
              <h3 className="mb-3 text-base font-semibold text-foreground">How it works</h3>
              <p>
                Every conversation is securely stored so you can pick up where you left off. Our assistant uses
                AquaPump&apos;s proprietary knowledge to respond with relevant insights.
              </p>
              <div className="mt-4 rounded-xl border border-dashed border-accent/50 bg-accent/5 p-4 text-xs text-muted-foreground">
                Tip: Provide as much detail as possible so the assistant can tailor recommendations to your project.
              </div>
            </aside>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Chatbot;
