import { GoogleGenAI } from "@google/genai";
import { StudentDigitalTwin } from "../types";

// Helper to safely get API Key
const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        // Fallback for vite environments that might use import.meta.env but usually process is shimmed.
        // If not shimmed, we return undefined safely.
        return undefined;
    } catch (e) {
        return undefined;
    }
}

// We use this only for the "Explain My Mistake" feature
export const analyzeMistake = async (
  questionText: string,
  studentAnswer: string,
  correctAnswer: string,
  concept: string,
  language: string
): Promise<string> => {
  const apiKey = getApiKey();

  // Fallback if no API key is present (Mock AI)
  if (!apiKey) {
    console.warn("No API Key found. Using Mock AI response.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          language === 'hi'
            ? `AI Analysis (Mock): Aap shayad denominator (neeche wala number) mein confuse ho gaye. Sahi uttar ${correctAnswer} hai kyunki...`
            : `AI Analysis (Mock): It seems you might be confusing the denominator. The correct answer is ${correctAnswer} because...`
        );
      }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Act as a friendly tutor for a student in India.
      The student made a mistake on a math question about "${concept}".
      Question: "${questionText}"
      Student Answer: "${studentAnswer}"
      Correct Answer: "${correctAnswer}"
      
      Explain WHY they might be wrong and guide them to the correct answer.
      Keep it short (max 2 sentences).
      Language: ${language === 'hi' ? 'Hinglish (Hindi written in English)' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI is currently offline. Please review the concept notes.";
  }
};

// NEW: General Q&A Bot for Lessons
export const getAIResponse = async (
    query: string,
    currentContext: string,
    language: string
): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("This is a mock response. Please add your API key to get real AI answers.");
            }, 1000);
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            You are a helpful and encouraging Science teacher for Class 10 students in India.
            
            Current Lesson Context: "${currentContext}"
            Student's Question: "${query}"
            
            Answer the question simply and clearly. Use analogies if possible.
            If the student asks in Hinglish, reply in Hinglish.
            If the context is provided, try to relate the answer to the current lesson.
            Keep it concise (max 3-4 sentences).
            
            Target Language Style: ${language === 'hi' ? 'Hinglish (Conversational Hindi + English terms)' : 'Simple English'}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "I couldn't understand that. Can you try asking differently?";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I'm having trouble connecting to the internet right now. Please try again later.";
    }
}

// NEW: Generate Quiz for Teacher Dashboard
export const generateQuizForTopic = async (
  topicTitle: string,
  difficulty: 'Medium' | 'Hard'
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(`
# Mock Quiz: ${topicTitle} (${difficulty})

1. What is the main principle of ${topicTitle}?
   A) Option 1
   B) Option 2
   C) Option 3
   D) Option 4

2. Explain an example of this concept in daily life.
              `);
          }, 2000);
      });
  }

  try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
          Create a short 3-question quiz for Class 10 students on the topic: "${topicTitle}".
          Difficulty Level: ${difficulty}.
          Format: 
          - Question 1 (Multiple Choice)
          - Question 2 (True/False)
          - Question 3 (Short Answer thought provoker)
          
          Include Answer Key at the bottom.
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });

      return response.text || "Failed to generate quiz.";
  } catch (error) {
      console.error("Gemini Quiz Gen Error:", error);
      return "Error generating quiz. Please check internet connection.";
  }
}

// NEW: Advanced Student Analysis Report
export const generateStudentAnalysis = async (student: StudentDigitalTwin): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(`**Mock Analysis for ${student.name}:**\n\nThe student shows strength in biology but struggles with chemical formulas. Recommend assigning visual aids for balancing equations.`);
          }, 1500);
      });
  }

  try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
          Analyze this student's performance data and generate a brief pedagogical report for the teacher.
          
          Student Name: ${student.name}
          Learning Style: ${student.learningStyle}
          Confusion Points (Concepts struggling with): ${student.confusionPoints.join(', ') || 'None'}
          Recent Queries: ${student.queryNotebook.slice(0, 3).map(q => q.question).join(' | ')}
          Mastery Data: ${JSON.stringify(student.masteryMap)}
          
          Report Structure:
          1. **Strength Area**: One sentence.
          2. **Critical Gap**: Explain WHY they might be struggling with their confusion points based on their learning style.
          3. **Actionable Recommendation**: Suggest a specific activity (e.g., "Assign video on X").
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });

      return response.text || "Analysis unavailable.";
  } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Could not generate analysis due to connection error.";
  }
};

