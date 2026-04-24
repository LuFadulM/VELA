/**
 * Shared domain types for Vela. These intentionally mirror the Prisma models
 * but are usable in pure client components without pulling in Prisma runtime.
 */

export type UserRole = "EA" | "OPS_MANAGER" | "OPS_ASSISTANT" | "VA";
export type CommunicationStyle = "FORMAL" | "CASUAL" | "DIRECT";
export type WorkspacePlan = "FREE" | "PRO" | "TEAMS" | "ENTERPRISE";

export type IntegrationProvider =
  | "GMAIL"
  | "OUTLOOK"
  | "GOOGLE_CALENDAR"
  | "OUTLOOK_CALENDAR"
  | "SLACK"
  | "ZOOM"
  | "GOOGLE_DRIVE"
  | "NOTION"
  | "ASANA"
  | "HUBSPOT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "WAITING" | "DONE" | "CANCELLED";
export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type TaskSource = "EMAIL" | "SLACK" | "MEETING" | "MANUAL" | "AI";

export type MeetingStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type EmailProvider = "GMAIL" | "OUTLOOK";

export type RelationshipStrength = "STRONG" | "MEDIUM" | "WEAK" | "UNKNOWN";
export type DocumentType =
  | "MEETING_NOTES"
  | "AGENDA"
  | "REPORT"
  | "TEMPLATE"
  | "BRIEF"
  | "ITINERARY";

export type RequiredAction = "reply" | "fyi" | "schedule" | "delegate" | "none";
export type Sentiment = "positive" | "neutral" | "negative" | "urgent";
export type Tone = "Professional" | "Friendly" | "Direct" | "Brief";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

export interface UserProfile {
  role: UserRole;
  communicationStyle: CommunicationStyle;
  timezone: string;
  principalName: string;
  principalRole: string;
  principalEmail: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: WorkspacePlan;
}

export interface Principal {
  id: string;
  name: string;
  role: string;
  email: string;
  preferences: { meetingStyle?: string; emailTone?: string };
}

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  isActive: boolean;
  scopes: string[];
  lastSyncAt: Date;
  account?: string;
}

export interface EmailParticipant {
  name: string;
  email: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: EmailParticipant[];
  lastMessageAt: Date;
  messageCount: number;
  urgencyScore: number;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  aiSummary: string;
  aiActionItems: { label: string; confidence: "high" | "medium" | "low" }[];
  draftReply?: string;
  tags: string[];
  provider: EmailProvider;
  preview: string;
  requiredAction: RequiredAction;
  sentiment: Sentiment;
  body: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  location?: string;
  videoLink?: string;
  attendees: EmailParticipant[];
  status: MeetingStatus;
  agenda?: AgendaItem[];
  notes?: string;
  actionItems?: ActionItem[];
  prepPackGenerated: boolean;
  followUpSent: boolean;
}

export interface AgendaItem {
  item: string;
  durationMin: number;
  owner?: string;
}

export interface ActionItem {
  title: string;
  owner?: string;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assigneeName?: string;
  sourceType: TaskSource;
  sourceId?: string;
  tags: string[];
  aiGenerated: boolean;
  subtasks: { id: string; title: string; done: boolean }[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  relationshipStrength: RelationshipStrength;
  lastContactDate: Date;
  interactionCount: number;
  tags: string[];
  notes?: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerLabel: string;
  actions: string[];
  runCount: number;
  lastRunAt: Date | null;
  errorCount: number;
}

export interface VelaDocument {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
  linkedMeetingId?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}
