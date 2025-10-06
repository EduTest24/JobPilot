"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // 🔹 Check if industry insights already exist
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    // 🔹 If not, generate and safely insert insights
    if (!industryInsight) {
      let insights = null;
      try {
        insights = await generateAIInsights(data.industry);
      } catch (err) {
        console.error("❌ AI generation failed:", err);
      }

      // ✅ Fallback if AI fails or returns invalid data
      if (!insights || typeof insights !== "object") {
        console.warn("⚠️ Using fallback insights for", data.industry);
        insights = {
          salaryRanges: [],
          growthRate: 0,
          demandLevel: "Medium",
          topSkills: [],
          marketOutlook: "Neutral",
          keyTrends: [],
          recommendedSkills: [],
        };
      }

      // ✅ Sanitize data before saving to DB
      const safeInsights = {
        salaryRanges: Array.isArray(insights.salaryRanges)
          ? insights.salaryRanges
          : [],
        growthRate:
          typeof insights.growthRate === "number" ? insights.growthRate : 0,
        demandLevel:
          typeof insights.demandLevel === "string"
            ? insights.demandLevel
            : "Medium",
        topSkills: Array.isArray(insights.topSkills) ? insights.topSkills : [],
        marketOutlook:
          typeof insights.marketOutlook === "string"
            ? insights.marketOutlook
            : "Neutral",
        keyTrends: Array.isArray(insights.keyTrends) ? insights.keyTrends : [],
        recommendedSkills: Array.isArray(insights.recommendedSkills)
          ? insights.recommendedSkills
          : [],
      };

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,

          // ✅ Wrap arrays meant to be JSON documents
          salaryRanges: safeInsights.salaryRanges, // Json field
          recommendedSkills: safeInsights.recommendedSkills, // Json field

          // ✅ Plain fields
          growthRate: safeInsights.growthRate,
          demandLevel: safeInsights.demandLevel,
          marketOutlook: safeInsights.marketOutlook,

          // ✅ Simple string arrays
          topSkills: safeInsights.topSkills,
          keyTrends: safeInsights.keyTrends,

          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // 🔹 Update user info
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    revalidatePath("/");
    return updatedUser;
  } catch (error) {
    const safeError =
      error && typeof error === "object"
        ? error
        : { message: String(error || "Unknown error") };

    console.error(
      "❌ Error updating user and industry:",
      safeError.message || safeError
    );
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
