import { TopBar } from "@/components/shared/topbar";
import { InboxView } from "@/components/inbox/inbox-view";
import { mockEmailThreads } from "@/lib/mocks";

export default function InboxPage() {
  const unread = mockEmailThreads.filter((t) => !t.isRead).length;
  const urgent = mockEmailThreads.filter((t) => t.urgencyScore >= 8).length;

  return (
    <>
      <TopBar
        title="Inbox"
        subtitle={`${unread} unread · ${urgent} urgent`}
      />
      <InboxView threads={mockEmailThreads} />
    </>
  );
}
