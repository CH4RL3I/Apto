# PRD — Career Reality Check (working title)

**Event:** START Unicorn Lisbon Hackathon
**Author:** Taito
**Last updated:** 2026-04-24
**Status:** Draft v0.2 — 22 hours to deadline
**Primary user:** DACH undergraduate students interested in startups, tech, and Mittelstand roles
**Initial market:** Germany, Austria, Switzerland (DE + EN at launch)

---

## 1. One-liner

**Don't apply to jobs. Prove yourself, and jobs apply to you.**

A DACH-first career platform where undergrads solve real, proctored work samples from European startups and Mittelstand companies. Top performers don't get a certificate — they get an interview invite in their inbox. The work sample replaces the cover letter.

## 1b. Why we win (vs the live competitive set)

| Competitor | What they do | Where we win |
|---|---|---|
| **Forage** (US/UK, 5M students, 125+ employers) | Self-paced simulations from bulge-bracket employers (Citi, JPM, BCG). Outcome: certificate. English-only. | German-language. Startup + Mittelstand brand roster instead of bulge-bracket. **Hireable** outcome (interview invite), not just a certificate. Match-first UX vs. browse-and-pick catalog. |
| **whatchado** (Vienna, DACH-native) | 6,200+ video stories of professionals describing their daily work. Passive consumption. | Active, not passive: students *do* the work, not watch others describe it. Submissions become a hiring signal whatchado doesn't generate. |
| **Deeplo AI** (EU, emerging) | AI-designed simulations as a hiring funnel for companies. | Explicitly student-first product, not an HR tool. Match-first orientation flow that exists *before* the simulation. Trust layer (proctoring) makes our signal credible without becoming a recruitment platform. |
| **JobTeaser** (Paris, 800+ universities) | University-integrated job board with company profiles. Pivoted away from career-insight content. | Doesn't simulate work. We could even be a content/assessment partner for them long-term. |
| **Springpod / GradSims / Shortlist** (UK) | UK-only simulation platforms tied to UK university career services. | DACH distribution, German content, EU GDPR-native. They don't compete here. |
| **berufswahlapp / Check-U** (DE government) | Free, school-focused career orientation quizzes. No work sample. | Different audience (school vs. university), different mechanic (quiz vs. work product). Possible future partner, not a competitor. |

## 2. Problem statement

> **The user is the student. The customer is the company.** This PRD treats both seriously, but the company-side value is what makes this a business — see §5b.

**Student side.** Students pick majors and first jobs with almost no idea what the day-to-day work feels like. Career tests tell them "you'd be good at marketing" without ever showing them a real marketing brief. Internships are the only real signal, but they're gated, scarce, and often chosen *after* the major is locked in.

**Company side — the bigger pain, with a budget attached.** A DACH startup or Mittelstand recruiter trying to hire a junior PM, growth marketer, or data analyst is spending **€5,000–15,000 per hire** across LinkedIn ads, agency fees, internal screening, and senior-staff interview time. **30–40% of those hires churn or underperform inside 12 months** because expectations didn't match reality. They get hundreds of decorated CVs and can't tell which applicant can actually think structurally. Engineering or product leads burn 3–5 hours per candidate just to find out the candidate can't do the job. Forage and whatchado don't help: Forage's submissions aren't proctored (so not credible as a hire signal) and whatchado is content (no signal at all).

**Two broken markets, same root cause:** students can't preview the work; **companies can't preview the student's work in a credible, scalable way.** We solve both with one product loop, but the company side is where the money is.

## 3. Vision

**Student side.** A student signs up. In 15 minutes they know three careers that likely fit them. In 45 minutes they've tried a real problem from a real company in one of those careers. In a week, if they were good, they have an interview invite in their inbox.

**Company side.** A talent lead at Personio publishes one product strategy case study. Over the next 90 days, 800 BWL students see the brand. 120 students start the case. 35 submit credible, proctored solutions. The hiring lead opens the dashboard, filters for top-quartile score with green integrity signals, and lands on a shortlist of 8 candidates with full submissions and CVs attached. Two interviews are booked the same week. Cost: less than one month of LinkedIn Recruiter spend. **The case study is simultaneously a hiring funnel and an employer-branding asset.**

## 4. Target users & personas

