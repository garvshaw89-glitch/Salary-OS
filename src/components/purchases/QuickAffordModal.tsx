import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { PaymentOption } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';
import { analyzePurchaseAffordability } from '../../lib/calculations';

export const QuickAffordModal: React.FC = () => {
  const {
    isQuickAffordOpen,
    setIsQuickAffordOpen,
    setActiveTab,
    user,
    accounts,
    goals,
    subscriptions,
    budgets,
    transactions,
  } = useFinance();

  const [title, setTitle] = useState('New Purchase');
  const [price, setPrice] = useState<number>(15000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('cash');

  if (!isQuickAffordOpen) return null;

  const analysis = analyzePurchaseAffordability({
    price,
    paymentMethod,
    user,
    accounts,
    goals,
    subscriptions,
    budgetCategories: budgets,
    transactions,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
        onClick={() => setIsQuickAffordOpen(false)}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 font-mono uppercase">Affordability Audit</h3>
              <p className="text-[10px] text-slate-500 font-mono">Deterministic pre-spend evaluation</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAffordOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-3 text-xs font-mono">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Target Item / Expense</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony Headphones, Weekend Trip"
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-400">Price</label>
              <span className="font-mono font-bold text-indigo-400 text-xs">
                {formatCurrency(price, user.currency)}
              </span>
            </div>
            <input
              type="number"
              min="100"
              step="500"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold focus:border-indigo-500 focus:outline-none text-xs"
            />
          </div>

          {/* Quick Result Banner */}
          <div
            className={`rounded border p-3 space-y-1.5 ${
              analysis.status === 'SAFE'
                ? 'border-emerald-500/40 bg-slate-950'
                : analysis.status === 'CAUTION'
                ? 'border-amber-500/40 bg-slate-950'
                : 'border-rose-500/40 bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                {analysis.status === 'SAFE' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : analysis.status === 'CAUTION' ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                )}
                <span className="text-slate-100 text-xs font-mono">{analysis.headline}</span>
              </div>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase border ${
                  analysis.status === 'SAFE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : analysis.status === 'CAUTION'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {analysis.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-mono leading-tight">{analysis.explanation}</p>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => {
              setIsQuickAffordOpen(false);
              setActiveTab('purchases');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[11px]"
          >
            <span>Full Matrix Simulator</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={() => setIsQuickAffordOpen(false)}
            className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700 font-bold text-[11px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
