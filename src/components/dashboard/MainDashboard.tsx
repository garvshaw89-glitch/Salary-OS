import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Repeat,
  Wallet,
  Receipt,
  Calendar,
  CreditCard,
  PiggyBank,
  Shield,
  PieChart as PieIcon,
  ChevronRight,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, formatRelativeDate } from '../../lib/utils';
import { StatCard } from '../common/StatCard';

export const MainDashboard: React.FC = () => {
  const {
    user,
    setActiveTab,
    availableToSpend,
    liquidFunds,
    upcomingCommitted,
    goalCommitments,
    transactions,
    goals,
    subscriptions,
    budgets,
    financialHealth,
    setIsQuickAffordOpen,
    setIsAddTransactionOpen,
    addGoalContribution,
  } = useFinance();

  const [selectedTxFilter, setSelectedTxFilter] = useState<'all' | 'expense' | 'income'>('all');

  // Filter recent transactions
  const recentTransactions = transactions
    .filter((t) => (selectedTxFilter === 'all' ? true : t.type === selectedTxFilter))
    .slice(0, 7);

  // Active goals list (max 3 on dashboard)
  const activeGoals = goals.filter((g) => !g.isCompleted).slice(0, 3);

  // Upcoming bills in next 14 days
  const upcomingSubscriptions = subscriptions
    .filter((s) => s.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 4);

  // Spending Donut data preparation
  const categorySpendingMap: Record<string, { name: string; amount: number; color: string }> = {};
  transactions
    .filter((t) => t.type === 'expense' && !t.goalId)
    .forEach((t) => {
      if (!categorySpendingMap[t.categoryName]) {
        const budgetCat = budgets.find((b) => b.categoryName === t.categoryName);
        categorySpendingMap[t.categoryName] = {
          name: t.categoryName,
          amount: 0,
          color: budgetCat?.color || '#6366f1',
        };
      }
      categorySpendingMap[t.categoryName].amount += t.amount;
    });

  const chartData = Object.values(categorySpendingMap);
  const totalSpentMonth = chartData.reduce((s, c) => s + c.amount, 0);

  const availableRatio = user.monthlySalary > 0 ? (availableToSpend / user.monthlySalary) * 100 : 0;
  const committedRatio = user.monthlySalary > 0 ? (upcomingCommitted / user.monthlySalary) * 100 : 0;
  const goalRatio = user.monthlySalary > 0 ? (goalCommitments / user.monthlySalary) * 100 : 0;

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Command Node: Central-Financial-1
            </h1>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
            <span>Cycle: {new Date().toLocaleString('default', { month: 'short' })} 2026</span>
            <span className="text-slate-600">•</span>
            <span>Payday Anchor: Day {user.salaryDate}</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400">Node Status: Online</span>
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="dash-quick-afford-btn"
            onClick={() => setIsQuickAffordOpen(true)}
            className="flex items-center gap-1.5 rounded bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs active:scale-95 transition-all font-mono"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Affordability Simulator</span>
          </button>
          <button
            id="dash-quick-add-expense"
            onClick={() => setIsAddTransactionOpen(true)}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all font-mono"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Record Tx</span>
          </button>
        </div>
      </div>

      {/* Primary 4 Metric High-Density Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Available Capacity"
          value={formatCurrency(availableToSpend, user.currency)}
          subvalue="Uncommitted buffer"
          badge="SAFE"
          badgeVariant="emerald"
          progressPercent={Math.max(5, availableRatio)}
          progressColor="bg-emerald-500"
          icon={Wallet}
          iconColor="text-emerald-400"
          onClick={() => setActiveTab('purchases')}
          className="border-emerald-500/30"
        />

        <StatCard
          label="Active Monthly Inflow"
          value={formatCurrency(user.monthlySalary, user.currency)}
          subvalue={`Day ${user.salaryDate} anchor`}
          progressPercent={100}
          progressColor="bg-indigo-500"
          icon={CreditCard}
          iconColor="text-indigo-400"
          onClick={() => setActiveTab('salary')}
        />

        <StatCard
          label="Committed Obligations"
          value={formatCurrency(upcomingCommitted, user.currency)}
          subvalue="Fixed bills & utilities"
          badge="LOCKED"
          badgeVariant="amber"
          progressPercent={Math.max(10, committedRatio)}
          progressColor="bg-amber-500"
          icon={Receipt}
          iconColor="text-amber-400"
          onClick={() => setActiveTab('budgets')}
        />

        <StatCard
          label="Target Capital SIPs"
          value={formatCurrency(goalCommitments, user.currency)}
          subvalue={`${goals.filter((g) => !g.isCompleted).length} target nodes`}
          badge="AUTOMATED"
          badgeVariant="indigo"
          progressPercent={Math.max(10, goalRatio)}
          progressColor="bg-indigo-500"
          icon={PiggyBank}
          iconColor="text-indigo-400"
          onClick={() => setActiveTab('goals')}
        />
      </div>

      {/* Main Grid: 2 Columns (Left: Affordability Radar + Spending Donut, Right: Goals + Bills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column (8 of 12 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3">
          {/* High Density Decision Engine Hero Card */}
          <div className="rounded border border-slate-800 bg-slate-900 p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <div className="inline-flex items-center gap-1.5 rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-indigo-400 border border-indigo-500/30">
                  <Zap className="h-2.5 w-2.5" />
                  <span>Deterministic Purchase Simulator</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-mono">
                  Evaluate Capital Outflows Prior To Execution
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Audits liquid buffers, upcoming committed liabilities, and exact goal milestone delays with 100% deterministic rules.
                </p>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsQuickAffordOpen(true)}
                  className="w-full sm:w-auto rounded bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-mono font-bold text-white shadow-xs active:scale-95 transition-all text-center"
                >
                  Run Affordability Audit
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className="w-full sm:w-auto text-[10px] font-mono text-slate-400 hover:text-indigo-300 py-0.5 text-center"
                >
                  Planned Purchase Matrix →
                </button>
              </div>
            </div>
          </div>

          {/* Spending Allocation Ledger & Donut Breakdown */}
          <div className="rounded border border-slate-800 bg-slate-900 p-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                  Outflow Telemetry & Categories
                </div>
                <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  Total logged: {formatCurrency(totalSpentMonth, user.currency)} / {formatCurrency(user.monthlySalary, user.currency)}
                </div>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Budget Nodes →
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Donut Chart */}
              <div className="h-44 w-full flex items-center justify-center relative">
                {chartData.length === 0 ? (
                  <div className="text-center text-[10px] font-mono text-slate-500">
                    <PieIcon className="h-6 w-6 mx-auto mb-1 opacity-40" />
                    No category outflows recorded this cycle.
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={68}
                          paddingAngle={2}
                          stroke="#0f172a"
                          strokeWidth={2}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: number) => [formatCurrency(val, user.currency), 'Amount']}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#1e293b',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#e2e8f0',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Utilized</span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {user.monthlySalary > 0 ? ((totalSpentMonth / user.monthlySalary) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Category Legend List */}
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {chartData.map((cat) => {
                  const pct = totalSpentMonth > 0 ? Math.round((cat.amount / totalSpentMonth) * 100) : 0;
                  return (
                    <div key={cat.name} className="flex items-center justify-between text-xs p-1 rounded hover:bg-slate-800/40">
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-300 text-[11px] truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono shrink-0">
                        <span className="text-slate-200 font-bold text-[11px]">{formatCurrency(cat.amount, user.currency)}</span>
                        <span className="text-slate-500 text-[10px] w-7 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity Table (High-Density command style) */}
          <div className="rounded border border-slate-800 bg-slate-900 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/60">
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                Live Transaction Stream
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded border border-slate-800 bg-slate-950 p-0.5 text-[9px] font-mono">
                  {(['all', 'expense', 'income'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedTxFilter(f)}
                      className={`px-2 py-0.5 rounded uppercase font-bold transition-colors ${
                        selectedTxFilter === f ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Full Ledger →
                </button>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950/40">
                <tr>
                  <th className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold text-slate-500 border-b border-slate-800">Date</th>
                  <th className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold text-slate-500 border-b border-slate-800">Description</th>
                  <th className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold text-slate-500 border-b border-slate-800">Category</th>
                  <th className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold text-slate-500 border-b border-slate-800 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-mono divide-y divide-slate-800/40">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                      No matching records in stream.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2 text-slate-400 text-[10px]">{formatDate(tx.date)}</td>
                      <td className="px-3 py-2 text-slate-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          {tx.type === 'income' ? (
                            <ArrowUpRight className="h-3 w-3 text-emerald-400 shrink-0" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 text-rose-400 shrink-0" />
                          )}
                          <span className="truncate max-w-[180px]">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-400 text-[10px]">
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 border border-slate-700/60 text-slate-300">
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={`font-bold ${
                            tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, user.currency)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 of 12 cols on desktop): Goals, Subscriptions, Health Gauge */}
        <div className="lg:col-span-4 space-y-3">
          {/* Active Goals High Density Panel */}
          <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Target Allocations
                </span>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold"
              >
                All ({goals.length}) →
              </button>
            </div>

            <div className="space-y-2">
              {activeGoals.length === 0 ? (
                <div className="text-center py-4 text-[10px] font-mono text-slate-500">
                  No active targets.
                </div>
              ) : (
                activeGoals.map((goal) => {
                  const progressPct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                  return (
                    <div key={goal.id} className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-200 text-[11px] truncate">{goal.name}</span>
                        <span className="text-[10px] font-bold text-indigo-400">{progressPct}%</span>
                      </div>

                      {/* Thin high density progress track */}
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{formatCurrency(goal.currentAmount, user.currency)}</span>
                        <span className="text-slate-500">/ {formatCurrency(goal.targetAmount, user.currency)}</span>
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-slate-800/60 text-[9px] font-mono">
                        <span className="text-slate-500">Target: {formatDate(goal.targetDate)}</span>
                        <button
                          onClick={() => addGoalContribution(goal.id, goal.monthlyContribution || 1000)}
                          className="text-emerald-400 hover:text-emerald-300 font-bold"
                        >
                          + SIP {formatCurrency(goal.monthlyContribution || 1000, user.currency)}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Bills & Subscriptions */}
          <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Repeat className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Upcoming Liabilities
                </span>
              </div>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold"
              >
                All →
              </button>
            </div>

            <div className="space-y-1.5">
              {upcomingSubscriptions.length === 0 ? (
                <p className="text-[10px] font-mono text-slate-500 py-3 text-center">No active upcoming bills.</p>
              ) : (
                upcomingSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded bg-slate-950 p-2 border border-slate-800 text-xs font-mono"
                  >
                    <div>
                      <p className="font-bold text-slate-200 text-[11px]">{sub.name}</p>
                      <p className="text-[9px] text-slate-500">Due: {formatRelativeDate(sub.nextBillingDate)}</p>
                    </div>
                    <span className="font-bold text-amber-400 text-xs">
                      {formatCurrency(sub.amount, user.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4-Pillar Financial Health Index (High Density Telemetry) */}
          <div
            onClick={() => setActiveTab('health')}
            className="group cursor-pointer rounded border border-slate-800 bg-slate-900 p-3.5 hover:border-indigo-500/40 transition-all space-y-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Health Index
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Grade {financialHealth.grade}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-slate-100">
                    {financialHealth.totalScore}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">/100</span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5 leading-tight">
                  {financialHealth.keyTakeaways[0]}
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${financialHealth.totalScore}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-indigo-400 flex items-center justify-between group-hover:text-indigo-300">
              <span>View 4-pillar diagnostics</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
