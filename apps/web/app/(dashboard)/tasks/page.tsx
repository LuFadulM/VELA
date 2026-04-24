import { TopBar } from "@/components/shared/topbar";
import { TaskBoard } from "@/components/tasks/task-board";
import { mockTasks } from "@/lib/mocks";

export default function TasksPage() {
  const open = mockTasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;
  const urgent = mockTasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE").length;
  return (
    <>
      <TopBar title="Tasks" subtitle={`${open} open · ${urgent} urgent`} />
      <TaskBoard tasks={mockTasks} />
    </>
  );
}
