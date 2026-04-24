import { TopBar } from "@/components/shared/topbar";
import { CalendarView } from "@/components/calendar/calendar-view";
import { mockMeetings } from "@/lib/mocks";

export default function CalendarPage() {
  const todaysCount = mockMeetings.filter((m) => {
    const today = new Date();
    return (
      m.startTime.getFullYear() === today.getFullYear() &&
      m.startTime.getMonth() === today.getMonth() &&
      m.startTime.getDate() === today.getDate()
    );
  }).length;
  return (
    <>
      <TopBar title="Calendar" subtitle={`${todaysCount} meeting${todaysCount === 1 ? "" : "s"} today`} />
      <CalendarView meetings={mockMeetings} />
    </>
  );
}
