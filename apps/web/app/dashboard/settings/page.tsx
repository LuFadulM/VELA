import { TopBar } from "@/components/shared/topbar";
import { SettingsView } from "@/components/settings/settings-view";
import { mockUser, mockProfile, mockWorkspace, mockPrincipal } from "@/lib/mocks";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle={mockWorkspace.name} />
      <SettingsView
        user={mockUser}
        profile={mockProfile}
        workspace={mockWorkspace}
        principal={mockPrincipal}
      />
    </>
  );
}
