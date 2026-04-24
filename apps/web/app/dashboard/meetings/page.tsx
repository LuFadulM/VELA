import { TopBar } from "@/components/shared/topbar";
import { MeetingsView } from "@/components/meetings/meetings-view";
import { mockMeetings } from "@/lib/mocks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MeetingsPage() {
  const upcoming = mockMeetings.filter((m) => m.startTime >= new Date()).length;
  return (
    <>
      <TopBar
        title="Meetings"
        subtitle={`${upcoming} upcoming · prep packs on demand`}
        actions={
          <Button variant="accent" size="sm">
            <Plus className="h-3.5 w-3.5" /> New meeting
          </Button>
        }
      />
      <MeetingsView meetings={mockMeetings} />
    </>
  );
}
