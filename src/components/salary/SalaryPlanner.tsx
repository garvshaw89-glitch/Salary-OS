import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Home,
  PiggyBank,
  Shield,
  Target,
  Coffee,
  Layers,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { SalaryAllocation } from '../../types/finance';

export const SalaryPlanner: React.FC = () => {
  const { user, updateUser, addToast, upcomingCommitted, goalCommitments } = useFinance();

  const [salary, setSalary] = useState(user.monthlySalary || 60000);
  const [salaryDate, setSalaryDate] = useState(user.salaryDate || 1);

  // Custom allocation states
  const [allocation, setAllocation] = useState<SalaryAllocation>({
    essentials: Math.min(23000, Math.round(salary * 0.4)),
    savings: Math.round(salary * 0.15),
    emergency: Math.round(salary * 0.1),
    goals: goalCommitments || Math.round(salary * 0.15),
    lifestyle: Math.round(salary * 0.12),
    flexibleBuffer: Math.round(salary * 0.08),
  });

  const totalAllocated =
    allocation.essentials +
    allocation.savings +
    allocation.emergency +
    allocation.goals +
    allocation.lifestyle +
    allocation.flexibleBuffer;

  const difference = salary - totalAllocated;
  const isBalanced = Math.abs(difference) <= 1;

  const updateAllocationField = (key: keyof SalaryAllocation, value: number) => {
    setAllocation((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleSavePlan = () => {
    updateUser({
      monthlySalary: salary,
      salaryDate,
    });
    addToast({
      type: 'success',
      title: 'Allocation Matrix Saved',
      message: 'Monthly cycle parameters updated successfully.',
    });
  };

  const applyRule = (rule: '50-30-20' | '60-20-20' | 'aggressive') => {
    if (rule === '50-30-20') {
      setAllocation({
        essentials: Math.round(salary * 0.5),
        savings: Math.round(salary * 0.1),
        emergency: Math.round(salary * 0.1),
        goals: Math.round(salary * 0.1),
        lifestyle: Math.round(salary * 0.2),
        flexibleBuffer: 0,
      });
    } else if (rule === '60-20-20') {
      setAllocation({
        essentials: Math.round(salary * 0.6),
        savings: Math.round(salary * 0.1),
        emergency: Math.round(salary * 0.05),
        goals: Math.round(salary * 0.1),
        lifestyle: Math.round(salary * 0.1),
        flexibleBuffer: Math.round(salary * 0.05),
      });
    } else {
      // aggressive
      setAllocation({
        essentials: Math.round(salary * 0.4),
        savings: Math.round(salary * 0.25),
        emergency: Math.round(salary * 0.1),
        goals: Math.round(salary * 0.15),
        lifestyle: Math.round(salary * 0.1),
        flexibleBuffer: 0,
      });
    }
    addToast({
      type: 'info',
      title: 'Preset Applied',
      message: `Updated allocation schema based on ${rule}.`,
    });
  };

  const categories = [
    {
      key: 'essentials' as const,
      label: 'Fixed Essentials & Bills',
      icon: Home,
      color: 'text-indigo-400',
      hint: `Committed obligations: ${formatCurrency(upcomingCommitted, user.currency)}`,
    },
    {
      key: 'emergency' as const,
      label: 'Emergency Reserve Buffer',
      icon: Shield,
      color: 'text-amber-400',
      hint: 'Target minimum 3-6 months buffer',
    },
    {
      key: 'goals' as const,
      label: 'Target Capital SIPs',
      icon: Target,
      color: 'text-emerald-400',
      hint: `Active monthly goal SIPs: ${formatCurrency(goalCommitments, user.currency)}`,
    },
    {
      key: 'savings' as const,
      label: 'Wealth & Investments',
      icon: PiggyBank,
      color: 'text-teal-400',
      hint: 'Index funds, stocks, retirement',
    },
    {
      key: 'lifestyle' as const,
      label: 'Discretionary Lifestyle',
      icon: Coffee,
      color: 'text-purple-400',
      hint: 'Dining, shopping, outings',
    },
    {
      key: 'flexibleBuffer' as const,
      label: 'Unassigned Safety Cushion',
      icon: Wallet,
      color: 'text-blue-400',
      hint: 'Floating unallocated liquidity',
    },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Inflow Allocation & Salary OS
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              ZERO-SUM ENGINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Deterministic zero-based salary distribution algorithm. Every rupee is assigned prior to cycle disbursement.
          </p>
        </div>

        <button
          onClick={handleSavePlan}
          className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          Save Allocation Matrix
        </button>
      </div>

      {/* Salary Input Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Monthly Inflow Amount</label>
          <div className="flex items-center">
            <input
              type="number"
              step="1000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 font-mono font-bold text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payday Anchor Date</label>
          <select
            value={salaryDate}
            onChange={(e) => setSalaryDate(Number(e.target.value))}
            className="w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 font-mono text-xs focus:border-indigo-500 focus:outline-none"
          >
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Day {i + 1} of month
              </option>
            ))}
          </select>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1 flex flex-col justify-between">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Formula Presets</label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => applyRule('50-30-20')}
              className="rounded bg-slate-800 hover:bg-slate-700 py-1 text-[9px] font-mono font-bold text-slate-300 border border-slate-700"
            >
              50/30/20
            </button>
            <button
              onClick={() => applyRule('60-20-20')}
              className="rounded bg-slate-800 hover:bg-slate-700 py-1 text-[9px] font-mono font-bold text-slate-300 border border-slate-700"
            >
              60/20/20
            </button>
            <button
              onClick={() => applyRule('aggressive')}
              className="rounded bg-slate-800 hover:bg-slate-700 py-1 text-[9px] font-mono font-bold text-slate-300 border border-slate-700"
            >
              Aggressive
            </button>
          </div>
        </div>
      </div>

      {/* Balance Telemetry Bar */}
      <div
        className={`rounded border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs ${
          isBalanced
            ? 'border-emerald-500/40 bg-slate-900'
            : difference > 0
            ? 'border-amber-500/40 bg-slate-900'
            : 'border-rose-500/40 bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {isBalanced ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          )}
          <span className="text-slate-200 text-xs">
            {isBalanced
              ? 'Zero-sum balance achieved: 100% of income is deterministically allocated.'
              : difference > 0
              ? `Unallocated capacity remaining: ${formatCurrency(difference, user.currency)}`
              : `Over-allocated by: ${formatCurrency(Math.abs(difference), user.currency)}`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] shrink-0">
          <span className="text-slate-400">
            Total Allocated: <strong className="text-slate-100">{formatCurrency(totalAllocated, user.currency)}</strong>
          </span>
        </div>
      </div>

      {/* Breakdown Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const currentVal = allocation[cat.key];
          const pct = salary > 0 ? Math.round((currentVal / salary) * 100) : 0;

          return (
            <div
              key={cat.key}
              className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-300">{cat.label}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400">{pct}%</span>
              </div>

              <div className="space-y-1">
                <input
                  type="number"
                  step="500"
                  value={currentVal}
                  onChange={(e) => updateAllocationField(cat.key, Number(e.target.value))}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 font-mono font-bold text-xs focus:border-indigo-500 focus:outline-none"
                />
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
              </div>

              <p className="text-[9px] font-mono text-slate-500 leading-tight">{cat.hint}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
