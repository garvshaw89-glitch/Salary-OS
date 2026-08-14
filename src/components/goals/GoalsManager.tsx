import React, { useState } from 'react';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { FinancialGoal, GoalCategory } from '../../types/finance';
import { formatCurrency, formatDate } from '../../lib/utils';

export const GoalsManager: React.FC = () => {
  const {
    user,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalContribution,
    addToast,
  } = useFinance();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(5000);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GoalCategory>('laptop');
  const [targetAmount, setTargetAmount] = useState(80000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [targetDate, setTargetDate] = useState('2027-01-31');
  const [notes, setNotes] = useState('');

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetAmount <= 0) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        name,
        category,
        targetAmount,
        monthlyContribution,
        targetDate,
        notes,
      });
      setEditingGoal(null);
    } else {
      addGoal({
        name,
        category,
        targetAmount,
        currentAmount,
        monthlyContribution,
        targetDate,
        isCompleted: false,
        isPaused: false,
        notes,
      });
    }

    setIsCreateOpen(false);
  };

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setName('');
    setCategory('laptop');
    setTargetAmount(50000);
    setCurrentAmount(0);
    setMonthlyContribution(5000);
    setTargetDate('2027-03-31');
    setNotes('');
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (g: FinancialGoal) => {
    setEditingGoal(g);
    setName(g.name);
    setCategory(g.category);
    setTargetAmount(g.targetAmount);
    setCurrentAmount(g.currentAmount);
    setMonthlyContribution(g.monthlyContribution);
    setTargetDate(g.targetDate);
    setNotes(g.notes || '');
    setIsCreateOpen(true);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || depositAmount <= 0) return;
    addGoalContribution(depositGoalId, depositAmount);
    setDepositGoalId(null);
    setDepositAmount(5000);
  };

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalMonthlySIP = goals.reduce(
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
              Target Capital Sinking Funds (SIPs)
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              {goals.length} NODES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Automated monthly capital rings and deterministic milestone completion schedules.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Target Ring</span>
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Cumulative Capital Accrued</span>
          <p className="text-lg font-bold text-slate-100">{formatCurrency(totalSaved, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Monthly SIP Commitment</span>
          <p className="text-lg font-bold text-indigo-400">{formatCurrency(totalMonthlySIP, user.currency)}/mo</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Aggregate Completion</span>
          <p className="text-lg font-bold text-emerald-400">
            {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Goals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

          return (
            <div
              key={g.id}
              className={`rounded border p-3.5 space-y-2.5 bg-slate-900 flex flex-col justify-between ${
                g.isCompleted
                  ? 'border-emerald-500/40'
                  : g.isPaused
                  ? 'border-slate-800 opacity-60'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 truncate">{g.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateGoal(g.id, { isPaused: !g.isPaused })}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      title={g.isPaused ? 'Resume' : 'Pause'}
                    >
                      {g.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-100">{formatCurrency(g.currentAmount, user.currency)}</span>
                  <span className="text-[10px] text-slate-400">/ {formatCurrency(g.targetAmount, user.currency)}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      g.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Monthly SIP:</span>
                  <span className="font-bold text-slate-200">{formatCurrency(g.monthlyContribution, user.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Date:</span>
                  <span>{formatDate(g.targetDate)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDepositGoalId(g.id);
                  setDepositAmount(g.monthlyContribution || 5000);
                }}
                disabled={g.isCompleted}
                className="w-full rounded bg-slate-800 hover:bg-slate-700 py-1.5 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                + Deposit Funds
              </button>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setDepositGoalId(null)} />
          <div className="relative w-full max-w-sm rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-mono">
            <h3 className="text-xs font-bold uppercase pb-2 border-b border-slate-800">Deposit Target SIP</h3>
            <form onSubmit={handleDeposit} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Contribution Amount</label>
                <input
                  type="number"
                  min="100"
                  step="500"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-bold text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1 font-bold text-white hover:bg-indigo-500"
                >
                  Confirm SIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase">{editingGoal ? 'Edit Target Ring' : 'New Target Ring'}</h3>
              <button onClick={() => setIsCreateOpen(false)} className="rounded p-1 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveGoal} className="mt-3 space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Target Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro M3, Emergency 6-mo Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Target Ceiling</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Monthly SIP</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Target Horizon Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 text-xs"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
