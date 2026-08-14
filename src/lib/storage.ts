import {
  Account,
  AppNotification,
  BudgetCategory,
  Category,
  FinancialGoal,
  PlannedPurchase,
  Subscription,
  Transaction,
  UserProfile,
} from '../types/finance';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_PLANNED_PURCHASES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'salaryos_user_profile_v1',
  ACCOUNTS: 'salaryos_accounts_v1',
  CATEGORIES: 'salaryos_categories_v1',
  BUDGETS: 'salaryos_budgets_v1',
  GOALS: 'salaryos_goals_v1',
  SUBSCRIPTIONS: 'salaryos_subscriptions_v1',
  TRANSACTIONS: 'salaryos_transactions_v1',
  PURCHASES: 'salaryos_purchases_v1',
  NOTIFICATIONS: 'salaryos_notifications_v1',
  THEME: 'salaryos_theme_v1',
};

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user from storage', e);
  }
  return INITIAL_USER;
}

export function saveStoredUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_ACCOUNTS;
}

export function saveStoredAccounts(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
}

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_CATEGORIES;
}

export function saveStoredCategories(categories: Category[]) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function getStoredBudgets(): BudgetCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_BUDGETS;
}

export function saveStoredBudgets(budgets: BudgetCategory[]) {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

export function getStoredGoals(): FinancialGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_GOALS;
}

export function saveStoredGoals(goals: FinancialGoal[]) {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

export function getStoredSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_SUBSCRIPTIONS;
}

export function saveStoredSubscriptions(subs: Subscription[]) {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
}

export function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_TRANSACTIONS;
}

export function saveStoredTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
}

export function getStoredPurchases(): PlannedPurchase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_PLANNED_PURCHASES;
}

export function saveStoredPurchases(purchases: PlannedPurchase[]) {
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'notif_01',
      title: 'Salary Cycle Active',
      message: 'August salary of ₹60,000 received. All automated goal contributions allocated.',
      type: 'success',
      date: '2026-08-01',
      read: true,
      linkTab: 'salary',
    },
    {
      id: 'notif_02',
      title: 'Upcoming Renewal: Netflix',
      message: '₹649 will be charged to Regalia Credit Card on Aug 22.',
      type: 'info',
      date: '2026-08-14',
      read: false,
      linkTab: 'subscriptions',
    },
    {
      id: 'notif_03',
      title: 'Food & Dining at 65%',
      message: 'You have spent ₹5,520 of your ₹8,500 monthly budget with 17 days remaining.',
      type: 'warning',
      date: '2026-08-14',
      read: false,
      linkTab: 'budgets',
    },
  ];
}

export function saveStoredNotifications(notifs: AppNotification[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function resetToDemoData() {
  saveStoredUser({ ...INITIAL_USER, isDemo: true, isOnboarded: true });
  saveStoredAccounts(INITIAL_ACCOUNTS);
  saveStoredCategories(INITIAL_CATEGORIES);
  saveStoredBudgets(INITIAL_BUDGETS);
  saveStoredGoals(INITIAL_GOALS);
  saveStoredSubscriptions(INITIAL_SUBSCRIPTIONS);
  saveStoredTransactions(INITIAL_TRANSACTIONS);
  saveStoredPurchases(INITIAL_PLANNED_PURCHASES);
}

export function resetToEmptyFreshUser(name: string = 'User', email: string = '') {
  const freshUser: UserProfile = {
    ...INITIAL_USER,
    id: `usr_${Date.now()}`,
    name,
    username: name.toLowerCase().replace(/\s+/g, '_') || 'my_account',
    email,
    monthlySalary: 0,
    salaryDate: 1,
    isOnboarded: false,
    isDemo: false,
    minimumEmergencyReserve: 25000,
  };
  saveStoredUser(freshUser);
  saveStoredAccounts([
    {
      id: `acc_${Date.now()}`,
      name: 'Primary Checking Account',
      type: 'bank',
      balance: 0,
      color: '#0284c7',
    },
  ]);
  saveStoredCategories(INITIAL_CATEGORIES);
  saveStoredBudgets([]);
  saveStoredGoals([]);
  saveStoredSubscriptions([]);
  saveStoredTransactions([]);
  saveStoredPurchases([]);
}

export const StorageManager = {
  exportData() {
    return {
      user: getStoredUser(),
      accounts: getStoredAccounts(),
      categories: getStoredCategories(),
      budgets: getStoredBudgets(),
      goals: getStoredGoals(),
      subscriptions: getStoredSubscriptions(),
      transactions: getStoredTransactions(),
      purchases: getStoredPurchases(),
      notifications: getStoredNotifications(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  },
  importData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    try {
      if (data.user) saveStoredUser(data.user);
      if (Array.isArray(data.accounts)) saveStoredAccounts(data.accounts);
      if (Array.isArray(data.categories)) saveStoredCategories(data.categories);
      if (Array.isArray(data.budgets)) saveStoredBudgets(data.budgets);
      if (Array.isArray(data.goals)) saveStoredGoals(data.goals);
      if (Array.isArray(data.subscriptions)) saveStoredSubscriptions(data.subscriptions);
      if (Array.isArray(data.transactions)) saveStoredTransactions(data.transactions);
      if (Array.isArray(data.purchases)) saveStoredPurchases(data.purchases);
      if (Array.isArray(data.notifications)) saveStoredNotifications(data.notifications);
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  },
  resetToDemo: resetToDemoData,
  resetFresh: resetToEmptyFreshUser,
};
