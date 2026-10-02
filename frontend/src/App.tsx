import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ResumeView } from './components/ResumeView';
import { GitHubView } from './components/GitHubView';
import { JobDescriptionView } from './components/JobDescriptionView';
import { SkillGapsView } from './components/SkillGapsView';
import { EvidenceView } from './components/EvidenceView';
import { ResumeOptimizerView } from './components/ResumeOptimizerView';
import { CareerPlanView } from './components/CareerPlanView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { InterviewLabView } from './components/InterviewLabView';
import { AITracesView } from './components/Advanced/AITracesView';
import { AIEvaluationView } from './components/Advanced/AIEvaluationView';
import { MCPConsoleView } from './components/Advanced/MCPConsoleView';
import { SettingsView } from './components/SettingsView';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { 
  AnalysisResultResponse, 
  ResumeOptimizationBullet, 
  UserProfile, 
  NavTab 
} from './types';
import { api, getAuthToken, getStoredUser, clearAuthSession } from './services/api';

export const App: React.FC = () => {
  // Authentication & Onboarding State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Platform Navigation & Data State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [analysis, setAnalysis] = useState<AnalysisResultResponse | null>(null);
  const [bullets, setBullets] = useState<ResumeOptimizationBullet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Initialize auth check on mount
  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setCurrentUser(storedUser);
      // Check if onboarding was completed
      const onboardingDone = localStorage.getItem('careeros_onboarding_done');
      if (!onboardingDone) {
        setIsOnboarding(true);
      }
      loadPlatformData();
    } else {
      // By default if no user is saved, default to Alex Mercer demo user so reviewers can instantly inspect,
      // but if the user explicitly logged out or wants to test login, we show LoginPage.
      const hasLoggedOut = localStorage.getItem('careeros_logged_out');
      if (!hasLoggedOut) {
        // Auto-seed demo credentials for seamless first impression
        const defaultUser: UserProfile = {
          id: 1,
          email: "alex.mercer@example.com",
          full_name: "Alex Mercer",
          is_active: true
        };
        setCurrentUser(defaultUser);
        loadPlatformData();
      }
    }
    setAuthChecked(true);
  }, []);

  const loadPlatformData = async () => {
    setIsLoading(true);
    try {
      const [analysisData, bulletsData] = await Promise.all([
        api.getLatestAnalysis(),
        api.getBullets()
      ]);
      setAnalysis(analysisData);
      setBullets(bulletsData);
    } catch (err) {
      console.error('Failed to load platform data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    localStorage.removeItem('careeros_logged_out');
    setCurrentUser(user);
    const onboardingDone = localStorage.getItem('careeros_onboarding_done');
    if (!onboardingDone) {
      setIsOnboarding(true);
    } else {
      setIsOnboarding(false);
    }
    loadPlatformData();
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    localStorage.removeItem('careeros_logged_out');
    setCurrentUser(user);
    setIsOnboarding(true); // new user goes to onboarding flow
    loadPlatformData();
  };

  const handleLogout = () => {
    localStorage.setItem('careeros_logged_out', 'true');
    api.logout();
    setCurrentUser(null);
    setAuthView('login');
  };

  const handleOnboardingComplete = () => {
    setIsOnboarding(false);
    setActiveTab('dashboard');
    loadPlatformData();
  };

  const handleReanalyze = async () => {
    setIsLoading(true);
    try {
      const updated = await api.triggerAnalysis();
      const updatedBullets = await api.getBullets();
      setAnalysis(updated);
      setBullets(updatedBullets);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulletUpdated = async () => {
    try {
      const updatedBullets = await api.getBullets();
      setBullets(updatedBullets);
    } catch (err) {
      console.error(err);
    }
  };

  // Wait until auth initialization is checked
  if (!authChecked) {
    return <div className="min-h-screen bg-background text-slate-400 flex items-center justify-center text-xs">Loading CareerOS...</div>;
  }

  // 1. Unauthenticated: Show Login or Register Page
  if (!currentUser) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onSuccess={handleRegisterSuccess}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={handleLoginSuccess}
        onGoToRegister={() => setAuthView('register')}
      />
    );
  }

  // 2. First-time user Onboarding Flow
  if (isOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // 3. Authenticated Platform Shell
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Clean Navbar */}
      <Navbar
        user={currentUser}
        targetRole={analysis?.target_role || "AI / ML Engineer"}
        targetCompany={analysis?.target_company || "Vanguard Systems"}
        onLogout={handleLogout}
        onNavigate={setActiveTab}
        onRefreshData={loadPlatformData}
        isSeeding={isSeeding}
        setIsSeeding={setIsSeeding}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Simplified Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          gapsCount={analysis?.missing_skills.length || 0}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-65px)]">
          {isLoading && !analysis ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin"></div>
              <div className="text-xs text-slate-400">Loading career profile...</div>
            </div>
          ) : analysis ? (
            <>
              {/* PRIMARY VIEWS */}
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={currentUser}
                  analysis={analysis}
                  setActiveTab={setActiveTab}
                  onAnalyzeProfile={handleReanalyze}
                  isLoading={isLoading}
                />
              )}

              {activeTab === 'resume' && (
                <ResumeView />
              )}

              {activeTab === 'github' && (
                <GitHubView />
              )}

              {activeTab === 'job_description' && (
                <JobDescriptionView onJobAnalyzed={handleReanalyze} />
              )}

              {activeTab === 'skill_gaps' && (
                <SkillGapsView
                  analysis={analysis}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceView analysis={analysis} />
              )}

              {activeTab === 'optimizer' && (
                <ResumeOptimizerView
                  bullets={bullets}
                  onBulletUpdated={handleBulletUpdated}
                />
              )}

              {activeTab === 'career_plan' && (
                <CareerPlanView
                  analysis={analysis}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'roadmap' && (
                <LearningRoadmapView targetRole={analysis.target_role} />
              )}

              {activeTab === 'interview' && (
                <InterviewLabView targetRole={analysis.target_role} />
              )}

              {/* ADVANCED VIEWS (COLLAPSIBLE) */}
              {activeTab === 'traces' && (
                <AITracesView
                  analysis={analysis}
                  onRunPipeline={handleReanalyze}
                  isLoading={isLoading}
                />
              )}

              {activeTab === 'benchmarks' && (
                <AIEvaluationView />
              )}

              {activeTab === 'mcp' && (
                <MCPConsoleView />
              )}

              {/* SETTINGS VIEW */}
              {activeTab === 'settings' && (
                <SettingsView
                  user={currentUser}
                  targetRole={analysis.target_role}
                  targetCompany={analysis.target_company}
                  onLogout={handleLogout}
                />
              )}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default App;
