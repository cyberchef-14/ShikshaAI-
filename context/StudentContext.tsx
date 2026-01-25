import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentDigitalTwin, Language, ConceptNode, QueryEntry, MistakeRecord, Quiz, QuizType, ActivityLog } from '../types';
import { CONCEPT_GRAPH, QUIZZES } from '../data/curriculum';
import { storageService } from '../services/storageService';
import { generateDynamicQuizQuestions } from '../services/geminiService';

interface StudentContextType {
  digitalTwin: StudentDigitalTwin;
  updateMastery: (conceptId: string, score: number) => void;
  completeActivity: (conceptId: string, score: number, type: 'quiz' | 'lesson') => void; // NEW
  markAsStarted: (conceptId: string) => void;
  switchLanguage: (lang: Language) => void;
  getUnlockedConcepts: () => ConceptNode[];
  getRecommendedConcept: () => ConceptNode | null;
  addXP: (amount: number) => void;
  recordMistake: (conceptId: string) => void;
  recordQuizMistake: (questionId: string, text: string, wrongAns: string, correctAns: string, conceptId: string) => void;
  generateAdaptiveQuiz: (conceptId: string) => Promise<Quiz>;
  saveQuery: (question: string, answer: string, conceptId?: string) => void;
  updateDifficulty: (level: number) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [digitalTwin, setDigitalTwin] = useState<StudentDigitalTwin>(() => {
    const student = storageService.getActiveStudent();
    // Safety check for legacy data in localStorage
    return {
        ...student,
        mistakeLog: student.mistakeLog || [],
        confusionPoints: student.confusionPoints || [],
        difficultyLevel: student.difficultyLevel || 50
    };
  });

  useEffect(() => {
    storageService.saveActiveStudent(digitalTwin);
  }, [digitalTwin]);

  const getUnlockedConcepts = () => {
    return CONCEPT_GRAPH.filter(node => {
      if ((digitalTwin.masteryMap[node.id] || 0) >= 0.8) return true;
      const prereqsMet = node.prerequisites.every(prereqId => {
        return (digitalTwin.masteryMap[prereqId] || 0) >= 0.7;
      });
      return prereqsMet || node.prerequisites.length === 0;
    });
  };

  const getRecommendedConcept = () => {
    if ((digitalTwin.masteryMap['c10_chem_rxn_full'] || 0) < 0.8) {
        return CONCEPT_GRAPH.find(n => n.id === 'c10_chem_rxn_full') || null;
    }
    const unlocked = getUnlockedConcepts();
    return unlocked.find(node => (digitalTwin.masteryMap[node.id] || 0) < 0.8) || null;
  };

  const updateMastery = (conceptId: string, delta: number) => {
    setDigitalTwin(prev => {
      const currentScore = prev.masteryMap[conceptId] || 0;
      const newScore = Math.min(1, Math.max(0, currentScore + delta));
      return {
        ...prev,
        masteryMap: {
          ...prev.masteryMap,
          [conceptId]: newScore
        }
      };
    });
  };

  // NEW: Central handler for finishing activities to update Stats dynamically
  const completeActivity = (conceptId: string, score: number, type: 'quiz' | 'lesson') => {
    setDigitalTwin(prev => {
        // 1. Update Mastery (Keep highest)
        const currentMastery = prev.masteryMap[conceptId] || 0;
        const newMastery = Math.max(currentMastery, score);
        const masteryMap = { ...prev.masteryMap, [conceptId]: newMastery };

        // 2. Calculate XP
        const earnedXP = type === 'quiz' ? Math.round(score * 100) : 50;
        const newXP = prev.xp + earnedXP;

        // 3. Update Streak
        const lastActivity = prev.recentActivities[0];
        const lastDate = lastActivity ? new Date(lastActivity.timestamp).toDateString() : null;
        const today = new Date().toDateString();
        
        let newStreak = prev.streak;
        if (lastDate !== today) {
            // Simple streak logic: If last activity was NOT today, increment.
            // (Real app would check for yesterday vs older to reset)
            newStreak += 1; 
        }

        // 4. Update Rank
        let newRank = prev.rank;
        if (newXP > 200 && newRank === "Lab Assistant") newRank = "Junior Scientist";
        if (newXP > 600 && newRank === "Junior Scientist") newRank = "Lab Lead";
        if (newXP > 1500 && newRank === "Lab Lead") newRank = "Nobel Aspirant";

        // 5. Update Activity Log
        const conceptTitle = CONCEPT_GRAPH.find(c => c.id === conceptId)?.title || conceptId;
        const newLog: ActivityLog = {
            id: Date.now().toString(),
            type: type === 'quiz' ? 'quiz_complete' : 'concept_mastered',
            message: type === 'quiz' 
                ? `Scored ${Math.round(score*100)}% in ${conceptTitle}` 
                : `Completed lesson: ${conceptTitle}`,
            timestamp: Date.now()
        };

        // 6. Clear Confusion Point if Mastery is good
        let confusionPoints = prev.confusionPoints;
        if (score > 0.7) {
            confusionPoints = confusionPoints.filter(id => id !== conceptId);
        }

        return {
            ...prev,
            xp: newXP,
            streak: newStreak,
            rank: newRank,
            masteryMap,
            confusionPoints,
            recentActivities: [newLog, ...prev.recentActivities].slice(0, 20)
        };
    });
  };

