import type { Meeting } from "@/types";

const day = 24 * 60 * 60 * 1000;

function at(offsetDays: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export const mockMeetings: Meeting[] = [
  {
    id: "m_001",
    title: "Exec sync",
    description: "Weekly exec team cadence — wins, risks, decisions.",
    startTime: at(0, 9),
    endTime: at(0, 10),
    timezone: "America/New_York",
    videoLink: "https://zoom.us/j/north-exec",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Aisha Patel", email: "aisha@northwind.co" },
      { name: "Tom Vega", email: "tom@northwind.co" },
      { name: "Priya Shah", email: "priya@northwind.co" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: true,
    followUpSent: false,
    agenda: [
      { item: "Business updates (round robin)", durationMin: 20 },
      { item: "Hiring decisions — Sr PM + 2 Eng", durationMin: 15, owner: "Priya Shah" },
      { item: "Board meeting readiness", durationMin: 15, owner: "Sarah Chen" },
      { item: "Open items & blockers", durationMin: 10 },
    ],
  },
  {
    id: "m_002",
    title: "1:1 — Priya Shah",
    startTime: at(0, 14),
    endTime: at(0, 14, 30),
    timezone: "America/New_York",
    videoLink: "https://zoom.us/j/priya-1on1",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Priya Shah", email: "priya@northwind.co" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: true,
    followUpSent: false,
    agenda: [
      { item: "Hiring pipeline update", durationMin: 10 },
      { item: "Platform reliability — post-incident", durationMin: 15 },
      { item: "Team morale read", durationMin: 5 },
    ],
  },
  {
    id: "m_003",
    title: "Board pre-read review",
    startTime: at(1, 10),
    endTime: at(1, 10, 45),
    timezone: "America/New_York",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Deena Park", email: "dpark@harbor.vc" },
      { name: "Ravi Sethi", email: "ravi@meridian.capital" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: false,
    followUpSent: false,
  },
  {
    id: "m_004",
    title: "Orion Labs — partnership deep dive",
    startTime: at(2, 15),
    endTime: at(2, 16),
    timezone: "America/New_York",
    videoLink: "https://zoom.us/j/orion-partners",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Keiko Tanaka", email: "keiko@orionlabs.jp" },
      { name: "Aisha Patel", email: "aisha@northwind.co" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: true,
    followUpSent: false,
    agenda: [
      { item: "Market fit recap", durationMin: 15 },
      { item: "Integration scope & technical boundaries", durationMin: 25 },
      { item: "Commercial terms — high level", durationMin: 15 },
      { item: "Next steps & timeline", durationMin: 5 },
    ],
  },
  {
    id: "m_005",
    title: "AcmeCo renewal call",
    startTime: at(3, 11),
    endTime: at(3, 11, 30),
    timezone: "America/New_York",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Jordan Meyer", email: "jordan@acmeco.com" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: false,
    followUpSent: false,
  },
  {
    id: "m_006",
    title: "Board meeting — Q3",
    startTime: at(4, 9),
    endTime: at(4, 12),
    timezone: "America/New_York",
    location: "HQ Boardroom",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Deena Park", email: "dpark@harbor.vc" },
      { name: "Ravi Sethi", email: "ravi@meridian.capital" },
      { name: "Aisha Patel", email: "aisha@northwind.co" },
      { name: "Tom Vega", email: "tom@northwind.co" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: true,
    followUpSent: false,
    agenda: [
      { item: "CEO report", durationMin: 30, owner: "Marcus Webb" },
      { item: "Financials deep dive", durationMin: 45, owner: "Tom Vega" },
      { item: "Operating metrics", durationMin: 30, owner: "Aisha Patel" },
      { item: "Strategic discussion — Europe", durationMin: 45 },
      { item: "Executive session", durationMin: 30 },
    ],
  },
  {
    id: "m_007",
    title: "Offsite planning sync",
    startTime: at(7, 13),
    endTime: at(7, 13, 45),
    timezone: "America/New_York",
    attendees: [
      { name: "Sarah Chen", email: "sarah@northwind.co" },
      { name: "Miles Grant", email: "miles@northwind.co" },
      { name: "Hana Kim", email: "hana@northwind.co" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: false,
    followUpSent: false,
  },
  {
    id: "m_008",
    title: "TechCrunch fireside",
    startTime: at(9, 16),
    endTime: at(9, 16, 30),
    timezone: "America/New_York",
    attendees: [
      { name: "Marcus Webb", email: "marcus@northwind.co" },
      { name: "Natasha Ramirez (TC)", email: "natasha@techcrunch.com" },
      { name: "Diego Ramos", email: "d.ramos@summitpr.com" },
    ],
    status: "SCHEDULED",
    prepPackGenerated: false,
    followUpSent: false,
  },
];

export function getMeeting(id: string): Meeting | undefined {
  return mockMeetings.find((m) => m.id === id);
}
