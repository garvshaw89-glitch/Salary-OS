import React from 'react';
import {
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, exportToJSON } from '../../lib/utils';

export const MonthlyReviewView: React.FC = () => {
  const { user, monthlyReview, setActiveTab, addToast } = useFinance();

  const handleExportReview = () => {
    exportToJSON(
      monthlyReview,
      `SalaryOS_Monthly_Review_${monthlyReview.monthName}_${monthlyReview.year}`
    );
    addToast({
      type: 'success',
      title: 'Review Exported',
      message: 'Monthly review telemetry snapshot saved as JSON.',
    });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <CalendarCheck className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              {monthlyReview.monthName} {monthlyReview.year} Retrospective
            </h1>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
              ACTIVE CYCLE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            End-of-month cash flow diagnostics, capital retention rate, and budget adherence.
          </p>
        </div>

        <button
          onClick={handleExportReview}
          className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-slate-200 hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-indigo-400" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Summary Scorecard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="rounded border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Inflow</span>
          <p className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
            {formatCurrency(monthlyReview.income, user.currency)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Salary + Other Inflows</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Outflow</span>
          <p className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
            {formatCurrency(monthlyReview.spent, user.currency)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{monthlyReview.budgetUtilization}% of income</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Capital Retained</span>
          <p className="text-base sm:text-lg font-bold text-indigo-400 mt-0.5">
            {formatCurrency(monthlyReview.saved, user.currency)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{monthlyReview.savingsRate}% savings rate</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Net Worth Delta</span>
          <p className="text-base sm:text-lg font-bold text-teal-400 mt-0.5">
            +{formatCurrency(monthlyReview.netWorthDelta, user.currency)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Month-over-month</p>
        </div>
      </div>

      {/* Top Outflow Categories */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3 font-mono">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Top Outflow Categories This Cycle
        </h2>
        <div className="space-y-2">
          {monthlyReview.topCategories.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No category outflows logged this cycle.</p>
          ) : (
            monthlyReview.topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-slate-100 font-bold">
                    {formatCurrency(cat.amount, user.currency)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Next Cycle Recommendations */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Next Cycle Guidance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded border border-slate-800 bg-slate-950/60 space-y-1">
            <p className="font-bold text-emerald-400">Target Savings Rate Met</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              Your {monthlyReview.savingsRate}% capital retention pace is within the target 25%+ band.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-950/60 space-y-1">
            <p className="font-bold text-indigo-400">Scheduled Recurring Review</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              {formatCurrency(monthlyReview.subscriptionTotal, user.currency)} in recurring subscriptions detected. Audit active services in Recurring Outflows.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 font-mono">
          <button
            onClick={() => setActiveTab('salary')}
            className="rounded bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            Adjust Next Month's Plan →
          </button>
        </div>
      </div>
    </div>
  );
};
