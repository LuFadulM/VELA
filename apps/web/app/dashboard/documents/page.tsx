import { TopBar } from "@/components/shared/topbar";
import { DocumentsView } from "@/components/documents/documents-view";
import { mockDocuments } from "@/lib/mocks";

export default function DocumentsPage() {
  const aiGenerated = mockDocuments.length;
  return (
    <>
      <TopBar title="Documents" subtitle={`${aiGenerated} docs · templates + auto-generated`} />
      <DocumentsView docs={mockDocuments} />
    </>
  );
}
