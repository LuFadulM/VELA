import type { Contact } from "@/types";

const day = 24 * 60 * 60 * 1000;

export const mockContacts: Contact[] = [
  { id: "c_01", name: "Deena Park", email: "dpark@harbor.vc", company: "Harbor Ventures", role: "Partner", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 1 * day), interactionCount: 37, tags: ["board", "vip"], notes: "Lead board member. Prefers concise, data-forward updates. Her partner Elisa handles ops — always CC." },
  { id: "c_02", name: "Ravi Sethi", email: "ravi@meridian.capital", company: "Meridian Capital", role: "Board Member", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 3 * day), interactionCount: 28, tags: ["board", "vip"], notes: "Technical background. Loves deep-dives on product strategy. Based in London." },
  { id: "c_03", name: "Aisha Patel", email: "aisha@northwind.co", company: "Northwind", role: "COO", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 2 * 60 * 60_000), interactionCount: 142, tags: ["internal", "exec"] },
  { id: "c_04", name: "Tom Vega", email: "tom@northwind.co", company: "Northwind", role: "CFO", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 5 * 60 * 60_000), interactionCount: 98, tags: ["internal", "exec"], notes: "Birthday tomorrow. Prefers oat lattes from Blue Bottle." },
  { id: "c_05", name: "Priya Shah", email: "priya@northwind.co", company: "Northwind", role: "VP Engineering", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 10 * 60 * 60_000), interactionCount: 64, tags: ["internal"] },
  { id: "c_06", name: "Miles Grant", email: "miles@northwind.co", company: "Northwind", role: "Chief of Staff", relationshipStrength: "STRONG", lastContactDate: new Date(Date.now() - 30 * 60_000), interactionCount: 210, tags: ["internal"] },
  { id: "c_07", name: "Jordan Meyer", email: "jordan@acmeco.com", company: "AcmeCo", role: "Head of Partnerships", relationshipStrength: "MEDIUM", lastContactDate: new Date(Date.now() - 1 * day), interactionCount: 11, tags: ["partner"] },
  { id: "c_08", name: "Lena Okafor", email: "lena@bluestone.law", company: "Bluestone LLP", role: "Counsel", relationshipStrength: "MEDIUM", lastContactDate: new Date(Date.now() - 2 * day), interactionCount: 19, tags: ["legal"] },
  { id: "c_09", name: "Diego Ramos", email: "d.ramos@summitpr.com", company: "Summit PR", role: "Principal", relationshipStrength: "MEDIUM", lastContactDate: new Date(Date.now() - 1 * day), interactionCount: 8, tags: ["pr"] },
  { id: "c_10", name: "Hana Kim", email: "hana@northwind.co", company: "Northwind", role: "People Ops", relationshipStrength: "MEDIUM", lastContactDate: new Date(Date.now() - 2 * day), interactionCount: 55, tags: ["internal", "hr"] },
  { id: "c_11", name: "Keiko Tanaka", email: "keiko@orionlabs.jp", company: "Orion Labs", role: "CEO", relationshipStrength: "WEAK", lastContactDate: new Date(Date.now() - 2 * 60 * 60_000), interactionCount: 3, tags: ["prospect", "partner"] },
  { id: "c_12", name: "Noah Bennett", email: "noah@forge.ai", company: "Forge AI", role: "Founder", relationshipStrength: "WEAK", lastContactDate: new Date(Date.now() - 4 * day), interactionCount: 2, tags: ["prospect"] },
];

export function getContact(id: string): Contact | undefined {
  return mockContacts.find((c) => c.id === id);
}
