import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Layers,
  Zap,
  Phone,
  HelpCircle,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance, AuthMode } from '../../context/FinanceContext';
import { CurrencyCode, RegisterDetails } from '../../types/finance';
import { CURRENCIES_LIST, CURRENCY_CONFIGS, formatCurrency } from '../../lib/utils';
import { PRESET_USERS } from '../../lib/mockData';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    registerUser,
    loginWithPreset,
    addToast,
  } = useFinance();

  // Mode: 'login' | 'register' | 'forgot'
  const mode = authModalMode;

  // Login form state
  const [loginEmail, setLoginEmail] = useState('rahul.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
  const [regSalary, setRegSalary] = useState<number>(75000);
  const [regSalaryDate, setRegSalaryDate] = useState<number>(1);
  const [regCheckingBalance, setRegCheckingBalance] = useState<number>(50000);
  const [regSavingsBalance, setRegSavingsBalance] = useState<number>(80000);
  const [regEmergencyReserve, setRegEmergencyReserve] = useState<number>(150000);
  const [regDiscretionaryPercent, setRegDiscretionaryPercent] = useState<number>(25);
  const [regPin, setRegPin] = useState<string>('2026');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  if (!isAuthModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', color: 'bg-slate-700', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-indigo-400', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-400', width: '100%' };
  };

  const passStrength = getPasswordStrength(regPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinUnlockMode) {
      if (loginPin.length !== 4) {
        addToast({ type: 'error', title: 'Invalid PIN', message: 'Please enter a 4-digit security PIN' });
        return;
      }
      login('rahul.sharma@example.com', 'Rahul Sharma');
      return;
    }

    if (!loginEmail.trim()) {
      addToast({ type: 'error', title: 'Email required', message: 'Please enter your account email.' });
      return;
    }
    // Perform simulated login
    login(loginEmail.trim());
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      addToast({ type: 'error', title: 'Name required', message: 'Please enter your full name.' });
      setRegStep(1);
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      addToast({ type: 'error', title: 'Valid Email required', message: 'Please enter a valid email address.' });
      setRegStep(1);
      return;
    }
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      addToast({ type: 'error', title: 'Passwords mismatch', message: 'Your passwords do not match.' });
      setRegStep(1);
      return;
    }

    const payload: RegisterDetails = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      occupation: regOccupation.trim() || 'Software Professional',
      company: regCompany.trim() || 'Tech Enterprise',
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    registerUser(payload);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
        addToast({ type: 'error', title: 'Invalid Email', message: 'Enter a valid registered email address.' });
        return;
      }
      setOtpCode('742918');
      setForgotStep(2);
      addToast({ type: 'info', title: 'Verification Code Sent', message: 'Use demo verification code 742918' });
    } else {
      if (!newResetPassword || newResetPassword.length < 6) {
        addToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters.' });
        return;
      }
      addToast({ type: 'success', title: 'Password Reset Complete', message: 'You can now sign in with your new credentials.' });
      setAuthModalMode('login');
      setForgotStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Main Dialog Container */}
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">
                {mode === 'login' && 'Sign in to SalaryOS'}
                {mode === 'register' && 'Create Your Financial Account'}
                {mode === 'forgot' && 'Reset Access Credentials'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {mode === 'login' && 'Deterministic personal finance & cashflow command'}
                {mode === 'register' && `Step ${regStep} of 3 • Profile & Salary intake`}
                {mode === 'forgot' && 'Secure password recovery telemetry'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            aria-label="Close auth dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setAuthModalMode('login')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In (Existing User)
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setRegStep(1);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account (Intake Details)
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-xs space-y-4">
          {/* ======================= 1. LOGIN VIEW ======================= */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* PIN Unlock toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block text-[11px]">Quick Security PIN Unlock</span>
                    <span className="text-[10px] text-slate-400">Use 4-digit code instead of password</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPinUnlockMode(!pinUnlockMode)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Enter 4-Digit Security PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-center text-lg tracking-widest font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 text-center">Demo default PIN is 2026 or 1234</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
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
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode('forgot');
                            setForgotEmail(loginEmail);
                          }}
                          className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-9 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                        />
                        <span>Remember credentials</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-medium">SSL Encrypted Session</span>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all min-h-[44px]"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{pinUnlockMode ? 'Unlock With PIN' : 'Sign In to Dashboard'}</span>
                </button>
              </form>

              {/* 1-Click Demographic & Salary Test Presets */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick 1-Click Profile Switching
                  </span>
                  <span className="text-[10px] text-indigo-400">Test different salary tiers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_USERS.map((preset, idx) => (
                    <button
                      key={preset.profile.id}
                      type="button"
                      onClick={() => loginWithPreset(idx)}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-left hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group"
                    >
                      <img
                        src={preset.profile.avatarUrl}
                        alt={preset.profile.name}
                        className="h-7 w-7 rounded-full object-cover border border-slate-700 shrink-0"
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

          {/* ======================= 2. REGISTER / DETAILS INTAKE ======================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Stepper Pill Indicators */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      regStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-[11px] font-medium ${regStep === 1 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Identity & Work
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
                  <span className={`text-[11px] font-medium ${regStep === 2 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Salary Matrix
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
                  <span className={`text-[11px] font-medium ${regStep === 3 ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                    Security
                  </span>
                </div>
              </div>

              {/* Step 1: Identity & Work Details */}
              {regStep === 1 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Vikram Malhotra"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Work / Personal Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="vikram@enterprise.com"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Occupation / Role *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={regOccupation}
                          onChange={(e) => setRegOccupation(e.target.value)}
                          placeholder="e.g. Staff DevOps Lead / Doctor"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Company / Employer
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="e.g. Google / Freelance"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create strong password"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-8 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      {/* Strength meter */}
                      {regPassword && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${passStrength.color} transition-all duration-300`} style={{ width: passStrength.width }} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{passStrength.label}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!regName.trim()) {
                          addToast({ type: 'error', title: 'Name required', message: 'Please provide your full name.' });
                          return;
                        }
                        if (!regEmail.trim()) {
                          addToast({ type: 'error', title: 'Email required', message: 'Please provide your email address.' });
                          return;
                        }
                        setRegStep(2);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 min-h-[44px]"
                    >
                      <span>Continue to Salary Matrix</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Salary & Financial Matrix */}
              {regStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Base Currency
                      </label>
                      <select
                        value={regCurrency}
                        onChange={(e) => setRegCurrency(e.target.value as CurrencyCode)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none font-mono"
                      >
                        {CURRENCIES_LIST.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.symbol} {c.code} — {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
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
                          step={1000}
                          value={regSalary || ''}
                          onChange={(e) => setRegSalary(Number(e.target.value))}
                          placeholder="60000"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-xs font-mono font-bold text-emerald-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payday Date Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Payday Schedule (Day of Month)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 5, 7, 10, 15, 25, 28, 30, 31].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setRegSalaryDate(day)}
                          className={`flex-1 min-w-[40px] py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
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
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Initial Checking Account Balance
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={regCheckingBalance || ''}
                        onChange={(e) => setRegCheckingBalance(Number(e.target.value))}
                        placeholder="Current checking cash"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Emergency Vault Target Reserve
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={regEmergencyReserve || ''}
                        onChange={(e) => setRegEmergencyReserve(Number(e.target.value))}
                        placeholder="e.g. 150000"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs font-mono text-emerald-400 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Realtime daily spend capacity preview */}
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-400" />
                      <div>
                        <span className="text-[11px] font-semibold text-slate-200 block">
                          Calculated Daily Spending Velocity
                        </span>
                        <span className="text-[10px] text-slate-400">Discretionary daily allowance</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {formatCurrency(Math.round((regSalary * 0.25) / 30), regCurrency)} / day
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 min-h-[44px]"
                    >
                      <span>Security & Finalize</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Security PIN & Launch */}
              {regStep === 3 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Set 4-Digit Quick Unlock PIN *
                    </label>
                    <div className="relative max-w-xs mx-auto">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-center text-lg tracking-widest font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 text-center">
                      Quick local PIN to access your financial telemetry securely
                    </p>
                  </div>

                  {/* Summary Confirmation Card */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className="text-[11px] text-slate-400">Account Owner</span>
                      <span className="text-xs font-bold text-slate-200">{regName || 'Vikram Malhotra'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className="text-[11px] text-slate-400">Professional Role</span>
                      <span className="text-xs font-medium text-slate-300">{regOccupation || 'Software Engineer'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <span className="text-[11px] text-slate-400">Monthly Net Salary</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {formatCurrency(regSalary, regCurrency)} (Payday: {regSalaryDate}th)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Emergency Vault Target</span>
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {formatCurrency(regEmergencyReserve, regCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] min-h-[44px]"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Launch My SalaryOS Engine</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ======================= 3. FORGOT PASSWORD ======================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Enter the email registered with your SalaryOS account to receive a security recovery code.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('login')}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 min-h-[44px]"
                    >
                      <span>Send Recovery Code</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-2.5 text-[11px] text-indigo-300">
                    Verification OTP has been sent to <strong>{forgotEmail}</strong>. (Simulated code: <strong>742918</strong>)
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="742918"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 px-3 text-center text-sm font-mono tracking-widest text-slate-100 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 min-h-[44px]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Update Password & Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Deterministic Local Encryption</span>
          </div>
          <span>v1.2.0 • ISO 27001 Security Standard</span>
        </div>
      </div>
    </div>
  );
};
