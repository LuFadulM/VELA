"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./client";
import type { Notification } from "@/types";

/**
 * Subscribe to realtime notification inserts for the current user.
 *
 * The Supabase free plan includes Realtime — turn it on for the
 * `notifications` table and Vela will pick up new rows live. When
 * Supabase isn't configured, the hook silently no-ops and the caller
 * can fall back to mock data. When configured, the hook keeps a
 * locally-merged list so the UI feels instant.
 */
export function useRealtimeNotifications(initial: Notification[]) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    let channelName = "";
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || !active) return;

      channelName = `vela:notifications:${data.user.id}`;
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${data.user.id}`,
          },
          (payload) => {
            const row = payload.new as {
              id: string;
              type: string;
              title: string;
              body: string;
              isRead: boolean;
              createdAt: string;
            };
            setNotifications((prev) => [
              {
                id: row.id,
                type: row.type,
                title: row.title,
                body: row.body,
                isRead: row.isRead,
                createdAt: new Date(row.createdAt),
              },
              ...prev,
            ]);
          },
        )
        .subscribe();

      // Capture for cleanup.
      (channel as unknown as { _vela_channel: typeof channel })._vela_channel = channel;
    })();

    return () => {
      active = false;
      if (!channelName) return;
      supabase.removeAllChannels();
    };
  }, []);

  return notifications;
}
