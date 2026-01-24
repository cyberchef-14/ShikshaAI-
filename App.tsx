import React, { useState } from 'react';
import { StudentProvider } from './context/StudentContext';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LearningSession } from './pages/LearningSession';
import { QuizSession } from './pages/QuizSession';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { OfficialDashboard } from './pages/OfficialDashboard';
import { UserRole } from './types';
import { QUIZZES } from './data/curriculum';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'session' | 'quiz'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setView('dashboard');
  };
  
  const handleLogout = () => {
    setView('landing');
    setUserRole('student'); // Reset to default safely
  };
  
  const handleStartSession = (conceptId: string) => {
    setActiveConcept(conceptId);
    setView('session');
  };

  const handleStartQuiz = (chapterId: string) => {
    setActiveConcept(chapterId); // Use activeConcept to track which chapter's quiz
    setView('quiz');
  };

  const handleExitSession = () => {
    setActiveConcept(null);
    setView('dashboard');
  };

  // Render Logic based on Role and View
  if (view === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (view === 'dashboard') {
    if (userRole === 'teacher') return <TeacherDashboard onBack={handleLogout} />;
    if (userRole === 'official') return <OfficialDashboard onBack={handleLogout} />;
    return <Dashboard onStartSession={handleStartSession} onStartQuiz={handleStartQuiz} onBack={handleLogout} />; 
  }

  if (view === 'session' && activeConcept) {
    return <LearningSession conceptId={activeConcept} onExit={handleExitSession} />;
  }

  if (view === 'quiz' && activeConcept) {
      const quiz = QUIZZES[activeConcept];
      if (quiz) {
          return <QuizSession quiz={quiz} onExit={handleExitSession} />;
      } else {
          // Fallback if no quiz exists for this ID
          return <Dashboard onStartSession={handleStartSession} onStartQuiz={handleStartQuiz} onBack={handleLogout} />; 
      }
  }

  return <div>Error: Unknown State</div>;
};

const App: React.FC = () => {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
};

export default App;