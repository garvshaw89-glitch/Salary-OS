import React from 'react';
import {
  TrendingUp,
  Download,
  Shield,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, exportToJSON } from '../../lib/utils';
import { calculateLifestyleInflation } from '../../lib/calculations';

export const AnalyticsView: React.FC = () => {
  const { user, transactions, budgets, goals, subscriptions, accounts, liquidFunds, availableToSpend } = useFinance();

  // Multi-month trend data based on current state
  const monthlyTrends = [
    { month: 'Apr', income: user.monthlySalary, expenses: 38200, savings: 21800 },
    { month: 'May', income: user.monthlySalary, expenses: 41500, savings: 18500 },
    { month: 'Jun', income: user.monthlySalary, expenses: 39100, savings: 20900 },
    { month: 'Jul', income: user.monthlySalary, expenses: 43200, savings: 16800 },
    { month: 'Aug (Current)', income: user.monthlySalary, expenses: 42580, savings: 17420 },
  ];

  // Lifestyle inflation analysis with proper property mapping
  const inflationAnalysis = calculateLifestyleInflation(
    user.monthlySalary * 0.85, // baseline
    user.monthlySalary, // current
    37000, // baseline lifestyle
    42580 // current lifestyle
  );

  const handleExportFullReport = () => {
    const reportData = {
      userProfile: user,
      metrics: {
        liquidFunds,
        availableToSpend,
        monthlySalary: user.monthlySalary,
      },
      accounts,
      budgets,
      goals,
      subscriptions,
      transactions,
      generatedAt: new Date().toISOString(),
    };

    exportToJSON(reportData, `SalaryOS_Full_Financial_Report_${new Date().toISOString().split('T')[0]}`);
  };

  const totalMonthlyGoalSIPs = goals.reduce(
    (s, g) => s + (g.isCompleted || g.isPaused ? 0 : g.monthlyContribution),
    0
  );

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Financial Telemetry & Velocity
            </h1>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Multi-cycle retention rates, lifestyle creep audits, and capital velocity.
          </p>
        </div>

        <button
          onClick={handleExportFullReport}
          className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-700 shadow-xs transition-all self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-indigo-400" />
          <span>Export Audit Snapshot</span>
        </button>
      </div>

      {/* Monthly Cash Flow Trends Chart */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-slate-200">5-Cycle Income vs Outflow Trajectory</h3>
            <p className="text-[10px] font-mono text-slate-500">Tracking monthly retention velocity</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Inflow
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="h-2 w-2 rounded-sm bg-rose-500" /> Outflows
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val / 1000}k`} fontFamily="monospace" />
              <Tooltip
                formatter={(val: number) => [formatCurrency(val, user.currency), '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="income" name="Inflow" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" name="Outflow" fill="#f43f5e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lifestyle Inflation Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono uppercase text-slate-200">Lifestyle Creep Diagnostic</h3>
            </div>
            <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase border ${
              inflationAnalysis.isInflating
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {inflationAnalysis.isInflating ? 'CREEP DETECTED' : 'BALANCED RETENTION'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Income Progression:</span>
              <span className="font-bold text-emerald-400">
                +{inflationAnalysis.salaryGrowthPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lifestyle Spend Expansion:</span>
              <span className="font-bold text-rose-400">
                +{inflationAnalysis.lifestyleGrowthPct.toFixed(1)}%
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <span className="text-slate-400">Expansion Gap:</span>
              <span className="font-bold text-slate-100">
                {inflationAnalysis.inflationGap > 0 ? `+${inflationAnalysis.inflationGap}%` : `${inflationAnalysis.inflationGap}%`}
              </span>
            </div>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 leading-snug">
            {inflationAnalysis.takeaway}
          </div>
        </div>

        {/* Savings Velocity & Milestones */}
        <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold font-mono uppercase text-slate-200">Capital Retention Index</h3>
            </div>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-indigo-400 border border-indigo-500/30">
              ACTIVE
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Monthly Target SIPs:</span>
              <span className="font-bold text-slate-200">
                {formatCurrency(totalMonthlyGoalSIPs, user.currency)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Net Capital Retention:</span>
              <span className="font-bold text-emerald-400">
                {formatCurrency(totalMonthlyGoalSIPs * 12, user.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Reserve Coverage:</span>
              <span className="font-bold text-indigo-400">
                {formatCurrency(liquidFunds, user.currency)} ({((liquidFunds / (user.minimumEmergencyReserve || 1)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[78%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
