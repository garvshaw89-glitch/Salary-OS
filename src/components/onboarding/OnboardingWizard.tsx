import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Sparkles,
  Wallet,
  Building,
  Shield,
  Target,
  Sliders,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  KeyRound,
  Lock,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode, IncomeType } from '../../types/finance';
import { CURRENCY_CONFIGS, formatCurrency } from '../../lib/utils';

export const OnboardingWizard: React.FC = () => {
  const {
    user,
    updateUser,
    setActiveTab,
    addAccount,
    addBudget,
    addGoal,
    addTransaction,
    addToast,
    openAuthModal,
  } = useFinance();

  const [step, setStep] = useState(1);

  // Step 1 State: Identity & Work Details
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [occupation, setOccupation] = useState(user.occupation || 'Software Engineer');
  const [company, setCompany] = useState(user.company || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [currency, setCurrencyState] = useState<CurrencyCode>(user.currency || 'INR');

  // Step 2 State (Income & Payday)
  const [salary, setSalary] = useState<number>(user.monthlySalary || 75000);
  const [salaryDate, setSalaryDate] = useState<number>(user.salaryDate || 1);
  const [incomeType, setIncomeType] = useState<IncomeType>(user.incomeType || 'monthly');

  // Step 3 State (Fixed Expenses)
  const [rent, setRent] = useState(20000);
  const [food, setFood] = useState(9000);
  const [utilities, setUtilities] = useState(3500);
  const [transport, setTransport] = useState(4500);

  // Step 4 State (Emergency Fund)
  const [emergencyTarget, setEmergencyTarget] = useState(180000);
  const [currentEmergency, setCurrentEmergency] = useState(60000);
  const [monthlyEmergencyContrib, setMonthlyEmergencyContrib] = useState(8000);

  // Step 5 State (First Goal)
  const [goalName, setGoalName] = useState('MacBook Pro M3 / Dev Machine');
  const [goalTarget, setGoalTarget] = useState(95000);
  const [goalMonthly, setGoalMonthly] = useState(10000);

  // Step 6 State (Security PIN & Preferences)
  const [minReserve, setMinReserve] = useState(40000);
  const [pin, setPin] = useState(user.pin || '2026');

  const totalFixed = rent + food + utilities + transport;
  const totalCommitted = totalFixed + monthlyEmergencyContrib + goalMonthly;
  const remainingDiscretionary = Math.max(0, salary - totalCommitted);

  const handleFinish = () => {
    const finalName = name.trim() || 'Rahul Sharma';
    const finalEmail = email.trim().toLowerCase() || 'user@salaryos.local';

    // Save user profile with all details
    updateUser({
      name: finalName,
      email: finalEmail,
      occupation: occupation.trim() || 'Salaried Earner',
      company: company.trim(),
      phone: phone.trim(),
      pin: pin || '2026',
      currency,
      monthlySalary: salary,
      salaryDate,
      incomeType,
      minimumEmergencyReserve: minReserve,
      isOnboarded: true,
      isDemo: false,
      lastLoginAt: new Date().toISOString(),
    });

    // Create Initial Accounts
    addAccount({
      name: 'Primary Salary Checking',
      type: 'bank',
      balance: Math.max(1000, salary - totalFixed),
      institution: 'Primary Bank',
      color: '#0284c7',
    });
    addAccount({
      name: 'Emergency Savings Vault',
      type: 'savings',
      balance: currentEmergency,
      institution: 'Emergency Fund',
      color: '#10b981',
    });

    // Create Initial Budgets
    addBudget({
      categoryId: 'cat_housing',
      categoryName: 'Housing & Rent',
      categoryKey: 'housing',
      monthlyLimit: rent,
      color: '#6366f1',
    });
    addBudget({
      categoryId: 'cat_food',
      categoryName: 'Food & Dining',
      categoryKey: 'food',
      monthlyLimit: food,
      color: '#f97316',
    });
    addBudget({
      categoryId: 'cat_utilities',
      categoryName: 'Utilities & Internet',
      categoryKey: 'utilities',
      monthlyLimit: utilities,
      color: '#eab308',
    });
    addBudget({
      categoryId: 'cat_transport',
      categoryName: 'Transport & Fuel',
      categoryKey: 'transport',
      monthlyLimit: transport,
      color: '#06b6d4',
    });

    // Create Initial Goals
    addGoal({
      name: 'Emergency Reserve Buffer',
      category: 'emergency',
      targetAmount: emergencyTarget,
      currentAmount: currentEmergency,
      monthlyContribution: monthlyEmergencyContrib,
      targetDate: '2027-06-30',
      startDate: new Date().toISOString().split('T')[0],
      priority: 'high',
      isPaused: false,
      isCompleted: false,
      color: '#10b981',
    });

    if (goalName) {
      addGoal({
        name: goalName,
        category: 'laptop',
        targetAmount: goalTarget,
        currentAmount: 0,
        monthlyContribution: goalMonthly,
        targetDate: '2027-02-28',
        startDate: new Date().toISOString().split('T')[0],
        priority: 'high',
        isPaused: false,
        isCompleted: false,
        color: '#6366f1',
      });
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    addToast({
      type: 'success',
      title: 'Plan Activated!',
      message: `Welcome, ${finalName}! Your deterministic cashflow engine is running.`,
    });

    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-6 text-neutral-100">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Progress Bar & Step Tracker */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs">
              S
            </div>
            <span className="text-xs font-semibold text-neutral-300">SalaryOS Setup</span>
          </div>
          <span className="text-xs font-mono-num text-neutral-400">Step {step} of 6</span>
        </div>

        {/* Step Indicator dots */}
        <div className="flex gap-1.5 my-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-emerald-400' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME & IDENTITY */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-100">Welcome to SalaryOS</h2>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  Already have an account? Sign In
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your identity details to calibrate your deterministic cashflow matrix.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300">Your Full Name *</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300">Occupation / Role</label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300">Company / Employer</label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Tech"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300">Operating Currency</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrencyState(c)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        currency === c
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>{c}</span>
                      <span className="font-mono-num font-bold">{CURRENCY_CONFIGS[c].symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INCOME */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Your Income</h2>
              <p className="text-xs text-neutral-400 mt-1">
                How much arrives in your account each month?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-300">Monthly Net Take-Home Salary</label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-2.5 text-xs text-neutral-500 font-bold">
                    {CURRENCY_CONFIGS[currency].symbol}
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={salary}
                    onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-8 pr-3.5 py-2.5 font-mono-num text-sm text-neutral-100 font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300">Payday of Month</label>
                  <select
                    value={salaryDate}
                    onChange={(e) => setSalaryDate(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}{i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} of month
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300">Income Type</label>
                  <select
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value as IncomeType)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="monthly">Monthly Salary</option>
                    <option value="weekly">Weekly</option>
                    <option value="freelance">Freelance / Variable</option>
                    <option value="multiple">Multiple Sources</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FIXED EXPENSES */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Essential Monthly Expenses</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Estimate your non-negotiable living obligations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-medium text-neutral-300">Housing & Rent</label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-300">Food & Groceries</label>
                <input
                  type="number"
                  value={food}
                  onChange={(e) => setFood(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-300">Utilities & Wi-Fi</label>
                <input
                  type="number"
                  value={utilities}
                  onChange={(e) => setUtilities(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-300">Transport & Fuel</label>
                <input
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-lg bg-neutral-950 p-3 border border-neutral-800 text-xs flex justify-between items-center">
              <span className="text-neutral-400">Total Essential Monthly Load:</span>
              <span className="font-mono-num font-bold text-neutral-200">
                {formatCurrency(totalFixed, currency)}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: EMERGENCY FUND */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Emergency Fund Safety Net</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Your financial firewall against sudden unexpected events.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-neutral-300">Target Emergency Fund (6 Months Essentials)</label>
                <input
                  type="number"
                  value={emergencyTarget}
                  onChange={(e) => setEmergencyTarget(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-300">Current Saved Balance</label>
                <input
                  type="number"
                  value={currentEmergency}
                  onChange={(e) => setCurrentEmergency(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-300">Monthly Contribution SIP</label>
                <input
                  type="number"
                  value={monthlyEmergencyContrib}
                  onChange={(e) => setMonthlyEmergencyContrib(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FIRST GOAL */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Your First Financial Goal</h2>
              <p className="text-xs text-neutral-400 mt-1">
                What are you excited to save for? (Laptop, Travel, Phone, Bike, House)
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-neutral-300">Goal Name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3"
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-300">Target Amount</label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-300">Monthly Deposit</label>
                  <input
                    type="number"
                    value={goalMonthly}
                    onChange={(e) => setGoalMonthly(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & PREFERENCES */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Review Your First Plan</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Here is your deterministic monthly cash allocation.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Monthly Salary:</span>
                <span className="font-mono-num font-bold text-emerald-400">{formatCurrency(salary, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Fixed Essentials:</span>
                <span className="font-mono-num text-neutral-300">- {formatCurrency(totalFixed, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Emergency & Goal SIPs:</span>
                <span className="font-mono-num text-neutral-300">- {formatCurrency(monthlyEmergencyContrib + goalMonthly, currency)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
                <span className="text-neutral-200">Safe Discretionary Buffer:</span>
                <span className="font-mono-num text-emerald-400">{formatCurrency(remainingDiscretionary, currency)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-300">Minimum Reserve Threshold</label>
                <input
                  type="number"
                  value={minReserve}
                  onChange={(e) => setMinReserve(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono-num text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Protects minimum safety buffer in affordability engine.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300">4-Digit Security PIN</label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="2026"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 font-mono-num text-xs text-neutral-100 tracking-widest focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Used for instant authentication & account unlock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 active:scale-95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Activate My Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
