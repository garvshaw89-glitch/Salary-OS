import React from 'react';
import {
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
} from 'lucide-react';
import { ActiveTab, useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, availableToSpend, user, goals } = useFinance();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'salary', label: 'Salary Allocation', icon: Wallet },
    {
      id: 'purchases',
      label: 'Purchase Simulator',
      icon: ShoppingBag,
      badge: 'AFFORD?',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    { id: 'budgets', label: 'Budget Allocations', icon: PieChart },
    { id: 'transactions', label: 'Transaction Ledger', icon: Receipt },
    {
      id: 'goals',
      label: 'Capital Targets',
      icon: Target,
      badge: `${goals.filter((g) => !g.isCompleted).length}`,
    },
    { id: 'subscriptions', label: 'Recurring Outflows', icon: Repeat },
    { id: 'accounts', label: 'Liquidity Nodes', icon: Landmark },
    { id: 'health', label: 'Health Diagnostics', icon: Activity },
    { id: 'analytics', label: 'Velocity Analytics', icon: TrendingUp },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-60 flex-col justify-between border-r border-slate-800 bg-slate-900 p-3 shrink-0 select-none">
      {/* Top Section: Nav Links & Quick Metric */}
      <div className="space-y-4">
        {/* Available to Spend Snapshot Widget in Sidebar */}
        <div
          onClick={() => setActiveTab('purchases')}
          className="group relative cursor-pointer overflow-hidden rounded border border-slate-800 bg-slate-950 p-2.5 hover:border-indigo-500/50 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span>Available Capacity</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-slate-100">
              {formatCurrency(availableToSpend, user.currency)}
            </span>
          </div>
          <div className="mt-1.5 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[76%]"></div>
          </div>
          <p className="mt-1 text-[9px] font-mono text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> RUN SIMULATOR →
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-0.5">
          <div className="px-2 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Nodes
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-[11px] truncate">{item.label}</span>
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
        </nav>
      </div>

      {/* Bottom Section: Deterministic Engine Note */}
      <div className="pt-2 border-t border-slate-800">
        <div className="rounded bg-slate-950 p-2 text-[10px] text-slate-400 border border-slate-800/80">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] text-slate-300">
            <ShieldCheck className="h-3 w-3 text-indigo-400" />
            <span>Deterministic Core</span>
          </div>
          <p className="mt-0.5 text-[9px] text-slate-500 font-mono leading-tight">
            Verifiable client-side financial computation engine.
          </p>
        </div>
      </div>
    </aside>
  );
};
