import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  Edit2,
  Trash2,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { BillingCycle, Subscription } from '../../types/finance';
import { formatCurrency, formatDate, formatRelativeDate } from '../../lib/utils';

export const SubscriptionsManager: React.FC = () => {
  const {
    user,
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addToast,
  } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(499);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('2026-09-01');
  const [category, setCategory] = useState('Entertainment');
  const [notes, setNotes] = useState('');

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const monthlyCost = activeSubs.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount;
    if (s.billingCycle === 'quarterly') return sum + s.amount / 3;
    if (s.billingCycle === 'annually') return sum + s.amount / 12;
    if (s.billingCycle === 'weekly') return sum + s.amount * 4.33;
    return sum;
  }, 0);

  const annualCost = monthlyCost * 12;

  const filteredSubs = subscriptions.filter((s) =>
    statusFilter === 'all' ? true : s.status === statusFilter
  );

  const handleSaveSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || amount <= 0) return;

    if (editingSub) {
      updateSubscription(editingSub.id, {
        name,
        amount,
        billingCycle,
        nextBillingDate,
        category,
        notes,
      });
      setEditingSub(null);
    } else {
      addSubscription({
        name,
        amount,
        billingCycle,
        nextBillingDate,
        category,
        status: 'active',
        paymentMethod: 'Credit Card',
        notes,
      });
    }

    setIsAddOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingSub(null);
    setName('');
    setAmount(499);
    setBillingCycle('monthly');
    setNextBillingDate('2026-09-01');
    setCategory('Entertainment');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (s: Subscription) => {
    setEditingSub(s);
    setName(s.name);
    setAmount(s.amount);
    setBillingCycle(s.billingCycle);
    setNextBillingDate(s.nextBillingDate);
    setCategory(s.category);
    setNotes(s.notes || '');
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Recurring Liabilities & Subscriptions
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              {activeSubs.length} ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Automated recurring outflows, renewal telemetry, and monthly cash drag audit.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Recurring Node</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Monthly Recurring Drag</span>
          <p className="text-lg font-bold text-slate-100">{formatCurrency(monthlyCost, user.currency)}/mo</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Annualized Outflow</span>
          <p className="text-lg font-bold text-amber-400">{formatCurrency(annualCost, user.currency)}/yr</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Income Drag Ratio</span>
          <p className="text-lg font-bold text-indigo-400">
            {user.monthlySalary > 0 ? ((monthlyCost / user.monthlySalary) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="rounded border border-slate-800 bg-slate-900 overflow-hidden font-mono">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/60 text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-3 py-2">Service / Provider</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Billing Cycle</th>
              <th className="px-3 py-2">Next Renewal</th>
              <th className="px-3 py-2 text-right">Cost</th>
              <th className="px-3 py-2 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[11px] divide-y divide-slate-800/40">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                  No subscriptions match filter.
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2 text-slate-200 font-bold">{sub.name}</td>
                  <td className="px-3 py-2 text-slate-400 text-[10px]">
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 border border-slate-700/60 text-slate-300">
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-400 text-[10px] uppercase">{sub.billingCycle}</td>
                  <td className="px-3 py-2 text-slate-300 text-[10px]">{formatRelativeDate(sub.nextBillingDate)}</td>
                  <td className="px-3 py-2 text-right font-bold text-amber-400">
                    {formatCurrency(sub.amount, user.currency)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          updateSubscription(sub.id, {
                            status: sub.status === 'active' ? 'paused' : 'active',
                          })
                        }
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        title={sub.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {sub.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase">{editingSub ? 'Edit Subscription' : 'New Subscription'}</h3>
              <button onClick={() => setIsAddOpen(false)} className="rounded p-1 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSub} className="mt-3 space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Spotify, AWS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Cost</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Next Renewal Date</label>
                <input
                  type="date"
                  required
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 text-xs"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
