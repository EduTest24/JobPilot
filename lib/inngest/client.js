import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "jobpilot", // Unique app ID
  name: "JobPilot",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
