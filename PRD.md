# PRD — Career Reality Check (working title)

**Event:** START Unicorn Lisbon Hackathon
**Author:** Taito
**Last updated:** 2026-04-24
**Status:** Draft v0.1 — 22 hours to deadline
**Primary user:** Undergraduate students (secondary: high school, grad)

---

## 1. One-liner

A guided career-exploration platform that closes the information gap between what students *think* a job is and what the work *actually looks like* — by letting them solve real case studies from real companies, with the best solvers routed directly to those companies for recruitment.

## 2. Problem statement

Students pick majors and first jobs with almost no idea what the day-to-day work feels like. Career tests tell them "you'd be good at marketing" without ever showing them a real marketing brief. Internships are the only real signal, but they're gated, scarce, and often chosen *after* the major is locked in.

Meanwhile, companies spend heavily on early-career funnels (career fairs, employer branding, graduate programs) and still complain that new hires arrive with unrealistic expectations and mismatched skills.

**Two broken markets, same root cause:** students can't preview the work, companies can't preview the student's work.

## 3. Vision

A student signs up. In 15 minutes they know three careers that likely fit them. In 45 minutes they've tried a real problem from a real company in one of those careers. In a week, if they were good, they have an interview invite in their inbox.

## 4. Target users & personas

**Primary — "Undecided Una" (undergrad, year 1–2)**
Picked a major vaguely related to her interests. Scrolls LinkedIn and feels behind. Has taken three "what career fits you" quizzes and trusts none of them. Would do a real case study for a real company tonight if it meant something.

**Secondary — "Exploring Emre" (high school, year 11–12)**
Choosing a university and a major. Parents push medicine or law. Wants evidence, not opinions.

**Secondary — "Pivoting Priya" (grad student / early career)**
Considering a switch. Needs to test the water before committing to a second degree or bootcamp.

**The other side — "Recruiter Rui" (company early-careers lead)**
Spends €X thousand per hire at the entry level. Would pay real money for a pipeline of students who have *already demonstrated* they can solve his team's problems.

## 5. Goals & success metrics

**Hackathon goals (judging)**
- Judges understand the loop in ≤60 seconds.
- Live demo completes one end-to-end flow without errors.
- At least one "wow" moment (case study is real, company logo is real, submission pipeline is visible).

**Post-hackathon goals (North Star metrics)**
- *North Star:* weekly active case-study submissions.
- Activation: % of signups that complete the questionnaire (target: 70%).
- Engagement: % of matched students who start ≥1 case study (target: 30%).
- Quality: % of submissions that receive a company response (target: 10% — this is the promise of the product).
- Supply-side: number of companies with ≥1 live case study.

## 6. Scope for hackathon MVP

**Your call: "Full breadth, shallow."** Every feature visible, nothing production-grade.

**In scope (everything at demo-quality, not production-quality):**
1. Landing page with clear value prop.
2. Sign-up / light auth (magic link or Google OAuth).
3. **CV upload (optional on sign-up) — parsed to pre-fill profile, enrich matching, and attach to submissions.**
4. Interest & values questionnaire (8–12 questions).
5. Career matching screen — 3–5 suggested careers.
6. Career detail page — day-in-the-life, salary ranges, skills, sample tasks.
7. Case study library tied to each career (2–3 seeded case studies per demo career).
8. Exam / proctored solve environment (lockdown-lite — see §12).
9. Submission & review flow.
10. Student dashboard — applications, invitations received.

**Stretch (only if the student flow is fully running):**
- **Company login / hiring portal** — companies can sign in, see the full list of students who completed their case study, filter/sort by score and integrity signals, view CVs, and send interview invites. (Expanded in §10.8.)

**Out of scope for hackathon**
- Payments / monetization.
- Real proctoring (webcam + ID) — mocked.
- Real grading by company humans — mocked with a fake reviewer.
- Multi-language content.
- Mobile native apps (web-responsive only; see §9).

> **PM note — honest input:** "Full breadth, shallow" is the riskiest demo strategy for a hackathon. Judges remember one thing that works end-to-end, not seven things that half-work. I'd push back and recommend **Plan B** below. Decide with your team within the first 2 hours.

### Plan B — Narrow & Deep (recommended)
Ship the **full loop for ONE career** (e.g. Product Manager or Marketing Analyst). 10-question quiz → 1 strong career match → 1 real case study from a real (or convincingly seeded) company → exam mode with a timer and anti-paste → submission → mocked company invite in the dashboard. Everything else is wireframes in the deck. **Higher hit rate with judges, lower build risk.**

