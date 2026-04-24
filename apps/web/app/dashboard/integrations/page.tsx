import { TopBar } from "@/components/shared/topbar";
import { IntegrationsView } from "@/components/integrations/integrations-view";
import { mockIntegrations } from "@/lib/mocks";

export default function IntegrationsPage() {
  const connected = mockIntegrations.filter((i) => i.isActive).length;
  return (
    <>
      <TopBar title="Integrations" subtitle={`${connected} connected · 9 available`} />
      <IntegrationsView integrations={mockIntegrations} />
    </>
  );
}
