"use client";
import { useState } from "react";
import { format } from "date-fns";
import { FileText, Sparkles, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VelaDocument, DocumentType } from "@/types";

const TYPES: { value: DocumentType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BRIEF", label: "Briefs" },
  { value: "REPORT", label: "Reports" },
  { value: "MEETING_NOTES", label: "Meeting notes" },
  { value: "ITINERARY", label: "Itineraries" },
  { value: "TEMPLATE", label: "Templates" },
];

export function DocumentsView({ docs }: { docs: VelaDocument[] }) {
  const [activeId, setActiveId] = useState(docs[0]?.id ?? "");
  const [filter, setFilter] = useState<DocumentType | "ALL">("ALL");

  const filtered = filter === "ALL" ? docs : docs.filter((d) => d.type === filter);
  const active = docs.find((d) => d.id === activeId);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-white">
      <div className="flex w-[320px] flex-none flex-col border-r border-navy-100">
        <div className="flex flex-wrap gap-1 border-b border-navy-100 p-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
                filter === t.value ? "bg-navy-900 text-white" : "text-navy-500 hover:bg-navy-100",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => setActiveId(d.id)}
                className={cn(
                  "flex w-full items-start gap-2 border-b border-navy-100 p-3 text-left transition",
                  activeId === d.id ? "bg-indigo-50" : "hover:bg-navy-50",
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-semibold text-navy-900">{d.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge tone={d.isTemplate ? "indigo" : "neutral"}>{d.type.replace("_", " ").toLowerCase()}</Badge>
                    <span className="text-[10px] text-navy-500">{format(d.updatedAt, "MMM d")}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-navy-100 p-3">
          <Button variant="accent" size="sm" className="w-full">
            <Plus className="h-3.5 w-3.5" /> New document
          </Button>
        </div>
      </div>

      {active ? (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto scrollbar-thin">
          <div className="flex items-start justify-between gap-3 border-b border-navy-100 px-6 py-4">
            <div>
              <h2 className="text-[18px] font-bold tracking-tight text-navy-900">{active.title}</h2>
              <p className="text-xs text-navy-500">
                Updated {format(active.updatedAt, "MMM d, h:mm a")} · {active.type.replace("_", " ").toLowerCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Sparkles className="h-3.5 w-3.5" /> Ask Vela to rewrite
              </Button>
              <Button size="sm">Share</Button>
            </div>
          </div>
          <pre className="flex-1 whitespace-pre-wrap break-words px-6 py-5 font-sans text-[13.5px] leading-relaxed text-navy-800">
            {active.content}
          </pre>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-navy-500">
          Pick a document to view.
        </div>
      )}
    </div>
  );
}
