-- Apto Career Reality Check - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'company')),
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Profiles (student questionnaire data)
create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  questionnaire_answers jsonb default '{}',
  match_vector float8[] default '{}',
  completed_at timestamptz
);

-- Companies
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  name text not null,
  logo_url text,
  description text,
  contact_email text,
  created_at timestamptz default now()
);

-- Careers
create table if not exists public.careers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  one_liner text,
  day_in_the_life text,
  sample_schedule jsonb default '[]',
  typical_tasks text[] default '{}',
  tools text[] default '{}',
  required_skills text[] default '{}',
  salary_range jsonb default '{}',
  growth_outlook text,
  color text default '#6366f1',
  icon text default '💼',
  target_vector float8[] default '{}',
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Case Studies
create table if not exists public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  career_id uuid references public.careers(id),
  company_id uuid references public.companies(id),
  title text not null,
  brief text not null,
  rubric jsonb default '[]',
  time_minutes int not null default 45,
  difficulty text default 'intermediate' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  skills_tested text[] default '{}',
  deliverable_format text default 'text' check (deliverable_format in ('text', 'document', 'spreadsheet', 'slides')),
  created_at timestamptz default now()
);

-- Submissions
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  case_study_id uuid references public.case_studies(id),
  answer text,
  integrity_signals jsonb default '{"tab_switches": 0, "paste_count": 0, "fullscreen_exits": 0, "time_spent_seconds": 0}',
  started_at timestamptz,
  submitted_at timestamptz,
  score float,
  score_breakdown jsonb,
  status text default 'in_progress' check (status in ('in_progress', 'submitted', 'scored', 'reviewed')),
  created_at timestamptz default now()
);

-- Invitations
create table if not exists public.invitations (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references public.submissions(id),
  company_id uuid references public.companies(id),
  user_id uuid references public.users(id),
  status text default 'pending' check (status in ('pending', 'accepted', 'declined')),
  message text,
  sent_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.careers enable row level security;
alter table public.case_studies enable row level security;
alter table public.submissions enable row level security;
alter table public.invitations enable row level security;

-- Users
create policy "Users can read own" on public.users for select using (auth.uid() = id);
create policy "Users can insert own" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own" on public.users for update using (auth.uid() = id);
-- Companies can read student users for the portal
create policy "Company can read students" on public.users for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'company')
);

-- Profiles
create policy "Profiles select own" on public.profiles for select using (auth.uid() = user_id);
create policy "Profiles insert own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Profiles update own" on public.profiles for update using (auth.uid() = user_id);

-- Careers: public read
create policy "Careers public read" on public.careers for select using (true);

-- Case studies: public read
create policy "Case studies public read" on public.case_studies for select using (true);

-- Companies: public read
create policy "Companies public read" on public.companies for select using (true);

-- Submissions
create policy "Students see own submissions" on public.submissions for select using (auth.uid() = user_id);
create policy "Students create submissions" on public.submissions for insert with check (auth.uid() = user_id);
create policy "Students update own submissions" on public.submissions for update using (auth.uid() = user_id);
-- Companies can view submissions for their case studies
create policy "Companies see submissions" on public.submissions for select using (
  exists (
    select 1 from public.case_studies cs
    join public.companies c on cs.company_id = c.id
    where cs.id = case_study_id and c.user_id = auth.uid()
  )
);
-- Companies can update submissions (to mark as reviewed)
create policy "Companies update submissions" on public.submissions for update using (
  exists (
    select 1 from public.case_studies cs
    join public.companies c on cs.company_id = c.id
    where cs.id = case_study_id and c.user_id = auth.uid()
  )
);

-- Invitations
create policy "Students see own invitations" on public.invitations for select using (auth.uid() = user_id);
create policy "Companies manage invitations" on public.invitations for insert with check (
  exists (select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid())
);
create policy "Companies see invitations" on public.invitations for select using (
  exists (select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid())
);


-- ============================================
-- SEED DATA
-- ============================================