## 7. Key differentiators (judge pitch)

Ordered by your call:

1. **Real company case studies.** Not generic "marketing scenario #4." A real brief from a real (or at minimum, clearly named and plausible) partner. The authenticity is the moat.
2. **Company-to-student pipeline.** The exam isn't the end — the best solutions are forwarded to the company, which can invite the student to interview. Flips job discovery: *prove first, apply never*.
3. Supporting: proctored exam (trust), interest-based matching (personalization).

## 8. End-to-end user journey

```
Landing → Sign up → [Optional: CV upload → auto-parse profile]
                                           ↓
                                     Questionnaire
                                           ↓
                             Match results (3-5 careers)
                                           ↓
                                   Career detail page
                                           ↓
                                   Browse case studies
                                           ↓
                               Start case study (exam mode)
                                           ↓
                                   Submit solution
                                           ↓
                              Solution scored / reviewed
                                           ↓
                   Top solutions → forwarded to company → invite
                                           ↓
                              Student dashboard: "You're invited by Acme Corp"

Parallel (stretch): Company login → Submissions dashboard → Filter/sort → Invite
```

## 9. Platform & non-functional requirements

- **Multiplatform** = responsive web (desktop + tablet + mobile browser). No native apps in MVP.
- Browser support: latest Chrome, Safari, Firefox, Edge.
- Target page-load: < 2s on a mid-tier laptop for demo.
- Auth: magic link or Google OAuth — no password management.
- GDPR-aware: minimal PII (name, email, answers). Cookie banner.
- Accessibility: WCAG 2.1 AA target for post-hackathon; for MVP, hit keyboard-nav + sufficient contrast.

## 10. Feature requirements (functional)

### 10.1 CV upload & profile pre-fill

- Prompt shown right after sign-up: "Have a CV? Upload it and we'll pre-fill your profile." Skippable.
- Accepted formats: PDF, DOCX. Max 5 MB.
- Parsing: extract name, education, experience, skills, languages.
  - **MVP:** LLM-based extraction (OpenAI/Anthropic) → structured JSON.
  - **V2:** deterministic parser (e.g. Affinda / Sovren) for reliability at scale.
- Parsed fields pre-fill a lightweight profile screen the student can edit before continuing.
- CV raw file is stored in Supabase Storage; reference saved on `profiles.cv_url`.
- Skills extracted from the CV are used as **additional signal in the matching engine** (weighted lower than questionnaire answers).
- CV is automatically attached to every case-study submission the student makes (companies see it alongside the solution).
- GDPR: upload is optional, explicit consent copy, delete-on-request flow.

### 10.2 Questionnaire
- 8–12 questions, mix of single-select, multi-select, and slider.
- Dimensions covered: interests, work-life balance preference, autonomy vs. structure, people vs. systems, risk tolerance, creative vs. analytical, indoor/outdoor, team size.
- Progress bar. Back button. Save-on-exit.
- Output: a vector of scores per dimension.

### 10.3 Matching engine
- **MVP:** rules-based. Each career has a target vector; match = cosine similarity or weighted score. Return top 3–5.
- Inputs: questionnaire answers (primary signal) + CV-extracted skills/experience (secondary signal, if uploaded).
- **V2:** ML / embedding-based, retrained on outcomes.
- Every match shows a "why this matched" explanation ≥ 2 sentences.

### 10.4 Career detail page
- Hero: title, one-line description, match score.
- Day-in-the-life section (narrative + sample schedule).
- Typical tasks, tools, required skills.
- Salary / growth data (sourced; cited).
- Call-to-action: "Try a real case study from [Company]."

### 10.5 Case study library
- Each case study: company, title, estimated time, difficulty, skills tested, deliverable format (doc / slide / spreadsheet / short answer).
- Seeded for hackathon: 2–3 case studies, ideally from real companies — even if the "real" is a hackathon sponsor or a company you have permission to reference.

### 10.6 Exam / proctored environment
See §12 for anti-cheat approach. Functional requirements:
- Full-screen lockable mode.
- Countdown timer.
- Auto-save every 10 seconds.
- Submit button disabled until minimum time or completion.
- Rich-text answer editor; optional file upload for spreadsheets/slides.

