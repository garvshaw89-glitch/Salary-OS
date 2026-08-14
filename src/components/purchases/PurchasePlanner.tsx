import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  Trash2,
  Shield,
  Calculator,
  Zap,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { PaymentOption } from '../../types/finance';
import { formatCurrency, formatDate } from '../../lib/utils';
import { analyzePurchaseAffordability, calculateEMI } from '../../lib/calculations';

export const PurchasePlanner: React.FC = () => {
  const {
    user,
    accounts,
    goals,
    subscriptions,
    budgets,
    transactions,
    purchases,
    addPurchase,
    deletePurchase,
    availableToSpend,
    liquidFunds,
    addToast,
  } = useFinance();

  // New Purchase Simulation State
  const [productTitle, setProductTitle] = useState('Apple MacBook Pro 14" M3');
  const [price, setPrice] = useState<number>(80000);
  const [category, setCategory] = useState('Electronics & Gear');
  const [targetDate, setTargetDate] = useState('2026-10-15');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('savings');
  const [notes, setNotes] = useState('');

  // EMI Sub-state
  const [emiDownPayment, setEmiDownPayment] = useState(10000);
  const [emiRate, setEmiRate] = useState(13.5);
  const [emiTenure, setEmiTenure] = useState(6);
  const [emiFee, setEmiFee] = useState(499);

  // Live Deterministic Analysis
  const analysis = analyzePurchaseAffordability({
    price,
    paymentMethod,
    user,
    accounts,
    goals,
    subscriptions,
    budgetCategories: budgets,
    transactions,
    emiDetails:
      paymentMethod === 'emi'
        ? {
            interestRate: emiRate,
            tenureMonths: emiTenure,
            downPayment: emiDownPayment,
            processingFee: emiFee,
          }
        : undefined,
  });

  const emiResult =
    paymentMethod === 'emi'
      ? calculateEMI(price - emiDownPayment, emiRate, emiTenure, emiDownPayment, emiFee)
      : null;

  const handleSaveToPlanned = () => {
    if (!productTitle || price <= 0) {
      addToast({ type: 'error', title: 'Invalid input', message: 'Enter a valid item name and price.' });
      return;
    }

    addPurchase({
      title: productTitle,
      price,
      category,
      paymentMethod,
      targetDate,
      notes,
      emiDetails:
        paymentMethod === 'emi'
          ? {
              principal: price - emiDownPayment,
              interestRate: emiRate,
              tenureMonths: emiTenure,
              downPayment: emiDownPayment,
              processingFee: emiFee,
            }
          : undefined,
    });
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Title & Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Capital Outflow Affordability Simulator
            </h1>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/30">
              DETERMINISTIC SIM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Strict multi-factor mathematical evaluation against liquid reserves and SIP milestones.
          </p>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Form: Purchase Parameters (5 cols) */}
        <div className="lg:col-span-5 rounded border border-slate-800 bg-slate-900 p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Purchase Parameters
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              Liquid: {formatCurrency(liquidFunds, user.currency)}
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Target Item / Expense</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. MacBook Pro, Phone, Vacation"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-slate-400">Unit Price</label>
                <span className="font-mono font-bold text-indigo-400 text-xs">
                  {formatCurrency(price, user.currency)}
                </span>
              </div>
              <input
                type="number"
                min="500"
                step="500"
                value={price}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold focus:border-indigo-500 focus:outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
                >
                  <option value="Electronics & Gear">Electronics & Gear</option>
                  <option value="Home & Furniture">Home & Furniture</option>
                  <option value="Travel & Vacation">Travel & Vacation</option>
                  <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  <option value="Vehicle & Transport">Vehicle & Transport</option>
                  <option value="Education & Course">Education & Course</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Execution Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Funding Method</label>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {(['cash', 'savings', 'credit', 'emi'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPaymentMethod(opt)}
                    className={`rounded border py-1.5 text-[10px] font-bold uppercase transition-all font-mono ${
                      paymentMethod === opt
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* EMI Parameters */}
            {paymentMethod === 'emi' && (
              <div className="rounded border border-slate-800 bg-slate-950 p-2.5 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase">
                  <Calculator className="h-3 w-3 text-indigo-400" />
                  <span>Financing Breakdown</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="text-slate-400">Down Payment</label>
                    <input
                      type="number"
                      value={emiDownPayment}
                      onChange={(e) => setEmiDownPayment(Number(e.target.value))}
                      className="mt-0.5 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Annual APR (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={emiRate}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="mt-0.5 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Tenure (Mo)</label>
                    <select
                      value={emiTenure}
                      onChange={(e) => setEmiTenure(Number(e.target.value))}
                      className="mt-0.5 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-slate-100 font-mono"
                    >
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">Fee</label>
                    <input
                      type="number"
                      value={emiFee}
                      onChange={(e) => setEmiFee(Number(e.target.value))}
                      className="mt-0.5 w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-slate-100"
                    />
                  </div>
                </div>

                {emiResult && (
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Monthly Obligation:</span>
                    <span className="font-mono font-bold text-indigo-400 text-xs">
                      {formatCurrency(emiResult.monthlyEmi, user.currency)}/mo
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Notes / Rationale</label>
              <textarea
                rows={1}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Discounts, trade-in, etc."
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>

            <button
              onClick={handleSaveToPlanned}
              className="w-full rounded bg-slate-800 hover:bg-slate-700 py-2 font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 mt-1 border border-slate-700 text-xs"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
              <span>Add to Planned Matrix</span>
            </button>
          </div>
        </div>

        {/* Right Output: Verdict & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Verdict Card */}
          <div
            className={`rounded border p-4 transition-all bg-slate-900 ${
              analysis.status === 'SAFE'
                ? 'border-emerald-500/40'
                : analysis.status === 'CAUTION'
                ? 'border-amber-500/40'
                : 'border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {analysis.status === 'SAFE' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : analysis.status === 'CAUTION' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono">
                    {analysis.headline}
                  </h3>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                    Deterministic Status
                  </span>
                </div>
              </div>

              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
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

            <p className="mt-2.5 text-xs text-slate-300 leading-snug border-t border-slate-800 pt-2 font-mono">
              {analysis.explanation}
            </p>

            {/* Checklist */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] pt-2 border-t border-slate-800 font-mono">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    analysis.rulesEvaluated.passedEmergencyReserveCheck ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span className="text-slate-300">
                  Reserve Preserved (≥ {formatCurrency(user.minimumEmergencyReserve, user.currency)})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    analysis.rulesEvaluated.passedAvailableCashCheck ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span className="text-slate-300">Covers monthly locked bills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    !analysis.rulesEvaluated.impactsGoalDeadlines ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-300">{analysis.metrics.impactOnGoalsSummary}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    analysis.rulesEvaluated.passedDiscretionaryBufferCheck ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-300">
                  Buffer Left: {analysis.metrics.discretionaryBufferPercentAfter}%
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Simulation Matrix */}
          <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-2 font-mono">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Deterministic Before vs After Simulation
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded bg-slate-950 p-2 border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Metric</span>
              </div>
              <div className="rounded bg-slate-950 p-2 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Baseline</span>
              </div>
              <div className="rounded bg-slate-950 p-2 border border-slate-800">
                <span className="text-[9px] text-indigo-400 uppercase font-bold">Simulated</span>
              </div>

              {/* Row 1: Liquid Funds */}
              <div className="text-left font-medium text-slate-400 p-1 text-[11px]">Liquid Cash</div>
              <div className="font-mono font-semibold text-slate-300 p-1 text-[11px]">
                {formatCurrency(liquidFunds, user.currency)}
              </div>
              <div className="font-mono font-bold text-slate-100 p-1 text-[11px]">
                {formatCurrency(
                  Math.max(0, liquidFunds - (paymentMethod === 'emi' && emiResult ? emiResult.downPayment : price)),
                  user.currency
                )}
              </div>

              {/* Row 2: Available to Spend */}
              <div className="text-left font-medium text-slate-400 p-1 text-[11px]">Safe Buffer</div>
              <div className="font-mono font-semibold text-slate-300 p-1 text-[11px]">
                {formatCurrency(availableToSpend, user.currency)}
              </div>
              <div
                className={`font-mono font-bold p-1 text-[11px] ${
                  analysis.metrics.remainingAvailableAfterPurchase < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatCurrency(analysis.metrics.remainingAvailableAfterPurchase, user.currency)}
              </div>

              {/* Row 3: Emergency Reserve */}
              <div className="text-left font-medium text-slate-400 p-1 text-[11px]">Emergency</div>
              <div className="font-mono font-semibold text-slate-300 p-1 text-[11px]">
                {formatCurrency(user.minimumEmergencyReserve, user.currency)}
              </div>
              <div
                className={`font-mono font-bold p-1 text-[11px] ${
                  analysis.metrics.emergencyReserveAfterPurchase < user.minimumEmergencyReserve
                    ? 'text-rose-400'
                    : 'text-slate-100'
                }`}
              >
                {formatCurrency(analysis.metrics.emergencyReserveAfterPurchase, user.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planned Purchases List */}
      <div className="rounded border border-slate-800 bg-slate-900 p-3.5 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase">Planned Purchase Matrix</h3>
            <p className="text-[10px] text-slate-500">Tracked wishlist nodes</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">{purchases.length} items</span>
        </div>

        {purchases.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No planned purchases saved. Use the simulator above to log new targets.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {purchases.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded border border-slate-800 bg-slate-950 p-3 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-slate-200 truncate">{item.title}</span>
                    <button
                      onClick={() => deletePurchase(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-mono font-bold text-xs text-indigo-400 mt-0.5">
                    {formatCurrency(item.price, user.currency)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-slate-400">
                    <span className="rounded bg-slate-900 px-1 py-0.2 uppercase border border-slate-800">
                      {item.paymentMethod}
                    </span>
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{item.targetDate ? formatDate(item.targetDate) : 'Flexible'}</span>
                  <button
                    onClick={() => {
                      setProductTitle(item.title);
                      setPrice(item.price);
                      setPaymentMethod(item.paymentMethod);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    Simulate →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
