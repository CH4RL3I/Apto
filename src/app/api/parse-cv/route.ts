import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
        { status: 500 }
      );
    }

    // Read file as base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Determine mime type
    let mimeType = "application/pdf";
    if (file.name.endsWith(".docx")) {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      {
        text: `You are a CV/resume parser. Extract structured information from this CV document and return ONLY valid JSON with no markdown formatting, no code fences, no extra text.

Return exactly this JSON structure:
{
  "name": "Full name of the candidate or null if not found",
  "education": "Highest degree and institution, e.g. 'BSc Computer Science, University of Lisbon' or null",
  "experience": ["Array of work experiences as short strings, e.g. 'Marketing Intern at Company X (6 months)'"],
  "skills": ["Array of skills extracted from the CV, e.g. 'Python', 'Data Analysis', 'Project Management'"],
  "languages": ["Array of languages with proficiency, e.g. 'English (Fluent)', 'Portuguese (Native)'"]
}

Rules:
- Extract real data from the document. Do not fabricate anything.
- If a field cannot be determined, use null for strings or empty array [] for arrays.
- Keep experience entries concise (under 15 words each).
- Extract ALL skills mentioned, including tools, frameworks, and soft skills.
- Return ONLY the JSON object, nothing else.`,
      },
    ]);

    const responseText = result.response.text().trim();

    // Clean the response - strip markdown code fences if present
    let jsonString = responseText;
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonString);

    return NextResponse.json({
      name: parsed.name || null,
      education: parsed.education || null,
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
    });
  } catch (error) {
    console.error("CV parse error:", error);
    const detail =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json(
      { error: `Failed to parse CV: ${detail}` },
      { status: 500 }
    );
  }
}
