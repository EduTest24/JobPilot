"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": [
    {
      "skill": "string",
      "sources": [
        { "name": "string", "type": "Video" | "Course" | "Documentation" | "Article", "url": "string" }
      ]
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON. No extra text, no markdown formatting.
- Include at least 5 common roles for salary ranges.
- Growth rate should be a percentage number.
- Include at least 5 skills and 5 trends.
- For each recommended skill, provide 3 trusted sources (official docs, YouTube, or courses).
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err) {
    console.error("❌ Invalid JSON from AI:", err.message);
    throw new Error("AI returned invalid JSON");
  }

  // ✅ Sanitize & normalize
  const safe = {
    salaryRanges: Array.isArray(parsed.salaryRanges)
      ? parsed.salaryRanges.flat(3).filter((r) => r.role && r.min && r.max)
      : [],

    growthRate:
      typeof parsed.growthRate === "number"
        ? parsed.growthRate
        : parseFloat(String(parsed.growthRate).replace(/[^0-9.]/g, "")) || 0,

    demandLevel: ["High", "Medium", "Low"].includes(parsed.demandLevel)
      ? parsed.demandLevel
      : "Medium",

    topSkills: Array.isArray(parsed.topSkills)
      ? parsed.topSkills
          .flat(2)
          .map((s) => String(s))
          .slice(0, 10)
      : [],

    marketOutlook: ["Positive", "Neutral", "Negative"].includes(
      parsed.marketOutlook
    )
      ? parsed.marketOutlook
      : "Neutral",

    keyTrends: Array.isArray(parsed.keyTrends)
      ? parsed.keyTrends
          .flat(2)
          .map((t) => String(t))
          .slice(0, 10)
      : [],

    recommendedSkills: Array.isArray(parsed.recommendedSkills)
      ? parsed.recommendedSkills.flat(3).map((r) => ({
          skill: String(r.skill || ""),
          sources: Array.isArray(r.sources)
            ? r.sources
                .flat(2)
                .slice(0, 3)
                .map((s) => ({
                  name: String(s.name || ""),
                  type: String(s.type || "Article"),
                  url: String(s.url || ""),
                }))
            : [],
        }))
      : [],
  };

  return safe;
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
