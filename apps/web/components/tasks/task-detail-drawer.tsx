"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  X,
  Mail,
  CalendarClock,
  Sparkles,
  Plus,
  Wand2,
  Send,
  CheckCircle2,
  Circle,
  MessageSquare,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceDot } from "@/components/ui/confidence";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  URGENT: "#EF4444",
  HIGH: "#F97316",
  MEDIUM: "#EAB308",
  LOW: "#22C55E",
};

/**
 * Right-side drawer that opens when a task is clicked. Surfaces the full
 * task context — source email/meeting link, subtasks (checkable), and
 * two AI affordances: generate subtasks + draft follow-up. Mock-mode
 * affordances run instantly; real mode would hit the tRPC/ai router.
 */
export function TaskDetailDrawer({
  task,
  open,
  onClose,
}: {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}) {
  const [subtasks, setSubtasks] = useState(task?.subtasks ?? []);
  const [draftingFollowUp, setDraftingFollowUp] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);

  // Reset local state whenever a new task is opened — otherwise switching
  // between tasks would carry subtask checks and drafts across unrelated items.
  useEffect(() => {
    if (task) {
      setSubtasks(task.subtasks);
      setFollowUp("");
    }
  }, [task?.id]);

  async function generateSubtasks() {
    if (!task) return;
    setGeneratingSubtasks(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubtasks((prev) => [
      ...prev,
      { id: `ai-${Date.now()}-a`, title: `Clarify scope of "${task.title}"`, done: false },
      { id: `ai-${Date.now()}-b`, title: "Identify owner and stakeholders", done: false },
      { id: `ai-${Date.now()}-c`, title: "Draft first artifact", done: false },
      { id: `ai-${Date.now()}-d`, title: "Review and send", done: false },
    ]);
    setGeneratingSubtasks(false);
  }

  async function draftFollowUpMock() {
    if (!task) return;
    setDraftingFollowUp(true);
    await new Promise((r) => setTimeout(r, 600));
    setFollowUp(
      `Hi —\n\nQuick follow-up on "${task.title}". It's due ${format(task.dueDate, "EEE, MMM d")} and currently ${task.status.toLowerCase().replace("_", " ")}. Any update you can share, or anything I can unblock?\n\nBest,\nSarah`,
    );
    setDraftingFollowUp(false);
  }

  function toggleSubtask(id: string) {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  return (
    <AnimatePresence>
      {open && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy-900/30 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label={task.title}
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[480px] max-w-[92vw] flex-col bg-white shadow-lift"
          >
            <header className="flex items-start justify-between gap-3 border-b border-navy-100 px-5 py-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: PRIORITY_COLORS[task.priority] }}
                  />
                  <Badge tone="neutral">{task.priority.toLowerCase()}</Badge>
                  <Badge tone={task.status === "DONE" ? "emerald" : "indigo"}>
                    {task.status.replace("_", " ").toLowerCase()}
                  </Badge>
                  {task.aiGenerated && <Badge tone="indigo">AI-created</Badge>}
                </div>
                <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">{task.title}</h2>
                {task.description && (
                  <p className="mt-1 text-sm text-navy-600">{task.description}</p>
                )}
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 text-navy-500 hover:bg-navy-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* metadata */}
              <section className="grid grid-cols-2 gap-3 border-b border-navy-100 bg-navy-50/40 p-5 text-[12.5px]">
                <Meta label="Due" value={format(task.dueDate, "EEE, MMM d")} />
                <Meta label="Source" value={task.sourceType.toLowerCase()} />
                <Meta label="Assignee" value={task.assigneeName ?? "Sarah Chen"} />
                <Meta label="Tags" value={task.tags.length ? task.tags.join(", ") : "—"} />
              </section>

              {/* source link */}
              {task.sourceId && (
                <section className="border-b border-navy-100 px-5 py-4">
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Source</h4>
                  <button className="flex w-full items-center gap-3 rounded-md border border-navy-200 bg-white p-3 text-left hover:bg-navy-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                      {task.sourceType === "EMAIL" ? <Mail className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12.5px] font-semibold text-navy-900">
                        {task.sourceType === "EMAIL" ? "Email thread" : "Meeting"} · {task.sourceId}
                      </div>
                      <div className="text-xs text-navy-500">
                        Open the {task.sourceType.toLowerCase()} that generated this task.
                      </div>
                    </div>
                  </button>
                </section>
              )}

              {/* subtasks */}
              <section className="border-b border-navy-100 px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Subtasks</h4>
                  <Button size="sm" variant="outline" onClick={generateSubtasks} loading={generatingSubtasks}>
                    <Wand2 className="h-3.5 w-3.5" /> Generate with Vela
                  </Button>
                </div>
                {subtasks.length === 0 ? (
                  <p className="text-xs text-navy-500">No subtasks yet. Let Vela break this down.</p>
                ) : (
                  <ul className="space-y-1">
                    {subtasks.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => toggleSubtask(s.id)}
                          className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] hover:bg-navy-50"
                        >
                          {s.done ? (
                            <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 flex-none text-navy-300" />
                          )}
                          <span className={cn(s.done && "text-navy-400 line-through")}>{s.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:underline">
                  <Plus className="h-3 w-3" /> Add subtask
                </button>
              </section>

              {/* AI context */}
              <section className="border-b border-navy-100 bg-indigo-50/50 px-5 py-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                  <Sparkles className="h-3.5 w-3.5" /> Vela suggestions
                  <ConfidenceDot level="medium" />
                </div>
                <div className="space-y-2 text-[12.5px] text-navy-800">
                  <div className="rounded-md bg-white p-2.5">
                    <b>Smart priority:</b> currently <span className="text-navy-700">{task.priority.toLowerCase()}</span>.
                    {task.priority === "URGENT"
                      ? " Recommend keeping — time-sensitive dependency."
                      : " Raise to HIGH if this blocks Marcus's Friday meeting."}
                  </div>
                  <div className="rounded-md bg-white p-2.5">
                    <b>Next step:</b> {task.status === "WAITING" ? "Nudge the owner — 48h since last update." : "Draft the first artifact to unblock yourself."}
                  </div>
                </div>
              </section>

              {/* follow-up drafter */}
              <section className="border-b border-navy-100 px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Follow-up email</h4>
                  <Button size="sm" variant="outline" onClick={draftFollowUpMock} loading={draftingFollowUp}>
                    <Wand2 className="h-3.5 w-3.5" /> Draft follow-up
                  </Button>
                </div>
                {followUp ? (
                  <>
                    <textarea
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      rows={7}
                      className="w-full rounded-lg border border-navy-200 bg-white p-2.5 text-[12.5px] leading-relaxed text-navy-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="accent">
                        <Send className="h-3.5 w-3.5" /> Send
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setFollowUp("")}>
                        Discard
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-navy-500">
                    Click <i>Draft follow-up</i> and Vela will compose one in your voice, ready for review.
                  </p>
                )}
              </section>

              {/* comments placeholder */}
              <section className="px-5 py-4">
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Comments</h4>
                <div className="flex items-start gap-2">
                  <Avatar name="Sarah Chen" size={26} />
                  <textarea
                    rows={2}
                    placeholder="Leave a note for yourself or a teammate…"
                    className="flex-1 resize-none rounded-lg border border-navy-200 bg-white p-2 text-[12.5px] outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-navy-500">
                  <MessageSquare className="h-3 w-3" />
                  Comments sync to the linked{" "}
                  {task.sourceType === "EMAIL" ? "email thread" : "source"} when enabled.
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-navy-500">{label}</div>
      <div className="text-[13px] font-medium capitalize text-navy-900">{value}</div>
    </div>
  );
}
