import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentDigitalTwin, Language, ConceptNode, QueryEntry } from '../types';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { storageService } from '../services/storageService';

interface StudentContextType {
  digitalTwin: StudentDigitalTwin;
  updateMastery: (conceptId: string, score: number) => void;
  switchLanguage: (lang: Language) => void;
  getUnlockedConcepts: () => ConceptNode[];
  getRecommendedConcept: () => ConceptNode | null;
  addXP: (amount: number) => void;
  recordMistake: (conceptId: string) => void;
  saveQuery: (question: string, answer: string, conceptId?: string) => void;
  updateDifficulty: (level: number) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from storageService instead of static default
  const [digitalTwin, setDigitalTwin] = useState<StudentDigitalTwin>(() => {
    return storageService.getActiveStudent();
  });

  // Effect: Whenever digitalTwin changes, save to local storage (Sync with Teacher View)
  useEffect(() => {
    storageService.saveActiveStudent(digitalTwin);
  }, [digitalTwin]);

  // CORE LOGIC: Concept Graph Traversal
  const getUnlockedConcepts = () => {
    return CONCEPT_GRAPH.filter(node => {
      // If mastered (>= 0.8), it's unlocked and done
      if ((digitalTwin.masteryMap[node.id] || 0) >= 0.8) return true;
      
      // If it has prerequisites, check them
      const prereqsMet = node.prerequisites.every(prereqId => {
        return (digitalTwin.masteryMap[prereqId] || 0) >= 0.7;
      });
      
      // If no prerequisites, it's unlocked by default (like the first chapter)
      return prereqsMet || node.prerequisites.length === 0;
    });
  };

  const getRecommendedConcept = () => {
    // Force start with the Full Chemical Reactions chapter if score is 0
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

  const addXP = (amount: number) => {
    setDigitalTwin(prev => {
        const newXP = prev.xp + amount;
        let newRank = prev.rank;
        if (newXP > 100) newRank = "Junior Scientist";
        if (newXP > 300) newRank = "Lab Lead";
        if (newXP > 1000) newRank = "Nobel Aspirant";
        
        return { ...prev, xp: newXP, rank: newRank };
    });
  };

  const switchLanguage = (lang: Language) => {
    setDigitalTwin(prev => ({ ...prev, currentLanguage: lang }));
  };

  const recordMistake = (conceptId: string) => {
    setDigitalTwin(prev => ({
        ...prev,
        confusionPoints: [...prev.confusionPoints, conceptId]
    }))
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
      switchLanguage, 
      getUnlockedConcepts, 
      getRecommendedConcept,
      addXP,
      recordMistake,
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
