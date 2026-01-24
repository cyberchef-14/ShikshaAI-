
import { StudentDigitalTwin, Language, ActivityLog } from '../types';

const STORAGE_KEY = 'shikshaai_classroom_db';
const ACTIVE_USER_ID = 's1'; // The ID of the user currently playing the "Student" role

// Seed Data (Simulated Classmates + The Active User)
const INITIAL_CLASS_DATA: StudentDigitalTwin[] = [
  { 
    id: 's1', // THIS IS YOU (The active user)
    name: "Amit Kumar (You)", 
    currentLanguage: Language.ENGLISH,
    masteryMap: { 'c10_chem_rxn_full': 0.0, 'c10_acids_bases': 0.0, 'c10_life_proc': 0.0, 'c10_light': 0.0 }, 
    confusionPoints: [],
    queryNotebook: [],
    recentActivities: [
        { id: 'a1', type: 'login', message: 'Logged in to Learning Portal', timestamp: Date.now() - 100000 }
    ],
    learningStyle: 'visual',
    difficultyLevel: 50, // Default Standard
    streak: 1,
    xp: 0,
    rank: 'Lab Assistant'
  },
  { 
    id: 's2', 
    name: "Sneha Gupta", 
    currentLanguage: Language.ENGLISH,
    masteryMap: { 'c10_chem_rxn_full': 0.5, 'c10_acids_bases': 0.6, 'c10_life_proc': 0.95, 'c10_light': 0.8 }, 
    confusionPoints: ["Balancing Equations"],
    queryNotebook: [],
    recentActivities: [
         { id: 'a2', type: 'quiz_complete', message: 'Completed Life Processes Quiz (95%)', timestamp: Date.now() - 3600000 },
         { id: 'a3', type: 'confusion_flagged', message: 'Struggling with Balancing Equations', timestamp: Date.now() - 7200000 }
    ],
    learningStyle: 'textual',
    difficultyLevel: 75,
    streak: 12,
    xp: 1200,
    rank: 'Nobel Aspirant'
  },
  { 
    id: 's3', 
    name: "Rahul Singh", 
    currentLanguage: Language.HINDI,
    masteryMap: { 'c10_chem_rxn_full': 0.3, 'c10_acids_bases': 0.2, 'c10_life_proc': 0.5, 'c10_light': 0.4 }, 
    confusionPoints: ["Acids vs Bases", "Refraction", "Redox"],
    queryNotebook: [],
    recentActivities: [
        { id: 'a4', type: 'confusion_flagged', message: 'Failed diagnostic on Acids', timestamp: Date.now() - 1800000 }
    ],
    learningStyle: 'visual',
    difficultyLevel: 30,
    streak: 3,
    xp: 350,
    rank: 'Junior Scientist'
  },
  { 
    id: 's4', 
    name: "Priya Sharma", 
    currentLanguage: Language.ENGLISH,
    masteryMap: { 'c10_chem_rxn_full': 0.95, 'c10_acids_bases': 0.9, 'c10_life_proc': 0.9, 'c10_light': 0.95 }, 
    confusionPoints: [],
    queryNotebook: [],
    recentActivities: [
        { id: 'a5', type: 'concept_mastered', message: 'Mastered Light: Reflection', timestamp: Date.now() - 900000 }
    ],
    learningStyle: 'textual',
    difficultyLevel: 90,
    streak: 45,
    xp: 2500,
    rank: 'Nobel Aspirant'
  },
  { 
    id: 's5', 
    name: "Vikram Malhotra", 
    currentLanguage: Language.HINDI,
    masteryMap: { 'c10_chem_rxn_full': 0.7, 'c10_acids_bases': 0.4, 'c10_life_proc': 0.6, 'c10_light': 0.3 }, 
    confusionPoints: ["pH Scale"],
    queryNotebook: [],
    recentActivities: [],
    learningStyle: 'visual',
    difficultyLevel: 50,
    streak: 5,
    xp: 600,
    rank: 'Lab Lead'
  }
];

export const storageService = {
  // Initialize DB if empty
  init: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLASS_DATA));
    }
  },

  // Get the active student for the Student View
  getActiveStudent: (): StudentDigitalTwin => {
    storageService.init();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return data.find((s: StudentDigitalTwin) => s.id === ACTIVE_USER_ID) || INITIAL_CLASS_DATA[0];
  },

  // Save the active student's progress
  saveActiveStudent: (updatedStudent: StudentDigitalTwin) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = data.findIndex((s: StudentDigitalTwin) => s.id === updatedStudent.id);
    
    if (index !== -1) {
      data[index] = updatedStudent;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Dispatch storage event manually for same-tab updates if needed (though 'storage' event is usually cross-tab)
    }
  },

  // Get ALL students for Teacher View
  getAllStudents: (): StudentDigitalTwin[] => {
    storageService.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  // Teacher assigns remedial (Modify specific student)
  updateStudentData: (studentId: string, updates: Partial<StudentDigitalTwin>) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = data.findIndex((s: StudentDigitalTwin) => s.id === studentId);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  },

  // Log activity helper
  logActivity: (studentId: string, type: ActivityLog['type'], message: string) => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const index = data.findIndex((s: StudentDigitalTwin) => s.id === studentId);
      if (index !== -1) {
          const newLog: ActivityLog = { id: Date.now().toString(), type, message, timestamp: Date.now() };
          data[index].recentActivities = [newLog, ...data[index].recentActivities].slice(0, 10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
  }
};