-- Company
insert into public.companies (id, name, description, contact_email, logo_url) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'TechForward', 'Building the next generation of enterprise collaboration tools. We help teams work better together through intelligent workflow automation.', 'careers@techforward.io', null);

-- Careers
-- Dimensions order: [analytical, people, creative, strategic, autonomous, risk_tolerant, collaborative, structured]
insert into public.careers (id, title, slug, description, one_liner, day_in_the_life, sample_schedule, typical_tasks, tools, required_skills, salary_range, growth_outlook, color, icon, target_vector, tags) values
(
  '11111111-1111-1111-1111-111111111111',
  'Product Manager',
  'product-manager',
  'Product Managers sit at the intersection of business, technology, and design. They define what gets built and why, prioritizing features that create the most value for users and the company.',
  'Define what gets built and why — the bridge between users, engineers, and business.',
  'Your day starts with a quick stand-up where you align the engineering team on priorities. Mid-morning, you run a user interview to validate a new feature concept. After lunch, you dig into analytics to understand a drop in activation. Then you spend an hour writing a product spec for the next sprint. You end the day in a stakeholder alignment meeting, presenting tradeoffs between two feature directions.',
  '[{"time": "9:00", "activity": "Morning stand-up with engineering team"}, {"time": "9:30", "activity": "Review metrics dashboard and overnight data"}, {"time": "10:30", "activity": "User interview / customer call"}, {"time": "11:30", "activity": "Write or update product spec"}, {"time": "13:00", "activity": "Lunch & informal 1:1 with designer"}, {"time": "14:00", "activity": "Backlog grooming and sprint planning"}, {"time": "15:30", "activity": "Stakeholder alignment meeting"}, {"time": "16:30", "activity": "Review PRDs and respond to Slack threads"}, {"time": "17:30", "activity": "Wrap up and plan tomorrow"}]',
  ARRAY['Write product requirements documents', 'Run user interviews and usability tests', 'Analyze product metrics and funnels', 'Prioritize feature backlogs', 'Present to stakeholders and leadership', 'Collaborate with engineering and design', 'Define success metrics and KPIs', 'Conduct competitive analysis'],
  ARRAY['Jira / Linear', 'Figma', 'SQL / Analytics tools', 'Notion / Confluence', 'Amplitude / Mixpanel', 'Slack'],
  ARRAY['Strategic thinking', 'Communication', 'Data analysis', 'User empathy', 'Prioritization', 'Stakeholder management', 'Technical literacy'],
  '{"min": 55000, "max": 120000, "currency": "EUR", "source": "Glassdoor 2025 estimates"}',
  'High growth — 10% YoY',
  '#6366f1',
  '🎯',
  ARRAY[0.7, 0.7, 0.6, 0.85, 0.5, 0.6, 0.8, 0.65],
  ARRAY['Product', 'Strategy', 'Tech', 'Leadership', 'Data-driven']
),
(
  '22222222-2222-2222-2222-222222222222',
  'UX Designer',
  'ux-designer',
  'UX Designers create intuitive, delightful digital experiences by deeply understanding user needs and translating them into interfaces that feel natural and solve real problems.',
  'Design intuitive digital experiences by understanding users and crafting beautiful interfaces.',
  'You start by reviewing user research findings from last week''s interviews. Then you sketch wireframes for a new checkout flow, testing three layout variations. After a design critique session with your team, you refine the high-fidelity mockups in Figma. In the afternoon, you pair with a frontend engineer to nail the interaction details.',
  '[{"time": "9:00", "activity": "Review user research notes and support tickets"}, {"time": "10:00", "activity": "Sketch wireframes and explore concepts"}, {"time": "11:30", "activity": "Design critique with the team"}, {"time": "13:00", "activity": "Lunch"}, {"time": "14:00", "activity": "High-fidelity mockups in Figma"}, {"time": "15:30", "activity": "Pair with frontend engineer on interactions"}, {"time": "16:30", "activity": "Prototype testing prep"}, {"time": "17:00", "activity": "End of day wrap-up"}]',
  ARRAY['Conduct user research and interviews', 'Create wireframes and prototypes', 'Design high-fidelity UI mockups', 'Run usability tests', 'Build and maintain design systems', 'Collaborate with product and engineering', 'Create user flows and journey maps'],
  ARRAY['Figma', 'Sketch', 'Adobe Creative Suite', 'Miro', 'Maze / UserTesting', 'Framer'],
  ARRAY['Visual design', 'User research', 'Prototyping', 'Empathy', 'Design thinking', 'HTML/CSS basics', 'Communication'],
  '{"min": 45000, "max": 95000, "currency": "EUR", "source": "Glassdoor 2025 estimates"}',
  'Strong growth — 13% YoY',
  '#ec4899',
  '🎨',
  ARRAY[0.4, 0.7, 0.9, 0.5, 0.6, 0.4, 0.7, 0.4],
  ARRAY['Design', 'Creative', 'User Research', 'Visual', 'Empathy']
),
(
  '33333333-3333-3333-3333-333333333333',
  'Data Analyst',
  'data-analyst',
  'Data Analysts turn raw data into actionable insights. They help organizations make better decisions by finding patterns, building dashboards, and communicating findings clearly.',
  'Turn raw data into insights that drive smarter decisions across the business.',
  'Your morning begins with checking automated reports and alerts for anything unusual. You then spend two hours deep in SQL, investigating why last month''s churn rate spiked. After lunch, you build a Tableau dashboard for the marketing team, and end the day presenting your churn analysis to leadership with clear recommendations.',
  '[{"time": "9:00", "activity": "Check automated reports and data alerts"}, {"time": "9:30", "activity": "Deep SQL analysis on churn data"}, {"time": "11:30", "activity": "Standup with data team"}, {"time": "12:00", "activity": "Lunch"}, {"time": "13:00", "activity": "Build marketing dashboard in Tableau"}, {"time": "15:00", "activity": "Write analysis report with recommendations"}, {"time": "16:00", "activity": "Present findings to leadership"}, {"time": "17:00", "activity": "Plan next analysis sprint"}]',
  ARRAY['Write complex SQL queries', 'Build dashboards and visualizations', 'Clean and transform datasets', 'Conduct statistical analyses', 'Present findings to stakeholders', 'Define and track KPIs', 'Automate recurring reports'],
  ARRAY['SQL', 'Python / R', 'Tableau / Power BI', 'Excel', 'Jupyter Notebooks', 'dbt', 'BigQuery / Snowflake'],
  ARRAY['SQL', 'Statistics', 'Data visualization', 'Critical thinking', 'Communication', 'Python basics', 'Business acumen'],
  '{"min": 42000, "max": 90000, "currency": "EUR", "source": "Glassdoor 2025 estimates"}',
  'Very high growth — 25% YoY',
  '#14b8a6',
  '📊',
  ARRAY[0.9, 0.3, 0.3, 0.6, 0.7, 0.3, 0.4, 0.85],
  ARRAY['Data', 'Analytics', 'SQL', 'Statistics', 'Business Intelligence']
);

