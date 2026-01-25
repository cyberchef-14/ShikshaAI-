
export enum MasteryLevel {
  LOCKED = 'LOCKED',
  BEGINNER = 'BEGINNER',
  PRACTICING = 'PRACTICING',
  MASTERED = 'MASTERED'
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi', // Or Hinglish for educational context
}

export type UserRole = 'student' | 'teacher' | 'official';

// NEW: Rich Content Structure for deep learning
export interface ContentSection {
  title: string;
  content: string; // Supports basic markdown-like formatting
  icon: 'definition' | 'example' | 'warning' | 'tip';
}

// The "Graph Node" - Updated for Science
export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  microNote: string; // Summary / Cheat Sheet (For Notebook)
  flashcard: {       // Active Recall Q&A (For Flashcards)
    front: string;
    back: string;
  };
  xpValue: number;   // Gamification reward
  prerequisites: string[];
  category: 'Chemistry' | 'Physics' | 'Biology';
  
  // NEW FIELD: Structured Learning Content
  studyMaterial?: ContentSection[]; 
}

// New: Defines a segment of the lesson (Theory or Quiz)
export type SegmentType = 'explanation' | 'surprise_question' | 'mini_game';

export interface LessonSegment {
  id: string;
  type: SegmentType;
  contentEn: string; // The text the Avatar speaks
  contentHi: string;
  // Fields for interactive segments
  question?: string;
  options?: string[];
  correctIndex?: number;
  visualAsset?: string; // CSS class or emoji for the visual
}

// NEW: Structure for Student Queries
export interface QueryEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
  conceptId?: string;
}

export interface ActivityLog {
  id: string;
  type: 'quiz_complete' | 'concept_mastered' | 'confusion_flagged' | 'login';
  message: string;
  timestamp: number;
}

// NEW: Detailed Mistake Tracking for Spaced Repetition
export interface MistakeRecord {
  id: string;
  questionText: string;
  wrongAnswer: string;
  correctAnswer: string;
  conceptId: string;
  timestamp: number;
  retryCount: number; // How many times re-asked
  resolved: boolean; // True if answered correctly in a later quiz
}

// The "Digital Twin" Data Structure
export interface StudentDigitalTwin {
  id: string; // NEW: Unique ID for database sync
  name: string;
  currentLanguage: Language;
  masteryMap: Record<string, number>; // Concept ID -> Score (0.0 to 1.0)
  confusionPoints: string[]; // Concepts where user struggled
  mistakeLog: MistakeRecord[]; // NEW: Database of specific wrong answers
  queryNotebook: QueryEntry[]; // NEW: Saved Q&A history
  recentActivities: ActivityLog[]; // NEW: Real-time feed
  learningStyle: 'visual' | 'textual';
  difficultyLevel: number; // NEW: 0 (Easy) to 100 (Hard)
  streak: number;
  xp: number; // Gamification
  rank: string; // Gamification
}

export interface LearningSessionState {
  currentNodeId: string;
  currentSegmentIndex: number;
  score: number;
}

// NEW: Quiz Interfaces
export enum QuizType {
  STANDARD = 'STANDARD',
  DIAGNOSTIC = 'DIAGNOSTIC',
  MICRO = 'MICRO',
  CONFIDENCE = 'CONFIDENCE',
  ADAPTIVE = 'ADAPTIVE' // NEW type
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  conceptTag: string; // e.g., "Balancing", "Redox" for analysis
  explanation: string;
  isRetry?: boolean; // If true, this is a question from the mistake log
}

export interface Quiz {
  id: string;
  chapterId: string;
  type: QuizType; // NEW: Distinguish quiz purpose
  title: string;
  questions: QuizQuestion[];
  durationMinutes: number;
}