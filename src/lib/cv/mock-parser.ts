// Mock CV parser for hackathon MVP
// In production, this would call OpenAI/Anthropic API to extract structured data
// For now, it returns plausible mock data based on the file name

export interface ParsedCV {
  name: string | null;
  education: string | null;
  experience: string[];
  skills: string[];
  languages: string[];
}

export function mockParseCV(fileName: string): ParsedCV {
  // Simulate a parsed CV with plausible data
  // In V2: send the file to an LLM with a structured extraction prompt
  return {
    name: null, // Will be filled from auth
    education: "Bachelor's in Business Administration",
    experience: [
      "Marketing Intern at StartupXYZ (6 months)",
      "Student Association President (1 year)",
      "Freelance Content Writer (ongoing)",
    ],
    skills: [
      "Data Analysis",
      "Communication",
      "Project Management",
      "Microsoft Excel",
      "Presentation Design",
      "Strategic Thinking",
    ],
    languages: ["English (Fluent)", "Portuguese (Native)"],
  };
}
