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
  intro?: {
    summary: string;
    glossary: { term: string; definition: string }[];
  };
  desk?: {
    quote: string;
    authorName: string;
    authorTitle: string;
    authorInitials: string;
  };
  companyBlock?: {
    tagline: string;
    primaryTag: string;
    secondaryTags: string[];
    totalTimeLabel: string;
  };
  tasks?: ChallengeTask[];
}

export interface ChallengeResource {
  title: string;
  subtitle: string;
  icon: string;
}

export interface QuickCheckOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface AnalysisTask {
  type: "analysis";
  title: string;
  durationMin: number;
  scoredOn: string[];
  quickCheck: { question: string; options: QuickCheckOption[] };
  prompt: string;
  dataTable?: { columns: string[]; rows: string[][] };
  textarea: { placeholder: string; wordLimit: number };
  resources: ChallengeResource[];
}

export interface PickerOption {
  id: string;
  emoji: string;
  name: string;
  sub: string;
}

export interface MatchingRow {
  factor: string;
  correctReasonId: string;
  options: { id: string; text: string }[];
}

export interface RecommendationTask {
  type: "recommendation";
  title: string;
  durationMin: number;
  scoredOn: string[];
  brief: string;
  picker: { label: string; options: PickerOption[] };
  matching: { instruction: string; rows: MatchingRow[] };
  textarea: {
    label: string;
    helperHtml: string;
    structureTip: string;
    placeholder: string;
    wordLimit: number;
  };
  resources: ChallengeResource[];
}

export interface StanceOption {
  id: string;
  icon: string;
  title: string;
  sub: string;
  coachingHint: string;
}

export interface CurveballTask {
  type: "curveball";
  title: string;
  durationMin: number;
  scoredOn: string[];
  curveballHtml: string;
  recapText: string;
  insight: { label: string; text: string };
  stancePicker: { options: StanceOption[] };
  textarea: {
    label: string;
    helperHtml: string;
    placeholder: string;
    wordLimit: number;
  };
}

