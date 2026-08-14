import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType } from '../../types/finance';
import { exportToCSV, exportToJSON, formatCurrency, formatDate } from '../../lib/utils';

export const TransactionManager: React.FC = () => {
  const {
    user,
    transactions,
    deleteTransaction,
    setIsAddTransactionOpen,
    categories,
    accounts,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery =
        !searchQuery ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery);

      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCat = categoryFilter === 'all' || t.categoryId === categoryFilter || t.categoryName === categoryFilter;
      const matchesAcc = accountFilter === 'all' || t.account === accountFilter;

      return matchesQuery && matchesType && matchesCat && matchesAcc;
    }).sort((a, b) => {
      if (sortOrder === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === 'amount_desc') return b.amount - a.amount;
      if (sortOrder === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter, accountFilter, sortOrder]);

  const handleExportCSV = () => {
    exportToCSV(
      filteredTransactions.map((t) => ({
        Date: t.date,
        Description: t.description,
        Type: t.type,
        Category: t.categoryName,
        Amount: t.amount,
        Account: t.account,
        Method: t.paymentMethod,
        Notes: t.notes || '',
      })),
      `SalaryOS_Ledger_${new Date().toISOString().split('T')[0]}`
    );
  };

  const totalInflow = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOutflow = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Transactional Ledger & Stream
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              {filteredTransactions.length} ENTRIES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Immutable cashflow stream, tagged by allocation node and liquidity source.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddTransactionOpen(true)}
            className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-xs active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Summary Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="rounded border border-slate-800 bg-slate-900 p-2.5 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-500">Filtered Entries</span>
          <p className="text-sm font-bold text-slate-100">{filteredTransactions.length}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-2.5 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-500">Total Filtered Inflow</span>
          <p className="text-sm font-bold text-emerald-400">+{formatCurrency(totalInflow, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-2.5 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-500">Total Filtered Outflow</span>
          <p className="text-sm font-bold text-rose-400">-{formatCurrency(totalOutflow, user.currency)}</p>
        </div>

        <div className="rounded border border-slate-800 bg-slate-900 p-2.5 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-500">Net Flow Differential</span>
          <p className={`text-sm font-bold ${totalInflow - totalOutflow >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
            {formatCurrency(totalInflow - totalOutflow, user.currency)}
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded border border-slate-800 bg-slate-900 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Search */}
        <div className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-950 px-2.5 py-1 w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search ledger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-[11px] focus:outline-none font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Type */}
          <div className="flex rounded border border-slate-800 bg-slate-950 p-0.5 text-[10px]">
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                  typeFilter === t ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Account Dropdown */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="rounded border border-slate-800 bg-slate-900 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono">
          <thead className="bg-slate-950/60 text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Account Node</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-center w-10">Action</th>
            </tr>
          </thead>
          <tbody className="text-[11px] divide-y divide-slate-800/40">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                  No transaction records match the active criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2 text-slate-400 text-[10px] whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">
                    <div className="flex items-center gap-1.5">
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-400 shrink-0" />
                      ) : (
                        <ArrowDownLeft className="h-3 w-3 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate max-w-[220px]">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-400 text-[10px]">
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 border border-slate-700/60 text-slate-300">
                      {tx.categoryName}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-400 text-[10px]">{tx.account}</td>
                  <td className="px-3 py-2 text-slate-400 text-[10px]">{tx.paymentMethod}</td>
                  <td className="px-3 py-2 text-right font-bold">
                    <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}>
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, user.currency)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
