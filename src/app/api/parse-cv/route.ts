import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const cvSchema = {
  type: SchemaType.OBJECT,
  required: ["name", "education", "experience", "skills", "languages"],
  properties: {
    name: { type: SchemaType.STRING, nullable: true },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["degree", "field", "institution"],
        properties: {
          degree: { type: SchemaType.STRING },
          field: { type: SchemaType.STRING },
          institution: { type: SchemaType.STRING },
          year_start: { type: SchemaType.STRING, nullable: true },
          year_end: { type: SchemaType.STRING, nullable: true },
        },
      },
    },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["role", "company"],
        properties: {
          role: { type: SchemaType.STRING },
          company: { type: SchemaType.STRING },
          start: { type: SchemaType.STRING, nullable: true },
          end: { type: SchemaType.STRING, nullable: true },
          summary: { type: SchemaType.STRING, nullable: true },
        },
      },
    },
    skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    languages: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["language", "proficiency"],
        properties: {
          language: { type: SchemaType.STRING },
          proficiency: { type: SchemaType.STRING },
        },
      },
    },
  },
};

interface EducationEntry {
  degree?: string;
  field?: string;
  institution?: string;
  year_start?: string | null;
  year_end?: string | null;
}

interface ExperienceEntry {
  role?: string;
  company?: string;
  start?: string | null;
  end?: string | null;
  summary?: string | null;
}

interface LanguageEntry {
  language?: string;
  proficiency?: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    let mimeType = "application/pdf";
    if (file.name.endsWith(".docx")) {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // The SDK's Schema union is awkwardly discriminated by type;
        // the literal validates at runtime but trips TS narrowing through
        // nested object/array shapes.
        responseSchema: cvSchema as Schema,
        temperature: 0.1,
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      {
        text: `You are a CV parser. Extract structured information from the attached CV.

Field rules:
- name: candidate's full name as written on the CV. null if absent.
- education: every degree/diploma. "field" = the subject (e.g. "Computer Science"). Years as "YYYY" or "YYYY-MM". If only one year is given, fill year_end and leave year_start null.
- experience: every job, internship, or substantive volunteering. "summary" ≤30 words, focus on what they did, not the company description. "end" may be "Present".
- skills: extract skills from BOTH the Skills section AND every experience, project, internship, and education entry. Pull every tool, software, programming language, library, framework, platform, methodology, technique, certification, and substantive soft skill named anywhere in the CV — not just the dedicated Skills section. Examples to capture: "built dashboards in Tableau" → Tableau; "led weekly sprint planning" → Agile, Sprint Planning; "wrote SQL queries against BigQuery" → SQL, BigQuery; "managed stakeholder relationships across 4 teams" → Stakeholder Management. Deduplicate (case-insensitive). Use canonical names (e.g. "PowerPoint" not "Power Point"; "JavaScript" not "JS"). No proficiency suffix. Aim for 10–25 skills for a typical CV — if you return fewer than 8, you almost certainly missed implicit ones in the experience descriptions.
- languages: spoken/written languages with proficiency normalized to one of: Native, Fluent, Advanced, Intermediate, Basic.

Do not invent data. If a section is genuinely missing, return an empty array.`,
      },
    ]);

    const parsed = JSON.parse(result.response.text());

    // Flatten the rich structure back to the flat shape the UI expects.
    const educationEntries = (parsed.education ?? []) as EducationEntry[];
    const educationLine = educationEntries[0]
      ? [
          educationEntries[0].degree,
          educationEntries[0].field,
          educationEntries[0].institution ? "·" : null,
          educationEntries[0].institution,
        ]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+·\s+/, " · ")
      : null;

    const experienceLines = ((parsed.experience ?? []) as ExperienceEntry[]).map((e) => {
      const dates = [e.start, e.end].filter(Boolean).join("–");
      const head = `${e.role ?? ""}${e.company ? ` at ${e.company}` : ""}${dates ? ` (${dates})` : ""}`.trim();
      return e.summary ? `${head} — ${e.summary}` : head;
    });

    const languageLines = ((parsed.languages ?? []) as LanguageEntry[]).map(
      (l) => `${l.language ?? ""}${l.proficiency ? ` (${l.proficiency})` : ""}`.trim(),
    );

    return NextResponse.json({
      name: parsed.name ?? null,
      education: educationLine,
      experience: experienceLines,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      languages: languageLines,
    });
  } catch (error) {
    console.error("CV parse error:", error);
    const detail =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json(
      { error: `Failed to parse CV: ${detail}` },
      { status: 500 },
    );
  }
}