### 10.7 Submission & grading
- On submit: store solution, timestamp, and "integrity signals" (tab switches, paste count, time-on-task).
- **MVP grading:** rubric-based; LLM auto-scores a first pass and flags top 10% for company review. (Yes, we use AI to grade but not to *solve*.)
- Company review panel: ranked list of top submissions with integrity signals visible.

### 10.8 Company portal / hiring dashboard (stretch — only if student flow is fully working)

Purpose: give companies a reason to publish case studies by turning submissions into a talent pipeline they actually want to use.

- **Separate auth role** (`role=company`), invite-only at MVP (no self-serve company sign-up).
- **Submissions list view** — every student who completed the company's case study:
  - Student name, match score, submission score (auto-scored), time-on-task.
  - Integrity signals (tab switches, paste events, full-screen exits) shown as small badges.
  - Attached CV (if uploaded) and the full submission.
  - Filters: minimum score, has-CV, top 10% only.
  - Sort: by score, by date, by match-with-career.
- **Candidate detail page** — everything about the student in one view: solution, CV, questionnaire highlights, integrity report.
- **Invite action** — one-click "Send interview invite." Creates a notification in the student's dashboard + sends an email. No scheduling in MVP; the company's contact goes into the email.
- **Privacy boundary:** companies only see students who completed THEIR case studies. Cross-company discovery is explicitly out of scope for hackathon (avoids a whole privacy conversation).

> **Hackathon staging:** if time runs short, mock this as a single static screen seeded with the demo student's submission. Even a static screen is enough to land the "company-to-student pipeline" narrative with judges.

### 10.9 Student dashboard
- My profile and match history.
- Submissions (in-progress, submitted, scored).
- Invitations received.

## 11. Technical architecture

**Recommended stack: Next.js 14 (App Router) + Supabase.**
- Next.js handles web + responsive across platforms in one codebase.
- Supabase: Postgres + auth + storage + row-level security (RLS) — covers 90% of backend with zero DevOps.
- Hosting: Vercel (students) + Supabase (data).
- Optional: OpenAI/Anthropic API for (a) match explanations, (b) auto-scoring of case-study submissions.

**Why not Firebase:** works fine, but Supabase + Postgres gives you SQL for the matching and analytics queries you'll want to show a judge ("here's our match logic, in one query"). Pick Firebase only if the team is already fluent in it.

**Multiplatform** is satisfied by responsive web. Native mobile is post-MVP.

## 12. Anti-cheat / proctoring approach

Philosophy: the *goal* is self-discovery, not certification. So you need *enough* anti-cheat to make the submissions credible to companies, not airtight proctoring.

**MVP anti-cheat (demo-quality):**
- Full-screen mode; log when user exits full-screen.
- Detect tab visibility change; log count.
- Disable paste on the answer editor, or count paste events and display them to reviewers.
- Keystroke-rate sanity check (paste-dump detection).
- Timer that keeps running even if tab closed.
- Honor code checkbox at start.

**Post-MVP:**
- Webcam proctoring (MediaRecorder + flagging).
- Second-device pairing for ID check.
- AI-text detection on written answers (with caveats — unreliable).

## 13. Data model (sketch)

```
users            (id, role=student|company, email, name, created_at)
profiles         (user_id, questionnaire_answers jsonb, match_vector vector,
                  cv_url text, cv_parsed jsonb, cv_skills text[])
careers          (id, title, description, tags[], target_vector vector)
case_studies     (id, career_id, company_id, title, brief, rubric, time_minutes)
companies        (id, name, logo_url, contact_email)
company_users    (id, user_id, company_id, role)   -- maps login accounts to a company
submissions      (id, user_id, case_study_id, answer, integrity_signals jsonb,
                  score, status, cv_snapshot_url)
invitations      (id, submission_id, company_id, user_id, status, sent_at, message)
```

Storage:
- Supabase Storage bucket `cvs/` with RLS — owner-only read by default; company read-through grant when a submission references it.

## 14. Content strategy — the hardest non-engineering problem

Your differentiator is real case studies from real companies. So:

- For the hackathon: identify 1–3 companies you can credibly name. Best options, in order: (a) a hackathon sponsor who will let you reference them, (b) a past employer you've talked to, (c) a public case competition brief that is already public (attribute it). Do NOT fabricate a company logo you don't have rights to.
- Write the briefs in the real tone of the company (short, specific, deliverable-driven).
- For v2: build a "submit a case study" flow for companies; incentivize with "get 100 pre-screened early-career applicants."

