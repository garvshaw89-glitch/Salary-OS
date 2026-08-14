import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Account,
  AppNotification,
  BudgetCategory,
  Category,
  CurrencyCode,
  FinancialGoal,
  MonthlyReviewData,
  PlannedPurchase,
  RegisterDetails,
  Subscription,
  Transaction,
  UserProfile,
} from '../types/finance';
import {
  getStoredAccounts,
  getStoredBudgets,
  getStoredCategories,
  getStoredGoals,
  getStoredNotifications,
  getStoredPurchases,
  getStoredSubscriptions,
  getStoredTransactions,
  getStoredUser,
  resetToDemoData,
  resetToEmptyFreshUser,
  saveStoredAccounts,
  saveStoredBudgets,
  saveStoredCategories,
  saveStoredGoals,
  saveStoredNotifications,
  saveStoredPurchases,
  saveStoredSubscriptions,
  saveStoredTransactions,
  saveStoredUser,
} from '../lib/storage';
import {
  analyzePurchaseAffordability,
  calculateAvailableToSpend,
  calculateFinancialHealthScore,
  calculateLiquidFunds,
  calculateMonthlyGoalCommitments,
  calculateUpcomingCommitted,
} from '../lib/calculations';
import { PRESET_USERS } from '../lib/mockData';

export type ActiveTab =
  | 'landing'
  | 'login'
  | 'auth'
  | 'onboarding'
  | 'dashboard'
  | 'salary'
  | 'budgets'
  | 'transactions'
  | 'goals'
  | 'purchases'
  | 'subscriptions'
  | 'accounts'
  | 'health'
  | 'analytics'
  | 'review'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export type AuthMode = 'login' | 'register' | 'forgot';

