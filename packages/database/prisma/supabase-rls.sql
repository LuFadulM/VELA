-- =============================================================================
-- Supabase RLS policies for Vela
-- =============================================================================
--
-- Run AFTER `pnpm db:push` has created the Prisma tables. Apply via:
--
--   psql "$DIRECT_URL" -f packages/database/prisma/supabase-rls.sql
--
-- or paste the file contents into the Supabase SQL Editor.
--
-- The model: every Vela row belongs to a Workspace, and every User belongs to
-- one or more Workspaces via WorkspaceMember.role. Authenticated users can
-- only read/write rows in workspaces they're a member of. Service role
-- bypasses RLS automatically (used by cron + server-side admin tasks).
-- =============================================================================

-- ---- helpers ----------------------------------------------------------------

create or replace function public.is_workspace_member(workspace_id text)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from "WorkspaceMember" wm
    where wm."workspaceId" = workspace_id
      and wm."userId" = auth.uid()::text
  );
$$;

-- ---- enable RLS on every table ---------------------------------------------

alter table "User"             enable row level security;
alter table "UserProfile"      enable row level security;
alter table "Workspace"        enable row level security;
alter table "WorkspaceMember"  enable row level security;
alter table "Principal"        enable row level security;
alter table "PrincipalContact" enable row level security;
alter table "Integration"      enable row level security;
alter table "Task"             enable row level security;
alter table "Subtask"          enable row level security;
alter table "Meeting"          enable row level security;
alter table "EmailThread"      enable row level security;
alter table "Automation"       enable row level security;
alter table "Contact"          enable row level security;
alter table "Document"         enable row level security;
alter table "Notification"     enable row level security;

-- ---- User / UserProfile / Notification: self-only --------------------------

create policy "User: self read"
  on "User" for select using (id = auth.uid()::text);
create policy "User: self update"
  on "User" for update using (id = auth.uid()::text);

create policy "UserProfile: self read"
  on "UserProfile" for select using ("userId" = auth.uid()::text);
create policy "UserProfile: self upsert"
  on "UserProfile" for all using ("userId" = auth.uid()::text)
                   with check ("userId" = auth.uid()::text);

create policy "Notification: self read"
  on "Notification" for select using ("userId" = auth.uid()::text);
create policy "Notification: self update"
  on "Notification" for update using ("userId" = auth.uid()::text);

-- ---- Workspace + members ---------------------------------------------------

create policy "Workspace: members read"
  on "Workspace" for select using (public.is_workspace_member(id));

create policy "WorkspaceMember: self read"
  on "WorkspaceMember" for select using ("userId" = auth.uid()::text);

create policy "WorkspaceMember: members read all in workspace"
  on "WorkspaceMember" for select using (public.is_workspace_member("workspaceId"));

-- ---- Workspace-scoped resources -------------------------------------------
-- Reusable pattern: read/write allowed iff the row's workspace contains the
-- caller as a member. We expand this for each table.

create policy "Principal: workspace members"
  on "Principal" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "PrincipalContact: via principal"
  on "PrincipalContact" for all
  using (
    exists (
      select 1 from "Principal" p
      where p.id = "PrincipalContact"."principalId"
        and public.is_workspace_member(p."workspaceId")
    )
  )
  with check (
    exists (
      select 1 from "Principal" p
      where p.id = "PrincipalContact"."principalId"
        and public.is_workspace_member(p."workspaceId")
    )
  );

create policy "Integration: workspace members"
  on "Integration" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "Task: workspace members"
  on "Task" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "Subtask: via task"
  on "Subtask" for all
  using (
    exists (
      select 1 from "Task" t
      where t.id = "Subtask"."taskId"
        and public.is_workspace_member(t."workspaceId")
    )
  )
  with check (
    exists (
      select 1 from "Task" t
      where t.id = "Subtask"."taskId"
        and public.is_workspace_member(t."workspaceId")
    )
  );

create policy "Meeting: workspace members"
  on "Meeting" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "EmailThread: workspace members"
  on "EmailThread" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "Automation: workspace members"
  on "Automation" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "Contact: workspace members"
  on "Contact" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

create policy "Document: workspace members"
  on "Document" for all
  using (public.is_workspace_member("workspaceId"))
  with check (public.is_workspace_member("workspaceId"));

-- ---- Realtime ---------------------------------------------------------------
-- Enable replication on Notification so the in-app context panel
-- updates live (lib/supabase/realtime.ts subscribes to inserts).

alter publication supabase_realtime add table "Notification";

-- =============================================================================
-- Done. Test with: select * from "Task"; from a logged-in session — you
-- should see only rows in your own workspaces. From the service role you'll
-- still see everything (RLS bypassed by design).
-- =============================================================================
