"use client";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Sparkles,
  Mail,
  CalendarClock,
  Wand2,
  Plus,
  CircleDashed,
  CheckCircle2,
  Clock,
  Hourglass,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const COLUMNS: { key: TaskStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "TODO", label: "To do", icon: CircleDashed },
  { key: "IN_PROGRESS", label: "In progress", icon: Clock },
  { key: "WAITING", label: "Waiting", icon: Hourglass },
  { key: "DONE", label: "Done", icon: CheckCircle2 },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  URGENT: "#EF4444",
  HIGH: "#F97316",
  MEDIUM: "#EAB308",
  LOW: "#22C55E",
};

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [input, setInput] = useState("");

  const grouped = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.key, [] as Task[]])) as Record<TaskStatus, Task[]>;
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      {/* NLP quick-add */}
      <div className="border-b border-navy-100 bg-gradient-to-br from-indigo-50 to-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border border-navy-200 bg-white p-1.5 shadow-card">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task — e.g. 'Remind Marcus about the Q3 budget by Friday'"
            className="flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-navy-400"
          />
          <Button variant="accent" size="sm">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>

      {/* toolbar */}
      <div className="flex items-center justify-between border-b border-navy-100 px-6 py-2">
        <div className="flex gap-1 text-xs">
          {(["Priority", "Due date", "Principal", "Source"] as const).map((f) => (
            <button key={f} className="rounded-full px-2.5 py-1 text-navy-500 hover:bg-navy-100">
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 text-xs">
          {(["kanban", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium capitalize",
                view === v ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-100",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid flex-1 grid-cols-4 gap-4 overflow-hidden p-6">
          {COLUMNS.map((col) => (
            <div key={col.key} className="flex min-h-0 flex-col rounded-card border border-navy-200 bg-navy-50/40">
              <div className="flex items-center justify-between border-b border-navy-200 px-3 py-2.5">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-navy-800">
                  <col.icon className="h-3.5 w-3.5 text-navy-500" />
                  {col.label}
                  <span className="rounded-full bg-white px-1.5 text-[10px] font-semibold text-navy-600">
                    {grouped[col.key]?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-2 scrollbar-thin">
                {(grouped[col.key] ?? []).map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
                {(grouped[col.key] ?? []).length === 0 && (
                  <div className="px-3 py-8 text-center text-xs text-navy-400">Nothing here.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white text-[10.5px] uppercase tracking-wide text-navy-500">
              <tr className="border-b border-navy-100">
                <th className="px-6 py-2 text-left">Task</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Priority</th>
                <th className="px-3 py-2 text-left">Due</th>
                <th className="px-3 py-2 text-left">Source</th>
                <th className="px-3 py-2 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-b border-navy-100 hover:bg-navy-50">
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-2">
                      <SourceIcon source={t.sourceType} />
                      <span className="font-medium text-navy-900">{t.title}</span>
                      {t.aiGenerated && <Badge tone="indigo">AI</Badge>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-navy-600">{t.status.replace("_", " ").toLowerCase()}</td>
                  <td className="px-3 py-2.5">
                    <PriorityPill p={t.priority} />
                  </td>
                  <td className="px-3 py-2.5 text-navy-600">{format(t.dueDate, "MMM d")}</td>
                  <td className="px-3 py-2.5 text-navy-500">{t.sourceType}</td>
                  <td className="px-3 py-2.5 text-navy-600">{t.assigneeName ?? "Sarah"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const progress = task.subtasks.length
    ? Math.round((task.subtasks.filter((s) => s.done).length / task.subtasks.length) * 100)
    : null;
  return (
    <div className="group cursor-pointer rounded-md bg-white p-3 shadow-card transition hover:shadow-lift">
      <div className="flex items-start gap-2">
        <span
          className="mt-1 h-2 w-2 flex-none rounded-full"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          aria-label={task.priority}
        />
        <div className="flex-1">
          <div className="text-[12.5px] font-medium text-navy-900">{task.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px] text-navy-500">
            <SourceIcon source={task.sourceType} />
            <span>{format(task.dueDate, "MMM d")}</span>
            {task.aiGenerated && <Badge tone="indigo">AI</Badge>}
          </div>
          {progress !== null && (
            <div className="mt-2">
              <div className="h-1 overflow-hidden rounded-full bg-navy-100">
                <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1 text-[10px] text-navy-500">
                {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
              </div>
            </div>
          )}
        </div>
        <Avatar name={task.assigneeName ?? "Sarah Chen"} size={20} />
      </div>
      <div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] text-navy-700 hover:bg-navy-100">
          <Wand2 className="h-3 w-3" /> Subtasks
        </button>
        <button className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] text-navy-700 hover:bg-navy-100">
          <Mail className="h-3 w-3" /> Follow-up
        </button>
      </div>
    </div>
  );
}

function SourceIcon({ source }: { source: Task["sourceType"] }) {
  const map = {
    EMAIL: Mail,
    MEETING: CalendarClock,
    AI: Sparkles,
    SLACK: Sparkles,
    MANUAL: Plus,
  } as const;
  const I = map[source] ?? Plus;
  return <I className="h-3 w-3 text-navy-400" />;
}

function PriorityPill({ p }: { p: TaskPriority }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ background: PRIORITY_COLORS[p] + "22", color: PRIORITY_COLORS[p] }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: PRIORITY_COLORS[p] }} />
      {p.toLowerCase()}
    </span>
  );
}