export type ChallengeTask = AnalysisTask | RecommendationTask | CurveballTask;

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
    "body": "<img src=\"logos/cs-01-pm-feature-cut.png\" alt=\"ShipFlow logo\" width=\"120\" align=\"right\" />\n\n# Feature Cut: What Would You Remove from the Q3 Roadmap?\n\n## Context\n\n**ShipFlow** is a 45-person Series A logistics SaaS based in Berlin. The company coordinates shipping for mid-market e-commerce merchants and has scaled to €8M ARR in 18 months. The founding team is currently preparing for Series B (target: €20M) — strong product traction in Q3 is critical for the valuation.\n\nThe engineering team has 12 developers and has been at capacity for 6 weeks. The CEO wants to deliver more, while the engineering leads are struggling with technical debt.\n\n## Your Role\n\nYou are **Product Manager** for the core platform. The roadmap session with engineering leads just wrapped: the realistic delivery budget for Q3 is **4–5 features**. On the planning list are **8 features** — all with solid stakeholders backing them. You need to decide tonight what gets cut, and communicate it tomorrow.\n\n## Starting Position — The 8 Candidates\n\n1. **Real-time Tracking API** — P0 from Sales. Three enterprise customers were promised this feature; contracts are up for cancellation.\n2. **Multi-Currency Billing** — From the new UK Expansion Team. UK launch is planned for Q4.\n3. **Custom Report Builder** — Top request in the last NPS survey (45% mention it). Very large build.\n4. **Mobile App for Warehouse Staff** — CEO's pet project, which he heard about on a customer visit. No prioritization data.\n5. **Two-Factor Authentication** — Security team insists on it. SOC-2 audit in Q4.\n6. **CO2-Footprint Calculator** — Marketing wants to run a sustainability campaign with it.\n7. **Bulk Upload via CSV** — Used by 60% of customers, currently error-prone. Support's #1 ticket.\n8. **Shopify Integration** — Partnership opportunity, contractually bound until end of Q3, with revenue-share.\n\n## Your Task\n\nIn 15 minutes:\n\n1. **Cut 3–4 features** and prioritize the remaining ones.\n2. Write **1 sentence of justification** for each cut (max. 20 words).\n3. Sketch in **3 bullets** your communication plan for the CEO, Sales, and Marketing.\n\n## Guiding Questions\n\n- Which framework do you use for the trade-off? (RICE, ICE, Impact-vs-Effort, Strategic-vs-Tactical?)\n- How do you handle the CEO's pet project (#4) — cut it or handle it tactically?\n- Which of the \"must-haves\" are truly non-negotiable versus which ones were just loudly demanded?\n- What's the most expensive feature in terms of opportunity cost — not build effort?\n\n## Match Info\n\n**Case fits:** Associate Product Manager, Product Manager, Technical Product Manager, Growth Product Manager, Product Operations Analyst\n**Tests primarily:** Prioritization under constraints, stakeholder management, trade-off logic\n**Industry fit:** Tech & Software, adaptable across industries",
    "intro": {
      "summary": "A Product Manager owns what gets built and why. In a roadmap cut, you balance customer pain, business risk, and engineering capacity — saying no to most things so the few you ship actually ship. Read the terms below before diving in; they appear throughout the brief.",
      "glossary": [
        { "term": "Roadmap", "definition": "A prioritized plan of what a product team intends to build over a quarter or year. Not a contract — it shifts as evidence changes." },
        { "term": "P0 / P1", "definition": "Priority labels. P0 is must-do, business breaks without it. P1 is high-priority but deferrable. Used to triage requests." },
        { "term": "RICE", "definition": "Prioritization framework: score each item by Reach, Impact, Confidence, and Effort, then rank by (R*I*C)/E." },
        { "term": "Opportunity cost", "definition": "What you give up when you choose one feature over another. The strongest argument for cutting work is usually what you can't build instead." },
        { "term": "Stakeholder", "definition": "Anyone with a real interest in the outcome — Sales, Engineering, the CEO, customers. Stakeholder management is half the PM job." },
        { "term": "ARR", "definition": "Annual Recurring Revenue. The yearly run-rate of subscription revenue, used as the headline scale metric for SaaS companies." }
      ]
    }
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
    "body": "<img src=\"logos/cs-02-pm-onboarding-redesign.png\" alt=\"LendBright logo\" width=\"120\" align=\"right\" />\n\n# Onboarding Redesign: 40% Drop-off at Step 3\n\n## Context\n\n**LendBright** is a DACH fintech for SME loans between €25k and €500k. Scale-up with €40M ARR, 180 employees, Series C round closed. The product is a web application where business customers submit a loan application in 6 steps. The pricing model is based on origination fees per approved loan.\n\nThe last quarterly review revealed a problem: conversion through the application process is catastrophic. The board wants it fixed before Q4 ends. The Head of Product just tasked you with it.\n\n## Your Role\n\nYou are **Product Manager** for the core application process. You coordinate across Design, Engineering, Legal, and Credit Risk. You have 2 weeks to deliver a solid concept — and 8 weeks until release.\n\n## Starting Position & Data\n\n**Funnel for the last 90 days** (applications started: 12,400):\n\n| Step | Content | Conversion |\n|---|---|---|\n| 1 | Company data (name, industry, revenue) | 90% |\n| 2 | Loan amount & use of funds | 80% |\n| 3 | **Document Upload** (8 documents) | **40%** |\n| 4 | Business owner identification (video ID) | 35% |\n| 5 | Bank details & account statement connection | 30% |\n| 6 | Completion & digital signing | 28% |\n\n**User feedback from 15 drop-off interviews (at step 3):**\n\n- \"I really just wanted to know if I qualified — then I would have gathered the documents.\" (9/15)\n- \"I didn't have the annual statement at hand, so I closed the application for now.\" (6/15)\n- \"Why do they need 3 years of annual statements? We've only been around for 2 years.\" (3/15)\n- \"The process didn't work on my phone; uploading was cumbersome.\" (4/15)\n\n**Competitive context:**\n- N26 Business: 3 documents in initial application, rest after conditional approval\n- Qonto SME Loans: Soft check without documents, full review only after green light\n- LendBright: 8 documents in initial application, no soft check\n\n**Constraint from Credit Risk:** For final credit review we need all 8 documents. Negotiable is *when* they're collected, not *whether*.\n\n## Your Task\n\nCreate a **1-page concept brief** for leadership with:\n\n1. **Problem diagnosis** (3 bullets): What are the main causes of drop-off?\n2. **Redesign proposal** (sketch the new flow in 5–7 steps or stages)\n3. **Success metrics**: Which 3 metrics show whether the redesign works? What are your target values?\n4. **Risks & trade-offs**: What could Credit Risk, Legal, or Finance object to, and how do you address it?\n5. **8-week plan** with milestones (rough, 4–5 bullets)\n\n## Guiding Questions\n\n- Is this really a UX problem at step 3 — or a *structural* problem (wrong order, too many requirements too early)?\n- Could a \"soft check\" before document upload solve the main problem? What are the costs of such a structural change?\n- Which metric measures *real success* — conversion alone isn't enough if it lets in more unqualified applications.\n- How do you convince Credit Risk that a restructured flow won't degrade their rejection quality?\n\n## Match Info\n\n**Case fits:** Product Manager, Growth Product Manager, Product Operations Analyst, Product Manager (payments/lending), Retail Product Manager\n**Tests primarily:** Funnel analysis, cross-functional problem-solving, UX understanding combined with business impact\n**Industry fit:** Fintech, SaaS with complex onboarding, regulated industries",
    "intro": {
      "summary": "Onboarding is the path a new user takes from sign-up to first real value. Product Managers diagnose where users drop off using funnel data and qualitative interviews, then redesign the flow to remove friction without breaking downstream constraints (here: regulatory and credit-risk requirements).",
      "glossary": [
        { "term": "Funnel", "definition": "A step-by-step view of how many users make it from one stage of a flow to the next. Each step's drop-off rate points at where to investigate first." },
        { "term": "Conversion rate", "definition": "The percentage of users who complete a given step (or the whole flow). The headline measure of how well a funnel performs." },
        { "term": "Soft check", "definition": "A quick, non-binding eligibility assessment shown before a user invests heavy effort. Used to prune unqualified leads early without requiring full documentation." },
        { "term": "SME", "definition": "Small and Medium-sized Enterprise. In a fintech context, the customer segment between consumers and large corporates — typically 10–500 employees." },
        { "term": "Credit Risk", "definition": "The function inside a lender that decides who qualifies for a loan and on what terms. A hard constraint on any product change touching the application flow." },
        { "term": "Origination fee", "definition": "A one-time fee charged when a loan is issued. For lenders, it ties product success directly to approved-loan volume rather than to traffic alone." }
      ]
    }
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
    "body": "<img src=\"logos/cs-03-pm-pmf-validation.png\" alt=\"ClauseCheck logo\" width=\"120\" align=\"right\" />\n\n# Product-Market Fit: Validation Plan for a Legal AI MVP\n\n## Context\n\n**ClauseCheck** is a Pre-Seed startup (3 founders, €400k Pre-Seed round from business angels). The team is building an AI tool to help small to mid-sized German law firms (2–20 lawyers) review contracts: upload, automatic clause extraction, deviation warning against a firm's standard template library.\n\nThe MVP has been live for 6 weeks. 12 firms are on board as free pilots. In 5 months, a Series A conversation with major VCs should begin — the team needs solid PMF evidence by then. Currently: lots of opinions, little data.\n\n## Your Role\n\nYou are **Product Manager** (and simultaneously \"PMF Lead\" at this stage). The founders are deep in engineering and sales. You own: what gets measured, what gets tested, what counts as validation.\n\n## Starting Position\n\n**What we know:**\n- 12 pilots use the tool with varying intensity: 4 log in weekly, 5 monthly, 3 practically never\n- One firm already said: \"If you build feature X, we'll pay €800/month\" — but without commitment\n- Founders believe in a TAM of 18,000 German law firms with ≤20 lawyers\n- No established competitor in the DACH market; US players (Harvey, Spellbook) target large firms\n\n**What we DON'T know:**\n- Does the tool solve a real \"hair-on-fire\" problem or just a \"nice-to-have\"?\n- Is the use case broad enough (contracts of all kinds) or focus on one clause type (e.g., NDAs)?\n- Is the ICP really \"2–20 lawyers\" — or specific practice areas (M&A, employment, IP)?\n- Are firms willing to pay €500–€1,500/month?\n\n**Your budget:**\n- 4 weeks\n- €15k for user research, paid experiments, incentives\n- 20% of an engineering sprint per week for tool adjustments\n\n## Your Task\n\nBuild a **4-week PMF validation plan**:\n\n1. **The 3–5 most critical hypotheses** you want to test (in order of how much they could \"kill\" the business model)\n2. Per hypothesis: **Experiment design** — what exactly do you do, what data do you collect, what's the go/no-go criterion?\n3. **Quantitative metrics** for the existing pilot set: which 3–4 metrics define PMF for ClauseCheck (e.g., Sean Ellis Score, retention cohorts, paid conversion from pilots)?\n4. **Qualitative research plan**: How many interviews with whom, and what key questions?\n5. **Kill criteria**: Under what results would you recommend the founding team pivot or narrow focus?\n\n## Guiding Questions\n\n- What's the riskiest assumption in the business model — that firms will pay, that the product works, or that the market is big enough?\n- How do you distinguish between \"our 12 pilots love it\" and \"the market loves it\"?\n- Which signals are *vanity* (signups, demos, pilot closures) and which are *real* (recurring usage, unsolicited feedback, willingness to pay)?\n- How do you decide between *broadening* the ICP (more lawyer types) and *deepening* (solving one use case perfectly)?\n\n## Match Info\n\n**Case fits:** Associate Product Manager, Product Manager, Growth Product Manager, Product Marketing Manager, Technical Product Manager, Chief of Staff (junior)\n**Tests primarily:** Handling uncertainty, hypothesis-driven work, research design, prioritization under time pressure\n**Industry fit:** Tech startups, especially early-stage B2B SaaS",
    "intro": {
      "summary": "Early-stage Product Managers don't optimize features — they prove the product solves a real problem people will pay for. This brief is about designing experiments that turn opinions into evidence before a Series A conversation, so the terminology below is mostly about how startups measure traction.",
      "glossary": [
        { "term": "Product-Market Fit (PMF)", "definition": "The point at which a product clearly satisfies strong demand in a defined market. Signals: organic usage, strong retention, customers paying willingly and recommending it." },
        { "term": "MVP", "definition": "Minimum Viable Product. The smallest version of the product that lets you learn whether the core idea works, without over-investing in polish." },
        { "term": "ICP", "definition": "Ideal Customer Profile. The narrowly described type of customer that gets the most value from the product. Sharpening the ICP is often the highest-leverage early-stage decision." },
        { "term": "TAM", "definition": "Total Addressable Market — the total annual revenue available if you captured 100% of your defined market. Used to argue that the opportunity is large enough to back." },
        { "term": "Sean Ellis Score", "definition": "Survey question: 'How would you feel if you could no longer use this product?' If 40%+ of active users answer 'very disappointed', it's a common PMF benchmark." },
        { "term": "Kill criteria", "definition": "Predefined results that would make you stop or pivot an initiative. Set in advance to prevent motivated reasoning when the data comes in." }
      ]
    }
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
  },
  {
    "id": "cs-37-digital-therapeutic-launch",
    "title": "DTx Launch Decision: Go-to-Market for a Prescription Sleep App",
    "cluster": "digital_health",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Product Manager (Digital Health)",
      "Medical Affairs Associate",
      "Market Access Analyst",
      "Regulatory Affairs Associate",
      "Healthcare Strategy Associate",
      "Health Data Analyst",
      "Clinical Operations Analyst"
    ],
    "matchesFields": [
      "Product",
      "Research",
      "Marketing"
    ],
    "matchesIndustries": [
      "Healthcare",
      "Tech"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "creator",
    "skillsTested": [
      "Digital therapeutic GTM",
      "Reimbursement navigation",
      "Clinical positioning",
      "HCP engagement"
    ],
    "companyName": "Vitara Sleep",
    "logoUrl": "/company-logos/cs-37-digital-therapeutic-launch.png",
    "body": "<img src=\"logos/cs-37-digital-therapeutic-launch.png\" alt=\"Vitara Sleep logo\" width=\"120\" align=\"right\" />\n\n# DTx Launch Decision: Go-to-Market for a Prescription Sleep App\n\n## Context\n\n**Vitara Sleep** is a digital therapeutic (DTx) for chronic insomnia — prescription-only, evidence-based CBT-I (cognitive behavioral therapy for insomnia) delivered via a mobile app. The company has secured CE Mark and DiGA listing in Germany (€195/quarter reimbursable through SHI — Statutory Health Insurance). Launch is planned in 6 weeks.\n\nThe team debates: how do we drive sustainable prescription volume beyond the first-week novelty?\n\n## Your Role\n\nYou are the **Senior Product Manager** for Vitara Sleep. The CEO wants a launch-strategy memo covering the first 6 months.\n\n## Situation\n\n**Market context:**\n- German insomnia prevalence: ~10–12% adults; ~25% seek treatment\n- Current treatment pathways: primary care doctor → (often) sleep hygiene advice + z-drug/benzo prescription, with occasional referral to specialist\n- Z-drug side effects, dependency concerns, not suitable long-term\n- Competitor DiGAs: 2 exist, 1 focused on general anxiety, 1 on stress\n- Patient awareness of DiGA reimbursement: low (~20% even know they can prescribe apps)\n\n**Product evidence:**\n- Phase III trial: significant improvement vs. waitlist control\n- Completion rate in trial: 68% (strong for digital intervention)\n- Real-world pilot: 400 patients, ~54% clinically meaningful improvement at 8 weeks\n\n**Reimbursement mechanics:**\n- Patient goes to GP → GP prescribes DiGA → SHI pays €195/quarter\n- GPs need to be aware, comfortable, and motivated to prescribe\n- Friction: GP must search DiGA database, write prescription, patient must redeem\n\n**Channel options for HCP engagement:**\n\nA) **Direct-to-GP sales** (reps visiting practices — expensive but effective in pharma)\nB) **Medical-society partnerships** — German Sleep Society endorsement, guideline mentions\nC) **Digital HCP marketing** — GP-targeted ads, CME content, practice-support tools\nD) **Hospital-based specialist engagement** — sleep clinics, psychiatry, then trickle-down\nE) **Direct-to-patient awareness** — patient-facing ads nudging them to ask GPs\n\n**Budget:** €3.8M total for first 6 months\n\n**Team:** 4 medical/commercial, 2 product, 1 market access, 1 marketing\n\n## Your Task\n\n2-page launch plan:\n\n1. **Channel mix** — how you split €3.8M across A–E (numbers)\n2. **Core physician message** — the 3-line pitch that makes a GP want to prescribe\n3. **Patient journey** — the touchpoints after prescription that maximize 8-week completion\n4. **Key partnerships** you prioritize in month 1\n5. **KPIs**: what you measure weekly, monthly, at 6 months (lead + lag indicators)\n6. **Risk scenario**: what happens if prescription volume is below target at month 3?\n\n## Guiding Questions\n\n- GPs in Germany are time-constrained and traditionally skeptical of \"apps\". What signal would move a GP from \"maybe\" to \"prescribe\"? Is it evidence, peer-endorsement, patient demand, or ease-of-use?\n- Patient-facing awareness (E) can create demand but requires patients to know about DiGAs — low today. Educational ROI vs. activation ROI — how do you split?\n- 8-week completion is your key clinical outcome. How do you design patient engagement mechanisms without crossing into patronizing or spammy territory?\n- DiGA reimbursement might face political pressure in future years (cost containment). How does your strategy hedge?\n\n## Match Info\n\n**This case fits:** Product Manager (Digital Health) · Medical Affairs Associate · Market Access Analyst · Regulatory Affairs Associate · Healthcare Strategy Associate · Health Data Analyst · Clinical Operations Analyst\n**Primary skills tested:** DTx GTM, reimbursement navigation, clinical positioning\n**Industry fit:** Digital health, HealthTech, Pharma adjacencies, DiGA-focused companies"
  },
  {
    "id": "cs-38-fmcg-category-review",
    "title": "Oat-Drink Category Review: Should the Retailer Drop Our Third SKU?",
    "cluster": "fmcg_retail",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Category Manager",
      "Trade Marketing Manager",
      "Sales Analyst (FMCG)",
      "Assistant Brand Manager",
      "Shopper Marketing Analyst",
      "Key Account Manager (FMCG)"
    ],
    "matchesFields": [
      "Marketing",
      "Sales",
      "Data"
    ],
    "matchesIndustries": [
      "Consumer",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Category management",
      "Retailer negotiation",
      "SKU economics",
      "Shopper data interpretation"
    ],
    "companyName": "Nordmilch",
    "logoUrl": "/company-logos/cs-38-fmcg-category-review.png",
    "body": "<img src=\"logos/cs-38-fmcg-category-review.png\" alt=\"Nordmilch logo\" width=\"120\" align=\"right\" />\n\n# Oat-Drink Category Review: Should the Retailer Drop Our Third SKU?\n\n## Context\n\nYou work in the Category Management team at **Nordmilch** (fictional, major European dairy/plant-based manufacturer, €2.1B revenue). Your main customer, **\"Farbmarkt\"** (large German grocery chain), is running its annual category review of plant-based beverages. They've signaled they want to **delist 1 SKU per brand** to make room for new entrants. Your brand (Nordmilch OAT) has 3 SKUs on shelf: **Original, Barista, Unsweetened**. They've hinted Unsweetened is the likely candidate.\n\nYour account team meets with the retailer's category buyer in 2 weeks.\n\n## Your Role\n\nYou are the **Category Manager** for plant-based beverages at Nordmilch. The Key Account Director needs your analysis + negotiation plan by Friday.\n\n## Situation\n\n**Your 3 SKUs at Farbmarkt (last 52 weeks):**\n\n| SKU | Volume share | Value share | Revenue/year | Margin % | Shopper mix |\n|---|---|---|---|---|---|\n| Original | 56% | 51% | €8.4M | 22% | broad |\n| Barista | 31% | 36% | €5.9M | 28% | premium, coffee-drinkers |\n| Unsweetened | 13% | 13% | €2.2M | 19% | health-conscious, smaller repeat |\n\n**Shopper data (from Farbmarkt loyalty-card panel):**\n- 18% of Barista buyers also buy Unsweetened (cross-trip loyalty)\n- Unsweetened buyers spend 14% more per basket than average oat-drink buyers\n- Unsweetened repeat-purchase rate: 62% — highest of the 3 SKUs\n- Category is growing 11% YoY; Unsweetened subcategory growing 19%\n\n**Retailer's perspective (as you understand it):**\n- They want SKUs that turn fast and generate absolute margin €\n- Unsweetened has slower rotation (0.8 units/day per store vs. Original 4.2)\n- New entrants offering trade-terms (listing fees, ads) are attractive\n- Farbmarkt has consolidation pressure — their assortment across dairy/plant-based is considered \"too wide\"\n\n**Your internal options:**\n\nA) **Accept delisting of Unsweetened** — minimize conflict, focus on Original + Barista\nB) **Argue against delisting** — lead with shopper-data and category growth\nC) **Counter-offer**: accept delisting a different SKU (unlikely — Original is volume-king, Barista is margin-king)\nD) **Accept delisting BUT negotiate concessions**: more facings on Original/Barista, better end-cap placement, promo-slot guarantees\nE) **Launch a new \"Unsweetened in a different format\"** (e.g., 1L vs. 1.5L) — reset the SKU while keeping the segment\nF) **Offer trade-investment** in exchange for keeping all 3 SKUs — listing fee, extra promo budget\n\n## Your Task\n\n1.5-page memo + meeting prep:\n\n1. **Your negotiation strategy**: which of A–F (or combination) you recommend\n2. **Your headline argument** in one sentence — the story the buyer will remember\n3. **Supporting data points** (top 3) to bring to the meeting\n4. **What you're willing to concede** — and what you absolutely protect\n5. **Trade-investment you'd offer** (promo budget, co-marketing, listing-fee) — with ceiling\n6. **Fallback plan**: if delisting is inevitable, what do you protect for the remaining 2 SKUs?\n\n## Guiding Questions\n\n- Unsweetened is the smallest SKU but has the strongest repeat rate and highest-value shoppers. Is that a \"halo\" argument (protect the brand's healthy positioning) or \"small SKUs belong on shelves of specialty retailers, not mass\"?\n- 18% of Barista buyers also buy Unsweetened = cross-purchase elasticity. Do Barista sales drop if Unsweetened is delisted? You need to frame this for the retailer.\n- Trade investment (F) is expensive. How much is the SKU worth to you strategically (brand health, ecosystem) vs. financially (€2.2M revenue, 19% margin)?\n- New-entrant competitors will offer listing fees. Can you out-invest them, or is there a non-monetary strategy (e.g., shopper data, trade marketing)?\n\n## Match Info\n\n**This case fits:** Category Manager · Trade Marketing Manager · Sales Analyst (FMCG) · Assistant Brand Manager · Shopper Marketing Analyst · Key Account Manager (FMCG)\n**Primary skills tested:** Category management, retailer negotiation, SKU economics\n**Industry fit:** FMCG, CPG, Retail Key Accounts, Brand-side trade marketing"
  },
  {
    "id": "cs-39-defence-tender-go-nogo",
    "title": "Bundeswehr Tender Go/No-Go: €180M Sensor Program",
    "cluster": "defence_business",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Defence Strategy Analyst",
      "Business Development Analyst (Defence)",
      "Program Manager (Defence)",
      "Aerospace Analyst",
      "Corporate Development Analyst",
      "Procurement Analyst (public sector)",
      "Policy Analyst"
    ],
    "matchesFields": [
      "Operations",
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Industrial",
      "Public"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Public-sector tender assessment",
      "Competitive positioning",
      "Risk-return analysis",
      "Multi-stakeholder judgment"
    ],
    "companyName": "Helvar Defence",
    "logoUrl": "/company-logos/cs-39-defence-tender-go-nogo.png",
    "body": "<img src=\"logos/cs-39-defence-tender-go-nogo.png\" alt=\"Helvar Defence logo\" width=\"120\" align=\"right\" />\n\n# Bundeswehr Tender Go/No-Go: €180M Sensor Program\n\n## Context\n\n**Helvar Defence** (fictional, German mid-cap defence systems integrator, €680M revenue) is evaluating whether to bid on a Bundeswehr tender: **SENSOR-KOM**, a €180M program for deployable battlefield-sensor systems. Tender is open; submissions due in 8 weeks. The program has a 7-year delivery horizon.\n\nYour board meeting is in 10 days, where the bid/no-bid decision will be made. You've been asked to lead the analysis.\n\n## Your Role\n\nYou are a **Business Development Analyst** in Helvar's Strategy office (4 years experience, defence background). The CEO wants a memo with your recommendation and logic.\n\n## Situation\n\n**The opportunity:**\n- €180M over 7 years (~€26M/year run-rate when fully delivered)\n- High-value, high-complexity sensor systems\n- Would be Helvar's largest single program by 40%\n- Bundeswehr framework contract — potential follow-on value of up to another €120M if original phase performs\n\n**Helvar's positioning:**\n- Technical fit: 75% — Helvar has most required capabilities but is weaker on embedded-AI component\n- Existing Bundeswehr relationship: medium — has done 3 smaller programs, good delivery record\n- Team capacity: building out would require 40–50 new hires + subcontract partners\n- Cost to prepare bid: ~€2.8M + 400 person-days\n\n**Competitive landscape:**\n- Competitor A (large German prime, €4B revenue): incumbent, strong relationship, but currently stretched on other programs\n- Competitor B (large European prime, €8B revenue): strong tech fit, but limited local presence and German-language capability\n- Competitor C (mid-size consortium with US partner): aggressive pricing, some questions about ITAR complications\n\n**Risks:**\n- Technical risk: the embedded-AI gap is not trivial — either partner with a specialist (licensing cost, IP-sharing complexity) or hire (12-month recruitment)\n- Schedule risk: 7 years in defence typically means 9 years with real-world delays\n- Political risk: defence procurement priorities could shift; program could be descoped\n- Working capital: Bundeswehr pays on milestones, so Helvar funds up to €28M working-capital peak\n- Competitor concentration: if you lose to Competitor A, you reinforce their dominance for 7+ years\n\n**Opportunity cost:**\n- The 400 person-days and €2.8M bid cost alternatives include: 2 mid-size programs Helvar could otherwise bid on\n- Win probability (your team's internal estimate): ~22% standalone, ~35% with a capable consortium partner\n\n## Your Task\n\nBid/No-Bid memo to the board (1.5 pages):\n\n1. **Your recommendation** — Bid / No-Bid / Conditional-Bid (with specific conditions)\n2. **Strategic rationale**: does this program fit Helvar's 5-year plan?\n3. **Risk/return analysis**: quantify win probability × expected value vs. bid cost\n4. **Partnership strategy**: if you bid, with whom and in what role\n5. **Capacity plan**: the 40–50 new hires + subcontractor plan — is it realistic?\n6. **If No-Bid**: what alternative pursuits absorb the freed-up resources?\n\n## Guiding Questions\n\n- 22% win probability is low; but a win would be transformative. How do you balance \"all-in on a moonshot\" vs. \"portfolio of 3–4 mid-size programs\"?\n- Conditional bid — e.g., only if you secure the embedded-AI partner by week 4 — can protect you from committing before risks are bounded. When does that make sense?\n- Bundeswehr framework contracts have long tails (follow-on). Does that change the economics enough to shift a no-go to a go?\n- Competitor B is technically strong but weak on local presence. Is that your differentiation, and is it defensible?\n\n## Match Info\n\n**This case fits:** Defence Strategy Analyst · Business Development Analyst (Defence) · Program Manager (Defence) · Aerospace Analyst · Corporate Development Analyst · Procurement Analyst (public sector) · Policy Analyst\n**Primary skills tested:** Tender evaluation, competitive positioning, risk-return analysis\n**Industry fit:** Defence primes, Aerospace & Defence business development, Public sector contractors"
  },
  {
    "id": "cs-40-gaming-vertical-slice",
    "title": "Vertical Slice Behind Schedule: What Gets Cut From 'Echoes of Umbrial'?",
    "cluster": "gaming_production",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Game Producer (junior)",
      "Associate Game Designer",
      "Game Designer",
      "Technical Producer",
      "Product Manager (Gaming)",
      "QA Tester (games)",
      "Esports Operations Coordinator",
      "Community Manager (gaming)"
    ],
    "matchesFields": [
      "Product",
      "Design",
      "Engineering"
    ],
    "matchesIndustries": [
      "Media",
      "Arts",
      "Tech"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "creator",
    "skillsTested": [
      "Scope-cut prioritization",
      "Publisher communication",
      "Team morale management",
      "Milestone planning"
    ],
    "companyName": "Ravenstar Studios",
    "logoUrl": "/company-logos/cs-40-gaming-vertical-slice.png",
    "body": "<img src=\"logos/cs-40-gaming-vertical-slice.png\" alt=\"Ravenstar Studios logo\" width=\"120\" align=\"right\" />\n\n# Vertical Slice Behind Schedule: What Gets Cut From 'Echoes of Umbrial'?\n\n## Context\n\nYou're at **Ravenstar Studios** (independent developer, 54 people, Berlin/Prague). You're producing **\"Echoes of Umbrial\"**, a third-person action-RPG. Publisher milestone: **vertical slice due in 6 weeks**. Current state: ~40% of the planned vertical-slice features are production-ready. The other 60% are in various states of incomplete.\n\nPublisher (a major European publisher, fictional **Nordsteinn Interactive**) has signaled that the vertical slice is the key go/no-go gate for further funding. Missing the date is not an option. Cutting scope is.\n\n## Your Role\n\nYou are the **Associate Producer** on Echoes of Umbrial. The Senior Producer is asking for your scope-cut recommendation by end of week.\n\n## Situation\n\n**Planned vertical slice scope (and current status):**\n\n| Feature | Status | Effort to finish | Impact on the \"demo feel\" |\n|---|---|---|---|\n| Combat mechanics (core) | 80% done | 1 week | Essential |\n| Enemy AI — 3 enemy types | 2 of 3 done | 2 weeks for 3rd | Essential |\n| Level 1 environment art | 95% done | 0.5 week | Essential |\n| Level 2 environment art | 40% done | 5 weeks | Important |\n| Dialogue system | 60% done, buggy | 3 weeks | Important |\n| 3 cinematics | 1 done | 4 weeks | Strong wow-factor |\n| Weapons (6 types) | 4 done | 2 weeks | Important |\n| Boss fight | 30% done | 4 weeks | Signature moment |\n| UI / HUD | 70% done | 1.5 weeks | Essential for playability |\n| Audio — score + SFX | 60% done | 3 weeks | Tone-critical |\n| Localization (EN + DE) | 50% | 2 weeks | Publisher requires both |\n| Performance optimization | Not started | 2 weeks | Required |\n\n**Team capacity:**\n- Design: 6 people\n- Engineering: 12 people\n- Art: 14 people\n- Audio: 2 people + freelance composer\n- Production/QA: 6 people\n- Team is already at 55h/week average; another spike risks burnout/attrition\n\n**Publisher perspective:**\n- What the publisher *says*: they want \"a polished experience demonstrating scope and vision\"\n- What you know they actually judge: 20-minute playable demo, 2–3 wow moments, professional feel\n- They've signaled (informally) that they'd rather see 1 finished level + 1 boss fight + 1 cinematic than 2 levels + no boss fight\n\n**Cut options:**\n\nA) **Cut Level 2** entirely — lose \"scope demonstration\" but reallocate 5 weeks of art\nB) **Cut boss fight** — lose a wow moment, save 4 weeks of engineering + design\nC) **Cut 2 of 3 cinematics** — save 3 weeks, keep 1 strong moment\nD) **Cut 2 of 6 weapons** — save 1 week, minor visible impact\nE) **Cut 1 enemy type** — save 2 weeks, playtesters may notice sameness\nF) **Cut one language (DE)** — save 2 weeks but publisher may reject\nG) **De-scope dialogue system** to simpler form — save 1.5 weeks, less narrative depth\n\n## Your Task\n\nScope-cut memo (1 page):\n\n1. **Your recommended cuts** (specific items, in priority)\n2. **What you protect at all costs** (the \"spine\" of the demo)\n3. **Publisher communication**: how you frame the scope reduction without losing confidence\n4. **Team communication**: how you announce cuts without demoralizing\n5. **Contingency**: if another 10% of work slips in the next 2 weeks, what's your next cut?\n6. **Post-VS plan**: what you commit to adding back before full production starts\n\n## Guiding Questions\n\n- \"Scope demonstration\" (2 levels) vs. \"quality demonstration\" (1 polished + boss fight) — which is the publisher actually judging? Is the informal signal reliable?\n- Cutting the boss fight (B) kills a signature moment but saves 4 weeks that could go into polish. Is a vertical slice without a boss fight credible, or is that the wrong trade?\n- The team is already at 55h/week. Any cut you *don't* make is a hidden cost in health and retention. How do you factor that into \"cut enough\"?\n- Publisher communication: if you frame cuts as \"we're being disciplined\", that's positive. If you frame as \"we couldn't deliver\", that's fatal. How do you write the milestone update?\n\n## Match Info\n\n**This case fits:** Game Producer (junior) · Associate Game Designer · Game Designer · Technical Producer · Product Manager (Gaming) · QA Tester (games) · Esports Operations Coordinator · Community Manager (gaming)\n**Primary skills tested:** Scope prioritization, publisher communication, team morale\n**Industry fit:** Game studios (AA/AAA), independent developers, publishing/production roles"
  },
  {
    "id": "cs-41-consulting-partner-pitch",
    "title": "Partner Pitch to a Swiss Bank CFO: 25 Minutes, One Slide",
    "cluster": "consulting",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Associate Consultant",
      "Senior Analyst (Consulting)",
      "Business Analyst (MBB-style)",
      "Corporate Strategy Analyst",
      "Digital Transformation Analyst",
      "Implementation Consultant"
    ],
    "matchesFields": [
      "Finance",
      "Product",
      "Operations"
    ],
    "matchesIndustries": [
      "Finance",
      "Services"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Client pitch craft",
      "Executive storytelling",
      "One-slide structured thinking",
      "Commercial-framing discipline"
    ],
    "companyName": "Meridian Private Bank",
    "logoUrl": "/company-logos/cs-41-consulting-partner-pitch.png",
    "body": "<img src=\"logos/cs-41-consulting-partner-pitch.png\" alt=\"Meridian Private Bank logo\" width=\"120\" align=\"right\" />\n\n# Partner Pitch to a Swiss Bank CFO: 25 Minutes, One Slide\n\n## Context\n\nYour strategy consulting firm is pitching the CFO of **Meridian Private Bank** (fictional, Geneva-based, CHF 48B AUM) on a \"Next-Generation Client Profitability\" project. Your Partner is leading the pitch; you've been asked to prepare **one slide** that captures the entire proposal, as the Partner wants to open the meeting with it.\n\nThe meeting is in 25 minutes. You have to deliver the slide and a 3-minute walk-through script.\n\n## Your Role\n\nYou are the **Senior Analyst** supporting the Partner. The Partner has given you the brief and left you alone to produce the slide and briefing note.\n\n## Situation\n\n**What you know about the client:**\n- Meridian Private Bank: 140 years old, traditional private-banking model\n- Recent challenges: growth flat, younger clients (under 45) leaving, tech-forward competitors eating share\n- CFO is new (4 months in role), came from a global investment bank, reputation for being numerically rigorous\n- The bank has 14,000 active clients, with top 500 clients representing 42% of revenue\n- Profitability is measured crudely — by product line, not client\n\n**Your firm's angle:**\n- Individualized client profitability model (allocating cost of service, revenue across channels, risk capital)\n- Actionable segmentation (who's truly profitable, who's loss-making despite appearances)\n- Implication: redesign of service model — some clients served differently, price architecture adjusted\n- 14-week diagnostic, 12-week implementation of initial recommendations\n- Team of 6 consultants, fee range €1.8–2.4M for diagnostic\n- Proven at 2 European private banks, ~18% profit uplift within 12 months\n\n**What the CFO likely cares about:**\n- Credibility: \"have you done this before, and did it actually work?\"\n- Concreteness: \"what exactly will you tell me I don't already know?\"\n- Speed to insight: \"how soon do I see something actionable?\"\n- Risk: \"what happens if we find 300 unprofitable clients — do we fire them?\"\n\n**Your Partner's briefing:**\n- \"Make the slide tell the story with the slide alone if I'm interrupted and can't talk through it\"\n- \"Don't try to be comprehensive — we'll lose them. Lead with the one idea that will make them want to meet again\"\n\n## Your Task\n\nIn 25 minutes:\n\n1. **The one slide** — describe the layout, the headline, and the content structure (headline, subhead, 3–5 elements max)\n2. **The 3-minute walkthrough** script the Partner will deliver\n3. **Objections you anticipate** from the CFO — top 3, with your one-line rebuttals\n4. **What you deliberately leave off** the slide — and what you'd put in appendix if asked\n5. **The close** — what does the Partner ask for at the end of this meeting? (Another meeting? A diagnostic? Something smaller?)\n\n## Guiding Questions\n\n- One-slide pitches to numerate CFOs fail when they're fluffy. What's the most concrete element you can put on the slide — a number, a framework, a client result?\n- Proven at 2 banks, 18% uplift — this is your hard evidence. How do you position it without sounding like \"we'll copy-paste someone else's answer\"?\n- The CFO is new and numerically rigorous. He'll read the slide faster than the Partner can explain. Does that change how dense the slide can be?\n- The \"what do we do with unprofitable clients\" question is political. Address it pre-emptively on the slide, or only if asked?\n\n## Match Info\n\n**This case fits:** Associate Consultant · Senior Analyst (Consulting) · Business Analyst (MBB-style) · Corporate Strategy Analyst · Digital Transformation Analyst · Implementation Consultant\n**Primary skills tested:** Client-pitch craft, executive storytelling, single-slide discipline\n**Industry fit:** Strategy consulting, corporate strategy, management advisory"
  },
  {
    "id": "cs-42-insurtech-claims-ratio",
    "title": "Claims Ratio at 74%: Where Do You Intervene First?",
    "cluster": "insurance_insurtech",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Actuarial Analyst",
      "Data Scientist (Insurance)",
      "Risk Analyst",
      "Product Manager (InsurTech)",
      "Claims Operations Analyst",
      "Underwriter (junior)",
      "Pricing Analyst"
    ],
    "matchesFields": [
      "Data",
      "Finance",
      "Product"
    ],
    "matchesIndustries": [
      "Finance",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Loss-ratio decomposition",
      "Portfolio segmentation",
      "Pricing vs. risk-selection trade-off",
      "Actuarial judgment"
    ],
    "companyName": "Vexo Versicherung",
    "logoUrl": "/company-logos/cs-42-insurtech-claims-ratio.png",
    "body": "<img src=\"logos/cs-42-insurtech-claims-ratio.png\" alt=\"Vexo Versicherung logo\" width=\"120\" align=\"right\" />\n\n# Claims Ratio at 74%: Where Do You Intervene First?\n\n## Context\n\n**Vexo Versicherung** (fictional, Germany-based InsurTech focused on motor insurance for urban drivers under 40). In the last 6 months, **claims ratio has risen to 74%** (target: 65%). If sustained, the company's combined ratio climbs past 100% — loss-making. The CEO wants an analysis and 3-month intervention plan.\n\n## Your Role\n\nYou are a **Senior Actuarial Analyst** (or equivalent Pricing/Risk PM). You have access to 30-month claims history.\n\n## Situation\n\n**What's happening:**\n\n| Metric | 12 months ago | 6 months ago | Now |\n|---|---|---|---|\n| Claims ratio | 62% | 67% | 74% |\n| Average claim size | €2,840 | €2,980 | €3,410 |\n| Claim frequency | 7.2% | 7.4% | 8.1% |\n| Premium volume | €72M | €84M | €102M |\n| Portfolio size | 180k policies | 215k policies | 268k policies |\n\n**Segmentation (claims ratio by segment today):**\n\n| Segment | Share of portfolio | Claims ratio | Trend |\n|---|---|---|---|\n| Berlin / Hamburg urban | 42% | 78% | rising |\n| Munich / Stuttgart urban | 28% | 69% | stable |\n| Smaller cities | 22% | 71% | slight rise |\n| Rural (recent expansion) | 8% | 82% | rising fast |\n| Under-25 drivers | 18% | 89% | rising |\n| 25–34 | 54% | 72% | rising |\n| 35+ | 28% | 61% | stable |\n| Direct channel | 58% | 71% | rising |\n| Broker channel | 42% | 77% | rising |\n\n**What you know:**\n- Car repair costs are inflating industry-wide (~15% over 24 months, partly EV-parts shortages)\n- Vexo's underwriting engine was retrained 8 months ago with a new ML model promising tighter risk-selection\n- A marketing campaign 4 months ago aggressively acquired new customers in rural and younger segments\n- Broker channel was expanded 5 months ago\n- Claims Operations team is stretched — backlog has grown 22%\n\n**Options on the table:**\n\nA) **Re-price** across the portfolio (especially rising segments) — slow, regulatory considerations\nB) **Tighter underwriting**: re-filter risk-selection, especially in under-25 and rural\nC) **Portfolio pruning**: non-renew the worst 5–10% of policies next year\nD) **Claims-operations investment**: faster, tighter claim handling to reduce severity inflation\nE) **Marketing redirect**: stop acquisition in rural and under-25, shift to safer segments\nF) **Model investigation**: is the 8-month-old ML model actually performing as advertised?\nG) **Product change**: increase deductibles, introduce telematics option at a discount\n\n## Your Task\n\n1.5-page memo:\n\n1. **Primary driver diagnosis**: is the claims ratio rise about pricing, risk-selection, claims severity, or portfolio mix? Support with data.\n2. **Recommended top-3 interventions** (from A–G), sequenced\n3. **Quantification**: expected impact on claims ratio within 3, 6, 12 months\n4. **Model-check**: do you think the ML underwriting model is part of the problem? How do you test this quickly?\n5. **Regulatory considerations**: any actions that need BaFin coordination\n6. **What you won't do** and why (e.g., \"we won't fire 10% of customers — brand damage\")\n\n## Guiding Questions\n\n- Claim frequency and severity both rose. Which is more diagnostic? Frequency usually reflects risk-selection, severity reflects pricing/repair cost environment.\n- The 8-month-old model could be the culprit if it relaxed underwriting in ways that didn't show up until claims maturing. How do you back-test this?\n- Rural segment (82% claims ratio) was recent expansion. Is this a recoverable growth segment, or do you accept that it's a learning loss?\n- Re-pricing affects existing customers (renewal shock, churn) or new customers (slower growth). Which takes priority?\n\n## Match Info\n\n**This case fits:** Actuarial Analyst · Data Scientist (Insurance) · Risk Analyst · Product Manager (InsurTech) · Claims Operations Analyst · Underwriter (junior) · Pricing Analyst\n**Primary skills tested:** Loss-ratio analysis, segmentation, pricing-risk balance\n**Industry fit:** InsurTech, traditional insurance, actuarial consulting"
  },
  {
    "id": "cs-43-ngo-fundraising-shortfall",
    "title": "Q4 Fundraising Shortfall: €1.7M to Close in 90 Days",
    "cluster": "ngo_social_impact",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Fundraising Associate",
      "Grants Officer",
      "Partnership Manager (NGO)",
      "Communications Associate (NGO)",
      "Development Associate",
      "Donor Relations Coordinator",
      "Program Coordinator (NGO, Foundation)"
    ],
    "matchesFields": [
      "Marketing",
      "Customer",
      "Operations"
    ],
    "matchesIndustries": [
      "Public",
      "Services"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Donor segmentation",
      "Quick-turn campaign design",
      "Message crafting",
      "Resource allocation"
    ],
    "companyName": "Hand in Hand",
    "logoUrl": "/company-logos/cs-43-ngo-fundraising-shortfall.png",
    "body": "<img src=\"logos/cs-43-ngo-fundraising-shortfall.png\" alt=\"Hand in Hand logo\" width=\"120\" align=\"right\" />\n\n# Q4 Fundraising Shortfall: €1.7M to Close in 90 Days\n\n## Context\n\n**Hand in Hand** is a mid-size German NGO focused on education in sub-Saharan Africa (€11M annual budget, 28 staff + field teams). Year-end total target: **€13.2M**. As of September 30, cumulative fundraising is **€11.5M**. That leaves a **€1.7M gap** to close in Q4. Major-gift pipeline is soft this year (2 major donors signaled pauses); retail donation trends are also down 8% YoY sector-wide.\n\n## Your Role\n\nYou are the **Fundraising Associate** (3 years at Hand in Hand). The Head of Fundraising has asked you to propose a Q4 campaign plan by tomorrow.\n\n## Situation\n\n**Donor base:**\n\n| Segment | # Donors | Avg gift | Total contribution |\n|---|---|---|---|\n| Major donors (€10k+) | 28 | €32k | €900k committed YTD, typically gives €1.4M by year-end |\n| Mid-level (€1k–10k) | 340 | €2.8k | €950k YTD, typically €1.3M |\n| Retail (under €1k) | 12,800 | €75 | €960k YTD, typically €1.3M |\n| Corporate / foundations | 18 | €118k | €2.1M YTD, typically €2.8M |\n\n**What's going on:**\n- 2 major donors (potential €450k combined) signaled \"not this year — family priorities changed\"\n- Corporate partners are on track, but 1 large foundation grant is on pause pending their internal strategy review\n- Retail donations down 8% in-sector; Hand in Hand roughly in line\n- A competing NGO recently had a viral moment (high-visibility campaign) pulling attention\n\n**Available levers:**\n\nA) **Individual major-donor outreach**: direct calls from Executive Director to top 40 donors, asking for \"stretch gifts\"\nB) **Retail email campaign** with 2–3 tiers and a matching-gift component (donor-secured match available, €120k)\nC) **Corporate proposals**: 3 warm leads for end-of-year corporate giving — needs tailored proposals\nD) **Facebook / Instagram / YouTube paid campaign**: €40k budget, targeting past supporters + lookalike\nE) **A thematic \"end of year\" appeal** — new storytelling, 3 field-based success stories, cross-channel\nF) **Peer-to-peer fundraising** — activate volunteer network to personal-network appeals\nG) **Emergency bridging** — ask the largest long-term donor for a one-time advance on 2026 commitment\n\n**Constraints:**\n- Team: you + 1 Grants Officer + 1 Communications Associate; Executive Director available for ED-level meetings\n- Budget for campaign spend: €65k\n- Timing: the \"giving moment\" is December 1–31, but planning window is now (October)\n- Brand guardrails: Hand in Hand does NOT use poverty-porn imagery or high-pressure tactics\n\n## Your Task\n\nIn 25 minutes:\n\n1. **Top 3 prioritized levers** (A–G) with rationale — which you run in sequence vs. parallel\n2. **Expected revenue** from each (realistic, not best-case)\n3. **Message/story** — the core narrative for the Q4 campaign (2–3 sentences)\n4. **Channel mix** for the retail-and-below audiences\n5. **What you ask of the Executive Director specifically** — her calendar for 4–6 donor calls\n6. **Fallback scenario**: if you're still €500k short at November 15, what do you escalate?\n\n## Guiding Questions\n\n- The fastest money often comes from 5–10 major donors. But that means dependent on their generosity. Is major-donor outreach the safest bet or the riskiest?\n- Matching gifts (B) historically boost retail participation 30–50%. Is €120k match big enough to create momentum, or do you need to secure more?\n- \"Poverty porn\" is off the table. How do you tell a Q4 appeal that's emotionally resonant without crossing that line?\n- The competing NGO's viral moment pulls attention. Do you try to piggyback (topic adjacent) or deliberately stay away (different lane)?\n\n## Match Info\n\n**This case fits:** Fundraising Associate · Grants Officer · Partnership Manager (NGO) · Communications Associate (NGO) · Development Associate · Donor Relations Coordinator · Program Coordinator (NGO, Foundation)\n**Primary skills tested:** Donor segmentation, time-pressured campaign design, story craft\n**Industry fit:** NGOs, Charities, Foundations, Social-impact organizations"
  },
  {
    "id": "cs-44-hotel-low-season",
    "title": "Low-Season Occupancy Plan: 42% → 65% in 4 Months",
    "cluster": "hospitality",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Revenue Management Analyst",
      "Hotel Operations Analyst",
      "Travel Product Manager",
      "Destination Marketing Associate",
      "Commercial Analyst",
      "Lifecycle Marketer",
      "Pricing Analyst",
      "Event Manager"
    ],
    "matchesFields": [
      "Marketing",
      "Operations",
      "Data"
    ],
    "matchesIndustries": [
      "Hospitality",
      "Consumer",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Demand-generation strategy",
      "Revenue management judgment",
      "Segment targeting",
      "Partnership activation"
    ],
    "companyName": "Hotel Maravilla Menorca",
    "logoUrl": "/company-logos/cs-44-hotel-low-season.png",
    "body": "<img src=\"logos/cs-44-hotel-low-season.png\" alt=\"Hotel Maravilla Menorca logo\" width=\"120\" align=\"right\" />\n\n# Low-Season Occupancy Plan: 42% → 65% in 4 Months\n\n## Context\n\n**Hotel Maravilla Menorca** is a 98-room 4-star boutique hotel on Menorca, Spain. November–February is low season; last year's occupancy averaged **42%** (vs. 85% in peak season). The owner has set a target: **65% average occupancy for next low season** — a revenue impact of roughly €420k. Planning starts now; low season begins in 4 months.\n\n## Your Role\n\nYou are the **Commercial Manager** (Revenue Management + Marketing dual role). You have 25 minutes to sketch a plan for the owner.\n\n## Situation\n\n**Who stayed last low-season (42% occupancy base):**\n\n| Segment | Share of low-season nights |\n|---|---|\n| Spanish city-escape (Barcelona, Madrid weekenders) | 38% |\n| UK retirees (2+ week stays) | 22% |\n| Corporate / meetings (small business groups) | 14% |\n| Nordic \"slow travel\" (multi-week) | 9% |\n| Wellness / retreats | 6% |\n| Other | 11% |\n\n**What the market looks like:**\n- Menorca is one of the quieter Balearic islands; Mallorca and Ibiza draw more winter tourism overall\n- Airline connectivity in low season is limited but improving (2 new UK-Menorca routes added)\n- Competitor hotels on island achieve 48–58% average low-season occupancy\n- Spain-domestic weekend traveler is growing post-pandemic\n\n**Available levers:**\n\nA) **Thematic packages** — wellness retreats, cooking weekends, photography workshops\nB) **Low-season pricing aggressively reduced** — €105 ADR (vs. €195 summer) to capture volume\nC) **Corporate / small-meetings focus** — off-season conference-room pricing, midweek bias\nD) **Long-stay offers** — \"30 days for X\" packages for digital nomads / retirees\nE) **OTA + channel-mix shift** — invest in Spanish and UK direct-booking; reduce OTA commission load\nF) **Partnerships with local experiences** — cooking classes, boat tours, cycling\nG) **Event / festival programming** on-site — live music, food weekends, local artisans\nH) **Aggressive distribution via tour operators** (UK: Jet2, TUI; Spain: B The Travel Brand)\n\n**Operational constraints:**\n- Staff levels: 80% reduced in low season; scaling up takes 6 weeks\n- F&B: restaurant stays open but at 40% capacity; bar limited\n- Some amenities (outdoor pool) closed Nov–Feb; spa open, indoor wellness\n- Marketing budget for low-season campaign: €180k\n\n## Your Task\n\nIn 25 minutes:\n\n1. **Your top 3 segment bets** — which of the current segments grow, which are new\n2. **Product/package architecture** — what you actually sell (2–3 signature offers)\n3. **Pricing strategy** — ADR + RevPAR targets, plus your stance on discounting (safe vs. aggressive)\n4. **Distribution mix** — OTA vs. direct vs. tour operator, with % targets\n5. **Marketing budget allocation** (€180k)\n6. **Operational prep**: the 3 things you set up now (staffing, F&B, amenities) to support the plan\n\n## Guiding Questions\n\n- Aggressive price-cutting (B) can fill rooms but sets a bad reference point for future years. Where's the right balance between volume and rate integrity?\n- Digital nomads (D) are a real 2023–2026 trend but fickle — they choose by wifi, co-work space, cafes. Does Menorca meet the criteria, and can you pitch it?\n- Corporate meetings in Menorca is hard (limited direct flights, limited meeting infrastructure). Is this a segment to fight for or accept as small?\n- UK retirees (22% share) are growing demographically. What specific adjustments (dietary, mobility, activity level) make the hotel actively attractive to them?\n\n## Match Info\n\n**This case fits:** Revenue Management Analyst · Hotel Operations Analyst · Travel Product Manager · Destination Marketing Associate · Commercial Analyst · Lifecycle Marketer · Pricing Analyst · Event Manager\n**Primary skills tested:** Revenue management, segment targeting, partnership thinking\n**Industry fit:** Hotels, Resorts, Destination marketing, Tour operators"
  },
  {
    "id": "cs-45-ai-product-manager",
    "title": "Launching an LLM Feature: How Do You Prevent Hallucination Disasters in a Legal Product?",
    "cluster": "ai_product",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "AI Product Manager",
      "Applied AI Product Manager",
      "LLM Product Manager",
      "Machine Learning Product Manager",
      "Platform Product Manager",
      "API Product Manager"
    ],
    "matchesFields": [
      "Product",
      "Engineering",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "creator",
    "skillsTested": [
      "LLM product thinking",
      "Risk containment in GenAI",
      "Evaluation design",
      "User research in expert domains"
    ],
    "companyName": "LexForge",
    "logoUrl": "/company-logos/cs-45-ai-product-manager.png",
    "body": "<img src=\"logos/cs-45-ai-product-manager.png\" alt=\"LexForge logo\" width=\"120\" align=\"right\" />\n\n# Launching an LLM Feature: How Do You Prevent Hallucination Disasters in a Legal Product?\n\n## Context\n\n**LexForge** is a SaaS platform for mid-size law firms (320 DACH customers, 6,400 paying users). Core product: contract management, deadline tracking, document storage. Planned new feature: **\"Ask LexForge\"** — an LLM-based Q&A system letting lawyers ask natural-language questions of their document portfolio (\"Which clients have NDAs expiring in Q3?\", \"Show me all clauses with liability caps below €1M\").\n\n**The problem:** Beta version (2 weeks, 8 pilot firms) shows 91% correct answers — but a 9% error rate is not acceptable for legal. A single hallucination incident (inventing a contract clause) could trigger a malpractice claim against a firm that trusted the feature.\n\n## Your Role\n\nYou are the **AI Product Manager** for \"Ask LexForge\". The CTO is pushing for launch in 6 weeks (Sales has 14 leads waiting). The Head of Legal (in-house) doesn't want you to launch. You have to find a way.\n\n## Situation\n\n**Error categories from beta (137 analyzed answers, 12 errors):**\n\n| Error type | Share | Example |\n|---|---|---|\n| Hallucinated citations | 42% | System quotes clause number that doesn't exist |\n| Wrong summary | 25% | Date shifted by 1 year, parties confused |\n| Incomplete answer | 17% | Found 4 relevant docs, only referenced 2 |\n| Off-topic / Refusal | 16% | System responds with boilerplate |\n\n**What you know about the tech:**\n- RAG architecture (retrieval + GPT-4o)\n- Retrieval uses embedding search, 94% recall on test set\n- No fine-tuning, only prompt engineering\n- Response time: median 4s, p95 11s\n\n**What the 8 pilot firms say:**\n- 6 of 8 want to launch \"even with errors, if clearly flagged\"\n- 2 are skeptical, want 95%+ accuracy\n- All want the citation hallucinations gone\n- None has a clear sense of what \"using it correctly\" looks like — the team has seen many support questions\n\n**Team capacity to launch:**\n- 2 ML engineers, 1 backend engineer, 1 designer, 1 UX researcher\n- Total available: ~90 person-days\n\n**Options under discussion:**\n\nA) **Re-ranking + Citation Verification**: every answer checked before output that citations actually exist (mechanical string check). Addresses 42% of errors. 2 ML-engineer weeks.\nB) **Guard-rail prompts with strict refusal**: model only answers if confidence > X%. Reduces errors, increases frustration (more \"I can't answer that\" responses). 1 week.\nC) **Human-in-the-Loop** for critical query types: \"Show me all clauses...\" goes automatic, \"Interpret this clause...\" requires lawyer review. Design + engineering cost, but massively reduces risk. 4–5 weeks.\nD) **Reduce scope** to non-interpretive queries (search, filter, summary) for launch, Q&A in Phase 2. Launchable in 2 weeks. But: Sales promised interpretive Q&A.\nE) **Fine-tuning** on domain-specific legal corpus. Accuracy gain unclear, 3–4 weeks, significant cost increase.\n\n## Your Task\n\n1.5-page memo for leadership:\n\n1. **Recommendation**: which combination of A–E in what order?\n2. **Launch definition**: what does \"ready for launch\" mean? Which metrics, which thresholds?\n3. **UX decision**: how does the feature communicate its uncertainty to the user? (Disclaimer before every answer? Confidence score? Mandatory \"Verify\" flow?)\n4. **Rollback plan**: what's your plan if a serious hallucination incident occurs in the first week post-launch?\n5. **Sales communication**: how do you frame the trade-offs to Sales without creating deal risk?\n\n## Guiding Questions\n\n- \"91% accuracy\" sounds good, but in legal a 9% error rate on 100 daily queries = 9 potential malpractice risks. How do you reframe accuracy?\n- Human-in-the-loop (C) reduces risk but destroys the core promise of \"instant answers\". Is it still the same product?\n- Scope reduction (D) is safe, disappoints Sales. Is it better to launch less and retain more — or to launch aggressively and potentially lose customers?\n- The Legal head wants to say No. The CTO wants to launch. You need a position that's defensible on the merits, not just a compromise.\n\n## Match Info\n\n**This case fits:** AI Product Manager · Applied AI Product Manager · LLM Product Manager · ML Product Manager · Platform Product Manager · API Product Manager\n**Primary skills tested:** LLM product thinking, GenAI risk containment, user research in expert domains\n**Industry fit:** AI-first startups, LegalTech, Enterprise AI teams"
  },
  {
    "id": "cs-46-enterprise-sales",
    "title": "€3.2M Deal in Final Stretch: 5 Stakeholders, 3 Weeks, One Blocker",
    "cluster": "enterprise_sales",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Enterprise Account Executive",
      "Key Account Manager",
      "Strategic Account Manager",
      "Named Account Executive",
      "Channel Partner Manager",
      "Account Executive (Enterprise / Public Sector)"
    ],
    "matchesFields": [
      "Sales",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services",
      "Finance"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Buying-committee navigation",
      "Deal diagnosis",
      "Executive engagement",
      "Procurement strategy"
    ],
    "companyName": "Orionbase",
    "logoUrl": "/company-logos/cs-46-enterprise-sales.png",
    "body": "<img src=\"logos/cs-46-enterprise-sales.png\" alt=\"Orionbase logo\" width=\"120\" align=\"right\" />\n\n# €3.2M Deal in Final Stretch: 5 Stakeholders, 3 Weeks, One Blocker\n\n## Context\n\nYou work at **Orionbase** (B2B data platform, enterprise-focused, €180M ARR, 1,100 employees). For 7 months you've been working the opportunity **\"Weststahl AG\"** — a German steel conglomerate (18,000 employees, €3.8B revenue). Deal size: **€3.2M TCV** over 3 years. One of the largest deals of the quarter for Orionbase.\n\n**Status today:**\n- Technical Evaluation: complete, positive (IT & data team recommend)\n- Business Case: complete, ROI 2.4× over 3 years\n- Legal Review: ongoing, no major blockers\n- Procurement Negotiation: **STARTED. And this is where it's breaking down.**\n\nThe Procurement Director at Weststahl (Ms. Eichler, new in role 4 months ago, automotive-procurement background) said yesterday:\n\n> \"Your price is 28% above our benchmark. We need a discount or we can't recommend it. And by the way: why is there no exit clause after Year 1? We don't accept that.\"\n\nThe quarter ends in **3 weeks**. You need the deal — your quota is at 82%, this deal would put you at 112%.\n\n## Your Role\n\nYou are a **Senior Enterprise Account Executive**. Your boss (VP Sales) called you this morning: \"What's your plan? I need a clean forecast commit by Friday.\"\n\n## Situation — The 5 Stakeholders at Weststahl\n\n| Role | Name | Position on deal | Influence |\n|---|---|---|---|\n| **CDO** (Economic Buyer) | Dr. Marten | Champion, initiated project | High |\n| **Head of Data** (Technical Buyer) | Ms. Lutz | Strongly pro, team is sold | Medium-High |\n| **CIO** | Mr. Ambrus | Neutral — cost-conscious, fair | High |\n| **Procurement** | Ms. Eichler | **NEW, pushing on price and terms** | Process power (can delay) |\n| **CFO** | Mr. Vogel | Sees business case positively but signs only if Procurement OK | High |\n\n**Facts in hand:**\n- Orionbase list price: €3.2M. Internal floor from deal desk: €2.7M (max 16% discount without CFO escalation)\n- Competitor at Weststahl: **Palantar** (fictional), was on longlist 5 months ago, dropped out for technical reasons — but Ms. Eichler comes from a company that is a Palantar customer\n- \"28% above benchmark\" is unclear — which benchmark? You know Palantar's price points: 15–20% more expensive than Orionbase on comparable deals\n- Exit clause after Year 1 = massive risk (Weststahl could adopt the tech and switch)\n- CDO says he wants the deal — but he'll stay out of procurement matters (\"that's their job, not mine\")\n- Your VP Sales would go to 18% discount, not further without clear counter-concessions\n\n**What you've done in the last 2 days:**\n- 30-min call with Ms. Eichler: she listened to your arguments but didn't move\n- Email to Dr. Marten with update — no response after 36 hours\n- Slack to Ms. Lutz — she replied: \"I'm trying to talk to Eichler, but I don't have strong leverage there\"\n\n## Your Task\n\nDeal recovery plan (1.5 pages):\n\n1. **Deal diagnosis**: is this a genuine price issue, a procurement game, a \"new buyer establishing position\" dynamic, or something else? Defend.\n2. **Stakeholder strategy**: which stakeholder do you work in the next 3 weeks? In what order, with what ask?\n3. **Price negotiation position**: with what discount scenario do you go in? What are your counter-concessions (contract length, payment terms, implementation services)?\n4. **Exit clause**: how do you handle it? Full No, compromise, or partial offer (exit from Year 2 only)?\n5. **Forecast commit**: what do you commit to your VP for this quarter — Commit/Best Case/Pipeline? Defend with probability.\n\n## Guiding Questions\n\n- Dr. Marten (champion) says \"it's their job, not mine\" — is that truth or championship weakness? How do you push him without burning him?\n- 28% above benchmark: is that a real number or negotiation play? How do you find out without making Ms. Eichler defensive?\n- Exit clause after Year 1: full deal-breaker for Orionbase (Year 1 implementation costs would kill margin). But strict \"No\" is negotiation suicide. Where's the reframe?\n- If the quarter ends and the deal isn't closed — should it slip to next quarter (possibly losing momentum) or discount to €2.7M (floor) and close? How do you calculate?\n\n## Match Info\n\n**This case fits:** Enterprise Account Executive · Key Account Manager · Strategic Account Manager · Named AE · Channel Partner Manager · AE (Enterprise / Public Sector)\n**Primary skills tested:** Buying-committee navigation, deal diagnosis, procurement strategy\n**Industry fit:** Enterprise SaaS, B2B Tech, complex deal sellers"
  },
  {
    "id": "cs-47-equity-research",
    "title": "Upgrade or Downgrade? Your Initial Coverage Report on a DAX Stock",
    "cluster": "equity_research",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Equity Research Analyst",
      "Buy-side Analyst",
      "Sell-side Analyst",
      "Credit Analyst",
      "Sector Analyst",
      "Investment Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Finance",
      "Industrial",
      "Consumer"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Valuation vs. market expectation",
      "Sector depth",
      "Investment thesis",
      "Risk cataloging"
    ],
    "companyName": "Baumann AG",
    "logoUrl": "/company-logos/cs-47-equity-research.png",
    "body": "<img src=\"logos/cs-47-equity-research.png\" alt=\"Baumann AG logo\" width=\"120\" align=\"right\" />\n\n# Upgrade or Downgrade? Your Initial Coverage Report on a DAX Stock\n\n## Context\n\nYou work in the **equity research** department of a mid-size European investment bank (Frankfurt, Industrials DACH sector coverage). Your director has asked you to write **initial coverage** on **Baumann AG** (fictional DAX-listed machinery conglomerate, €14.8B revenue, current market cap €9.2B).\n\n**Your director says:**\n- \"Consensus is currently Hold. 7 analysts with price targets between €82 and €105. Current price €88.\"\n- \"I want your honest view — we don't want to be the 8th Hold call; that's useless to clients.\"\n- \"You have 4 days, then review meeting.\"\n\n## Your Role\n\nYou are an **Equity Research Analyst** (3 years industrials coverage). Your director expects a clearly-argued 20-page report with Buy/Hold/Sell rating and price target, plus an Executive Summary for Sales colleagues.\n\n## Situation — What You Know About Baumann AG\n\n**Business:**\n- 3 segments: Machine tools (58%), Drive technology (26%), After-sales service (16%)\n- Global presence: 42% DACH, 28% rest-EU, 18% North America, 12% Asia\n- 72,000 employees, 2024 revenue €14.8B, EBITDA margin 12.4%, FCF €680M\n\n**Consensus expectations 2025:**\n- Revenue €15.6B (+5% YoY)\n- EBITDA margin 13.0%\n- EPS €4.85\n- Current forward PE 18.1×\n\n**Sector context:**\n- Machine-tool market DACH/Europe: stagnant (+1% pa expected)\n- Asia: strong growth (+8% pa), especially China — where Baumann has only 12% of revenue\n- Automation trend (Industry 4.0, robotics): Baumann has spent only 2.8% of revenue on R&D in the last 3 years (competitors: 4.5–6%)\n- Main competitor DMG Mori: PE 22×, stronger Asia exposure\n\n**Specific signals you've analyzed:**\n\n| Signal | Interpretation |\n|---|---|\n| Q4 2024 order intake: −8% YoY | Negative: slowdown or pull-forward effect? |\n| Announcement 2 weeks ago: new \"Baumann Automate\" product line for 2026 | Positive, but execution risk |\n| CEO change 6 months ago (from automotive industry) | New direction? |\n| Balance sheet: net cash €1.2B | Strong balance, capital return possible |\n| CapEx plan 2025: +40% increase | Anticipating Asia expansion? |\n| 2024 dividend: €2.10 (46% payout) | Stable, not outstanding |\n| Insider transactions: 2 board members have sold in the last 3 months | Mild negative |\n| ESG score: MSCI BBB (industry avg A) | Underperformer, potential fund-flow issue |\n\n**What the sell-side consensus may be missing (your hypothesis):**\n\nYour supplier-data analysis suggests that Baumann is **growing faster in China than Q4 figures imply** — but communication has been cautious. If the dynamic is real, 2025 expectations are 6–8% too low. But: uncertain, data basis thin.\n\n**Risks everyone sees:**\n- German/EU recession\n- China exposure growing = political risk\n- Automation investment takes years to reach margins\n\n## Your Task\n\nExecutive Summary + argumentation (2 pages):\n\n1. **Rating**: Buy / Hold / Sell. Unambiguous.\n2. **Price target**: one concrete number, defended with 2 valuation methods (e.g., DCF + peer multiples)\n3. **Investment thesis** in 3–4 bullets: the clearest reason your rating is right\n4. **Top-3 catalysts** in the next 12 months: specific events/quarters that confirm or disprove the thesis\n5. **Top-3 risks**: honest, where could your call go wrong?\n6. **Differentiation from consensus**: what do you see that the other 7 analysts don't?\n\n## Guiding Questions\n\n- The China hypothesis is attractive (consensus could be wrong), but your data basis is thin. Do you write a Buy on it, or mention it as \"upside if validated\"?\n- Insider selling is mild negative but not big enough to flip a thesis. How do you weight it?\n- Your director doesn't want another Hold, but Hold may be the most honest call. How do you resolve this tension?\n- Stock is at the lower end of consensus range (€82–€105, currently €88). Is that already-priced pessimism, or more downside?\n\n## Match Info\n\n**This case fits:** Equity Research Analyst · Buy-side Analyst · Sell-side Analyst · Credit Analyst · Sector Analyst · Investment Analyst\n**Primary skills tested:** Valuation reasoning, consensus deviation, clean investment argument\n**Industry fit:** Investment Banking (Research), Asset Management, Hedge Funds"
  },
  {
    "id": "cs-48-audit-finding",
    "title": "Audit Finding: Material Revenue Shift — How Do You Escalate?",
    "cluster": "audit_tax",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Audit Associate (Big 4)",
      "Senior Audit Associate",
      "Tax Associate (Big 4)",
      "Transaction Advisory Associate",
      "Forensic Accountant (junior)",
      "Internal Audit Analyst",
      "Financial Reporting Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Finance",
      "Consumer",
      "Industrial",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Audit methodology",
      "Materiality thinking",
      "Escalation judgment",
      "Client communication under pressure"
    ],
    "companyName": "Liberta Software GmbH",
    "logoUrl": "/company-logos/cs-48-audit-finding.png",
    "body": "<img src=\"logos/cs-48-audit-finding.png\" alt=\"Liberta Software GmbH logo\" width=\"120\" align=\"right\" />\n\n# Audit Finding: Material Revenue Shift — How Do You Escalate?\n\n## Context\n\nYou're on the **year-end audit** of **Liberta Software GmbH** (DACH SaaS, €84M revenue, 420 employees, Private Equity owned). Your team: Audit Manager, two Senior Associates, three Associates (you're one, 2nd audit season). You're at a **Big-4 firm**. Testing phase for 3 weeks now, audit report due in 5 weeks.\n\n**Last night** during revenue cut-off testing sample review, you found an anomaly: **contracts totaling €2.8M were recognized as revenue in Q4 2024**, even though the implementation milestones (relevant under IFRS 15) were only reached in Q1 2025. That would **overstate 2024 revenue by ~3.3%**.\n\n**Materiality** for this audit was set at **€1.4M**. €2.8M is 2× materiality — **definitely material**.\n\n## Your Role\n\nYou are an **Audit Associate** (2nd season, staff-2). Your Senior is off today, your Manager is at the client in another meeting. You have until tomorrow morning to document the finding and decide how to escalate.\n\n## Situation\n\n**What you specifically found:**\n- 6 contracts totaling €2.8M, booked as revenue in the final 12 days of the year (Dec 19–31, 2024)\n- For 4 of them: implementation evidence (go-live dates, kick-off meetings) demonstrably in Q1 2025\n- For 2 of them: implementation documents are missing entirely, no response yet to request\n- The Head of Finance at Liberta replied yesterday to your query: \"This is industry standard — contracts with commitment are bookable.\" — which under IFRS 15 is incorrect\n\n**Context you know:**\n- Liberta is preparing a secondary sale to a larger PE fund (LOI already signed). The 2024 numbers are the basis for valuation.\n- 3.3% revenue overstatement × multiple of 5× revenue = **€14M valuation inflation** in the potential deal\n- Your Manager is a 6-year partner candidate who has led Liberta as client for 4 years\n- The PE owners are an important institutional client of your firm — several portfolio companies are audit clients\n\n**Your options:**\n\nA) **Document and escalate directly to Manager** (tomorrow morning, 1:1). Clear: finding has to go in the report. Manager decides next steps.\nB) **Gather more evidence first, then escalate**: review all contracts of this magnitude (not just sample), confirm the pattern, then escalate.\nC) **Escalate directly to Audit Partner** (skip Manager) — out of concern that Manager might soft-pedal with the client.\nD) **Talk to Senior Associate** (one year your senior), seek their view.\nE) **First seek client contact**: ask Head of Finance again if there's a plausible explanation you've missed.\n\n**Relevant standards:**\n- IFRS 15 (Revenue from Contracts with Customers) — revenue only on performance-obligation satisfaction\n- ISA 240 (Auditor's Responsibilities Relating to Fraud) — escalation obligation on fraud indications\n- ISA 450 (Evaluation of Misstatements Identified during the Audit) — above materiality = finding for management\n\n## Your Task\n\nMemo to self (decision + documentation, 1 page):\n\n1. **Which option (A–E, or combination) do you choose?** Defend.\n2. **What do you document in the audit workpapers** (content, tone, evidence references)?\n3. **Fraud assessment**: is this negligent cut-off or fraud risk? How do you argue both?\n4. **Client communication**: who speaks to whom, when?\n5. **Personal risk calibration**: what happens if you're too quiet? What if you're too loud? How do you manage your position as Staff-2?\n\n## Guiding Questions\n\n- \"Industry standard\" is not a legal defense, but you're only 2 years into audit — how sure are you that IFRS 15 is clearly saying \"wrong\" here?\n- Skipping Manager (option C) can damage a career, even if you're right. When is it justified?\n- The PE-sale situation isn't your concern — or is it, because it makes the incentive for the misbooking more plausible?\n- \"Staff-2\" has limited authority. How do you frame the finding so it's substantive but not arrogant?\n\n## Match Info\n\n**This case fits:** Audit Associate (Big 4) · Senior Audit Associate · Tax Associate (Big 4) · Transaction Advisory Associate · Forensic Accountant · Internal Audit Analyst · Financial Reporting Analyst\n**Primary skills tested:** Audit methodology, escalation judgment, integrity under career pressure\n**Industry fit:** Audit firms, Internal audit, Forensic services"
  },
  {
    "id": "cs-49-devrel-community",
    "title": "Developer Adoption Is Flat: What's Your 6-Month Plan?",
    "cluster": "devrel_community",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Developer Relations Engineer",
      "Developer Advocate",
      "Developer Experience Engineer",
      "Technical Evangelist",
      "Technical Writer",
      "Documentation Engineer",
      "Community Manager (developer)"
    ],
    "matchesFields": [
      "Marketing",
      "Engineering",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Developer-journey thinking",
      "Content-portfolio strategy",
      "Metric selection",
      "Community signal reading"
    ],
    "companyName": "Stackbridge",
    "logoUrl": "/company-logos/cs-49-devrel-community.png",
    "body": "<img src=\"logos/cs-49-devrel-community.png\" alt=\"Stackbridge logo\" width=\"120\" align=\"right\" />\n\n# Developer Adoption Is Flat: What's Your 6-Month Plan?\n\n## Context\n\n**Stackbridge** is an API-first B2B product for data validation (email/phone/address verification via API). Developer-first positioning: they don't sell through Sales, they sell through self-service signup + API usage. €26M ARR, 14,000 paying API accounts. Freemium model: 1,000 free API calls/month.\n\n**The problem:** Free-tier signups have been flat at ~2,800/month for 8 months. Activation rate (free → paid) at 4.8% (industry benchmark: 6–8%). Competitors are winning developer mindshare faster — especially **Zenkit API** (biggest competitor) which has had 3 viral Hacker News posts in the last 6 months, Stackbridge zero.\n\nYou were hired 2 months ago as the company's **first Developer Relations person**. You were told: \"Make us a brand in the developer community. In 12 months we want to be at Zenkit-API level.\"\n\n## Your Role\n\nYou are a **Developer Advocate / DevRel Engineer**. Your manager (VP Growth, from marketing background) wants your 6-month plan by end of week. You have budget for 2 more DevRel hires in H2.\n\n## Situation\n\n**What you've learned in your first 2 months:**\n\n1. **Docs quality**: API docs are functional but mechanical — no \"Getting Started in 5 minutes\" story, no realistic use-case examples. 34% of new signups abandon their first API call within 10 minutes\n2. **Community presence**: Stackbridge has a Discord (412 members, 87% inactive) and a GitHub with 2 public repos (only 18 stars total)\n3. **Content**: Blog has 14 posts in last 12 months, mostly product updates. No technical deep-dives, no \"how to build X\" tutorials\n4. **Developer perception**: you've talked with 8 active users — typical response: \"The product works well, but I found it by accident. I don't know it as a brand\"\n5. **SEO**: Stackbridge ranks on page 2–3 for most relevant keywords (\"email validation api\", \"phone number verification\")\n6. **Competitor Zenkit**: strong blog (3–4 posts/month, technical-deep), visible on Hacker News, active Twitter engineering-brand, sponsors 2 major conferences\n\n**Available levers:**\n\n**Content:**\n- A) **Technical tutorials**: \"Build X with Stackbridge\" — 2–4 per month, goal: SEO + qualified signups\n- B) **Engineering blog**: open-source-style deep dives on your tech stack (how does the API scale, how is rate-limiting implemented)\n- C) **Use-case storytelling**: interview existing customers, \"How X uses Stackbridge\"\n- D) **Open-source contributions**: open-source small tools around the core product (CLI tool, TypeScript library)\n\n**Community:**\n- E) **Discord revitalization**: engagement programs, office hours, champion program\n- F) **Reddit/Stack Overflow**: active presence answering relevant questions\n- G) **Conference presence**: 3–4 conferences per half (speaking + sponsoring)\n- H) **Twitter/X engineering brand**: tech-thread content on learnings from product engineering\n\n**Product-adjacent:**\n- I) **Docs relaunch**: rework quickstart flow, interactive API explorer\n- J) **SDK quality push**: official libraries for 4 additional languages (currently: only Node.js and Python)\n- K) **CLI tool**: command-line experience for developers testing APIs\n\n**Budget and resources:**\n- You alone for the first 3 months\n- Month 4+: 2 additional DevRel hires possible\n- Content budget: €18k/month (freelance writers, editing, tooling)\n- Conference budget: €40k for 6 months\n- Engineering support: 1 engineer 20% allocated for DevRel collaboration\n\n## Your Task\n\nA 6-month DevRel plan (1.5 pages):\n\n1. **Prioritized levers**: which 4–5 from A–K do you run first? Why these?\n2. **Sequence across 6 months**: what happens in month 1–2 vs 3–4 vs 5–6?\n3. **Team structure**: the 2 new hires — what profiles, what tasks?\n4. **KPIs**: which 3 primary and 2 secondary metrics do you track? What are target values after 6 months?\n5. **What you don't do** (e.g., YouTube channel, podcast) and why\n6. **Risk scenario**: what if after 4 months signups are still flat — do you have Plan B?\n\n## Guiding Questions\n\n- Docs relaunch (I) is the least glamorous project, but directly impacts activation. Do you prioritize it over \"glamorous\" community work?\n- Conference sponsoring (G) is expensive (€40k + travel) and hard to measure. Is it worth it at all, or is it vanity?\n- Competitor Zenkit has 3 viral HN posts — can \"going viral\" be planned, or is it random and shouldn't be counted on?\n- Engineering blog (B) is high-quality but time-intensive. The alternative (shallow \"5 tips\" content) converts faster. What's the right content-portfolio mix?\n\n## Match Info\n\n**This case fits:** Developer Relations Engineer · Developer Advocate · Developer Experience Engineer · Technical Evangelist · Technical Writer · Documentation Engineer · Community Manager (developer)\n**Primary skills tested:** Developer-journey thinking, content-portfolio, community signal reading\n**Industry fit:** API-first companies, Developer tools, Infrastructure SaaS"
  },
  {
    "id": "cs-50-support-backlog",
    "title": "Ticket Backlog at 1,840: Triage Plan for the Next 14 Days",
    "cluster": "customer_support",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Customer Support Specialist",
      "Customer Support Manager",
      "Technical Support Engineer",
      "Help Desk Analyst",
      "Support Team Lead",
      "Customer Service Representative"
    ],
    "matchesFields": [
      "Customer",
      "Operations"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Services",
      "Finance"
    ],
    "matchesMode": "reactive",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Triage logic",
      "Operational prioritization",
      "Resource allocation",
      "Transparency under pressure"
    ],
    "companyName": "Minora Home",
    "logoUrl": "/company-logos/cs-50-support-backlog.png",
    "body": "<img src=\"logos/cs-50-support-backlog.png\" alt=\"Minora Home logo\" width=\"120\" align=\"right\" />\n\n# Ticket Backlog at 1,840: Triage Plan for the Next 14 Days\n\n## Context\n\n**Minora Home** is a DTC e-commerce smart-home brand (€140M revenue, support team 22 people). The last 4 weeks have been Black-Week peak and a new hub product was launched — with firmware issues. Result: **1,840 open tickets**, average wait time **6.8 days** (SLA: 24 hours), CSAT fallen from 4.6 to 3.2.\n\nThe COO said this morning: \"We can't hire temps anymore — that budget is spent. I need a plan from you by tomorrow on how we return to SLA in 14 days.\"\n\n## Your Role\n\nYou are the **Customer Support Manager**. You have 22 support agents, 2 team leads, no additional hires, but free rein on process changes and escalation paths.\n\n## Situation\n\n**Ticket breakdown (1,840 open):**\n\n| Category | Count | Typical handle time |\n|---|---|---|\n| Hub firmware issues (new product) | 620 | 35 min (often follow-ups) |\n| Shipping / return inquiries | 410 | 8 min |\n| Product use questions (setup, app) | 380 | 18 min |\n| Warranty / guarantee cases | 190 | 25 min |\n| Billing / subscription inquiries | 140 | 12 min |\n| Account login issues | 100 | 6 min |\n\n**Team capacity:**\n- 22 agents × 7 productive hours/day × 10 days = 1,540 hours in 10 days\n- Currently: 38% time in new tickets, 62% in follow-ups on old ones\n- Language mix: 14 DE, 6 EN, 2 bilingual\n- 3 agents are technical-issue specialists, rest generalist\n\n**Available levers:**\n\nA) **Automated status updates** to all customers with tickets >3 days old — defuses escalations\nB) **FAQ / Knowledge-Base push**: publish top-20 Hub firmware questions as public article, proactive email to all Hub buyers — could save 200+ tickets\nC) **Engineering bridge**: 2 engineers dedicated for 1 week to fix Hub firmware root cause so new tickets stop\nD) **Bulk-handling for simple categories**: shipping / login tickets via template macros in 2–4 minutes\nE) **Ticket-closing policy**: auto-close tickets with no customer response after 7 days (communicated), reduces list-bloat\nF) **BPO outsourcing** for 2 weeks: existing contract with external provider (€35k for 2 weeks)\nG) **Team redistribution**: 4 agents specialize on Hub firmware tickets only, rest on standard\nH) **Prioritization by customer tier**: paying subscribers first, then one-time buyers\n\n**Constraints:**\n- Budget: €45k flexible\n- COO doesn't want outsourcing over €40k (lever F just fits)\n- Engineering team (C) is in sprint, VP Engineering must approve\n- \"Auto-close\" (E) is CSAT-risky\n\n## Your Task\n\nIn 25 minutes — 1-page plan:\n\n1. **Your lever selection**: which 4–5 from A–H? How combined?\n2. **Resource plan**: who does what in the 10 days? (Broad — not agent-by-agent)\n3. **Communication strategy**: what do you say to waiting customers? What's CSAT-defensible, what isn't?\n4. **Root-cause addressing**: how do you prevent this happening again (1–2 structural lessons)?\n5. **Measurement**: 3 numbers you monitor daily to know the plan works.\n\n## Guiding Questions\n\n- Hub firmware tickets (620, 35 min each) are the main block. Engineering fix (C) addresses the source — but the existing 620 tickets remain. Order: fix first, then clear? Or parallel?\n- FAQ push (B) with proactive email can reduce backlog but also trigger a wave of additional questions. How do you decide?\n- \"Auto-close no-response tickets\" (E) is operationally effective, CSAT-risky. What's the most acceptable variant?\n- BPO outsourcing (F) is usually not done with complex firmware issues. Where's the best use of the budget — absorbing simple categories, or expensive specialist help?\n\n## Match Info\n\n**This case fits:** Customer Support Specialist · Customer Support Manager · Technical Support Engineer · Help Desk Analyst · Support Team Lead · Customer Service Representative\n**Primary skills tested:** Triage logic, operational prioritization, transparency under pressure\n**Industry fit:** E-commerce, SaaS support, D2C Consumer Tech, B2B support orgs"
  },
  {
    "id": "cs-51-trust-and-safety",
    "title": "Policy Edge Case: Should Fitness Challenges Stay on the Platform?",
    "cluster": "trust_safety",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Trust & Safety Analyst",
      "Content Policy Analyst",
      "Platform Integrity Analyst",
      "Content Moderator (senior)",
      "Policy Manager (Platform)",
      "Community Operations Analyst",
      "Integrity Specialist"
    ],
    "matchesFields": [
      "Operations",
      "Research",
      "Product"
    ],
    "matchesIndustries": [
      "Tech",
      "Media",
      "Consumer"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Policy framework thinking",
      "Ethical trade-off reasoning",
      "Precedent awareness",
      "Stakeholder communication"
    ],
    "companyName": "Pulsem",
    "logoUrl": "/company-logos/cs-51-trust-and-safety.png",
    "body": "<img src=\"logos/cs-51-trust-and-safety.png\" alt=\"Pulsem logo\" width=\"120\" align=\"right\" />\n\n# Policy Edge Case: Should Fitness Challenges Stay on the Platform?\n\n## Context\n\n**Pulsem** is a social-video platform (8.2M MAU in DACH, primarily 14–29). Content type: short videos (15–60s), fitness is a top category. Existing community guidelines prohibit \"content that glorifies self-harm or encourages risky behavior\" — but fitness challenges fall in a gray area.\n\n**The specific case:** The hashtag **#75hard** (challenge: 75 days of 2× daily 45-min training, strict diet, 3.7L water, 10 pages of reading, no cheat meals) has 780,000 videos on Pulsem. Medical experts in 2 German media reports last week criticized the challenge: overloading, triggers eating-disorder tendencies in teens. Two medical associations have contacted Pulsem.\n\nYour Trust & Safety Head has asked you: by next Wednesday, a policy recommendation. Leadership has to decide.\n\n## Your Role\n\nYou are a **Trust & Safety Analyst** at Pulsem, 3rd year in role.\n\n## Situation\n\n**What you know about the content (sample of 500 random #75hard videos):**\n\n| Video type | Share | Character |\n|---|---|---|\n| \"Day X\" documentation | 68% | Mostly benign, sometimes inspiring, sometimes visibly exhausted |\n| \"Transformations\" (before/after body comparison) | 14% | Body-highlighting, promotes comparison culture |\n| Tips for sticking with it | 9% | Neutral |\n| Critical / ironic voices | 4% | Warning against challenge, testimonial |\n| Extreme / risky behavior | 5% | Visible overload, pain, \"mental toughness above all\" |\n\n**What you know about the users:**\n- 52% of #75hard creators are under 21\n- 18% have age flagged as \"under 16\" (Minor flag)\n- Comment analysis: frequent questions from teens (\"I'm 15, can I do this?\"), also critiques from other users\n\n**What other platforms have done:**\n- **TikTok**: has not banned #75hard, but adds warning label and shows helpline info on search\n- **Instagram**: no specific policy, but reels with risky content are demonetized\n- **YouTube**: age gate for certain extreme fitness challenges\n\n**Internal stakeholders:**\n- **Product Lead Discovery**: \"If we remove 780k videos we lose massive engagement and user satisfaction\"\n- **Legal**: \"We have no DSA duty to remove this, as long as it's not 'illegal content' — but we might face pressure from DSA coordinators\"\n- **Brand/PR**: \"Medical association critique is a real risk. 2 press inquiries already in\"\n- **Creator Success**: \"#75hard creators are often micro-influencers with engaged followers, who also make other (healthier) content. We can't blanket-penalize\"\n\n**Policy options:**\n\nA) **Full hashtag ban** — clear signal, massive engagement loss and creator anger\nB) **Age gate on #75hard content** — under-18 users don't see the hashtag\nC) **Warning label + resource panel** before every video with the hashtag (links to BZgA resources, info on healthy training)\nD) **Algorithmic demotion** — videos remain but not actively pushed in Feed/For-You\nE) **Subtle policy change**: only remove videos with \"extreme behavior\" character, keep normal \"Day X\" documentation\nF) **Do nothing**: observe, keep reviewing, no precedent-setting decision\nG) **Hybrid**: combination of B + C + engagement with creator community\n\n## Your Task\n\nPolicy recommendation memo (1.5 pages):\n\n1. **Your recommendation** (A–G, or your own). Be explicit.\n2. **Policy framework rationale**: on what principle does your recommendation rest? (Harm prevention, speech freedom, platform responsibility, precedent?)\n3. **Enforcement plan**: how do you operationalize? (ML classifier, human review, user reports)\n4. **Precedent analysis**: what effect does your decision have on future cases (similar challenges, extreme sports, diet content)?\n5. **Communication plan**: public statement yes/no? How do you communicate to creators, users, press?\n6. **What you explicitly rule out** and why — e.g., \"Full ban is disproportionate because...\"\n\n## Guiding Questions\n\n- \"Extreme content\" (5% of sample) is the actual problem, not the 68% \"Day X\" vlogs. But how do you reliably identify \"extreme\" in an ML classifier without false positives (harmless training videos)?\n- 18% of creators are 15 or younger (per age flag). Is that an age-gate argument, or does the problem run deeper (too many minors platform-wide)?\n- What's wrong with \"do nothing\" (F)? Is action always better than inaction, even when both have risks?\n- The medical associations are stakeholders, but so are users and creators. How much weight does each deserve?\n- What happens if similar pressure hits #keto, #intermittent-fasting, or #calisthenics-extrem in 6 months? Is your policy consistently applicable?\n\n## Match Info\n\n**This case fits:** Trust & Safety Analyst · Content Policy Analyst · Platform Integrity Analyst · Content Moderator (senior) · Policy Manager (Platform) · Community Operations Analyst · Integrity Specialist\n**Primary skills tested:** Policy-framework thinking, ethical trade-offs, precedent awareness\n**Industry fit:** Social platforms, Marketplaces, Gaming platforms, UGC services"
  },
  {
    "id": "cs-52-inhouse-counsel",
    "title": "Enterprise SaaS Deal: Which 3 Clauses Do You Renegotiate, Which Do You Accept?",
    "cluster": "inhouse_legal",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "In-House Counsel (junior)",
      "Commercial Counsel",
      "Contract Manager",
      "Employment Law Associate",
      "IP Counsel",
      "Legal Operations Associate",
      "Senior Paralegal (in-house)"
    ],
    "matchesFields": [
      "Operations",
      "Finance",
      "Sales"
    ],
    "matchesIndustries": [
      "Tech",
      "Services",
      "Finance"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Contract prioritization",
      "Business-risk trade-offs",
      "Negotiation strategy",
      "Internal-stakeholder management"
    ],
    "companyName": "Luminora Analytics",
    "logoUrl": "/company-logos/cs-52-inhouse-counsel.png",
    "body": "<img src=\"logos/cs-52-inhouse-counsel.png\" alt=\"Luminora Analytics logo\" width=\"120\" align=\"right\" />\n\n# Enterprise SaaS Deal: Which 3 Clauses Do You Renegotiate, Which Do You Accept?\n\n## Context\n\nYou work **in-house at Luminora Analytics** (B2B analytics SaaS, €45M ARR, 240 employees, VC-funded). Your 4-person legal team is lean. This morning an **enterprise deal with MetroBank AG** (large European retail bank, €1.8B revenue) landed on your desk.\n\n**Deal context:**\n- TCV: €2.4M over 3 years\n- Deal is verbally won, kickoff planned in 3 weeks\n- MetroBank has presented **their own Master Service Agreement** (42 pages) — instead of your standard MSA\n- Sales VP called this morning: \"We have to sign in 10 days or the deal is in jeopardy.\"\n\n## Your Role\n\nYou are **In-House Counsel** (2nd year at Luminora, previously 3 years at a law firm in Corporate/Tech). You have 48 hours to identify the critical points and build a redlining plan.\n\n## Situation — The 8 Most Critical Clauses in the MetroBank MSA\n\n**1) Liability Limitation**\nMetroBank: \"Liability shall not exceed fees paid in the preceding 12 months for the specific service that caused damages.\"\n*Your standard*: Liability = 1× annual fees, excluding gross negligence and willful misconduct\n*Risk*: in a data breach scenario, liability on your side could be uncovered\n\n**2) Data Protection & GDPR**\nMetroBank demands: access rights for their internal audit to your systems, annual sub-processor audits, 24h breach notification\n*Your standard*: certification-based (ISO 27001, SOC 2), 72h breach notification\n*Risk*: audit access rights are operationally impractical and could expose IP\n\n**3) SLA and Service Credits**\nMetroBank: 99.95% uptime with service-credit formula \"5% monthly fee per 0.1% downtime\"\n*Your standard*: 99.5% uptime, max service credits capped at 25% monthly fee\n*Risk*: could cost €50k+ in a bad month; technically on the edge of feasible\n\n**4) Change of Control**\nMetroBank: termination right on change-of-control on your side, plus escrow access to source code\n*Your standard*: no change-of-control clause\n*Risk*: on a Luminora acquisition (VC-backed), this could become critical\n\n**5) IP Indemnification**\nMetroBank: full indemnification on IP infringement by your software, incl. consequential damages\n*Your standard*: indemnification capped at fees paid\n*Risk*: unlimited liability on IP infringement\n\n**6) Termination for Convenience**\nMetroBank requires: termination right after 12 months with 90-day notice\n*Your standard*: none (3-year commit)\n*Risk*: potentially only 1 year of revenue instead of 3 — Finance would see this as deal-breaker\n\n**7) Data Localization**\nMetroBank: all data must be hosted in EU\n*Your setup*: AWS eu-central-1 (Frankfurt)\n*Risk*: no real risk unless MetroBank later requires Germany-only\n\n**8) Exclusivity Clause (hidden in Annex B)**\n\"Supplier shall not offer similar services to [list of named MetroBank competitors] during term\"\n*Your standard*: no exclusivity\n*Risk*: significant — three of the named competitors are current Luminora customers\n\n**Stakeholders:**\n- **Sales VP**: wants to sign, thinks \"details are lawyer stuff\"\n- **CTO**: objections to audit-access rights (clause 2) and escrow (clause 4)\n- **CEO**: called briefly this morning: \"Is the deal at risk? How much time do you need?\"\n- **MetroBank Procurement contact**: has said they have \"limited flexibility\" but \"open to constructive discussions\"\n\n## Your Task\n\n1.5-page redlining strategy:\n\n1. **The 3 clauses you absolutely renegotiate** (with \"why these before others\")\n2. **The 2–3 clauses you accept** — defended, why the risks are tolerable\n3. **The 1–2 clauses where you offer a compromise**: what counter-proposals do you put on the table?\n4. **Negotiation order**: in what order do you work through the points in your counter-redline document? (Most important first or last?)\n5. **Business communication**: how do you tell the Sales VP that the deal might not sign in 10 days, without creating panic?\n\n## Guiding Questions\n\n- The exclusivity clause (8) is hidden in Annex B — that's suspicious. Tactic or accident?\n- Clause 6 (termination for convenience after 12 months) is financially critical, but MetroBank will say \"this is our standard, we can't move.\" Is this what you let the deal die on?\n- Clause 1 (liability limitation) sounds aggressive but is common in bank enterprise deals. Where's the line?\n- You have 48h for a 42-page MSA review. What do you do, what do you NOT do? Where do you trust MetroBank's standard formulations, where not?\n\n## Match Info\n\n**This case fits:** In-House Counsel (junior) · Commercial Counsel · Contract Manager · Employment Law Associate · IP Counsel · Legal Operations Associate · Senior Paralegal (in-house)\n**Primary skills tested:** Contract prioritization, business-risk trade-offs, negotiation strategy\n**Industry fit:** In-House Legal, Commercial Law firms, Contract Management"
  },
  {
    "id": "cs-53-film-tv-producer",
    "title": "Day 14 of 32: Your Lead Actor Is Sick — What Do You Do?",
    "cluster": "film_tv_production",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Film Producer (junior)",
      "TV Producer (junior)",
      "Production Coordinator",
      "Line Producer (assistant)",
      "Production Manager",
      "Unit Production Manager",
      "Assistant Director"
    ],
    "matchesFields": [
      "Operations",
      "Design",
      "Research"
    ],
    "matchesIndustries": [
      "Media",
      "Arts"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "creator",
    "skillsTested": [
      "Crisis decision-making under production pressure",
      "Budget realism",
      "Stakeholder coordination",
      "Creative vs. operational trade-offs"
    ],
    "companyName": "Kastanienfilm GmbH",
    "logoUrl": "/company-logos/cs-53-film-tv-producer.png",
    "body": "<img src=\"logos/cs-53-film-tv-producer.png\" alt=\"Kastanienfilm GmbH logo\" width=\"120\" align=\"right\" />\n\n# Day 14 of 32: Your Lead Actor Is Sick — What Do You Do?\n\n## Context\n\n**\"Night Train to Istanbul\"** is a 6-part drama series (ARD/ARTE co-production, €14.2M budget). You work for executive production company **Kastanienfilm GmbH**. You've been in principal photography in Belgrade (doubling for Istanbul) for 2 weeks. The production has been on budget — so far.\n\n**This morning:** The lead actor (Martin Renz, 47, playing the protagonist Inspector Altun) called in sick. Diagnosis: herniated disc, doctor certifies **minimum 7 days unable to work**, possibly longer. Martin is the core of the series — involved in 26 of 32 shooting days.\n\nThe producer is in Berlin, reachable in 8 hours. The director is on set, already demoralized. You have a 20-minute window to make initial calls before the 10:00 AM daily briefing.\n\n## Your Role\n\nYou are the **Production Coordinator** (2nd production in this role, previously 3 years as assistant director). You are the most senior decision-maker on set until the producer arrives.\n\n## Situation\n\n**Shooting schedule (original plan):**\n\n| Day | Block | Martin involved? |\n|---|---|---|\n| 14 (today) | Hotel lobby scenes Ep. 2 | Yes, all scenes |\n| 15–16 | Train station escape scenes | Yes, all scenes |\n| 17 | Interrogation scenes | Yes, all scenes |\n| 18–19 | Old town exteriors | No (Ep. 4 subplot) |\n| 20 | Team rest day (scheduled) | — |\n| 21–26 | Ottoman Quarter exteriors | Yes (mostly) |\n| 27–32 | Studio interiors Belgrade | Yes, 70% |\n\n**Daily cost if we halt:** ~€165k (crew, equipment, locations, lodging)\n\n**Contract situation Martin Renz:**\n- Exclusively booked for 6 weeks (May 14 – June 25)\n- Cast insurance in place, deductible €280k, kicks in only after >10 shooting days lost\n- After June 25 he has a non-movable theater engagement\n\n**Available options:**\n\nA) **Restructure schedule**: Move Martin-free days (18-19) forward, shoot Ep. 4 subplot exteriors first. 1-2 days logistics reshuffle (~€80k), no lost shooting days.\n\nB) **Stand-in + body double**: Works for wide shots and back-of-head, not for dialogue. Could cover 40-50% of this week's scenes.\n\nC) **Full pause** and wait: 7+ days stoppage = €1.15M+ extra. Zero creative risk, massively expensive.\n\nD) **Script changes**: Screenwriter reachable via Zoom. Rewrite individual scenes so Martin doesn't appear — but substantive changes need director + producer + broadcaster (ARD) sign-off.\n\nE) **Partial Martin**: If he stabilizes in 3-4 days, he might play scenes sitting/lying down. Doctor would need to clear.\n\nF) **Recast**: Theoretically possible, practically disastrous (already-shot scenes would need reshooting — €2-3M extra, impossible within remaining budget).\n\n**Other factors:**\n- Team has a long exhausting week behind them — morale fragile\n- The German broadcaster (ARD producer) has not been informed yet\n- An AD suggested \"just give everyone today off\" — not functional with 120 people on active payroll\n\n## Your Task\n\nIn 20 minutes — short decision memo to the producer + first announcements for the 10:00 meeting:\n\n1. **Immediate decisions** for the next 24 hours: what happens today?\n2. **Plan for the next 7 days**: which combination of A–E do you use?\n3. **Financial estimate**: rough number on extra cost and whether it's budget-feasible\n4. **Broadcaster communication**: when and how do you inform the ARD producer? What do you say?\n5. **Team communication** at the 10:00 meeting: what do you tell crew and cast, honest but not panic-inducing?\n6. **Plan B**: if Martin is still not fit after 7 days — what changes?\n\n## Guiding Questions\n\n- Option A (restructure) sounds pragmatic but is hard to coordinate in 24 hours — Belgrade location bookings aren't arbitrarily shiftable, costume needs lead time. What's realistic?\n- Option B (body double) only works if the director plays along creatively. How do you motivate him while he's demoralized?\n- Cast insurance kicks in after >10 days of loss. At 7 days you bear 100% of cost yourself. How does that factor in?\n- Informing ARD is contractually and legally required — but now immediately vs. after a reliable assessment in 24h: what's right?\n\n## Match Info\n\n**Case fits:** Film Producer (junior) · TV Producer (junior) · Production Coordinator · Line Producer (assistant) · Production Manager · Unit Production Manager · Assistant Director\n**Primary tests:** crisis decisions, production logic, stakeholder balance\n**Industry fit:** Film & TV production, high-end event production, live broadcast"
  },
  {
    "id": "cs-54-quant-strategy",
    "title": "The Strategy Has Beautiful Backtest Numbers. Why Don't You Trust It?",
    "cluster": "quant_finance",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Quantitative Analyst",
      "Quant Researcher",
      "Systematic Trading Analyst",
      "Algorithmic Trading Strategist",
      "Risk Quant",
      "Machine Learning Engineer (finance)",
      "Data Engineer (finance)"
    ],
    "matchesFields": [
      "Finance",
      "Data",
      "Research",
      "Engineering"
    ],
    "matchesIndustries": [
      "Finance",
      "Tech"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Backtest critique",
      "Overfitting detection",
      "Data-quality skepticism",
      "Robust model validation"
    ],
    "companyName": "Vanderbilt Systematic",
    "logoUrl": "/company-logos/cs-54-quant-strategy.png",
    "body": "<img src=\"logos/cs-54-quant-strategy.png\" alt=\"Vanderbilt Systematic logo\" width=\"120\" align=\"right\" />\n\n# The Strategy Has Beautiful Backtest Numbers. Why Don't You Trust It?\n\n## Context\n\nYou work at **Vanderbilt Systematic** (systematic-quant hedge fund, €2.8B AuM, London). A colleague on the research team — Sergio, 1 year more seniority than you — has developed a new trading strategy: **\"Momentum-Dislocation Signal\"** for European large caps. The fund manager wants to go live with €120M capital allocation if research review is positive.\n\nYour CIO has asked: **Do a critical review. Don't be nice — be rigorous.** You have 3 days.\n\n## Your Role\n\nYou are a **Quantitative Analyst** (3rd year). You have expertise in backtest methodology and have previously killed two strategies after initial positive appearance.\n\n## Situation — Sergio's Strategy\n\n**Core idea:**\nStrategy buys large-cap stocks that have \"dislocated\" in the last 5 days (mismatch between momentum signal and short-term price action) and closes positions after 10 days.\n\n**Backtest results (Sergio's deck):**\n\n| Metric | Value |\n|---|---|\n| Period | 2012–2024 (12 years) |\n| Universe | STOXX 600, EUR large caps |\n| Sharpe ratio | 2.14 |\n| Annualized return | 18.6% |\n| Max drawdown | 9.8% |\n| Win rate | 61% |\n| Avg trade size | €1.2M |\n| Avg trades/year | 380 |\n| Transaction costs modeled | Yes, 8 bps per trade |\n\n**What's in Sergio's deck:**\n- Strategy outperforms STOXX 600 in 10 of 12 years\n- Worst year: 2018 (flat), best years: 2020 (+32%), 2022 (+24%)\n- Correlation to market: 0.32 (attractively low)\n\n**What's NOT in Sergio's deck, but what you found reviewing his code and data:**\n\n1. **Signal construction**: The \"momentum signal\" uses a 20-day moving average. The \"dislocation check\" uses 5-day forward-looking data at the time of signal generation (looks into the future)\n2. **Universe**: \"STOXX 600 EUR large caps\" was filtered by current market cap — meaning companies that dropped from the index or went bankrupt are not in the backtest (survivorship bias)\n3. **Transaction costs**: 8 bps is optimistic for mid-cap names. Realistically 12–15 bps on average\n4. **Parameter tuning**: Sergio tested the parameters (20-day MA, 5-day dislocation, 10-day holding) across many combinations before picking \"the best.\" Git history shows 40+ parameter variations\n5. **Signal robustness**: Apply to US market (S&P 500), Sharpe drops to 0.8. Japan: 0.4. Europe-specific?\n6. **Regime stability**: Best years (2020, 2022) were crisis years (Covid, Ukraine) — could the strategy be overfit to those regimes?\n7. **Trade frequency**: 380 trades/year × €1.2M = €456M volume/year. On €120M capital that's ~4x turnover. Market impact on mid-caps likely underestimated\n\n**Sergio's position:**\n- Very convinced, shared deck with a pair-programmer from risk management (who said \"interesting\")\n- Told you last night over drinks: \"If this goes live and performs, I could be in partnership talks this year\"\n\n**Fund manager context:**\n- Has two existing strategies underperforming for 18 months\n- Investor-relations pressure to have a fresh exciting story\n- Explicitly said in the last all-hands: \"We need fresh ideas. Don't be too conservative.\"\n\n## Your Task\n\nCritical review memo (1.5 pages):\n\n1. **Your verdict**: Go-live / Go-live with modifications / No-go. Be explicit.\n2. **Top-3 methodological concerns** ranked: which of the 7 issues are deal-breakers, which are refinement points?\n3. **Requested changes**: what concrete fixes / additional tests would Sergio need to deliver before you'd green-light?\n4. **Missing robustness tests**: out-of-sample testing, walk-forward analysis, parameter sensitivity — what would you want to see?\n5. **Capital recommendation**: if fund manager insists on going live, what starting capital would you suggest (vs. planned €120M)?\n6. **Communicating with Sergio**: how do you deliver this review to a colleague whose career depends on it, without being unfair?\n\n## Guiding Questions\n\n- Issue #1 (look-ahead bias) is methodologically fatal. But: could it be that the signal construction just *looks* like it uses future data but is actually okay? How do you test?\n- Issue #2 (survivorship bias) is simple to fix (use correct historical index composition). But does that decide the verdict, or is it \"nice-to-fix\"?\n- The fund manager wants \"fresh ideas\" — if you're too hard, you're the unloved naysayer. If you're too soft and the strategy fails, your review was weak. Where's the right tone?\n- Sergio is colleague and competitor. Your review affects his career. Should that influence your analysis? How do you make sure it doesn't?\n\n## Match Info\n\n**Case fits:** Quantitative Analyst · Quant Researcher · Systematic Trading Analyst · Algorithmic Trading Strategist · Risk Quant · ML Engineer (finance) · Data Engineer (finance)\n**Primary tests:** backtest skepticism, methodological rigor, integrity vs. social dynamics\n**Industry fit:** hedge funds, asset management, proprietary trading, fintech quant teams"
  },
  {
    "id": "cs-55-teacher-curriculum",
    "title": "Math Grades Collapsed: Your Plan for Class 9b Through Term End",
    "cluster": "education_teaching",
    "duration": "short",
    "estimatedMinutes": 25,
    "matchesRoles": [
      "Teacher (Secondary)",
      "Instructor / Lecturer",
      "Academic Advisor",
      "Tutor / Coach (academic)",
      "Head of Department (school)",
      "Educational Program Manager",
      "Training Specialist"
    ],
    "matchesFields": [
      "Design",
      "Research",
      "Customer"
    ],
    "matchesIndustries": [
      "Public",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Diagnosis with heterogeneous skill levels",
      "Intervention prioritization",
      "Classroom management",
      "Parent and colleague communication"
    ],
    "companyName": "Bristol Secondary",
    "logoUrl": "/company-logos/cs-55-teacher-curriculum.png",
    "body": "<img src=\"logos/cs-55-teacher-curriculum.png\" alt=\"Bristol Secondary logo\" width=\"120\" align=\"right\" />\n\n# Math Grades Collapsed: Your Plan for Class 9b Through Term End\n\n## Context\n\nYou teach **math** at a municipal secondary school in Bristol, UK. Your Year 10 class (28 students, equivalent to German class 9b) just scored a class average of **55% (roughly a low C)** on the last test — significantly worse than the parallel classes (72% and 70%) on the same topic (quadratic functions).\n\nTerm ends in **10 weeks**. The head teacher asked you friendly but clearly this morning: \"What's your plan?\"\n\n## Your Role\n\nYou are a **secondary math teacher in your 3rd year**. You teach this class math (4 periods/week) and computer science (1 period). The class is known as \"difficult\" — highly heterogeneous: 3 very strong students, a wide middle group, 6–8 with weak foundations, 2 with documented learning support needs.\n\n## Situation\n\n**Grade distribution from the last test (translated roughly to A–F):**\n\n| Grade | Number of students |\n|---|---|\n| A | 2 |\n| B | 3 |\n| C | 5 |\n| D | 7 |\n| E | 8 |\n| F/U | 3 |\n\n**What you learned from the test analysis:**\n- Question 1 (interpret parameters of a parabola): 68% average — OK\n- Question 2 (convert vertex form to standard form): 42% — notably weak\n- Question 3 (word problem: parabolic bridge arch): **23% average** — disaster\n- Many students left the word problem entirely blank\n\n**What you know about the group:**\n- 2 students transferred mid-year — gaps in prerequisites (powers, roots)\n- 4–5 students chronically unmotivated, don't do homework\n- The 3 strong students are sometimes bored\n- Parents' evening was 3 weeks ago: 14 of 28 parents attended — parents of the lowest-scoring students were not there\n- A colleague (English teacher for this class) told you: \"It's similar in my subject. The class has a general work-ethic problem.\"\n\n**Available levers:**\n\nA) **Differentiate in class**: Offer 3 difficulty tiers in parallel (strong/mid/weak tasks). Heavy prep, but demonstrably effective.\nB) **Focus topic reduction**: Don't push through the full curriculum — secure the 3 most critical competencies through term end.\nC) **Cooperative learning** (peer tutoring, group work): Strong help weaker students — requires classroom management.\nD) **Offer a support session** (after school, voluntary) — 45 min/week, probably 1–2 mid-tier students would show.\nE) **Digital practice** via the school's learning app: gamified, but only ~40% of students actively use it.\nF) **Parent contact**: Direct 1:1 conversations with parents of students scoring E/F.\nG) **More intensive test post-mortem**: 2–3 periods of \"error analysis in dialogue\" — shows transparency but eats class time.\n\n**Constraints:**\n- Curriculum mandates 3 more topics this term (roots, similar triangles, intro trigonometry) — you can't sit on parabolas indefinitely\n- Your weekly workload is full — extra support sessions = overtime\n- Head teacher wants measurable improvement (next test in 8 weeks)\n\n## Your Task\n\nIn 25 minutes — 1-page plan:\n\n1. **Your 3 core measures** from A–G (with reasoning: why these)\n2. **Differentiation concept**: how do you handle heterogeneity? (Concrete — e.g., \"Every lesson has 15 min core phase for all, then 25 min differentiated in 2 tiers\")\n3. **Communication to students**: what do you say to the class next week? (Motivating, realistic, non-shaming)\n4. **Parent approach**: which parents do you write to directly? What do you want from them?\n5. **Measurement after 4 weeks**: which 2–3 intermediate signals tell you if your plan is working?\n\n## Guiding Questions\n\n- \"Focus reduction\" (B) contradicts the curriculum — but is it right to push through content half the class doesn't understand, just to tick boxes?\n- Peer tutoring (C) shifts work to students. Pedagogically valuable, or offloading?\n- Voluntary support session (D): often the wrong students show up (the ones who need it least). How do you reach the ones you actually want to reach?\n- The head teacher wants \"measurable improvement in the next test\" — is that the right time horizon, or does it risk teaching-to-the-test?\n\n## Match Info\n\n**Case fits:** Teacher (Secondary) · Instructor / Lecturer · Academic Advisor · Tutor / Coach (academic) · Head of Department (school) · Educational Program Manager · Training Specialist\n**Primary tests:** heterogeneity diagnosis, intervention prioritization, stakeholder communication (parents, colleagues, leadership)\n**Industry fit:** schools, universities, corporate training, tutoring companies, adult education"
  },
  {
    "id": "cs-56-embedded-iot",
    "title": "Battery Drain in the Field: Debugging an IoT Fleet Remotely",
    "cluster": "embedded_iot_engineering",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Embedded Systems Engineer",
      "IoT Engineer",
      "Firmware Engineer",
      "Hardware Engineer (junior)",
      "Electronics Engineer",
      "Field Applications Engineer",
      "Technical Support Engineer (hardware)"
    ],
    "matchesFields": [
      "Engineering",
      "Research",
      "Operations"
    ],
    "matchesIndustries": [
      "Industrial",
      "Tech",
      "Consumer"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Remote debug strategy",
      "Power-profiling intuition",
      "Root cause at the hardware/firmware boundary",
      "Field-update risk"
    ],
    "companyName": "AgriSense GmbH",
    "logoUrl": "/company-logos/cs-56-embedded-iot.png",
    "body": "<img src=\"logos/cs-56-embedded-iot.png\" alt=\"AgriSense GmbH logo\" width=\"120\" align=\"right\" />\n\n# Battery Drain in the Field: Debugging an IoT Fleet Remotely\n\n## Context\n\n**AgriSense GmbH** builds IoT sensors for precision agriculture — battery-powered measurement stations that read soil moisture, temperature, and NPK nutrient levels and transmit via LoRaWAN 4× daily to a cloud backend. Spec: **3.5 years battery life** on a single CR123A cell (1,500 mAh).\n\n**The problem:** The current product generation (v3.2, in-field for 8 months, 4,200 units across DACH and Poland) is showing significant battery drain. At one large customer (a rapeseed cooperative in Mecklenburg-Vorpommern, 380 sensors), **23% of units have failed after just 11 months** — they should last 36+ months per spec.\n\nThe customer has scheduled an escalation meeting for next Wednesday (8 days away). The account manager needs an explanation and a plan by then.\n\n## Your Role\n\nYou are an **Embedded Systems Engineer** (2.5 years at AgriSense). Your manager has named you lead debugger. You have access to firmware code, cloud backend telemetry, and a hardware lab with test units.\n\n## Situation\n\n**What cloud telemetry shows (across all 4,200 units):**\n\n| Metric | Expected | Actual |\n|---|---|---|\n| Avg battery remaining at 11 months | 70% | 48% |\n| Devices with battery <10% | <50 | 780 |\n| Devices with anomalous power profile | 0 | 420 |\n| Daily message rate (4/day expected) | 4 | 4 (correct) |\n\n**\"Normal\" vs. \"anomalous\" power profile:**\n- Normal: sleep mode draws 8 µA, active mode (measuring/transmitting) 28 mA for 2.3 seconds, 4× daily\n- Anomalous: sleep mode draws **45–80 µA** (instead of 8 µA), active mode normal\n\n**Other signals:**\n- Anomalous devices show **no clear geographic clustering** — spread across DACH\n- Correlation with firmware version: 92% of anomalous devices run firmware **v3.2.1** (April 2024 update, 6 months after hardware launch)\n- 8% of anomalous devices run **v3.1.3** (older) — but small share\n- v3.2.1 contained: a LoRaWAN library update (new stack version), a sensor bug fix, and a \"general optimizations\" commit\n- The hardware itself has been unchanged since launch\n\n**What 2 individual field units (returned to lab) showed:**\n- Both show 65 µA sleep consumption\n- Force-downgrade firmware to v3.1.3: sleep returns to 8 µA\n- Re-flash to v3.2.1: back to 65 µA\n- Detailed power profiling: the MCU itself is correctly asleep (1.8 µA), but the LoRaWAN modem draws 63 µA — instead of the expected ~4 µA\n\n**What you know about the v3.2.1 commit:**\n- The LoRaWAN library update slightly changed the configuration of \"duty-cycle management\" flags\n- One commit reads \"Disable RX_WINDOW_2 to save memory\" — possibly relevant, because the modem may not be entering deep-sleep correctly\n- Modem chip documentation says: if RX_WINDOW_2 is disabled, the modem chip stays in \"idle\" rather than \"deep-sleep\" — which would be exactly 60–70 µA\n\n**What you know about OTA update capacity:**\n- 80% of devices can receive over-the-air firmware updates\n- An OTA update itself consumes ~3% battery\n- 20% of devices are \"behind challenging RF conditions\" and require manual field visits\n\n## Your Task\n\nFor the escalation meeting in 8 days — debug findings + action plan (1.5 pages):\n\n1. **Root-cause hypothesis**: with high probability, what's the cause? Show your evidence chain.\n2. **Verification plan**: which 2–3 tests in the next 3 days confirm the hypothesis?\n3. **Fix**: what does the firmware fix look like (rough)? Can it be distributed via OTA?\n4. **Affected fleet**: what concrete remediation do you offer the customer — replacement, fix update, battery credit?\n5. **Financial impact** rough estimate (remediation cost for AgriSense)\n6. **Process lessons**: what needs to change structurally at AgriSense so \"general optimizations\" commits don't trigger this again?\n\n## Guiding Questions\n\n- The RX_WINDOW_2 deactivation looks like the prime suspect — but it only matches 92% of anomalous devices (those on v3.2.1). What about the 8% on v3.1.3 with similar issues? Separate problem or not yet understood?\n- OTA fix is elegant but uses 3% battery itself. For devices already <10% battery, that could finish them off. How do you sequence the rollout?\n- The 20% without OTA (poor RF) need field visits. With 4,200 devices that's 840 — who pays? How do you communicate that to the customer?\n- Internal process lesson: should a \"general optimizations\" commit go into production firmware on 4,200 devices WITHOUT specific power-regression testing? How do you frame that without burning a colleague?\n\n## Match Info\n\n**Case fits:** Embedded Systems Engineer · IoT Engineer · Firmware Engineer · Hardware Engineer (junior) · Electronics Engineer · Field Applications Engineer · Technical Support Engineer (hardware)\n**Primary tests:** remote debug strategy, firmware/hardware boundary, field-update risk\n**Industry fit:** IoT, industrial sensing, automotive embedded, smart home, AgriTech"
  },
  {
    "id": "cs-57-product-marketing",
    "title": "Launching a Premium Tier: Positioning, Pricing Story, and Sales Enablement",
    "cluster": "product_marketing",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Product Marketing Manager",
      "Senior Product Marketing Manager",
      "Technical Product Manager",
      "Product Marketing Lead",
      "Go-to-Market Manager",
      "Brand Marketer (B2B SaaS)"
    ],
    "matchesFields": [
      "Marketing",
      "Product",
      "Sales"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Positioning frameworks",
      "Pricing narrative",
      "Sales enablement",
      "Cross-functional launch coordination"
    ],
    "companyName": "Lattica",
    "logoUrl": "/company-logos/cs-57-product-marketing.png",
    "body": "<img src=\"logos/cs-57-product-marketing.png\" alt=\"Lattica logo\" width=\"120\" align=\"right\" />\n\n# Launching a Premium Tier: Positioning, Pricing Story, and Sales Enablement\n\n## Context\n\n**Lattica** is a B2B project-management SaaS (€32M ARR, 2,400 customers, mostly SMB). Sales has spent 9 months losing 7-figure deals to enterprise competitors because Lattica had no premium tier. Engineering has now built **\"Lattica Enterprise\"** — SSO, advanced permissions, audit logs, dedicated CSM, 99.95% SLA. Pricing: from €19/seat (Pro) to **€48/seat (Enterprise)**.\n\nGA launch is in 5 weeks. The CRO has 14 reps in the field, none of whom have sold an enterprise tier before.\n\n## Your Role\n\nYou are the **Product Marketing Manager** for the launch. You own positioning, pricing narrative, sales enablement, and launch comms. The CEO wants 6 enterprise deals closed within 90 days post-launch.\n\n## Situation\n\n**Customer signals (12 win-loss interviews you ran):**\n- 8 of 12 lost deals cited \"no SSO/SCIM\" as the deal-breaker\n- 4 cited \"no audit trail for SOX compliance\"\n- 6 said competitor's pricing was \"transparent and predictable\" (Lattica's was opaque)\n- 3 said the sales rep \"didn't understand my IT-security buying process\"\n\n**Competitive landscape:**\n- Asana Enterprise: ~€55/seat, strong brand, weaker custom workflows\n- Monday Enterprise: ~€42/seat, stronger automations, weaker reporting\n- Lattica Pro at €19 has become a price anchor — telling existing customers \"now pay €48\" risks revolt\n\n**Internal positions:**\n- CRO: \"Just call it Enterprise, copy Asana's deck, ship it\"\n- Head of Engineering: \"We have 3 features competitors don't — lead with that\"\n- 2 long-time customers (in beta): \"We'd switch to Asana if you make us pay 2.5x for the same product\"\n\n**Available assets:**\n- Engineering team for technical content reviews (limited bandwidth)\n- 1 designer, 1 content writer (fractional)\n- €60k launch budget\n- Existing customer base for case studies (none in beta yet)\n\n## Your Task\n\nLaunch plan in 1.5 pages:\n\n1. **Positioning statement** for Enterprise tier — one paragraph, sharp differentiation\n2. **Pricing narrative**: how do you justify €19 → €48 to existing customers, and €48 to new ones? What features stay in Pro vs. move to Enterprise?\n3. **Top-3 launch assets** you build first (deck, one-pager, security whitepaper, ROI calculator, demo video, etc.)\n4. **Sales enablement**: how do you train 14 reps in 5 weeks to sell into IT-security buying committees they've never met?\n5. **Launch sequencing**: what does week 1 vs. week 2-4 vs. week 5+ look like?\n6. **Risk mitigation**: how do you handle the existing-customer revolt risk?\n\n## Guiding Questions\n\n- Differentiation on \"3 unique features\" sounds compelling but fades fast — competitors copy in 6 months. What's a positioning angle that's harder to copy?\n- The CRO wants speed; existing customers want stability. Is there a pricing-grandfathering structure that buys you both?\n- Sales enablement: is the bottleneck training (knowledge), confidence (practice), or process (the IT-security buying committee is a different motion)?\n- 6 deals in 90 days = 1 deal every 15 days from a cold start. Realistic, or a forecast trap?\n\n## Match Info\n\n**Case fits:** Product Marketing Manager · Senior PMM · Technical Product Manager · GTM Manager · B2B Brand Marketer\n**Primary tests:** positioning, pricing narrative, cross-functional launch\n**Industry fit:** B2B SaaS, enterprise tech, infrastructure tools"
  },
  {
    "id": "cs-58-mobile-perf",
    "title": "App Cold Start Doubled: Where Do You Look First?",
    "cluster": "software_engineering_frontend",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Mobile Developer (iOS / Android)",
      "Frontend Software Engineer",
      "Full-Stack Software Engineer",
      "QA Engineer",
      "Senior Software Engineer (mobile)",
      "Software Engineer (Backend, when API-related)"
    ],
    "matchesFields": [
      "Engineering",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Finance"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Performance debugging",
      "Trace and profile interpretation",
      "Trade-offs (architecture vs. quick wins)",
      "QA / regression strategy"
    ],
    "companyName": "Sparkbase",
    "logoUrl": "/company-logos/cs-58-mobile-perf.png",
    "body": "<img src=\"logos/cs-58-mobile-perf.png\" alt=\"Sparkbase logo\" width=\"120\" align=\"right\" />\n\n# App Cold Start Doubled: Where Do You Look First?\n\n## Context\n\n**Sparkbase** is a consumer banking app (4.2M MAU, iOS + Android, native). The most recent release (v8.4, 6 days ago) has caused **cold-start time on Android to jump from 1.4s (p50) to 2.9s**, and from 3.1s (p95) to 6.2s. iOS is unchanged. Crash rate is stable. App-store reviews mentioning \"slow\" have tripled.\n\nThe Head of Engineering has asked you and a QA engineer to lead the investigation. You have 4 days before the next planned release.\n\n## Your Role\n\nYou are a **Senior Mobile Engineer** (Android focus) with 4 years of native-app experience. You can pull traces, run the app under profilers, talk to backend, and request hotfix releases.\n\n## Situation\n\n**What you know about v8.4 (from the changelog):**\n- New onboarding flow (added 3 screens)\n- Switched analytics SDK from Firebase to a new vendor (Pulsar Analytics)\n- Pulled in 2 new third-party libraries (one for biometric auth, one for QR scanning)\n- Targeting Android API 34 (was 33)\n- Migrated 4 screens from XML layouts to Jetpack Compose\n\n**Telemetry you can access:**\n- Firebase Performance (kept alongside Pulsar) — shows trace breakdown but only for 30% of users (sampling)\n- Crashlytics — no spike\n- Custom timing markers in `Application.onCreate()` and first activity\n\n**Trace from a representative session (Android, mid-tier device, cold start):**\n\n| Phase | v8.3 | v8.4 |\n|---|---|---|\n| Process start → Application.onCreate begin | 180 ms | 190 ms |\n| Application.onCreate (SDK init) | 220 ms | **910 ms** |\n| First activity onCreate | 340 ms | 380 ms |\n| First frame drawn | 660 ms | 1,420 ms |\n\n**What you've already noticed:**\n- The new analytics SDK (Pulsar) is initialized synchronously in `Application.onCreate()` — its docs say \"init can take 200-800ms on cold start\"\n- Compose migration on the splash screen pulled in 14 MB of additional dex code\n- A blocking network call to fetch feature flags happens before first frame\n\n**Constraints:**\n- Hotfix release ships in 4 days; full release in 2 weeks\n- Reverting Pulsar means losing the funnel-tracking work the data team relied on\n- Reverting to XML on splash is doable but burns 1 engineer-week\n- Backend team can move feature-flag fetch to an async path, but it's their call\n\n## Your Task\n\nIn 45 minutes — investigation + decision memo:\n\n1. **Top-3 likely root causes** ranked by evidence and effort to confirm\n2. **Verification plan** for each — what specific test/trace nails it?\n3. **Hotfix decision**: what ships in 4 days, what waits for the 2-week release?\n4. **Quick wins** vs. **structural fixes** — which is which?\n5. **Regression-prevention**: how do you stop a 200ms SDK init from sneaking into prod again? (CI gates, perf budgets, manual checklist?)\n6. **Cross-team ask**: what do you need from backend, QA, data team?\n\n## Guiding Questions\n\n- Pulsar SDK init at 910ms is suspicious, but what if the real culprit is the Compose dex-load on splash? How do you separate them with one trace?\n- \"Move to async\" sounds clean, but async-init has subtle race-condition risks (analytics events firing before SDK ready). What's your guard?\n- iOS is unchanged — useful signal or red herring? What does it tell you about which subsystem is at fault?\n- 4 days isn't enough for the structural fix. What do you commit to, what do you defer, and how do you communicate that to product?\n\n## Match Info\n\n**Case fits:** Mobile Developer (iOS/Android) · Frontend Software Engineer · Full-Stack Engineer · QA Engineer · Senior Mobile Engineer\n**Primary tests:** performance debugging, trace interpretation, regression strategy\n**Industry fit:** consumer apps, fintech, e-commerce mobile, B2C SaaS"
  },
  {
    "id": "cs-59-sre-incident",
    "title": "P0 Incident Postmortem: 47 Minutes of Checkout Down",
    "cluster": "site_reliability_devops",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Site Reliability Engineer",
      "DevOps Engineer",
      "Platform Engineer",
      "Software Engineer (Backend)",
      "Cloud Infrastructure Engineer",
      "Production Engineer"
    ],
    "matchesFields": [
      "Engineering",
      "Operations"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Finance"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Incident reasoning under blameless rigor",
      "Root-cause vs. trigger separation",
      "Action-item prioritization",
      "Reliability culture"
    ],
    "companyName": "Honeycart",
    "logoUrl": "/company-logos/cs-59-sre-incident.png",
    "body": "<img src=\"logos/cs-59-sre-incident.png\" alt=\"Honeycart logo\" width=\"120\" align=\"right\" />\n\n# P0 Incident Postmortem: 47 Minutes of Checkout Down\n\n## Context\n\n**Honeycart** is a mid-market e-commerce platform (€420M GMV/year, ~4,000 merchant tenants). Tuesday at 14:23 CET, checkout requests began returning 503s. By 14:31 the incident was paged P0. By 15:10 it was mitigated. Total impact: **47 minutes of full checkout outage**, estimated **€1.4M lost GMV** and ~6,800 abandoned carts.\n\nIt is now Wednesday morning. You've been asked to write the postmortem and present it at Friday's reliability review.\n\n## Your Role\n\nYou are an **SRE** on the platform-reliability team (3rd year). You were on-call for the response. The CTO will read this postmortem; she has been pushing the engineering org toward stricter change-management.\n\n## Situation — What Happened\n\n**Timeline (CET, Tuesday):**\n\n| Time | Event |\n|---|---|\n| 13:55 | Routine deploy of payments-service v2.34.1 (added support for new PSP) |\n| 14:18 | Database migration started — adds index on `payment_intents.tenant_id` |\n| 14:22 | Migration completes; index online |\n| 14:23 | Checkout 503 rate climbs from 0.1% → 92% in 90 seconds |\n| 14:25 | First customer reports in support |\n| 14:31 | On-call paged; incident declared P0 |\n| 14:38 | Logs show `payments-service` pods OOMKilled in a loop |\n| 14:51 | Engineer rolls back payments-service to v2.34.0 — no improvement |\n| 14:58 | DBA notices CPU on primary DB at 99%, query queue full |\n| 15:04 | Engineer kills 3 long-running queries from BI tool |\n| 15:10 | Checkout success rate returns to baseline |\n\n**What you found in the next 18 hours:**\n- The new index migration ran at peak traffic (14:18) — runbook says \"off-peak only\"\n- Index creation locked the table for ~4 seconds; that alone wouldn't have caused 47 min of impact\n- BI team had a scheduled query at 14:00 doing a full-table scan on `payment_intents` (ran weekly, no one noticed it was a problem)\n- The BI query + index migration + normal load → primary CPU saturated → query queue backed up → app pods couldn't connect → connection-pool exhaustion → OOM (each retry held memory)\n- Rollback didn't help because the DB was the bottleneck, not the new code\n\n**Cultural / process context:**\n- The deploy that included the migration was approved by 1 reviewer (CODEOWNERS only required 1)\n- No load test was run on this migration\n- The runbook rule \"no migrations during peak\" exists in the wiki but isn't enforced\n- The BI team's weekly query has been running for 9 months unnoticed\n- 2 weeks ago, a similar near-miss happened with a different table; an action item to \"review BI workload\" was filed but never picked up\n\n## Your Task\n\nPostmortem document (1.5–2 pages):\n\n1. **Summary** (3-4 sentences, including impact)\n2. **Root cause vs. triggers**: what was the underlying cause, and what triggers combined to surface it?\n3. **What went well** in the response (be specific, not generic praise)\n4. **What went wrong** — both technical and process\n5. **Action items**: 5–7 concrete fixes, each with **owner, deadline, and priority**, separated into \"prevent recurrence\" vs. \"improve detection\" vs. \"improve response\"\n6. **One uncomfortable conclusion** the team needs to hear (this is what gets the postmortem talked about)\n\n## Guiding Questions\n\n- \"Off-peak migration\" is a runbook rule that wasn't enforced. Is the fix more rules, or automated enforcement (CI gate that rejects migrations during traffic windows)?\n- The BI query was a 9-month timebomb. Whose responsibility is it to find these — DBA, SRE, BI team, or the system itself (workload-tracking tooling)?\n- Rollback didn't help — should the rollback playbook explicitly include \"consider DB-side issues before app rollback\"?\n- Postmortems are blameless, but the prior near-miss had an action item that lapsed. How do you write that without creating defensiveness?\n\n## Match Info\n\n**Case fits:** Site Reliability Engineer · DevOps Engineer · Platform Engineer · Backend Software Engineer · Cloud Infrastructure Engineer · Production Engineer\n**Primary tests:** root-cause analysis, blameless rigor, action-item prioritization\n**Industry fit:** e-commerce, fintech, B2B SaaS, any production-critical software"
  },
  {
    "id": "cs-60-data-pipeline",
    "title": "The Daily Revenue Dashboard Is Wrong: Trace the Pipeline",
    "cluster": "data_engineering",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Data Engineer",
      "Senior Data Engineer",
      "Analytics Engineer",
      "ETL / Data Platform Engineer",
      "Software Engineer (Data, Backend)",
      "BI Engineer"
    ],
    "matchesFields": [
      "Engineering",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Consumer",
      "Industrial"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Pipeline diagnosis",
      "Data-quality reasoning",
      "SQL / dbt / orchestration intuition",
      "Communication with non-technical stakeholders"
    ],
    "companyName": "Klemmer Logistics",
    "logoUrl": "/company-logos/cs-60-data-pipeline.png",
    "body": "<img src=\"logos/cs-60-data-pipeline.png\" alt=\"Klemmer Logistics logo\" width=\"120\" align=\"right\" />\n\n# The Daily Revenue Dashboard Is Wrong: Trace the Pipeline\n\n## Context\n\n**Klemmer Logistics** is a mid-market freight-forwarder (€280M revenue, 14 countries). The CFO opens the daily revenue dashboard every morning at 7:00. This morning he saw **revenue down 23% week-over-week** — and called the data team in panic. By 8:30 it was clear: the number is wrong. The actual revenue is fine. The dashboard is broken.\n\nYou inherit the investigation. The CFO wants to know two things by EOD: (1) what's wrong, (2) when can he trust the dashboard again.\n\n## Your Role\n\nYou are a **Data Engineer** on a 4-person data team. You own the revenue pipeline from the operational ERP into the warehouse and into Looker.\n\n## Situation — The Pipeline\n\n```\nERP (Postgres, on-prem) \n  → Fivetran (every 4h) \n  → Snowflake (raw schema)\n  → dbt models (90 min run, hourly)\n  → marts.fact_revenue\n  → Looker dashboard\n```\n\n**What you've checked so far:**\n\n- ✅ ERP source data: revenue from yesterday matches what finance sees in the operational system. **Source is fine.**\n- ✅ Fivetran sync: green, last sync 04:12 UTC, no errors\n- ❓ Snowflake `raw.invoices` table: row count looks plausible but you haven't compared totals\n- ❓ dbt models: latest run completed at 06:34, all green, no test failures\n- ❓ Looker explore: numbers as shown to CFO\n\n**Recent changes (last 7 days):**\n1. dbt model `int_invoice_lines` was refactored 3 days ago to \"improve performance\" — added a `WHERE invoice_status NOT IN ('void','draft')` filter\n2. New currency-conversion table (`stg_fx_rates`) was added 5 days ago — uses ECB daily rates\n3. A junior analyst added a column to the Looker view yesterday: `revenue_excluding_intercompany`\n4. Snowflake warehouse was resized (XS → S) 2 days ago\n\n**Helpful facts:**\n- The dashboard shows **€2.1M for yesterday**. Finance's operational total is **€2.74M**.\n- The gap (€640k, ~23%) is suspiciously close to \"intercompany invoices\" volume per day (~€600-700k)\n- dbt tests pass. There's no test specifically for week-over-week deltas\n- The freshness check on `raw.invoices` says \"fresh as of 04:12\" — but only checks max(invoice_date), not row count\n\n## Your Task\n\nIn 45 minutes — investigation memo (1 page):\n\n1. **Top hypothesis** for the broken number, with the SQL/check that would confirm it in 5 minutes\n2. **Backup hypotheses** (2-3 ranked) in case the top one isn't right\n3. **Immediate fix** vs. **proper fix**: what do you push tonight, what waits for review?\n4. **Dashboard trust restoration**: how do you communicate to the CFO when he can trust the dashboard again — today, tomorrow, or with caveats?\n5. **Tests / monitors to add** so this exact failure mode is caught before the CFO sees it. List 3.\n6. **Process change**: which of the 4 recent changes would you have caught with better review/testing? What changes do you propose?\n\n## Guiding Questions\n\n- The €640k gap matching intercompany volume is a strong signal. Is it the new dbt filter, the FX table, or the Looker view change? How do you prove which one?\n- dbt tests passed — what kind of tests would have caught this? (Row-count, equality checks, anomaly detection on totals?)\n- \"Improve performance\" by adding a filter is a classic silent-correctness break. How do you create a culture where reviewers catch this?\n- The CFO is non-technical and now distrusts the dashboard. How do you rebuild trust without overpromising?\n\n## Match Info\n\n**Case fits:** Data Engineer · Senior Data Engineer · Analytics Engineer · ETL / Data Platform Engineer · BI Engineer · Backend Engineer (data-leaning)\n**Primary tests:** pipeline diagnosis, dbt/SQL intuition, stakeholder communication\n**Industry fit:** logistics, e-commerce, fintech, any company with a CFO-facing dashboard"
  },
  {
    "id": "cs-61-ux-writing-design-system",
    "title": "Five Products, Five Voices: Unify Without Flattening",
    "cluster": "ux_writing_design_systems",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "UX Writer",
      "Content Designer",
      "Visual Designer",
      "Design Systems Designer",
      "Brand Designer",
      "Senior Product Designer (systems-leaning)"
    ],
    "matchesFields": [
      "Design",
      "Marketing",
      "Product"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "creator",
    "skillsTested": [
      "Voice & tone systematization",
      "Design-system trade-offs",
      "Cross-team adoption",
      "Standards vs. creativity balance"
    ],
    "companyName": "Carmel Group",
    "logoUrl": "/company-logos/cs-61-ux-writing-design-system.png",
    "body": "<img src=\"logos/cs-61-ux-writing-design-system.png\" alt=\"Carmel Group logo\" width=\"120\" align=\"right\" />\n\n# Five Products, Five Voices: Unify Without Flattening\n\n## Context\n\n**Carmel Group** is a fintech holding company with five sub-brands: a retail trading app (irreverent, gen-Z), a wealth-management platform (calm, advisor-led), a B2B treasury product (technical, dense), a retirement-savings app (warm, reassuring), and a crypto sub-product (energetic, edgy). All five share an internal design system maintained by a 3-person team.\n\nToday, every sub-brand writes UX copy and designs its own screens with **wildly inconsistent results**. Error states alone have 14 different patterns across products. The CMO wants \"one voice across Carmel\"; product teams say \"we'd lose our personality.\" A new product launches in 4 months that needs to fit somewhere in this mess.\n\n## Your Role\n\nYou are a **UX Writer / Content Designer** (4 years) recently moved into the design-systems team to lead voice & tone strategy. You have one Design Systems Designer (visual side) as a partner.\n\n## Situation\n\n**What you've audited (90 screens across 5 products):**\n\n| Pattern | Inconsistency examples |\n|---|---|\n| Error: invalid input | \"Invalid input\" / \"Hmm, that didn't work\" / \"Error: Field validation failed\" / \"Looks like a typo!\" |\n| Confirmation modal | 3 button-label patterns (Confirm/Cancel, Yes/No, Delete/Keep), 2 tones |\n| Empty states | Trading app uses jokes; retirement app uses encouragement; treasury app shows nothing |\n| Currency formatting | 4 different patterns (€1,234.56 vs. EUR 1234.56 vs. €1.234,56 etc.) |\n| Form-level success | Toast / modal / inline / silent — pick one? |\n\n**Stakeholder positions:**\n\n- **CMO**: \"Customers should feel like they're using one Carmel.\"\n- **Trading-app PM**: \"Our entire brand is irreverent. If you make us write 'An error has occurred' instead of 'Oof — that didn't work', we lose the gen-Z audience.\"\n- **Wealth platform Head of Product**: \"Our customers are 55+ and worth €2M+. Jokes in error states would torpedo trust.\"\n- **Treasury BU lead**: \"Our users are CFOs. Brevity and accuracy. We don't need 'voice'.\"\n- **Crypto product GM**: \"Compliance is breathing down our necks already. We want clear, fast disclaimers.\"\n- **Engineering**: \"I just need to know which copy string to call. Stop changing them.\"\n\n**Constraints:**\n- Design-system team has 3 people total\n- 4 months until new product launch\n- No budget for external brand-strategy agency\n- Engineering teams adopt design-system updates voluntarily; rollout takes ~6 months\n\n## Your Task\n\nStrategy memo + first artifacts (1.5 pages):\n\n1. **Framework**: a clear voice-and-tone model that allows brand differentiation while ensuring consistency. (Tip: think about which dimensions stay constant vs. which flex per product.)\n2. **The 5 patterns to fix first** — which inconsistencies are non-negotiable (consistency wins) vs. flexible (brand wins)?\n3. **Component-level proposal**: how does the design system encode this — through shared components, through copy variables, through guidelines? Concrete.\n4. **Adoption plan**: how do you go from \"guidelines published\" to \"actually used by 5 product teams\" in 4 months?\n5. **Conflict-resolution rule**: when the trading PM and the wealth Head disagree, who decides?\n6. **Success metrics** at 4 months and 12 months\n\n## Guiding Questions\n\n- \"One voice\" vs. \"five voices\" is a false choice — what's the right granularity? (One vocabulary, five tones? Shared safety-critical copy, free creative copy? Some other split?)\n- Engineering teams adopt voluntarily and rollout takes 6 months. Do you fight to mandate it, or design the system so teams *want* to adopt it?\n- The CMO and the trading PM are both going to feel partially un-heard. Which battles do you fight, which do you concede?\n- Currency formatting is technically a localization issue, but it's surfaced as \"voice.\" How do you split design-system territory from i18n team territory?\n\n## Match Info\n\n**Case fits:** UX Writer · Content Designer · Visual Designer · Design Systems Designer · Brand Designer · Senior Product Designer\n**Primary tests:** voice & tone systematization, cross-team adoption, design-system thinking\n**Industry fit:** multi-brand fintech, large product orgs, agencies, holding-company design teams"
  },
  {
    "id": "cs-62-sdr-pipeline",
    "title": "Inbound Pipeline Down 40%: Rebuild the SDR Motion in 6 Weeks",
    "cluster": "sales_development",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Sales Development Representative",
      "Senior SDR / SDR Lead",
      "Account Executive (SMB)",
      "Account Executive (Mid-Market)",
      "Technical Account Manager",
      "Business Development Representative"
    ],
    "matchesFields": [
      "Sales",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "SDR funnel diagnosis",
      "Outbound vs. inbound balance",
      "Tooling & process design",
      "Quota and territory thinking"
    ],
    "companyName": "Threadly",
    "logoUrl": "/company-logos/cs-62-sdr-pipeline.png",
    "body": "<img src=\"logos/cs-62-sdr-pipeline.png\" alt=\"Threadly logo\" width=\"120\" align=\"right\" />\n\n# Inbound Pipeline Down 40%: Rebuild the SDR Motion in 6 Weeks\n\n## Context\n\n**Threadly** is a B2B HR SaaS (€18M ARR, ~600 SMB and mid-market customers). Inbound MQLs were the engine: ~480/month converting to ~95 SQLs and ~22 closed-won. **In Q1, MQLs dropped to 290/month** and the SDR team's connect rate also slipped. Pipeline is now ~€1.1M short of the H1 target.\n\nThe new VP Sales (you report to her) has given you 6 weeks to rebuild the SDR motion. You have 7 SDRs (3 senior, 4 ramping), an AE team of 9 (split SMB and mid-market), and a marketing team that's also under pressure.\n\n## Your Role\n\nYou are the **SDR Lead** (promoted 4 months ago from Senior SDR). You own outbound motion, inbound speed-to-lead, hand-off to AE, and tooling.\n\n## Situation\n\n**Last 4 weeks of data:**\n\n| Metric | 4 weeks ago | This week |\n|---|---|---|\n| MQLs received | 110/wk | 72/wk |\n| MQL-to-call-booked rate | 18% | 11% |\n| Outbound call-booked rate | 5.2% | 3.1% |\n| AE-accepted SQLs | 19/wk | 9/wk |\n| Speed-to-lead (median) | 7 min | 23 min |\n| SDR daily activities (median) | 78 | 52 |\n\n**What you know:**\n\n- The marketing team paused 2 high-volume paid channels (cost-per-MQL exploded)\n- 2 senior SDRs left in the last quarter; 4 hires ramping unevenly (1 strong, 2 OK, 1 struggling)\n- The new outbound sequence the previous lead deployed has open rates of 19% (industry: 32%) — copy looks generic\n- AEs have started rejecting SDR-booked meetings: \"low-quality, not in ICP\" — 23% reject rate (was 8%)\n- The CRM lead-routing rule was changed 3 weeks ago; some leads now sit unassigned for hours\n- Your SDR enablement was last refreshed 14 months ago\n\n**Resources:**\n- 6 weeks\n- Budget: €25k (tooling, training, contractors)\n- Marketing will help with content if you ask, but they're slammed\n- You have 1-on-1 weekly with each SDR; can change cadence\n\n**Pressure:**\n- VP Sales says: \"I need predictable pipeline by end of Q2 or we have a real problem\"\n- AE team is frustrated; some have started prospecting themselves and complaining about it\n- The CFO has frozen new SDR hires until pipeline recovers\n\n## Your Task\n\n6-week recovery plan (1.5 pages):\n\n1. **Diagnosis**: of the 6 issues above, which 2-3 are the highest-leverage to fix first? Why those?\n2. **Week-1 actions**: what changes do you ship in the first 5 working days? (Speed-to-lead, routing, hot-fix to outbound copy, etc.)\n3. **Outbound rebuild**: how do you fix open rates from 19% → industry-typical? Concrete steps (segmentation, sequence rewrite, persona research, A/B testing)\n4. **Quality vs. quantity**: AE reject rate is up. Do you tighten qualification criteria (lower volume, higher quality) or push volume? How do you decide?\n5. **People plan**: which SDRs do you invest in, which do you coach harder, and (if needed) what do you do about the struggling new hire?\n6. **Reporting cadence**: which 4 metrics do you commit to weekly with VP Sales? Which leading indicators tell you in 2 weeks if your plan is working?\n\n## Guiding Questions\n\n- The MQL drop is upstream of you (marketing). Your levers are conversion + outbound. How do you not get blamed for the part you don't control while still being accountable for outcomes?\n- AE reject rate is a signal of quality breakdown — but tightening too far could mean SDRs miss their meeting quotas. Where's the line?\n- Speed-to-lead jumped from 7 min to 23 min. Is that a routing problem, a capacity problem, or a discipline problem? Different fixes.\n- 6 weeks is short. What do you NOT do (e.g., a full sequence A/B test takes 6 weeks alone)?\n\n## Match Info\n\n**Case fits:** SDR · SDR Lead · Senior SDR · AE (SMB) · AE (Mid-Market) · Technical Account Manager · BDR\n**Primary tests:** funnel diagnosis, outbound rebuild, AE-SDR alignment\n**Industry fit:** B2B SaaS, services with sales motion, vertical SaaS"
  },
  {
    "id": "cs-63-revops-forecast",
    "title": "Forecast Misses 3 Quarters Running: Diagnose Before the Board Meeting",
    "cluster": "revenue_operations",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Revenue Operations Analyst",
      "Sales Operations Analyst",
      "Business Operations Analyst",
      "Strategy & Operations Associate",
      "Program Manager (commercial)",
      "Chief of Staff (junior, commercial)"
    ],
    "matchesFields": [
      "Operations",
      "Sales",
      "Finance",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Forecast methodology",
      "CRM data hygiene",
      "Cross-functional diagnosis",
      "Numerate storytelling"
    ],
    "companyName": "Vendolux",
    "logoUrl": "/company-logos/cs-63-revops-forecast.png",
    "body": "<img src=\"logos/cs-63-revops-forecast.png\" alt=\"Vendolux logo\" width=\"120\" align=\"right\" />\n\n# Forecast Misses 3 Quarters Running: Diagnose Before the Board Meeting\n\n## Context\n\n**Vendolux** is a B2B procurement platform (€44M ARR, 220 customers). For three consecutive quarters, the forecast committed to the board has missed by 12-18%. The board meeting is in **9 days**. The CRO has asked you to (1) diagnose why the forecast keeps missing, (2) propose a new forecasting approach, (3) deliver it as part of her board update.\n\n## Your Role\n\nYou are a **Senior Revenue Operations Analyst** (3rd year). You report to the VP RevOps but were tapped directly by the CRO for this project. You have access to Salesforce, the data warehouse, and 1:1 time with sales leaders.\n\n## Situation\n\n**Forecast history (committed vs. actual, in €M):**\n\n| Quarter | Committed | Actual | Miss |\n|---|---|---|---|\n| Q3 last year | 11.0 | 9.6 | -13% |\n| Q4 last year | 13.5 | 11.2 | -17% |\n| Q1 this year | 12.0 | 10.5 | -13% |\n\n**How forecast is built today:**\n- Each AE submits a \"commit\" + \"best case\" each Friday in a spreadsheet\n- Sales Manager rolls up; cuts ~10% off \"best case\", keeps \"commit\" as-is\n- VP Sales rolls up regional managers; presents to CRO Monday morning\n- CRO submits to CFO/board\n\n**Diagnostic data you've pulled:**\n\n1. **Stage-progression data**: deals labeled \"Closing this quarter\" actually close-won at **48%** (the AEs assume ~70%)\n2. **Slippage**: in the last 3 quarters, 31% of deals labeled \"commit\" slipped to next quarter (or beyond)\n3. **CRM hygiene**: 22% of \"commit\" deals had no activity logged in the last 21 days; 18% had close dates that had already passed\n4. **Persona analysis**: Mid-market AEs miss commit by an avg of 19%; Enterprise AEs miss by avg 8% — but Enterprise has only 4 AEs and small N\n5. **Conversion rates by stage** are consistent over 3 years for stages 1-4, but stage 5 (\"Negotiation\") win-rate dropped from 72% to 51% in the last 12 months — nobody noticed\n6. The CRO's regional managers consistently submit numbers they call \"comfortable\" — code for: padded down then padded back up\n7. Multi-product deals are being counted at full ARR even when only 1 module is signed\n\n**Stakeholders:**\n- **CRO**: wants a number she can defend at the board. Open to method changes but doesn't want a number that's \"embarrassingly low\"\n- **VP Sales**: defensive. Sees forecasting as \"art, not science.\" Has been at the company 6 years.\n- **CFO**: leaning toward \"just take the AE commits, multiply by 0.65, done\"\n- **2 AEs you talked to**: candid that they label deals \"commit\" because their manager pushes for it, not because they believe it\n\n## Your Task\n\nMemo for the CRO (1.5–2 pages) + a recommendation:\n\n1. **Why does the forecast keep missing?** Distinguish methodology issues vs. data issues vs. behavioral/culture issues.\n2. **Proposed forecasting model**: what method do you recommend (top-down, bottom-up, weighted-stage, ML-assisted, blended)? Be specific.\n3. **What you commit for next quarter**: a number, plus how confident you are (range, not point if appropriate)\n4. **CRM hygiene & process changes**: what changes do you push live in the next 30 days?\n5. **Stage-5 deterioration**: this is buried but it's the biggest red flag — how do you investigate, and who needs to see this finding?\n6. **Board narrative**: how should the CRO frame \"we missed 3 quarters\" without losing credibility? What does she lead with?\n\n## Guiding Questions\n\n- \"Multiply commits by 0.65\" (CFO's idea) might *technically* work, but it kills any incentive for AEs to commit honestly. What's a better behavioral design?\n- The Stage-5 win-rate dropping from 72% to 51% is huge and unrelated to forecasting methodology. Is that a competitive issue? Pricing? A specific product? Push to find out before the board meeting, or flag and defer?\n- VP Sales has been there 6 years and views forecasting as \"art.\" Do you fight that battle now, or work around her, or get the CRO to fight it?\n- The board cares about predictability more than the absolute number. How does that shape what you recommend?\n\n## Match Info\n\n**Case fits:** Revenue Operations Analyst · Sales Operations Analyst · Business Operations Analyst · Strategy & Operations Associate · Program Manager (commercial) · Chief of Staff (commercial)\n**Primary tests:** forecast methodology, CRM diagnosis, cross-functional storytelling\n**Industry fit:** B2B SaaS, professional services, any company with a commit/best-case forecast culture"
  },
  {
    "id": "cs-64-seo-recovery",
    "title": "Organic Traffic Down 38%: Was It the Algorithm, the Migration, or the Content?",
    "cluster": "seo_organic_growth",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "SEO Specialist",
      "Senior SEO Manager",
      "Content Marketer (SEO-leaning)",
      "Growth Marketer (organic)",
      "Digital Marketing Associate",
      "Technical SEO Analyst"
    ],
    "matchesFields": [
      "Marketing",
      "Engineering",
      "Data"
    ],
    "matchesIndustries": [
      "Tech",
      "Consumer",
      "Media",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Multi-cause attribution",
      "Technical + content SEO",
      "Recovery prioritization",
      "Stakeholder communication"
    ],
    "companyName": "Beanstalk",
    "logoUrl": "/company-logos/cs-64-seo-recovery.png",
    "body": "<img src=\"logos/cs-64-seo-recovery.png\" alt=\"Beanstalk logo\" width=\"120\" align=\"right\" />\n\n# Organic Traffic Down 38%: Was It the Algorithm, the Migration, or the Content?\n\n## Context\n\n**Beanstalk** is a meal-kit comparison site (€11M revenue, mostly affiliate commissions, ~2.4M monthly organic sessions historically). Over the last 9 weeks, **organic traffic has dropped 38%**. The CMO is panicking; affiliate revenue is down ~€140k/month and the runway math is suddenly tight.\n\nThree things happened in roughly the same window:\n1. A site migration (CMS replatform) 11 weeks ago\n2. A Google \"core update\" that rolled out 7 weeks ago\n3. Content team launched 40 new \"best-of\" comparison pages 6 weeks ago (heavy AI assistance)\n\nYou've been asked to diagnose what happened and rebuild within 8 weeks.\n\n## Your Role\n\nYou are an **SEO Specialist** (4 years) brought in 2 weeks ago. You have one technical SEO analyst (part-time), one content marketer, and access to engineering for fixes (limited bandwidth).\n\n## Situation — Diagnostic Data\n\n**Traffic by page type (vs. 12 weeks ago):**\n\n| Page type | Sessions Δ | Notes |\n|---|---|---|\n| Comparison (\"X vs Y\") | -52% | The bread-and-butter |\n| Reviews (\"Best HelloFresh alternative\") | -29% | |\n| Recipe pages | -8% | Roughly stable |\n| Brand pages (\"HelloFresh\") | -41% | |\n| New \"best-of\" pages (post AI launch) | n/a — these are new, mostly not ranking | |\n\n**Search Console signals:**\n- Crawl rate dropped 40% the week of migration; recovered 60% but not fully\n- 312 pages now return 404 that used to be 200 (legacy URLs from old CMS, no redirects)\n- 1,400 pages have \"Discovered – currently not indexed\" status (most are the new AI-assisted pages)\n- Core Web Vitals: LCP went from 2.1s → 4.3s after migration (mobile)\n\n**Backlink profile:**\n- Total referring domains stable, but ~180 backlinks now point to 404s\n- No spike in toxic links\n- Lost 4 high-authority editorial mentions (likely unrelated, but worth noting)\n\n**Competitive context:**\n- The 2 main competitors gained share during the same window (one of them up ~22%)\n- The Google core update specifically targeted \"low-value affiliate content\" per industry chatter\n- Several Reddit threads in the niche are now ranking on page 1 (UGC ascendance)\n\n**Internal context:**\n- The CMS migration was led by engineering with light SEO involvement\n- Content team is proud of the 40 new pages but you've spot-read 5: thin, generic, clearly templated\n- Brand mentions are rising on social media; brand search volume is *up* slightly\n\n## Your Task\n\nRecovery plan (1.5 pages):\n\n1. **Cause attribution**: of the -38%, how do you split the blame across the 3 candidates (migration, algo, content) and any 4th cause? Use the data to argue.\n2. **Top-3 fixes for next 2 weeks**: highest-impact, fastest-to-execute\n3. **Content strategy**: what do you do with the 40 AI-assisted pages? Improve, depublish, or noindex?\n4. **Technical SEO checklist** for the migration mess (redirects, indexation, Core Web Vitals)\n5. **Recovery forecast**: how much traffic do you expect to recover, by when? Be honest about what's recoverable vs. permanently lost (algo signals don't roll back).\n6. **Reporting cadence**: what does the CMO see weekly? Which 4 metrics?\n\n## Guiding Questions\n\n- 312 pages dropped to 404 with no redirects is gross negligence on the migration — but it's also probably the easiest \"first 10% recovery\" to get back. Do you fix all 312 or only the high-traffic ones first?\n- AI-assisted thin content during a \"low-value affiliate content\" core-update window is the worst-possible timing. Is the right move to bulk-noindex them, or to invest in rewriting?\n- Reddit and UGC are eating SERPs. Is the answer to compete with editorial depth, or to also place content on Reddit/forums?\n- The CMO wants a recovery story to tell the board. How honest are you about how much is permanently lost?\n\n## Match Info\n\n**Case fits:** SEO Specialist · Senior SEO Manager · Content Marketer (SEO-leaning) · Growth Marketer (organic) · Technical SEO Analyst · Digital Marketing Associate\n**Primary tests:** multi-cause attribution, technical + content SEO, recovery prioritization\n**Industry fit:** affiliate sites, e-commerce, publishing, content-heavy SaaS"
  },
  {
    "id": "cs-65-chief-of-staff",
    "title": "The CEO Has 11 Days Until the All-Hands — and No Coherent Story",
    "cluster": "chief_of_staff",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Chief of Staff (junior)",
      "Executive Assistant (senior / strategic)",
      "Internal Communications Associate",
      "Talent Acquisition Coordinator",
      "Business Operations Analyst",
      "Strategy & Operations Associate",
      "Program Manager (executive office)"
    ],
    "matchesFields": [
      "Operations",
      "Marketing",
      "Customer"
    ],
    "matchesIndustries": [
      "Tech",
      "Services",
      "Finance"
    ],
    "matchesMode": "coordinator",
    "matchesOutput": "enabler",
    "skillsTested": [
      "Executive synthesis",
      "Cross-functional coordination",
      "Internal narrative",
      "Prioritization under ambiguity"
    ],
    "companyName": "Talloo",
    "logoUrl": "/company-logos/cs-65-chief-of-staff.png",
    "body": "<img src=\"logos/cs-65-chief-of-staff.png\" alt=\"Talloo logo\" width=\"120\" align=\"right\" />\n\n# The CEO Has 11 Days Until the All-Hands — and No Coherent Story\n\n## Context\n\n**Talloo** is a Series-C HR-tech company (520 employees, €72M ARR, 3 product lines). The CEO holds a **company all-hands every 6 weeks**. The next one is in 11 days. The last all-hands was awkward — engagement scores dipped afterward and three senior engineers asked their managers about \"where the company is going.\"\n\nInternal context: layoffs were rumored two months ago (denied by leadership but Glassdoor reviews are bruising); a key product missed its launch date; the CEO has been more absent than usual due to a fundraise (closed last week — extension round, not the up-round people were hoping for).\n\nThe CEO calls you this morning: \"I need you to help me figure out what I'm saying. I want it to land — really land. Get me a draft and a plan.\"\n\n## Your Role\n\nYou are **Chief of Staff** to the CEO (1.5 years in role). You have access to all executive metrics, exec calendars, and most internal Slack channels. You're trusted but not feared.\n\n## Situation\n\n**What you know about the audience (520 employees):**\n- Engineering and Product (240): worried about the launch slip, frustrated by org-design changes\n- Sales (90): hit Q1 hard, feeling proud and slightly cocky\n- CS & Support (75): under-resourced, vocal about it\n- G&A and Ops (80): nervous about cost-cutting after the smaller round\n- Newer joiners (~80, joined in last 6 months): no historical context\n\n**What you can pull together in 11 days:**\n- Updated metrics dashboard (the data team can prep in 3 days)\n- Customer-quote highlight reel (CS team has a system; ~2 days)\n- Funding-round details (legally cleared after Friday)\n- Roadmap commitments (need to align with CPO)\n- Org-changes summary (HR has the data, sensitivity is high)\n\n**What's NOT working in past all-hands:**\n- 70-slide decks; CEO reads each slide\n- 30 minutes of \"wins\" that everyone already knows\n- 5-minute Q&A at the end where only the same 3 senior folks ask\n- Recordings rarely watched after-the-fact\n\n**The CEO's instinct (from the call this morning):**\n- \"I want to address the rumors head-on but not validate them\"\n- \"I want people to feel like we're winning\"\n- \"I want to commit to fewer things but mean them more\"\n\n**Pressure:**\n- HR head is pushing to NOT mention specific layoffs (legal risk if interpreted as commitment)\n- CFO wants the CEO to telegraph cost discipline\n- CPO wants to defend the launch slip with technical context\n- Sales head wants 5 minutes of recognition\n\n## Your Task\n\nCoS plan + draft (1.5 pages):\n\n1. **The narrative arc** — one sentence: what is the CEO trying to make people feel and remember? (If you can't say it in one sentence, the all-hands won't land.)\n2. **Structure**: a 30-minute talk + Q&A. Section by section, what's in/out and why.\n3. **The hard parts**: how does the CEO address the rumored layoffs, the launch slip, and the smaller round honestly without panicking people?\n4. **Prep plan** for the 11 days: what do you need from CPO, CFO, HR, data team, and by when?\n5. **Q&A engineering**: how do you go from \"same 3 people ask softball questions\" to genuine engagement? (Slido, anonymous Qs, prompted leadership Qs?)\n6. **Follow-up**: what happens in the 7 days after the all-hands so the message doesn't dissipate?\n\n## Guiding Questions\n\n- \"Address rumors but don't validate them\" is the hardest balance — what's a concrete way the CEO can name the elephant without confirming it as fact?\n- The CFO wants cost-discipline messaging; the engineering audience reads that as \"more layoffs coming.\" How does the CEO handle that tension?\n- 11 days is short. What do you NOT prep (perfection traps) so the CEO has time to actually rehearse?\n- A great all-hands is forgettable in 7 days unless it's reinforced. What's the post-event drumbeat?\n\n## Match Info\n\n**Case fits:** Chief of Staff · Senior Executive Assistant · Internal Communications · Strategy & Operations Associate · Business Operations Analyst · Program Manager\n**Primary tests:** executive synthesis, cross-functional coordination, internal narrative\n**Industry fit:** any company 200+ headcount, scale-ups, post-funding-round transitions"
  },
  {
    "id": "cs-66-vc-investment-memo",
    "title": "Series A Memo: Recommend or Pass on a Vertical AI Company?",
    "cluster": "venture_capital",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Venture Capital Analyst",
      "VC Associate",
      "Associate (investment team)",
      "Portfolio Operations Analyst",
      "Platform / Community Associate",
      "Crypto / Digital Assets Analyst",
      "Investment Analyst (early-stage)"
    ],
    "matchesFields": [
      "Finance",
      "Research",
      "Product"
    ],
    "matchesIndustries": [
      "Finance",
      "Tech",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Diligence framing",
      "Founder/team assessment",
      "Market sizing & defensibility",
      "Risk identification"
    ],
    "companyName": "Aldera Capital",
    "logoUrl": "/company-logos/cs-66-vc-investment-memo.png",
    "body": "<img src=\"logos/cs-66-vc-investment-memo.png\" alt=\"Aldera Capital logo\" width=\"120\" align=\"right\" />\n\n# Series A Memo: Recommend or Pass on a Vertical AI Company?\n\n## Context\n\nYou work at **Aldera Capital** (€450M AUM, generalist European VC, sweet-spot Series A/B). The partner you support has been tracking **PrintRoute** — a 14-month-old startup building an AI workflow tool for commercial printing companies (B2B vertical SaaS + AI). Founders are pushing for term sheets in 10 days. They've seen interest from two other funds.\n\nRound: **€8M Series A**, post-money €40M. Partner wants your investment recommendation with a clear yes/no by Thursday's IC meeting.\n\n## Your Role\n\nYou are a **VC Analyst** (2nd year), primary diligence lead. You've had two calls with the founders, talked to 4 customers, and built a draft model.\n\n## Situation — What You Know\n\n**The company:**\n- 2 co-founders: CEO (ex-product lead at a horizontal SaaS scaleup, no print-industry background), CTO (ex-Google, ML engineer, technical depth genuine but no domain experience)\n- Team: 12 people, 6 engineers, 2 sales, 1 marketer, 3 ops\n- Product: workflow automation that ingests print-job specs, recommends optimal press scheduling, automates quality checks via vision AI\n- Built for commercial printers (€2-50M revenue range)\n\n**Traction:**\n- 14 paying customers, average ACV €38k\n- ARR ~€530k, growing 18% MoM last 4 months\n- Net retention so far: 100% (small N — 14 customers, 9 months oldest)\n- 2 customers signed in last 6 weeks at €70k+ ACV (upsell motion working)\n\n**Market:**\n- Commercial printing in Europe: estimated 14,000 SMB printers, plus ~600 mid-market\n- Industry has been declining 2-3%/year in volume but consolidating; survivors are profitable\n- Existing software vendors are old (3 large incumbents, average product age 18 years)\n- TAM math (founder's deck): 14,600 × €40k = €584M. Realistic capture: founders project €100M ARR by year 7\n\n**Competitive context:**\n- 1 other startup in adjacent space (workflow only, no AI), raised €4M last year, slower growth\n- Incumbents have aggressive maintenance contracts but slow product cycles\n- 2 of the customers you spoke with said: \"if these guys go away, we go back to spreadsheets\"\n\n**Customer reference calls (your notes):**\n- Customer A (60-person printer): \"Saved us €120k/year in scheduling waste. Can't imagine going back.\"\n- Customer B (12-person printer): \"Game-changer for us, but our CFO finds the price aggressive.\"\n- Customer C (mid-market, just signed): \"We're optimistic but it's been only 6 weeks; too early to say.\"\n- Customer D (cancelled 4 months ago): \"Founders were great, product wasn't ready for our complexity.\"\n\n**Risks/yellow flags you've identified:**\n- No founder has print-industry background — asked them why; answer was \"we hired our VP Sales from the industry\" (he started 3 weeks ago)\n- Burn rate €280k/month against ~€530k ARR — runway after this round ~24 months\n- 1 senior engineer left 6 weeks ago, hasn't been replaced\n- Heavy reliance on OpenAI for the vision pipeline — €18k/month cost, growing\n- Industry decline could mean addressable market shrinks faster than they capture it\n- The two competing termsheets are reportedly from a horizontal SaaS investor and a tier-2 fund\n\n**Aldera's internal view (partner's lean):**\n- Likes the team's technical caliber\n- Worried about \"vertical knowledge gap\"\n- Says \"if I had to bet, I'd say 60-40 lean yes\"\n\n## Your Task\n\nInvestment memo (1.5–2 pages):\n\n1. **One-paragraph thesis**: in 4 sentences, why we invest (or don't)\n2. **Top-3 reasons to invest**: ranked\n3. **Top-3 risks**: ranked, with mitigants for each\n4. **Your recommendation**: Yes / No / Yes-conditional. Be explicit.\n5. **Diligence gaps** still open (what would you want to validate in the next 10 days?)\n6. **If Yes**: what's the right ownership %, board seat ask, key terms?\n7. **If No**: what would change your mind in the next 12 months?\n\n## Guiding Questions\n\n- The \"founders without industry background\" is the most common red flag in vertical AI/SaaS. What's the bar — must they have it, or is \"hired a VP Sales from the industry\" enough?\n- 18% MoM is fast, but on €530k ARR that's a small base. At what ARR would the growth rate matter more for your conviction?\n- Customer D (\"not ready for our complexity\") and Customer B (\"price aggressive\") are diligence flags. Are they noise or signal?\n- Two competing termsheets create urgency. How do you separate \"real founder leverage\" from \"fund pressure\"?\n\n## Match Info\n\n**Case fits:** VC Analyst · VC Associate · Investment Associate · Portfolio Operations Analyst · Platform / Community Associate · Crypto / Digital Assets Analyst · Investment Analyst (early-stage)\n**Primary tests:** diligence framing, market & team assessment, risk identification\n**Industry fit:** VC funds, growth equity, corporate venture, accelerators"
  },
  {
    "id": "cs-67-treasury-ir",
    "title": "Rate Hedge Decision: Lock In or Wait? Brief the CFO Before the Board",
    "cluster": "treasury_investor_relations",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Treasury Analyst",
      "Senior Treasury Analyst",
      "Investor Relations Associate",
      "Fixed Income Analyst",
      "Structured Finance Analyst",
      "Corporate Finance Manager",
      "Capital Markets Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Finance",
      "Industrial",
      "Consumer",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Hedging strategy",
      "Cash flow forecasting",
      "Investor communication",
      "Risk-return framing"
    ],
    "companyName": "Eldborg Industries",
    "logoUrl": "/company-logos/cs-67-treasury-ir.png",
    "body": "<img src=\"logos/cs-67-treasury-ir.png\" alt=\"Eldborg Industries logo\" width=\"120\" align=\"right\" />\n\n# Rate Hedge Decision: Lock In or Wait? Brief the CFO Before the Board\n\n## Context\n\n**Eldborg Industries** is a listed mid-cap industrial group (€1.6B revenue, listed on Stockholm exchange). The company carries **€520M of floating-rate debt** (3-month STIBOR-linked), the largest tranche of which (€280M) reprices in 6 months. The current STIBOR curve has fallen ~110bps from its peak, but volatility is high and central-bank guidance is mixed.\n\nThe CFO has asked you to brief her ahead of next week's board meeting. The board wants a recommendation on whether to **hedge** (interest-rate swap floating → fixed on the €280M) **now**, **partially**, or **wait**. This is also relevant for the Q1 IR call next month — analysts will ask.\n\n## Your Role\n\nYou are a **Senior Treasury Analyst** (4th year). You manage the cash and debt book day-to-day, work with two relationship banks on hedging, and partner with IR on quarterly disclosures.\n\n## Situation — Numbers and Context\n\n**Current debt structure:**\n\n| Tranche | Notional | Rate | Maturity |\n|---|---|---|---|\n| Term loan A | €280M | STIBOR + 175bps | reprices in 6 months, matures in 3 years |\n| Term loan B | €150M | STIBOR + 220bps | reprices quarterly, matures in 5 years |\n| RCF (drawn) | €90M | STIBOR + 140bps | revolving, 2 years |\n\n**Today's market:**\n- 3-month STIBOR: 3.42%\n- 3-year EUR-SEK swap (pay fixed, receive float, hedging the €280M-equivalent): **3.18% fixed**\n- 5-year swap: 3.06% fixed\n- Forward curve implies STIBOR ~2.65% in 12 months, ~2.40% in 24 months\n- Implied forward rate volatility is elevated; market disagreement is unusually wide\n\n**Internal cash-flow forecast:**\n- 2025 EBITDA forecast: €240M (consensus: €235M)\n- Free cash flow forecast: €110M\n- Interest expense at current floating rates: €31M\n- Interest expense if we hedge now at 3.18%: €30.5M (similar)\n- Interest expense if forward curve plays out: €23M\n- Interest expense if rates rise back 100bps from here: €36M\n\n**Stakeholder positions:**\n- **CFO**: leaning toward partial hedge (50-70%). Her instinct: \"we're paid to remove tail risk, not to take views\"\n- **CEO**: \"rates are clearly coming down, why would we lock in?\"\n- **Audit committee chair**: \"I want to see analysis, not gut feel\"\n- **One relationship bank**: pushing aggressively for full hedge (commission incentive)\n- **The other relationship bank**: more measured, mentions a callable structure that could blend protection + upside but is more expensive\n- **IR head**: equity analysts have started asking \"what's your sensitivity to rates\" — wants a clear answer for the call\n\n**Constraints:**\n- Hedging policy says we may hedge 50-100% of medium-term debt; current hedge ratio: 0%\n- Bank-syndicate covenants: net-leverage threshold gives ~80bps of headroom on rates\n- We are a \"value\" stock; analyst community penalizes earnings volatility\n\n## Your Task\n\nCFO briefing memo (1.5 pages):\n\n1. **Recommendation**: hedge now (and how much), wait, or callable structure. Be explicit.\n2. **Reasoning** in 4-5 bullets: the case for your recommendation, including what you think about the forward curve\n3. **Sensitivities**: 3 scenarios (rates fall as expected, rates flat, rates rise 100bps) — what's the P&L impact in each?\n4. **What you reject** and why (e.g., why not 100% hedge, why not 0%, why not callable)\n5. **IR talking points**: 2-3 sentences for the analyst call that explains the hedging decision in non-treasury language\n6. **Board narrative**: what's the one slide you'd put in the board pack?\n\n## Guiding Questions\n\n- Hedging removes downside but also locks in if rates fall. With the forward curve implying 100bps of cuts, hedging now feels like \"betting against the market.\" Is that right, or is it the wrong frame?\n- The CEO's \"rates are clearly coming down\" is a directional view; treasury's job isn't to hold views. How do you push back without disrespecting?\n- The callable structure is more flexible but more expensive. When is paying for optionality worth it?\n- Analysts will ask \"what's your rate sensitivity.\" What's the answer that's both honest and doesn't telegraph weakness?\n\n## Match Info\n\n**Case fits:** Treasury Analyst · Senior Treasury Analyst · Investor Relations Associate · Fixed Income Analyst · Structured Finance Analyst · Corporate Finance Manager · Capital Markets Analyst\n**Primary tests:** hedging strategy, scenario analysis, investor communication\n**Industry fit:** corporate treasury, IR teams, in-house finance, capital-markets advisory"
  },
  {
    "id": "cs-68-aml-fraud-ops",
    "title": "Alert Backlog at 3,200: Triage Strategy and SAR Decision",
    "cluster": "aml_fraud_compliance",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "AML / KYC Analyst",
      "Senior AML Analyst",
      "Fraud Operations Analyst",
      "Compliance Analyst (FinTech)",
      "Risk Analyst (Financial Crime)",
      "Transaction Monitoring Analyst",
      "Crypto Compliance Analyst"
    ],
    "matchesFields": [
      "Operations",
      "Finance",
      "Research"
    ],
    "matchesIndustries": [
      "Finance",
      "Tech"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Triage methodology",
      "SAR decision rigor",
      "Pattern recognition in transaction data",
      "Regulatory awareness"
    ],
    "companyName": "Vellum Pay",
    "logoUrl": "/company-logos/cs-68-aml-fraud-ops.png",
    "body": "<img src=\"logos/cs-68-aml-fraud-ops.png\" alt=\"Vellum Pay logo\" width=\"120\" align=\"right\" />\n\n# Alert Backlog at 3,200: Triage Strategy and SAR Decision\n\n## Context\n\n**Vellum Pay** is a fintech offering business banking to SMEs (€2.1B in monthly transaction volume, 78,000 business accounts, German banking license via partnership). The transaction-monitoring system has produced **3,200 unresolved alerts** in the last 8 weeks — usual backlog is ~400. Two recent product launches (international payments, multi-currency wallets) increased the false-positive rate dramatically.\n\nRegulators have asked for an update on the alert pipeline within **30 days**. Your team is 9 analysts plus 2 senior reviewers. You also have one specific case the senior reviewer has flagged to you that may be a **Suspicious Activity Report (SAR)** filing.\n\n## Your Role\n\nYou are a **Senior AML Analyst / Team Lead** (5 years total in the field, 18 months at Vellum). You report to the MLRO (Money Laundering Reporting Officer).\n\n## Situation — Two Things on Your Desk\n\n### Part A: The Backlog (3,200 alerts)\n\n**Alert breakdown:**\n\n| Alert type | Count | Historical false-positive rate |\n|---|---|---|\n| Threshold-breach (transaction > €10k from new account) | 1,180 | 92% false-positive |\n| Velocity (rapid transactions) | 720 | 88% false-positive |\n| Geography (transaction to higher-risk jurisdiction) | 540 | 71% false-positive |\n| Structuring patterns | 380 | 38% false-positive |\n| Multi-currency wallet activity (new rule) | 280 | unknown — new rule, not validated |\n| Politically Exposed Person (PEP) match | 100 | 24% false-positive |\n\n**Constraints:**\n- 9 analysts × 7 productive hours/day × 20 working days = ~1,260 analyst-hours\n- Average alert review time: 35 min (simple) to 2.5 hours (complex)\n- Regulator expects 30-day SLA on each alert (we're already past on ~600 alerts)\n- The MLRO can hire 2 contractors for 6 weeks via an agreement already in place (~€80k)\n\n### Part B: The Specific Case\n\nA senior reviewer has flagged this for your assessment:\n\n- Customer: a registered logistics company in Germany, 2 years on platform\n- Last 90 days: received **47 inbound transfers** from 3 EU corporate accounts totaling €2.4M, then transferred €2.35M to **one outbound counterparty** in Cyprus (a separate logistics company)\n- Pattern is consistent month-to-month\n- Customer's KYC says they invoice for trucking services\n- The senior reviewer's note: \"Could be legit consolidation. Could be layering. We need to decide.\"\n- Reaching out to the customer for documentation triggers tip-off rules — you cannot signal an investigation\n- Cyprus counterparty is registered, has a website, no obvious red flags but only 1 year of company history\n- Two of the 3 inbound senders share an ultimate beneficial owner\n\n## Your Task\n\nIn 45 minutes — split memo:\n\n**Part A — Backlog plan (1 page)**\n1. **Triage strategy**: which alert categories do you prioritize, deprioritize, or batch? How do you justify it to the regulator?\n2. **Resourcing**: do you bring in the 2 contractors? On which alert types?\n3. **The new \"multi-currency\" rule**: false-positive rate unknown. How do you validate it without ignoring its alerts?\n4. **Communication to the regulator**: a brief paragraph on what you're doing\n5. **Process change** to prevent the next backlog: 1-2 ideas\n\n**Part B — SAR decision (0.5 page)**\n6. **Your recommendation**: SAR, no SAR, or escalate-and-investigate-further. Be explicit.\n7. **Reasoning** in 3 bullets, including what specifically tips the decision\n\n## Guiding Questions\n\n- Threshold-breach alerts are 92% false-positive but they're 37% of your backlog. Is the right move to deprioritize them, or to fix the rule that generates them?\n- The 280 \"multi-currency wallet\" alerts have an unknown FP rate. Working through them validates the rule, but they take time. Is there a sample-and-extrapolate approach that's defensible to the regulator?\n- For the case in Part B: pattern looks like legitimate freight consolidation OR like layering. What's the distinguishing evidence you'd want before SAR-ing? What's the cost of a false negative vs. false positive?\n- Regulators reward conservatism but punish over-filing of SARs (signal-to-noise problem). Where's the line?\n\n## Match Info\n\n**Case fits:** AML/KYC Analyst · Senior AML Analyst · Fraud Operations Analyst · Compliance Analyst (FinTech) · Risk Analyst (Financial Crime) · Transaction Monitoring Analyst · Crypto Compliance Analyst\n**Primary tests:** triage methodology, SAR decision rigor, pattern recognition\n**Industry fit:** fintech, banks, payment providers, crypto exchanges, RegTech"
  },
  {
    "id": "cs-69-tech-cloud-consulting",
    "title": "Cloud Migration Stalled at 30%: Diagnose and Re-Plan a Bank's Transformation",
    "cluster": "technology_consulting",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Technology Consultant",
      "Cloud Consultant",
      "Data & AI Consultant",
      "Implementation Consultant",
      "Digital Transformation Analyst",
      "Senior Technology Consultant"
    ],
    "matchesFields": [
      "Engineering",
      "Operations",
      "Data"
    ],
    "matchesIndustries": [
      "Finance",
      "Tech",
      "Services",
      "Industrial"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Cloud strategy",
      "Stakeholder alignment",
      "Migration sequencing",
      "Cost vs. risk trade-offs"
    ],
    "companyName": "Drestbank",
    "logoUrl": "/company-logos/cs-69-tech-cloud-consulting.png",
    "body": "<img src=\"logos/cs-69-tech-cloud-consulting.png\" alt=\"Drestbank logo\" width=\"120\" align=\"right\" />\n\n# Cloud Migration Stalled at 30%: Diagnose and Re-Plan a Bank's Transformation\n\n## Context\n\n**Drestbank** is a regional German retail bank (€38B assets, 4,200 employees, ~120 branches). Two years ago, they committed to a 4-year **public-cloud migration** (target: AWS, with Azure for Microsoft-stack workloads). They're 24 months in. Plan said 60% of workloads should be cloud-native by now. **Reality: 30%, and momentum has stalled.**\n\nThe bank's transformation office hired your consulting firm 3 weeks ago. Your task: deliver a **re-plan** to the steering committee in 2 weeks. The CIO is internally embarrassed; the board is asking pointed questions; €72M of the €180M budget has been spent.\n\n## Your Role\n\nYou are a **Technology Consultant** (Senior Associate / Manager track, 4 years experience). You're embedded with a small team: 1 Manager (your lead), 1 Cloud Architect, and you. You own the diagnosis section and one workstream of the re-plan.\n\n## Situation — What You've Found\n\n**Workload status:**\n\n| Workload type | Plan: cloud by month 24 | Actual |\n|---|---|---|\n| New apps & APIs | 100% | 92% (good) |\n| Customer-facing web/mobile | 80% | 65% |\n| Core banking integration layer | 50% | 18% |\n| Mainframe-dependent apps | 30% | 4% |\n| Data analytics / risk | 70% | 40% |\n| Internal tools (HR, intranet) | 90% | 78% |\n\n**What you've learned in 3 weeks of interviews:**\n\n1. **Skills gap**: only ~12% of internal engineers are cloud-fluent; hiring has been slow because the bank is Frankfurt-based and not paying tech-market rates\n2. **Risk culture**: every cloud decision goes through 4 risk committees; an average migration takes 5 months from \"approved\" to \"in production\"\n3. **Vendor lock-in concern**: the legal team blocked native AWS services for 9 months over data-sovereignty fears; engineers built abstraction layers that slowed everything\n4. **FinOps**: cloud spend is currently €14M/year and rising; only 30% of workloads are tagged for cost attribution\n5. **Mainframe**: original plan assumed an early \"mainframe modernization\" workstream that was later descoped due to risk; that decision broke the migration sequencing\n6. **Mid-tier integrations**: too many apps depend on a 14-year-old ESB that the original plan didn't address\n7. **Vendor management**: AWS account team has rotated 3 times; relationship has been transactional\n8. **Quick wins**: the 92% migration of new apps proves the *capability* exists — execution stalls on legacy\n\n**Steering committee positions:**\n- **CIO**: wants a credible re-plan, but is privately worried about a \"doubled budget\" message\n- **CFO**: focus on cost-discipline; \"stop spending until we know what we're getting\"\n- **CRO** (risk): \"I would rather slow than have an outage. Period.\"\n- **Two business unit MDs**: care only about specific apps that affect their P&L\n- **Board observer**: skeptical the program can deliver; floating \"should we just stop\"\n\n**Constraints:**\n- Budget: €108M remaining of original €180M. CFO unlikely to approve big increase.\n- Time: original 4-year plan ends in 24 months. Realistic re-plan likely needs longer.\n- Regulatory: BaFin has signaled increased cloud-concentration scrutiny\n\n## Your Task\n\nDiagnostic + re-plan section (1.5–2 pages):\n\n1. **Diagnosis**: of the 8 issues, which are the 3 *root causes* vs. *symptoms*? What's the underlying story?\n2. **Re-plan principles**: what 4-5 design principles should guide the re-plan? (e.g., \"Sequence by dependency, not by visibility\")\n3. **Sequencing recommendation**: what gets done in months 25-36, 37-48, 49+? (You can recommend extending the program.)\n4. **Mainframe**: lift-and-shift, refactor, leave alone, or strangler-fig? Justify.\n5. **Skills + culture**: how do you propose addressing the skills gap and risk culture without it becoming a 2-year HR project?\n6. **The board narrative**: how do you frame \"we're behind, here's the plan\" without sounding like you've doubled the budget?\n7. **Stop-or-go test**: what's the early signal in the next 3-6 months that tells the steering committee the re-plan is working (or not)?\n\n## Guiding Questions\n\n- The skills gap is real, but you can't hire your way out of it in 12 months at Frankfurt rates. Is the answer training, partnering, MSPs, or some combination?\n- \"Slow than outage\" (CRO) is reasonable, but creates the risk-aversion that stalled the program. How does the re-plan acknowledge this without ignoring it?\n- The CFO's \"stop spending\" instinct could be right (the program is worth ending) or wrong (the program needs more, not less). How do you reason about this?\n- \"Should we just stop\" is on the table. Is there any version of \"stop\" that's actually a good answer? When would you recommend it?\n\n## Match Info\n\n**Case fits:** Technology Consultant · Cloud Consultant · Data & AI Consultant · Implementation Consultant · Digital Transformation Analyst · Senior Technology Consultant\n**Primary tests:** cloud strategy, stakeholder alignment, sequencing, cost-risk trade-offs\n**Industry fit:** Big-4 / strategy consulting (tech practices), boutique tech consultancies, internal transformation offices"
  },
  {
    "id": "cs-70-cybersecurity",
    "title": "Pen Test Found 47 Findings: Triage Before the Audit Committee Meets",
    "cluster": "cybersecurity_consulting",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Cybersecurity Consultant",
      "Senior Security Consultant",
      "Risk Advisory Associate",
      "Security Engineer (governance)",
      "GRC Analyst (Cyber)",
      "IT Audit Associate",
      "Penetration Tester (junior, advisory side)"
    ],
    "matchesFields": [
      "Engineering",
      "Operations",
      "Research"
    ],
    "matchesIndustries": [
      "Tech",
      "Finance",
      "Healthcare",
      "Industrial"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Risk-based prioritization",
      "Technical to executive translation",
      "Remediation roadmap",
      "Audit-committee communication"
    ],
    "companyName": "Halycon Health",
    "logoUrl": "/company-logos/cs-70-cybersecurity.png",
    "body": "<img src=\"logos/cs-70-cybersecurity.png\" alt=\"Halycon Health logo\" width=\"120\" align=\"right\" />\n\n# Pen Test Found 47 Findings: Triage Before the Audit Committee Meets\n\n## Context\n\nYou are a **Cybersecurity Consultant** at a top-tier consulting firm. Your client, **Halycon Health** (a private hospital group, 6 hospitals, 9,000 employees, ~1.4M patient records), commissioned a third-party penetration test 6 weeks ago. The report (delivered yesterday) lists **47 findings**: 4 Critical, 11 High, 19 Medium, 13 Low.\n\nThe audit committee meets in **18 days**. The CFO has asked your team to (1) make sense of the findings, (2) propose a remediation plan, (3) deliver an executive briefing in 18 days. The CISO is part of the team but stretched (she leads a team of 6 against a much bigger problem).\n\n## Your Role\n\nYou are a **Senior Cybersecurity Consultant** (5 years, mostly health-sector clients). You will own findings prioritization and the executive narrative.\n\n## Situation — What's in the Report\n\n**Critical findings (4):**\n1. Default admin credentials still active on 14 medical-imaging-system admin consoles\n2. Internet-facing patient-portal vulnerable to authentication bypass (would allow access to ~210k patient records)\n3. Active Directory misconfiguration allowing Domain Admin escalation from any domain user\n4. Backup system stores patient data unencrypted; backup credentials exposed in a shared drive\n\n**High findings (11) — sample:**\n- Outdated Java runtime on 230 endpoints (40% of clinical workstations)\n- Unsegmented network: clinical, admin, and guest WiFi share VLANs\n- 1,200+ user accounts with passwords unchanged for >2 years\n- No MFA on the radiology PACS system\n- Vendor remote access via shared service account\n- Email-spoofing protections (DMARC/DKIM/SPF) misconfigured\n\n**Medium findings (19) — themes:** patching, logging gaps, weak crypto on internal services, IAM hygiene, third-party access reviews, lacking incident-response runbooks\n\n**Low findings (13)** — minor cookie flags, SSL config, etc.\n\n**Halycon's context:**\n- The CISO has been in role 14 months; she inherited most of these issues\n- Total IT budget €11.4M, security gets ~€1.6M of that\n- Prior pen test 3 years ago had ~30 findings, ~half of which never got remediated\n- Hospital operations cannot tolerate sustained downtime — patching critical systems requires planning windows\n- BSI (German federal cyber agency) has flagged the healthcare sector as a top-target since hospital ransomware incidents in DACH\n- Cyber insurance renewal is in 5 months; current insurer asked detailed questions last year\n- Two of the 6 hospitals were acquired in the last 3 years; their IT was never fully integrated\n\n**Stakeholders:**\n- **CISO**: realist; wants honest prioritization, doesn't want to be set up to fail\n- **CFO**: cost-conscious; will want a budget number\n- **Audit committee chair**: wants to see \"are we above or below industry baseline\" and \"where is the irreducible risk\"\n- **CMO** (Chief Medical Officer): worried about patching disruption to clinical systems\n- **External counsel**: privately suggested some findings shouldn't be written down in a way that creates discoverable liability — your firm has its own protocols on this\n\n## Your Task\n\nAudit-committee briefing (1.5–2 pages):\n\n1. **Triage**: how do you sequence the 47 findings? Don't just say \"Critical first\" — argue trade-offs (e.g., AD escalation might need 4 weeks of planning, but default creds are 2-day fixes).\n2. **The 90-day plan**: which findings are remediated, which are in-flight, which are on a longer roadmap?\n3. **Budget ask**: what's the rough cost? Where is the money going (people, tooling, vendor remediation)?\n4. **Risk acceptance**: which findings will Halycon *not* fix soon, and what compensating controls are in place? (Audit committees respect honest \"we accept this risk\" if argued.)\n5. **Executive narrative**: 3-paragraph framing for the audit committee — current state, plan, residual risk\n6. **External-counsel issue**: how do you handle the suggestion not to document things that create liability? (Hint: you don't.)\n\n## Guiding Questions\n\n- 4 Critical + 11 High in 90 days is unrealistic for an org with 6 stretched security people. What's the right balance of \"fix yourself\" vs. \"bring in external help\" vs. \"buy tooling\"?\n- Default credentials on imaging consoles is a 2-day fix that prevents a catastrophic outcome. AD escalation is a 6-week effort. Both are Critical. Which goes first?\n- The backup-system finding (unencrypted patient data + exposed credentials) is essentially a 6-month timer to a breach. This is the most uncomfortable one for the audit committee. How do you communicate the urgency without panic?\n- The CMO's concern about patching disruption is real. How do you propose handling it without it becoming a permanent excuse to defer?\n\n## Match Info\n\n**Case fits:** Cybersecurity Consultant · Senior Security Consultant · Risk Advisory Associate · Security Engineer (governance) · GRC Analyst · IT Audit Associate · Pen Tester (advisory)\n**Primary tests:** risk prioritization, technical-to-executive translation, remediation roadmap\n**Industry fit:** Big-4 advisory, boutique cyber consultancies, in-house GRC teams, MSSPs"
  },
  {
    "id": "cs-71-medical-affairs",
    "title": "New Indication Launch: Plan the KOL & Field-Medical Strategy in 12 Weeks",
    "cluster": "medical_affairs",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Medical Affairs Associate",
      "Senior Medical Affairs Manager",
      "Pharma Brand Manager (junior)",
      "R&D Project Coordinator",
      "Product Specialist (Medical Devices)",
      "Clinical Application Specialist",
      "Medical Science Liaison (junior)"
    ],
    "matchesFields": [
      "Marketing",
      "Operations",
      "Research"
    ],
    "matchesIndustries": [
      "Healthcare",
      "Services"
    ],
    "matchesMode": "mixed",
    "matchesOutput": "enabler",
    "skillsTested": [
      "KOL mapping",
      "Compliant medical communication",
      "Cross-functional pharma launch",
      "Ethics under commercial pressure"
    ],
    "companyName": "Cynara Pharma",
    "logoUrl": "/company-logos/cs-71-medical-affairs.png",
    "body": "<img src=\"logos/cs-71-medical-affairs.png\" alt=\"Cynara Pharma logo\" width=\"120\" align=\"right\" />\n\n# New Indication Launch: Plan the KOL & Field-Medical Strategy in 12 Weeks\n\n## Context\n\n**Cynara Pharma** (mid-sized European specialty pharma, oncology + auto-immune focus) has just received EMA approval for a **second indication** of their existing immunology drug **Verifex**: now also approved for moderate-to-severe ulcerative colitis (originally approved for psoriatic arthritis). Launch in Germany (lead market) is in **12 weeks**.\n\nYou've been given ownership of the Medical Affairs launch plan: KOL engagement, advisory boards, scientific communication, and field-medical (MSL) deployment. Commercial Marketing and Sales are in parallel with their own launches.\n\n## Your Role\n\nYou are a **Senior Medical Affairs Manager** (3 years in role, 5 years total in pharma after a science PhD). You manage 6 MSLs (Medical Science Liaisons) and work cross-functionally with Marketing, Sales, Market Access, and Regulatory.\n\n## Situation\n\n**Product context:**\n- Verifex is well-known in dermatology and rheumatology; the new indication brings it to gastroenterology — a different KOL community\n- Pivotal trial showed clinical remission at week 12 in 38% of patients (vs. 22% for placebo)\n- Two existing competitors in this indication; one has just-published 5-year long-term data\n- Real-world evidence on Verifex is strong in psoriatic arthritis but absent in UC\n\n**KOL landscape (Germany):**\n- Approximately 35 \"Top KOLs\" in adult inflammatory bowel disease (IBD)\n- 12 of these were involved in the pivotal trial; you have existing relationships\n- 8 are active in our competitor's KOL network (treated as off-limits by Marketing, but Medical Affairs can engage non-promotionally)\n- The remaining 15 are \"neutral\" — known to the field but not engaged by anyone heavily yet\n\n**Resources:**\n- 6 MSLs, of whom only 2 have IBD experience (the other 4 cover psoriatic arthritis / general rheumatology)\n- 1 Senior Medical Director who reviews scientific content but is overloaded\n- Budget for the launch year: €1.4M (advisory boards, congress, materials, IIS funding)\n- Two key European congresses fall in launch window (UEG Week in 8 weeks, ECCO Congress in 5 months)\n\n**Internal pressure:**\n- Marketing wants MSLs to \"support sales conversations\" — this is a compliance line you cannot cross. MSLs are non-promotional.\n- Sales head: \"We need MSLs in the room with KOLs alongside our reps.\" (Also a compliance issue.)\n- Market Access wants real-world data published quickly to support reimbursement negotiations\n- Regulatory has flagged that any messaging deviating from the EMA label is a serious issue\n- Compliance head: \"Don't repeat the mistakes from the 2022 launch\" — referring to a prior product where MSL boundaries got blurry and resulted in an internal investigation\n\n**Specific requests landing on your desk:**\n1. A prominent IBD KOL (Dr. Hartung, Berlin) wants Cynara to fund a 200-patient real-world study — €380k commitment, 18 months\n2. A community gastroenterologist asks if you can \"explain the data\" at his hospital's monthly internal meeting — borderline territory between education and promotion\n3. The Marketing team has drafted a \"scientific\" leave-behind for sales reps that contains a comparative claim against a competitor — your scientific review says the comparison isn't supported by head-to-head data\n\n## Your Task\n\n12-week Medical Affairs launch plan (1.5 pages):\n\n1. **KOL strategy**: how do you segment and engage the 35 KOLs? What does \"engagement\" look like across the 12 trial-involved + 15 neutral + 8 competitor-aligned?\n2. **MSL deployment**: how do you handle the IBD-experience gap? Train, hire, or partner?\n3. **Advisory board calendar**: how many, when, on what topics, with whom?\n4. **Real-world evidence (RWE)**: do you fund Dr. Hartung's study? Why or why not? If yes, with what design oversight?\n5. **Scientific congress strategy**: UEG Week (8 weeks out) and ECCO (5 months out) — what's the presence at each?\n6. **Compliance lines**: how do you handle the 3 specific requests above (KOL study, community talk, sales leave-behind)?\n7. **Success metrics**: what does \"good\" look like at 12 weeks vs. 12 months? (Be specific — and don't confuse Medical Affairs metrics with Sales metrics.)\n\n## Guiding Questions\n\n- The 8 competitor-aligned KOLs are valuable but politically charged. Do you engage them, and how?\n- Funding Dr. Hartung's study could be excellent science — or it could look like an inducement. What governance distinguishes the two?\n- Sales pressure to \"co-attend KOL meetings\" is a compliance red flag (in EU and US codes). How do you say no without alienating Sales?\n- The MSL team is undertrained on IBD. Hiring takes 3-6 months you don't have. What's the realistic plan for week 1 KOL conversations?\n\n## Match Info\n\n**Case fits:** Medical Affairs Associate · Senior Medical Affairs Manager · Pharma Brand Manager (junior) · R&D Project Coordinator · Product Specialist (Medical Devices) · Clinical Application Specialist · Medical Science Liaison\n**Primary tests:** KOL mapping, compliant medical communication, cross-functional launch\n**Industry fit:** pharma (specialty, oncology, immunology), medical devices, biotech"
  },
  {
    "id": "cs-72-hospital-operations",
    "title": "ED Wait Times Are 4.5 Hours: Find the Bottleneck and Fix It",
    "cluster": "hospital_operations",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Hospital Operations Analyst",
      "Healthcare Strategy Associate",
      "Clinical Quality Analyst",
      "Health Data Analyst",
      "Epidemiology Analyst",
      "Healthcare Consultant (junior)",
      "Performance Improvement Analyst (Healthcare)"
    ],
    "matchesFields": [
      "Operations",
      "Data",
      "Research"
    ],
    "matchesIndustries": [
      "Healthcare",
      "Public",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Process flow analysis",
      "Quantitative bottleneck identification",
      "Stakeholder navigation in clinical settings",
      "Realistic implementation planning"
    ],
    "companyName": "St. Erlangen Hospital",
    "logoUrl": "/company-logos/cs-72-hospital-operations.png",
    "body": "<img src=\"logos/cs-72-hospital-operations.png\" alt=\"St. Erlangen Hospital logo\" width=\"120\" align=\"right\" />\n\n# ED Wait Times Are 4.5 Hours: Find the Bottleneck and Fix It\n\n## Context\n\n**St. Erlangen Hospital** is a 480-bed teaching hospital in southern Germany. The Emergency Department (ED) sees ~78,000 patient visits/year. Median time from arrival to disposition decision is **4.5 hours** (target: 2.5 hours). Patient complaints are rising; staff burnout is rising; one local newspaper ran a critical piece last month.\n\nThe hospital's COO has commissioned a **performance improvement project**. Your team — you, a senior healthcare consultant lead, and a clinical advisor (an ED attending physician working part-time on the project) — has 6 weeks to deliver findings + a 90-day improvement plan.\n\n## Your Role\n\nYou are a **Hospital Operations Analyst** (2nd year). You own the data analysis, process mapping, and recommendation drafting. Your lead consultant handles executive interactions and final stakeholder management.\n\n## Situation — The Data\n\n**Patient flow breakdown (median minutes per stage, last 90 days):**\n\n| Stage | Median (min) | 90th percentile (min) | Target |\n|---|---|---|---|\n| Arrival → Triage | 12 | 35 | <10 |\n| Triage → Bed assignment | 38 | 110 | <20 |\n| Bed assignment → MD assessment | 48 | 145 | <30 |\n| MD assessment → First diagnostic ordered | 22 | 65 | <15 |\n| First diagnostic → Result available | 65 | 195 | <60 |\n| Result available → Disposition decision | 87 | 240 | <30 |\n| **Total: arrival → disposition** | **4h 32m** | **9h 50m** | **2h 30m** |\n\n**Volume patterns:**\n- Daily volume: median 215 patients, range 140–340\n- Peak hours: 10am–2pm and 6pm–10pm\n- Friday evenings + Mondays consistently 30% above average\n- ~22% of arrivals are non-urgent (could be primary care)\n\n**Staffing:**\n- Attending physicians: 6 on day shift, 4 on night shift (2 hospitalists rotate in)\n- Nurses: 14 day, 10 night\n- Specialist consults: cardiology, surgery, neurology — typically a 45–90 min wait for a consult\n- Imaging (CT/MRI): one shared CT scanner for the ED, scheduling controlled by radiology\n\n**What you've found in process mapping:**\n1. Triage uses a 5-tier system (Manchester) but >30% of patients are triaged to \"non-urgent\" yet wait next to \"urgent\" patients in shared waiting areas\n2. The biggest bottleneck on paper is \"result available → disposition decision\" (87 min) — but interviews suggest this is often physicians waiting for specialist consults\n3. Inpatient bed availability is frequently the limiter — 18% of ED patients ready to admit wait >2 hours for an inpatient bed\n4. The CT scanner is over-used for low-acuity patients due to \"defensive medicine\" practices\n5. Discharge processes are slow on weekends — disposition may be reached but discharge paperwork takes 60+ minutes\n6. There's no real-time dashboard for ED flow visible to clinicians — they don't see how the queue is performing\n7. Two competing internal projects (electronic prescribing rollout, bed-management system upgrade) are absorbing IT capacity\n\n**Stakeholders:**\n- **COO**: wants measurable improvement in 90 days; willing to back changes but doesn't want clinician revolt\n- **ED Medical Director**: skeptical of consultants; protective of clinical autonomy; hates \"process improvement language\"\n- **Chief Nursing Officer**: ally; sees triage and bed-flow improvements as overdue\n- **Department heads (cardiology, surgery)**: their consult turnaround is part of the problem but they don't see it that way\n- **The clinical advisor on your team**: has built rapport with the ED Medical Director, can help bridge\n\n## Your Task\n\nFindings + 90-day plan (1.5–2 pages):\n\n1. **Top-3 bottlenecks** ranked: where is the biggest time sink, and what's the underlying cause? (Note: \"MD waiting for consult\" is different from \"specialist not available\")\n2. **Quick wins (next 30 days)**: 3-4 changes that don't require IT or major staffing changes\n3. **Structural fixes (60–90 days)**: 2-3 deeper changes (e.g., split ED flow with a \"fast track\" for non-urgent, real-time dashboard, consult SLA agreements)\n4. **The bed-availability piece**: it's only partially within ED's control. How do you propose addressing it given inpatient department resistance?\n5. **Stakeholder strategy**: how do you get the ED Medical Director on side? What's the COO's role? Where might political resistance come from?\n6. **Measurement**: which 4–5 metrics do you commit to tracking weekly? What's the realistic improvement target at 90 days?\n7. **What you don't recommend** and why (e.g., \"throw more staff at it\" — usually wrong without process changes)\n\n## Guiding Questions\n\n- \"Result available → disposition\" is the longest stage — but it's often a proxy for specialist-consult wait. Which is the real lever: ED process or specialist availability?\n- Adding a \"fast track\" lane for non-urgent (22% of patients) is a textbook intervention. Why might it not work here, and what do you need to validate first?\n- Defensive over-imaging is a clinical-culture issue, not an operations issue. Can a non-physician analyst even propose changes to this?\n- 90 days is short. Which structural fix do you push to start NOW even if the visible improvement is in month 4-6?\n\n## Match Info\n\n**Case fits:** Hospital Operations Analyst · Healthcare Strategy Associate · Clinical Quality Analyst · Health Data Analyst · Epidemiology Analyst · Healthcare Consultant · Performance Improvement Analyst\n**Primary tests:** flow analysis, quantitative bottleneck identification, clinical-stakeholder navigation\n**Industry fit:** hospital systems, healthcare consulting, public health, payer-provider operations"
  },
  {
    "id": "cs-73-energy-trading-grid",
    "title": "Negative Prices Forecast for Sunday: Position the Book",
    "cluster": "energy_trading_grid",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Energy Trading Analyst",
      "Power Grid Analyst",
      "Grid Operations Analyst",
      "Utility Strategy Analyst",
      "Power Markets Analyst",
      "Energy Risk Analyst"
    ],
    "matchesFields": [
      "Finance",
      "Engineering",
      "Data",
      "Operations"
    ],
    "matchesIndustries": [
      "Energy",
      "Industrial",
      "Public"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Power-market intuition",
      "Forecasting under uncertainty",
      "Position sizing",
      "Operational vs. trading interface"
    ],
    "companyName": "Tellora Energy",
    "logoUrl": "/company-logos/cs-73-energy-trading-grid.png",
    "body": "<img src=\"logos/cs-73-energy-trading-grid.png\" alt=\"Tellora Energy logo\" width=\"120\" align=\"right\" />\n\n# Negative Prices Forecast for Sunday: Position the Book\n\n## Context\n\nYou work at **Tellora Energy**, a German utility (~6.4 GW generation portfolio: 2.1 GW gas, 2.8 GW renewables, 1.5 GW coal/biomass), also actively trading on EPEX Spot and intraday markets. You support the **short-term trading desk** that handles day-ahead and intraday positioning for the next 1-7 days.\n\nIt's Friday afternoon. Weather forecasts for **Sunday** show: sunny, low load (warm spring weather, no industrial demand surge), and — critically — **45 GW of expected solar generation across Germany** combined with strong wind (~38 GW). The day-ahead auction closes at 12:00 on Saturday. **Spot prices are already trading at -€18/MWh for Sunday's midday hours** in early indications.\n\nThe Head of Trading wants your assessment by 17:00 today: what's our exposure, what should we do about it, and what's the wider scenario for the weekend?\n\n## Your Role\n\nYou are an **Energy Trading Analyst** (2nd year), supporting two senior traders. You handle data, run scenarios, and contribute to position recommendations.\n\n## Situation\n\n**Current portfolio position for Sunday (forward sales already locked in):**\n\n| Asset / contract | Volume Sunday |\n|---|---|\n| Gas plant Ulrichshof (CCGT, must-run for heat-supply contract) | +180 MWh delivered |\n| Coal plant Sögelheim (flexible) | optional, marginal cost ~€55/MWh |\n| Wind portfolio (PPA to a corporate offtaker) | -1,200 MWh sold forward at €68/MWh |\n| Solar portfolio (own consumption + grid) | ~2,800 MWh expected, sold day-ahead |\n| Industrial customer baseload (sold) | -540 MWh fixed at €82/MWh |\n| Trading book net | -300 MWh net short into Sunday |\n\n**Key constraints:**\n- Ulrichshof must run regardless (district heating contract obligation): output between 11am-3pm Sunday at full ~180 MWh\n- Wind PPA: we are obliged to take delivery at €68/MWh regardless of spot price — meaning we lose money on every MWh we re-sell to the spot market at negative prices\n- Solar PV on our books generates whether we like it or not; turning off is a last-resort action\n\n**Forecasted day-ahead auction prices (Sunday hours, indicative based on early indications):**\n\n| Hour | Price indication |\n|---|---|\n| 00–06 | €15-25/MWh |\n| 06–10 | €5-15/MWh (sun rises) |\n| **10–14** | **-€18 to -€45/MWh** (peak solar) |\n| 14–18 | €10-25/MWh |\n| 18–22 | €55-75/MWh (evening peak as solar drops) |\n| 22–24 | €30-45/MWh |\n\n**Operational levers:**\n1. Curtail solar (technically possible, no marginal cost saved, but loses revenue we already locked in if it's grid-side curtailment compensation)\n2. Shut down or minimum-load Sögelheim coal (high startup costs to bring back)\n3. Pump-storage: we have access to 80 MWh capacity via a partner contract — buy cheap, sell during evening peak\n4. Trade — buy back our short positions and unwind at intraday prices (risk: prices move further)\n5. Increase storage charging (battery: we have 40 MWh capacity, currently 30% charged)\n\n**Risks/uncertainties:**\n- Weather forecast accuracy is high but solar output can vary ±15%\n- A nuclear plant in France is on extended outage — could keep DE/FR borders importing rather than exporting\n- The 18:00 ramp-up is steep; if solar drops faster than wind picks up, evening prices could spike higher than €75/MWh\n- Negative prices below -€30 trigger MaStR/EEG-related implications for some renewable assets\n\n## Your Task\n\nIn 45 minutes — pre-trade memo (1 page):\n\n1. **Current exposure assessment**: in plain language, how do we make or lose money on Sunday under base case?\n2. **Recommended actions for the day-ahead auction (closes Saturday 12:00)**: what do we bid, what do we leave for intraday?\n3. **Pump-storage and battery use**: when do you charge, when do you discharge?\n4. **Coal plant Sögelheim**: run or don't run? Justify with the math.\n5. **Risk scenarios**: what happens if solar overshoots forecast (cheaper midday) or undershoots (less negative)? What's our P&L sensitivity?\n6. **Cross-check with operations**: which decisions need grid-operator coordination, which need our plant managers' sign-off?\n\n## Guiding Questions\n\n- The wind PPA is a structural loss in negative-price hours. Should the lesson be \"renegotiate PPAs to include negative-price clauses next time\" — and is that even market practice now?\n- Negative prices in Germany are no longer rare events — they are increasingly structural for sunny weekends. How should the trading book be structured to handle them as routine, not as crises?\n- The temptation is to over-trade. What's the right level of intraday adjustment vs. setting positions and leaving them?\n- Coal plant Sögelheim has high startup costs. Is there a wrong answer that \"feels right\" (e.g., shutting it down because of negative prices) but actually costs more over the weekend?\n\n## Match Info\n\n**Case fits:** Energy Trading Analyst · Power Grid Analyst · Grid Operations Analyst · Utility Strategy Analyst · Power Markets Analyst · Energy Risk Analyst\n**Primary tests:** power-market intuition, forecasting under uncertainty, position sizing\n**Industry fit:** utilities, IPP/renewables traders, energy commodity trading, TSO/DSO operations"
  },
  {
    "id": "cs-74-marketplace-fraud",
    "title": "Counterfeit Spike on the Marketplace: Stop the Bleeding Before Q4",
    "cluster": "ecommerce_marketplace",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "E-commerce Analyst",
      "Marketplace Operations Manager",
      "Merchandising Analyst",
      "Retail Strategy Associate",
      "Store Operations Analyst",
      "Trust & Safety Analyst (commerce)",
      "Category Operations Manager"
    ],
    "matchesFields": [
      "Operations",
      "Marketing",
      "Data",
      "Sales"
    ],
    "matchesIndustries": [
      "Consumer",
      "Tech",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "optimizer",
    "skillsTested": [
      "Marketplace dynamics",
      "Quantitative triage",
      "Seller management",
      "Brand-and-buyer trust trade-offs"
    ],
    "companyName": "Bostro",
    "logoUrl": "/company-logos/cs-74-marketplace-fraud.png",
    "body": "<img src=\"logos/cs-74-marketplace-fraud.png\" alt=\"Bostro logo\" width=\"120\" align=\"right\" />\n\n# Counterfeit Spike on the Marketplace: Stop the Bleeding Before Q4\n\n## Context\n\n**Bostro** is a European general-merchandise marketplace (~9,000 third-party sellers, GMV €410M/year, four major categories: Electronics, Fashion, Home, Beauty). In the last 8 weeks, **counterfeit complaints have tripled** — from a baseline of ~140/month to 460/month. Refund volume is up 22%. Two well-known brands have publicly threatened to delist. Q4 (your biggest quarter, 38% of annual GMV) starts in 7 weeks.\n\nYou've been asked by the VP of Marketplace to lead a cross-functional response: triage the immediate problem, plan the Q4 protections, and draft a longer-term seller-trust roadmap.\n\n## Your Role\n\nYou are a **Marketplace Operations Manager** (3 years at Bostro, started as a Merchandising Analyst). You report to the VP Marketplace and have working relationships with Trust & Safety, Category Management, and Seller Operations.\n\n## Situation\n\n**What you've found from data analysis:**\n\n| Signal | Detail |\n|---|---|\n| Counterfeit complaints by category | 71% Beauty, 18% Electronics, 9% Fashion, 2% Home |\n| New seller cohort | Sellers onboarded in last 6 months are responsible for 64% of complaints |\n| Geographic clustering | 38% of complaints trace to ~80 sellers, mostly registered in 3 EU countries |\n| Listing patterns | Many of these sellers price at 30-40% below brand authorized retailer |\n| Onboarding KYC | Bostro's seller verification was loosened 9 months ago to drive seller acquisition |\n| Brand reports | 7 brand-rights-owners filed VeRo notices last week, vs. ~1/week historically |\n| Buyer reviews | 4-star average has slipped to 3.6 in Beauty |\n\n**Internal context:**\n- Bostro's growth strategy this year was \"seller acquisition first\" — KYC was relaxed, listing approval was sped up. Sellers signed 2.4× faster than last year.\n- Beauty is the highest-margin category (24% take-rate vs. 12-18% in others)\n- The Q4 forecast assumes Beauty grows 35% YoY\n- The CEO's response so far: \"Don't blow up our seller numbers\"\n- Trust & Safety team has 8 people (was 6 a year ago, head wanted to grow to 14)\n- Category Management is run by the head of merchandising who pushed for fast seller acquisition\n\n**Stakeholders:**\n- **VP Marketplace (your boss)**: wants action but also wants to protect category numbers\n- **Head of Beauty Category**: defensive — these sellers are her growth engine\n- **Trust & Safety Lead**: has been warning for 6 months that loosened KYC was a problem; now feels vindicated and slightly burned-out\n- **Brand-relations head**: pressure from L'Oréal, P&G, several niche brands; threatened delistings\n- **CEO**: wants the issue resolved without \"killing the marketplace\"\n- **Legal**: liability under DSA (Digital Services Act) is now in play — failing to act on notices has direct legal consequence\n\n**Available levers:**\n1. Suspend the 80 high-complaint sellers immediately (impact: ~6% of Beauty GMV gone)\n2. Re-verify KYC on all 6-month-cohort sellers (180k listings affected, 4-week project)\n3. Re-introduce stricter onboarding for new sellers (slows growth)\n4. Brand-authorization gates on key brands (only authorized resellers can list these brands)\n5. Test-buy program (Bostro buys samples from suspect sellers, verifies authenticity)\n6. Public communication to buyers and brands about the response\n7. Refund-to-buyer expansion (no questions asked) to protect customer experience while you fix supply\n\n## Your Task\n\nAction plan in 1.5 pages:\n\n1. **The first 7 days**: which actions ship immediately? (Lever-by-lever specifics, not \"we'll improve trust\")\n2. **Q4 protection** (next 7 weeks): what do you do to ensure the Beauty category survives Q4 without further damage?\n3. **The 80 high-complaint sellers**: do you suspend all, suspend some, or re-verify? Justify.\n4. **Brand-authorization gating**: applies to which brands and at what threshold? What's the trade-off?\n5. **Internal narrative**: how do you align the Head of Beauty (whose numbers will take a hit) and the CEO (who wants to protect numbers)?\n6. **DSA compliance**: how do you make sure you're handling brand notices within legal timeframes?\n7. **Long-term roadmap (post-Q4)**: 3-4 changes to seller-trust architecture (tiered onboarding, behavioral-based scoring, etc.)\n\n## Guiding Questions\n\n- Suspending 80 sellers tomorrow is the cleanest move but loses 6% of Beauty GMV at the worst possible time. What's the structured way to think about that trade-off?\n- The relaxed KYC 9 months ago was a strategic mistake. Naming that internally is politically costly. How do you write the diagnosis honestly without making it a blame exercise?\n- Test-buys are powerful evidence but expensive (cost + time). Where do you target them?\n- Buyer trust takes years to build, weeks to lose. What's the buyer-facing communication approach?\n\n## Match Info\n\n**Case fits:** E-commerce Analyst · Marketplace Operations Manager · Merchandising Analyst · Retail Strategy Associate · Store Operations Analyst · Trust & Safety Analyst (commerce) · Category Operations Manager\n**Primary tests:** marketplace dynamics, quantitative triage, seller management, trust trade-offs\n**Industry fit:** marketplaces (Amazon-like), classifieds, two-sided platforms, omnichannel retail"
  },
  {
    "id": "cs-75-ngo-program-grants",
    "title": "Foundation Grant Renewal: Show Impact in 3 Weeks Or Lose €2.4M",
    "cluster": "ngo_program_grants_me",
    "duration": "medium",
    "estimatedMinutes": 45,
    "matchesRoles": [
      "Program Coordinator (NGO / foundation)",
      "Grants Analyst",
      "M&E Analyst (Monitoring & Evaluation)",
      "Impact Measurement Analyst",
      "Program Officer (UN, EU, GIZ, World Bank)",
      "Research Associate (think tank)",
      "International Development Associate"
    ],
    "matchesFields": [
      "Operations",
      "Research",
      "Marketing"
    ],
    "matchesIndustries": [
      "Public",
      "Services"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Impact framing",
      "M&E methodology",
      "Grant writing under constraints",
      "Honest reporting in mission-driven context"
    ],
    "companyName": "Pathways Initiative",
    "logoUrl": "/company-logos/cs-75-ngo-program-grants.png",
    "body": "<img src=\"logos/cs-75-ngo-program-grants.png\" alt=\"Pathways Initiative logo\" width=\"120\" align=\"right\" />\n\n# Foundation Grant Renewal: Show Impact in 3 Weeks Or Lose €2.4M\n\n## Context\n\n**Pathways Initiative** is an NGO running youth-employment programs in 4 European countries (offices in Berlin, Lisbon, Bucharest, Sofia; ~85 staff total; annual budget €11M). Your largest grant — **€2.4M/year from the Hartmann Family Foundation** — is up for renewal. The foundation has signaled they're \"more skeptical than usual\" this cycle. The renewal application is due in **3 weeks**.\n\nThe program in question — **Bridge2Work**, a 6-month skills-and-mentoring program for unemployed 18-29 year olds — has been running 4 years across the 4 countries. The foundation funded it from the start.\n\n## Your Role\n\nYou are **Senior Program Coordinator + M&E Lead** for Bridge2Work (4 years in role, social science background). You own the program design, monitoring, evaluation, and reporting to funders. The Executive Director (your boss) will sign off on the grant submission.\n\n## Situation — The Honest Numbers\n\n**Bridge2Work over the last 4 years (cumulative):**\n\n| Metric | Number |\n|---|---|\n| Participants enrolled | 3,420 |\n| Participants completed program (≥80% attendance) | 2,180 (64%) |\n| Participants in employment 6 months post-completion | 1,160 (53% of completers, 34% of enrollees) |\n| Participants in \"good\" employment (>30 hrs, >€1,200/mo, contract ≥6 months) | 720 (33% of completers, 21% of enrollees) |\n| Cost per participant (total) | €2,890 |\n| Cost per \"good\" employment outcome | €13,720 |\n\n**Comparative context:**\n- National avg youth-unemployment-to-employment transition rate (control group, no intervention): ~28% over 12 months\n- Bridge2Work participants beat this by ~6 percentage points on the headline rate (34% vs. 28%)\n- But: participants self-selected into the program (motivation bias). A 2023 quasi-experimental study by an external evaluator estimated the *causal effect* at ~3-4 percentage points\n\n**What's improving:**\n- Bucharest cohort (started year 2): outcomes have improved every year, now at 41% \"good employment\"\n- Newer mentor-matching algorithm (rolled out year 3) appears to lift outcomes ~5 points\n- 12-month longer-term data (2 years post-completion) shows participants earn 14% more than non-participants — small but persistent\n\n**What's not improving:**\n- Berlin cohort: outcomes have plateaued and slightly declined; labour market in Berlin is tight, the unemployed cohort that comes to us is increasingly hard-to-place (mental-health, longer unemployment spells)\n- Sofia cohort: highest dropout rate (47% non-completion), partly funding-related (transit costs), partly program design\n\n**Foundation context (from informal conversation with the program officer):**\n- \"We're being asked harder questions by our board this year\"\n- \"We want to see clearer attribution — how much is you vs. would-have-happened-anyway?\"\n- \"We've heard rumors about Bulgaria dropout rates\"\n- The foundation has shifted strategy toward \"high-evidence\" interventions (RCT-validated where possible)\n\n**Internal pressure:**\n- Executive Director: \"Frame it positively, but don't lie. We can't afford to lose this grant.\"\n- Country leads: each wants their country's narrative protected\n- Two of your M&E team members say privately: \"We're not measuring the right thing — 'employment at 6 months' is what funders want, but real impact is longer-term\"\n- Finance team: a loss of this grant would mean program cuts in Sofia and Bucharest\n\n## Your Task\n\nGrant renewal narrative + M&E framework (1.5 pages):\n\n1. **Honest framing**: how do you write the impact story? What's the headline number you lead with, and how do you contextualize it (causal estimate, comparison to baseline)?\n2. **Bulgaria & Berlin** — the two underperforming sites: how do you handle these honestly? (Hide them = bad faith; over-emphasize = own goal. There's a third path.)\n3. **The \"hard questions\" the foundation will ask**: anticipate them and answer them in the narrative\n4. **What you propose differently** for the next 3 years: what programmatic changes increase the causal effect? How does the M&E framework get sharper?\n5. **Counterfactual thinking**: how do you talk about \"what would have happened anyway\" without undermining your own impact?\n6. **Budget ask**: do you ask for the same €2.4M, less, more, or restructured? Justify.\n7. **Risk to the relationship**: if you push too aggressively on causality data, you might invite cuts. If you under-claim, you're underselling. How do you find that line?\n\n## Guiding Questions\n\n- The honest causal effect (3-4pp) is much smaller than the headline (6pp). Funders often see only headlines. How much of the causal-vs-correlational distinction do you spell out?\n- Sofia's high dropout is a design problem (transit costs) that more funding could fix. Is that a credible \"we'll improve\" story or a self-serving \"give us more money\" story?\n- The 12-month follow-up wage data (14% earnings premium) is actually your strongest evidence but it's underplayed in your reporting. Why might that be, and what do you do?\n- The foundation wants RCT-validated. Bridge2Work isn't and probably can't be cleanly. Do you propose a quasi-experimental study, or a partial RCT for a subset?\n\n## Match Info\n\n**Case fits:** Program Coordinator (NGO / foundation) · Grants Analyst · M&E Analyst · Impact Measurement Analyst · Program Officer (UN/EU/World Bank) · Research Associate (think tank) · International Development Associate\n**Primary tests:** impact framing, M&E rigor, honest reporting under funding pressure\n**Industry fit:** NGOs, foundations, international development, social-impact organisations, government program evaluation"
  },
  {
    "id": "cs-76-real-estate-proptech",
    "title": "Acquire or Pass: Underwrite a Mixed-Use Asset and Brief Investment Committee",
    "cluster": "real_estate_proptech",
    "duration": "medium",
    "estimatedMinutes": 50,
    "matchesRoles": [
      "Real Estate Analyst",
      "Property Valuation Analyst",
      "Acquisitions Analyst (Real Estate)",
      "PropTech Product Manager",
      "Construction Project Coordinator",
      "Real Estate Asset Manager (junior)",
      "Real Estate Strategy Associate"
    ],
    "matchesFields": [
      "Finance",
      "Operations",
      "Research"
    ],
    "matchesIndustries": [
      "RealEstate",
      "Finance",
      "Industrial"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Underwriting and valuation",
      "Risk identification",
      "Capex and renovation planning",
      "Investment-committee narrative"
    ],
    "companyName": "Brennstein Capital",
    "logoUrl": "/company-logos/cs-76-real-estate-proptech.png",
    "body": "<img src=\"logos/cs-76-real-estate-proptech.png\" alt=\"Brennstein Capital logo\" width=\"120\" align=\"right\" />\n\n# Acquire or Pass: Underwrite a Mixed-Use Asset and Brief Investment Committee\n\n## Context\n\nYou work at **Brennstein Capital**, a mid-sized European real-estate investment manager (~€2.1B AUM, value-add and core-plus strategies, focus DACH + Benelux). A target asset has surfaced through a broker: **\"Lindenpark\"** — a 1980s-era mixed-use building in central Düsseldorf (12,400 sqm: 60% office, 30% retail, 10% residential), currently held by a family office that wants out for estate-planning reasons.\n\nInvestment committee meets in **9 days**. The senior partner running this transaction has asked you to (1) underwrite the asset, (2) flag risks, (3) recommend acquire / pass / negotiate. Asking price: **€48.5M** (~€3,910/sqm).\n\n## Your Role\n\nYou are a **Real Estate Analyst** (2nd year) in the Acquisitions team. You'll lead the financial model and risk assessment; the senior partner handles seller relationship and final pitch.\n\n## Situation\n\n**The asset:**\n- Built 1984, last major refurbishment 2008\n- Location: 7-minute walk from Düsseldorf Hbf, B-grade neighborhood that's gentrifying\n- Office tenants: 14 leases. Anchor tenant (38% of office space, a regional accounting firm) lease expires in 14 months — they have signaled they may not renew (decision: hybrid downsizing)\n- Retail: 4 tenants (a supermarket on long lease, a fitness studio that just opened, a bakery, a vacant unit)\n- Residential: 12 apartments, all rent-controlled (Mietpreisbremse applies), occupancy 100%\n- EPC rating: D — likely needs upgrade to C or B to meet 2030+ EU energy standards (cost estimate: €4.2M-€6.8M for envelope and HVAC)\n- Land lease (Erbbaurecht) on 30% of the site, 47 years remaining, ground rent €38k/year escalating\n\n**Current financials (seller-provided, broker-confirmed):**\n- Gross rental income: €3.9M/year\n- Operating costs (recoverable + non-recoverable): €1.1M/year\n- NOI: €2.8M/year\n- Implied gross yield at asking price: 8.0%\n- Implied net yield: 5.8%\n- Vacancy in office: currently 6%, anchor-tenant departure could take it to 25%\n\n**Comparable transactions (Düsseldorf, last 18 months):**\n- Stabilized core office: €5,200-6,800/sqm, yields 4.5-5.2%\n- Value-add office: €3,200-4,500/sqm, yields 6.0-7.5%\n- This asset is positioned as value-add given the lease expiry, refurb need, and EPC\n\n**Market context:**\n- Düsseldorf office vacancy: ~10.5%, rising slightly\n- Hybrid work has hit B-grade office disproportionately\n- Retail has stabilized post-pandemic; supermarkets are increasingly desirable as anchors\n- Interest rates have come down ~120bps from peak; investor demand returning but selectively\n- ESG/EPC rules: from 2030, EPC D could become unlettable in some German cities\n\n**Renovation/repositioning options:**\n1. Hold-and-let: minimal capex, accept lower rents, ride out cycle\n2. Light refurb (€2.5M): EPC D → C, freshen common areas, target B-grade office tenants\n3. Value-add (€7-9M): EPC D → B, redesign office floors for hybrid use (more meeting rooms / fewer desks), upgrade lobby\n4. Major repositioning (€14-18M): change use mix — convert 2 floors of office to residential or co-living, capitalize on housing demand\n5. Demolition/redevelopment: €40M+, 3-year timeline, max upside but max risk\n\n**Internal context:**\n- Brennstein's fund (current vintage): targets 14% gross IRR, 5-7 year hold\n- Recent deal: a similar Frankfurt asset returned 11% IRR, slightly underwhelming\n- Senior partner is keen on this deal — has known the seller for years\n- Fund's available capital can deploy this size, but committee has been more selective recently\n\n## Your Task\n\nInvestment committee memo (1.5–2 pages):\n\n1. **Recommendation**: Acquire / Pass / Negotiate (with price target). Be explicit.\n2. **Underwriting summary**: what's your projected 5-year IRR under base, downside, upside cases? Sketch the math.\n3. **Top-3 risks**: ranked, with potential mitigants\n4. **Repositioning strategy**: which of the 5 renovation options do you recommend? Why?\n5. **The anchor-tenant question**: how do you handle the lease-expiry uncertainty in your underwriting?\n6. **Negotiation levers**: if \"Negotiate,\" at what price would this be a clear yes? What concessions or earnouts would help?\n7. **The senior partner's emotional investment**: the relationship with the seller is real. How do you flag a \"Pass\" recommendation if that's what the numbers say?\n\n## Guiding Questions\n\n- 5.8% net yield on a value-add asset with 25%-vacancy risk in 14 months looks light. What's the right pricing for this risk?\n- EPC D → C costs €2.5M today; doing nothing risks unlettability post-2030. How do you think about regulatory risk that's 5+ years away?\n- The Erbbaurecht (47 years left) means you don't own the land outright on 30% of the site. How does that affect your bid?\n- Repositioning to residential/co-living could unlock value — but it triggers complex permitting in Düsseldorf. Is \"max upside\" worth the execution risk?\n\n## Match Info\n\n**Case fits:** Real Estate Analyst · Property Valuation Analyst · Acquisitions Analyst · PropTech Product Manager · Construction Project Coordinator · Real Estate Asset Manager · Real Estate Strategy Associate\n**Primary tests:** underwriting, risk assessment, capex planning, IC narrative\n**Industry fit:** real-estate investment management, REITs, family offices, real-estate development, PropTech (deal-platform side)"
  },
  {
    "id": "cs-99-ecothread-strategy",
    "title": "Which European city should EcoThread enter first?",
    "cluster": "strategy",
    "duration": "long",
    "estimatedMinutes": 85,
    "matchesRoles": [
      "Strategy Analyst",
      "Strategy Associate",
      "Market Expansion Analyst",
      "Business Development Analyst",
      "Founder's Associate"
    ],
    "matchesFields": [
      "Strategy",
      "Business"
    ],
    "matchesIndustries": [
      "Consumer",
      "Retail",
      "Tech"
    ],
    "matchesMode": "deep",
    "matchesOutput": "advisor",
    "skillsTested": [
      "Structured market analysis",
      "Recommendation under uncertainty",
      "Executive communication",
      "Composure under pressure"
    ],
    "companyName": "EcoThread",
    "logoUrl": "/company-logos/cs-99-ecothread-strategy.png",
    "body": "# Which European city should EcoThread enter first?\n\nYou're a new strategy analyst. The CEO needs a market entry recommendation before the board call.\n\nThis is a multi-task challenge — you'll work through three connected tasks: an analysis, a recommendation, and a curveball.",
    "companyBlock": {
      "tagline": "Sustainable fashion · Series A · Berlin",
      "primaryTag": "Strategy",
      "secondaryTags": ["Market entry", "~85 min"],
      "totalTimeLabel": "~85 min total"
    },
    "desk": {
      "quote": "I joined EcoThread two years ago as the first strategy hire. Most of my job is translating messy market signals into a clear recommendation my CEO can defend to investors. You don't need perfect data — you need a clear argument. The analysts who impress me most are the ones who take a position early and back it up with logic, not the ones who hedge everything.",
      "authorName": "Mia Krause",
      "authorTitle": "Head of Strategy · EcoThread",
      "authorInitials": "MK"
    },
    "tasks": [
      {
        "type": "analysis",
        "title": "Analyse the three markets",
        "durationMin": 35,
        "scoredOn": ["Structure", "Judgment", "Communication"],
        "quickCheck": {
          "question": "When evaluating a new market for expansion, which factor matters most for a premium DTC brand?",
          "options": [
            {
              "text": "Total population size — bigger market means more potential customers",
              "correct": false,
              "feedback": "Think about what makes a premium brand succeed — it's not scale, it's whether the customer already has the mindset and spending behaviour."
            },
            {
              "text": "Existing demand for sustainable products and willingness to pay a premium",
              "correct": true,
              "feedback": "Demand and willingness to pay is the right lens. A large market with no premium culture is harder to crack than a smaller market where the behaviour already exists."
            },
            {
              "text": "Low competitor presence — entering an empty market is always safer",
              "correct": false,
              "feedback": "An empty market often means there's no proven demand. Some competition validates that customers are already buying."
            },
            {
              "text": "Cheapest logistics cost to minimise overheads in year one",
              "correct": false,
              "feedback": "Logistics matters, but it rarely decides where a premium brand wins. Demand and brand fit come first."
            }
          ]
        },
        "prompt": "Using the data below, compare Amsterdam, Paris, and Stockholm across the dimensions you think matter most for EcoThread.\n\nYou don't need to analyse everything — pick the 2–3 factors most relevant to their situation and explain why you chose them.",
        "dataTable": {
          "columns": ["Metric", "Amsterdam", "Paris", "Stockholm"],
          "rows": [
            ["Population (city)", "0.9M", "2.1M", "1.0M"],
            ["Sustainable fashion market (€M)", "€340M", "€580M", "€290M"],
            ["Avg. online fashion spend / capita", "€420", "€380", "€510"],
            ["Competitor sustainable brands", "8", "22", "6"],
            ["English proficiency index", "Very high", "Low", "Very high"],
            ["Cultural proximity to Germany", "High", "Medium", "Medium"]
          ]
        },
        "textarea": {
          "placeholder": "Write your analysis here. Pick your 2–3 key factors and compare the three cities against them. Show your reasoning, not just your conclusion.",
          "wordLimit": 200
        },
        "resources": [
          { "title": "How to evaluate a new market in 3 steps", "subtitle": "Framework card · 2 min read", "icon": "📐" },
          { "title": "What is TAM, SAM, SOM?", "subtitle": "Glossary · 1 min read", "icon": "📖" },
          { "title": "Example: How a past analyst structured their answer", "subtitle": "Anonymised · passing score", "icon": "💬" }
        ]
      },
      {
        "type": "recommendation",
        "title": "Make your recommendation",
        "durationMin": 30,
        "scoredOn": ["Structure", "Judgment", "Communication"],
        "brief": "Based on your analysis, the CEO needs a single clear recommendation. You'll do this in two steps — first pick your city, then explain your reasoning and address the biggest risk.",
        "picker": {
          "label": "Step 1 — Choose your market",
          "options": [
            { "id": "amsterdam", "emoji": "🇳🇱", "name": "Amsterdam", "sub": "High spend · cultural fit" },
            { "id": "paris", "emoji": "🇫🇷", "name": "Paris", "sub": "Largest market · high competition" },
            { "id": "stockholm", "emoji": "🇸🇪", "name": "Stockholm", "sub": "Highest spend · smaller market" }
          ]
        },
        "matching": {
          "instruction": "Connect each market factor to the strategic reason it should influence your decision. This is how analysts structure a board-ready recommendation.",
          "rows": [
            {
              "factor": "High online spend per capita",
              "correctReasonId": "revenue",
              "options": [
                { "id": "revenue", "text": "Signals customers willing to pay premium prices" },
                { "id": "ops", "text": "Easier logistics and fulfilment" },
                { "id": "brand", "text": "Stronger brand recognition in market" },
                { "id": "comp", "text": "Fewer competitors to differentiate from" }
              ]
            },
            {
              "factor": "Low competitor density",
              "correctReasonId": "comp",
              "options": [
                { "id": "revenue", "text": "Signals customers willing to pay premium prices" },
                { "id": "ops", "text": "Easier logistics and fulfilment" },
                { "id": "brand", "text": "Stronger brand recognition in market" },
                { "id": "comp", "text": "Lower cost to acquire first customers" }
              ]
            },
            {
              "factor": "Cultural proximity to Germany",
              "correctReasonId": "brand",
              "options": [
                { "id": "revenue", "text": "Signals customers willing to pay premium prices" },
                { "id": "ops", "text": "Easier to adapt messaging and brand" },
                { "id": "brand", "text": "Existing brand awareness may carry over" },
                { "id": "comp", "text": "Fewer competitors to differentiate from" }
              ]
            }
          ]
        },
        "textarea": {
          "label": "Step 3 — Write your recommendation",
          "helperHtml": "Write a short recommendation the CEO can read in 60 seconds. <strong>Lead with your city choice.</strong> Then explain the top two reasons and acknowledge the biggest risk.",
          "structureTip": "Start with: \"I recommend entering [city] because...\" Then two reasons. Then: \"The main risk is X, which we can mitigate by Y.\" Executives read the first sentence and skim the rest — lead with the answer.",
          "placeholder": "I recommend entering [city] because...",
          "wordLimit": 150
        },
        "resources": [
          { "title": "How to write a board-ready recommendation", "subtitle": "Framework · 2 min read", "icon": "📄" },
          { "title": "Example: anonymised passing recommendation", "subtitle": "Opens in side drawer", "icon": "💬" },
          { "title": "What makes a recommendation weak", "subtitle": "Common mistakes · 1 min read", "icon": "⚡" }
        ]
      },
      {
        "type": "curveball",
        "title": "Handle the curveball",
        "durationMin": 20,
        "scoredOn": ["Judgment", "Composure", "Communication"],
        "curveballHtml": "You sent your recommendation to the CEO an hour ago. She just forwarded you this: <strong>Patagonia has announced a pop-up store in your recommended market opening in 6 weeks</strong>, targeting the exact same 25–35 urban sustainability customer. They have a €2M marketing budget for the launch and strong brand recognition.<br><br>The CEO's message: <em>\"Saw this. Does this change anything? Need your take before I present to the board in 90 minutes.\"</em>",
        "recapText": "I recommend entering [your city] — strong spend per capita, cultural proximity to Germany, and manageable competitor density. Main risk is localisation cost, which we can offset by testing online-first before committing to a pop-up.",
        "insight": {
          "label": "How senior analysts handle this",
          "text": "Don't panic and flip your recommendation — that signals weak conviction. Don't ignore the threat either — that signals poor judgment. The move is to acknowledge the new information, assess whether it actually changes the core logic, and give a clear updated view. Take a position."
        },
        "stancePicker": {
          "options": [
            {
              "id": "hold",
              "icon": "🎯",
              "title": "Hold the recommendation",
              "sub": "It still makes sense — here's why Patagonia doesn't change it",
              "coachingHint": "Strong conviction — this is usually the right instinct if your original logic was sound. Make sure you explain why Patagonia's entry doesn't invalidate your core argument."
            },
            {
              "id": "switch",
              "icon": "🔄",
              "title": "Switch to a different city",
              "sub": "The competitive risk is too high — better to move to the next best option",
              "coachingHint": "Defensible, but risky — switching at the first sign of competition can look reactive. You'll need a very clear reason why the alternative is better, not just that the original got harder."
            },
            {
              "id": "delay",
              "icon": "⏸️",
              "title": "Delay the decision",
              "sub": "Wait to see how Patagonia's launch goes before committing",
              "coachingHint": "Hard to justify — the CEO has a board meeting in 90 minutes. 'Wait and see' isn't an answer she can take into a room of investors. Avoid this."
            },
            {
              "id": "adapt",
              "icon": "⚡",
              "title": "Adapt the approach",
              "sub": "Keep the city but change the entry strategy to reduce head-on competition",
              "coachingHint": "Often the smartest move — it shows you can hold a position and update your approach simultaneously. What specifically would you change?"
            }
          ]
        },
        "textarea": {
          "label": "Step 2 — Write your response to the CEO",
          "helperHtml": "You have 90 minutes before her board presentation. Write the message you'd send back. <strong>100 words max.</strong> Lead with your position, give two reasons, and end with what you'd do next.",
          "placeholder": "Hi [CEO name], I've looked at the Patagonia news. My view is...",
          "wordLimit": 100
        }
      }
    ]
  }
];