  const markAsStarted = (conceptId: string) => {
    setDigitalTwin(prev => {
      const currentScore = prev.masteryMap[conceptId] || 0;
      if (currentScore === 0) {
        return {
            ...prev,
            masteryMap: { ...prev.masteryMap, [conceptId]: 0.05 }
        };
      }
      return prev;
    });
  };

  const addXP = (amount: number) => {
    setDigitalTwin(prev => {
        const newXP = prev.xp + amount;
        return { ...prev, xp: newXP };
    });
  };

  const switchLanguage = (lang: Language) => {
    setDigitalTwin(prev => ({ ...prev, currentLanguage: lang }));
  };

  const recordMistake = (conceptId: string) => {
    setDigitalTwin(prev => {
        if (prev.confusionPoints.includes(conceptId)) return prev;
        return {
            ...prev,
            confusionPoints: [...prev.confusionPoints, conceptId]
        };
    });
  };

  const recordQuizMistake = (qId: string, text: string, wrongAns: string, correctAns: string, conceptId: string) => {
      setDigitalTwin(prev => {
          const existing = prev.mistakeLog?.find(m => m.questionText === text);
          if (existing && !existing.resolved) return prev;

          const newMistake: MistakeRecord = {
              id: Date.now().toString(),
              questionText: text,
              wrongAnswer: wrongAns,
              correctAnswer: correctAns,
              conceptId: conceptId,
              timestamp: Date.now(),
              retryCount: 0,
              resolved: false
          };
          
          return {
              ...prev,
              mistakeLog: [...(prev.mistakeLog || []), newMistake],
              confusionPoints: Array.from(new Set([...prev.confusionPoints, conceptId]))
          };
      });
  };

  const generateAdaptiveQuiz = async (conceptId: string): Promise<Quiz> => {
      const concept = CONCEPT_GRAPH.find(c => c.id === conceptId);
      if (!concept) throw new Error("Concept not found");

      const mistakes = digitalTwin.mistakeLog?.filter(m => m.conceptId === conceptId && !m.resolved) || [];
      
      const aiQuestions = await generateDynamicQuizQuestions(
          concept.title, 
          mistakes.map(m => ({ question: m.questionText, concept: concept.title })),
          3 
      );

      const adaptedQuestions = aiQuestions.map(q => ({
          ...q,
          isRetry: mistakes.length > 0 
      }));

      const staticQuiz = QUIZZES[conceptId];
      const staticQuestions = staticQuiz ? staticQuiz.questions.slice(0, 2) : [];
      
      const finalQuestions = [...adaptedQuestions, ...staticQuestions].sort(() => Math.random() - 0.5);

      return {
          id: `adaptive_${Date.now()}`,
          chapterId: conceptId,
          type: QuizType.ADAPTIVE,
          title: `Adaptive Quiz: ${concept.title}`,
          durationMinutes: 10,
          questions: finalQuestions
      };
  };

  const saveQuery = (question: string, answer: string, conceptId?: string) => {
    const newEntry: QueryEntry = {
        id: Date.now().toString(),
        question,
        answer,
        timestamp: Date.now(),
        conceptId
    };
    setDigitalTwin(prev => ({
        ...prev,
        queryNotebook: [newEntry, ...prev.queryNotebook]
    }));
  };

  const updateDifficulty = (level: number) => {
    setDigitalTwin(prev => ({
        ...prev,
        difficultyLevel: level
    }));
  };

  return (
    <StudentContext.Provider value={{ 
      digitalTwin, 
      updateMastery, 
      completeActivity,
      markAsStarted,
      switchLanguage, 
      getUnlockedConcepts, 
      getRecommendedConcept,
      addXP,
      recordMistake,
      recordQuizMistake,
      generateAdaptiveQuiz,
      saveQuery,
      updateDifficulty
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudent must be used within StudentProvider");
  return context;
};