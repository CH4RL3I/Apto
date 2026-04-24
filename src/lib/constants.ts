import { Question } from "@/types";

export const DIMENSIONS = [
  "analytical",
  "people",
  "creative",
  "strategic",
  "autonomous",
  "risk_tolerant",
  "collaborative",
  "structured",
] as const;

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "When approaching a new problem, you prefer to...",
    type: "single-select",
    options: [
      {
        label: "Jump in and iterate quickly",
        value: "iterate",
        dimensions: { creative: 0.8, risk_tolerant: 0.7, autonomous: 0.6 },
      },
      {
        label: "Research first, then plan carefully",
        value: "research",
        dimensions: { analytical: 0.8, structured: 0.7 },
      },
      {
        label: "Talk to people who've solved it before",
        value: "consult",
        dimensions: { people: 0.8, collaborative: 0.7 },
      },
      {
        label: "Break it into a spreadsheet and track every step",
        value: "spreadsheet",
        dimensions: { analytical: 0.9, structured: 0.9 },
      },
    ],
  },
  {
    id: 2,
    question: "Your ideal team size is...",
    type: "single-select",
    options: [
      {
        label: "Just me - solo work",
        value: "solo",
        dimensions: { autonomous: 0.9, collaborative: 0.1 },
      },
      {
        label: "A small squad (2-4 people)",
        value: "small",
        dimensions: { collaborative: 0.6, autonomous: 0.5 },
      },
      {
        label: "A medium team (5-15 people)",
        value: "medium",
        dimensions: { collaborative: 0.8, people: 0.6 },
      },
      {
        label: "Doesn't matter, I adapt",
        value: "flexible",
        dimensions: { collaborative: 0.5, autonomous: 0.5, people: 0.4 },
      },
    ],
  },
  {
    id: 3,
    question: "Where do you fall on this spectrum?",
    type: "slider",
    sliderConfig: {
      min: 0,
      max: 10,
      minLabel: "People problems",
      maxLabel: "System problems",
      dimensions: {
        low: { people: 0.9, collaborative: 0.6 },
        high: { analytical: 0.9, structured: 0.6 },
      },
    },
  },
  {
    id: 4,
    question: "How do you prefer to solve things?",
    type: "slider",
    sliderConfig: {
      min: 0,
      max: 10,
      minLabel: "Creative solutions",
      maxLabel: "Data-driven solutions",
      dimensions: {
        low: { creative: 0.9, risk_tolerant: 0.5 },
        high: { analytical: 0.9, structured: 0.5 },
      },
    },
  },
  {
    id: 5,
    question: "You're offered two jobs. Which appeals more?",
    type: "single-select",
    options: [
      {
        label: "Stable salary, clear growth path",
        value: "stable",
        dimensions: { structured: 0.8, risk_tolerant: 0.1 },
      },
      {
        label: "Startup equity, uncertain but exciting",
        value: "startup",
        dimensions: { risk_tolerant: 0.9, autonomous: 0.7, creative: 0.5 },
      },
      {
        label: "Somewhere in between",
        value: "balanced",
        dimensions: { risk_tolerant: 0.5, structured: 0.5 },
      },
    ],
  },
  {
    id: 6,
    question: "Which daily activities sound most appealing? (Pick up to 3)",
    type: "multi-select",
    maxSelections: 3,
    options: [
      {
        label: "Writing and communicating",
        value: "writing",
        dimensions: { creative: 0.6, people: 0.5, strategic: 0.5 },
      },
      {
        label: "Analyzing data",
        value: "data",
        dimensions: { analytical: 0.9, structured: 0.6 },
      },
      {
        label: "Designing visual things",
        value: "design",
        dimensions: { creative: 0.9, people: 0.4 },
      },
      {
        label: "Building and coding",
        value: "coding",
        dimensions: { analytical: 0.7, autonomous: 0.6, structured: 0.5 },
      },
      {
        label: "Managing and leading people",
        value: "managing",
        dimensions: { people: 0.8, strategic: 0.7, collaborative: 0.7 },
      },
      {
        label: "Presenting to stakeholders",
        value: "presenting",
        dimensions: { people: 0.7, strategic: 0.8, collaborative: 0.6 },
      },
      {
        label: "Researching and learning",
        value: "researching",
        dimensions: { analytical: 0.7, creative: 0.5, autonomous: 0.6 },
      },
      {
        label: "Solving customer problems",
        value: "customer",
        dimensions: { people: 0.9, collaborative: 0.6 },
      },
    ],
  },
  {
    id: 7,
    question: "What's your ideal work intensity?",
    type: "single-select",
    options: [
      {
        label: "Predictable 9-to-5",
        value: "predictable",
        dimensions: { structured: 0.9, risk_tolerant: 0.1 },
      },
      {
        label: "Mostly regular with occasional crunch",
        value: "mostly_regular",
        dimensions: { structured: 0.6, risk_tolerant: 0.4 },
      },
      {
        label: "High intensity, high reward",
        value: "intense",
        dimensions: { risk_tolerant: 0.8, strategic: 0.6, autonomous: 0.5 },
      },
      {
        label: "Flexible / async - I set my own rhythm",
        value: "flexible",
        dimensions: { autonomous: 0.9, creative: 0.4 },
      },
    ],
  },
  {
    id: 8,
    question: "How much structure do you want?",
    type: "slider",
    sliderConfig: {
      min: 0,
      max: 10,
      minLabel: "Clear processes and playbooks",
      maxLabel: "I figure it out myself",
      dimensions: {
        low: { structured: 0.9, collaborative: 0.5 },
        high: { autonomous: 0.9, creative: 0.5, risk_tolerant: 0.4 },
      },
    },
  },
  {
    id: 9,
    question: "What kind of impact excites you most?",
    type: "single-select",
    options: [
      {
        label: "Helping individual people directly",
        value: "individuals",
        dimensions: { people: 0.9, collaborative: 0.6 },
      },
      {
        label: "Building products millions use",
        value: "products",
        dimensions: { creative: 0.7, strategic: 0.8, risk_tolerant: 0.5 },
      },
      {
        label: "Making organizations more efficient",
        value: "efficiency",
        dimensions: { analytical: 0.8, strategic: 0.7, structured: 0.6 },
      },
      {
        label: "Discovering new knowledge",
        value: "discovery",
        dimensions: { analytical: 0.8, creative: 0.6, autonomous: 0.7 },
      },
    ],
  },
  {
    id: 10,
    question: "Where do you see yourself working? (Pick up to 2)",
    type: "multi-select",
    maxSelections: 2,
    options: [
      {
        label: "Office with a team",
        value: "office",
        dimensions: { collaborative: 0.8, people: 0.6, structured: 0.5 },
      },
      {
        label: "Remote from anywhere",
        value: "remote",
        dimensions: { autonomous: 0.8, creative: 0.4 },
      },
      {
        label: "Mix of office and field",
        value: "hybrid",
        dimensions: { people: 0.6, autonomous: 0.5, collaborative: 0.5 },
      },
      {
        label: "Lab or workshop",
        value: "lab",
        dimensions: { analytical: 0.7, creative: 0.5, autonomous: 0.6 },
      },
    ],
  },
];
