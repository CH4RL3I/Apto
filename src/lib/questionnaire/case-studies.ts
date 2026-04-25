// AUTO-GENERATED from ../../../apto case studies/cs-*.md.
// Do not edit by hand — re-run scripts/build-case-studies.mjs.
import type { Job } from "./matching";

export type CaseStudyDuration = "short" | "medium" | "long";

export interface CaseStudy {
  id: string;
  title: string;
  cluster: string;
  duration: CaseStudyDuration;
  estimatedMinutes: number;
  matchesRoles: string[];
  matchesFields: string[];
  matchesIndustries: string[];
  matchesMode: Job["mode"];
  matchesOutput: Job["output"];
  skillsTested: string[];
  companyName: string | null;
  logoUrl: string;
  body: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    "id": "cs-01-pm-feature-cut",
    "title": "Feature Cut: What Would You Remove from the Q3 Roadmap?",
    "cluster": "product_management",
    "duration": "short",
    "estimatedMinutes": 15,
    "matchesRoles": [
      "Associate Product Manager",
      "Product Manager",
      "Technical Product Manager",
      "Growth Product Manager",
      "Product Operations Analyst"
    ],
    "matchesFields": [
      "Product"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Healthcare",
      "Consumer"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Prioritization",
      "Stakeholder Management",
      "Trade-off Analysis",
      "Communication"
    ],
    "companyName": "ShipFlow",
    "logoUrl": "/company-logos/cs-01-pm-feature-cut.png",
    "body": "<img src=\"logos/cs-01-pm-feature-cut.png\" alt=\"ShipFlow logo\" width=\"120\" align=\"right\" />\n\n# Feature Cut: What Would You Remove from the Q3 Roadmap?\n\n## Context\n\n**ShipFlow** is a 45-person Series A logistics SaaS based in Berlin. The company coordinates shipping for mid-market e-commerce merchants and has scaled to €8M ARR in 18 months. The founding team is currently preparing for Series B (target: €20M) — strong product traction in Q3 is critical for the valuation.\n\nThe engineering team has 12 developers and has been at capacity for 6 weeks. The CEO wants to deliver more, while the engineering leads are struggling with technical debt.\n\n## Your Role\n\nYou are **Product Manager** for the core platform. The roadmap session with engineering leads just wrapped: the realistic delivery budget for Q3 is **4–5 features**. On the planning list are **8 features** — all with solid stakeholders backing them. You need to decide tonight what gets cut, and communicate it tomorrow.\n\n## Starting Position — The 8 Candidates\n\n1. **Real-time Tracking API** — P0 from Sales. Three enterprise customers were promised this feature; contracts are up for cancellation.\n2. **Multi-Currency Billing** — From the new UK Expansion Team. UK launch is planned for Q4.\n3. **Custom Report Builder** — Top request in the last NPS survey (45% mention it). Very large build.\n4. **Mobile App for Warehouse Staff** — CEO's pet project, which he heard about on a customer visit. No prioritization data.\n5. **Two-Factor Authentication** — Security team insists on it. SOC-2 audit in Q4.\n6. **CO2-Footprint Calculator** — Marketing wants to run a sustainability campaign with it.\n7. **Bulk Upload via CSV** — Used by 60% of customers, currently error-prone. Support's #1 ticket.\n8. **Shopify Integration** — Partnership opportunity, contractually bound until end of Q3, with revenue-share.\n\n## Your Task\n\nIn 15 minutes:\n\n1. **Cut 3–4 features** and prioritize the remaining ones.\n2. Write **1 sentence of justification** for each cut (max. 20 words).\n3. Sketch in **3 bullets** your communication plan for the CEO, Sales, and Marketing.\n\n## Guiding Questions\n\n- Which framework do you use for the trade-off? (RICE, ICE, Impact-vs-Effort, Strategic-vs-Tactical?)\n- How do you handle the CEO's pet project (#4) — cut it or handle it tactically?\n- Which of the \"must-haves\" are truly non-negotiable versus which ones were just loudly demanded?\n- What's the most expensive feature in terms of opportunity cost — not build effort?\n\n## Match Info\n\n**Case fits:** Associate Product Manager, Product Manager, Technical Product Manager, Growth Product Manager, Product Operations Analyst\n**Tests primarily:** Prioritization under constraints, stakeholder management, trade-off logic\n**Industry fit:** Tech & Software, adaptable across industries"
  },
  {
    "id": "cs-02-pm-onboarding-redesign",
    "title": "Onboarding Redesign: 40% Drop-off at Step 3",
    "cluster": "product_management",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Product Manager",
      "Growth Product Manager",
      "Product Operations Analyst",
      "Technical Product Manager",
      "Product Manager (payments, lending)",
      "Retail Product Manager"
    ],
    "matchesFields": [
      "Product",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Funnel Analysis",
      "Cross-functional Leadership",
      "User Research Interpretation",
      "Metrics Definition"
    ],
    "companyName": "LendBright",
    "logoUrl": "/company-logos/cs-02-pm-onboarding-redesign.png",
    "body": "<img src=\"logos/cs-02-pm-onboarding-redesign.png\" alt=\"LendBright logo\" width=\"120\" align=\"right\" />\n\n# Onboarding Redesign: 40% Drop-off at Step 3\n\n## Context\n\n**LendBright** is a DACH fintech for SME loans between €25k and €500k. Scale-up with €40M ARR, 180 employees, Series C round closed. The product is a web application where business customers submit a loan application in 6 steps. The pricing model is based on origination fees per approved loan.\n\nThe last quarterly review revealed a problem: conversion through the application process is catastrophic. The board wants it fixed before Q4 ends. The Head of Product just tasked you with it.\n\n## Your Role\n\nYou are **Product Manager** for the core application process. You coordinate across Design, Engineering, Legal, and Credit Risk. You have 2 weeks to deliver a solid concept — and 8 weeks until release.\n\n## Starting Position & Data\n\n**Funnel for the last 90 days** (applications started: 12,400):\n\n| Step | Content | Conversion |\n|---|---|---|\n| 1 | Company data (name, industry, revenue) | 90% |\n| 2 | Loan amount & use of funds | 80% |\n| 3 | **Document Upload** (8 documents) | **40%** |\n| 4 | Business owner identification (video ID) | 35% |\n| 5 | Bank details & account statement connection | 30% |\n| 6 | Completion & digital signing | 28% |\n\n**User feedback from 15 drop-off interviews (at step 3):**\n\n- \"I really just wanted to know if I qualified — then I would have gathered the documents.\" (9/15)\n- \"I didn't have the annual statement at hand, so I closed the application for now.\" (6/15)\n- \"Why do they need 3 years of annual statements? We've only been around for 2 years.\" (3/15)\n- \"The process didn't work on my phone; uploading was cumbersome.\" (4/15)\n\n**Competitive context:**\n- N26 Business: 3 documents in initial application, rest after conditional approval\n- Qonto SME Loans: Soft check without documents, full review only after green light\n- LendBright: 8 documents in initial application, no soft check\n\n**Constraint from Credit Risk:** For final credit review we need all 8 documents. Negotiable is *when* they're collected, not *whether*.\n\n## Your Task\n\nCreate a **1-page concept brief** for leadership with:\n\n1. **Problem diagnosis** (3 bullets): What are the main causes of drop-off?\n2. **Redesign proposal** (sketch the new flow in 5–7 steps or stages)\n3. **Success metrics**: Which 3 metrics show whether the redesign works? What are your target values?\n4. **Risks & trade-offs**: What could Credit Risk, Legal, or Finance object to, and how do you address it?\n5. **8-week plan** with milestones (rough, 4–5 bullets)\n\n## Guiding Questions\n\n- Is this really a UX problem at step 3 — or a *structural* problem (wrong order, too many requirements too early)?\n- Could a \"soft check\" before document upload solve the main problem? What are the costs of such a structural change?\n- Which metric measures *real success* — conversion alone isn't enough if it lets in more unqualified applications.\n- How do you convince Credit Risk that a restructured flow won't degrade their rejection quality?\n\n## Match Info\n\n**Case fits:** Product Manager, Growth Product Manager, Product Operations Analyst, Product Manager (payments/lending), Retail Product Manager\n**Tests primarily:** Funnel analysis, cross-functional problem-solving, UX understanding combined with business impact\n**Industry fit:** Fintech, SaaS with complex onboarding, regulated industries"
  },
  {
    "id": "cs-03-pm-pmf-validation",
    "title": "Product-Market Fit: Validation Plan for a Legal AI MVP",
    "cluster": "product_management",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Associate Product Manager",
      "Product Manager",
      "Growth Product Manager",
      "Product Marketing Manager",
      "Technical Product Manager",
      "Chief of Staff (junior)"
    ],
    "matchesFields": [
      "Product",
      "Research",
      "Marketing"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Hypothesis Formulation",
      "Experiment Design",
      "Qualitative & Quantitative Research",
      "Prioritization Under Uncertainty"
    ],
    "companyName": "ClauseCheck",
    "logoUrl": "/company-logos/cs-03-pm-pmf-validation.png",
    "body": "<img src=\"logos/cs-03-pm-pmf-validation.png\" alt=\"ClauseCheck logo\" width=\"120\" align=\"right\" />\n\n# Product-Market Fit: Validation Plan for a Legal AI MVP\n\n## Context\n\n**ClauseCheck** is a Pre-Seed startup (3 founders, €400k Pre-Seed round from business angels). The team is building an AI tool to help small to mid-sized German law firms (2–20 lawyers) review contracts: upload, automatic clause extraction, deviation warning against a firm's standard template library.\n\nThe MVP has been live for 6 weeks. 12 firms are on board as free pilots. In 5 months, a Series A conversation with major VCs should begin — the team needs solid PMF evidence by then. Currently: lots of opinions, little data.\n\n## Your Role\n\nYou are **Product Manager** (and simultaneously \"PMF Lead\" at this stage). The founders are deep in engineering and sales. You own: what gets measured, what gets tested, what counts as validation.\n\n## Starting Position\n\n**What we know:**\n- 12 pilots use the tool with varying intensity: 4 log in weekly, 5 monthly, 3 practically never\n- One firm already said: \"If you build feature X, we'll pay €800/month\" — but without commitment\n- Founders believe in a TAM of 18,000 German law firms with ≤20 lawyers\n- No established competitor in the DACH market; US players (Harvey, Spellbook) target large firms\n\n**What we DON'T know:**\n- Does the tool solve a real \"hair-on-fire\" problem or just a \"nice-to-have\"?\n- Is the use case broad enough (contracts of all kinds) or focus on one clause type (e.g., NDAs)?\n- Is the ICP really \"2–20 lawyers\" — or specific practice areas (M&A, employment, IP)?\n- Are firms willing to pay €500–€1,500/month?\n\n**Your budget:**\n- 4 weeks\n- €15k for user research, paid experiments, incentives\n- 20% of an engineering sprint per week for tool adjustments\n\n## Your Task\n\nBuild a **4-week PMF validation plan**:\n\n1. **The 3–5 most critical hypotheses** you want to test (in order of how much they could \"kill\" the business model)\n2. Per hypothesis: **Experiment design** — what exactly do you do, what data do you collect, what's the go/no-go criterion?\n3. **Quantitative metrics** for the existing pilot set: which 3–4 metrics define PMF for ClauseCheck (e.g., Sean Ellis Score, retention cohorts, paid conversion from pilots)?\n4. **Qualitative research plan**: How many interviews with whom, and what key questions?\n5. **Kill criteria**: Under what results would you recommend the founding team pivot or narrow focus?\n\n## Guiding Questions\n\n- What's the riskiest assumption in the business model — that firms will pay, that the product works, or that the market is big enough?\n- How do you distinguish between \"our 12 pilots love it\" and \"the market loves it\"?\n- Which signals are *vanity* (signups, demos, pilot closures) and which are *real* (recurring usage, unsolicited feedback, willingness to pay)?\n- How do you decide between *broadening* the ICP (more lawyer types) and *deepening* (solving one use case perfectly)?\n\n## Match Info\n\n**Case fits:** Associate Product Manager, Product Manager, Growth Product Manager, Product Marketing Manager, Technical Product Manager, Chief of Staff (junior)\n**Tests primarily:** Handling uncertainty, hypothesis-driven work, research design, prioritization under time pressure\n**Industry fit:** Tech startups, especially early-stage B2B SaaS"
  },
  {
    "id": "cs-04-data-margin-deepdive",
    "title": "Margin Deep-Dive: Why Is the South Region 4% Below Plan?",
    "cluster": "data_analytics",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Analytics Engineer",
      "Research Analyst",
      "FP&A Analyst",
      "Retail Strategy Associate",
      "Business Operations Analyst",
      "Merchandising Analyst"
    ],
    "matchesFields": [
      "Data",
      "Finance"
    ],
    "matchesIndustries": [
      "Consumer",
      "Industrial",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Root-Cause Analysis",
      "Hypothesis Tree",
      "Data Storytelling",
      "Business Context Understanding"
    ],
    "companyName": "MountainCo",
    "logoUrl": "/company-logos/cs-04-data-margin-deepdive.png",
    "body": "<img src=\"logos/cs-04-data-margin-deepdive.png\" alt=\"MountainCo logo\" width=\"120\" align=\"right\" />\n\n# Margin Deep-Dive: Why Is the South Region 4% Below Plan?\n\n## Context\n\n**MountainCo** is a DACH outdoor equipment retailer (hiking, climbing, ski). €180M revenue, 45 physical stores, 1,200 employees, plus an e-commerce channel accounting for 22% of revenue. The stores are split across 4 regions: North, West, Center, South.\n\nThe Q3 review reveals: **Region South is 4 percentage points below the budgeted gross margin plan** — 34% actual vs. 38% plan. The other regions are between -0.5% and +1% from plan. The CFO wants a memo in 3 days with root-cause hypothesis and 3 actionable levers.\n\n## Your Role\n\nYou are **Business/Data Analyst** on the Finance team. You have access to the data warehouse and a call with the South Regional Manager. You work solo, but can request BI queries from an Analytics Engineer as needed.\n\n## Starting Position — The Data You Have\n\n**Data warehouse access** (tables described, SQL possible):\n- `sales`: Date, SKU, store, region, quantity, net revenue, cost (COGS), discount\n- `stores`: Store ID, region, square meters, opening year, manager ID, avg. visitor frequency\n- `skus`: SKU ID, category, subcategory, supplier, purchase price, MSRP, season\n- `promos`: SKU, start/end date, discount type, region applied\n- `staff`: Store ID, headcount, turnover, training hours\n\n**Context info from initial exploration:**\n- Region South has 11 stores, 2 opened in 2024\n- South revenue is +3% above plan — the problem is purely margin\n- Category mix in South: unusually high ski share (38% vs. 22% average)\n- Unusual warm start to ski season in Bavaria & Austria\n- One major ski supplier raised prices 7% in August\n- 3 local promos running in South, not active in other regions\n\n**Call notes from South Regional Manager:**\n> \"We promoted aggressively to clear ski inventory in the warm winter. But that's not the only factor. Two new stores are still ramping. And I think Stuttgart and Munich have a shrinkage problem that isn't clean in our inventory counts.\"\n\n## Your Task\n\nDeliver a **1-page memo to the CFO** (in 50 min):\n\n1. **Root-cause diagnosis**: Structure possible causes in a hypothesis tree. Which **2–3 likely drive 70%+ of the variance**? Justify with the data you'd pull.\n2. **SQL sketch or analysis plan** for top hypotheses: Which queries would you run to confirm or rule them out?\n3. **3 actionable levers** with margin impact estimate (rough range is fine): What would you suggest to the Regional Manager and CFO?\n4. **What you still don't know**: Which 2–3 questions must you answer before you trust the memo?\n\n## Guiding Questions\n\n- Is the cause a *mix effect* (different products sold) or a *price effect* (same products, worse margin)? How do you separate that in the data?\n- How do you distinguish margin pressure from *purchasing* (supplier prices), *sales* (discounts), and *operations* (shrinkage, waste)?\n- Ski was unusually warm — but is that *the* story, or just a plausible surface explanation masking deeper structural issues?\n- Which of the Regional Manager's hypotheses would you prioritize checking, which would you skip?\n\n## Match Info\n\n**Case fits:** Data Analyst, Business Intelligence Analyst, Analytics Engineer, Research Analyst, FP&A Analyst, Retail Strategy Associate, Business Operations Analyst, Merchandising Analyst\n**Tests primarily:** Structured analytical thinking, hypothesis prioritization, SQL logic, business storytelling\n**Industry fit:** Retail, CPG, any data-intensive multi-location industry"
  },
  {
    "id": "cs-05-data-churn-features",
    "title": "Churn Model: Your Feature Engineering Plan in 20 Minutes",
    "cluster": "data_analytics",
    "duration": "short",
    "estimatedMinutes": 20,
    "matchesRoles": [
      "Data Scientist",
      "Machine Learning Engineer",
      "Data Analyst",
      "Analytics Engineer",
      "Research Analyst",
      "Health Data Analyst"
    ],
    "matchesFields": [
      "Data",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Healthcare",
      "Consumer"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Feature Engineering",
      "Hypothesis-driven Thinking",
      "Business-to-Model Translation",
      "Trade-offs (Signal vs. Leakage, Simplicity vs. Complexity)"
    ],
    "companyName": "FlowStack",
    "logoUrl": "/company-logos/cs-05-data-churn-features.png",
    "body": "<img src=\"logos/cs-05-data-churn-features.png\" alt=\"FlowStack logo\" width=\"120\" align=\"right\" />\n\n# Churn Model: Your Feature Engineering Plan in 20 Minutes\n\n## Context\n\n**FlowStack** is a B2B SaaS for project management (competitors: Asana, ClickUp). 14,000 active paying teams, €32M ARR, typical customer has 8–40 users, priced at €12/user/month. Churn rate (monthly, by account) is currently 2.8% — goal is 1.5%.\n\nThe Head of Product has decided: we'll build a churn prediction model to identify high-risk teams 30 days before likely cancellation, so Customer Success can intervene proactively.\n\n## Your Role\n\nYou are **Data Scientist** and should build the model. Before you write code or train anything, there's a mini-design review with the Head of Product and Head of Customer Success. They want to know in **20 minutes** which features you'd build and why.\n\n## Starting Position\n\n**What's available:**\n\n- `subscriptions`: Account ID, plan, MRR, start date, cancellation date (if any), payment method, billing history\n- `usage_events`: per account and user: logins, projects created, tasks created, comments, integrations used (Slack, Google Drive)\n- `support`: ticket count, ticket topics (categorized), average CSAT satisfaction\n- `billing`: payment delays, failed charges, upgrades/downgrades\n- `nps`: quarterly NPS scores per primary user (response rate ~25%)\n- `crm`: Customer Success notes on enterprise accounts (>€1k MRR)\n\n**Constraints:**\n- The model must trigger *30 days before* likely cancellation — features must be based on data through T-30, not leading indicators that only appear right before cancellation\n- Customer Success can realistically action 20–30 accounts per week as high-risk — precision matters more than recall\n- Enterprise accounts (>€1k MRR) must not be underrepresented\n\n## Your Task\n\nIn 20 minutes, as a structured list:\n\n1. **6–10 features** you'd engineer, grouped by category (engagement, billing, team structure, support, etc.)\n2. Per feature: **one-line hypothesis** of why it's a churn signal\n3. **2–3 features you'd deliberately skip**, even though available — and why (leakage, noise, fairness risk)\n4. **1 target variable definition**: What exactly does the model predict? (e.g., \"account-level churn in the next 30 days\" — but how exactly is churn defined?)\n\n## Guiding Questions\n\n- Which features are **engagement trends** rather than absolute values (e.g., \"logins last 7 days / logins previous week\") — and why is that often more predictive?\n- Where does **target leakage** threaten? For example: support tickets with topic \"Cancellation\" are highly predictive, but useless.\n- How do you handle the fact that enterprise and SMB accounts churn fundamentally differently? One global model? Two models?\n- Which features would Customer Success people *see* (plausibility) when you show them the alert? Explainability is more practically important than 2% more AUC here.\n\n## Match Info\n\n**Case fits:** Data Scientist, Machine Learning Engineer, Data Analyst, Analytics Engineer, Research Analyst, Health Data Analyst\n**Tests primarily:** Feature engineering intuition, business context understanding, awareness of leakage and fairness\n**Industry fit:** SaaS, all subscription business models, retention-critical industries"
  },
  {
    "id": "cs-06-sports-stadium-u30",
    "title": "Stadium U30: How Do You Win Back the 18–29-Year-Olds?",
    "cluster": "sports_industry",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Sports Marketing Associate",
      "Sponsorship Analyst",
      "Athlete Management Associate",
      "Event Operations Coordinator",
      "Brand Marketer",
      "Shopper Marketing Analyst",
      "Lifecycle / CRM Marketer"
    ],
    "matchesFields": [
      "Marketing",
      "Operations"
    ],
    "matchesIndustries": [
      "Sport",
      "Consumer",
      "Media"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "creator",
    "skillsTested": [
      "Audience Strategy",
      "Campaign Design",
      "Budget Allocation",
      "Stakeholder Management (Sponsors, Fans, Operations)"
    ],
    "companyName": "FC Rot-Weiß Essen",
    "logoUrl": "/company-logos/cs-06-sports-stadium-u30.png",
    "body": "<img src=\"logos/cs-06-sports-stadium-u30.png\" alt=\"FC Rot-Weiß Essen logo\" width=\"120\" align=\"right\" />\n\n# Stadium U30: How Do You Win Back the 18–29-Year-Olds?\n\n## Context\n\n**FC Rot-Weiß Essen** (fictional, 3rd division) — traditional club, stadium with 16,000 capacity, historically a major fixture in the Ruhr Valley. Over the last 3 seasons, home-game attendance has dropped from 82% to **65%**. At the same time, the average age of season-ticket holders has risen from 43 to 48. The 18–29-year-olds now account for only 11% of stadium visitors.\n\nThe main sponsor (a local utility company) negotiated a new clause in the contract renewal: increase younger demographics in the stadium, or lose 20% of sponsorship starting 2027.\n\n## Your Role\n\nYou are **Sports Marketing Manager** at the club. The CMO has given you a **€180k annual budget** and 9 months until the season starts. She wants a 1-page strategy in 2 weeks — one that's clear, measurable, and convinces the sponsor. You own the rollout.\n\n## Starting Position\n\n**What you know:**\n\n- Avg. ticket price: €22 in the standing section, €38 seating, season tickets from €280\n- Match-day revenue (catering, merchandise): €9/person per home game\n- The club has 47,000 newsletter subscribers (avg. age 51), 28k Instagram followers (broad spread), 5k TikTok (78% under 30)\n- Club budget structure: 78% player salaries, 8% operations, 6% marketing, 8% other\n- **Competition for attention** in that age group: Bundesliga streams, esports, FIFA, local concerts, Netflix Sundays\n- Stadium is well served by public transit, but the last train leaves before match end on evening games\n- Last fan survey (n=340, mostly older regulars): 64% want \"traditional stadium experience\" — but that's not your target demographic\n\n**Benchmarks from other clubs:**\n\n- Werder Bremen: TikTok series \"My Match Day\" with academy players, +40% U30 social engagement\n- Union Berlin: \"Fan Mentor\" — every first-time U25 visitor paired with a veteran fan, 72% return rate\n- St. Pauli: Partnership with student housing for 2-for-1 tickets on Wednesday matches, +25% U30 on Wednesdays\n\n**What DIDN'T work** (per predecessor):\n- Poster campaign at universities in 2023 — minimal measurable impact\n- \"Gaming Night\" at stadium without a match — low attendance, high cost\n\n## Your Task\n\n**1-page strategy** for the CMO and sponsor:\n\n1. **3 strategic pillars** — not 10 individual actions, but a clear narrative (e.g., \"Access + Community + Digital Presence\")\n2. **Per pillar**: 2–3 concrete tactics with **budget allocation** (total: €180k) and **target KPI**\n3. **Primary success metric** for the sponsor: how do you measure \"U30 in stadium\"? (U30 ticket sales, U30 season tickets, U30% of a specific section, or something else?)\n4. **Risk management**: How do you avoid long-time fans (64% want \"traditional experience\") feeling pushed out?\n5. **First 90-day sprint**: What happens before the season starts?\n\n## Guiding Questions\n\n- Is the core problem **awareness** (U30 doesn't know), **access** (price, timing, transport), **experience** (stadium feels old), or a mix? Your answer drives 80% of strategy.\n- How do you leverage the 5k TikTok followers (78% U30) — build it as your primary channel or not?\n- What role do players play as content creators? How do you get them on board without hurting athletic performance?\n- What's the difference between \"U30 comes once\" and \"U30 becomes a repeat visitor\" — and which tactic targets which outcome?\n\n## Match Info\n\n**Case fits:** Sports Marketing Associate, Sponsorship Analyst, Athlete Management Associate, Event Operations Coordinator, Brand Marketer, Shopper Marketing Analyst, Lifecycle / CRM Marketer\n**Tests primarily:** Audience strategy, campaign architecture, budget trade-offs, stakeholder balance\n**Industry fit:** Sports clubs, live entertainment, all audience-building roles in consumer brands"
  },
  {
    "id": "cs-07-sports-sprint-drop",
    "title": "Sprint Drop in Second Half: What Do You Tell the Coaching Staff?",
    "cluster": "sports_industry",
    "duration": "short",
    "estimatedMinutes": 20,
    "matchesRoles": [
      "Sports Analytics Analyst",
      "Athlete Management Associate",
      "Data Analyst",
      "Research Analyst",
      "Health Data Analyst",
      "Clinical Operations Analyst"
    ],
    "matchesFields": [
      "Data",
      "Research"
    ],
    "matchesIndustries": [
      "Sport",
      "Healthcare"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Data Analysis Under Uncertainty",
      "Hypothesis Prioritization",
      "Communication with Non-Data Audience",
      "Handling Confounding Variables"
    ],
    "companyName": "TSV Halle 05",
    "logoUrl": "/company-logos/cs-07-sports-sprint-drop.png",
    "body": "<img src=\"logos/cs-07-sports-sprint-drop.png\" alt=\"TSV Halle 05 logo\" width=\"120\" align=\"right\" />\n\n# Sprint Drop in Second Half: What Do You Tell the Coaching Staff?\n\n## Context\n\n**TSV Halle 05** is a 2nd-division soccer club with a functioning sports science department (2 sports scientists, GPS tracking at every training and match, lactate diagnostics in training cycles). Striker **Max Feldmann**, 24, transferred in summer for €1.8M — high expectations at the club.\n\nOver the last 15 league matches, a clear pattern emerges: **Feldmann's sprint speed drops by an average of 12% after minute 60 compared to the first 45 minutes.** The head coach is now substituting him early, even when the tactical situation argues against it. He wants to know: What's going on?\n\n## Your Role\n\nYou are **Performance Data Analyst** on the sports science team. Tomorrow morning is the Monday meeting with head coach, strength coach, and physio. You have tonight — 20 minutes — to structure your assessment.\n\n## Starting Position — The Data\n\n**Over the last 15 matches:**\n\n| Metric | 1st Half | 2nd Half (until min. 60) | From min. 60 |\n|---|---|---|---|\n| Avg. max sprint speed | 32.4 km/h | 31.8 km/h | **28.5 km/h** |\n| Sprints >25 km/h per 15 min | 5.1 | 4.7 | **2.2** |\n| Running distance (m/min) | 112 | 108 | 95 |\n| Heart rate (avg.) | 169 bpm | 174 bpm | 171 bpm |\n| Lactate (measured at substitution) | — | — | **4.1 mmol/L (avg.)** |\n\n**Context from the team:**\n\n- Feldmann trains full week, no notes in physio protocol\n- In training matches (90 minutes), the drop **does not** occur — values stay stable\n- Last 3 matches: ambient temperature >22°C\n- Nutrition consultant reports: Feldmann eats very low-calorie before matches (own decision, \"feels lighter\")\n- He's the father of a 4-month-old, sleeping poorly for 3 months\n- Tracking: from min. 55–60 onward, his positional heat map changes — he drops deeper, makes fewer runs in depth\n\n**What the head coach believes:**\n> \"He's simply not fit enough for our league. I need a different striker in winter.\"\n\n**What the strength coach believes:**\n> \"Training data is clean. I don't understand how he holds up in training but not in matches. It's mental.\"\n\n## Your Task\n\nIn 20 minutes:\n\n1. **Top-3 hypotheses** for the sprint drop, in order of your likelihood assessment, each with **data points supporting or contradicting it**.\n2. **Which additional data** you'd suggest collecting this week to test the top hypothesis.\n3. **2 concrete recommendations** for the coaching staff you can state in tomorrow's meeting — without having complete answers.\n4. **What you clearly should NOT say**: Which conclusion would be unsound with this data, even if tempting?\n\n## Guiding Questions\n\n- Why is the training vs. match discrepancy important — what's different between the two beyond intensity?\n- The head coach has one opinion (\"not fit enough\"), the strength coach another (\"mental\"). How do you maintain analytical integrity without political maneuvering?\n- How do you handle the sleep issue — medically relevant, but personally sensitive?\n- Is a 12% sprint speed decline clinically significant or within normal fatigue? What would be your benchmark?\n\n## Match Info\n\n**Case fits:** Sports Analytics Analyst, Athlete Management Associate, Data Analyst, Research Analyst, Health Data Analyst, Clinical Operations Analyst\n**Tests primarily:** Analysis under uncertainty, hypothesis prioritization, communication with operational audience\n**Industry fit:** Professional sports, sports science, any performance diagnostics role"
  },
  {
    "id": "cs-08-ux-senior-banking",
    "title": "Banking App for 60+: Redesign Without Support Calls",
    "cluster": "design",
    "duration": "medium",
    "estimatedMinutes": 55,
    "matchesRoles": [
      "Product Designer",
      "UX Researcher",
      "UX Writer",
      "Design Systems Designer",
      "Visual Designer",
      "Learning Experience Designer",
      "Retail Product Manager"
    ],
    "matchesFields": [
      "Design",
      "Product",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "creator",
    "skillsTested": [
      "User-Centered Design",
      "Research-Interpretation",
      "Accessibility",
      "Design-Rationale"
    ],
    "companyName": "DSBank",
    "logoUrl": "/company-logos/cs-08-ux-senior-banking.png",
    "body": "<img src=\"logos/cs-08-ux-senior-banking.png\" alt=\"DSBank logo\" width=\"120\" align=\"right\" />\n\n# Banking App for 60+: Redesign Without Support Calls\n\n## Context\n\n**DSBank** is a mid-sized German retail bank with 2.1 million private customers, of whom 620,000 are over 60. The bank relaunched its mobile banking app 14 months ago. The app was originally optimized for a young audience — with the result that among 60+ users, the NPS is **-20**, and this group contacts the support hotline 3.4x more frequently than the average customer.\n\nThe board has decided: the app must work for the 60+ age group as well — without building a separate \"senior version.\" The product team is bringing you on as a Product Designer for the project.\n\n## Your Role\n\nYou are a **Product Designer** at DSBank. Your mission: within 3 weeks, deliver a redesign concept for the **3 most-used flows** that dramatically improves usability for 60+, without degrading the experience for younger users. Today is the first workshop day.\n\n## Starting Position\n\n**The 3 most-used flows** (in order):\n\n1. **Check balance + view recent transactions** — 82% of logins\n2. **Initiate a transfer** (to saved and new recipients)\n3. **Block card** (in case of loss or suspicious transaction)\n\n**Research insights from 5 user interviews (60+):**\n\n- *Elke, 68, retired teacher:* \"I can never find where I see my last account transaction. The screen is so colorful, my eyes jump everywhere.\"\n- *Klaus, 71, retiree, former tradesman:* \"When I do a transfer, I'm always scared I'll type something wrong. I like to see my entries summarized first — but if the text is too small, that doesn't help.\"\n- *Monika, 64, still working:* \"I tried blocking my card once. I was so panicked I couldn't find it. I called instead. That was faster.\"\n- *Hans, 74, widower:* \"I don't like doing this alone. My daughter helps me. But she lives 200 km away.\"\n- *Brigitte, 66, yoga instructor:* \"The app is actually okay, but I hate these tiny gray fonts. I enlarge everything on my phone, then the app doesn't fit properly anymore.\"\n\n**Current app — main problems from UX audit:**\n\n- Balance is at the top, but in a complex card view with 5 other elements in the visual field\n- Transfer flow has 4 screens, with many form fields visible simultaneously on screen 2\n- Card blocking is 3 clicks deep in the menu, under \"Security → Cards → Card Options\"\n- Gray helper text has contrast ratio 3.2:1 (WCAG AA requires 4.5:1)\n- No screen reader support; font scaling breaks layout at 140%+\n\n**Business context:**\n\n- Each support call costs the bank roughly €8 in handling costs\n- The younger target group (18–35) should not be slowed down — this group is currently performing well (NPS +32)\n\n## Your Task\n\nPrepare for the next day:\n\n1. **Design theses** (3–5 bullets): What design principles guide your redesign? (e.g., hierarchy, confirmation screens, contrast standards)\n2. **Sketched flows** (text descriptions or rough wireframes) for all 3 flows: What do the screens, screen flow, and key UI elements look like?\n3. **Critical design decisions**: Which 3 decisions do you justify most clearly, because they could face pushback?\n4. **How do you protect the young target group?** Which decisions would have negative consequences for 18–35, and how do you solve it? (Settings? Adaptive layouts? Universal design?)\n5. **Validation plan**: How do you test the concept with 60+ users before engineering starts?\n\n## Guiding Questions\n\n- What's the difference between a \"senior version\" (anti-pattern, stigmatizing) and \"age-independent usable design\"? How do you handle this linguistically and designerally?\n- For card blocking: panic situation. How do you find the right balance between \"as accessible as possible\" and \"not triggered accidentally\"?\n- Which design elements are really age-specific (e.g., contrast, font size) and which are universally better (e.g., clearer hierarchy, fewer simultaneous options)?\n- How do you address the trust issue? (Klaus: \"afraid to type something wrong\" — that's not purely a UI problem, it's a trust problem.)\n\n## Match Info\n\n**Fits:** Product Designer, UX Researcher, UX Writer, Design Systems Designer, Visual Designer, Learning Experience Designer, Retail Product Manager\n**Tests primarily:** User-Centered Thinking, Accessibility Competency, Design-Rationale, Stakeholder Argumentation\n**Industry fit:** Fintech, Healthcare, any industry with broad demographic audience"
  },
  {
    "id": "cs-09-sales-stalled-deal",
    "title": "Stalled Deal: How Do You Reactivate an 85k€ Deal After 3 Months of Silence?",
    "cluster": "sales_gtm",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Account Executive (SMB / Mid-market)",
      "Sales Development Representative",
      "Customer Success Manager",
      "Technical Account Manager",
      "Solutions Engineer",
      "Revenue Operations Analyst",
      "Business Development Analyst"
    ],
    "matchesFields": [
      "Sales",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Deal-Diagnosis",
      "Stakeholder-Mapping",
      "Negotiation-Strategy",
      "Empathetic Communication"
    ],
    "companyName": "PeoplePath",
    "logoUrl": "/company-logos/cs-09-sales-stalled-deal.png",
    "body": "<img src=\"logos/cs-09-sales-stalled-deal.png\" alt=\"PeoplePath logo\" width=\"120\" align=\"right\" />\n\n# Stalled Deal: How Do You Reactivate an 85k€ Deal After 3 Months of Silence?\n\n## Context\n\n**PeoplePath** is a B2B SaaS for HR Tech (Performance Management + Employee Engagement). Pricing model: €15 per employee per month, typical deals €15k–€80k ACV. You are an **Account Executive** for Mid-Market accounts (200–2,000 employees) in DACH.\n\nSince February, you've been negotiating with **Bergmann Logistics GmbH**, a family-owned company with 480 employees and 9 locations in Germany. ACV at full rollout: approximately **€85,000**. This deal would be your largest Q3 close.\n\n**Today is April 18th. Your last contact with the customer was January 12th.** Radio silence since then.\n\n## Your Role\n\nYour VP Sales has moved the deal in the forecast from \"Commit\" to \"Best Case.\" You have 2 weeks to either reactivate the deal or close it cleanly (lost). Today you want to take concrete action.\n\n## Starting Position — Email History (summarized)\n\n**October 15th** — Initial contact via inbound; COO Thomas Bergmann (57) writes:\n> \"Good recommendation from my network. We have 480 employees across 9 locations. Our current tool (SuccessFactors) is expensive and barely used. When can we schedule a first conversation?\"\n\n**November 4th** — First call. Your notes:\n> \"Thomas Bergmann (COO) + Michaela Hensel (HR Director, 42). Main pain point: SAP SuccessFactors too complex, employees not completing performance reviews. Budget trigger: new contract must be signed by Q2, otherwise SuccessFactors auto-renews for 12 more months.\"\n\n**November 22nd** — Demo with expanded group (+3 department heads). Feedback positive.\n\n**December 9th** — Proposal sent: €85,400 ACV, 3-year contract, €12/employee/month (20% discount to list price).\n\n**January 12th** — Michaela responds:\n> \"Hello [Name], the proposal is with the CEO. We're dealing with many internal matters right now (reorganization). I'll reach out once I have feedback. Best regards.\"\n\n**Your follow-ups:** January 23rd, February 7th, March 4th, March 27th — all unanswered.\n\n**Additional intel you have or can get:**\n\n- LinkedIn check: Thomas Bergmann shared 3 posts about \"digital transformation in family businesses\" in the last 4 weeks\n- One employee (Operations Team Lead) left a short comment on your product post on LinkedIn\n- Your SDR discovered: Bergmann Logistics hired a new \"Chief People Officer\" (CPO) last month, external hire, Markus Vogel (45), formerly HR Director at DHL\n- The reorganization news: public press release in February about merging two locations\n- SuccessFactors contract ends: **July 1st** (if not terminated by April 30th, it auto-renews)\n\n## Your Task\n\nIn 45 minutes:\n\n1. **Deal diagnosis**: What are the 3 most likely reasons for the silence? Rank by probability.\n2. **Stakeholder update**: What has changed in the customer organization since January? Who is now the key decision-maker? Who was it before? Who's in between?\n3. **Re-engagement email**: Write the email you're sending now — to whom? What tone? What hook? (Max. 120 words)\n4. **Next 3 actions** (after the email, if they respond or don't respond)\n5. **Negotiation position**: What concessions do you walk in with for a final negotiation? When do you *not* lower the price?\n6. **Worst case**: If the deal is lost — what do you learn that changes your approach in the next similar deal?\n\n## Guiding Questions\n\n- New CPO Markus Vogel is probably the decision-maker now. Do you approach him directly or go through Michaela? What are the pros and cons?\n- April 30th is the SuccessFactors termination deadline — that's your strongest leverage point, but also sensitive. How do you use that without sounding like a hard-sell rep?\n- Thomas Bergmann publicly shares content about Digital Transformation. Do you use that as a hook (comment, DM) — or is that too forward?\n- When is it strategically better to cleanly \"kill\" a deal rather than artificially keep it alive and poison your forecast?\n\n## Match Info\n\n**Fits:** Account Executive (SMB / Mid-market), Sales Development Representative, Customer Success Manager, Technical Account Manager, Solutions Engineer, Revenue Operations Analyst, Business Development Analyst\n**Tests primarily:** Deal Understanding, Stakeholder Intelligence, Writing Competency, Strategic Instinct\n**Industry fit:** B2B SaaS, all industries with complex sales cycles"
  },
  {
    "id": "cs-10-podcast-scale",
    "title": "Scale a True-Crime Podcast: From 25k to 100k Listeners in 12 Months",
    "cluster": "media_production",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Podcast Producer",
      "Content Producer",
      "Video Producer",
      "Social Media Manager",
      "Music Marketing Associate",
      "Editorial Assistant",
      "Community Manager (gaming)",
      "Lifecycle / CRM Marketer",
      "Brand Marketer"
    ],
    "matchesFields": [
      "Design",
      "Marketing",
      "Research"
    ],
    "matchesIndustries": [
      "Media",
      "Arts"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "creator",
    "skillsTested": [
      "Content-Strategy",
      "Audience-Growth",
      "Format-Evolution",
      "Budget-Allocation"
    ],
    "companyName": "Akte Wahr",
    "logoUrl": "/company-logos/cs-10-podcast-scale.png",
    "body": "<img src=\"logos/cs-10-podcast-scale.png\" alt=\"Akte Wahr logo\" width=\"120\" align=\"right\" />\n\n# Scale a True-Crime Podcast: From 25k to 100k Listeners in 12 Months\n\n## Context\n\n**Akte Wahr** is an independent German true-crime podcast — 2 years old, 38 episodes. Host-moderator Sara Vogel (former crime reporter at NDR) produces every episode herself, investing 40+ hours per episode in research, interviews, and editing. New episode published weekly, 60–75 minutes each.\n\n**Current reach:** 25,000 downloads per episode (median), grown to 8,000 weekly active listeners. Strong core of loyal fans (70% listen to every episode). One advertising deal with a German insurance company running for 6 months (€1,500/episode). No other meaningful revenue.\n\n**The assignment:** A media investor has signaled interest in investing **€180,000 for 20% equity**, conditional on Akte Wahr reaching **100,000 weekly listeners within 12 months**. Sara has asked you to build the strategy.\n\n## Your Role\n\nYou are a **Podcast Producer / Audio Strategist** and would work with Sara as co-producer if the deal goes through. Today you're developing the strategy for the investor pitch — and realistically, for Sara herself.\n\n## Starting Position\n\n**Current format:**\n- Each episode = 1 case, mostly from Germany/Austria\n- Sara hosts solo, occasionally with expert interviews\n- Research-driven, high effort, \"rather serious style\" — not trashy crime\n- Published Sundays at 8:00 PM, weekly\n\n**Listener data:**\n- 68% female, 32% male\n- Core age 28–45\n- 52% listen via Spotify, 31% Apple, 17% other\n- NPS among core fans: +61 (very high)\n- Growth last 6 months: linear +4% per month\n\n**Competitive landscape DACH true crime:**\n- \"Mordlust\" (Studio Bummens): ~400k downloads/episode, weekly, 2-host dynamic\n- \"Zeit Verbrechen\": ~300k, produced by Die Zeit, structured format\n- \"Verbrechen von nebenan\": ~200k, Boris Rosenkranz, daily short formats\n- \"Weird Crimes\": ~150k, young, fresh, comedy-heavy\n- 20+ smaller independent podcasts in the segment\n\n**Budget distribution (you decide) — €180,000 total:**\nCurrently Sara produces everything herself, no marketing budget, no production support.\n\n## Your Task\n\nA **strategy document** (1.5 pages) with:\n\n1. **Growth thesis**: Which 2–3 levers really get Akte Wahr to 100k? Defend your thesis. (Not: \"more marketing, better SEO, TikTok\" — specific, prioritized strategic decisions.)\n2. **Format evolution**: Should the format change? (Length, host structure, publishing rhythm, episode types) — or does Sara stay with her core format and growth comes from elsewhere?\n3. **Distribution strategy**: Spotify-exclusive vs. broad distribution? Platform-specific strategies? YouTube as a second channel (video podcast)?\n4. **Budget allocation**: How do you distribute the €180k over 12 months and across categories? (Production, marketing, new roles, equipment, rights/research)\n5. **Milestones & risks**: What are the 3 quarterly milestones you measure against? What's the biggest risk factor?\n\n## Guiding Questions\n\n- What is Akte Wahr's **differentiation** against Mordlust (market leader) and Zeit Verbrechen (premium)? If there isn't one — can you hit 100k without creating one?\n- The segment has 20+ podcasts. The question isn't \"how do I make more true crime,\" it's \"what niche within true crime do I own?\" What's Sara's?\n- Linear +4%/month is organic growth. To reach 100k, you need **exponential** growth or a step-change (e.g., Spotify feature, mainstream press, virality). Which step-change is realistic?\n- Should Sara stop producing solo? That would be a fundamental identity shift — but maybe necessary.\n\n## Match Info\n\n**Fits:** Podcast Producer, Content Producer, Video Producer, Social Media Manager, Music Marketing Associate, Editorial Assistant, Community Manager, Lifecycle / CRM Marketer, Brand Marketer\n**Tests primarily:** Content-Strategy, Audience-Growth, Budget Trade-offs, Format-Thinking, Competitive Analysis\n**Industry fit:** Media, Podcast Industry, Creator Economy, any content-driven brand"
  },
  {
    "id": "cs-11-hotel-review-score",
    "title": "Hotel Reviews: From 4.1 to 4.6 Stars in 60 Days",
    "cluster": "hospitality",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Hotel Operations Analyst",
      "Revenue Management Analyst",
      "Travel Product Manager",
      "Destination Marketing Associate",
      "Event Manager (junior)",
      "Customer Experience Analyst",
      "Customer Success Manager"
    ],
    "matchesFields": [
      "Operations",
      "Customer"
    ],
    "matchesIndustries": [
      "Hospitality",
      "Consumer"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Root-Cause-Prioritization",
      "Operative Execution",
      "Fast Diagnosis",
      "Time-Bound Team Leadership"
    ],
    "companyName": "Hotel Villa Lindenhof",
    "logoUrl": "/company-logos/cs-11-hotel-review-score.png",
    "body": "<img src=\"logos/cs-11-hotel-review-score.png\" alt=\"Hotel Villa Lindenhof logo\" width=\"120\" align=\"right\" />\n\n# Hotel Reviews: From 4.1 to 4.6 Stars in 60 Days\n\n## Context\n\n**Hotel Villa Lindenhof** is a 48-room boutique hotel in Munich-Schwabing, positioned in the 4-star superior segment, ADR (Average Daily Rate) €215, average occupancy 78%. Target audience: business travelers Mon–Thu, leisure guests Fri–Sun. The hotel has a high proportion of repeat guests.\n\nThe Booking.com rating has been stuck at **4.1 out of 5** for 9 months. 18 months ago it was 4.6. The hotel chain that owns the property expects 4.5+ across its entire portfolio. The previous GM was replaced 4 weeks ago — **you** have been in the role for 4 weeks.\n\n## Your Role\n\nYou are the **General Manager**. The chain director has given you 60 days to show visible improvement in review scores. Your team: 32 employees across 5 departments (Reception, Housekeeping, F&B, Banqueting, Maintenance).\n\n## Starting Position\n\n**Review analysis of the last 180 days** (n = 412 ratings on Booking/Google/HolidayCheck):\n\n| Category | % of Complaints | Typical Comments |\n|---|---|---|\n| Breakfast | **42%** | \"Selection limited\", \"cold scrambled eggs\", \"coffee quality\" |\n| Check-in wait time | **28%** | \"15+ minute wait\", \"only one person at desk\" |\n| WiFi stability | 11% | \"Drops frequently on 4th floor\" |\n| Room cleanliness | 8% | \"Hair in bathroom\", \"dust on window sills\" |\n| AC/Heating | 6% | \"too loud\", \"slow to adjust\" |\n| Other | 5% | |\n\n**Operational facts:**\n\n- **Breakfast** runs 6:30–10:30, currently 2 service staff + 1 kitchen staff in shifts. Buffet + à-la-carte eggs. Coffee from WMF 8000 machine. Budget per guest: €7.80.\n- **Reception** staffed 24/7, but during peak check-in (3:00–6:00 PM) only 1 person works, even though 40% of daily check-ins happen in this window.\n- **Housekeeping** was outsourced to external contractor 8 months ago (18% cost savings per year). Cleanliness issues began then.\n- **WiFi**: 4th floor routers flagged multiple times as problematic, but Maintenance hasn't budgeted for replacement.\n- **Turnover**: High turnover at reception (3 of 6 staff changed in last 12 months).\n- **Guest mix**: 62% business Mon–Thu, 38% leisure Fri–Sun. Breakfast complaints come 70% from business segment.\n\n**Your budget:** €25,000 ad-hoc investment capacity for 60 days, plus personnel decisions within your authority.\n\n## Your Task\n\n**1-page action plan** for the chain director:\n\n1. **Prioritization**: In what order do you tackle the pain points? Justify.\n2. **Top 5 concrete interventions** (implementable within 60 days), each with expected impact, budget, and ownership (who does it).\n3. **Quick wins in week one**: What do you do this week to signal visible improvement — for guests AND for your team?\n4. **Metrics**: Besides overall rating — which 2–3 leading indicators are you tracking from day 1 to show your interventions are working before reviews change?\n5. **What you do NOT tackle immediately** and why (show prioritization discipline).\n\n## Guiding Questions\n\n- 42% of complaints target breakfast. Is that a quality problem, an expectation-management problem, or a process problem? Your diagnosis determines your intervention.\n- Housekeeping outsourcing saves 18% — but now costs reviews. Do you touch this decision (terminate contract? Insource?)? Or is that outside your scope in 60 days?\n- Check-in congestion is classic staffing problem with a clear fix. Why didn't your predecessor solve it — and what's different about your approach?\n- How much does high turnover at reception affect review scores — and is that a culture/leadership failure you need to address?\n\n## Match Info\n\n**Fits:** Hotel Operations Analyst, Revenue Management Analyst, Travel Product Manager, Destination Marketing Associate, Event Manager (junior), Customer Experience Analyst, Customer Success Manager\n**Tests primarily:** Prioritization, Operative Diagnosis, Fast Action, Time-Bound Team Leadership\n**Industry fit:** Hospitality, Travel, any customer-centric operative role with clear service component"
  },
  {
    "id": "cs-12-consulting-cost-reduction",
    "title": "€200M Cost Reduction in 18 Months: Plan Phase 1 Diagnosis",
    "cluster": "consulting",
    "duration": "medium",
    "estimatedMinutes": 55,
    "matchesRoles": [
      "Business Analyst (MBB-style)",
      "Associate Consultant (tier-2)",
      "Implementation Consultant",
      "Operations Consultant",
      "Digital Transformation Analyst",
      "Corporate Strategy Analyst",
      "Transformation Associate",
      "M&A Integration Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Product",
      "Operations"
    ],
    "matchesIndustries": [
      "Services",
      "Industrial",
      "Consumer"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Problem-Structuring",
      "Hypothesis-Thinking",
      "Work-plan-Design",
      "Stakeholder-Balance"
    ],
    "companyName": "BGM Group",
    "logoUrl": "/company-logos/cs-12-consulting-cost-reduction.png",
    "body": "<img src=\"logos/cs-12-consulting-cost-reduction.png\" alt=\"BGM Group logo\" width=\"120\" align=\"right\" />\n\n# €200M Cost Reduction in 18 Months: Plan Phase 1 Diagnosis\n\n## Context\n\n**BGM Group** is a mid-sized European industrial conglomerate headquartered in Düsseldorf. Three divisions: *Automotive Components* (55% revenue), *Industrial Tools* (28%), *After-Sales Services* (17%). Group revenue: €2.1B, 11,400 employees, 34 locations in 9 countries.\n\n**The situation:** EBIT margin fell from 9.2% to 6.1% in 2 years. Industry benchmark is 11%. The board has launched a cost reduction plan: **€200M in 18 months**. Your consulting firm was hired to structure and support the program.\n\n## Your Role\n\nYou are an **Associate Consultant** (year 2). Your Engagement Manager (3 years senior, €500M restructuring experience) just asked you to draft an **8-week Phase 1 Diagnosis Plan** by tomorrow morning. Team: you, EM, one Senior Partner (advisory), 1 Analyst (arriving tomorrow), 4 people total on-site with client.\n\nPhase 1 goal: **identify and prioritize opportunity hypotheses** — roughly: \"Where is the €200M, and which levers are most probable?\"\n\n## Starting Position\n\n**What you know about the client (from pre-engagement):**\n\n- Automotive Components supplies German OEMs (BMW, Audi, Ford), strong price pressure since 2022\n- Industrial Tools more profitable (EBIT 9%), but competing with Asian manufacturers\n- After-Sales Services: growing fast, but low margins, high fixed-cost ratio\n- 34 locations: 8 in Eastern Europe, 6 in Asia, rest in Western Europe\n- Personnel costs: 38% of total costs\n- Material costs: 42%\n- Sales/Marketing: 8%\n- Admin/Overhead: 12%\n- Last major restructuring: 2017, achieved €80M reduction then\n\n**Critical stakeholder intel:**\n\n- CEO (Hans-Peter Krüger, 58) in role 4 years, strategically strong, wants \"deep\" change but no mass layoffs — works council is influential\n- CFO (Claudia Weiss, 47) is your main contact, data-driven, impatient\n- 3 division heads politically divided: Automotive head defends his turf, Industrial Tools head sees himself as overperforming and won't \"bleed out,\" Services head aggressive on margin\n- Works council already sent a letter: \"We expect social responsibility\"\n\n**What your firm typically delivers in Phase 1:**\n\n- Cost baseline (where the money is today)\n- Benchmark comparison (vs. industry, vs. peers)\n- Opportunity longlist (20–40 hypotheses)\n- Prioritized shortlist (Top 8–12 levers for Phase 2)\n- Phase 2 work plan\n\n**Your Phase 1 time & resources:**\n- 8 weeks\n- 4 consultants on-site (you + EM + Senior + Analyst)\n- Access to all relevant data (via CFO)\n- 2 steering committee workshops (week 4 and week 8)\n\n## Your Task\n\nDesign the **Phase 1 work plan** for tomorrow:\n\n1. **Hypothesis tree**: Where is €200M likely hiding? Structure the opportunity landscape into 4–6 major blocks (e.g., Material, Personnel, Production, Overhead, Portfolio). Per block: 2–3 specific hypotheses.\n2. **8-week roadmap** with milestones. What happens each week? What are the 2 workshop objectives?\n3. **Data requirements list** to client (top 10 data points you need week 1 to get productive)\n4. **Interview plan**: Who do you need to talk to in weeks 1–3, in what order? (Hierarchy matters: you don't talk to CEO first. Why?)\n5. **Risk list**: What are the 3 biggest risks to Phase 1 (political, data, timing), and how do you address them?\n6. **Communication framework**: How do you handle the works council letter and the political division heads? What language does the team use in week 1 — \"cost reduction\" or something else?\n\n## Guiding Questions\n\n- Do you look at Materials (biggest block) or Personnel (most emotionally sensitive) first? Your sequencing sends signals to the organization.\n- Portfolio questions (\"do we really need all 34 locations?\") are high-stakes. Do they belong in Phase 1 or Phase 2? What's the analytical vs. political reasoning?\n- How do you prevent division heads from becoming gatekeepers who only feed you \"friendly\" data?\n- What **quick wins** could you land in Phase 1 to give the board momentum — and what risk does that create?\n- How do you turn the works council into an ally rather than adversary?\n\n## Match Info\n\n**Fits:** Business Analyst (MBB-style), Associate Consultant, Implementation Consultant, Operations Consultant, Digital Transformation Analyst, Corporate Strategy Analyst, Transformation Associate, M&A Integration Analyst\n**Tests primarily:** Structured Thinking, Hypothesis Generation, Work-plan Design, Political Intelligence\n**Industry fit:** Consulting (all tiers), Corporate Strategy, Transformation"
  },
  {
    "id": "cs-13-swe-build-vs-buy",
    "title": "Build vs. Buy: Own Search Engine or Integrate Algolia?",
    "cluster": "engineering",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Software Engineer (Backend)",
      "Software Engineer (Full-stack)",
      "Technical Product Manager",
      "DevOps Engineer",
      "Site Reliability Engineer",
      "Data Engineer",
      "Mobile Developer",
      "Technical Account Manager"
    ],
    "matchesFields": [
      "Engineering",
      "Product"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Finance"
    ],
    "matchesMode": "deep",
    "matchesOutput": "creator",
    "skillsTested": [
      "Architecture Trade-offs",
      "Cost-Benefit Analysis",
      "Technical Writing",
      "Pragmatism vs. Engineering Ambition"
    ],
    "companyName": "MarktLab",
    "logoUrl": "/company-logos/cs-13-swe-build-vs-buy.png",
    "body": "<img src=\"logos/cs-13-swe-build-vs-buy.png\" alt=\"MarktLab logo\" width=\"120\" align=\"right\" />\n\n# Build vs. Buy: Own Search Engine or Integrate Algolia?\n\n## Context\n\n**MarktLab** is a B2B marketplace for industrial wholesalers in DACH. Scale-up, 60 developers, €30M ARR, PostgreSQL-based, Next.js web app. Platform hosts 180,000 products from 400 suppliers, averaging 12 attributes per product.\n\nCurrent search runs on PostgreSQL Full-Text-Search. User feedback: **poor relevance, no faceted filters, slow on complex queries**. Conversion on search results sits at 3.2% — industry benchmark: 8%+.\n\nCPO has tasked Engineering: better search must go live in 6 months.\n\n## Your Role\n\nYou are a **Senior Software Engineer** on the Platform team. Your Tech Lead asked you to submit a **Decision Doc**: Do we build search ourselves on Elasticsearch/OpenSearch, or buy Algolia/Typesense? Leadership team decides tomorrow afternoon based on your paper.\n\n## Starting Position\n\n**Team & resources:**\n- 2 Senior Engineers (including you) could lead this project\n- Additional 0.5 SRE capacity for infrastructure\n- Budget: up to €120k in year 1, beyond that needs CFO sign-off\n\n**Candidates:**\n\n| Option | Type | Pros | Cons |\n|---|---|---|---|\n| Elasticsearch (self-hosted) | Build | Full control, no vendor lock-in | Ops burden, cluster tuning, 3–6 month build |\n| Algolia | Buy (SaaS) | Live in 4–6 weeks, top search relevance out-of-box | €24k–€60k/year depending on traffic, vendor lock-in |\n| Typesense (self-hosted) | Build-light | Open-source, faster deploy than ES | Less mature, smaller community |\n| Pinecone / Weaviate (Vector) | Exotic | Semantic search possible | Overkill for current use case |\n\n**Requirements from PM:**\n- Faceted search (brand, price, lead time, category)\n- Typo tolerance\n- Autocomplete\n- Sub-200ms P95 latency\n- Admin interface for relevance tuning\n- Multilingual (DE, EN — later IT, FR)\n\n**Technical reality at MarktLab:**\n- DevOps team is 2 people, currently no capacity for Elasticsearch cluster\n- Product data updated 4x daily from supplier feeds (ETL via Airflow)\n- No existing message queue; events run via DB polling\n- Leadership allergic to \"6-month engineering projects\" — last internal build took 14 months and was later replaced with SaaS\n\n## Your Task\n\nDeliver a **2-page decision doc**:\n\n1. **Recommendation** (first page, first paragraph — not at the end). Which option, why, in 3 sentences.\n2. **Trade-off matrix**: 3 realistic options (cut ones you don't take seriously) against 5–6 criteria: Time-to-Value, 3-year TCO, Ops Burden, Relevance Quality, Flexibility, Risk.\n3. **Cost calculation**: 3-year TCO model (effort + infrastructure + licenses) for your recommended option.\n4. **Migration plan** (rough phases, no Jira tickets): How do we get from PostgreSQL-FTS to the new solution without downtime?\n5. **Risks & open questions**: What don't you know yet, and how do you de-risk it?\n\n## Guiding Questions\n\n- What's the riskiest assumption in your proposal? If it's wrong, what does it cost?\n- Leadership is \"allergic\" to long build projects. How much does that bias your purely technical recommendation — and is it legitimate?\n- Algolia costs maybe €150k over 3 years. Two senior engineers for 6 months cost fully loaded ~€250k. Why do engineers often still think \"we'll build it ourselves\"?\n- What's **reversible vs. irreversible** here? If Algolia triples in price in 2 years, how quickly can you exit?\n- What would you deliberately *not* do, even if others suggest it (e.g., vector DB for \"AI search\" because it's trendy)?\n\n## Match Info\n\n**Fits:** Software Engineer (Backend / Full-stack), Technical Product Manager, DevOps Engineer, Site Reliability Engineer, Data Engineer, Mobile Developer, Technical Account Manager\n**Tests primarily:** Architecture Judgment, Business Awareness, Technical Writing, Pragmatism\n**Industry fit:** Tech, SaaS, all data-intensive platforms"
  },
  {
    "id": "cs-14-ml-production-tradeoff",
    "title": "New Recommender Model: 3% Better Metric, Double Latency — Deploy?",
    "cluster": "engineering",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Machine Learning Engineer",
      "Data Scientist",
      "Software Engineer (Backend)",
      "Data Engineer",
      "Analytics Engineer",
      "Technical Product Manager"
    ],
    "matchesFields": [
      "Engineering",
      "Data",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Media"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Offline-Online-Gap Understanding",
      "A/B-Test-Design",
      "System-Performance Trade-offs",
      "Stakeholder Communication of ML Metrics"
    ],
    "companyName": "ReadWave",
    "logoUrl": "/company-logos/cs-14-ml-production-tradeoff.png",
    "body": "<img src=\"logos/cs-14-ml-production-tradeoff.png\" alt=\"ReadWave logo\" width=\"120\" align=\"right\" />\n\n# New Recommender Model: 3% Better Metric, Double Latency — Deploy?\n\n## Context\n\n**ReadWave** is a streaming platform for audiobooks and podcasts in DACH. 2.8 million active users, €42M ARR. The personalization engine drives 60% of all play events — recommendations on the homepage, in the \"Keep Listening\" feed, and in push notifications.\n\nThe current production model is a Two-Tower Neural Net (retrieval) + Gradient-Boosted-Trees (ranking), live for 18 months. The ML team built a new **Transformer-based candidate**.\n\n## Your Role\n\nYou are a **Senior ML Engineer** who built the new model. Tomorrow is a decision meeting with Head of ML, Head of Product, and VP Engineering: **Deploy yes or no?**\n\n## Starting Position — The Numbers\n\n**Offline evaluation** (holdout over 4 weeks, n=12M interactions):\n\n| Metric | Baseline | New Model | Delta |\n|---|---|---|---|\n| Recall@20 | 0.312 | 0.327 | **+4.8%** |\n| NDCG@10 | 0.418 | 0.441 | **+5.5%** |\n| Diversity-Score (Intra-List) | 0.61 | 0.54 | **-11.5%** |\n| CTR-predicted | 0.093 | 0.096 | +3.2% |\n\n**Production constraints:**\n\n| | Baseline | New |\n|---|---|---|\n| P50 Latency | 34 ms | **78 ms** |\n| P95 Latency | 68 ms | **142 ms** |\n| Inference cost / 1M calls | €2.10 | **€6.40** |\n| Model size | 180 MB | **1.2 GB** |\n| Monthly inference budget now | €28k | projected €85k |\n\n**Organizational context signals:**\n- Head of Product has Q2 OKR: \"Session-Time +8%\" — pressure on ML team rising\n- VP Engineering just finished budget discussions, will eye +300% inference budget skeptically\n- SRE team reported last week: current GPU instance is at 72% utilization — more inference load needs capacity planning\n- Analytics team has fragmentary doubts: Diversity drop could harm long-term user retention (filter-bubble effect)\n- 2 years ago, similar launch looked good offline but went negative in A/B test (+costs, -retention)\n\n## Your Task\n\nPrepare for tomorrow:\n\n1. **Your recommendation** in **one sentence** (not \"it depends\"). Justification follows.\n2. **A/B-test design**, if you recommend testing: Traffic %, duration, guardrails (auto-stop criteria)? Primary and secondary metrics?\n3. **Offline-to-online gap plan**: Which 3 things could go wrong between offline evaluation and online behavior? How do you address them before launch?\n4. **Cost optimization** (only if relevant): If latency/cost are the blocker — what are 2 realistic ways to make the model cheaper before launch? (Distillation, quantization, caching, candidate-retrieval changes)\n5. **Kill criteria**: Under what A/B-test results do you abort and kill the project?\n\n## Guiding Questions\n\n- Offline metrics are *proxies* for online behavior. Which of your offline metrics has the weakest track record correlating with business metrics (session time, retention)?\n- The diversity drop is -11.5% — sounds like a filter bubble. Is that a feature (more relevance → better engagement) or a bug (users see too much similarity, lose interest)?\n- Head of Product needs a win. How do you keep that pressure from distorting your technical judgment?\n- +300% inference budget: What ROI case do you show VP Engineering to get approval?\n- What's a **middle option** — not \"deploy\" or \"kill\", but something like \"deploy to power users only,\" \"hybrid model,\" \"distilled model\"?\n\n## Match Info\n\n**Fits:** Machine Learning Engineer, Data Scientist, Software Engineer (Backend), Data Engineer, Analytics Engineer, Technical Product Manager\n**Tests primarily:** ML Engineering Judgment, System Thinking, Business Translation, Risk Management\n**Industry fit:** Tech platforms with personalization, Streaming, E-Commerce, Ad-Tech"
  },
  {
    "id": "cs-15-ib-valuation-ma",
    "title": "M&A Valuation: What is a mid-market logistics company worth?",
    "cluster": "finance_banking",
    "duration": "medium",
    "estimatedMinutes": 55,
    "matchesRoles": [
      "Analyst (M&A, ECM, DCM)",
      "Coverage Analyst (Sector)",
      "Leveraged Finance Analyst",
      "Private Equity Analyst",
      "Associate (investment team)",
      "Corporate Development Analyst",
      "M&A Integration Analyst",
      "Restructuring Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Finance",
      "Services",
      "Industrial",
      "Mobility"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Valuation methods (DCF, Trading/Transaction Multiples)",
      "Industry analysis",
      "Sensitivity thinking",
      "Investment case storytelling"
    ],
    "companyName": "TransBavaria",
    "logoUrl": "/company-logos/cs-15-ib-valuation-ma.png",
    "body": "<img src=\"logos/cs-15-ib-valuation-ma.png\" alt=\"TransBavaria logo\" width=\"120\" align=\"right\" />\n\n# M&A Valuation: What is a mid-market logistics company worth?\n\n## Context\n\nYour boutique investment bank (40 professionals, DACH mid-market focus) advises **TransBavaria GmbH**, a southern German logistics company (€380M revenue, EBITDA €48M, 2,200 employees). TransBavaria wants to acquire **Nordland Spedition** — 62 years old, family-owned, northern Germany focused, €140M revenue, EBITDA €18M, 780 employees. Strategic fit: geographic complementarity, cross-selling potential, economies of scale.\n\nThe Nordland family ownership wants to sell. The son doesn't want to take over, the founder is 74 and tired. A structured auction process is announced — 4 more bidders expected (2 strategics, 2 PE funds).\n\n## Your Role\n\nYou are an **Analyst** in your first year. The Director set you on the first indicative offer this morning: by Thursday (4 days) you need a **valuation range** with reasoning. The offer will be submitted next week.\n\n## Background\n\n**Nordland Spedition — Quick Profile (from info memo):**\n\n- Revenue: €140M (+4% CAGR 5y)\n- EBITDA: €18M (12.9% margin, stable)\n- EBIT: €12M (after depreciation on 280 trucks and 4 logistics hubs)\n- Net debt: €22M\n- Working capital: 14% of revenue\n- Capex: €9M p.a. (fleet replacement)\n- Main customers: 3 large industrial groups, 38% of revenue (concentration risk)\n- Locations: 4 logistics hubs (Hamburg, Bremen, Hannover, Leipzig), all leased\n- Unionization: 68% of workforce covered by collective bargaining agreements\n- EBITDA 2020: €11M (Covid dip, current level is peak)\n\n**Market Context:**\n\n- German logistics industry currently growing stagnant (~1-2% real p.a.)\n- Consolidation wave since 2022, 14 larger deals in DACH\n- Average multiples in comparable transactions (your team's database): 6.5x–8.5x EBITDA for mid-market\n- Large groups (DHL, Kühne+Nagel) have recently paid 9x–11x, but for strategically much more relevant assets\n- Cost drivers in the industry: diesel, driver shortage, insurance (+8-12% p.a.)\n\n**TransBavaria's Strategy:**\n\n- Synergies estimated at €6M EBITDA p.a. (€3M operations, €2M procurement, €1M admin)\n- Synergy realization: Year 1 30%, Year 2 70%, Year 3 100%\n- One-off integration costs: €8M\n- TransBavaria financing: 50% cash, 50% debt (5.5% interest)\n\n## Your Task\n\n**Valuation Document (3 pages)** for the Director:\n\n1. **Standalone value of Nordland** — DCF and multiple valuation, derive range.\n2. **Synergy case**: What would the synergies really be worth (NPV), after risk adjustment?\n3. **Total valuation range** (standalone + shared synergies). Explain why the buyer shouldn't/won't pay full synergy value.\n4. **Sensitivity**: Which 3 assumptions drive your valuation most strongly, and what happens with +/- 20% change?\n5. **Recommended initial offer**: What number would you give the Director, and with what reasoning do you present it to TransBavaria?\n6. **Red flags**: 3 things that must be clarified urgently in due diligence before a binding offer is submitted.\n\n## Guiding Questions\n\n- EBITDA 2020 was €11M, 2024 €18M. Is the current level a *sustainable* level or a cyclical peak? How do you adjust for this?\n- 38% revenue from 3 customers — what is that worth in the valuation? Discount? How much?\n- If 4 more bidders submit offers (including PE), how does that affect your initial offer? Do you bid high and bleed in DD, or stay disciplined and risk being outbid?\n- Which synergies should a disciplined buyer team *not* factor into price (e.g., revenue synergies that are purely hypothetical)?\n- Family ownership can bring soft factors (e.g., \"the right buyer\") — but the Director will ask you for numbers. How do you represent the soft factor in your range?\n\n## Match Info\n\n**Case fits:** M&A Analyst, Coverage Analyst, Leveraged Finance Analyst, Private Equity Analyst, Associate (investment team), Corporate Development Analyst, M&A Integration Analyst, Restructuring Analyst\n**Tests primarily:** Classic finance analysis, modelling discipline, storytelling for investment cases\n**Industry fit:** Investment Banking, Private Equity, Corporate Development, Strategy Consulting"
  },
  {
    "id": "cs-16-fpa-forecast-revision",
    "title": "Business Unit 8% Below Forecast: Year-End View in 20 Minutes",
    "cluster": "finance_banking",
    "duration": "short",
    "estimatedMinutes": 20,
    "matchesRoles": [
      "FP&A Analyst",
      "Treasury Analyst",
      "Corporate Development Analyst",
      "Financial Advisor (junior)",
      "Business Operations Analyst",
      "Corporate Strategy Analyst",
      "Investor Relations Associate"
    ],
    "matchesFields": [
      "Finance",
      "Data"
    ],
    "matchesIndustries": [
      "Consumer",
      "Industrial",
      "Services",
      "Tech"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Variance analysis",
      "Forecast logic",
      "Business partnering",
      "Executive communication"
    ],
    "companyName": "VeltaCorp",
    "logoUrl": "/company-logos/cs-16-fpa-forecast-revision.png",
    "body": "<img src=\"logos/cs-16-fpa-forecast-revision.png\" alt=\"VeltaCorp logo\" width=\"120\" align=\"right\" />\n\n# Business Unit 8% Below Forecast: Year-End View in 20 Minutes\n\n## Context\n\n**VeltaCorp** is a European household appliances group (€3.8B revenue, 8 business units). You are **Senior FP&A Analyst** and own the **Small Appliances** business unit (€620M revenue, €62M EBIT — coffee makers, kettles, vacuums for the mid-market).\n\nToday is October 18. Q3 results are in: The BU is **8% below the budget forecast** on revenue, EBIT is even 14% below. Tomorrow at 9:00 there's the monthly business review call with the CFO. He expects an updated year-end view (YEV) and clear answers on what happened and what comes in Q4.\n\n## Your Role\n\nYou have today 20 minutes between other commitments to prepare your analysis and presentation. You've already had raw data and conversations with the Commercial Lead, Supply Chain Manager, and Pricing Manager. Now you need to synthesize.\n\n## Background\n\n**YTD Q3 Numbers (in €M):**\n\n| | Budget YTD Q3 | Actual YTD Q3 | Variance | % |\n|---|---|---|---|---|\n| Volume (Units) | 4.2M | 3.9M | -0.3M | **-7%** |\n| Avg Price | €142 | €148 | +€6 | **+4%** |\n| Revenue | 596 | 548 | -48 | **-8%** |\n| Rebates/Accruals | -42 | -56 | +14 | +33% |\n| Net Revenue | 554 | 492 | -62 | **-11%** |\n| COGS | -310 | -295 | -15 | -5% |\n| Gross Margin | 244 | 197 | -47 | **-19%** |\n| Gross Margin % | 44.0% | 40.0% | -4pp | |\n| OpEx | -152 | -149 | +3 | +2% |\n| EBIT | 92 | 48 | -44 | **-48%** |\n\n**Discussion Inputs:**\n\n*Commercial Lead Coffee Segment (42% BU revenue):*\n> \"The season is catastrophic. Consumer customers aren't buying new appliances; the replacement cycle has extended by 3 months. Amazon was the reason — they pushed their own brands and knocked us out of top placements. We counter-promoted, but the cost-per-conversion went through the roof.\"\n\n*Supply Chain Manager:*\n> \"We pre-ordered raw materials in Q2 on speculation because a supplier announced price increases. They didn't materialize. We're sitting on €22M inventory at expensive prices.\"\n\n*Pricing Manager:*\n> \"I implemented a 4% price increase to protect margin. That cost us volume. Was it the right call? No idea.\"\n\n*Commercial Lead Vacuum Segment (28% BU revenue):*\n> \"We're winning. +14% volume YoY, new line performing great. But coffee is dragging us down.\"\n\n**Q4 Context:**\n- Black Friday + Christmas = usually 38% of annual revenue\n- CFO has already signaled internally: \"We can't land another year 15%+ below EBIT target, otherwise it goes into the analyst call\"\n- The board expects year-end view this evening\n- A cost-reduction program was announced 4 weeks ago (€80M company-wide, ~€12M Small Appliances' share)\n\n## Your Task\n\nIn 20 minutes, for the 9:00 call:\n\n1. **3-line executive summary**: What happened, what's coming, what are you doing?\n2. **Variance analysis**: Break down the -€62M net revenue into volume / price / mix / rebates. Which driver dominates?\n3. **Revised year-end view**: Where will the BU land year-end on revenue and EBIT? With range (low / base / high), reasoning.\n4. **Q4 levers**: 3 concrete actions you're proposing to the CFO for approval — with impact estimate.\n5. **One question for the CFO**: What do you need from him that's outside your span of control?\n\n## Guiding Questions\n\n- Price +4%, volume -7% — that looks like classic price elasticity. Is that the *only* reason for volume loss (external market + Amazon)? How do you analytically separate them?\n- The €22M inventory is working-capital-bound, not EBIT-impact. Still — will that lead to write-downs in Q4?\n- Q4 is 38% of the year. If you forecast Q4 \"normally\", where does year-end land? Is that enough, or do you need Q4 outperformance?\n- The Pricing Manager asks: was it right? What's *your* assessment — and is it your role to answer that, or the Commercial Lead's?\n\n## Match Info\n\n**Case fits:** FP&A Analyst, Treasury Analyst, Corporate Development Analyst, Financial Advisor (junior), Business Operations Analyst, Corporate Strategy Analyst, Investor Relations Associate\n**Tests primarily:** Finance analysis under time pressure, executive communication, variance decomposition, forecast judgment\n**Industry fit:** Corporate finance in any larger industry, CPG, retail, industrial"
  },
  {
    "id": "cs-17-clinical-enrollment",
    "title": "Phase II Study: Enrollment 40% Below Plan — What Do You Do?",
    "cluster": "pharma_life_sciences",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Clinical Research Associate",
      "Clinical Operations Analyst",
      "R&D Project Coordinator",
      "Regulatory Affairs Associate",
      "Medical Affairs Associate",
      "Health Data Analyst",
      "Global Health Program Coordinator"
    ],
    "matchesFields": [
      "Research",
      "Operations"
    ],
    "matchesIndustries": [
      "Healthcare"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Multi-site coordination",
      "Problem diagnosis under regulatory constraints",
      "Stakeholder management (clinic, sponsor, patients)",
      "Risk-based thinking"
    ],
    "companyName": "Metrivus Therapeutics",
    "logoUrl": "/company-logos/cs-17-clinical-enrollment.png",
    "body": "<img src=\"logos/cs-17-clinical-enrollment.png\" alt=\"Metrivus Therapeutics logo\" width=\"120\" align=\"right\" />\n\n# Phase II Study: Enrollment 40% Below Plan — What Do You Do?\n\n## Context\n\n**Metrivus Therapeutics** is a German biotech company (Series C, 180 employees) with a drug candidate for therapy-resistant hypertension. The **Phase II study (METRIVUS-201)** has been running for 6 months, planned for 12 months total, at **12 clinics** in DACH + UK. Target: **200 patients** — current status: **80** (vs. plan 140).\n\nA Phase III start depends on clean Phase II completion; an investor round is planned for Q3 next year. The CEO is nervous.\n\n## Your Role\n\nYou are **Clinical Research Associate (CRA)** and study lead for METRIVUS-201. You manage the 12 sites, the external CRO (Contract Research Organization), the drug supply chain, and contact with ethics committees. Today at 4:00 pm there's a crisis call with the VP R&D, CMO, and Head of Clinical Operations at the CRO.\n\n## Background — Site Performance Matrix\n\n| Site | Country | Target Patients | Enrolled | % | Main Issue |\n|---|---|---|---|---|---|\n| Munich Clinic 1 | DE | 20 | 18 | 90% | none, running well |\n| Charité Berlin | DE | 25 | 22 | 88% | none |\n| UK Site 1 (London) | UK | 18 | 16 | 89% | none |\n| Vienna Clinic | AT | 15 | 11 | 73% | OK |\n| Hamburg Clinic | DE | 15 | 7 | 47% | Staffing bottleneck |\n| UK Site 2 (Leeds) | UK | 15 | 4 | 27% | Principal Investigator (PI) ill, deputy inactive |\n| Frankfurt Clinic | DE | 20 | 1 | 5% | Ethics approval delayed (4 months late activation) |\n| Düsseldorf Clinic | DE | 15 | 0 | 0% | Site not yet initiated (startup delay) |\n| 4 other sites | various | 57 | 1 | <5% | Recruitment issues (diverse) |\n\n**Root Cause Map (from your site visits):**\n- **Patient pool too small/competitive**: \"Therapy-resistant hypertension\" sees 3 other studies in DACH competing for the same patients\n- **Strict inclusion criteria**: Exclusion if >2 comorbidities, minimum age 40, BMI <35 — in reality many candidates drop out\n- **Cumbersome screening process**: 14-day washout, then 3 clinic visits before randomization — many drop off early\n- **Site incentives**: Study payment per enrolled patient is below market rate; some sites prioritize more profitable studies\n- **CRO performance**: Uneven across sites, monitoring visits inconsistent\n\n**Regulatory Constraints:**\n- Protocol amendment (e.g., relaxing inclusion criteria) requires ethics re-approval, typically 8–12 weeks\n- Every change must be reported to BfArM/EMA/MHRA\n- Sample size is statistically justified — below 160 the study loses power\n\n## Your Task\n\nPrepare for the call (and as 2-page memo):\n\n1. **Root cause analysis**: Which 3 main causes drive the enrollment gap? Are they **operational** (solvable at site level), **protocol-based** (need amendment), or **structural** (patient pool)?\n2. **Action plan** (short / medium / long):\n   - **Quick wins (2–4 weeks)**: What works without amendment?\n   - **Medium term (2–3 months)**: What works with amendment or organizational changes?\n   - **Last resort**: When would you consider adding more sites or moving to another country?\n3. **Site prioritization**: Which sites get more support (monitoring, recruitment support), which do you potentially close — and why?\n4. **Timeline impact**: Does the study still hit the original window? If not — how much realistically does it shift?\n5. **Communication to CEO/Board**: One-sentence message for the investor update presentation next month. Honest, but not panic-inducing.\n\n## Guiding Questions\n\n- Protocol amendment would be the \"big lever,\" but costs 8–12 weeks of regulatory time. When is it more valuable than the time loss?\n- If you close Frankfurt (5%) and Düsseldorf (0%) — how much budget would you free up, and where would you invest it?\n- Is \"raise site incentives\" a legitimate solution? What ethical/regulatory boundaries exist?\n- How do you work with the two strong sites (Munich 1, Charité), which are already nearly full — should they over-enroll? That creates concentration risk.\n- The CMO wants a quick fix. What do you tell him if the honest answer is: \"This will take 4-6 months longer without compromising science\"?\n\n## Match Info\n\n**Case fits:** Clinical Research Associate, Clinical Operations Analyst, R&D Project Coordinator, Regulatory Affairs Associate, Medical Affairs Associate, Health Data Analyst, Global Health Program Coordinator\n**Tests primarily:** Operational problem-solving in regulated industry, multi-stakeholder coordination, trade-offs between speed/quality/compliance\n**Industry fit:** Pharma, biotech, medical devices, CROs, healthcare operations"
  },
  {
    "id": "cs-18-medical-reimbursement",
    "title": "Market Access: How Do You Get a Specialty Drug Into GKV Coverage?",
    "cluster": "pharma_life_sciences",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Medical Affairs Associate",
      "Market Access Analyst",
      "Pharma Brand Manager (junior)",
      "Regulatory Affairs Associate",
      "Health Policy Researcher",
      "Epidemiology Analyst",
      "Healthcare Strategy Associate"
    ],
    "matchesFields": [
      "Research",
      "Marketing",
      "Finance"
    ],
    "matchesIndustries": [
      "Healthcare",
      "Public"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Health-economic thinking",
      "Evidence strategy",
      "Stakeholder mapping (payer, G-BA, clinic)",
      "Negotiation preparation"
    ],
    "companyName": "Nordelia Pharma",
    "logoUrl": "/company-logos/cs-18-medical-reimbursement.png",
    "body": "<img src=\"logos/cs-18-medical-reimbursement.png\" alt=\"Nordelia Pharma logo\" width=\"120\" align=\"right\" />\n\n# Market Access: How Do You Get a Specialty Drug Into GKV Coverage?\n\n## Context\n\n**Nordelia Pharma** is a mid-sized European pharma player. In 8 weeks, the German launch of **Beloxavir** — a drug for a rare autoimmune disease (prevalence: ~12,000 affected in Germany, currently split across 5 treatment alternatives, none with all of Beloxavir's advantages).\n\nClinical data are strong: 43% higher remission rate vs. standard of care, better safety profile. **List price: €96,000 per patient per year.** Early benefit assessment by G-BA is running in parallel. Without a positive added benefit decision, the price will be dramatically cut after 12 months — many comparable launches have failed at this point.\n\n## Your Role\n\nYou are **Market Access Associate** on the German launch team. You report to the Market Access Director, work closely with Medical Affairs, Brand, Pricing, and HEOR (Health Economics & Outcomes Research). Today you're sitting down on the **8-week pre-launch market access plan**.\n\n## Background\n\n**The Payer Landscape in Germany:**\n\n- **G-BA (Federal Joint Committee)** — decides on added benefit, indirectly on reimbursement level. AMNOG process runs in parallel; dossier submission deadline: 3 weeks after launch\n- **GKV-Spitzenverband** (sickness fund umbrella) — negotiates reimbursement amount after G-BA decision\n- **Large GKV funds** (TK, Barmer, AOK Group, DAK) — have own therapeutic committees, indirectly influence prescribing behavior\n- **PKV** (private insurance) — small market for this indication (<15% of patients)\n\n**Your Evidence Base Today:**\n\n- Two Phase III studies (n=420, n=510), both successful\n- Head-to-head vs. standard of care in only one study — against the most commonly prescribed drug, not all 5 alternatives\n- Quality-of-life data (SF-36, EQ-5D) present, show significant improvement\n- **Missing**: Real German healthcare data, budget-impact model for a typical payer pool, QALY-based cost-effectiveness analysis\n\n**Competitive Context:**\n- 5 existing therapies, 3 considerably cheaper (€14k–€35k p.a.)\n- Two more drugs in Phase III, launch expected in 18–24 months\n- A biosimilar version of the current market leader coming in 9 months (will cost 30% less)\n\n**Internal Stakeholder Dynamics:**\n- Brand team pushing for aggressive positioning and maximum price points\n- HEOR warns: evidence base probably won't support \"substantial added benefit,\" realistically \"minor added benefit\"\n- Medical Affairs argues: we need to plan evidence generation in parallel (e.g., observational studies)\n- Global HQ sees Germany as \"reference price market\" — price below €80k would \"infect\" other countries\n\n## Your Task\n\nDesign an **8-week pre-launch market access plan**:\n\n1. **Value story skeleton**: What is the central clinical-economic story you tell payers? (3–4 core arguments, no PR fluff)\n2. **Evidence gap analysis**: What's missing from your evidence base for a strong G-BA case? What can be addressed in 8 weeks, what only post-launch?\n3. **Stakeholder plan**:\n   - G-BA / IQWiG: What documentation, what argument?\n   - Top 5 GKV funds: Which pre-launch conversations, what materials?\n   - Clinical opinion leaders: How do you win them as allies without compliance risk?\n4. **Pricing position**: How do you defend the €96k? What discount would you realistically concede? Below what price floor does the launch become unprofitable?\n5. **Risk scenarios**: What is the **downside case** (G-BA: no added benefit)? What is your plan B?\n\n## Guiding Questions\n\n- G-BA judges *added benefit*, not price directly. Still, that judgment correlates with reimbursement level. What's the most realistic added benefit score you can expect — and how does it affect the price negotiation anchor?\n- Head-to-head exists only against *one* of 5 competitors. Is that sufficient, or do you need to submit an indirect treatment comparison (ITC)?\n- Budget impact for a fund like TK: 12,000 patients × estimated market share 30% × €96k = €345M. For *one* drug. Is that realistic to push through, or are you forced to negotiate price aggressively early?\n- The global HQ \"reference price logic\" is a classic internal-external tension. How do you protect the German case without endangering other markets?\n- If the biosimilar launches in 9 months — does that mean you need an alternative positioning strategy (e.g., focus on first-line vs. second-line therapy)?\n\n## Match Info\n\n**Case fits:** Medical Affairs Associate, Market Access Analyst, Pharma Brand Manager, Regulatory Affairs Associate, Health Policy Researcher, Epidemiology Analyst, Healthcare Strategy Associate\n**Tests primarily:** Health-economics intuition, regulatory thinking, stakeholder orchestration, strategic preparation\n**Industry fit:** Pharma, medical devices, digital health, all roles at the intersection of healthcare + commercial"
  },
  {
    "id": "cs-19-creative-director-ev-launch",
    "title": "EV Launch: Creative Masterframe for a Legacy Brand",
    "cluster": "creative_advertising",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Creative Copywriter",
      "Strategist / Planner",
      "Account Executive (agency)",
      "Media Planner",
      "Brand Marketer",
      "Content Marketer",
      "Social Media Manager",
      "Assistant Brand Manager"
    ],
    "matchesFields": [
      "Design",
      "Marketing"
    ],
    "matchesIndustries": [
      "Media",
      "Services",
      "Consumer",
      "Mobility"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "creator",
    "skillsTested": [
      "Brand narrative development",
      "Channel orchestration",
      "Tension between tradition and innovation",
      "Presentation structure"
    ],
    "companyName": "Heidemann Automobile",
    "logoUrl": "/company-logos/cs-19-creative-director-ev-launch.png",
    "body": "<img src=\"logos/cs-19-creative-director-ev-launch.png\" alt=\"Heidemann Automobile logo\" width=\"120\" align=\"right\" />\n\n# EV Launch: Creative Masterframe for a Legacy Brand\n\n## Context\n\n**Heidemann Automobile** is a German automotive brand with 96 years of history. Core identity: premium, craftsmanship, restraint, established customer base (avg. age 56, 67% male). The brand has survived decades with combustion engines; many longtime customers are skeptical about e-mobility.\n\nIn 7 months, Heidemann launches the **H-1 Electric** — its first fully electric model, positioned as \"the flagship of the new era.\" Price: €89,000 base, positioning: premium e-SUV, target audience expansion 15 years younger + 40% more women. Campaign budget: **€14M** over 12 months.\n\nYour agency **Stern & Holler** won the pitch.\n\n## Your Role\n\nYou are **Creative Director** at Stern & Holler. Your team: 3 copywriters, 2 art directors, 1 strategist, 1 digital lead. In 3 weeks is the kick-off meeting with the Heidemann board. You need a masterframe that you can defend to 8 marketing executives.\n\n## Background\n\n**Brand Brief Input from Heidemann:**\n\n- *\"We don't want to feel like a startup, but also not like we're out of touch.\"* — CMO in briefing\n- *\"Our loyal customers shouldn't feel betrayed. But we want new customers too.\"* — Head of Brand\n- *\"Our engineers are proud. The craftsmanship in Sindelfingen is still our differentiator.\"* — board member, Tech\n- *\"We're not Tesla. We're not Polestar. What are we?\"* — self-critical question from the CMO\n\n**Market Context:**\n\n- Tesla dominates EV narrative with \"Tech + Speed + Future\"\n- Polestar positions \"Nordic, minimalist, design-driven\"\n- BMW i-series: \"Joy of Electric Driving\"\n- Mercedes EQ: \"Luxury meets Electric\"\n- Porsche Taycan: \"Sports car, just electric\"\n- Chinese players (NIO, BYD) coming with aggressive pricing + premium quality\n- Trade press has portrayed German legacy brands as \"too late\" multiple times in the past 18 months\n\n**Target Audience Insights (research brief):**\n\n- Core loyal customers (56+): \"I've trusted Heidemann for 30 years. But can you trust an EV?\"\n- New target 40–55: high purchasing power, want premium + credibility, distrust \"tech hype,\" seek emotional connection beyond Tesla rationalism\n- Women as secondary target: \"EVs feel cold, design-focused, not emotional\"\n- Potential customers under 40: Heidemann not on their radar\n\n**Available Channels:**\n- TV (print, premium TV)\n- Cinema\n- OOH / Posters\n- Digital (YouTube, Meta, Programmatic, Connected TV)\n- Podcasts (premium formats)\n- Live events (launch event, motor shows)\n- Dealer materials (support role only)\n\n## Your Task\n\nIn a **kick-off deck (10–12 slides, full copy)**:\n\n1. **Brand positioning thesis** (1 slide): What 1-sentence positioning do you claim in the EV segment that isn't Tesla, Polestar, or Mercedes EQ?\n2. **Creative masterframe** (core idea): What central creative idea carries the campaign? Give it a name. 3–5 sentences describe the world it creates.\n3. **Key message hierarchy**:\n   - Primary message (1 sentence)\n   - 3 supporting messages\n   - Elevator pitch (20 seconds)\n4. **Manifesto copy** (150–200 words): Write the manifesto — the opening cinema spot or launch film. Real copy, not briefing language.\n5. **Channel architecture**: How does the concept unfold across 4–5 channels? (1 line per channel: idea + role in funnel)\n6. **Budget allocation** (rough): Where does how much of the €14M go, and why?\n7. **Risks**: 2 things that could make the concept fail — and how you address them.\n\n## Guiding Questions\n\n- The biggest creative risk: The concept either feels \"too traditional\" (old-fashioned) or \"too much future\" (betrays loyal customers). How do you solve this **in a single idea** — not through two parallel campaigns?\n- \"We're not Tesla, not Polestar\" — what is Heidemann *really*? Find the authentic answer, not the marketing invention.\n- Craftsmanship in Sindelfingen is an asset, but also a cliché. How do you make that a *contemporary* story without trivializing it?\n- The launch film is often what people actually remember. If a cinema viewer sees 60 seconds and takes away one image + one feeling — what is it?\n- Chinese manufacturers are threatening with price wars. Heidemann's EV is €89k. How do you position that *not as a price*, but as value?\n\n## Match Info\n\n**Case fits:** Creative Copywriter, Strategist / Planner, Account Executive (agency), Media Planner, Brand Marketer, Content Marketer, Social Media Manager, Assistant Brand Manager\n**Tests primarily:** Brand thinking, creative judgment, narrative structure, presentation skills\n**Industry fit:** Advertising agencies, brand marketing in corporations, all creative lead roles"
  },
  {
    "id": "cs-20-copywriter-rebrand",
    "title": "B2C Relaunch of a 140-Year-Old Tool Brand: 5 Copy Pieces",
    "cluster": "creative_advertising",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Creative Copywriter",
      "Brand Marketer",
      "Content Marketer",
      "UX Writer",
      "Editorial Assistant",
      "Social Media Manager",
      "Content Producer"
    ],
    "matchesFields": [
      "Design",
      "Marketing"
    ],
    "matchesIndustries": [
      "Consumer",
      "Media",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "creator",
    "skillsTested": [
      "Tone-of-voice precision",
      "Concise writing",
      "Brand-language flexibility",
      "Connecting tradition with modernity"
    ],
    "companyName": "Kramer & Söhne",
    "logoUrl": "/company-logos/cs-20-copywriter-rebrand.png",
    "body": "<img src=\"logos/cs-20-copywriter-rebrand.png\" alt=\"Kramer & Söhne logo\" width=\"120\" align=\"right\" />\n\n# B2C Relaunch of a 140-Year-Old Tool Brand: 5 Copy Pieces\n\n## Context\n\n**Kramer & Söhne** is a German legacy brand for hand tools (hammers, screwdrivers, wrenches, saws), founded 1883 in Siegerland. The brand was **B2B-only for decades** — trade distribution, industry, construction. Legendary quality, minimal consumer brand awareness.\n\nNow comes the first **B2C relaunch**: direct sales via website + Amazon, targeted outreach to a younger demographic (25–45) who see \"DIY as lifestyle.\" New positioning: \"Tools you inherit.\"\n\nThe agency delivers the launch package tomorrow. Copy is still missing.\n\n## Your Role\n\nYou are **Copywriter** at the agency. The Creative Director has reserved 25 minutes for you before the package ships. You get the strategic positioning plus the current tone-of-voice brief.\n\n## Background\n\n**Strategic Positioning:**\n> \"Tools you inherit.\"\n> Kramer & Söhne has built tools since 1883 that don't break.\n> We're not a brand for people who need something today —\n> but for people who want to still use it in 20 years.\n\n**Tone-of-Voice Brief:**\n- **Language**: deliberate, confident without arrogance, specific rather than abstract, no filler words\n- **Content**: quality, craftsmanship, durability, family legacy — NOT: \"cheap,\" \"deal,\" \"new\"\n- **Don'ts**: no \"wow,\" no \"must-have,\" no \"game-changer,\" minimal emoji use in longer texts, no noun stacking\n- **Reference brands** (per Creative Director): Patagonia (purpose-driven), Stihl (solid-German), Field Notes (loving detail)\n\n**Product Details (you may use):**\n- Products manufactured in Hattingen, no manufacturing outside Germany\n- 30-year warranty (newly introduced as part of relaunch)\n- Steel from Sauerland mills, wooden handles from native ash\n- Made by 62 employees, 14 of them the family business in 4th generation\n- Oldest Kramer hammer still in use: 1907, regularly used by a master carpenter in Munich\n\n## Your Task\n\nWrite the following **5 copy pieces** in 25 minutes:\n\n### 1. Website Header Claim (max. 8 words)\nThe first impression on the homepage. Sets the tone.\n\n### 2. Instagram Bio (max. 150 characters)\nCreates identity on a visual platform. Leverage the tone-of-voice.\n\n### 3. Product Description for a Carpentry Hammer (60–80 words)\nThe core product text, as it appears in the online shop under the product image. No hype, no feature lists — a short story.\n\n### 4. Email Subject Line + Opening Sentence for Launch Newsletter\nTo 18,000 pre-orders. Subject line max. 50 characters, opener max. 2 sentences. Should invite opens without clickbait.\n\n### 5. 30-Second Radio Spot (approx. 75 words spoken)\nFully scripted text as a voice actor would deliver it. Stage directions in brackets [like this]. One speaker, no dialogue.\n\n## Guiding Questions\n\n- \"Tools you inherit\" is the core positioning. How do you distill this into 8 words for the header — without repeating the phrase itself?\n- Tone forbids \"wow\" and \"game-changer.\" But copy still has to *pull*. How do you create momentum without the usual marketing muscles?\n- The 1907 hammer is a gift from the facts — use everywhere or only once for full impact?\n- Radio spot in 30 seconds: What happens in seconds 1–5 to grab attention before the listener tunes out?\n- Patagonia and Stihl both have very clear voice, but completely different. Which is closer to Kramer — and how do you avoid imitating Patagonia?\n\n## Match Info\n\n**Case fits:** Creative Copywriter, Brand Marketer, Content Marketer, UX Writer, Editorial Assistant, Social Media Manager, Content Producer\n**Tests primarily:** Tone precision, concision, brand-language flexibility, creative discipline\n**Industry fit:** Advertising agencies, brand teams in consumer goods, content-driven consumer brands"
  },
  {
    "id": "cs-21-sustainability-scope3",
    "title": "Scope 3 Emissions: Decoding a Fashion Brand's Supply Chain",
    "cluster": "sustainability_climate",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Sustainability Analyst",
      "Supply Chain Sustainability Analyst",
      "ESG Reporting Associate",
      "Carbon Markets Analyst",
      "CSR / Impact Associate",
      "Life Cycle Assessment Analyst",
      "Environmental Consultant",
      "Supply Chain Analyst"
    ],
    "matchesFields": [
      "Research",
      "Operations",
      "Data"
    ],
    "matchesIndustries": [
      "Energy",
      "Consumer",
      "Industrial"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Scope 3 methodology",
      "Data-gap pragmatism",
      "Supplier stakeholder engagement",
      "Reduction lever prioritization"
    ],
    "companyName": "Lionne Paris",
    "logoUrl": "/company-logos/cs-21-sustainability-scope3.png",
    "body": "<img src=\"logos/cs-21-sustainability-scope3.png\" alt=\"Lionne Paris logo\" width=\"120\" align=\"right\" />\n\n# Scope 3 Emissions: Decoding a Fashion Brand's Supply Chain\n\n## Context\n\n**Lionne Paris** is a mid-sized fashion brand (€220M revenue, founded 1987, independent, not part of a group). Collections: premium casual for women and men. 120 stores in Europe, e-commerce 35% of revenue. Production 80% in Vietnam and Portugal, fabrics from Italy, Turkey, and India.\n\nThe CSRD (Corporate Sustainability Reporting Directive) applies to Lionne Paris starting fiscal year 2026. In parallel, a major customer (a luxury department store chain) has signaled: from 2027, suppliers without credible Scope 3 reduction targets will be dropped from inventory. And management wants to show independent \"honest\" progress on sustainability — no greenwashing accusations in the next cycle.\n\n## Your Role\n\nYou are **Sustainability Analyst** — new role, created 6 months ago, reporting to the CFO. Your mandate: within 3 months establish the **Scope 3 baseline** and present **3 prioritized reduction levers**. Today is day 1.\n\n## Background\n\n**Scope Categories (GHG Protocol):**\n\n- **Scope 1** (direct, own vehicles/heating): ~4,200 tCO2e p.a. — already well documented\n- **Scope 2** (purchased electricity): ~2,800 tCO2e — documented, switch to renewable power completed in 2024\n- **Scope 3** (upstream and downstream value chain): **estimated 180,000–280,000 tCO2e** — the big black box\n\n**Scope 3 Typically Comprises (Fashion):**\n\n| Category | Typical Share | Data Availability |\n|---|---|---|\n| 1. Purchased Goods/Services | 60–70% | **medium to poor** |\n| 2. Capital Goods | 2–5% | good |\n| 3. Fuel/Energy-related | 1–3% | good |\n| 4. Transportation (Upstream) | 8–15% | **medium** |\n| 5. Waste from Operations | 1–2% | good |\n| 6. Business Travel | 1–2% | good |\n| 7. Employee Commuting | 2–3% | poor |\n| 11. Use of Sold Products (Washing) | 2–5% | poor |\n| 12. End-of-Life | 3–5% | poor |\n\n**Your Current Data:**\n- Production purchasing data from ERP (SAP): unit volumes, materials, suppliers per SKU\n- No **primary data from suppliers** on CO2 footprint\n- No systematic capture of **material-specific emission factors** (cotton, polyester, leather, viscose have 10-fold different footprints)\n- Transport data rough (weight × distance, no modal split air vs. sea vs. rail)\n- 43 Tier-1 suppliers, estimated ~180 Tier-2 (fabric suppliers), Tier-3 (farms) largely unknown\n\n**Industry Benchmarks:**\n- Typical fashion brand: 85–92% of total emissions in Scope 3\n- Of that: ~30–45% in material sourcing (Category 1), ~20–30% in production (energy, dyes)\n- Cotton has ~5-8x higher CO2 footprint than recycled polyester *per kg*, but *per garment* the difference is smaller\n- Air freight is ~3-5% of transport volume but 40-60% of transport emissions\n\n**Scientific Standards:**\n- SBTi (Science Based Targets initiative) expects 42% absolute reduction by 2030 vs. baseline\n- CSRD requires double materiality assessment + Scope 1/2/3 with specific sub-categories\n\n## Your Task\n\nIn a **memo to management + sustainability committee** (2.5 pages):\n\n1. **Baseline strategy**: How do you establish a *credible* Scope 3 baseline in 3 months when primary data is largely missing? What's primary-data strategy vs. proxy approach (emission factor databases like Ecoinvent, Quantis, Higg MSI)?\n2. **Data collection plan**: Which suppliers do you prioritize for primary data collection? How do you secure engagement (you have no formal power over them)?\n3. **Top 3 reduction levers**: Where are the biggest, realistically achievable reduction levers? For each lever:\n   - Estimated savings range (in tCO2e and %)\n   - Investment/transition cost range\n   - Time horizon (years)\n   - Stakeholders needed\n4. **Target proposal**: What would be an ambitious but realistic SBTi target for Lionne Paris? Justify.\n5. **Greenwashing risks**: What are 2 actions that look good but have little impact — that you need to talk marketing out of?\n\n## Guiding Questions\n\n- 180,000–280,000 tCO2e range — that's a 1.5x spread. Your job is to narrow it. But how narrow is \"good enough\"? What's the diminishing return on accuracy?\n- Cotton has higher footprint — should Lionne switch to polyester? That triggers other problems (microplastics, non-circular). How do you balance *singular* metrics?\n- You know Tier-2 suppliers, Tier-3 barely. But 30–50% of Scope 3 emissions happen at Tier 3. How do you manage this \"known-unknown\"?\n- Your 43 Tier-1 suppliers have no incentive to give you data. What do you offer them to cooperate — or put another way: what leverage do you have?\n- SBTi-compliant would be 42% absolute. Fashion industry keeps growing. How do you communicate \"absolute reduction with growing business\" to the CFO without him pushing back?\n\n## Match Info\n\n**Case fits:** Sustainability Analyst, Supply Chain Sustainability Analyst, ESG Reporting Associate, Carbon Markets Analyst, CSR / Impact Associate, Life Cycle Assessment Analyst, Environmental Consultant, Supply Chain Analyst\n**Tests primarily:** Scope 3 competency, pragmatism with data gaps, stakeholder engagement, prioritization under uncertainty\n**Industry fit:** Consumer goods, fashion, FMCG, industrial — any industry with complex supply chains"
  },
  {
    "id": "cs-22-compliance-gdpr-incident",
    "title": "GDPR Incident: 72-Hour Notification and Internal Remediation",
    "cluster": "legal_compliance",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Compliance Analyst",
      "Privacy & Data Protection Associate",
      "Paralegal (corporate, IP, M&A)",
      "AML / KYC Analyst",
      "Legal Operations Associate",
      "Regulatory Affairs Associate",
      "Risk Advisory Associate"
    ],
    "matchesFields": [
      "Finance",
      "Operations"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Healthcare",
      "Services"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Regulatory quick judgment",
      "Risk classification",
      "Stakeholder coordination under time pressure",
      "Precise written communication"
    ],
    "companyName": "BlickReady",
    "logoUrl": "/company-logos/cs-22-compliance-gdpr-incident.png",
    "body": "<img src=\"logos/cs-22-compliance-gdpr-incident.png\" alt=\"BlickReady logo\" width=\"120\" align=\"right\" />\n\n# GDPR Incident: 72-Hour Notification and Internal Remediation\n\n## Context\n\n**BlickReady** is a German health-tech scale-up with a telemededicine app (480,000 registered users, €22M ARR, 140 employees). The app facilitates video consultations between patients and licensed physicians, storing medical history data and prescriptions.\n\nIt is **Wednesday, 10:40 AM**. The Head of Marketing comes into your office in a panic: The marketing team sent a reactivation campaign via Mailchimp yesterday evening to **132,000 inactive users**. **The CSV file that was uploaded accidentally contained an additional column with the last 3 consultation topics for each user.** The topics (e.g., \"Migraine,\" \"Depression,\" \"Pregnancy Counseling\") were *not* displayed in the visible email — but they were transferred to Mailchimp and now reside in the user profile fields.\n\nA user called this morning: \"I know you have information about my depression. Why did I get this email anyway? And did your marketing team see that?\"\n\n## Your Role\n\nYou are a **Privacy & Data Protection Associate** at BlickReady. The external Data Protection Officer is not available until 2:00 PM. Senior management expects a preliminary risk assessment and action plan from you in **2 hours**. The GDPR 72-hour clock has effectively been running since yesterday evening at 9:15 PM.\n\n## Initial Situation — What You Discover in 40 Minutes\n\n**Scope of the incident:**\n\n- Email sent to 132,000 recipients\n- Affected additional data: last 3 consultation topics (categorical, not full-text — but substantively sensitive)\n- Data are **health data** under Art. 9 GDPR (special category)\n- Technically: data reside in Mailchimp user profiles, not visible in the email itself\n- Access to Mailchimp profiles: 8 marketing staff + 2 senior marketing leads + 1 customer data analyst, plus technically all Mailchimp admins (2)\n\n**Root cause analysis:**\n\n- Root cause: The marketing analyst exported the CSV from the internal data warehouse to prepare a \"personalization\" analysis. Accidentally, the same CSV was used for the Mailchimp upload — the consultation column was not removed.\n- The internal export system has no privacy filter by default — data are exported \"as-is\"\n- There was no **four-eyes approval** for mass mailing lists\n\n**Legal context:**\n\n- Art. 33 GDPR: notification to supervisory authority within 72 hours, **if there is a risk to rights and freedoms**\n- Art. 34 GDPR: notification to data subjects, **if there is high risk**\n- Health data: elevated protection requirements, risk is typically classified as \"high\"\n- Supervisory authority: BfDI (Federal Data Protection Officer) or state DPA (depending on location; Berlin → Berlin DPA)\n\n**At the incident:**\n\n- No indication that additional data were *read* by Mailchimp staff\n- Data have been stored in Mailchimp since yesterday evening; deletion is possible, but backup status unclear\n- Mailchimp is US-based (Data Processing Agreement with SCCs, adequacy decision currently via EU-US Data Privacy Framework)\n\n**Management asks:**\n\n1. Is this a reportable incident?\n2. Do we need to inform data subjects?\n3. What do we say to the user who called?\n4. What must we do in the next 72 hours?\n\n## Your Task\n\nIn 25 minutes, as a structured situation report for management:\n\n1. **Risk Assessment**: In 3–4 sentences: How serious is this? What risk level (low / medium / high) under GDPR?\n2. **Notification Obligations** — decision recommendations for:\n   - Notification to supervisory authority (Art. 33): yes/no, justification, deadline\n   - Notification to data subjects (Art. 34): yes/no/partial, justification\n3. **Immediate Measures (next 2 hours)**: 5 concrete actions with responsible parties\n4. **72-Hour Plan**: What happens by Saturday 9:15 PM? (timeline)\n5. **Draft**: brief statement to the user who called (4-5 sentences)\n6. **Medium-term Prevention**: 3 recommendations to prevent this from happening again\n\n## Guiding Questions\n\n- Art. 34 requires notification only upon \"high risk.\" With 132,000 affected individuals, mass notification is expensive reputationally and operationally. How do you assess \"high risk\" carefully — not on gut feeling?\n- The caller wants clarity. But every word can be interpreted as admission — legally risky. How do you balance transparency and legal caution?\n- Mailchimp staff theoretically have access to the profiles. That's also a scope issue under GDPR. How do you address that?\n- Process issues (four-eyes principle, export filters) often lie outside your direct influence. How do you prioritize which recommendation you *enforce* vs. which you merely note?\n- When do you need to say: \"We need external legal counsel immediately\" — and how do you frame that as risk management, not weakness?\n\n## Match-Info\n\n**Case fits:** Compliance Analyst, Privacy & Data Protection Associate, Paralegal, AML / KYC Analyst, Legal Operations Associate, Regulatory Affairs Associate, Risk Advisory Associate\n**Tests primarily:** regulatory quick judgment, risk classification, precise writing, crisis management\n**Industry fit:** Tech, health-tech, finance, all industries processing personal data"
  },
  {
    "id": "cs-23-policy-ai-act",
    "title": "Policy Memo: How Is the Ministry Preparing for the EU AI Act?",
    "cluster": "public_policy",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Policy Analyst",
      "Government Affairs Analyst",
      "Public Affairs Associate",
      "Policy Researcher",
      "Program Officer (UN, EU, GIZ, World Bank)",
      "Trade Policy Analyst",
      "Research Associate (think tank)",
      "International Relations Analyst",
      "Education Policy Analyst"
    ],
    "matchesFields": [
      "Research",
      "Product"
    ],
    "matchesIndustries": [
      "Public",
      "Services",
      "Tech"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Regulatory analysis",
      "Stakeholder balancing",
      "Memo writing in ministerial register",
      "Stakeholder mapping in public sector"
    ],
    "companyName": "BMWK",
    "logoUrl": "/company-logos/cs-23-policy-ai-act.png",
    "body": "<img src=\"logos/cs-23-policy-ai-act.png\" alt=\"BMWK logo\" width=\"120\" align=\"right\" />\n\n# Policy Memo: How Is the Ministry Preparing for the EU AI Act?\n\n## Context\n\nYou work as a **Policy Analyst** in the \"Digital Innovation\" division of a German federal ministry (Federal Ministry for Economic Affairs and Climate Action — BMWK). Your division leads the **implementation of the EU AI Act** in Germany, in partnership with the BMJ (Federal Ministry of Justice) and the BMI (Interior Ministry).\n\nThe State Secretary is preparing a speech for an industry conference in 3 weeks. She sent an email assignment this morning:\n\n> \"I need an internal policy memo by Friday evening — max. 3 pages. Two questions: (1) How is Germany positioned today in AI Act implementation, compared to France and Spain? (2) What 3 concrete measures would you recommend to the BMWK for the next 12 months to prepare German companies for compliance without strangling innovation? Please be honest, no platitudes.\"\n\n## Your Role\n\nYou have 45 minutes this afternoon before another meeting. The memo must be ministerial in format and tone: precise, evidence-based, with concrete recommendations.\n\n## Initial Situation\n\n**The EU AI Act — key points:**\n\n- Adopted 2024, full application from August 2026 (some provisions earlier)\n- Risk-based approach: 4 classes (unacceptable, high, limited, minimal)\n- \"High-risk\" applications subject to extensive compliance obligations: risk management, data governance, documentation, transparency, human oversight, accuracy, robustness\n- Foundation Models (GPAI) with separate rules from August 2025\n- Fines up to €35M or 7% of worldwide annual revenue\n- National supervisory authorities must be named by August 2025\n\n**Current German situation:**\n\n- **Designated national supervisory authority**: Not yet finalized — discussions ongoing about new authority vs. expanding existing ones (BNetzA, BfDI)\n- **Governance structure**: No central AI governance body, responsibilities distributed across BMWK (economy), BMI (internal security), BfDI (data protection), Bundesdruckerei (certification), BMJ (law)\n- **Industry readiness**: According to KfW study, 43% of German mid-market firms say they know the AI Act \"in outline,\" 12% consider themselves \"well prepared\"\n- **Public funding**: Federal AI Innovation Fund: €500M per year, predominantly research support. No dedicated program for compliance readiness\n- **AI research landscape**: Strong (Stanford AI Index ranks Germany 4th in EU after UK/France), but commercial implementation lags\n\n**France — comparative context:**\n\n- National AI strategy \"IA Plan\" updated 2025: €1.5B over 3 years, of which €200M explicitly for compliance support\n- AI supervisory authority named since 2024 (CNIL + ANSSI jointly)\n- \"AI Act Sandbox\" program active in Paris — 40 companies participating\n- Political focus: \"sovereignty\" and European tech champions\n\n**Spain — comparative context:**\n\n- First EU country with national AI supervisory authority: AESIA, based in A Coruña\n- AI Sandbox since 2023, 10 companies have tested compliance cases\n- Pragmatic approach, strong coordination with local industry\n- Smaller industry scale but visible \"first-mover\" effect\n\n**German industry voices (stakeholder landscape):**\n\n- **BDI/BDA (employers)**: \"AI Act will stifle innovation. We need light implementation, minimal additional regulation.\"\n- **VDE, TÜV**: Want strong role in certification — economic interest\n- **Mid-market association**: \"Small companies lack resources and expertise. We need support.\"\n- **NGOs (Algorithmwatch, LobbyControl)**: \"Consistent implementation, strong oversight, protect citizens' rights.\"\n- **State governments**: Bavaria, North Rhine-Westphalia want standalone initiatives; other states wait-and-see\n\n## Your Task\n\nWrite the **3-page memo**:\n\n1. **Executive Summary** (max. 5 sentences)\n2. **Status-quo analysis Germany**: What's in place, what's missing? Concrete and honest. No \"we're well positioned\" platitudes.\n3. **Comparison DE vs. FR vs. ES**: Brief table with 4–5 dimensions, key takeaways.\n4. **3 action recommendations** for the next 12 months — each with:\n   - Concrete measure (what)\n   - Resources (staff, budget, timeline)\n   - Expected impact + measurability\n   - Political risks / dependencies\n5. **Balancing act**: One paragraph on \"innovation vs. regulation\" — how does the BMWK ensure recommendations aren't perceived as innovation blockers?\n6. **Open questions**: What 2–3 questions can a memo in 45 minutes not responsibly answer — and need a longer process?\n\n## Guiding Questions\n\n- The State Secretary wants \"honest, no platitudes.\" Where exactly is your ministry behind France/Spain — and are you ready to name that clearly in the memo, even if it's politically uncomfortable?\n- Three concrete recommendations is sparse. What do you prioritize: structural (supervisory authority) vs. operational (compliance help) vs. financial (funding)? Which combination has the best impact-to-effort ratio?\n- BDI says \"light regulation,\" NGOs say \"strong oversight.\" The ministry must address *both* without lapsing into pure compromise. How do you frame that politically sustainably?\n- \"AI Sandbox\" is a proven idea in FR/ES. Simply copy it, or adapt to German industry specifics?\n- The memo goes to the State Secretary, but odds are it lands in the press office too. What do you include, what do you exclude?\n\n## Match-Info\n\n**Case fits:** Policy Analyst, Government Affairs Analyst, Public Affairs Associate, Policy Researcher, Program Officer, Trade Policy Analyst, Research Associate (think tank), International Relations Analyst, Education Policy Analyst\n**Tests primarily:** policy memo competency, regulatory understanding, stakeholder balance, political writing\n**Industry fit:** public sector, think tanks, NGOs, international organizations, corporate public affairs"
  },
  {
    "id": "cs-24-edtech-engagement-drop",
    "title": "EdTech: 60% Engagement Drop on Chapter 5 — What's Wrong?",
    "cluster": "edtech_education",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "EdTech Product Manager",
      "Curriculum Designer",
      "Learning Experience Designer",
      "Academic Content Writer",
      "Product Designer",
      "UX Researcher",
      "Education Policy Analyst",
      "Research Assistant",
      "Program Coordinator (NGO / foundation)"
    ],
    "matchesFields": [
      "Product",
      "Design",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Public"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Learning science intuition",
      "Product analytics",
      "Curriculum design",
      "Student empathy"
    ],
    "companyName": "NumeraLab",
    "logoUrl": "/company-logos/cs-24-edtech-engagement-drop.png",
    "body": "<img src=\"logos/cs-24-edtech-engagement-drop.png\" alt=\"NumeraLab logo\" width=\"120\" align=\"right\" />\n\n# EdTech: 60% Engagement Drop on Chapter 5 — What's Wrong?\n\n## Context\n\n**NumeraLab** is a German math learning platform for grades 5–8 (ages 10–14). B2C market, paid usage: parents buy subscriptions (€14.90/month), students use the app independently. 62,000 paying subscriptions, solid growth numbers.\n\nThe app structures the math curriculum in 24 chapters per grade level, divided into explainer videos (3–6 minutes), interactive tasks, gamification (points, badges, streaks), and adaptive difficulty adjustment. Usage data have been solid for 2 years.\n\nFor three months, a persistent problem has emerged: In **grade 6**, engagement on **Chapter 5 (\"Rational Numbers\")** drops **60%**. Many students start the chapter, stop, don't return. The parent churn rate (subscription cancellation the following month) rises in this cohort to 12% vs. 4% average.\n\n## Your Role\n\nYou are the **Product Manager** for the learning platform. A curriculum designer and learning experience designer work with you. The Chief Product Officer gave you 4 weeks to diagnose and sketch a solution. Today is day 3 — you've reviewed initial data and interviews.\n\n## Initial Situation — What You Know\n\n**Engagement funnel grade 6 (last 12 weeks):**\n\n| Chapter | Topic | Starter Rate | Completion Rate |\n|---|---|---|---|\n| C1 | Natural Numbers | 98% | 91% |\n| C2 | Divisors & Multiples | 95% | 87% |\n| C3 | Fractions — Basics | 92% | 83% |\n| C4 | Fractions — Arithmetic | 89% | 78% |\n| C5 | **Rational Numbers** | 86% | **31%** |\n| C6 | Decimals | 42% | 68% (of starters) |\n| C7 | Percentages | 39% | 71% |\n\n**Content audit chapter 5:**\n\n- 7 lessons (vs. 5 average in other chapters)\n- Explainer videos average 4.8 minutes (vs. 3.5 average)\n- Introduces negative numbers + number line concept + ordering relations simultaneously\n- Task types: 68% pure calculation, 12% word problems, 20% visual tasks (number line)\n\n**Data from 9 interviews with 11–12-year-old students:**\n\n- *Laura, 11:* \"I didn't understand it anymore. Why is -3 less than -1? That doesn't make sense!\"\n- *Max, 12:* \"The video was so long. I gave up halfway.\"\n- *Sophia, 11:* \"The tasks are so… boring. Chapter 3 had pizza tasks, that was fun.\"\n- *Jonas, 12:* \"I didn't get it in class anyway, and then doing it again at home — that was too much.\"\n- *Emma, 11:* \"The number line is weird. I can't see why -5 + 3 = -2.\"\n- *Felix, 12:* \"My parents couldn't help anymore. Negative numbers — too long ago for them.\"\n- *Lena, 11:* \"I gave up after getting it wrong 3 times. The help videos didn't help.\"\n\n**Technical data:**\n\n- Average time in chapter 5 before drop-off: 11 minutes (vs. 28 minutes average for other chapters)\n- 72% of drop-offs happen in lesson 2 (introduction to negative numbers)\n- Hint usage in chapter 5: 34% (vs. 18% average)\n- After drop-off, only 19% return in same session (vs. 52% for other chapters)\n\n**Learning science background:**\n\n- Negative numbers are a known \"conceptual leap\" in math instruction — many children struggle around 11–12 because number understanding becomes more abstract\n- Research (Booth & Newton, 2012) shows: visual representations and real-world contexts (temperature, debt, meters above/below sea level) are significantly more effective than pure calculation\n- Introducing multiple concepts simultaneously (negative + number line + ordering) overloads cognitive processing at this age\n\n**Competitive context:**\n\n- Khan Academy presents the topic in shorter units (8 lessons, avg. 2.5 minutes)\n- Duolingo Math uses more playful framing\n- Bettermarks (German competitor) has interactive visualizations praised in user forums\n\n## Your Task\n\nWrite a **concept brief to the CPO** in 45 minutes:\n\n1. **Root-cause hypothesis**: What's your clear main thesis for why chapter 5 collapses? Is it content, UX, structure, developmental readiness, or a combination? (One dominant cause, please, not a list.)\n2. **Evidence summary**: Which 3–4 data points support your hypothesis most strongly? Which 1–2 data points *contradict* it, that you can't ignore?\n3. **Chapter 5 redesign concept**: In 5–7 bullets — how would you rebuild the chapter?\n   - Number of lessons\n   - Typical lesson length\n   - Concept sequence\n   - Task type (text, visual, real-world, playful?)\n   - Which tools / resources\n4. **Quick experiments** (2–4 weeks): What do you test BEFORE a full redesign? Which 2 A/B tests, what success criteria?\n5. **Parent subscription churn**: The 12% cancellation rate is the real business problem. How do you solve that *now* (before the full redesign)?\n\n## Guiding Questions\n\n- Is this really a product problem — or is it a *developmentally-inappropriate-content* problem, structurally designed wrong didactically? If the latter: who can fix it, and how fast?\n- The interviews show different causes (video length, missing contextualization, insufficient help). But what's the *underlying* pattern?\n- Lena says: \"Gave up after 3 wrong tries.\" Is your intervention at the content level (better material) or the emotional level (frustration management, motivation design)?\n- Khan Academy does it in shorter units. Could you just split the chapter, or is that too shallow?\n- 12% churn — parents cancel because the kid is frustrated. What's the *emergency communication* to parents on chapter 5?\n\n## Match-Info\n\n**Case fits:** EdTech Product Manager, Curriculum Designer, Learning Experience Designer, Academic Content Writer, Product Designer, UX Researcher, Education Policy Analyst, Research Assistant, Program Coordinator\n**Tests primarily:** product analytics, learning science intuition, student empathy, curriculum thinking\n**Industry fit:** EdTech, education, kids' apps, all psychologically demanding learning products"
  },
  {
    "id": "cs-25-manufacturing-line-efficiency",
    "title": "Assembly Line: 12% Output Loss on Night Shift — Why?",
    "cluster": "manufacturing_engineering",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Manufacturing Engineer",
      "Process Engineer",
      "Quality Engineer",
      "Product Engineer",
      "Supply Chain Analyst (automotive)",
      "Technical Project Manager",
      "Operations Consultant",
      "Automotive Strategy Analyst",
      "Systems Engineer"
    ],
    "matchesFields": [
      "Engineering",
      "Operations",
      "Data"
    ],
    "matchesIndustries": [
      "Industrial",
      "Mobility"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Lean thinking",
      "Operational variance analysis",
      "Machine vs. people cause separation",
      "Shopfloor empathy"
    ],
    "companyName": "Delius Automotive",
    "logoUrl": "/company-logos/cs-25-manufacturing-line-efficiency.png",
    "body": "<img src=\"logos/cs-25-manufacturing-line-efficiency.png\" alt=\"Delius Automotive logo\" width=\"120\" align=\"right\" />\n\n# Assembly Line: 12% Output Loss on Night Shift — Why?\n\n## Context\n\n**Delius Automotive** is a German Tier-1 supplier to the automotive industry. Plant in the Stuttgart region with 680 employees produces steering wheel assemblies for 3 OEM customers (BMW, Audi, VW). Line 3 (premium steering wheels with integrated electronics): target output 420 units per 8-hour shift, 24/7 three-shift operation.\n\nFor **8 weeks**, the night shift (10 PM–6 AM) has consistently underperformed: average **370 units**, a **-12% gap**. Day shift and evening shift run stable at 418 and 422 units. At 200 production days per year, this costs ~10,000 lost units = €680k revenue shortfall, plus delivery pressure from BMW.\n\nYou're new to the company (4 weeks in) and land this problem on day one.\n\n## Your Role\n\nYou are a **Manufacturing Engineer** at Delius, with Line 3 as primary responsibility. The plant manager tells you today: \"Fix it. I want an answer and a plan in 3 weeks.\"\n\n## Initial Situation\n\n**The line:**\n- 14 workstations, takt-driven\n- Cycle time: ~68 seconds per unit\n- Robots at stations 3, 7, 11 (joining, adhesive, inspection)\n- Manual work at the other 11 stations (cabling, fit checks, visual inspection, packaging)\n- Shift staffing: 28 people per shift\n\n**Output data aggregated over last 8 weeks:**\n\n| Shift | Avg. Units | Downtime Minutes / Shift | Avg. First-Pass Yield |\n|---|---|---|---|\n| Day (6 AM–2 PM) | 418 | 22 | 98.2% |\n| Evening (2 PM–10 PM) | 422 | 18 | 98.5% |\n| **Night (10 PM–6 AM)** | **370** | **58** | **96.1%** |\n\n**Downtime causes on night shift (last 8 weeks):**\n\n| Cause | Avg. Minutes / Shift |\n|---|---|\n| Robot station 7 (adhesive) — \"sensor error, manual reset\" | 18 |\n| Robot station 11 (inspection) — \"restart needed\" | 14 |\n| Material replenishment station 4 (cabling) | 9 |\n| Visual inspection (station 12) — clarifications | 8 |\n| Other minor interruptions | 9 |\n\n**Further observations from your first 2 weeks:**\n\n- Maintenance crew is reduced at night (2 technicians vs. 4 daytime) → longer response to failures\n- No shift lead with line 3 experience on night shift (the last one switched roles 4 months ago; replacement previously led line 1, different technology)\n- Night shift has 34% higher turnover than day shifts\n- Temp worker share: day 18%, evening 22%, night **41%**\n- First-pass yield 96.1% means more rework — and rework itself binds output capacity\n- During a 3:30 AM walk-through, you observed: long pauses between cycles, operator at station 4 frequently waiting for material, two workers on personal phones, one robot running but the operator downstream taking 15s longer than standard\n- Material replenishment at night is organized differently — fewer warehouse drivers\n\n**Political context:**\n\n- Works council has already flagged \"night shift burden\" as a labor issue — wants no tightening of conditions\n- Plant manager wants fast results, but also has an OEM audit next month\n- Quality department insists first-pass yield stay above 98% — otherwise BMW escalation\n\n## Your Task\n\nDeliver in 50 minutes an **analysis document + action plan** (2.5 pages):\n\n1. **Cause hierarchy**: Is this a machine problem, a people problem, or a process problem? Quantify: which causes explain most of the -52 units / shift?\n2. **Hypothesis prioritization**: Which 3 hypotheses are most likely? Justify with data.\n3. **Diagnosis plan (2 weeks)**: How do you confirm the top hypothesis? What measurements, walk-throughs, conversations?\n4. **3 measures with estimated impact**:\n   - **Quick win** (1–2 weeks, minimal cost)\n   - **Structural** (4–8 weeks, medium investment)\n   - **Long-term** (3–6 months, larger investment, most sustainable impact)\n5. **Avoiding collateral damage**: How do you keep quality above 98%? How do you prevent the works council from labeling your changes \"tightening\"?\n6. **One question for the plant manager**: What do you need from him that you can't decide yourself?\n\n## Guiding Questions\n\n- Robots 7 and 11 have more downtime. But same robot — why only at night? Temperature effect in plant? Less experienced staff on resets? Something else?\n- Temp worker share 41% vs. 18% — that's the biggest gap between shifts. How much does that realistically explain, and what's the intervention if temp work is the issue (it's also a structural decision)?\n- First-pass yield 96.1% vs. 98.5% — if you have 2.5% more rework, that binds real capacity. Is this a *cause* or a *symptom*?\n- You saw downtime and personal phone use on the night walk. If you tell the plant manager: will he immediately demand \"more control\" — which backfires? How do you frame it?\n- The previous shift lead was line-experienced, the new one isn't. How urgent is that as an intervention?\n\n## Match-Info\n\n**Case fits:** Manufacturing Engineer, Process Engineer, Quality Engineer, Product Engineer, Supply Chain Analyst (automotive), Technical Project Manager, Operations Consultant, Automotive Strategy Analyst, Systems Engineer\n**Tests primarily:** lean and operational thinking, variance analysis, shopfloor empathy, change management in blue-collar settings\n**Industry fit:** automotive, aerospace, industrial manufacturing, all production industries"
  },
  {
    "id": "cs-26-architect-brownfield",
    "title": "Brownfield Development: Mixed-Use District on 4.2-Hectare Industrial Site",
    "cluster": "architecture_real_estate",
    "duration": "medium",
    "estimatedMinutes": 55,
    "matchesRoles": [
      "Junior Architect",
      "Urban Planner",
      "Interior Designer (junior)",
      "Sustainability-focused Architect",
      "BIM Coordinator",
      "Construction Project Coordinator",
      "Real Estate Analyst",
      "Property Valuation Analyst",
      "PropTech Product Manager"
    ],
    "matchesFields": [
      "Design",
      "Operations",
      "Product"
    ],
    "matchesIndustries": [
      "RealEstate",
      "Public",
      "Consumer"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "creator",
    "skillsTested": [
      "Urban design",
      "Stakeholder integration (city, residents, investor)",
      "Mixed-use logic",
      "Sustainability integration"
    ],
    "companyName": "Lohmann + Partner",
    "logoUrl": "/company-logos/cs-26-architect-brownfield.png",
    "body": "<img src=\"logos/cs-26-architect-brownfield.png\" alt=\"Lohmann + Partner logo\" width=\"120\" align=\"right\" />\n\n# Brownfield Development: Mixed-Use District on 4.2-Hectare Industrial Site\n\n## Context\n\nYour architecture firm **Lohmann + Partner** (38 staff, offices in Hamburg and Leipzig) has been invited to compete for the **\"Hansa-Werk 42\" site**. The land: 4.2 hectares of former machinery factory in Leipzig-Plagwitz, vacant for 9 years, three partially historic structures, surrounded by mixed older residential buildings, 2 schools within walking distance, U-Bahn 6 minutes away.\n\n**The developer**: joint venture between municipal housing company (51%) and institutional investor (49%). Requirements:\n- **Minimum 40% affordable housing** (city condition)\n- **Economic viability** for private investor\n- Submission in **6 weeks**, with site plan, use concept, sustainability narrative\n\nThe competition jury comprises representatives from city planning, the developer, and citizen representatives.\n\n## Your Role\n\nYou are a **Junior Architect** (3rd year of practice), working in a 5-person project team led by a senior architect. She asked you today to deliver a **conceptual pre-design** by Friday for the team to elaborate — sketch level, no final CAD yet.\n\n## Initial Situation\n\n**Property:**\n- 42,000 m² total area\n- Land-use plan: \"urban mixed-use\" (MU — allows residential, commercial, cultural)\n- Building parameters: site coverage 0.6 / floor-area ratio 2.8 / max. height 21 m (6 stories)\n- **3 existing structures**:\n  - Hall A (northwest): listed historic brick hall, 3,400 m², built 1910, structurally sound, strict historic requirements\n  - Hall B (center): 1,800 m², 1960s, not listed, mediocre condition, demolition possible\n  - Hall C (south): 2,200 m², listed facade, heavily modernizable interior\n- Soil: partially contaminated, remediation cost estimate €3–5M\n- **Existing trees**: ~60 mature trees along east side, strong preservation pressure\n- **Access**: from west via Karl-Liebknecht-Strasse, eastern residential streets have no-through traffic\n\n**Market and demand context in Leipzig:**\n\n- Housing shortage in Plagwitz: avg. wait for municipal housing 4.2 years\n- Strong demand for family-friendly units (2–4 rooms)\n- Gallery and creative scene strong (Spinnerei 800m away)\n- Retail density in district weak — supermarket 10 min walk\n- No public plaza within 500m radius\n\n**Developer requirements:**\n- Min. 300 residential units, of which 120+ affordable (2–4 room mix)\n- Min. 15% non-residential use (commerce, food service, culture)\n- CO2 balance at least KfW-40 for new construction\n- Car-light — max. 0.5 parking spaces per unit, car-sharing + 3 bike spaces per 10 units\n- Green or PV roofs — min. 60% of available roof area\n\n**Citizen sentiment (from public info meeting notes):**\n- Skepticism about \"too many\" new residents (density)\n- Concern about loss of informal parking\n- Desire for public plaza / green space\n- Cultural wish: the listed halls should \"remain visible\" — not just facade\n- Some vocal opposition to any building over 4 stories\n\n**Jury signals (inferred from makeup):**\n- City: land efficiency, affordable % share, public space, sustainability\n- Investor: profitability, low operating costs, marketability\n- Citizens: proportionality, integration, green space, use mix\n\n## Your Task\n\nIn 55 minutes, as a **pre-design paper**:\n\n1. **Urban design strategy** (150–200 words): What's the overarching idea? What ratio of new to existing, what density, what urban form?\n2. **Schematic site plan** (text or simple sketch): How do you distribute\n   - Residential blocks\n   - Commerce/food/culture\n   - Public plaza\n   - Green space\n   - Circulation (foot/bike/car)\n   - Use of 3 existing structures?\n3. **Use mix**: distribution proposal by m² for:\n   - Affordable housing\n   - Market-rate housing\n   - Commerce (which?)\n   - Food service/retail\n   - Culture/community\n4. **Existing structures strategy**: How do you handle Hall A (listed), Hall B (possible demolition), Hall C (facade-listed)?\n5. **Sustainability narrative** (5–7 bullets): How do you address KfW-40, tree preservation, soil remediation, embodied carbon (existing), mobility?\n6. **3 core arguments**: Why your concept wins the jury — one per: city, investor, citizens\n\n## Guiding Questions\n\n- 40% affordable + economic viability = structural tension. How do you solve it in the building form (e.g., cross-subsidy through commerce, higher density in market units)?\n- Hall A is listed and 3,400 m². What becomes of it? Housing (hard), culture (limited revenue), commercial (which?), culture-housing hybrid?\n- \"Car-light\" is trendy, but citizen anxiety about lost informal parking. Is that a conflict you can defuse politically or must explicitly defend?\n- Missing public plaza — that's a gift if you provide it. But it costs buildable area. How do you target its location and size?\n- Investor wants marketability, city wants public good. What *one* idea serves both simultaneously?\n\n## Match-Info\n\n**Case fits:** Junior Architect, Urban Planner, Interior Designer (junior), Sustainability-focused Architect, BIM Coordinator, Construction Project Coordinator, Real Estate Analyst, Property Valuation Analyst, PropTech Product Manager\n**Tests primarily:** urban design thinking, multi-stakeholder integration, sustainability concept, stakeholder empathy\n**Industry fit:** architecture, urban planning, real estate development, public sector planning"
  },
  {
    "id": "cs-27-ld-leadership-program",
    "title": "Leadership Program: Develop 80 New First-Time Managers in 9 Months",
    "cluster": "people_hr",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Learning & Development Associate",
      "HR Business Partner (junior)",
      "Organizational Development Analyst",
      "Talent Management Associate",
      "People Operations Coordinator",
      "Internal Communications Associate",
      "Learning Experience Designer"
    ],
    "matchesFields": [
      "People",
      "Design"
    ],
    "matchesIndustries": [
      "Tech",
      "Services",
      "Consumer",
      "Finance"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Program design",
      "Learning measurement",
      "Stakeholder management",
      "Budget prioritization"
    ],
    "companyName": "FinLogo AG",
    "logoUrl": "/company-logos/cs-27-ld-leadership-program.png",
    "body": "<img src=\"logos/cs-27-ld-leadership-program.png\" alt=\"FinLogo AG logo\" width=\"120\" align=\"right\" />\n\n# Leadership Program: Develop 80 New First-Time Managers in 9 Months\n\n## Context\n\n**FinLogo AG** is a German finance-software scale-up (650 employees, €110M ARR, grown +45% in last 2 years). Rapid scaling created a bottleneck: **80 people promoted to team lead in the last 18 months**, many without leadership experience. Engagement scores in their teams are **14 points lower** than experienced managers; turnover runs at 22% (company avg.: 11%).\n\nThe Chief People Officer has prioritized a strategic leadership development program. Budget: **€280,000** over 9 months. Goal: measurable improvement in team health scores and turnover reduction.\n\n## Your Role\n\nYou are a **Learning & Development Associate**. Your L&D director assigned you the concept design. You present to the CPO + executive team in 2 weeks. Today you're building the structural framework.\n\n## Initial Situation\n\n**The 80 first-time managers — profile:**\n- Avg. age: 29\n- Avg. team size: 5 direct reports\n- 62% technical background (engineering, product, data), 28% commercial, 10% operations/HR\n- Mixed experience: 30% have done external leadership training, 70% no structured leadership education\n\n**Pain points from pulse survey (n=230 team members):**\n- \"My manager rarely gives constructive feedback\" — 48%\n- \"Priorities on the team are unclear\" — 42%\n- \"Difficult conversations get avoided\" — 38%\n- \"I don't know how my performance is being evaluated\" — 51%\n- \"My manager acts more like a co-worker than a coach\" — 33%\n\n**Existing L&D landscape:**\n- Onboarding for new leaders: one-time, 1-day, generic\n- LinkedIn Learning licenses for all (usage rate: 18%)\n- External coaching pool (3 coaches), currently used by executives, not manager level\n\n**Organizational reality:**\n- 80 managers spread across 4 cities (Berlin, Hamburg, Munich, Vienna)\n- Remote/hybrid model — 2 days/week on-site\n- Business pressure is high, limited manager time for \"non-productive\" activity\n- Board wants visible ROI measurement, not just \"training attendance rate\"\n\n**Budget constraints:**\n- €280k total\n- Typical costs: external trainer €2–3k/day, internal training development ~€15–20k per module, coaching ~€200/hour, platform licenses vary\n\n## Your Task\n\nWrite a **program design document** (2 pages) in 45 minutes:\n\n1. **Program narrative** (100 words): What is the program, what isn't, why now?\n2. **Core competency structure**: Which 4–6 core competencies do you prioritize from the pain points? Per competency: one sentence learning goal.\n3. **Learning modality mix**:\n   - Percentages of: in-person workshops / virtual training / peer learning / 1:1 coaching / self-study / on-the-job\n   - Why this mix (not: \"because it's modern,\" but: based on learning goals)\n4. **9-month roadmap**: rough phases + milestones\n5. **Budget allocation** (total: €280k): how distributed across modalities and phases?\n6. **Success metrics**: 3 metrics, one per level (behavior, team impact, business impact), with measurement mechanisms\n7. **Critical assumptions**: 3 things that must be true for this program to work\n\n## Guiding Questions\n\n- Training attendance rate is the wrong metric. But team health scores take 6+ months to measure. What early indicators do you monitor from month 2?\n- \"Avoiding difficult conversations\" is a classic skill gap. Does a workshop teach it, or do you need structured practice settings?\n- Peer learning (cohorts, manager circles) is cheap and often highly effective for manager development — but hard to plan. How do you balance it?\n- The audience has no time. Monthly 2-day workshop series is unrealistic. What rhythm *actually* gets lived?\n- Technical people (engineering/product) becoming leaders: often the hardest transition because identity hangs on \"doing it myself.\" Do they need different curriculum than commercial managers?\n\n## Match-Info\n\n**Case fits:** Learning & Development Associate, HR Business Partner (junior), Organizational Development Analyst, Talent Management Associate, People Operations Coordinator, Internal Communications Associate, Learning Experience Designer\n**Tests primarily:** L&D program design, ROI thinking in HR, budget trade-offs, stakeholder management\n**Industry fit:** scale-ups, corporates, all fast-growing people organizations"
  },
  {
    "id": "cs-28-hrbp-performance-conversation",
    "title": "HRBP Case: Difficult Performance Conversation with a Top Performer",
    "cluster": "people_hr",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "HR Business Partner (junior)",
      "Talent Management Associate",
      "People Operations Coordinator",
      "Employee Relations Specialist",
      "Talent Acquisition Partner",
      "Learning & Development Associate"
    ],
    "matchesFields": [
      "People",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services",
      "Consumer",
      "Finance",
      "Healthcare"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Diagnosis of human dynamics",
      "Manager coaching",
      "Confidential information handling",
      "Role clarity (HR vs. manager)"
    ],
    "companyName": "WebFlux",
    "logoUrl": "/company-logos/cs-28-hrbp-performance-conversation.png",
    "body": "<img src=\"logos/cs-28-hrbp-performance-conversation.png\" alt=\"WebFlux logo\" width=\"120\" align=\"right\" />\n\n# HRBP Case: Difficult Performance Conversation with a Top Performer\n\n## Context\n\n**WebFlux GmbH** is a digital B2B agency (220 employees, Hamburg). You are **HR Business Partner** for Strategy & Consulting (45 people). Sarah Wieland (Senior Strategy Director, 38, leading the team for 4 years) walks into your office this morning with an urgent request.\n\n## Your Role\n\nSarah needs your advice on how to handle **Tomasz Kowalski** — one of her top performers. You have 25 minutes before another meeting.\n\n## Initial Situation — What Sarah Tells You\n\n> \"Tomasz has been with the team 3 years. He's one of my best senior consultants — high billability, positive client feedback, landed an €800k deal last year. But for about 6 months, something's been off. He comes late to meetings, is irritable with colleagues, last week he snapped at an associate in an internal review. Two junior staff have informally complained. At the same time, his client work remains excellent.\"\n>\n> \"I told him last week we need to talk. He said 'not now.' This morning I opened the performance review window, and his self-assessment is notably defensive — he writes things like 'I carry disproportionate weight' and 'the team is below my level intellectually.'\"\n>\n> \"I want to talk to him. But I'm unsure how. I don't want to lose him. At the same time, I can't tolerate his behavior toward the juniors.\"\n>\n> \"One thing you should know: his mother died 4 months ago. He took 2 weeks. We never really talked about it after.\"\n\n**What you additionally know from HR records:**\n- Tomasz: 3 years tenure, last raise 14 months ago\n- Q1 pulse survey anonymized: his team overall positive scores, but \"psychological safety\" at 3.1/5 is the lowest in entire company\n- Tomasz applied internally for 2 senior director roles, someone else got both\n- No disciplinary record\n\n**Sarah's leadership profile from your experience:**\n- Technically excellent, results-driven\n- Conflict-avoidant — has postponed difficult conversations in the past\n- Likes Tomasz, sees him as \"future director,\" doesn't want to lose him\n- Stretched thin in dual role (delivery + team lead)\n\n## Your Task\n\nIn 25 minutes, in conversation with Sarah:\n\n1. **Diagnostic framing**: What do you really see here? Performance problem, grief issue, career frustration problem — or a mix? Summarize in 3–4 sentences.\n2. **Role clarity**: What's Sarah's role in this conversation? What's yours as HRBP? What should she *not* try to solve?\n3. **Conversation preparation for Sarah**: Sketch the structure in 4–6 phases (opening → exploration → feedback → support → commitments → next steps). Per phase: one guiding question or core point.\n4. **What Sarah should say — and what she shouldn't**: 3 example phrasings (concrete, verbatim) for sensitive moments (e.g., addressing behavior toward juniors, the mother topic, career frustration).\n5. **Next steps structurally**: Does Tomasz need EAP access, coaching, career conversation? What can happen in what timeframe?\n6. **Escalation trigger**: When would you advise Sarah to pause and escalate? What would that be?\n\n## Guiding Questions\n\n- Performance and behavior are different axes. Top performer + problematic behavior is classic tension. How do you prevent good performance from \"excusing\" bad behavior — without devaluing the strong performance?\n- Grief in the workplace is often unsaid. As HRBP, you can coach Sarah to surface it — but how, without slipping into therapy?\n- \"The team is below my level intellectually\" — is that arrogance, frustration, career dissatisfaction, or a sign of genuine maturity? Each interpretation leads to different conversation direction.\n- Sarah is conflict-avoidant. Your coaching to her matters as much as the Tomasz conversation. What do you coach, what exceeds your scope?\n- The 2 rejected senior director applications — was that transparent? If not, some of the problem lives in the system, not just the employee.\n\n## Match-Info\n\n**Case fits:** HR Business Partner, Talent Management Associate, People Operations Coordinator, Employee Relations Specialist, Talent Acquisition Partner, Learning & Development Associate\n**Tests primarily:** human diagnosis, coaching competency, role discipline, handling sensitive topics\n**Industry fit:** all medium to large organizations"
  },
  {
    "id": "cs-29-growth-cac-rising",
    "title": "CAC Rising 28% in 4 Months: What's Broken?",
    "cluster": "performance_marketing",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Growth Marketer",
      "Performance Marketing Analyst",
      "Paid Media Specialist",
      "SEO Specialist",
      "Lifecycle / CRM Marketer",
      "Marketing Analyst",
      "Growth Product Manager"
    ],
    "matchesFields": [
      "Marketing",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Services",
      "Finance"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Funnel diagnosis",
      "Channel economics",
      "Attribution skepticism",
      "Hypothesis prioritization"
    ],
    "companyName": "MealPrep Pro",
    "logoUrl": "/company-logos/cs-29-growth-cac-rising.png",
    "body": "<img src=\"logos/cs-29-growth-cac-rising.png\" alt=\"MealPrep Pro logo\" width=\"120\" align=\"right\" />\n\n# CAC Rising 28% in 4 Months: What's Broken?\n\n## Context\n\n**MealPrep Pro** is a German D2C food start-up (prepared meal subscriptions, premium healthy segment). €22M ARR, Series A closed, target audience: working urban professionals 28–48. Direct-to-consumer, no retail, marketing drives growth.\n\nSix months ago, **blended CAC was €52** per new customer. Today it's **€67**. The CEO is under pressure: the board expects efficient growth, not just growth. You're handed the task to diagnose today.\n\n## Your Role\n\nYou are the **Growth Marketer** at MealPrep Pro. Board call in 5 days. Your marketing director gave you full data access and wants a first hypothesis diagnosis tomorrow.\n\n## Initial Situation — Channel Mix Data (Last 6 Months)\n\n| Channel | Spend Share | CAC 6 Mo Ago | CAC Today | Delta | Signup Share |\n|---|---|---|---|---|---|\n| Meta (Facebook + Instagram) | 42% | €48 | €64 | **+33%** | 46% |\n| Google Search | 22% | €38 | €44 | +16% | 22% |\n| YouTube | 14% | €62 | €78 | +26% | 9% |\n| TikTok | 8% | €41 | €59 | **+44%** | 8% |\n| Influencer | 7% | €58 | €72 | +24% | 8% |\n| Organic/SEO | 5% | — | — | — | 5% |\n| Referral/Other | 2% | €12 | €14 | +17% | 2% |\n\n**Funnel metrics (last 6 months, aggregate):**\n\n| Stage | 6 Mo Ago | Today | Delta |\n|---|---|---|---|\n| Ad CTR | 1.8% | 1.4% | **-22%** |\n| Landing Page Conversion (visit → signup start) | 12.5% | 11.9% | -5% |\n| Signup → Trial | 72% | 69% | -4% |\n| Trial → Paid | 38% | 34% | **-11%** |\n| First-month retention | 84% | 81% | -3% |\n\n**Market context and internal changes (last 6 months):**\n- 2 new competitors in premium segment (both VC-backed, aggressive on Meta)\n- Meta rolled out iOS-targeting update — attribution accuracy declined\n- TikTok spend increased month 3 from €30k to €60k (portfolio diversification)\n- Creative team consolidated ad variants month 2: 12 versions → 4 \"best performers\"\n- Landing page redesigned month 4 (from \"functional\" to \"lifestyle focus\")\n- Trial extended month 1 from 7 to 14 days (intended to boost retention)\n- Price raised month 4 by 6% (€79 → €84/month)\n\n**Attribution model:** last-click, more conservative-inferred on Meta post-iOS-14\n\n## Your Task\n\nIn 45 minutes, write a **diagnosis memo** (1.5 pages):\n\n1. **Diagnostic hierarchy**: What are the 3 most likely root causes for CAC rise, ranked? Each with brief data support.\n2. **Individual channel analysis**: Which channels have the *real* problem, which have \"just attribution loss\"? How do you separate?\n3. **Quick wins (1–4 weeks)**: 3 measures with high probability of impact — concrete, no platitudes.\n4. **Medium-term (1–3 months)**: 2–3 structural changes likely to yield more, but take longer.\n5. **What you DON'T do**: Which obvious answer (\"more budget,\" \"shift to cheaper channels\") would you explicitly *reject* — and why?\n6. **Board message (2 sentences)**: How do you frame this for the CEO to present to the board?\n\n## Guiding Questions\n\n- Ad CTR -22% is the strongest single signal. Is it a creative problem (the 4 best-performers are worn out), audience fatigue, competitive auction pressure, or all three?\n- Landing page redesigned month 4 — but signup conversion only slightly down. Trial→paid down -11% though. Is that the redesign (different audience), the price increase, or the trial extension?\n- Trial extension should boost retention. But trial→paid is worse. Expected — or a sign longer trial attracts \"free users\"?\n- TikTok spend doubled, CAC +44%. Is that saturation or mis-targeting? How do you test?\n- Attribution is chaotic post-iOS-14. How much of your \"CAC rise\" is real vs. measurement error? What would be a solid experiment (geo test, lift study)?\n\n## Match-Info\n\n**Case fits:** Growth Marketer, Performance Marketing Analyst, Paid Media Specialist, SEO Specialist, Lifecycle / CRM Marketer, Marketing Analyst, Growth Product Manager\n**Tests primarily:** funnel analysis, channel economics, critical thinking on attribution, multi-channel orchestration\n**Industry fit:** D2C, e-commerce, B2C SaaS, subscription businesses"
  },
  {
    "id": "cs-30-lifecycle-reactivation",
    "title": "Reactivation Sequence: Winning Back 45,000 Sleeping Customers in 3 Weeks",
    "cluster": "performance_marketing",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Lifecycle / CRM Marketer",
      "Email Marketing Specialist",
      "Growth Marketer",
      "Marketing Analyst",
      "Customer Success Manager",
      "Content Marketer",
      "Brand Marketer"
    ],
    "matchesFields": [
      "Marketing",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Segmentation",
      "Copy Intelligence",
      "Flow Design",
      "Experimental Design"
    ],
    "companyName": "Nordfresh",
    "logoUrl": "/company-logos/cs-30-lifecycle-reactivation.png",
    "body": "<img src=\"logos/cs-30-lifecycle-reactivation.png\" alt=\"Nordfresh logo\" width=\"120\" align=\"right\" />\n\n# Reactivation Sequence: Winning Back 45,000 Sleeping Customers in 3 Weeks\n\n## Context\n\n**Nordfresh** is a North German plastic-free grocery subscription service (regional food delivery in reusable containers). €18M ARR, 62,000 active paying customers, 120,000 total registered. The brand has never run a major reactivation campaign since launch in 2019.\n\n**The \"sleeping\" base:** 45,000 customers who haven't placed an order in **90+ days**, but haven't formally cancelled. They're in a grey zone: technically paying (or not—depending on product variant), but inactive.\n\nToday is Wednesday. The **Spring Campaign** (\"Regional Spring\") kicks off in 3 weeks on Friday. The CMO wants the reactivation sequence to start **1 week before** the main campaign, so sleepers don't compete with new leads. You have 2 weeks until launch.\n\n## Your Role\n\nYou're a **Lifecycle Marketer** at Nordfresh. You manage the email system (Klaviyo), the CRM stack, and segmentation. In 25 minutes, you need to present the sequence plan to the CMO.\n\n## Current State\n\n**What you know about the 45k sleeping customers:**\n- Average historical customer value: €340 / year\n- 62% made >3 orders before falling dormant; 38% were \"low-engagers\" (1–2 orders)\n- Average time since last order: 147 days\n- Top 3 cited reasons in cancellation interviews (80 ex-customers): \"too inflexible\" (34%), \"too expensive\" (28%), \"different concept suits me better\" (17%), \"life circumstances changed\" (21%)\n- Historical email open rate: 28% (industry avg: 22%), likely lower for this cohort\n- Klaviyo warning: reactivating \"sleepers\" over 180 days risks deliverability damage\n\n**Product levers you can use:**\n- Discount up to 25% on first re-order (CMO approved)\n- More flexible delivery schedules (launched in January—many sleepers don't know about it)\n- \"Pause\" feature (instead of cancellation)—launched in March\n- Additional regional suppliers in range since Q4\n- Spring Box for €19.99 with 6 regional seasonal products (low-friction entry)\n\n**Organizational constraints:**\n- Shipping capacity is already allocated to the main campaign. If reactivation succeeds and adds >2,000 active customers in the first week, operations risks overload.\n- No extra creative resources—you get 1 designer for 3 days\n- Budget for external ads / retargeting: €12,000\n\n**Comparable case benchmarks (industry):**\n- Typical email reactivation rate: 3-8% of contacted cohort\n- SMS has ~35% open rate with this segment, but high opt-out risk\n- \"Win-back\" campaigns typically need 3-5 touches over 2-3 weeks\n\n## Your Task\n\nIn 25 minutes, as a **campaign plan for the CMO**:\n\n1. **Segmentation of the 45k:** Into which 2–4 sub-segments would you divide the sleeping base? Justify with data points.\n2. **Sequence Design:** For your key segment—sketch 4–6 touches over 2 weeks (channel, day, theme, core message, CTA).\n3. **Copy Hook for First Touch:** Subject line + opening sentence for Segment 1—*written out in full*, not described.\n4. **A/B Tests in the Sequence:** Which 2 tests would you build in that deliver learnings for future campaigns?\n5. **Stop and Downgrade Logic:** When do you remove someone from the sequence? When do you move them to a \"Goodbye\" flow instead of pushing further?\n6. **Success Metrics:** 3 target KPIs with realistic target values\n7. **One Question for the CMO:** What decision do you need from him before you launch?\n\n## Guide Questions\n\n- 38% of sleepers were originally \"low-engagers.\" Do you try to win them back—or accept they were never loyal and focus on the 62% high-engagers?\n- Discount up to 25% is tempting, but trains customers on discounts. When do you deploy it (first touch? last touch? at all?)—what's the alternative to discounting?\n- \"Too expensive\" was the second-most cited cancellation reason. But price is non-negotiable. How does the campaign address this objection without denying it?\n- The Pause feature is *new*—many sleepers don't know about it. Is it your strongest re-engagement lever (because it solves \"too inflexible\"), or does it feel like \"a trick to avoid cancelling\"?\n- If the campaign over-performs and operations gets overloaded, that becomes a problem. Do you build in a \"phased rollout\" (e.g., 33% of cohort Week 1, next tranche later)?\n\n## Match Info\n\n**Fits:** Lifecycle / CRM Marketer, Email Marketing Specialist, Growth Marketer, Marketing Analyst, Customer Success Manager, Content Marketer, Brand Marketer\n**Tests primarily:** segmentation logic, flow design, copy judgment, operational thinking\n**Industry fit:** D2C, Subscription, E-Commerce, all customer-lifecycle-driven business models"
  },
  {
    "id": "cs-31-journalism-whistleblower",
    "title": "Investigation: How Do You Verify Claims from an Anonymous Whistleblower?",
    "cluster": "journalism",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Reporter / Staff Writer",
      "Investigative Journalist",
      "News Editor",
      "Fact Checker",
      "Researcher (data journalism)",
      "Editorial Assistant",
      "Policy Researcher"
    ],
    "matchesFields": [
      "Research",
      "Operations"
    ],
    "matchesIndustries": [
      "Media",
      "Public"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Source Assessment",
      "Information Triangle Verification",
      "Ethical Judgment",
      "Structured Research"
    ],
    "companyName": "ReinFleisch AG",
    "logoUrl": "/company-logos/cs-31-journalism-whistleblower.png",
    "body": "<img src=\"logos/cs-31-journalism-whistleblower.png\" alt=\"ReinFleisch AG logo\" width=\"120\" align=\"right\" />\n\n# Investigation: How Do You Verify Claims from an Anonymous Whistleblower?\n\n## Context\n\nYou're a **Reporter** at a major German newspaper (Investigative Unit, 12 colleagues). Four days ago, someone reached out through your SecureDrop system claiming to be a Senior Supply Chain Manager at a major German **animal-welfare-certified** meat producer—**ReinFleisch AG** (€680M revenue, known as a \"socially responsible\" player).\n\nThe whistleblower alleges:\n1. At one of their 4 slaughterhouses, animal transports routinely exceed certified 4-hour limits (documentation of circumvention exists).\n2. The animal welfare certifier (a well-known private auditing firm) receives announced visits; \"bad weeks\" are scheduled around.\n3. A board member said in an internal meeting: \"The cert is marketing. We can't afford the premium segment if we did everything strictly.\"\n\nThe whistleblower has provided **an Excel spreadsheet** (transport logs for 3 months) and an **audio recording** (23 seconds) of the quoted board member. They want to remain anonymous and offer further meetings via an encrypted app.\n\n## Your Role\n\nYour editorial leadership (head of investigations) just called you in: Is this a story, and if so—how do we proceed systematically? You have today's 50 minutes until a follow-up meeting where you decide whether to commit 6–8 weeks of resources to this.\n\n## Current Situation\n\n**Source landscape:**\n- 1 anonymous insider (whistleblower), ~45 min audio interview already conducted\n- 1 document (Excel, 3 months of transport logs, 340 rows)\n- 1 audio recording (23 sec, background noise, voice clearly audible, board member not named but identifiable)\n- Whistleblower can name ~2 additional people in the company who \"might be willing to talk\"—but hasn't made introductions\n\n**Publicly available information:**\n- ReinFleisch AG is not publicly traded (family business with private equity stake)\n- Certification: \"Animal Welfare Premium Plus\" (private standard)\n- Certifier: TierControl GmbH (private, issues ~60% of all German premium certs)\n- Prior coverage: 2022 brief report by Hessenschau on working conditions at one of their slaughterhouses—company denied, no consequences\n- Board has 4 known members\n\n**Resource reality:**\n- Your budget for 6-8 weeks: 1 FTE (you) + 0.5 editor + 0.2 fact-checker + 0.2 data journalist\n- External costs: up to €6,000 (research, travel, legal review)\n- Your editor-in-chief wants hard evidence before publication—the paper faced a lawsuit in 2022 over insufficient sourcing\n- Rumor: a weekly magazine is also working on animal welfare issues generally—unclear if on this specific case\n\n**Legal and ethical constraints:**\n- Audio recordings without consent: legally problematic (§201 StGB), but differently evaluated as journalistic evidence\n- Source protection: press privilege §53 StPO, but digital traces are hard to protect\n- At publication: company must get a right to respond (risk of source exposure)\n- Cert claims are legally touchy (fraud, competition law)\n\n## Your Task\n\nCreate a **research plan** in 50 minutes for the follow-up meeting:\n\n1. **Story Assessment (3-5 sentences):** Is there a story here—and how big is it? (Distinguish: the single-slaughterhouse angle, the systemic animal-welfare angle, the board-quote angle—each requires different proof.)\n2. **Source Prioritization:** Which 3-5 additional sources do you need to triangulate the main claims?\n3. **Document Verification:** How do you verify the Excel logs and the audio recording? Which specialists would you bring in?\n4. **Research Sequence (6–8 weeks, rough):** In what order would you proceed? What comes first (low-risk research), what later (stakeholder confrontation)?\n5. **Source Protection:** Which 3 operational measures would you take to protect the source?\n6. **Stop Criteria:** Under what conditions would you abandon the project? Conversely: when would you have enough evidence to publish?\n7. **Legal-Ethical Questions:** What needs to be cleared with the legal department before you continue?\n\n## Guide Questions\n\n- The whistleblower is your primary source. But journalism standards say: never rely on one source for a story this big. What if you *don't find* a second source—do you kill it, or how do you work with it?\n- The audio quote is explosive, but 23 seconds and without naming the board member. It's simultaneously the most media-powerful and most legally risky piece of evidence. How do you handle it—in research and possible publication?\n- TierControl GmbH issues 60% of premium certs. If they really do announce visits, that's a system problem, not a single-company problem. Which story is more important journalistically—the specific one or the structural one?\n- The 2 \"might be willing to talk\" contacts via the whistleblower: high-value leads, but also exposure risk (if two additional insiders talk, you narrow the pool of possible original whistleblowers). How do you approach this?\n- ReinFleisch will respond with lawyers. What evidence do you need to *have* before you ask for a statement—and what changes about your research once you do?\n\n## Match Info\n\n**Fits:** Reporter / Staff Writer, Investigative Journalist, News Editor, Fact Checker, Researcher (data journalism), Editorial Assistant, Policy Researcher\n**Tests primarily:** source judgment, investigative methodology, ethical thinking, risk assessment\n**Industry fit:** Journalism, research roles at NGOs, political advisory, think tanks"
  },
  {
    "id": "cs-32-renewables-ppa-deal",
    "title": "PPA Deal: Does This 15-Year Solar Contract Make Sense for the Corporate Client?",
    "cluster": "energy_renewables",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Renewable Energy Analyst",
      "Energy Trader (junior)",
      "Power Grid Analyst",
      "Sustainability Analyst",
      "Corporate Strategy Analyst",
      "Infrastructure Investment Analyst",
      "Project Finance Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Research",
      "Operations"
    ],
    "matchesIndustries": [
      "Energy",
      "Industrial",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Energy Market Understanding",
      "Long-Term Contract Valuation",
      "Price-Risk Analysis",
      "ESG Business Integration"
    ],
    "companyName": "Eckstein Pharma",
    "logoUrl": "/company-logos/cs-32-renewables-ppa-deal.png",
    "body": "<img src=\"logos/cs-32-renewables-ppa-deal.png\" alt=\"Eckstein Pharma logo\" width=\"120\" align=\"right\" />\n\n# PPA Deal: Does This 15-Year Solar Contract Make Sense for the Corporate Client?\n\n## Context\n\n**Eckstein Pharma** is a German pharma company (€2.2B revenue, 3 production sites in Germany + 1 in Czech Republic). Annual electricity consumption: 420 GWh, of which 85% comes from conventional supply (green tariff, basic quality). Current: €72M energy costs p.a.\n\nThe board has committed to **SBTi 1.5° aligned climate targets:** 50% CO2 reduction by 2030 (vs. 2020 baseline). A major lever: real green power, preferably from new plants (additionality).\n\nA project developer (**SolarCom GmbH**) is offering a **15-year Power Purchase Agreement (PPA)** for a new solar project in Brandenburg: **180 MW installed capacity**, operational by end of 2027, estimated annual output 198 GWh. Proposed price: **€74/MWh fixed** over 15 years.\n\n## Your Role\n\nYou're the **Renewable Energy Analyst** at Eckstein Pharma (hired 8 months ago, reporting to the COO). The COO has asked you to prepare a decision paper for the board in 2 weeks. Today you focus on the core analysis.\n\n## Current Situation\n\n**The proposed PPA:**\n- Type: Physical Corporate PPA, Grid Delivery (grid fees additional)\n- Share: 47% of Eckstein's annual electricity consumption\n- Price: €74/MWh, fixed, no indexing\n- Term: 15 years, starting 2027\n- \"Take-or-pay\" clause: 95% of forecasted output\n- Certificates: Renewable Energy Guarantees of Origin (RGOs) transfer to Eckstein\n- Project status: planning permission in hand, grid connection confirmed for Q3 2027\n\n**Electricity price context (today):**\n- German baseload 2024: ~€95/MWh (average), volatile\n- Solar off-peak price (generator side, cheap hours): ~€45-55/MWh\n- Expected EEX forwards 2025–2030: €70–110/MWh range, dependent on gas, CO2 cert, nuclear exit, EE expansion\n- Eckstein's current blended rate: €164/MWh including green premium, grid fees, levies\n- **\"Bare\" commodity component** (grid + levies excluded): ~€88/MWh\n\n**Alternative options under discussion:**\n1. **Do Nothing:** Continue green tariffs, no additionality, but no long-term lock-in\n2. **Smaller PPA** (50 MW, different developer): €79/MWh, 10-year term, covers 13% of demand\n3. **Solar On-Site:** Self-install on rooftops at 3 German sites, estimated 14 GWh/year output, €16M capex, 9-year payback\n4. **Green Certificate Purchase:** Buy RGOs annually, no physical delivery, ~€2/MWh annually, but weak sustainability claim (no additionality)\n\n**Risks & Constraints:**\n- Eckstein's 3 production sites have baseload profiles (pharma runs 24/7); solar delivers daytime only—**profile mismatch:** 35-40% of generated kWh fall outside Eckstein's direct use (grid-sell or pooling)\n- Treasury policy: commitments >€50M need board approval (PPA: 15 years × ~€14-16M p.a. = €210M+)\n- Currency: PPA in EUR, all costs EUR—no risk\n- Regulatory: power levies may change; PPA-specific law still in flux\n- Project carries development and operational risks—what if delays or poor output?\n\n**Insight from 2 internal conversations:**\n- CFO: \"€74 sounds cheap today, but locks us in for 15 years. What if prices crash?\"\n- Head of Sustainability: \"Without a real PPA we can't meet SBTi. Green certs won't cut it.\"\n- Brandenburg site manager: \"We need stable power supply. No crazy dependencies.\"\n\n## Your Task\n\nIn 50 minutes, as a **board decision memo** (3 pages):\n\n1. **Recommendation (1 sentence):** Yes, no, or modified—first paragraph, first page.\n2. **Economic Analysis:**\n   - NPV sketch over 15 years with 3 price scenarios (Low: €55 avg, Mid: €80 avg, High: €110 avg)\n   - Break-even vs. \"Do Nothing\"\n3. **Risk Matrix:** 4-5 main risks, each with likelihood and impact\n4. **ESG Assessment:** How well does the PPA address SBTi commitment (additionality, measurement, business integration)?\n5. **Portfolio Recommendation:** Is the 180 MW deal the right size? Or should Eckstein combine smaller PPA + on-site + other options?\n6. **Negotiation Demands:** What are the 3-5 most important contract changes/negotiation points before signing?\n7. **Open Issues:** What can't your memo resolve in 2 weeks, and what are the next steps?\n\n## Guide Questions\n\n- €74 vs. €88 commodity today = apparent -16% savings. But that's only a \"saving\" if the market stays above €74 for 15 years. What's the *stochastic* expectation over 15 years?\n- The 35-40% profile mismatch: Eckstein sells solar excess to the grid at whatever-the-grid-pays-right-now. How do you model this revenue/cost offset seriously?\n- The CFO asks: \"What if prices crash?\" The honest answer: 15-year PPA at €74 while market trades at €35 would be ugly. How do you assess this asymmetry (downsides certain, upsides hypothetical)?\n- SBTi demands \"additionality\"—new EE capacity. Is this 180 MW PPA really additional, or would SolarCom have built it anyway? How do you verify?\n- 15 years is enormous. Eckstein was founded in 1938—it'll almost certainly exist in 15 years. But will the Brandenburg site? Location closure risk, M&A risk—how do you hedge?\n\n## Match Info\n\n**Fits:** Renewable Energy Analyst, Energy Trader, Power Grid Analyst, Sustainability Analyst, Corporate Strategy Analyst, Infrastructure Investment Analyst, Project Finance Analyst\n**Tests primarily:** energy market understanding, long-term risk evaluation, ESG integration, negotiation thinking\n**Industry fit:** Energy industry, corporate sustainability, infrastructure investment, project finance"
  },
  {
    "id": "cs-33-demand-planner-stockout",
    "title": "Q4 Stock Crisis: 3 Top Products at Risk of Stockout—What's Your Move?",
    "cluster": "supply_chain_logistics",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Demand Planner",
      "Supply Chain Analyst",
      "Procurement Analyst",
      "Logistics Analyst",
      "Warehouse / Inventory Operations",
      "Operations Consultant",
      "Business Operations Analyst",
      "S&OP Coordinator"
    ],
    "matchesFields": [
      "Operations",
      "Data"
    ],
    "matchesIndustries": [
      "Consumer",
      "Industrial",
      "Services"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Prioritization Under Time Pressure",
      "Supply-Chain Thinking",
      "Cross-Functional Stakeholder Communication",
      "Trade-off Analysis"
    ],
    "companyName": "AmbriGlow",
    "logoUrl": "/company-logos/cs-33-demand-planner-stockout.png",
    "body": "<img src=\"logos/cs-33-demand-planner-stockout.png\" alt=\"AmbriGlow logo\" width=\"120\" align=\"right\" />\n\n# Q4 Stock Crisis: 3 Top Products at Risk of Stockout—What's Your Move?\n\n## Context\n\n**AmbriGlow** is a German designer lighting manufacturer (€85M revenue, direct-to-trade + own e-commerce, 18% market share in German segment). Production: 60% in Portugal (own facility), 40% in Far East (3 partner factories). Q4 accounts for **45% of annual revenue**—Christmas peak with massive volume in premium table lamps and pendant lights.\n\nToday is **October 29** (Tuesday). Black Week kicks off in 4 weeks. Yesterday's supply planning review made clear: **three top products** will go out of stock before Christmas.\n\n## Your Role\n\nYou're the **Demand Planner** for Home Lighting (47 SKU responsibility). The VP Operations expects your prioritization recommendation at 3 PM today. You have 25 minutes.\n\n## Current State—The 3 Critical Products\n\n**Product A — \"Luma Table Pendant\"**\n- Q4 2023 bestseller (€4.2M Q4 revenue, 38% of pendant category)\n- Portugal production. Current stock: 6,800 units. Q4 forecast demand: 14,200 units.\n- Gap: **-7,400 units**. Will reach current production capacity not until February 2026.\n- Option: airfreight from Portugal (3 days, +€18/unit vs. standard truck €3/unit). Fab capacity isn't the issue—truck availability is.\n- Margin: 42% (premium)\n\n**Product B — \"Ora Floor Lamp\"**\n- #3 bestseller, but 70% new-customer acquisition (crucial for business model)\n- Far East production (partner: Fujian Lighting Co.). Current stock: 3,200 units. Q4 forecast: 9,800 units.\n- Gap: **-6,600 units**. Airfreight possible (+€24/unit vs. sea €4/unit), lead time air ~7 days ex-factory.\n- But: Fujian just reported being at Q4 capacity. Additional production earliest mid-November, then airfreight required.\n- Margin: 38%\n\n**Product C — \"Mirio Wall Sconce\"**\n- #8 bestseller. High AOV (average order value)—rarely single, often 4-packs\n- Vietnam production (partner: SouthStar Lighting). Stock: 4,800 units. Q4 forecast: 11,200 units.\n- Gap: **-6,400 units**.\n- SouthStar has a problem: critical glass component from Turkey; supplier shortage there. Production halted 10 days. Earliest restart Nov 15, realistically mid-December.\n- Margin: 51% (highest of the three)\n\n**Additional context:**\n- Black Week 2024 revenue forecast: €11M (vs. €10.2M 2023, +8%)\n- Q4 marketing budget: €1.4M, 80% already allocated to these 3 products, some live (inventory ROAS question!)\n- CEO last week: \"No stockouts on bestsellers—this is a growth year\"\n- 4 key retail customers (department stores) have pre-orders for Products A and C; shortfall = potential penalties (~€120k)\n- Alternative product \"Luma 2.0\" (similar design, newer) has 12k+ stock, never marketed—could replace Product A, but €20 price premium\n\n## Your Task\n\nIn 25 minutes, as a **1-page recommendation to VP Operations**:\n\n1. **Prioritization Decision:** Where do airfreight budget, marketing focus, alternative-SKU activation go? Clear recommendation per product.\n2. **Concrete Actions:**\n   - Product A: How many units, how fast? Cost?\n   - Product B: Negotiate with Fujian? Alternative factory? Reduce forecast?\n   - Product C: Is this effectively lost for Q4? How do you communicate it?\n3. **Financial Impact:** Which options create what costs, prevent what revenue loss?\n4. **Cross-functional Impact:** Who else do you call today? (Marketing, Sales, Retail, Finance—and what's your message to each?)\n5. **Lessons-Learned Flag:** 2 things that need to go into your S&OP process for 2026 to prevent this.\n\n## Guide Questions\n\n- Margin, revenue volume, new-customer effect (Product B)—which is the right prioritization metric? There's no \"simple\" answer.\n- Airfreight for Product A: 7,400 × €18 = €133k cost. Worth it to prevent ~€3M Q4 revenue loss? Yes—but then: why not all three?\n- Product C has highest margin but biggest uncertainty (supplier unknown). Is it rational to focus resources on the *uncertain* product, or on the sure-delivery ones (A, partial B)?\n- The \"Luma 2.0\" replacement angle is tricky: you can redirect marketing, but price is €20 higher—conversion rate will differ. Test-and-learn moment or emergency band-aid?\n- Retail penalties: preventing €120k in penalties is worth €120k in cost, but not €200k. How do you count reputation costs?\n\n## Match Info\n\n**Fits:** Demand Planner, Supply Chain Analyst, Procurement Analyst, Logistics Analyst, Warehouse / Inventory Operations, Operations Consultant, Business Operations Analyst, S&OP Coordinator\n**Tests primarily:** prioritization under pressure, supply-chain thinking, trade-off analysis, operational communication\n**Industry fit:** Consumer goods, retail, industrial, all manufacturing and trading industries"
  },
  {
    "id": "cs-34-aerospace-anomaly",
    "title": "Satellite Telemetry: Unexplained Voltage Drops on Three Missions",
    "cluster": "aerospace_defence",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Systems Engineer (aerospace)",
      "Aerospace Analyst",
      "Test Engineer",
      "Reliability Engineer",
      "Mechanical Engineer (aerospace)",
      "Defence Strategy Associate",
      "Satellite Operations Engineer",
      "Product Engineer"
    ],
    "matchesFields": [
      "Engineering",
      "Research",
      "Data"
    ],
    "matchesIndustries": [
      "Industrial",
      "Mobility",
      "Public"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Root-Cause Analysis on Complex Systems",
      "Uncertainty Awareness",
      "Hypothesis Trees",
      "Technical Communication Under Pressure"
    ],
    "companyName": "OrbCom Systems",
    "logoUrl": "/company-logos/cs-34-aerospace-anomaly.png",
    "body": "<img src=\"logos/cs-34-aerospace-anomaly.png\" alt=\"OrbCom Systems logo\" width=\"120\" align=\"right\" />\n\n# Satellite Telemetry: Unexplained Voltage Drops on Three Missions\n\n## Context\n\n**OrbCom Systems** is a German satellite manufacturer (mid-size, 320 employees, ~€180M revenue). Main product line: small satellites 50–200 kg for Earth observation and IoT communication, mostly launched as secondary payload on SpaceX Falcon 9.\n\nFor the past 4 months, an unexplained pattern has emerged: On **three missions** (launch dates: March, July, August), the telemetry shows **intermittent voltage drops in the secondary power bus**—roughly every 6–14 days for 3–8 seconds, then return to normal. The satellites continue operating; payload data flows, but some telemetry channels show gaps or noisy readings. So far no mission-critical impact, but customers (2 government agencies, 1 commercial operator) are asking questions.\n\n## Your Role\n\nYou're a **Systems Engineer** on OrbCom's Anomaly Review Board (ARB). Your director just made you the lead analyst for this anomaly. In 2 weeks you have an ARB review with customers + aerospace regulator. You need to deliver a solid **hypothesis, investigation plan, and risk assessment** by then.\n\n## Current Data—Technical Details\n\n**Affected Satellites:**\n\n| Sat-ID | Launch | Mission | Type | Platform Gen |\n|---|---|---|---|---|\n| OBC-214 | March | Earth observation (Gov) | 120kg | Platform v3.2 |\n| OBC-219 | July | IoT Communication (Commercial) | 80kg | Platform v3.2 |\n| OBC-222 | August | Earth observation (Gov) | 150kg | Platform v3.2 |\n\n**All three share:**\n- Platform generation v3.2 (last revision 2 years ago)\n- Identical secondary power bus design (modified design, introduced in v3.1)\n- Same PCB batch for the Power Control Unit (PCU), from partner ElectroCentric GmbH\n- Same firmware version (v4.7.2) on the Satellite Control Unit\n\n**Differences between them:**\n- Different orbits (SSO 550km, SSO 600km, ICO 500km)\n- Different solar array configs (two deployable, one body-mounted)\n- Different payload workloads\n- Different sun-shadow cycles\n\n**What is NOT happening:**\n- Voltage drops don't occur at the same orbital positions\n- Not correlated with payload activity\n- Not correlated with magnetic anomalies (e.g., South Atlantic Anomaly)\n- Not correlated with thermal events\n\n**What has already been tested (prior analysis, 3 weeks):**\n- Firmware review of v4.7.2: found 2 minor bugs, nothing power-related\n- Hardware testing of spare PCUs in ground lab (vacuum chamber, thermal cycling): no fault reproduction\n- PCB batch documentation review from ElectroCentric: \"within tolerance,\" but partner has limited testing suite\n\n**Available resources:**\n- 3 systems engineers (including you) + 2 test engineers + 1 firmware engineer for 2 weeks\n- Full telemetry access (minute-level resolution on power channels)\n- 2 spare PCUs available in lab\n- Budget for special investigation (external test lab, materials analysis): €40,000\n- SpaceX has offered to share ARB data on similar incidents in their portfolio (if non-proprietary)\n- Partner ElectroCentric is cooperative but has limited extended resources\n\n**Customer context:**\n- Government customers will expect a clear root cause *and* corrective action at the ARB. \"We don't know yet\" is awkward, but more honest than speculation.\n- Commercial customer is more pragmatic, wants: mission impact?\n- OrbCom has **8 more v3.2 satellites** in production—the anomaly determines whether they ship or need rework.\n\n## Your Task\n\nIn 50 minutes, as a **Technical Memo (ARB Brief)**:\n\n1. **Hypothesis Tree** (described visually): Which 4–6 hypotheses do you prioritize? Structure them: Hardware / Firmware / Environment / Interaction Effect.\n2. **Evidence Mapping:** Which of your hypotheses explains *which* observations? Which contradict the facts? (Matrix)\n3. **Top Hypothesis:** Which is most likely? Justify in 3-5 sentences.\n4. **2-Week Investigation Plan:**\n   - Week 1 (quick clarifications)\n   - Week 2 (deeper testing)\n   - Which external resources (SpaceX data, external test lab) will you use?\n5. **Risk Assessment for 8 In-Production Satellites:** Stop delivery? Continue with caveat? Design change?\n6. **Customer Communication:** What do you say at the ARB meeting if the cause isn't definitively clear?\n\n## Guide Questions\n\n- All three affected sats have v3.2, identical PCU design, same PCB batch. That's a strong common-factor signal. But thousands of identical v3.1 sats fly without problems. What changed in v3.2?\n- \"Intermittent, every 6–14 days\": that's not a deterministic pattern. Random events (single-event latchup from radiation), thermal drift, or rare firmware race condition?\n- Ground testing doesn't reproduce the fault. That argues strongly *against* a simple hardware defect—but *for* an environmental effect or hardware-environment interaction (radiation, vacuum + thermal under load).\n- SpaceX shares ARB data: could be gold, but also risky (disclosing own failures to competitors). How do you use this cleanly?\n- The 8 production sats: if you say \"we suspect\" they'll be evasive. If you say \"all clear\" and it happens, it's a trust catastrophe. How do you frame the recommendation sentence?\n\n## Match Info\n\n**Fits:** Systems Engineer (aerospace), Aerospace Analyst, Test Engineer, Reliability Engineer, Mechanical Engineer (aerospace), Defence Strategy Associate, Satellite Operations Engineer, Product Engineer\n**Tests primarily:** systematic thinking on complex systems, hypothesis prioritization, technical writing, uncertainty management\n**Industry fit:** aerospace & defense, systematic engineering industries (automotive, medical devices, nuclear)"
  },
  {
    "id": "cs-35-wealth-portfolio-review",
    "title": "Wealth Review: An Entrepreneur Couple on the Cusp of Selling Their Business",
    "cluster": "retail_banking_wealth",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Wealth / Private Banking Analyst",
      "Financial Advisor (retail)",
      "Investment Advisor Associate",
      "Relationship Banking Trainee",
      "Portfolio Analyst",
      "FP&A Analyst",
      "Tax Advisor (junior)"
    ],
    "matchesFields": [
      "Finance",
      "Customer"
    ],
    "matchesIndustries": [
      "Finance",
      "Services"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Holistic Financial Analysis",
      "Client Context Understanding",
      "Tax and Legal Sensitivity",
      "Scenario Thinking"
    ],
    "companyName": "Köhler Präzisionsteile",
    "logoUrl": "/company-logos/cs-35-wealth-portfolio-review.png",
    "body": "<img src=\"logos/cs-35-wealth-portfolio-review.png\" alt=\"Köhler Präzisionsteile logo\" width=\"120\" align=\"right\" />\n\n# Wealth Review: An Entrepreneur Couple on the Cusp of Selling Their Business\n\n## Context\n\nYou work as a **Wealth Analyst** in the Private Banking team at a German private bank (€18B AUM, focused on entrepreneurs and HNWI/UHNWI). You support three senior bankers in the Rhine-Main region. One of them, Dr. Heidi Tewes, briefed you for Friday: **kickoff meeting with a new client couple**.\n\n**The Köhler couple** (she: 58, he: 61) faces a significant liquidity event: sale of their jointly owned business, **Köhler Präzisionsteile GmbH** (precision machining supplier, €42M revenue, 180 employees). Buyer: a Scandinavian strategic player (PE-backed). Expected after-tax proceeds: **~€24M** (dependent on final structure). Signing expected in 6–8 weeks.\n\n## Your Role\n\nDr. Tewes has asked you to prepare a **pre-briefing** by Thursday evening: Where do they stand financially today, what does the deal mean, what decisions loom, and where do we create value? You have 45 minutes today for the first structured paper.\n\n## Current Situation—Profile from Intake Form + 1 Pre-Call Hour\n\n**Wealth position (pre-deal):**\n- **Business stake:** 100% of Köhler Präzisionsteile GmbH, book value €8.4M, market value (from deal) ~€30M\n- **Primary residence** Kronberg: €2.8M, debt-free\n- **Vacation home** on Baltic Coast: €420k, debt-free\n- **Investment portfolios:** €1.6M (60% passive global equities, 30% bonds, 10% individual German blue chips)\n- **Rürup and company pension products:** €240k (minimally used, as self-employed)\n- **Cash:** €680k across various savings accounts\n\n**Family situation:**\n- 2 children: Anna (31), teacher, 1 child, married. Lukas (28), physics PhD student, single, in the US.\n- No business succession planned—hence the sale\n- Frau Köhler's parents (86, 84) live in their own home, care needs rising\n- No prenup, community of gains property regime\n\n**Values and goals (from conversation):**\n- Herr Köhler: \"We've worked hard. We want to enjoy the money, support the kids, and do something meaningful with it.\"\n- Frau Köhler: \"I want us to stay smart about this. And I want to make sure my parents are taken care when the time comes.\"\n- Both: \"No cliché investment products. We've read about what happened in 2022.\"\n- Timeline goals:\n  - Frau Köhler stays as consultant 12 months post-close, then completely out\n  - Herr Köhler plans to step back; possibly foundation engagement, sailing, write a book\n  - No concrete life-planning agenda, but 15-20 years of \"active retirement\" in mind\n  - Want to gift children at deal close, amount \"meaningful but not spoiling\"\n\n**Tax and legal position:**\n- Deal structure: share deal, both spouses 50% sellers\n- §17 Income Tax applies, but gain subject to partial-income method (60%) → estimated tax burden ~€5-7M at current structure\n- No holding structure in place (would have materially reduced tax—but restructuring now isn't tax-neutral before deal close)\n- Gift tax exemptions: €400,000 per child per parent every 10 years → €1.6M over 10 years can be gifted tax-free\n- No existing foundation, but family foundation mentioned in conversation\n\n**Banking context:**\n- Current house bank: major private bank, no deeper advisory for 3 years—Dr. Tewes met them via an M&A advisor working on the deal\n- Two other senior bankers on the team have signaled they want this mandate\n\n## Your Task\n\nIn 45 minutes, as a **pre-briefing for Dr. Tewes** (2 pages):\n\n1. **Situation Assessment (1 paragraph):** What's the core challenge for this couple? Not \"they have money\"—be precise.\n2. **Post-Deal Balance Sheet Sketch:** How will their wealth structure look immediately after close? Asset distribution, roughly, including the €24M cash.\n3. **4–6 Core Decisions** they must make in the next 6–12 months, prioritized:\n   - Near-term (0–3 months): cash parking, tax optimization before signing (if possible)\n   - Medium-term (3–12 months): allocation, gifts, foundation questions, real estate\n4. **Risks & Blind Spots:** What haven't they thought about yet? (Parents' care, spousal property regime risk, Lukas in US and US tax issues, etc.)\n5. **Product Landscape (rough, not a sales list!):** Which services/products fit conceptually? Which explicitly *don't*?\n6. **Core Questions for Kickoff:** 4–5 questions Dr. Tewes must ask to deepen understanding.\n\n## Guide Questions\n\n- €24M is \"a lot of money,\" but not infinite. Over 20 years of consumption + child support + parental care—is it comfortable or does it need disciplined planning?\n- The couple says \"no cliché products.\" That signals: BS-avoidance is a high priority. How do you offer a clear, passive-heavy strategy that doesn't scream \"wealth manager maximizing fees\"?\n- Gift planning: €1.6M tax-free over 10 years isn't much relative to €24M. Is a family foundation the better path? But: family foundations need runway and have their own complexity.\n- The son in the US is a tax time bomb (FBAR, PFIC, US rules on gifts). Has anyone flagged this? How do you raise it without sounding alarmist?\n- Parents' care situation is realistically imminent—but Frau Köhler only mentioned it in passing. Should it be in your briefing, or is this a later-conversation topic?\n- Community of gains property regime with no prenup at €24M: theoretically no problem, but divorce/death scenario changes everything. How do you address this without sounding paranoid?\n\n## Match Info\n\n**Fits:** Wealth / Private Banking Analyst, Financial Advisor (retail), Investment Advisor Associate, Relationship Banking Trainee, Portfolio Analyst, FP&A Analyst, Tax Advisor (junior)\n**Tests primarily:** holistic financial thinking, client empathy, tax and legal awareness, communication sensitivity\n**Industry fit:** private banking, family office, wealth management, high-net-worth tax advisory"
  },
  {
    "id": "cs-36-corporate-law-ma-dd",
    "title": "M&A Due Diligence: Your Top 5 Red Flags from the Contract Portfolio",
    "cluster": "corporate_law",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Junior Associate (M&A)",
      "Trainee Solicitor",
      "Corporate Paralegal",
      "Legal Intern (transactional)",
      "M&A Integration Analyst",
      "Compliance Analyst",
      "Contracts Manager",
      "Corporate Development Analyst"
    ],
    "matchesFields": [
      "Research",
      "Finance",
      "Operations"
    ],
    "matchesIndustries": [
      "Finance",
      "Services",
      "Tech",
      "Industrial"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Contract Analysis",
      "Risk Prioritization",
      "Precise Legal Writing",
      "Client Business Thinking"
    ],
    "companyName": "Artemio Software",
    "logoUrl": "/company-logos/cs-36-corporate-law-ma-dd.png",
    "body": "<img src=\"logos/cs-36-corporate-law-ma-dd.png\" alt=\"Artemio Software logo\" width=\"120\" align=\"right\" />\n\n# M&A Due Diligence: Your Top 5 Red Flags from the Contract Portfolio\n\n## Context\n\nYou work as a **Junior Associate** (1.5 years PQE) on the M&A team at an international law firm in Frankfurt. Your client: a US software company acquiring **Artemio Software GmbH**—a German scale-up (B2B SaaS for HR analytics, 130 employees, €28M ARR, €210M target purchase price).\n\nCommercial due diligence (external consultants) and your legal team are working in parallel on separate workstreams. Your partner, Dr. Alegra Kraus, assigned you to the commercial contracts workstream: review of major customer and supplier agreements. For the past 4 days you've had VDR access and have read through 400+ contract documents.\n\nTomorrow you need her **top-5 red flags memo**, which feeds into the firm's aggregate DD report and combines with the commercial DD team's findings.\n\n## Your Role\n\nJunior Associate on Dr. Kraus's team. You've already read the 20 most important customer contracts (~85% of ARR) and the 15 most important supplier contracts. Today you're structuring your findings.\n\n## Current Situation—Key Findings from Your Notes\n\nFrom your reading notes (unpriorized bullet list):\n\n**Customer contracts (top 20 by ARR):**\n\n1. **DeutscheTele AG** (€3.2M ARR, 12% of revenue): Change-of-control clause allows customer to terminate within 90 days upon ownership change; 3-year term runs through 2026.\n2. **SchneiderFarben Concourse** (€2.1M ARR): Exclusivity commitment—\"Artemio will not serve direct competitors of SchneiderFarben,\" definition vague, scope unclear.\n3. **Bayerwerke Pharma** (€1.8M ARR): Warranty \"no data processing outside EU,\" hard to audit, Artemio uses AWS Frankfurt + global backup replication.\n4. **UK Large Customer Harborn Ltd** (€1.4M ARR): Liability cap only 1× annual fee—unusually low for B2B SaaS under German law.\n5. **Smaller customers (top 5–20):** Standard agreements with LTAs, no individual red flags, but 8 of 15 have auto-renewal decisions in next 12 months.\n6. **34 customers** have MFN (Most-Favored-Nation) clauses triggered on price increases above a threshold.\n7. **11 contracts** with US customers governed by California law—irrespective of corporate situs.\n\n**Supplier contracts (top 15 by value):**\n\n8. **OpenAI Enterprise Agreement** (~€480k p.a.): Core enabler of product AI features, but no exclusivity, no SLA, terms can update regularly.\n9. **AWS Enterprise Agreement:** Standard, no issues flagged.\n10. **2 outsourced development contracts** (Poland): Data processing agreements in place, but sub-processor chains not fully documented.\n11. **Meta Graph API license:** Depends on Meta's product continuing; no backup scenario.\n12. **Munich office lease:** 8-year term with limited tenant break clause, €340k p.a., exit only if revenue declines >30% over 2 years.\n13. **2 key-person contracts** (CTO + Head of Product): Include change-of-control \"golden parachutes\" with combined severance ~€800k, plus accelerated vesting on outstanding options.\n\n**Additional legal/organizational findings:**\n\n14. Pending lawsuit: former senior engineer suing for wrongful termination + bonus claim; claim value ~€450k, Artemio losing prior rounds.\n15. **GDPR notice** from last year (Bavarian DPA): Artemio cited for incomplete privacy policy; reportedly fixed, but no written \"all-clear\" from regulator in VDR.\n16. Artemio acquired 3 companies in 4 years (two hire-acqs, one product-acq)—integration docs sparse; some employee contracts still under old structures.\n\n**Deal context:**\n- US buyer plans product integration with own HR suite portfolio in 12–18 months\n- Buyer has loosely committed to honoring CoC clauses in prior EU acquisitions\n- Timeline is aggressive—signing within 8 weeks\n\n## Your Task\n\nIn 50 minutes, as a **top-5 red flags memo** (1.5 pages, professional legal language):\n\n1. **Executive Summary** (4–5 sentences): Overall legal risk landscape from commercial DD.\n2. **Top 5 Red Flags**, prioritized by:\n   - Probability of real impact\n   - Materiality (€ impact, operational scope, deal-critical?)\n   - Mitigation feasibility (can this be negotiated/fixed?)\n\n   For each red flag:\n   - Fact pattern (2–3 sentences, factual)\n   - Risk assessment (why critical?)\n   - Mitigation approach (purchase price adjustment, W&I insurance, reps & warranties, closing condition, ringfencing)\n\n3. **Catalog of Open Items:** 3–5 topics you couldn't fully resolve this DD round that Dr. Kraus must communicate clearly.\n4. **Recommended Client Communication:** One paragraph on how to present this to the US buyer—serious without alarmism, but also not downplaying.\n\n## Guide Questions\n\n- 34 MFN clauses are administratively \"normal,\" but could create *material* cost post-deal during product integration and price harmonization. Do you rank this higher than a single-customer CoC?\n- The DeutscheTele CoC (€3.2M, 12%) is individually critical. But it's also mitigable (obtain pre-close, secure continuation commitment). How high do you prioritize?\n- \"OpenAI agreement without SLA\"—technically normal, but structurally risky for a product fundamentally built on LLM features. How do you describe that neutrally?\n- The 2 key-person golden parachutes are standard in tech M&A and usually negotiated. Do they make top 5, or is it \"noise\"?\n- Open employment lawsuit: €450k is noise in a €210M deal. But signal of cultural issues? Red flag or note?\n\n## Match Info\n\n**Fits:** Junior Associate (M&A), Trainee Solicitor, Corporate Paralegal, Legal Intern (transactional), M&A Integration Analyst, Compliance Analyst, Contracts Manager, Corporate Development Analyst\n**Tests primarily:** contract analysis, impact prioritization, legal writing, commercial thinking\n**Industry fit:** law firms, in-house legal, M&A advisory, transaction-based consulting"
  }
];
