export type QuestionType = "single" | "multi" | "rank";

export interface QuestionOption {
  value: string;
  label: string;
}

export type Question =
  | {
      id: "openness" | "phase" | "mode" | "output";
      type: "single";
      title: string;
      hint: string;
      options: QuestionOption[];
    }
  | {
      id: "fields" | "industries";
      type: "multi";
      title: string;
      hint: string;
      max: number;
      options: QuestionOption[];
    }
  | {
      id: "values";
      type: "rank";
      title: string;
      hint: string;
      max: number;
      options: QuestionOption[];
    };

export interface Answers {
  openness?: string;
  fields?: string[];
  industries?: string[];
  phase?: string;
  mode?: string;
  output?: string;
  values?: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: "openness",
    type: "single",
    title: "How open is your job search?",
    hint: "Determines how broadly we suggest cases for you.",
    options: [
      { value: "precise", label: "I know pretty precisely what I'm looking for" },
      { value: "directional", label: "I have a direction but I'm open to variations" },
      { value: "explore", label: "I want to explore what might fit me" },
    ],
  },
  {
    id: "fields",
    type: "multi",
    max: 3,
    title: "Which fields interest you?",
    hint: "Pick up to 3 — forcing the trade-off sharpens priorities.",
    options: [
      { value: "Product", label: "Product & Strategy" },
      { value: "Engineering", label: "Engineering & Tech" },
      { value: "Data", label: "Data & Analytics" },
      { value: "Design", label: "Design & Creative" },
      { value: "Marketing", label: "Marketing & Brand" },
      { value: "Sales", label: "Sales & Business Development" },
      { value: "Operations", label: "Operations & Supply Chain" },
      { value: "People", label: "People & HR" },
      { value: "Finance", label: "Finance & Consulting" },
      { value: "Research", label: "Research & Science" },
      { value: "Customer", label: "Customer & Support" },
    ],
  },
  {
    id: "industries",
    type: "multi",
    max: 3,
    title: "Which industries do you want to work in?",
    hint: 'Max 3 — or pick "Role matters more".',
    options: [
      { value: "Tech", label: "Tech & Software" },
      { value: "Finance", label: "Finance & Banking" },
      { value: "Healthcare", label: "Healthcare & Biotech" },
      { value: "Consumer", label: "Consumer & Retail" },
      { value: "Industrial", label: "Industrial & Manufacturing" },
      { value: "Energy", label: "Energy & Sustainability" },
      { value: "Media", label: "Media & Entertainment" },
      { value: "Mobility", label: "Mobility & Logistics" },
      { value: "Public", label: "Public Sector & NGO" },
      { value: "Services", label: "Professional Services" },
      { value: "Sport", label: "Sport & Fitness" },
      { value: "Hospitality", label: "Hospitality & Travel" },
      { value: "Arts", label: "Arts & Culture" },
      { value: "RealEstate", label: "Real Estate & Architecture" },
      { value: "any", label: "Industry doesn't matter — role matters more" },
    ],
  },
  {
    id: "phase",
    type: "single",
    title: "What environment do you want to work in?",
    hint: "Company stage often shapes daily work more than industry does.",
    options: [
      { value: "startup", label: "Early-stage startup — build everything, high ownership, chaos included" },
      { value: "scaleup", label: "Growing scale-up — structures forming, fast pace" },
      { value: "corporate", label: "Established company — clear processes, specialization, stability" },
      { value: "any", label: "Doesn't matter — the specific job is what counts" },
    ],
  },
  {
    id: "mode",
    type: "single",
    title: "What does your ideal workday look like?",
    hint: "The most important filter between Maker and Coordinator roles.",
    options: [
      { value: "deep", label: "Focused solo work with few meetings — I set my own pace" },
      { value: "coordinator", label: "Lots of alignment, meetings, and stakeholder conversations shape my day" },
      { value: "mixed", label: "Alternating between concept work and execution, depending on the project phase" },
      { value: "reactive", label: "Close to customers or users, reactive — I solve concrete requests as they come in" },
    ],
  },
  {
    id: "output",
    type: "single",
    title: "What feels like a successful project?",
    hint: "Separates Creator, Optimizer, Enabler, and Advisor types.",
    options: [
      { value: "creator", label: "Something tangible was created — a product, analysis, design, text, or code" },
      { value: "optimizer", label: "A problem got solved or a process now runs measurably better" },
      { value: "enabler", label: "People or customers are visibly happier or more successful" },
      { value: "advisor", label: "A decision was made possible by my work" },
    ],
  },
  {
    id: "values",
    type: "rank",
    max: 3,
    title: "Between two good jobs, what would matter more to you?",
    hint: "Click your top 3 in order — makes trade-offs visible.",
    options: [
      { value: "content", label: "Exciting subject-matter work" },
      { value: "growth", label: "Learning and growth" },
      { value: "team", label: "Team and culture" },
      { value: "impact", label: "Impact and purpose" },
      { value: "flexibility", label: "Flexibility and work-life balance" },
      { value: "salary", label: "Compensation and benefits" },
    ],
  },
];