**Action for Taito:** pick the 1 case study you'll demo. This decision drives the whole demo narrative.

## 15. Business model (post-hackathon)

- **Students:** free forever.
- **Companies:** tiered subscription for access to the submission pipeline + filtering + branded case studies. Pricing benchmarks: Handshake, Ripplematch, Forage (all reference points, not comps).
- **Possible side revenue:** premium career reports for students, affiliate links to courses.

Do not pitch pricing to judges. Pitch the two-sided network.

## 16. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| "Full breadth shallow" demo breaks live | High | Fatal | Plan B narrow-deep; always have a pre-recorded 45s video backup |
| No real company partners by demo | High | High | Get written permission from 1 sponsor today; fall back to a publicly available case |
| Anti-cheat is janky and judges notice | Medium | Medium | Be upfront: "MVP anti-cheat; here's the production roadmap" |
| Matching feels random | Medium | High | Hand-tune the matching for the 1 demo persona the judge will play |
| Team can't ship 10 surfaces | High | High | Ruthless cut list every 3 hours |

## 17. 22-hour build plan

| Hour | Milestone |
|---|---|
| 0–1 | Lock scope (MVP vs Plan B). Assign roles. Repo + deploy pipeline up. |
| 1–3 | Data model in Supabase; auth working; landing page deployed. |
| 3–6 | Questionnaire flow + submit; static career detail template; **CV upload + LLM parse → profile pre-fill**. |
| 6–9 | Matching logic (hand-tuned for demo); 3 careers seeded. |
| 9–12 | 1 case study seeded end-to-end; exam mode v0 (full-screen + timer + paste count). |
| 12–14 | Submission → storage → mocked auto-score. |
| 14–16 | Student dashboard + invitation flow. **Company portal / hiring dashboard ONLY if student flow is fully green — otherwise stub with static screen**. |
| 16–18 | Polish: copy, empty states, error states, loading states. |
| 18–20 | Record backup demo video. Rehearse 2-minute pitch. |
| 20–21 | Bug bash. |
| 21–22 | Freeze. Eat. Rehearse again. |

## 18. Demo narrative (2 minutes)

1. **Problem (20s):** "Students pick careers blind. Companies pay millions recruiting people who don't know what the work is."
2. **Loop (40s):** Live walk-through. "Meet Una. 8 questions. Three career matches. One real case study from [Company]. She solves it in exam mode. Her solution gets scored. Top solutions go to [Company]."
3. **Wow (20s):** Show the invite landing in the student dashboard. "That's the flip: prove first, apply never."
4. **Business (20s):** Free for students, subscription for companies. Two-sided network.
5. **Ask (20s):** What you want from judges (feedback, sponsor intros, prize).

## 19. Open questions (need answers within 2 hours)

1. Which 1 career and which 1 case study will drive the demo?
2. Which company name appears on that case study, and do you have permission?
3. Team size and skills — who owns frontend, backend, design, pitch?
4. Next.js+Supabase or React+Firebase — pick one before hour 1 ends.
5. Plan A (full breadth shallow) or Plan B (narrow & deep)?
6. Will submissions be scored by LLM auto-score only, or will you hand-score 1–2 live for the demo?
7. CV parsing: LLM-based (fast but fuzzy) or deterministic parser (slow to set up)? Recommend LLM for hackathon.
8. Company portal: real interactive hiring dashboard, or a single static screen seeded with the demo submission? Trigger is whether the student flow finishes by hour 14.

## 20. Appendix — rough competitive landscape

- **Forage** — virtual job simulations from real companies. Closest comparable. Differentiator vs them: matching layer + direct student→company invites.
- **Handshake / Ripplematch** — student-to-company marketplaces. No case studies. Differentiator: signal, not just listings.
- **16personalities / career quizzes** — personality-only, no work sample. Differentiator: real work, real outcomes.
- **CaseCoach / Management Consulted** — case prep, but paid and consulting-only.

---

## Next steps I'd take right now if I were on your team

1. Walk this PRD to the team and force a 30-minute decision meeting on the 6 open questions in §19.
2. Pick the 1 case study + 1 company. Email/DM a sponsor for permission *today*.
3. Commit to Plan A or Plan B and cut ruthlessly from there.
4. Start the build plan in §17 — the clock is already running.
