import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Plus,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownLeft,
  Grid,
  Menu,
} from 'lucide-react';
import { ActiveTab, useFinance } from '../../context/FinanceContext';
import { MobileDrawer } from './MobileDrawer';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsQuickAffordOpen, setIsAddTransactionOpen } = useFinance();
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Action Menu Modal Backdrop */}
      {isFabMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
          onClick={() => setIsFabMenuOpen(false)}
        />
      )}

      {/* Floating Action Menu Options */}
      {isFabMenuOpen && (
        <div className="fixed bottom-16 right-3 sm:right-4 z-50 flex flex-col gap-2 lg:hidden animate-in fade-in slide-in-from-bottom-5 duration-150 font-sans">
          <button
            onClick={() => {
              setIsFabMenuOpen(false);
              setIsQuickAffordOpen(true);
            }}
            className="flex items-center gap-2 rounded border border-indigo-500/40 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-indigo-300 shadow-xl font-mono min-h-[44px] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Affordability Simulator</span>
          </button>
          <button
            onClick={() => {
              setIsFabMenuOpen(false);
              setIsAddTransactionOpen(true);
            }}
            className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 shadow-xl font-mono min-h-[44px] active:scale-[0.98]"
          >
            <ArrowDownLeft className="h-4 w-4 text-rose-400" />
            <span>Record Outflow</span>
          </button>
          <button
            onClick={() => {
              setIsFabMenuOpen(false);
              setIsAddTransactionOpen(true);
            }}
            className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-200 shadow-xl font-mono min-h-[44px] active:scale-[0.98]"
          >
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            <span>Record Inflow</span>
          </button>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-slate-800 bg-slate-900/95 px-1 backdrop-blur-md lg:hidden font-sans">
        {/* Command Center */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[48px] text-[10px] font-bold uppercase transition-colors ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Dash</span>
        </button>

        {/* Salary Matrix */}
        <button
          onClick={() => setActiveTab('salary')}
          className={`flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[48px] text-[10px] font-bold uppercase transition-colors ${
            activeTab === 'salary' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Salary Matrix"
        >
          <Wallet className="h-4 w-4 mb-0.5" />
          <span>Matrix</span>
        </button>

        {/* Floating Center Action Button */}
        <button
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          className={`flex h-11 w-11 -translate-y-2 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform ${
            isFabMenuOpen ? 'rotate-45' : ''
          }`}
          aria-label="Quick Actions"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Affordability Sim */}
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[48px] text-[10px] font-bold uppercase transition-colors ${
            activeTab === 'purchases' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Affordability Sim"
        >
          <ShoppingBag className="h-4 w-4 mb-0.5" />
          <span>Simulate</span>
        </button>

        {/* More / Menu Drawer */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[48px] text-[10px] font-bold uppercase transition-colors ${
            !['dashboard', 'salary', 'purchases'].includes(activeTab)
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="More Features"
        >
          <Grid className="h-4 w-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-out Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

