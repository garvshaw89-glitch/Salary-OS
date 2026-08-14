import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Keyboard,
  Sparkles,
  Sliders,
  Mail,
  Briefcase,
  Building,
  Phone,
  KeyRound,
  Users,
  Lock,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode, IncomeType } from '../../types/finance';
import { CURRENCY_CONFIGS, exportToJSON } from '../../lib/utils';
import { StorageManager } from '../../lib/storage';

export const SettingsManager: React.FC = () => {
  const {
    user,
    updateUser,
    loadDemoMode,
    resetAllData,
    addToast,
    openAuthModal,
  } = useFinance();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [occupation, setOccupation] = useState(user.occupation || '');
  const [company, setCompany] = useState(user.company || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [pin, setPin] = useState(user.pin || '2026');
  const [currency, setCurrency] = useState<CurrencyCode>(user.currency);
  const [monthlySalary, setMonthlySalary] = useState(user.monthlySalary);
  const [salaryDate, setSalaryDate] = useState(user.salaryDate);
  const [incomeType, setIncomeType] = useState<IncomeType>(user.incomeType);
  const [minReserve, setMinReserve] = useState(user.minimumEmergencyReserve);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || 'Node User',
      email: email.trim().toLowerCase(),
      occupation: occupation.trim(),
      company: company.trim(),
      phone: phone.trim(),
      pin: pin.trim() || '2026',
      currency,
      monthlySalary,
      salaryDate,
      incomeType,
      minimumEmergencyReserve: minReserve,
    });
    addToast({
      type: 'success',
      title: 'Profile & Parameters Saved',
      message: 'User credentials and financial parameters updated successfully.',
    });
  };

  const handleExportBackup = () => {
    const backup = StorageManager.exportData();
    exportToJSON(backup, `SalaryOS_Full_Backup_${new Date().toISOString().split('T')[0]}`);
    addToast({
      type: 'success',
      title: 'Telemetry Export Complete',
      message: 'Complete local state exported as JSON.',
    });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = StorageManager.importData(json);
        if (success) {
          addToast({
            type: 'success',
            title: 'State Restored',
            message: 'All accounts, transactions, and goals have been restored.',
          });
          window.location.reload();
        } else {
          addToast({
            type: 'error',
            title: 'Restore Failed',
            message: 'Invalid JSON schema format.',
          });
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Import Error',
          message: 'Could not parse JSON file.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-20 lg:pb-8 font-sans">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 uppercase font-mono">
              Account, Credentials & System Matrix
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Users className="h-3 w-3 text-indigo-400" />
              <span>Switch User</span>
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <span>+ New Account</span>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          User profile details, authentication PIN, liquidity safety reserve thresholds, and offline storage snapshots.
        </p>
      </div>

      {/* Profile & Credentials Form */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4">
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">User Identity & Authentication</h2>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 shadow-xs text-[11px]"
            >
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Occupation / Role</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Software Engineer"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Company / Employer</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="2026"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 font-mono tracking-widest focus:border-indigo-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 mb-2">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Salary & Inflow Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Base Currency Standard</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              >
                {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_CONFIGS[c].symbol}) - {CURRENCY_CONFIGS[c].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Monthly Net Inflow</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold focus:border-indigo-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Anchor Payday</label>
              <select
                value={salaryDate}
                onChange={(e) => setSalaryDate(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1} of month
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Min Reserve Safety Threshold</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minReserve}
                onChange={(e) => setMinReserve(Number(e.target.value))}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-slate-100 font-bold focus:border-indigo-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Income Frequency</label>
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value as IncomeType)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100 focus:border-indigo-500 focus:outline-none text-xs font-mono"
              >
                <option value="monthly">Monthly Fixed</option>
                <option value="weekly">Weekly Recurring</option>
                <option value="freelance">Freelance / Variable</option>
                <option value="multiple">Multiple Sources</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Backup, Export & Reset Section */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-3">
        <h2 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
          State Persistence & Local Snapshots
        </h2>
        <p className="text-[11px] font-mono text-slate-400">
          SalaryOS operates on a private, offline-first client-side state engine. Data can be backed up or restored instantly.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Download JSON Snapshot</span>
          </button>

          <label className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-700 cursor-pointer">
            <Upload className="h-3.5 w-3.5 text-teal-400" />
            <span>Restore JSON State</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={loadDemoMode}
            className="flex items-center gap-1.5 rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-colors ml-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-bold text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors"
          >
            <span>Start Fresh</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-slate-300">
          <Keyboard className="h-3.5 w-3.5 text-slate-400" />
          <span>Telemetry Command Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="flex items-center justify-between rounded bg-slate-950 p-2 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Command Palette / Search</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[9px] text-slate-200">
              Ctrl + K / ⌘K
            </kbd>
          </div>
          <div className="flex items-center justify-between rounded bg-slate-950 p-2 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Close Overlay Windows</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[9px] text-slate-200">
              Esc
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
