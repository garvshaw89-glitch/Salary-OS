import React from 'react';
import {
  X,
  LayoutDashboard,
  Wallet,
  PieChart,
  Receipt,
  Target,
  ShoppingBag,
  Repeat,
  Landmark,
  Activity,
  CalendarCheck,
  Settings,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    availableToSpend,
    user,
    goals,
    subscriptions,
    financialHealth,
    setIsQuickAffordOpen,
    setIsTestRunnerOpen,
    openAuthModal,
  } = useFinance();

  if (!isOpen) return null;

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'salary', label: 'Salary Allocation Matrix', icon: Wallet },
    {
      id: 'purchases',
      label: 'Purchase Affordability Sim',
      icon: ShoppingBag,
      badge: 'AFFORD?',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    { id: 'budgets', label: 'Budget Allocations', icon: PieChart },
    { id: 'transactions', label: 'Transaction Ledger', icon: Receipt },
    {
      id: 'goals',
      label: 'Target Capital Rings (SIP)',
      icon: Target,
      badge: `${goals.filter((g) => !g.isCompleted).length}`,
    },
    {
      id: 'subscriptions',
      label: 'Recurring Outflows & Bills',
      icon: Repeat,
      badge: `${subscriptions.filter((s) => s.status === 'active').length}`,
    },
    { id: 'accounts', label: 'Liquidity Vaults & Nodes', icon: Landmark },
    {
      id: 'health',
      label: '4-Pillar Health Diagnostics',
      icon: Activity,
      badge: `${financialHealth.totalScore}/100`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    { id: 'analytics', label: 'Cashflow Velocity & Creep', icon: TrendingUp },
    { id: 'review', label: 'Monthly Retrospective', icon: CalendarCheck },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  const handleSelect = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white font-bold shadow-xs">
              <span className="font-mono text-xs font-black">S</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide uppercase text-slate-100 font-mono">
                SalaryOS
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Mobile Command Node</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Available Capacity Hero Card in Mobile Drawer */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div
            onClick={() => {
              setIsQuickAffordOpen(true);
              onClose();
            }}
            className="p-2.5 rounded border border-slate-800 bg-slate-900 active:bg-slate-850 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>Available Capacity</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="mt-1 font-mono text-base font-bold text-slate-100">
              {formatCurrency(availableToSpend, user.currency)}
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-indigo-400 font-mono">
              <Sparkles className="h-3 w-3" />
              <span>Tap for Affordability Audit</span>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Navigation Matrix
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium min-h-[44px] transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                    : 'text-slate-300 hover:bg-slate-800/80 active:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold border ${
                      item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 min-h-[44px]"
            >
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                onClose();
                openAuthModal('register');
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 min-h-[44px]"
            >
              <span>New Profile</span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsTestRunnerOpen(true);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded border border-slate-800 bg-slate-900/60 py-2 text-[11px] font-mono font-bold text-slate-400 hover:bg-slate-800 min-h-[40px]"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Algorithm Integrity Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
