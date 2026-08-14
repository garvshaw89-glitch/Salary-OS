export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SGD' | 'JPY' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export type IncomeType = 'monthly' | 'weekly' | 'freelance' | 'multiple';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  occupation?: string;
  company?: string;
  phone?: string;
  pin?: string;
  currency: CurrencyCode;
  country: string;
  monthlySalary: number;
  salaryDate: number; // 1 - 31
  incomeType: IncomeType;
  minimumEmergencyReserve: number; // e.g. 50,000
  discretionaryBudgetPercent: number; // e.g. 20%
  theme: 'dark' | 'light' | 'system';
  isOnboarded: boolean;
  isDemo: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  notificationPreferences: {
    upcomingBills: boolean;
    budgetAlerts: boolean;
    goalMilestones: boolean;
    subscriptionRenewals: boolean;
    monthlyReview: boolean;
  };
}

export interface RegisterDetails {
  name: string;
  email: string;
  password?: string;
  occupation?: string;
  company?: string;
  phone?: string;
  pin?: string;
  currency: CurrencyCode;
  monthlySalary: number;
  salaryDate: number;
  initialCheckingBalance?: number;
  initialSavingsBalance?: number;
  minimumEmergencyReserve?: number;
  discretionaryBudgetPercent?: number;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export type CategoryKey =
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'shopping'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'subscriptions'
  | 'debt'
  | 'savings'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'other';

export interface Category {
  id: string;
  name: string;
  key: CategoryKey;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface BudgetCategory {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryKey: CategoryKey;
  monthlyLimit: number;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO format YYYY-MM-DD
  categoryId: string;
  categoryName: string;
  categoryKey: CategoryKey;
  description: string;
  account: string;
  paymentMethod: 'Cash' | 'Debit Card' | 'Credit Card' | 'Bank Transfer' | 'UPI' | 'Wallet';
  notes?: string;
  isRecurring?: boolean;
  goalId?: string; // If contribution to a goal
}

export type AccountType = 'bank' | 'savings' | 'cash' | 'credit' | 'investment' | 'wallet';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  institution?: string;
  accountNumberMask?: string;
  color: string;
}

export type GoalCategory =
  | 'emergency'
  | 'laptop'
  | 'phone'
  | 'bike'
  | 'car'
  | 'travel'
  | 'education'
  | 'house'
  | 'investment'
  | 'electronics'
  | 'other'
  | 'custom';

export interface FinancialGoal {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string; // YYYY-MM-DD
  startDate: string;
  priority: 'low' | 'medium' | 'high';
  isPaused: boolean;
  isCompleted: boolean;
  notes?: string;
  color: string;
}

export type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string; // YYYY-MM-DD
  category: string;
  paymentMethod: string;
  url?: string;
  status: 'active' | 'paused' | 'cancelled';
  color: string;
  notes?: string;
}

export type PaymentOption = 'cash' | 'savings' | 'credit' | 'emi';

export interface PlannedPurchase {
  id: string;
  title: string;
  price: number;
  targetDate?: string;
  category: string;
  paymentMethod: PaymentOption;
  emiDetails?: {
    principal: number;
    interestRate: number; // annual %
    tenureMonths: number;
    downPayment: number;
    processingFee: number;
  };
  notes?: string;
  createdAt: string;
}

export type AffordabilityStatus = 'SAFE' | 'CAUTION' | 'HIGH_IMPACT';

export interface AffordabilityAnalysis {
  status: AffordabilityStatus;
  headline: string;
  explanation: string;
  metrics: {
    purchasePrice: number;
    currentAvailableFunds: number;
    upcomingCommittedExpenses: number;
    minimumEmergencyReserve: number;
    existingGoalCommitments: number;
    remainingAvailableAfterPurchase: number;
    emergencyReserveAfterPurchase: number;
    discretionaryBufferPercentAfter: number;
    impactOnGoalsSummary: string;
    goalDelays: Array<{
      goalId: string;
      goalName: string;
      currentMonthsRemaining: number;
      projectedMonthsRemaining: number;
      delayMonths: number;
    }>;
  };
  rulesEvaluated: {
    passedEmergencyReserveCheck: boolean;
    passedAvailableCashCheck: boolean;
    passedDiscretionaryBufferCheck: boolean;
    impactsGoalDeadlines: boolean;
  };
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  principal: number;
  downPayment: number;
  processingFee: number;
  effectiveTotalCost: number;
  monthlyBreakdown: Array<{
    month: number;
    principalPayment: number;
    interestPayment: number;
    balance: number;
  }>;
}

export interface SalaryAllocation {
  essentials: number;
  savings: number;
  emergency: number;
  goals: number;
  lifestyle: number;
  flexibleBuffer: number;
}

export interface FinancialHealthScore {
  totalScore: number; // 0 to 100
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  breakdown: {
    emergencyCoverage: {
      score: number; // max 25
      months: number;
      targetMonths: number;
      status: 'Optimal' | 'Adequate' | 'Insufficient';
    };
    savingsRate: {
      score: number; // max 25
      ratePercent: number;
      status: 'High' | 'Healthy' | 'Low';
    };
    budgetAdherence: {
      score: number; // max 25
      adherencePercent: number;
      overBudgetCategoriesCount: number;
      status: 'Strict' | 'Good' | 'Over Budget';
    };
    debtCommitmentRatio: {
      score: number; // max 25
      ratioPercent: number;
      status: 'Low Debt' | 'Moderate' | 'Heavy Debt';
    };
  };
  keyTakeaways: string[];
}

export interface MonthlyReviewData {
  monthName: string;
  year: number;
  income: number;
  spent: number;
  saved: number;
  goalContributions: number;
  remaining: number;
  savingsRate: number;
  budgetUtilization: number;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  subscriptionTotal: number;
  netWorthDelta: number;
  changesFromLastMonth: {
    incomeDelta: number;
    spentDelta: number;
    savedDelta: number;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  date: string;
  read: boolean;
  linkTab?: string;
}