-- Case Studies
insert into public.case_studies (id, career_id, company_id, title, brief, rubric, time_minutes, difficulty, skills_tested, deliverable_format) values
(
  'cs-11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Redesign the Onboarding Flow',
  'TechForward''s user activation rate dropped from 45% to 32% after launching v3.0 of their collaboration platform. The team suspects the new onboarding flow is too complex — it now has 8 steps instead of the previous 4.

Here''s what we know:
- Step 1 (Account creation): 100% → 95% completion
- Step 2 (Team setup): 95% → 78% completion
- Step 3 (Invite colleagues): 78% → 52% completion (biggest drop!)
- Step 4 (Connect integrations): 52% → 48%
- Step 5 (Customize workspace): 48% → 44%
- Step 6 (Tutorial walkthrough): 44% → 38%
- Step 7 (Create first project): 38% → 35%
- Step 8 (Activation): 35% → 32%

Additional context:
- Users who complete onboarding have 3.2x higher 30-day retention
- The "invite colleagues" step was added because collaborative users retain better
- Competitor benchmarks show 50-60% activation rates for similar tools
- Mobile users have 40% lower completion than desktop users

As a Product Manager at TechForward, write a 1-page product brief that includes:
1. Problem Analysis: Identify the biggest drop-off points and likely causes
2. Proposed Solution: Describe your redesigned onboarding approach
3. Success Metrics: Define how you''ll measure if your redesign works
4. Implementation Plan: Outline a rough timeline and key milestones

Be specific and data-driven. Show your product thinking.',
  '[{"criterion": "Problem Identification", "weight": 0.25, "description": "Correctly identifies the key drop-off points and provides plausible root cause analysis"}, {"criterion": "Solution Quality", "weight": 0.30, "description": "Proposed redesign is creative, feasible, and directly addresses the identified problems"}, {"criterion": "Metrics Definition", "weight": 0.20, "description": "Defines clear, measurable success criteria with specific targets"}, {"criterion": "Communication Clarity", "weight": 0.25, "description": "Writing is clear, structured, and demonstrates strong product thinking"}]',
  5,
  'intermediate',
  ARRAY['Problem analysis', 'Product thinking', 'Written communication', 'Metrics definition', 'Data interpretation'],
  'text'
),
(
  'cs-22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Design a Team Analytics Dashboard',
  'TechForward needs a new analytics dashboard that helps team leads understand how their teams collaborate. Currently, there''s no way for managers to see collaboration patterns, meeting load, or project progress at a glance.

Design a dashboard concept that shows:
- Team collaboration health score
- Individual contribution visibility
- Meeting time vs. deep work time
- Project progress across the team

Describe your design decisions, layout choices, and how you''d handle different screen sizes. Focus on the user experience and information hierarchy.',
  '[{"criterion": "Information Architecture", "weight": 0.30, "description": "Clear hierarchy and logical grouping of information"}, {"criterion": "User Empathy", "weight": 0.25, "description": "Design decisions reflect understanding of team lead needs"}, {"criterion": "Visual Design Thinking", "weight": 0.25, "description": "Thoughtful layout, spacing, and visual hierarchy"}, {"criterion": "Responsiveness", "weight": 0.20, "description": "Considers mobile and tablet experiences"}]',
  5,
  'intermediate',
  ARRAY['UI design', 'Information architecture', 'User empathy', 'Visual hierarchy', 'Responsive design'],
  'text'
),
(
  'cs-33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Customer Churn Analysis',
  'TechForward''s monthly churn rate increased from 3.2% to 5.1% over the last quarter. The CEO wants to understand why and what to do about it.

Here''s the data you have:
- Enterprise customers (>100 seats): churn stable at 1.2%
- Mid-market (20-100 seats): churn increased from 2.8% to 4.5%
- SMB (<20 seats): churn increased from 5.1% to 8.3%
- New pricing was introduced 4 months ago (15% increase for SMB tier)
- A major competitor launched a free tier 3 months ago
- NPS dropped from 42 to 34, driven by SMB segment
- Support ticket volume up 28% — mostly about the new UI from v3.0

Write an analysis that includes:
1. Key findings from the data
2. Root cause hypothesis (rank by likelihood)
3. Recommended actions (quick wins + strategic)
4. Metrics to track improvement

Use data to support every recommendation.',
  '[{"criterion": "Data Interpretation", "weight": 0.30, "description": "Correctly identifies patterns and segments the problem"}, {"criterion": "Root Cause Analysis", "weight": 0.25, "description": "Hypotheses are logical, ranked, and supported by data"}, {"criterion": "Actionable Recommendations", "weight": 0.25, "description": "Actions are specific, prioritized, and tied to root causes"}, {"criterion": "Communication", "weight": 0.20, "description": "Analysis is structured, clear, and executive-ready"}]',
  5,
  'intermediate',
  ARRAY['Data analysis', 'Business acumen', 'Problem solving', 'Written communication', 'Strategic thinking'],
  'text'
);
