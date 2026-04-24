import type { Integration, Principal, User, UserProfile, Workspace } from "@/types";

export const mockUser: User = {
  id: "user_sarah",
  name: "Sarah Chen",
  email: "sarah@northwind.co",
  avatar: "https://i.pravatar.cc/150?img=47",
};

export const mockProfile: UserProfile = {
  role: "EA",
  communicationStyle: "DIRECT",
  timezone: "America/New_York",
  principalName: "Marcus Webb",
  principalRole: "CEO",
  principalEmail: "marcus@northwind.co",
};

export const mockWorkspace: Workspace = {
  id: "ws_northwind",
  name: "Northwind — Office of the CEO",
  slug: "northwind",
  plan: "PRO",
};

export const mockPrincipal: Principal = {
  id: "principal_marcus",
  name: "Marcus Webb",
  role: "CEO, Northwind",
  email: "marcus@northwind.co",
  preferences: { meetingStyle: "brief_and_agenda_driven", emailTone: "direct" },
};

const day = 24 * 60 * 60 * 1000;

export const mockIntegrations: Integration[] = [
  {
    id: "int_gmail",
    provider: "GMAIL",
    isActive: true,
    scopes: ["gmail.read", "gmail.send"],
    lastSyncAt: new Date(Date.now() - 4 * 60_000),
    account: "sarah@northwind.co",
  },
  {
    id: "int_gcal",
    provider: "GOOGLE_CALENDAR",
    isActive: true,
    scopes: ["calendar.events"],
    lastSyncAt: new Date(Date.now() - 2 * 60_000),
    account: "sarah@northwind.co",
  },
  {
    id: "int_slack",
    provider: "SLACK",
    isActive: true,
    scopes: ["chat:write", "channels:read"],
    lastSyncAt: new Date(Date.now() - 7 * 60_000),
    account: "Northwind workspace",
  },
  {
    id: "int_zoom",
    provider: "ZOOM",
    isActive: false,
    scopes: [],
    lastSyncAt: new Date(Date.now() - 14 * day),
  },
  {
    id: "int_notion",
    provider: "NOTION",
    isActive: false,
    scopes: [],
    lastSyncAt: new Date(Date.now() - 30 * day),
  },
];