**Primary — "Undecided Una" (undergrad, year 1–3, TU Munich / Mannheim / WU Wien / WHU)**
Studies BWL, Wirtschaftsinformatik, or Medientechnik. Vaguely interested in startups but doesn't know what a PM, growth marketer, or data analyst actually does. Scrolls LinkedIn, follows Personio and N26 careers pages, feels behind. Has done two career quizzes and trusts neither. Speaks fluent English; reads German news. Would solve a Personio case study tonight if it meant a real recruiter would see her name.

**Secondary — "Exploring Emre" (Gymnasium, Klasse 11–12, Berlin/Hamburg)**
Choosing between Universität and a Duales Studium. Parents push medicine or law; he's curious about tech. Uses berufswahlapp because school told him to, finds it boring. Wants evidence, not opinions.

**Secondary — "Pivoting Priya" (Master's student, year 1, ETH/TU Berlin)**
Did mechanical engineering, wonders if product or strategy is a better fit before locking into a PhD or a corporate graduate program. Needs to test the water cheaply.

**The customer — "Recruiter Rui" (early-careers / talent lead at a Berlin/Munich scale-up — Personio, Trade Republic, Helsing, Celonis tier)**
Owns junior hiring for a 30–80 person commercial or product team. Annual headcount target: 8–15 hires. Budget: €60–150k for ads, agencies, employer-branding events. KPIs: cost-per-hire, time-to-hire, 12-month retention, candidate quality score. **Today**: spends €5–15k per junior hire, 30–40% mismatch rate at 12 months, 200+ unread LinkedIn applications per role, senior PMs burning 3–5h each on candidates who can't do the job. **Wants**: a pipeline of pre-screened, self-selected, credible-signal candidates without adding another tool to the HR stack. Will pay €5–20k/year per company for a working version of this. **Cares about brand**: every student who sees Personio's case study is a brand impression with the exact right audience.

**Secondary customer — "Director Dorothee" (head of talent / VP People at a 100–500 person scale-up)**
Owns the budget. Buys tools that show ROI in cost-per-hire and quality-of-hire dashboards. Will not buy another point solution unless it replaces existing spend. Sees this as: replaces some LinkedIn Recruiter / agency spend, plus replaces one career fair / employer branding line item.

## 5. Goals & success metrics

**Hackathon goals (judging)**
- Judges understand the loop in ≤60 seconds.
- Live demo completes one end-to-end flow without errors.
- At least one "wow" moment (case study is real, company logo is real, submission pipeline is visible).

**Post-hackathon goals (North Star metrics)**

The North Star is on the **company side**, because that's where the revenue lives. Student metrics are leading indicators for it.

- *North Star (company):* **paying companies on Starter or Growth tier.** Annualized revenue per logo.
- *Secondary company metrics:*
  - Number of companies with ≥1 live case study (supply-side).
  - Number of interview invites sent per company per quarter.
  - Hire-success rate (companies who flag ≥1 hire from the platform within 6 months).
  - NPS from talent leads.
- *Student-side metrics (leading indicators for the company funnel):*
  - Activation: % of signups that complete the questionnaire (target: 70%).
  - Engagement: % of matched students who start ≥1 case study (target: 30%).
  - Quality: % of submissions that receive a company response (target: 10%).
  - Submissions per company per month (the supply of pre-screened candidates we're delivering to each customer).

## 5b. What companies are buying — value proposition & ROI

The single most important section of this PRD. Companies are the customer. Everything else is plumbing.

### 5b.1 Five concrete value drivers (in order of company importance)

1. **Lower cost per quality hire.** Replace a chunk of LinkedIn Recruiter (€10–15k/seat/yr), agency fees (15–25% of first-year salary = €8–15k per junior hire), and career-fair line items. Even if we deliver only 2–3 quality hires per year, the math works at €5–20k/yr in subscription.

2. **Pre-screened pipeline with a credible signal.** Every candidate has solved the company's actual case study, under proctored conditions, with an integrity score. Hiring managers spend their time on shortlists, not on weeding out 200 LinkedIn applicants. This is the part Forage *cannot* deliver because their submissions aren't proctored.

3. **Self-selection.** A student who invests 45–60 minutes on a real case study has self-identified as someone who actually wants this kind of work. That selection signal is more predictive of 12-month retention than any pedigree filter.

4. **Employer branding to the exact right audience.** Every student who lands on the company's case study page is a brand impression on a relevant prospect. **The case study is content marketing, not just an assessment.** A startup with a 6-figure employer-branding budget can replace some of that with case-study placement and get measurable funnel data instead of impressions.

5. **Quality-of-hire data over time.** Companies see which case studies correlate with which retention outcomes. After 12 months they know whether top-quartile case-study scorers retain better than baseline LinkedIn hires. Forage can't deliver this — they don't track outcomes.

### 5b.2 Pricing thinking (post-hackathon, directional)

| Tier | Price | What you get | Target customer |
|---|---|---|---|
| **Pilot** | €0 (3-month design partner) | 1 case study, full dashboard, ≤5 invites | First 5–10 logo customers we want for case studies |
| **Starter** | €4,800/yr | 1 case study, full dashboard, unlimited invites | 30–80 person scale-ups |
| **Growth** | €14,400/yr | Up to 3 case studies, branded landing page, hire-success analytics | 100–500 person scale-ups, Mittelstand |
| **Enterprise** | Custom (€30k+) | Multi-team case studies, ATS integration, custom branding | Mittelstand HQs, DAX 40 graduate programs |

**Per-hire success fee:** explicitly *not* charging this. We want companies to use the platform freely without "is this hire attributable" debates. Subscription-only keeps the sales motion simple.

### 5b.3 ROI math we can defend on a sales call

| Line item | Today (typical 50-person scale-up) | With us (Growth tier) |
|---|---|---|
| LinkedIn Recruiter (1 seat) | €12,000/yr | Keep |
| Agency fees (3 junior hires × €10k) | €30,000/yr | Replace 1 hire → save €10k |
| Career fairs / employer branding | €25,000/yr | Replace 1 event → save €8k |
| Senior staff interview time waste (200 unqualified candidates × 30min × 2 reviewers × €80/hr) | €16,000/yr | Cut 70% via pre-screening → save €11k |
| **Subtotal savings** | — | **€29k/yr** |
| **Our subscription** | — | **€14.4k/yr** |
| **Net annual saving** | — | **~€15k/yr + better-fit hires** |

Caveat: these are directional benchmarks for the pitch deck, not audited customer numbers. We refine with the first 3 pilot customers.

### 5b.4 Reduce company effort to publish — the supply-side unlock

Companies won't publish case studies if it's a 20-hour internal project. So we ship **author tooling** that does the heavy lifting:

- **LLM-assisted brief authoring.** Company submits a 200-word job description; we draft a full case-study brief, deliverable spec, and rubric. They edit and approve.
- **Case-study templates by role.** Pre-built skeletons for PM, Growth, Data Analyst, Customer Success, Sales Eng. Companies fork and customize.
- **Rubric library.** Standard scoring rubrics by role, editable.
- **Time-to-publish target: < 60 minutes from "I want to hire a PM" to "case study live."**

This is a major moat against Forage, who hand-build every simulation over weeks of co-development with the employer.

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

Ordered by moat strength, not feature complexity:

1. **Reverse the funnel — interview invites, not certificates.** Forage and Springpod end at a PDF certificate. We end at a real interview invite. This is the only differentiator in this list that aligns student incentive (job) with employer ROI (pre-screened pipeline) end-to-end. **This is the headline.**
2. **Proctored = hireable.** The trust layer (full-screen, paste detection, time-on-task, integrity score) is what makes the work sample credible to companies. Without it, you're just another simulation toy. With it, the submission is a hiring signal.
3. **DACH-native: German + English from day one.** Forage has been "expanding into Europe" for three years and hasn't cracked DACH. whatchado owns video but not work samples. We sit in the gap.
4. **European startup & Mittelstand brand roster.** Personio, N26, Trade Republic, Celonis, Helsing, HelloFresh — not Citi, JPM, BCG. Different roster, different student audience, different employer sales motion than Forage's enterprise track.
5. **Match-first UX.** Forage assumes you know what role to try. We assume you don't. Questionnaire + CV → suggested careers → tasters → deep dive.
6. **Format tiers.** 15-minute taster → 1-hour mid-form → 4-hour deep dive. Forage's 4–6 hour minimum is too much for "just exploring." See §10.6.
7. **CV-aware everything.** Extracted skills enrich matching, CV is auto-attached to every submission. Forage has no CV layer.

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

### 10.6 Format tiers — taster / mid-form / deep dive

Direct attack on Forage's biggest UX weakness: their 4–6 hour minimum is a wall for casual explorers. We offer three lengths so the activation cost matches the user's intent.

| Tier | Length | Purpose | Typical deliverable |
|---|---|---|---|
| **Taster** | 10–15 min | "Is this even interesting to me?" Low commitment, high funnel volume. | One short answer (200–500 chars) + one decision (e.g. "which segment would you target?"). |
| **Mid-form** | 45–60 min | Real exploration — produces enough signal to score. | Structured doc (3–5 sections) or short slide outline. |
| **Deep dive** | 3–4 hours | The "submission that gets me an interview" tier. | Full case deliverable (slides, spreadsheet, doc, or code). |

- A career page surfaces all three tiers — the student picks based on time available.
- Only **mid-form and deep-dive** submissions are eligible for company review. Tasters are for self-discovery only.
- Why this matters strategically: **15-min tasters drive activation; deep dives drive hiring outcomes.** Two different funnel jobs, one product.

### 10.7 Exam / proctored environment
See §12 for anti-cheat approach. Functional requirements:
- Full-screen lockable mode.
- Countdown timer.
- Auto-save every 10 seconds.
- Submit button disabled until minimum time or completion.
- Rich-text answer editor; optional file upload for spreadsheets/slides.

### 10.8 Submission & grading
- On submit: store solution, timestamp, and "integrity signals" (tab switches, paste count, time-on-task).
- **MVP grading:** rubric-based; LLM auto-scores a first pass and flags top 10% for company review. (Yes, we use AI to grade but not to *solve*.)
- Company review panel: ranked list of top submissions with integrity signals visible.

### 10.9 Company portal / hiring dashboard

This is the surface companies pay for. Hackathon scope is minimal; the full feature set below is the post-hackathon roadmap that justifies the subscription tiers in §5b.2.

**MVP at hackathon (stretch — only if student flow is fully working):**
- **Separate auth role** (`role=company`), invite-only at MVP.
- **Submissions list view** — every student who completed the company's case study:
  - Student name, match score, submission score (auto-scored), time-on-task.
  - Integrity signals (tab switches, paste events, full-screen exits) shown as a single composite badge.
  - Attached CV and the full submission.
  - Filters: minimum score, has-CV, top 10% only. Sort: by score, by date, by match-with-career.
- **Candidate detail page** — solution, CV, questionnaire highlights, integrity report in one view.
- **Invite action** — one-click "Send interview invite." Creates a notification + email. No scheduling in MVP.
- **Privacy boundary:** companies only see students who completed THEIR case studies.

**Post-hackathon roadmap (the features that actually justify the subscription):**

| Feature | Value driver from §5b.1 | Tier |
|---|---|---|
| Self-serve case study authoring with LLM-assisted brief drafting | #4 employer branding, #1 cost per hire | Starter+ |
| Branded company landing page with logo, video, "About us" copy | #4 employer branding | Growth+ |
| Funnel analytics — impressions / starts / submissions / shortlists / invites / hires | #1 cost per hire, #5 quality data | Starter+ |
| Hire-success tracking — manual outcome flag ("we hired this candidate") feeding into a quality-of-hire dashboard | #5 quality data | Growth+ |
| ATS integration (Greenhouse, Personio, Lever) — push shortlisted candidates one click | Reduces stack friction | Enterprise |
| Multi-team / multi-role case study management with role-based access | Scale to larger orgs | Enterprise |
| Comparable benchmarks — "your top-quartile score is at 78; the platform median for PM roles is 65" | Competitive selling tool | Growth+ |
| Bulk export of submissions + CVs for offline review | Internal workflow fit | All tiers |

> **Hackathon staging:** if time runs short, mock the MVP company portal as a single static screen seeded with the demo student's submission. Even a static screen is enough to land the company-value narrative with judges. **Verbally walk through the post-hackathon roadmap above** to show judges the business model is real.

### 10.10 Student dashboard
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

## 12. Trust layer — what makes our submissions hireable

This is not "anti-cheat." This is the differentiator that turns a work sample from "exploration content" (Forage) into a "hiring signal" (us). Companies will pay for a pipeline they can trust; they won't pay for one where any solution could have been LLM-generated in another tab.

**Philosophy:** the *goal* is self-discovery, not certification — so we don't need airtight proctoring. We need *enough* signal that a hiring manager can defend the shortlist to their team. The integrity score is shown alongside the submission score in the company portal.

**MVP trust signals (shipped at hackathon):**
- Full-screen mode; log when user exits full-screen.
- Tab visibility change tracking; log count + total time hidden.
- Paste detection on the answer editor — count + warn user, surface to reviewer.
- Keystroke-rate sanity check (paste-dump detection: 5,000 chars in 2 seconds = flagged).
- Timer that keeps running even if tab closed.
- Honor code checkbox at start.
- **Composite "integrity score" surfaced in company view** — green/yellow/red, not a raw signal dump.

**Post-MVP:**
- Webcam proctoring (MediaRecorder + flagging).
- Second-device pairing for ID check.
- AI-text detection on written answers (with caveats — unreliable, used as one signal not a verdict).
- Voice-over-narration on deep-dive submissions (60s student talking through their thinking — much harder to fake).

**Pitch line for judges:** "Forage produces work samples. We produce *credible* work samples. That's what makes them a hiring signal companies will pay for."

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

## 15. Business model

Full pricing rationale lives in §5b. Summary here:

- **Students:** free forever. They are the users, never the customer. Premium student features are explicitly off the table — they would create misaligned incentives with employers (e.g. "pay to skip the queue").
- **Companies:** subscription tiers from €4.8k–€30k+/yr, see §5b.2. No per-hire success fee.
- **Why subscription, not pay-per-hire:** a per-hire fee creates attribution arguments ("did your platform really cause this hire?"), slows the sales cycle, and discourages high-volume publishing. Subscription keeps the relationship clean and predictable.

### 15b. Go-to-market — first 10 paying companies

How we get from zero to revenue in 6 months post-hackathon.

1. **Months 1–2: design partner phase.** Sign 5 free pilot customers across the DACH startup ecosystem. Target list: Personio, Trade Republic, Helsing, Celonis, N26, HelloFresh, About You, FlixBus, Forto, Forto, Mambu, Kitopi, Tomorrow Bank. We need 5 logos, not 50 — quality over quantity. Each gets a 3-month free pilot in exchange for case-study content + co-marketing rights + monthly feedback calls.
2. **Months 3–4: convert pilots to paid + recruit second cohort.** Target conversion rate: 40% (2 of 5 pilots → Starter or Growth). Bring on next 5 companies on paid Starter from day one.
3. **Months 5–6: vertical compounding.** Once 1 PM case study is live and visible, other companies hiring PMs come inbound. Same for Growth, Data, CS. Aim for 10 paying companies by end of month 6.
4. **Distribution lever — university career services partnerships.** TU Munich, WU Wien, Mannheim, WHU, Bocconi-DACH-cohort. They need career-orientation tools; we need student volume. They distribute us as a recommended platform; we don't pay for student acquisition.
5. **Founder/team sales motion.** Hackathon team sells the first 10 logos directly. Hire a sales lead only after €100k ARR.

### 15c. Side revenue (deprioritized)

- ❌ Premium student features — off the table (see above).
- ⚠️ Affiliate links to courses (Coursera, Udacity, IU, etc.) — possible, deprioritized to avoid cluttering student UX.
- ⚠️ University licensing — possible long-term play, but we lead with companies.

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
| 16–18 | Polish: copy, empty states, error states, loading states. **Build a company-side mockup screen even if real portal isn't shipped — the demo MUST show the company perspective (see §18 beat #3).** |
| 18–20 | Record backup demo video. Rehearse 2-minute pitch. |
| 20–21 | Bug bash. |
| 21–22 | Freeze. Eat. Rehearse again. |

## 18. Demo narrative (2 minutes)

**Opening line (memorize this):** *"Don't apply to jobs. Prove yourself, and jobs apply to you."*

1. **Problem (20s):** "DACH startups spend €5–15k per junior hire and 30% of those hires churn within a year because the candidate didn't actually know what the job was. Forage gives students certificates. whatchado gives them videos. LinkedIn gives them anxiety. None of them give the *company* a hireable signal."
2. **Student loop (35s):** Live walk-through. "Meet Una, BWL student in Mannheim. Uploads her CV. Eight questions. Three matches. Picks Product. Real case study from [Company]. Proctored mode. Submits in 45 minutes."
3. **Company side — the money (35s):** Switch to the company portal. "Here's [Company]'s talent lead. One dashboard. Filter top 10% by score with green integrity badges. Eight credible candidates, full submissions and CVs attached. One click — 'send interview invite.' That's the product companies will pay €15k/year for, because today they're paying €30k a year on agency fees and getting worse signal."
4. **Why we win (15s):** "Forage is English-only, bulge-bracket, certificate-based. whatchado is passive video. We're the only product where a proctored DACH student work sample becomes a hireable signal a German startup will pay for."
5. **Ask (15s):** What you want from judges (feedback, design-partner intros to Personio/Trade Republic/Celonis, prize).

> **Pacing note:** the company-side beat (#3) is what separates this from a student-tool pitch. Spend more time there than feels comfortable. Investors and judges decide based on "is there a buyer?" — and the answer needs to be live on screen.

## 19. Open questions (need answers within 2 hours)

1. Which 1 career and which 1 case study will drive the demo?
2. Which company name appears on that case study, and do you have permission?
3. Team size and skills — who owns frontend, backend, design, pitch?
4. Next.js+Supabase or React+Firebase — pick one before hour 1 ends.
5. Plan A (full breadth shallow) or Plan B (narrow & deep)?
6. Will submissions be scored by LLM auto-score only, or will you hand-score 1–2 live for the demo?
7. CV parsing: LLM-based (fast but fuzzy) or deterministic parser (slow to set up)? Recommend LLM for hackathon.
8. Company portal: real interactive hiring dashboard, or a single static screen seeded with the demo submission? Trigger is whether the student flow finishes by hour 14. **Either way, the company view MUST be visible in the demo — that's where the money beat is.**
9. Which 1–3 DACH companies do we approach as design partners (free pilot in exchange for case-study content + co-marketing rights)? Top of list: Personio, Trade Republic, Celonis.
10. Pricing in the deck: do we name actual euro numbers (€4.8k / €14.4k / Enterprise), or stay vague? Recommend: name the numbers — judges respect specificity.

## 20. Appendix — competitive landscape

Tiered by directness of threat to the DACH MVP. Full research notes on file with the team.

### Tier 1 — direct (same model: virtual work simulation)

| Competitor | HQ | DACH relevance | Threat | Our edge |
|---|---|---|---|---|
| **Forage** | SF / US-UK-AUS | Low — English-only | High globally, medium in DACH | DACH-native, startup roster, hiring outcome (not certificate), match-first |
| **Springpod** | UK | Low — UK-only | Medium | Same as Forage; no DACH presence |
| **Deeplo AI** | EU | Low | Low–medium | Student-first, not hiring-funnel-first; trust layer + matching layer |
| **GradSims (TargetJobs/GTI)** | UK | Low | Low | UK university distribution, narrow scope |
| **Shortlist.Me** | UK | Low | Low | UK only, small scale |

### Tier 2 — adjacent (real paid micro-internships)

| Competitor | HQ | Threat | Note |
|---|---|---|---|
| **Parker Dewey** | US | Low | Real paid projects; supply-constrained, employer scope effort |
| **Riipen** | CA | Low | Curriculum-embedded; needs faculty buy-in |
| **MindSumo** | US | Low | Prize-based crowdsourcing |
| **Practera** | AU | Low | Infra play, not student-facing brand |
| **Virtual Internships / The Intern Group** | UK | Low | Paid placement; high cost barrier |

### Tier 3 — adjacent (DACH career insight & orientation)

| Competitor | HQ | Threat | Note |
|---|---|---|---|
| **whatchado** | Vienna | **High in DACH** | Closest DACH-native player. Video stories, no simulation. Could be future content partner. |
| **JobTeaser** | Paris (Munich office) | Medium | 800+ universities, distribution moat. Not a simulation product — could be a partner or an acquirer long-term. |
| **berufswahlapp / Check-U / planet-beruf / abi.de** | Germany (gov) | Low | School-focused, content-only. Different audience. |
| **Bright Network IEUK** | UK | Low | UK only, time-bound events |

### Tier 4 — adjacent (talent assessment / hiring tech)

| Competitor | Note |
|---|---|
| **HireVue, Pymetrics (Harver), Vervoe, Arctic Shores** | B2B hiring assessments. Vervoe is closest mechanic but sells to employers, not students. |
| **Codility / HackerRank / CodeSignal** | Tech-only assessment. Adjacent only. |

### Tier 5 — adjacent (DACH student platforms — distribution competition)

| Competitor | HQ | Threat | Note |
|---|---|---|---|
| **Studydrive / Job Vibe** | Berlin | Medium (distribution) | Large student community, no simulation. Possible distribution partner. |
| **Talto (e-fellows.net)** | Germany | Medium | Premium German student network, content-heavy |
| **Squeaker.net** | Germany | Low | Industry-specific career prep, no simulation |
| **HeyJobs / Stellenwerk / campusjaeger / MeinPraktikum / Praktikum.info** | Germany | Low | Job boards, no work sample |
| **Azubiyo / AzubiWelt** | Germany | Low | Apprenticeship-only, different audience |

### Tier 6 — adjacent (other simulation-style learning)

| Competitor | Note |
|---|---|
| **Capsim / HBP Simulations / Marketplace Simulations** | Business school simulations, decision-making-focused, not day-to-day role |
| **Startup Wars** | Founder-track only |
| **InterSECT** | PhD-only, niche |

### Tier 7 — adjacent (startup-specific talent platforms)

| Competitor | Note |
|---|---|
| **Wellfound (ex-AngelList Talent)** | Startup job board. Pure listings, no work sample. |
| **YC Work at a Startup** | Curated job board, no simulation |
| **Mercor / Juicebox / Sorce.jobs** | AI talent marketplaces / auto-applies. Different mechanic, opposite ideology. |

### Strategic read

- **Direct simulation incumbents are English-language and bulge-bracket-branded.** None compete in DACH; none focus on startups; none deliver hiring outcomes.
- **DACH content players are video- and quiz-based.** None do interactive work samples.
- **The intersection (DACH + simulation + startup employers + hiring outcome) is empty.** That's our wedge.
- **Long-term partner candidates:** JobTeaser (distribution), whatchado (content partnership), Studydrive (distribution).
- **Long-term acquirer candidates:** JobTeaser, Forage (for DACH expansion), Personio (for talent platform play).

---

## 21. Strategic moat over 18 months

Why does this defend itself once Forage notices and tries to copy us?

1. **Content roster is sticky.** A DACH startup that publishes a case study with us spends real internal time defining the brief and rubric. They won't easily duplicate that work for a second platform. First-mover advantage with the German startup ecosystem compounds — Personio's case study attracts Celonis; Celonis attracts N26; etc.

2. **Submission history is portable for students, expensive for competitors.** A student who has done 3 case studies, has integrity scores, and has 1 invitation history will not start over on a Forage clone. The data layer (matching vector × CV × submission history × outcomes) is the lock-in.

3. **Trust signal compounds with volume.** As more companies hire from our pipeline, the integrity score correlates with hire-success data. We can publish "students with green integrity score and >80% submission score have a 23% interview-to-hire rate" — that's a marketing weapon Forage can't match because their submissions aren't proctored.

4. **Geography moat is real, not theoretical.** Forage's content acquisition motion is enterprise-led from London/SF. To match a DACH-native team that speaks German, partners with TU Munich, and signs Personio in person, they'd need to rebuild that motion from scratch. We have an 18-month head start before they take us seriously.

5. **The reverse-funnel framing is a category claim.** "Don't apply to jobs. Prove yourself, and jobs apply to you." Once that's our line, Forage can't take it without admitting they're chasing us.

**Two-year vision (post-hackathon):** become the default European early-careers pipeline for tech and Mittelstand. Expand from DACH → Benelux → Nordics → EU broad. Stay startup-first; bulge-bracket can stay with Forage.

---

## Next steps I'd take right now if I were on your team

1. Walk this PRD to the team and force a 30-minute decision meeting on the 6 open questions in §19.
2. Pick the 1 case study + 1 company. Email/DM a sponsor for permission *today*.
3. Commit to Plan A or Plan B and cut ruthlessly from there.
4. Start the build plan in §17 — the clock is already running.
