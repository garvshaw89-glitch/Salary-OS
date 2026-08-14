import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { SalaryPlanner } from './components/salary/SalaryPlanner';
import { BudgetManager } from './components/budget/BudgetManager';
import { TransactionManager } from './components/transactions/TransactionManager';
import { TransactionModal } from './components/transactions/TransactionModal';
import { SubscriptionsManager } from './components/subscriptions/SubscriptionsManager';
import { GoalsManager } from './components/goals/GoalsManager';
import { PurchasePlanner } from './components/purchases/PurchasePlanner';
import { QuickAffordModal } from './components/purchases/QuickAffordModal';
import { AccountsManager } from './components/accounts/AccountsManager';
import { FinancialHealthView } from './components/health/FinancialHealthView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MonthlyReviewView } from './components/review/MonthlyReviewView';
import { SettingsManager } from './components/settings/SettingsManager';
import { TestRunnerModal } from './components/common/TestRunnerModal';

function AppContent() {
  const { activeTab, user } = useFinance();

  // If user is viewing the landing page
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative z-10">
          <LandingPage />
        </div>
        <ToastContainer />
      </div>
    );
  }

  // If user needs onboarding
  if (activeTab === 'onboarding' || !user.isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative z-10">
          <OnboardingWizard />
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 flex relative">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header />

        <main className="flex-1 px-2.5 sm:px-4 lg:px-6 py-4 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {activeTab === 'dashboard' && <MainDashboard />}
          {activeTab === 'salary' && <SalaryPlanner />}
          {activeTab === 'budgets' && <BudgetManager />}
          {activeTab === 'transactions' && <TransactionManager />}
          {activeTab === 'subscriptions' && <SubscriptionsManager />}
          {activeTab === 'goals' && <GoalsManager />}
          {activeTab === 'purchases' && <PurchasePlanner />}
          {activeTab === 'accounts' && <AccountsManager />}
          {activeTab === 'health' && <FinancialHealthView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'review' && <MonthlyReviewView />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>

      {/* Global Modals & Overlays */}
      <QuickAffordModal />
      <TransactionModal />
      <TestRunnerModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
