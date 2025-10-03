# 🚀 JobPilot

JobPilot is a modern career-building platform built with **Next.js**.  
It provides industry insights for your profile, helps you take mock tests to get interview-ready, and assists in creating professional resumes and cover letters.

---

## ✨ Features

- 📊 **Industry Insights** – Personalized insights and suggestions for your career profile
- 📝 **Resume & Cover Letter Builder** – Create polished job application documents
- 🧑‍💻 **Mock Tests** – Practice tests to become interview-ready
- 🤝 **Career Tools** – Helping you prepare for real-world job opportunities
- 🔑 **Authentication** with Clerk
- 🎨 **Modern UI** with Tailwind CSS + shadcn/ui
- ⚡ **Fast & Optimized** with Next.js (App Router)
- 🔮 **AI-Powered** – Integrated with Google Gemini API for intelligent insights
- ⏱️ **Background Jobs** with Inngest (async workflows)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Frontend:** React, TailwindCSS, [shadcn/ui](https://ui.shadcn.com/)
- **Auth:** [Clerk](https://clerk.com)
- **Database:** [NeonDB (PostgreSQL)](https://neon.tech) with [Prisma ORM](https://www.prisma.io/)
- **Background Jobs:** [Inngest](https://www.inngest.com/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/jobpilot.git
cd jobpilot


2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Configure environment variables

Create a .env.local file in the root directory:

# Database (NeonDB)
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key


👉 Replace placeholders with your actual credentials.

4️⃣ Setup Prisma
npx prisma generate
npx prisma migrate dev --name init

5️⃣ Run the development server
npm run dev
# or
yarn dev


The app will be available at:
👉 http://localhost:3000

🌐 Deployment

You can deploy JobPilot on Vercel:

Push your repo to GitHub/GitLab

Import into Vercel

Add your .env.local variables in Vercel Project Settings

Deploy 🎉

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Check the issues page
 for open tasks.


```
