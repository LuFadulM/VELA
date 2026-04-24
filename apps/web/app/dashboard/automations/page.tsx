import { TopBar } from "@/components/shared/topbar";
import { AutomationsView } from "@/components/automations/automations-view";
import { mockAutomations } from "@/lib/mocks";

export default function AutomationsPage() {
  const active = mockAutomations.filter((a) => a.isActive).length;
  return (
    <>
      <TopBar title="Automations" subtitle={`${active} active · ${mockAutomations.length} total`} />
      <AutomationsView automations={mockAutomations} />
    </>
  );
}
