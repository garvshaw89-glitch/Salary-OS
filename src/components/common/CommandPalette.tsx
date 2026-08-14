import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Receipt,
  Target,
  Repeat,
  Sparkles,
  PieChart,
  Wallet,
  Settings,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    transactions,
    goals,
    subscriptions,
    user,
    setIsQuickAffordOpen,
    setIsAddTransactionOpen,
    setIsTestRunnerOpen,
  } = useFinance();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter items
  const matchedTransactions = cleanQuery
    ? transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(cleanQuery) ||
          t.categoryName.toLowerCase().includes(cleanQuery) ||
          t.amount.toString().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchedGoals = cleanQuery
    ? goals.filter((g) => g.name.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const matchedSubscriptions = cleanQuery
    ? subscriptions.filter((s) => s.name.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const navigationActions = [
    { label: 'Affordability Simulator (Signature Tool)', tab: 'purchases', action: () => setIsQuickAffordOpen(true), icon: Sparkles },
    { label: 'Salary Allocation Engine', tab: 'salary', action: () => setActiveTab('salary'), icon: Wallet },
    { label: 'Record New Transaction Outflow/Inflow', tab: 'transactions', action: () => setIsAddTransactionOpen(true), icon: Receipt },
    { label: 'Monthly Budget Allocations', tab: 'budgets', action: () => setActiveTab('budgets'), icon: PieChart },
    { label: 'Financial Health & Telemetry Diagnostics', tab: 'health', action: () => setActiveTab('health'), icon: Activity },
    { label: 'Verify Deterministic Math Algorithms', tab: 'tests', action: () => setIsTestRunnerOpen(true), icon: CheckCircle2 },
    { label: 'System Configuration & JSON Backup', tab: 'settings', action: () => setActiveTab('settings'), icon: Settings },
  ].filter((a) => !cleanQuery || a.label.toLowerCase().includes(cleanQuery));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search input header */}
        <div className="flex items-center border-b border-slate-800 px-3 bg-slate-950/50">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Command or query ledger, goals, nodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsCommandPaletteOpen(false);
            }}
          />
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Nav Actions */}
          {navigationActions.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                System Commands & Routes
              </p>
              <div className="space-y-0.5">
                {navigationActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setIsCommandPaletteOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-[11px]">{item.label}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transactions Match */}
          {matchedTransactions.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Matched Ledger Entries
              </p>
              <div className="space-y-0.5">
                {matchedTransactions.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => {
                      setActiveTab('transactions');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[11px] truncate">{tx.description}</span>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, user.currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals Match */}
          {matchedGoals.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Matched Targets
              </p>
              <div className="space-y-0.5">
                {matchedGoals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveTab('goals');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[11px]">{g.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatCurrency(g.currentAmount, user.currency)} / {formatCurrency(g.targetAmount, user.currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions Match */}
          {matchedSubscriptions.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Matched Recurring Outflows
              </p>
              <div className="space-y-0.5">
                {matchedSubscriptions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveTab('subscriptions');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Repeat className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[11px]">{s.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-300">
                      {formatCurrency(s.amount, user.currency)}/{s.billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
