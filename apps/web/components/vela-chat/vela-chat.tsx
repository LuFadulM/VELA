"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Turn {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

const QUICK_PROMPTS = [
  { slash: "/schedule", label: "Find time with Deena next Tuesday" },
  { slash: "/email", label: "Summarize the Harbor thread" },
  { slash: "/brief", label: "Brief me on the next 2 hours" },
  { slash: "/task", label: "Remind Marcus about Q3 budget by Friday" },
];

export function VelaChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      content:
        "Hi Sarah — I'm caught up on today. You have the exec sync at 9am (prep pack ready), 2 urgent emails, and 4 overdue tasks. What do you want to tackle first?",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  async function send(userContent: string) {
    if (!userContent.trim() || streaming) return;
    const nextTurns: Turn[] = [
      ...turns,
      { role: "user", content: userContent },
      { role: "assistant", content: "", pending: true },
    ];
    setTurns(nextTurns);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextTurns
            .filter((t) => !t.pending)
            .map((t) => ({ role: t.role, content: t.content })),
        }),
      });

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const line = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const payload = JSON.parse(line.slice(6)) as {
            delta?: string;
            done?: boolean;
            error?: string;
          };
          if (payload.delta) {
            acc += payload.delta;
            setTurns((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1]!;
              copy[copy.length - 1] = { ...last, content: acc, pending: true };
              return copy;
            });
          }
          if (payload.done || payload.error) {
            setTurns((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1]!;
              copy[copy.length - 1] = {
                ...last,
                content: payload.error ? `⚠️ ${payload.error}` : last.content,
                pending: false,
              };
              return copy;
            });
          }
        }
      }
    } catch (err) {
      setTurns((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "I couldn't reach the language model just now. Retrying usually fixes it.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy-900/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-label="Ask Vela"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 z-50 flex h-[640px] max-h-[calc(100vh-2rem)] w-[440px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-modal border border-navy-200 bg-white shadow-lift"
          >
            {/* header */}
            <header className="flex items-center justify-between border-b border-navy-100 bg-gradient-to-br from-navy-900 to-indigo-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
                  <Sparkles className="h-4 w-4 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Ask Vela</div>
                  <div className="text-[10px] text-navy-300">Live context · Claude Sonnet 4.6</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* transcript */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              <div className="space-y-3">
                {turns.map((t, i) => (
                  <MessageBubble key={i} turn={t} isLast={i === turns.length - 1} />
                ))}
                {streaming && turns[turns.length - 1]?.pending && turns[turns.length - 1]?.content === "" && (
                  <TypingIndicator />
                )}
              </div>
            </div>

            {/* quick prompts */}
            {turns.length <= 2 && !streaming && (
              <div className="flex flex-wrap gap-1.5 border-t border-navy-100 px-4 py-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.slash}
                    onClick={() => send(q.label)}
                    className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white px-2.5 py-1 text-[11px] text-navy-700 hover:bg-navy-50"
                  >
                    <span className="font-mono text-indigo-600">{q.slash}</span>
                    <span className="truncate">{q.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-navy-100 bg-white p-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask Vela anything…"
                rows={1}
                className="max-h-[120px] flex-1 resize-none rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className={cn(
                  "inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-white transition",
                  input.trim() && !streaming ? "bg-indigo-600 hover:bg-indigo-700" : "bg-navy-300",
                )}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ turn, isLast }: { turn: Turn; isLast: boolean }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-navy-900 px-3.5 py-2 text-sm leading-relaxed text-white">
          {turn.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Sparkles className="h-3 w-3" />
      </div>
      <div className="flex-1">
        <div className="rounded-2xl rounded-tl-md bg-navy-50 px-3.5 py-2.5 text-sm leading-relaxed text-navy-900 whitespace-pre-wrap">
          {turn.content || (turn.pending ? "…" : "")}
          {turn.pending && <span className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-indigo-500 align-middle" />}
        </div>
        {/* actionable card example on the first model response */}
        {isLast && !turn.pending && turn.content.toLowerCase().includes("schedule") && (
          <ConfirmCard
            title="Schedule with Deena — Tuesday 3:00 PM"
            description="Hold 30m, video link included, email draft ready for review."
          />
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-navy-500">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Sparkles className="h-3 w-3" />
      </div>
      <span className="italic">Vela is thinking…</span>
      <span className="inline-flex gap-0.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400" />
      </span>
    </div>
  );
}

function ConfirmCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
            <ArrowUpRight className="h-3 w-3" /> Action ready
          </div>
          <div className="mt-1 text-sm font-semibold text-navy-900">{title}</div>
          <div className="text-xs text-navy-600">{description}</div>
        </div>
      </div>
      <div className="mt-2.5 flex gap-2">
        <button className="inline-flex items-center gap-1 rounded-md bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-navy-800">
          <CheckCircle2 className="h-3 w-3" />
          Confirm
        </button>
        <button className="rounded-md border border-navy-200 bg-white px-2.5 py-1 text-xs font-semibold text-navy-700 hover:bg-navy-50">
          Edit
        </button>
        <button className="rounded-md px-2.5 py-1 text-xs font-semibold text-navy-500 hover:bg-navy-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