// NEW: Generate Personalized Weekly Study Plan
export const generateWeeklyPlan = async (student: StudentDigitalTwin): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const weakAreas = student.confusionPoints.length > 0 ? student.confusionPoints.join(", ") : "Advanced Chemistry";
                resolve(`
**Your Power Week Plan 🚀**

**Monday: Foundations**
*   **Focus:** ${weakAreas}
*   **Action:** Read the 'Micro-Note' for this topic twice.
*   **Tip:** Since you are a ${student.learningStyle} learner, try drawing a diagram.

**Tuesday: Practice**
*   **Focus:** Quiz Session
*   **Action:** Take a 'Confidence Quiz' to boost morale.

**Wednesday: Real World**
*   **Focus:** Application
*   **Action:** Look for examples of ${weakAreas} in your kitchen or home.

**Thursday: Deep Dive**
*   **Focus:** Hardest Concept
*   **Action:** Use the 'Ask AI' feature to clarify one specific doubt.

**Friday: Review**
*   **Focus:** Weekly Recap
*   **Action:** Re-attempt any questions you got wrong this week.

**Weekend:** Rest & Light Reading!
                `);
            }, 2000);
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            Create a personalized 5-day study plan (Monday to Friday) for a student named ${student.name}.
            
            **Student Profile:**
            - Learning Style: ${student.learningStyle}
            - Weak Areas/Confusion Points: ${student.confusionPoints.join(', ') || 'General Revision'}
            - Current Mastery Levels: ${JSON.stringify(student.masteryMap)}
            
            **Instructions:**
            1. Create a day-by-day plan.
            2. Each day should have a specific "Focus" and a concrete "Action" (e.g., "Take a quiz", "Read Micro-note").
            3. tailor the "Action" to their learning style (e.g., for Visual learners suggest diagrams/videos, for Textual suggest reading/summarizing).
            4. Keep it encouraging and concise.
            5. Use Markdown formatting.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "Could not generate plan.";
    } catch (error) {
        console.error("Gemini Plan Error:", error);
        return "Could not generate plan due to connection error.";
    }
}

// === FEATURE: Explain Like I'm... (Complexity Slider) ===
export const rewriteContent = async (text: string, level: string, language: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
      return new Promise((resolve) => {
          setTimeout(() => {
              if (level === '5-year-old') return resolve("Imagine this like a lego set! " + text);
              if (level === 'Professor') return resolve("In academic terms: " + text);
              resolve(text);
          }, 500);
      });
  }

  try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
          Rewrite the following educational content for a specific audience.
          Original Text: "${text}"
          Target Audience: ${level}
          Language: ${language === 'hi' ? 'Hindi (Simple, Conversational)' : 'English'}.
          
          Guidelines:
          - If '5-year-old': Use emojis, simple analogies (toys, food), and very short sentences.
          - If 'Professor': Use technical jargon, deeper scientific terms, and formal tone.
          - Keep the core scientific fact correct.
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });

      return response.text || text;
  } catch (error) {
      console.error("Rewriting Error:", error);
      return text;
  }
};

// === FEATURE: Viva Voce Examiner ===
export const evaluateVivaAnswer = async (
  question: string, 
  transcript: string
): Promise<{ score: number, feedback: string, confidence: number }> => {
  const apiKey = getApiKey();

  if (!apiKey) {
      return new Promise((resolve) => resolve({
          score: 85,
          feedback: "Great attempt! You covered the main points but missed the keyword 'Electron Transfer'.",
          confidence: 80
      }));
  }

  try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
          You are an oral examiner for a science viva.
          Question Asked: "${question}"
          Student's Spoken Answer: "${transcript}"
          
          Evaluate this answer.
          Return a JSON object:
          {
            "score": (0-100),
            "feedback": "Short, encouraging feedback pointing out missing keywords or praising good understanding.",
            "confidence": (Estimate confidence based on sentence structure, 0-100)
          }
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });

      const jsonStr = response.text || "{}";
      return JSON.parse(jsonStr);
  } catch (error) {
      console.error("Viva Eval Error:", error);
      return { score: 0, feedback: "Error evaluating response.", confidence: 0 };
  }
};

// === FEATURE: Socratic Debate Arena ===
export const getDebateResponse = async (
  topic: string,
  history: { role: 'ai' | 'user', text: string }[]
): Promise<{ reply: string, logicScoreChange: number, isWin: boolean }> => {
  const apiKey = getApiKey();

  if (!apiKey) {
      return new Promise(resolve => resolve({
          reply: "That's a fair point, but have you considered the environmental cost?",
          logicScoreChange: 5,
          isWin: false
      }));
  }

  try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
          You are a Socratic Opponent in a debate about: "${topic}".
          Debate History: ${JSON.stringify(history)}
          
          Your Goal: Challenge the user's logic politely but firmly. Use the Socratic method (ask questions).
          
          Output JSON:
          {
            "reply": "Your counter-argument or question (max 2 sentences)",
            "logicScoreChange": (Integer between -10 and +20. Positive if user made a good point, negative if they used a fallacy),
            "isWin": (Boolean. True ONLY if the user has successfully defended their stance logically and convinced you)
          }
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || "{}");
  } catch (error) {
      console.error("Debate Error:", error);
      return { reply: "I see your point.", logicScoreChange: 0, isWin: false };
  }
};