import type { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "n_01",
    type: "urgent_email",
    title: "Urgent email from Deena Park",
    body: "Re: Q3 board pre-read — needs reply by EOD.",
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60_000),
  },
  {
    id: "n_02",
    type: "meeting_starting",
    title: "Exec sync in 15 minutes",
    body: "Prep pack is ready — 4 agenda items, 3 decisions to make.",
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60_000),
  },
  {
    id: "n_03",
    type: "task_overdue",
    title: "Task overdue: Approve Senior PM offer",
    body: "Competing offer expires Friday. Draft reply ready for Marcus.",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60_000),
  },
  {
    id: "n_04",
    type: "automation_ran",
    title: "Automation ran: Weekly Ops Briefing",
    body: "Generated briefing for this week.",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60_000),
  },
];
