import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { BudgetCategory, CategoryKey } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';

export const BudgetManager: React.FC = () => {
  const {
    user,
    budgets,
    categories,
    transactions,
    addBudget,
    updateBudget,
    deleteBudget,
    addToast,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);

  // Form State
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'cat_housing');
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [color, setColor] = useState('#6366f1');

  // Calculate actual spending per budget category
  const budgetAnalytics = budgets.map((b) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          !t.goalId &&
          (t.categoryId === b.categoryId || t.categoryKey === b.categoryKey)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = b.monthlyLimit - spent;
    const pct = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;

    let status: 'normal' | 'near_limit' | 'over_budget' = 'normal';
    if (pct > 100) status = 'over_budget';
    else if (pct >= 80) status = 'near_limit';

    return {
      ...b,
      spent,
      remaining,
      pct,
      status,
    };
  });

  const totalBudgetCap = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalActualSpent = budgetAnalytics.reduce((s, b) => s + b.spent, 0);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setSelectedCatId(categories[0]?.id || '');
    setMonthlyLimit(5000);
    setColor('#6366f1');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: BudgetCategory) => {
    setEditingBudget(b);
    setSelectedCatId(b.categoryId);
    setMonthlyLimit(b.monthlyLimit);
    setColor(b.color);
    setIsAddModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === selectedCatId) || categories[0];

    if (editingBudget) {
      updateBudget(editingBudget.id, {
        monthlyLimit,
        color,
      });
      addToast({ type: 'success', title: 'Budget node updated', message: `${cat.name} cap adjusted.` });
    } else {
      addBudget({
        categoryKey: cat.key as CategoryKey,
        categoryName: cat.name,
        categoryId: cat.id,
        monthlyLimit,
        color,
        isFixedCommitted: cat.isEssential,
      });
      addToast({ type: 'success', title: 'Budget node created', message: `${cat.name} added.` });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Budget Allocation Matrix
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              {budgets.length} NODES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Category ceiling caps, live telemetry pacing, and over-allocation guards.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Budget Node</span>
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Total Monthly Cap</span>
          <p className="font-mono text-lg font-bold text-slate-100">{formatCurrency(totalBudgetCap, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Actual Realized Outflow</span>
          <p className="font-mono text-lg font-bold text-slate-100">{formatCurrency(totalActualSpent, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Cap Utilization</span>
          <p className="font-mono text-lg font-bold text-indigo-400">
            {totalBudgetCap > 0 ? ((totalActualSpent / totalBudgetCap) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {budgetAnalytics.map((b) => (
          <div
            key={b.id}
            className={`rounded border p-3.5 space-y-2.5 bg-slate-900 flex flex-col justify-between transition-all ${
              b.status === 'over_budget'
                ? 'border-rose-500/40'
                : b.status === 'near_limit'
                ? 'border-amber-500/40'
                : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: b.color }} />
                  <h3 className="font-bold text-xs font-mono text-slate-200 truncate">{b.categoryName}</h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-sm font-bold text-slate-100">{formatCurrency(b.spent, user.currency)}</span>
                <span className="text-[10px] text-slate-400">of {formatCurrency(b.monthlyLimit, user.currency)}</span>
              </div>

              {/* Progress bar */}
              <div className="mt-1.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    b.status === 'over_budget'
                      ? 'bg-rose-500'
                      : b.status === 'near_limit'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, b.pct)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">
                {b.remaining >= 0 ? `${formatCurrency(b.remaining, user.currency)} left` : `${formatCurrency(Math.abs(b.remaining), user.currency)} over`}
              </span>
              <span
                className={`font-bold ${
                  b.status === 'over_budget'
                    ? 'text-rose-400'
                    : b.status === 'near_limit'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {b.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-100 font-mono uppercase">
                {editingBudget ? 'Edit Budget Node' : 'Create Budget Node'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="mt-3 space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                <select
                  disabled={!!editingBudget}
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isEssential ? '(Fixed / Essential)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Monthly Limit</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold focus:border-indigo-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Telemetry Color Tag</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 h-8 w-full rounded border border-slate-700 bg-slate-950 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Save Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
