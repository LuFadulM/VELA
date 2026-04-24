import { TopBar } from "@/components/shared/topbar";
import { ContactsView } from "@/components/contacts/contacts-view";
import { mockContacts } from "@/lib/mocks";

export default function ContactsPage() {
  const vip = mockContacts.filter((c) => c.tags.includes("vip")).length;
  return (
    <>
      <TopBar title="Contacts" subtitle={`${mockContacts.length} people · ${vip} VIPs`} />
      <ContactsView contacts={mockContacts} />
    </>
  );
}
