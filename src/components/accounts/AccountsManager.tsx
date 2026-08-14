import React, { useState } from 'react';
import {
  Wallet,
  Building,
  CreditCard,
  PiggyBank,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Account, AccountType } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';

export const AccountsManager: React.FC = () => {
  const { user, accounts, addAccount, updateAccount, deleteAccount, addToast } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<Account | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState<number>(10000);
  const [institution, setInstitution] = useState('');
  const [color, setColor] = useState('#6366f1');

  const totalAssets = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netLiquidCapital = totalAssets - totalLiabilities;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingAcc) {
      updateAccount(editingAcc.id, {
        name,
        type,
        balance,
        institution,
        color,
      });
      setEditingAcc(null);
    } else {
      addAccount({
        name,
        type,
        balance,
        institution: institution || undefined,
        color,
      });
    }

    setIsAddOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingAcc(null);
    setName('');
    setType('bank');
    setBalance(10000);
    setInstitution('');
    setColor('#6366f1');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (a: Account) => {
    setEditingAcc(a);
    setName(a.name);
    setType(a.type);
    setBalance(a.balance);
    setInstitution(a.institution || '');
    setColor(a.color || '#6366f1');
    setIsAddOpen(true);
  };

  const getAccountIcon = (t: AccountType) => {
    switch (t) {
      case 'bank':
        return Building;
      case 'credit':
        return CreditCard;
      case 'investment':
        return PiggyBank;
      default:
        return Wallet;
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Liquidity Vaults & Accounts
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              {accounts.length} VAULTS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Checking balances, liquid reserve pools, and revolving credit instruments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Account Node</span>
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Gross Liquid Assets</span>
          <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalAssets, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Revolving Liabilities</span>
          <p className="text-lg font-bold text-rose-400">-{formatCurrency(totalLiabilities, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Net Liquid Position</span>
          <p className="text-lg font-bold text-slate-100">{formatCurrency(netLiquidCapital, user.currency)}</p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
        {accounts.map((acc) => {
          const Icon = getAccountIcon(acc.type);
          return (
            <div
              key={acc.id}
              className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="font-bold text-xs text-slate-200 truncate">{acc.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(acc)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteAccount(acc.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <p
                    className={`text-lg font-bold ${
                      acc.type === 'credit' ? 'text-rose-400' : 'text-slate-100'
                    }`}
                  >
                    {formatCurrency(acc.balance, user.currency)}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase mt-0.5">
                    {acc.institution || acc.type}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Node Type:</span>
                <span className="uppercase font-bold text-slate-300">{acc.type}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Account Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md rounded border border-slate-800 bg-slate-900 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase">{editingAcc ? 'Edit Vault Node' : 'New Vault Node'}</h3>
              <button onClick={() => setIsAddOpen(false)} className="rounded p-1 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAccount} className="mt-3 space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Salary, Emergency Liquid, Zerodha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AccountType)}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="bank">Bank Checking/Savings</option>
                    <option value="wallet">Liquid Wallet / Cash</option>
                    <option value="credit">Credit Card / Line</option>
                    <option value="investment">Investment / Demat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Current Balance</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Institution / Bank (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ICICI, HDFC, Chase"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none"
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
