import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  Smartphone,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode, RegisterDetails } from '../../types/finance';
import { CURRENCIES_LIST, CURRENCY_CONFIGS, formatCurrency } from '../../lib/utils';
import { PRESET_USERS } from '../../lib/mockData';

export const AuthPage: React.FC = () => {
  const { setActiveTab, login, registerUser, loginWithPreset, addToast } = useFinance();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('rahul.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [pinUnlockMode, setPinUnlockMode] = useState(false);
  const [loginPin, setLoginPin] = useState('');

  // Register multi-step state
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOccupation, setRegOccupation] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCurrency, setRegCurrency] = useState<CurrencyCode>('INR');
  const [regSalary, setRegSalary] = useState<number>(85000);
  const [regSalaryDate, setRegSalaryDate] = useState<number>(1);
  const [regCheckingBalance, setRegCheckingBalance] = useState<number>(60000);
  const [regSavingsBalance, setRegSavingsBalance] = useState<number>(90000);
  const [regEmergencyReserve, setRegEmergencyReserve] = useState<number>(200000);
  const [regDiscretionaryPercent, setRegDiscretionaryPercent] = useState<number>(25);
  const [regPin, setRegPin] = useState<string>('2026');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinUnlockMode) {
      if (loginPin.length !== 4) {
        addToast({ type: 'error', title: 'Invalid PIN', message: 'Please enter your 4-digit code.' });
        return;
      }
      login('rahul.sharma@example.com', 'Rahul Sharma');
      return;
    }
    if (!loginEmail.trim()) {
      addToast({ type: 'error', title: 'Email required', message: 'Please enter your registered email.' });
      return;
    }
    login(loginEmail.trim());
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      addToast({ type: 'error', title: 'Name required', message: 'Please provide your full name.' });
      setRegStep(1);
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      addToast({ type: 'error', title: 'Valid Email required', message: 'Please enter a valid email.' });
      setRegStep(1);
      return;
    }

    const payload: RegisterDetails = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      occupation: regOccupation.trim() || 'Software Engineer',
      company: regCompany.trim() || 'Tech Labs',
      phone: regPhone.trim(),
      pin: regPin || '2026',
      currency: regCurrency,
      monthlySalary: Math.max(0, regSalary || 0),
      salaryDate: regSalaryDate,
      initialCheckingBalance: regCheckingBalance,
      initialSavingsBalance: regSavingsBalance,
      minimumEmergencyReserve: regEmergencyReserve,
      discretionaryBudgetPercent: regDiscretionaryPercent,
    };

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {}

    registerUser(payload);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 sm:px-8 backdrop-blur-md">
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
            <span className="font-mono font-extrabold text-sm">S</span>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-100">SalaryOS</span>
        </div>

        <button
          onClick={() => setActiveTab('landing')}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          Back to Overview
        </button>
      </header>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Header text */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
              <Shield className="h-3.5 w-3.5" />
              <span>Deterministic Financial OS</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              {tab === 'login' ? 'Welcome back to SalaryOS' : 'Create Your Financial Profile'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {tab === 'login'
                ? 'Sign in to access your live cashflow velocity and targets.'
                : 'Enter your salary and payday schedule to build your deterministic cashflow matrix.'}
            </p>
          </div>

          {/* Toggle pill */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold mb-6">
            <button
              onClick={() => setTab('login')}
              className={`py-2 rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('register');
                setRegStep(1);
              }}
              className={`py-2 rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register & Intake Details
            </button>
          </div>

          {/* 1. LOGIN TAB */}
          {tab === 'login' && (
            <div className="space-y-5">
              {/* PIN Unlock toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">Security PIN Mode</span>
                    <span className="text-[10px] text-slate-400">Unlock quickly with a 4-digit code</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPinUnlockMode(!pinUnlockMode)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    pinUnlockMode ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                      pinUnlockMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {pinUnlockMode ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      4-Digit Security PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-center text-lg tracking-widest font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-9 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all min-h-[44px]"
                >
                  <Lock className="h-4 w-4" />
                  <span>{pinUnlockMode ? 'Unlock With PIN' : 'Sign In to Dashboard'}</span>
                </button>
              </form>

              {/* 1-Click Demographic & Salary Test Presets */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick 1-Click Profile Switching
                  </span>
                  <span className="text-[10px] text-indigo-400">Instant test accounts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_USERS.map((preset, idx) => (
                    <button
                      key={preset.profile.id}
                      type="button"
                      onClick={() => loginWithPreset(idx)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-left hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group"
                    >
                      <img
                        src={preset.profile.avatarUrl}
                        alt={preset.profile.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300">
                            {preset.profile.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 block truncate">
                          {preset.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. REGISTER / INTAKE DETAILS TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      regStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-xs ${regStep === 1 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Personal Identity
                  </span>
                </div>
                <div className="h-0.5 w-6 bg-slate-800" />
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      regStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-xs ${regStep === 2 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Salary & Payday
                  </span>
                </div>
                <div className="h-0.5 w-6 bg-slate-800" />
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      regStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    3
                  </span>
                  <span className={`text-xs ${regStep === 3 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Security PIN
                  </span>
                </div>
              </div>

              {/* Step 1: Personal Identity */}
              {regStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Siddharth Rao"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Work / Personal Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="siddharth@enterprise.com"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Occupation / Role *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={regOccupation}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder="e.g. Senior Frontend Architect"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Company / Employer
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="e.g. Stripe / Remote"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create strong password"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-9 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!regName.trim()) {
                          addToast({ type: 'error', title: 'Name required', message: 'Please enter your name.' });
                          return;
                        }
                        if (!regEmail.trim()) {
                          addToast({ type: 'error', title: 'Email required', message: 'Please enter your email.' });
                          return;
                        }
                        setRegStep(2);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 min-h-[44px]"
                    >
                      <span>Continue to Salary Matrix</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Salary & Payday */}
              {regStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Base Currency
                      </label>
                      <select
                        value={regCurrency}
                        onChange={(e) => setRegCurrency(e.target.value as CurrencyCode)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none font-mono"
                      >
                        {CURRENCIES_LIST.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.symbol} {c.code} — {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Monthly Net Take-Home Salary *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-emerald-400 font-mono">
                          {CURRENCIES_LIST.find((c) => c.code === regCurrency)?.symbol || '₹'}
                        </span>
                        <input
                          type="number"
                          required
                          min={0}
                          value={regSalary || ''}
                          onChange={(e) => setRegSalary(Number(e.target.value))}
                          placeholder="85000"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs font-mono font-bold text-emerald-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Payday Schedule (Day of Month)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 5, 7, 10, 15, 25, 28, 30, 31].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setRegSalaryDate(day)}
                          className={`flex-1 min-w-[42px] py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                            regSalaryDate === day
                              ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {day}
                          <span className="text-[9px] text-slate-500 block font-sans font-normal">
                            {day === 1 ? '1st' : day === 28 ? 'End' : 'th'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Current Checking Balance
                      </label>
                      <input
                        type="number"
                        value={regCheckingBalance || ''}
                        onChange={(e) => setRegCheckingBalance(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Emergency Reserve Goal
                      </label>
                      <input
                        type="number"
                        value={regEmergencyReserve || ''}
                        onChange={(e) => setRegEmergencyReserve(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs font-mono text-emerald-400 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 min-h-[44px]"
                    >
                      <span>Security & Finish</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Security & Confirmation */}
              {regStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Set 4-Digit Quick Access PIN *
                    </label>
                    <div className="relative max-w-xs mx-auto">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-center text-xl tracking-widest font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Name:</span>
                      <span className="font-bold text-slate-200">{regName || 'Siddharth Rao'}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Occupation:</span>
                      <span className="font-medium text-slate-300">{regOccupation || 'Software Engineer'}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Monthly Net Salary:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatCurrency(regSalary, regCurrency)} (Payday: {regSalaryDate}th)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Reserve:</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {formatCurrency(regEmergencyReserve, regCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] min-h-[44px]"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Launch SalaryOS Engine</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 px-4 py-4 text-center text-xs text-slate-500">
        <p>SalaryOS • Deterministic Cashflow & Reserve Architecture</p>
      </footer>
    </div>
  );
};
