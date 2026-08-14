import React from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Percent,
  Home,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

export const FinancialHealthView: React.FC = () => {
  const { user, financialHealth, setActiveTab } = useFinance();

  const getPillarStatus = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return { label: 'Optimal', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (pct >= 50) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Attention', color: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              4-Pillar Financial Health Telemetry
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              AUDIT PROTOCOL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Deterministic mathematical index evaluating retention rate, fixed obligation burden, runway cushion, and debt drag.
          </p>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Composite Health Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-100 font-mono">
                {financialHealth.totalScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
              <span className="ml-2 rounded px-2 py-0.5 text-xs font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                Grade {financialHealth.grade}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-snug pt-1">
              {financialHealth.keyTakeaways[0]}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('salary')}
              className="rounded bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>Optimize Allocation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className="text-[10px] text-slate-400 hover:text-indigo-300 py-0.5 text-center"
            >
              Run Affordability Sim →
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${financialHealth.totalScore}%` }}
          />
        </div>
      </div>

      {/* 4 Pillars Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
        {/* Pillar 1: Savings Rate */}
        <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase text-slate-200">1. Capital Retention Rate</h3>
              </div>
              <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                getPillarStatus(financialHealth.pillars.savingsRate.score, 25).color
              }`}>
                {getPillarStatus(financialHealth.pillars.savingsRate.score, 25).label}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-100">{financialHealth.pillars.savingsRate.actualValue}%</span>
              <span className="text-[10px] text-slate-400 font-bold">{financialHealth.pillars.savingsRate.score} / 25 pts</span>
            </div>

            <div className="mt-1 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${(financialHealth.pillars.savingsRate.score / 25) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-1 border-t border-slate-800/80">
            {financialHealth.pillars.savingsRate.recommendation}
          </p>
        </div>

        {/* Pillar 2: Fixed Cost Ratio */}
        <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase text-slate-200">2. Fixed Obligation Drag</h3>
              </div>
              <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                getPillarStatus(financialHealth.pillars.fixedCostRatio.score, 25).color
              }`}>
                {getPillarStatus(financialHealth.pillars.fixedCostRatio.score, 25).label}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-100">{financialHealth.pillars.fixedCostRatio.actualValue}%</span>
              <span className="text-[10px] text-slate-400 font-bold">{financialHealth.pillars.fixedCostRatio.score} / 25 pts</span>
            </div>

            <div className="mt-1 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${(financialHealth.pillars.fixedCostRatio.score / 25) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-1 border-t border-slate-800/80">
            {financialHealth.pillars.fixedCostRatio.recommendation}
          </p>
        </div>

        {/* Pillar 3: Emergency Runway */}
        <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <h3 className="text-xs font-bold uppercase text-slate-200">3. Emergency Runway Buffer</h3>
              </div>
              <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                getPillarStatus(financialHealth.pillars.emergencyRunway.score, 25).color
              }`}>
                {getPillarStatus(financialHealth.pillars.emergencyRunway.score, 25).label}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-100">{financialHealth.pillars.emergencyRunway.actualValue} Months</span>
              <span className="text-[10px] text-slate-400 font-bold">{financialHealth.pillars.emergencyRunway.score} / 25 pts</span>
            </div>

            <div className="mt-1 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${(financialHealth.pillars.emergencyRunway.score / 25) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-1 border-t border-slate-800/80">
            {financialHealth.pillars.emergencyRunway.recommendation}
          </p>
        </div>

        {/* Pillar 4: Debt-to-Income */}
        <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <h3 className="text-xs font-bold uppercase text-slate-200">4. Debt & Leverage Burden</h3>
              </div>
              <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                getPillarStatus(financialHealth.pillars.debtToIncome.score, 25).color
              }`}>
                {getPillarStatus(financialHealth.pillars.debtToIncome.score, 25).label}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-100">{financialHealth.pillars.debtToIncome.actualValue}%</span>
              <span className="text-[10px] text-slate-400 font-bold">{financialHealth.pillars.debtToIncome.score} / 25 pts</span>
            </div>

            <div className="mt-1 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${(financialHealth.pillars.debtToIncome.score / 25) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-1 border-t border-slate-800/80">
            {financialHealth.pillars.debtToIncome.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
