import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Wallet,
  ShoppingBag,
  Target,
  PieChart,
  Repeat,
  Activity,
  Layers,
  ChevronDown,
  TrendingUp,
  Cpu,
  Download,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { analyzePurchaseAffordability } from '../../lib/calculations';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from '../../lib/mockData';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoMode, openAuthModal } = useFinance();
  const [demoPrice, setDemoPrice] = useState<number>(80000);
  const [demoProduct, setDemoProduct] = useState<string>('MacBook Pro M3');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Live interactive calculation for landing hero
  const demoAnalysis = analyzePurchaseAffordability({
    price: demoPrice,
    paymentMethod: 'savings',
    user: INITIAL_USER,
    accounts: INITIAL_ACCOUNTS,
    goals: INITIAL_GOALS,
    subscriptions: INITIAL_SUBSCRIPTIONS,
    budgetCategories: INITIAL_BUDGETS,
    transactions: INITIAL_TRANSACTIONS,
  });

  const faqs = [
    {
      q: 'What is SalaryOS?',
      a: 'SalaryOS is a personal finance SaaS designed for salaried professionals and first-job earners. It guides your money from the exact day you get paid to the end of the month with deterministic planning, emergency reserves, and signature purchase affordability simulations.',
    },
    {
      q: 'How does the "Can I Afford This?" calculation work?',
      a: 'Unlike apps that give arbitrary scores, SalaryOS evaluates your live liquid funds, committed bills in the current cycle, your minimum emergency reserve safety line, and your active goal timelines. It calculates exact before/after metrics so you see the real mathematical impact on your future before you swipe your card.',
    },
    {
      q: 'Does SalaryOS force the standard 50/30/20 budgeting rule?',
      a: 'No. Rigid rules fail in real life when rent or living costs fluctuate. SalaryOS gives you a custom allocation studio to partition your paycheck into essentials, emergency fund, active goals, and discretionary lifestyle as you see fit.',
    },
    {
      q: 'Is my financial data safe and private?',
      a: 'Yes. All calculations are strictly deterministic and run in your browser session. You can export 100% of your records to CSV or JSON anytime, and delete your account with one click.',
    },
    {
      q: 'Is SalaryOS a regulated financial advisor?',
      a: 'No. SalaryOS is a budgeting, mathematical simulation, and educational planning tool. It does not provide personalized tax, loan, or investment advisory.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-900 bg-neutral-950/80 px-4 md:px-10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-neutral-950 font-bold shadow-sm">
            <span className="font-mono-num font-extrabold text-sm tracking-tighter">S</span>
          </div>
          <span className="font-bold text-base tracking-tight text-neutral-100">SalaryOS</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-neutral-700 hover:text-white transition-all"
          >
            Sign In
          </button>
          <button
            onClick={loadDemoMode}
            className="hidden sm:inline-flex rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-all"
          >
            Explore Live Demo
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-emerald-400 transition-all"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get Paid. Plan Smart. Spend With Confidence.</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-100 leading-tight">
            Your salary deserves <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              a real plan.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed">
            Plan your monthly income, protect your emergency reserve, fund major goals, and know the exact mathematical impact before your next big purchase.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all"
            >
              <span>Create Account & Intake Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-6 py-3 text-sm font-semibold text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900 transition-all"
            >
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Sign In</span>
            </button>
            <button
              onClick={loadDemoMode}
              className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-3 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-all"
            >
              <span>Demo Mode</span>
            </button>
          </div>

          {/* Interactive Live Hero Simulation Widget */}
          <div className="mt-14 mx-auto max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-7 shadow-2xl text-left backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Interactive Affordability Engine Preview
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">Live test with ₹60,000 baseline salary</span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300">Planned Item</label>
                  <input
                    type="text"
                    value={demoProduct}
                    onChange={(e) => setDemoProduct(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-300">Estimated Price</label>
                    <span className="font-mono-num text-xs text-emerald-400 font-bold">
                      {formatCurrency(demoPrice, 'INR')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="5000"
                    value={demoPrice}
                    onChange={(e) => setDemoPrice(Number(e.target.value))}
                    className="mt-2 w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono-num">
                    <span>₹5,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>
              </div>

              {/* Live Output */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                      Calculation Verdict
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        demoAnalysis.status === 'SAFE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : demoAnalysis.status === 'CAUTION'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {demoAnalysis.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                    {demoAnalysis.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500">Emergency Reserve:</span>
                    <p className="font-mono-num font-semibold text-neutral-200">
                      ₹{demoAnalysis.metrics.emergencyReserveAfterPurchase.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Goal Impact:</span>
                    <p className="font-mono-num font-semibold text-neutral-200">
                      {demoAnalysis.metrics.impactOnGoalsSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & THE SOLUTION */}
      <section className="border-t border-neutral-900 bg-neutral-950 py-16 px-4 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">The Problem</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
                The paycheck illusion: Why salaried earners still feel broke.
              </h2>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                When your salary hits your account on the 1st, it looks huge. You spend freely. But by the 18th, unexpected bills, unnoticed subscriptions, and impulsive purchases drain your balance — forcing you to wait for the next paycheck.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                  No clear view of true "safe-to-spend" discretionary capacity.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                  Large purchases deplete emergency funds without warning.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                  Delayed financial goals due to friction and unmonitored leaks.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The SalaryOS Method</span>
              <h3 className="text-xl font-bold text-neutral-100">
                TRACK → PLAN → SAVE → PURCHASE → REVIEW
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                SalaryOS creates a deterministic firewall between your essential commitments, your emergency fund, your long-term dreams, and your daily spending.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-neutral-950 p-3 border border-neutral-800">
                  <p className="font-semibold text-emerald-400">Automated Isolation</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Salary is allocated the instant it arrives.</p>
                </div>
                <div className="rounded-lg bg-neutral-950 p-3 border border-neutral-800">
                  <p className="font-semibold text-teal-400">Zero AI Guesswork</p>
                  <p className="text-[11px] text-neutral-400 mt-1">100% transparent, verifiable formulas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS GRID */}
      <section className="border-t border-neutral-900 bg-neutral-900/40 py-20 px-4 md:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Engineered For Clarity</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-100">
            Everything your monthly paycheck needs.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-400">
            No fluffy generic charts. Every module answers an exact financial question.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Wallet className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">Paycheck Allocation Studio</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Partition your salary into Essentials, Emergency Cushion, Savings SIPs, and Lifestyle without dogmatic 50/30/20 rules.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">"Can I Afford This?" Engine</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Test any upcoming purchase (laptop, vacation, watch) against your liquid reserves, upcoming bills, and goal delays.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">Target-Driven Goals</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Track exact completion timelines for dream upgrades, emergency funds, and travel with milestone celebrations.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <PieChart className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">Budget Pacing & Limits</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Category spending bars that give non-shaming alerts (Normal, Near Limit, Over Budget) to maintain pacing.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Repeat className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">Subscription Sentinel</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Expose hidden recurring leaks. Track monthly vs annual recurring load and upcoming renewal calendar dates.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 hover:border-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">Lifestyle Inflation Tracker</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Compare salary growth % against lifestyle spending escalation to ensure every career promotion actually boosts your net worth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & PRIVACY SECTION */}
      <section className="border-t border-neutral-900 bg-neutral-950 py-16 px-4 md:px-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100">Bank-Grade Privacy & Local Ownership</h3>
              <p className="text-xs text-neutral-400">Your numbers are private to you alone.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-1" />
              <p className="font-semibold text-neutral-200">Zero Data Selling</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">We never monetize, harvest, or broker your personal financial records.</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-1" />
              <p className="font-semibold text-neutral-200">Full CSV/JSON Export</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Export all transactions, goals, and budgets in standardized open formats anytime.</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-1" />
              <p className="font-semibold text-neutral-200">Transparent Math</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Every formula is open, reproducible, and verifiable via built-in unit tests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="border-t border-neutral-900 bg-neutral-950 py-16 px-4 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Questions & Answers</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-neutral-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="border-t border-neutral-900 bg-gradient-to-b from-neutral-950 to-emerald-950/20 py-20 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
            Take command of your next salary.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 leading-relaxed">
            Join thousands of disciplined professionals who spend without regret and save with mathematical confidence.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all"
            >
              <span>Get Started In 2 Minutes</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={loadDemoMode}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-neutral-300 hover:border-neutral-700 hover:text-white transition-all"
            >
              Explore Demo Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-10 px-4 md:px-10 text-xs text-neutral-500">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-neutral-950 font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-neutral-300">SalaryOS</span>
            <span className="text-[11px] text-neutral-600">© 2026 SalaryOS Inc. All rights reserved.</span>
          </div>

          <div className="text-[11px] text-neutral-500 text-center sm:text-right max-w-md">
            SalaryOS is a budgeting, calculation, and educational tool. It does not provide regulated financial or investment advice.
          </div>
        </div>
      </footer>
    </div>
  );
};
