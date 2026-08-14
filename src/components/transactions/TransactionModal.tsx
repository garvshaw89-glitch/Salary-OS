import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType } from '../../types/finance';

export const TransactionModal: React.FC = () => {
  const {
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    categories,
    accounts,
    goals,
    addTransaction,
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<number>(500);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[1]?.id || 'cat_food');
  const [account, setAccount] = useState(accounts[0]?.name || 'Primary Checking');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Debit Card' | 'Credit Card' | 'Bank Transfer' | 'UPI' | 'Wallet'>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [linkedGoalId, setLinkedGoalId] = useState('');

  if (!isAddTransactionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) return;

    const matchedCat = categories.find((c) => c.id === categoryId) || categories[0];

    addTransaction({
      amount,
      type,
      date,
      categoryId: matchedCat.id,
      categoryName: matchedCat.name,
      categoryKey: matchedCat.key,
      description,
      account,
      paymentMethod,
      notes: notes.trim() || undefined,
      isRecurring,
      goalId: linkedGoalId || undefined,
    });

    setIsAddTransactionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
        onClick={() => setIsAddTransactionOpen(false)}
      />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-100 uppercase">
            Record Ledger Transaction
          </h3>
          <button
            onClick={() => setIsAddTransactionOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-xs">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-1.5 rounded py-1 text-xs font-bold uppercase transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>Expense (Outflow)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-1.5 rounded py-1 text-xs font-bold uppercase transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Income (Inflow)</span>
            </button>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Amount</label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery store, Uber, Client payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Account</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="UPI">UPI</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Link to Goal SIP (Optional) */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Link to Target SIP (Optional)</label>
            <select
              value={linkedGoalId}
              onChange={(e) => setLinkedGoalId(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="">None (Standard Outflow)</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTransactionOpen(false)}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-xs"
            >
              Commit Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
