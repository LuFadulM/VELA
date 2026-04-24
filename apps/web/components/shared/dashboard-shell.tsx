"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { ContextPanel } from "./context-panel";
import { VelaChat } from "@/components/vela-chat/vela-chat";

/**
 * Client shell that wires the sidebar, right context panel, and the
 * always-available VelaChat overlay. Pages just render their content area
 * inside this shell — the rest is framing.
 */
export function DashboardShell({
  children,
  showContextPanel = true,
}: {
  children: React.ReactNode;
  showContextPanel?: boolean;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setChatOpen((o) => !o);
      }
      if (e.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar onAskVela={() => setChatOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
      {showContextPanel && <ContextPanel />}
      <VelaChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