interface FinanceContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => void;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<BudgetCategory>) => void;
  deleteBudget: (id: string) => void;
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (goalId: string, amount: number) => void;
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  purchases: PlannedPurchase[];
  addPurchase: (purchase: Omit<PlannedPurchase, 'id' | 'createdAt'>) => void;
  deletePurchase: (id: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Computed metrics
  liquidFunds: number;
  upcomingCommitted: number;
  goalCommitments: number;
  availableToSpend: number;
  monthlyReview: MonthlyReviewData;
  financialHealth: ReturnType<typeof calculateFinancialHealthScore>;

  // Global modals & actions
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickAffordOpen: boolean;
  setIsQuickAffordOpen: (open: boolean) => void;
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: (open: boolean) => void;
  isTestRunnerOpen: boolean;
  setIsTestRunnerOpen: (open: boolean) => void;

  // Authentication & Login Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthMode;
  setAuthModalMode: (mode: AuthMode) => void;
  openAuthModal: (mode?: AuthMode) => void;
  isAuthenticated: boolean;
  login: (email: string, name?: string, additionalDetails?: Partial<UserProfile>) => void;
  registerUser: (details: RegisterDetails) => void;
  loginWithPreset: (presetIndex: number) => void;
  logout: () => void;
  loadDemoMode: () => void;
  resetAllData: () => void;
  setCurrency: (code: CurrencyCode) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [accounts, setAccounts] = useState<Account[]>(() => getStoredAccounts());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => getStoredBudgets());
  const [goals, setGoals] = useState<FinancialGoal[]>(() => getStoredGoals());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => getStoredSubscriptions());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStoredTransactions());
  const [purchases, setPurchases] = useState<PlannedPurchase[]>(() => getStoredPurchases());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    const savedUser = getStoredUser();
    if (!savedUser.isOnboarded) return 'landing';
    return 'dashboard';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAffordOpen, setIsQuickAffordOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

  // Authentication & Login Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Sync with document theme class
  useEffect(() => {
    const root = document.documentElement;
    if (user.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [user.theme]);

  // Sync state to storage
  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  useEffect(() => {
    saveStoredAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    saveStoredGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveStoredSubscriptions(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredPurchases(purchases);
  }, [purchases]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = { ...acc, id: `acc_${Date.now()}` };
    setAccounts((prev) => [...prev, newAcc]);
    addToast({ type: 'success', title: 'Account created', message: `${acc.name} added.` });
  };

  const updateAccount = (id: string, fields: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...fields } : a)));
    addToast({ type: 'info', title: 'Account updated' });
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'info', title: 'Account removed' });
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat_${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
    addToast({ type: 'success', title: 'Category added', message: cat.name });
  };

  const addBudget = (b: Omit<BudgetCategory, 'id'>) => {
    const newBudget: BudgetCategory = { ...b, id: `b_${Date.now()}` };
    setBudgets((prev) => [...prev, newBudget]);
    addToast({ type: 'success', title: 'Budget configured', message: `${b.categoryName} set.` });
  };

  const updateBudget = (id: string, fields: Partial<BudgetCategory>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...fields } : b)));
    addToast({ type: 'info', title: 'Budget updated' });
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    addToast({ type: 'info', title: 'Budget deleted' });
  };

  const addGoal = (g: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = { ...g, id: `goal_${Date.now()}` };
    setGoals((prev) => [...prev, newGoal]);
    addToast({ type: 'success', title: 'Goal created', message: `Target: ₹${g.targetAmount.toLocaleString('en-IN')}` });
  };

  const updateGoal = (id: string, fields: Partial<FinancialGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...fields } : g)));
    addToast({ type: 'info', title: 'Goal updated' });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    addToast({ type: 'info', title: 'Goal deleted' });
  };

  const addGoalContribution = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedAmount = g.currentAmount + amount;
          const isCompleted = updatedAmount >= g.targetAmount;
          return {
            ...g,
            currentAmount: updatedAmount,
            isCompleted,
          };
        }
        return g;
      })
    );

    // Also add a transaction record
    const targetGoal = goals.find((g) => g.id === goalId);
    if (targetGoal) {
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        amount,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        categoryId: 'cat_savings',
        categoryName: 'Savings & Investments',
        categoryKey: 'savings',
        description: `Goal Deposit: ${targetGoal.name}`,
        account: accounts[0]?.name || 'Primary Account',
        paymentMethod: 'Bank Transfer',
        goalId,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Contribution recorded',
      message: `Added ₹${amount.toLocaleString('en-IN')} to goal.`,
    });
  };

  const addSubscription = (s: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = { ...s, id: `sub_${Date.now()}` };
    setSubscriptions((prev) => [...prev, newSub]);
    addToast({ type: 'success', title: 'Subscription saved', message: `${s.name} added.` });
  };

  const updateSubscription = (id: string, fields: Partial<Subscription>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    addToast({ type: 'info', title: 'Subscription updated' });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    addToast({ type: 'info', title: 'Subscription removed' });
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...t, id: `tx_${Date.now()}` };
    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name === t.account) {
          const delta = t.type === 'income' ? t.amount : -t.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      })
    );

    addToast({
      type: 'success',
      title: t.type === 'income' ? 'Income recorded' : 'Expense recorded',
      message: `${t.description} — ₹${t.amount.toLocaleString('en-IN')}`,
    });
  };

  const updateTransaction = (id: string, fields: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } : t)));
    addToast({ type: 'info', title: 'Transaction updated' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast({ type: 'info', title: 'Transaction deleted' });
  };

  const addPurchase = (p: Omit<PlannedPurchase, 'id' | 'createdAt'>) => {
    const newP: PlannedPurchase = {
      ...p,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPurchases((prev) => [newP, ...prev]);
    addToast({ type: 'success', title: 'Purchase planned', message: `${p.title} saved.` });
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    addToast({ type: 'info', title: 'Purchase removed' });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const setCurrency = (currency: CurrencyCode) => {
    updateUser({ currency });
    addToast({ type: 'info', title: 'Currency updated', message: `Display set to ${currency}` });
  };

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    updateUser({ theme });
  };

  const login = (email: string, name?: string, additionalDetails?: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...user,
      email,
      name: name || user.name || 'Rahul Sharma',
      isOnboarded: true,
      lastLoginAt: new Date().toISOString(),
      ...(additionalDetails || {}),
    };
    updateUser(updated);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    addToast({ type: 'success', title: 'Welcome to SalaryOS!', message: `Logged in as ${updated.name || email}` });
  };

  const registerUser = (details: RegisterDetails) => {
    const salary = Math.max(0, details.monthlySalary || 0);
    const minReserve = details.minimumEmergencyReserve || Math.round(salary * 2.5) || 50000;
    const initialChecking = details.initialCheckingBalance !== undefined ? details.initialCheckingBalance : Math.round(salary * 0.7);
    const initialSavings = details.initialSavingsBalance !== undefined ? details.initialSavingsBalance : Math.round(salary * 0.5);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: details.name.trim(),
      username: details.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'my_account',
      email: details.email.trim().toLowerCase(),
      occupation: details.occupation?.trim() || 'Professional',
      company: details.company?.trim() || '',
      phone: details.phone?.trim() || '',
      pin: details.pin || '1234',
      currency: details.currency || 'INR',
      country: details.currency === 'USD' ? 'United States' : details.currency === 'GBP' ? 'United Kingdom' : details.currency === 'EUR' ? 'Germany' : 'India',
      monthlySalary: salary,
      salaryDate: details.salaryDate || 1,
      incomeType: 'monthly',
      minimumEmergencyReserve: minReserve,
      discretionaryBudgetPercent: details.discretionaryBudgetPercent || 25,
      theme: user.theme || 'dark',
      isOnboarded: true,
      isDemo: false,
      lastLoginAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      notificationPreferences: {
        upcomingBills: true,
        budgetAlerts: true,
        goalMilestones: true,
        subscriptionRenewals: true,
        monthlyReview: true,
      },
    };

    saveStoredUser(newUser);
    setUser(newUser);

    // Initialize clean realistic default accounts for new user
    const userAccounts: Account[] = [
      {
        id: `acc_salary_${Date.now()}`,
        name: 'Primary Salary Checking',
        type: 'bank',
        balance: initialChecking,
        institution: 'Primary Bank',
        accountNumberMask: '•••• 1001',
        color: '#0284c7',
      },
      {
        id: `acc_savings_${Date.now()}`,
        name: 'High-Yield Emergency Vault',
        type: 'savings',
        balance: initialSavings,
        institution: 'Emergency Savings',
        accountNumberMask: '•••• 2002',
        color: '#10b981',
      },
      {
        id: `acc_cash_${Date.now()}`,
        name: 'Liquid Cash & Wallet',
        type: 'cash',
        balance: Math.round(salary * 0.05) || 2000,
        institution: 'Cash Wallet',
        accountNumberMask: 'Daily Cash',
        color: '#f59e0b',
      },
    ];
    saveStoredAccounts(userAccounts);
    setAccounts(userAccounts);

    // Initialize standard categorized budgets scaled to their salary
    const baseBudgets: BudgetCategory[] = [
      {
        id: `b_housing_${Date.now()}`,
        categoryId: 'cat_housing',
        categoryName: 'Housing & Rent',
        categoryKey: 'housing',
        monthlyLimit: Math.round(salary * 0.3) || 15000,
        color: '#6366f1',
      },
      {
        id: `b_food_${Date.now()}`,
        categoryId: 'cat_food',
        categoryName: 'Food & Dining',
        categoryKey: 'food',
        monthlyLimit: Math.round(salary * 0.15) || 8000,
        color: '#f97316',
      },
      {
        id: `b_transport_${Date.now()}`,
        categoryId: 'cat_transport',
        categoryName: 'Transport & Fuel',
        categoryKey: 'transport',
        monthlyLimit: Math.round(salary * 0.08) || 4000,
        color: '#06b6d4',
      },
      {
        id: `b_utilities_${Date.now()}`,
        categoryId: 'cat_utilities',
        categoryName: 'Utilities & Internet',
        categoryKey: 'utilities',
        monthlyLimit: Math.round(salary * 0.06) || 3000,
        color: '#eab308',
      },
      {
        id: `b_shopping_${Date.now()}`,
        categoryId: 'cat_shopping',
        categoryName: 'Shopping & Gear',
        categoryKey: 'shopping',
        monthlyLimit: Math.round(salary * 0.12) || 6000,
        color: '#ec4899',
      },
    ];
    saveStoredBudgets(baseBudgets);
    setBudgets(baseBudgets);

    // Initial Starter Goal
    const userGoals: FinancialGoal[] = [
      {
        id: `goal_starter_${Date.now()}`,
        name: 'Emergency Safety Buffer (3 Months)',
        category: 'emergency',
        targetAmount: minReserve,
        currentAmount: initialSavings,
        monthlyContribution: Math.round(salary * 0.15) || 5000,
        targetDate: '2027-06-30',
        startDate: new Date().toISOString().split('T')[0],
        priority: 'high',
        isPaused: false,
        isCompleted: initialSavings >= minReserve,
        color: '#10b981',
      },
    ];
    saveStoredGoals(userGoals);
    setGoals(userGoals);

    // Initial Welcome Notification
    const welcomeNotifs: AppNotification[] = [
      {
        id: `notif_welcome_${Date.now()}`,
        title: `Welcome, ${newUser.name}!`,
        message: `Your SalaryOS account is configured with ${newUser.currency} and a monthly salary of ${salary.toLocaleString()}. Explore your Command Center.`,
        type: 'success',
        date: new Date().toISOString().split('T')[0],
        read: false,
        linkTab: 'dashboard',
      },
    ];
    saveStoredNotifications(welcomeNotifs);
    setNotifications(welcomeNotifs);

    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: 'Account Created Successfully!',
      message: `Welcome aboard, ${newUser.name}. Your financial engine is ready.`,
    });
  };

  const loginWithPreset = (presetIndex: number) => {
    const preset = PRESET_USERS[presetIndex] || PRESET_USERS[0];
    saveStoredUser({ ...preset.profile, isOnboarded: true, lastLoginAt: new Date().toISOString() });
    saveStoredAccounts(preset.accounts);
    saveStoredBudgets(preset.budgets);
    saveStoredGoals(preset.goals);
    saveStoredSubscriptions(preset.subscriptions);
    saveStoredTransactions(preset.transactions);

    setUser(preset.profile);
    setAccounts(preset.accounts);
    setBudgets(preset.budgets);
    setGoals(preset.goals);
    setSubscriptions(preset.subscriptions);
    setTransactions(preset.transactions);

    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: `Switched to ${preset.profile.name}`,
      message: `Profile loaded: ${preset.profile.occupation} (${preset.profile.currency} ${preset.profile.monthlySalary.toLocaleString()}/mo)`,
    });
  };

  const logout = () => {
    setActiveTab('landing');
    addToast({ type: 'info', title: 'Signed out' });
  };

  const loadDemoMode = () => {
    resetToDemoData();
    setUser(getStoredUser());
    setAccounts(getStoredAccounts());
    setCategories(getStoredCategories());
    setBudgets(getStoredBudgets());
    setGoals(getStoredGoals());
    setSubscriptions(getStoredSubscriptions());
    setTransactions(getStoredTransactions());
    setPurchases(getStoredPurchases());
    setNotifications(getStoredNotifications());
    setActiveTab('dashboard');
    addToast({ type: 'success', title: 'Demo Mode Loaded', message: 'Explore pre-configured financial telemetry.' });
  };

  const resetAllData = () => {
    resetToEmptyFreshUser(user.name, user.email);
    setUser(getStoredUser());
    setAccounts(getStoredAccounts());
    setCategories(getStoredCategories());
    setBudgets(getStoredBudgets());
    setGoals(getStoredGoals());
    setSubscriptions(getStoredSubscriptions());
    setTransactions(getStoredTransactions());
    setPurchases(getStoredPurchases());
    setActiveTab('onboarding');
    addToast({ type: 'info', title: 'Data cleared', message: 'Starting with a clean slate.' });
  };

  // Computed metrics
  const liquidFunds = useMemo(() => calculateLiquidFunds(accounts), [accounts]);
  const upcomingCommitted = useMemo(
    () => calculateUpcomingCommitted(subscriptions, budgets, transactions),
    [subscriptions, budgets, transactions]
  );
  const goalCommitments = useMemo(() => calculateMonthlyGoalCommitments(goals), [goals]);
  const availableToSpend = useMemo(
    () => calculateAvailableToSpend(liquidFunds, upcomingCommitted, goalCommitments, user.minimumEmergencyReserve),
    [liquidFunds, upcomingCommitted, goalCommitments, user.minimumEmergencyReserve]
  );

  const financialHealth = useMemo(
    () =>
      calculateFinancialHealthScore({
        user,
        accounts,
        goals,
        subscriptions,
        budgetCategories: budgets,
        transactions,
      }),
    [user, accounts, goals, subscriptions, budgets, transactions]
  );

  // Monthly review computed data
  const monthlyReview = useMemo<MonthlyReviewData>(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || user.monthlySalary;

    const totalSpent = transactions
      .filter((t) => t.type === 'expense' && !t.goalId)
      .reduce((sum, t) => sum + t.amount, 0);

    const goalContribs = transactions
      .filter((t) => t.type === 'expense' && !!t.goalId)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSaved = goalContribs + Math.max(0, totalIncome - totalSpent - goalContribs);
    const remaining = Math.max(0, totalIncome - totalSpent - goalContribs);

    const categoryMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense' && !t.goalId)
      .forEach((t) => {
        categoryMap[t.categoryName] = (categoryMap[t.categoryName] || 0) + t.amount;
      });

    const topCategories = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const subTotal = subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      monthName: 'August',
      year: 2026,
      income: totalIncome,
      spent: totalSpent,
      saved: totalSaved,
      goalContributions: goalContribs,
      remaining,
      savingsRate: totalIncome > 0 ? Math.round((totalSaved / totalIncome) * 100) : 0,
      budgetUtilization: totalIncome > 0 ? Math.round((totalSpent / totalIncome) * 100) : 0,
      topCategories,
      subscriptionTotal: subTotal,
      netWorthDelta: 24500, // month-over-month positive net delta
      changesFromLastMonth: {
        incomeDelta: 15000,
        spentDelta: -3200,
        savedDelta: 8200,
      },
    };
  }, [transactions, user.monthlySalary, subscriptions]);

  const value = {
    activeTab,
    setActiveTab,
    user,
    updateUser,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    categories,
    addCategory,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalContribution,
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    purchases,
    addPurchase,
    deletePurchase,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    toasts,
    addToast,
    removeToast,
    liquidFunds,
    upcomingCommitted,
    goalCommitments,
    availableToSpend,
    monthlyReview,
    financialHealth,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isQuickAffordOpen,
    setIsQuickAffordOpen,
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    isTestRunnerOpen,
    setIsTestRunnerOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    isAuthenticated: user.isOnboarded,
    login,
    registerUser,
    loginWithPreset,
    logout,
    loadDemoMode,
    resetAllData,
    setCurrency,
    setTheme,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
