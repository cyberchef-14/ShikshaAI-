🎓 Shiksha AI

AI-Powered Personalized Learning Platform

Live Demo: https://shiksha-ai-nu.vercel.app/

📌 Overview

Shiksha AI is an AI-driven educational platform designed to provide personalized learning assistance to students. The system analyzes student inputs, identifies learning gaps, and generates intelligent feedback to improve conceptual understanding.

The platform aims to make education adaptive, accessible, and data-driven.

🚀 Features

🤖 AI-based answer evaluation

📊 Performance analytics dashboard

📈 Personalized feedback generation

📚 Subject-wise learning assistance

🎯 Weak area identification

🖥️ Clean and responsive UI

🌐 Deployed on Vercel

🏗️ System Architecture
Frontend (Next.js / React)
        │
        ▼
API Layer (Serverless / Backend)
        │
        ▼
AI Engine (LLM / ML Model)
        │
        ▼
Database (User + Performance Data)

🛠️ Tech Stack

Frontend

Next.js / React

Tailwind CSS / CSS Modules

Chart.js (for analytics)

Backend / API

Node.js / Serverless Functions

REST APIs

AI Layer

OpenAI API / Custom ML Model

NLP-based evaluation

Database

MongoDB / PostgreSQL / Firebase (update based on your stack)

Deployment

Vercel

📂 Project Structure
shiksha-ai/
│
├── components/        # Reusable UI components
├── pages/             # Application routes
├── api/               # Backend API routes
├── utils/             # Helper functions
├── public/            # Static assets
├── styles/            # Styling files
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/shiksha-ai.git
cd shiksha-ai

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env.local file:

OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_url

4️⃣ Run Locally
npm run dev


Visit:

http://localhost:3000

📊 How It Works

User submits question/answer.

System sends input to AI model.

AI evaluates content using NLP.

Feedback and suggestions are generated.

Results are stored for performance tracking.
