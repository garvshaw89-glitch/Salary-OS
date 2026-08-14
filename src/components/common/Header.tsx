import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Command,
  HelpCircle,
  LogOut,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Menu,
  KeyRound,
  Users,
  Shield,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { PRESET_USERS } from '../../lib/mockData';
import { MobileDrawer } from './MobileDrawer';

export const Header: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    availableToSpend,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsCommandPaletteOpen,
    setIsQuickAffordOpen,
    setIsAddTransactionOpen,
    setIsTestRunnerOpen,
    openAuthModal,
    loginWithPreset,
    loadDemoMode,
    logout,
    setTheme,
  } = useFinance();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Live time in UTC for mission control telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2.5 sm:px-4 lg:px-6 backdrop-blur-md">
        {/* Left: Hamburger (Mobile) + Brand + Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Drawer Hamburger Trigger */}
          <button
            id="mobile-drawer-toggle"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden p-1.5 -ml-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            id="brand-header-logo"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left group transition-transform focus:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white font-bold shadow-xs group-hover:bg-indigo-500 transition-colors shrink-0">
              <span className="font-mono text-xs font-black">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm tracking-wide uppercase text-slate-200">
                  SalaryOS
                </span>
                <div className="hidden md:block h-3.5 w-px bg-slate-700"></div>
                <span className="hidden md:inline text-[11px] font-mono text-slate-400">
                  Node: Alpha-Cashflow
                </span>
                {user.isDemo && (
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-indigo-400 border border-indigo-500/30">
                    DEMO
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Global Search Shortcut Button */}
          <button
            id="global-search-trigger"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 rounded border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-400 hover:border-slate-700 hover:bg-slate-900 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <Search className="h-3 w-3 text-slate-400" />
            <span className="text-[11px]">Command Palette</span>
            <kbd className="ml-1.5 flex items-center gap-0.5 rounded border border-slate-700 bg-slate-800 px-1 py-0.2 font-mono text-[9px] text-slate-300">
              <Command className="h-2 w-2" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* System Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
              Telemetry Nominal
            </span>
          </div>

          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 px-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>{currentTime || '00:00:00 UTC'}</span>
          </div>

          {/* Signature Action: "Can I Afford This?" */}
          <button
            id="header-can-i-afford-btn"
            onClick={() => setIsQuickAffordOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 rounded bg-indigo-600 hover:bg-indigo-500 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] focus:outline-none min-h-[36px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200 shrink-0" />
            <span className="whitespace-nowrap text-[11px] hidden xs:inline">Affordability Sim</span>
            <span className="whitespace-nowrap text-[11px] xs:hidden">Afford?</span>
          </button>

          {/* Quick Add Expense / Transaction */}
          <button
            id="header-quick-add-btn"
            onClick={() => setIsAddTransactionOpen(true)}
            className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-all min-h-[36px]"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] hidden sm:inline">Log Tx</span>
          </button>

          {/* Mobile search trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Test Runner Suite Launcher */}
          <button
            id="header-test-runner-btn"
            onClick={() => setIsTestRunnerOpen(true)}
            title="Run Algorithm Verification Suite"
            className="hidden xl:flex items-center gap-1 rounded border border-slate-800 bg-slate-900/80 px-2 py-1 text-[10px] font-mono uppercase font-bold text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          >
            <CheckCircle2 className="h-3 w-3 text-indigo-400" />
            <span>Verify Math</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="header-notif-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-1 w-[calc(100vw-16px)] sm:w-96 max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Incident & Telemetry Feed
                  </span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center font-mono">No alerts recorded</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTab) setActiveTab(notif.linkTab as any);
                          setIsNotifOpen(false);
                        }}
                        className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                          notif.read
                            ? 'border-slate-800/40 bg-slate-950/40 text-slate-400'
                            : notif.type === 'warning'
                            ? 'border-l-2 border-l-amber-500 border-slate-800 bg-amber-500/10 text-slate-200'
                            : notif.type === 'success'
                            ? 'border-l-2 border-l-emerald-500 border-slate-800 bg-emerald-500/10 text-slate-200'
                            : 'border-l-2 border-l-indigo-500 border-slate-800 bg-indigo-500/10 text-slate-200'
                        } hover:bg-slate-800`}
                      >
                        <div className="flex items-start gap-2">
                          {notif.type === 'warning' ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          ) : notif.type === 'success' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              id="header-profile-menu-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 rounded p-1 hover:bg-slate-800 transition-colors focus:outline-none min-h-[36px] min-w-[36px] justify-center"
              aria-label="User profile"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-200">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover rounded" />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-2 border-b border-slate-800 mb-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {user.currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.occupation || 'Salaried Earner'}</p>
                  <p className="text-[10px] font-mono text-slate-500 truncate">{user.email || 'user@salaryos.local'}</p>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Switch Profile / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Intake New Account Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Account & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      loadDemoMode();
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Reload Benchmark Demo Data</span>
                  </button>
                </div>

                <div className="my-1.5 border-t border-slate-800" />

                {/* Quick Presets row */}
                <div className="px-2 py-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                    Quick Persona Switch
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {PRESET_USERS.slice(0, 2).map((p, idx) => (
                      <button
                        key={p.profile.id}
                        onClick={() => {
                          loginWithPreset(idx);
                          setIsProfileOpen(false);
                        }}
                        className="text-[10px] text-left p-1 rounded bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 text-slate-300 truncate"
                      >
                        {p.profile.name.split(' ')[0]} ({p.profile.currency})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Modal */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </>
  );
};
