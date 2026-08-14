import {
  Account,
  AffordabilityAnalysis,
  BudgetCategory,
  EmiCalculationResult,
  FinancialGoal,
  FinancialHealthScore,
  PaymentOption,
  Subscription,
  Transaction,
  UserProfile,
} from '../types/finance';

/**
 * Calculates current total liquid funds from cash, bank, and savings accounts.
 * Credit cards and loans are excluded from liquid reserves.
 */
export function calculateLiquidFunds(accounts: Account[]): number {
  return accounts
    .filter((acc) => acc.type === 'bank' || acc.type === 'savings' || acc.type === 'cash' || acc.type === 'wallet')
    .reduce((sum, acc) => sum + acc.balance, 0);
}

/**
 * Calculates total debt/credit card liabilities.
 */
export function calculateLiabilities(accounts: Account[]): number {
  return accounts
    .filter((acc) => acc.type === 'credit')
    .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0);
}

/**
 * Calculates upcoming committed expenses in current billing cycle (subscriptions + fixed monthly budget items)
 */
export function calculateUpcomingCommitted(
  subscriptions: Subscription[],
  budgetCategories: BudgetCategory[],
  transactions: Transaction[]
): number {
  // Active subscriptions remaining this month
  const activeSubsMonthly = subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((sum, sub) => {
      if (sub.billingCycle === 'monthly') return sum + sub.amount;
      if (sub.billingCycle === 'yearly') return sum + sub.amount / 12;
      if (sub.billingCycle === 'quarterly') return sum + sub.amount / 3;
      if (sub.billingCycle === 'weekly') return sum + sub.amount * 4.33;
      return sum + sub.amount;
    }, 0);

  // Essential budget limits (housing, utilities, debt, healthcare, transport)
  const essentialKeys = ['housing', 'utilities', 'debt', 'healthcare', 'transport'];
  const essentialBudgets = budgetCategories
    .filter((b) => essentialKeys.includes(b.categoryKey))
    .reduce((sum, b) => sum + b.monthlyLimit, 0);

  return Math.round(activeSubsMonthly + essentialBudgets);
}

/**
 * Calculates total monthly goal commitments
 */
export function calculateMonthlyGoalCommitments(goals: FinancialGoal[]): number {
  return goals
    .filter((g) => !g.isPaused && !g.isCompleted)
    .reduce((sum, g) => sum + g.monthlyContribution, 0);
}

/**
 * Available To Spend formula:
 * Available = Current Liquid Funds - Upcoming Committed Expenses - Monthly Goal Allocations - Minimum Emergency Reserve
 */
export function calculateAvailableToSpend(
  liquidFunds: number,
  upcomingCommitted: number,
  goalCommitments: number,
  minimumEmergencyReserve: number
): number {
  const available = liquidFunds - upcomingCommitted - goalCommitments - minimumEmergencyReserve;
  return Math.round(available);
}

/**
 * Core Signature Feature: "CAN I AFFORD THIS?"
 * Deterministic Affordability Engine
 */
export function analyzePurchaseAffordability(params: {
  price: number;
  paymentMethod: PaymentOption;
  user: UserProfile;
  accounts: Account[];
  goals: FinancialGoal[];
  subscriptions: Subscription[];
  budgetCategories: BudgetCategory[];
  transactions: Transaction[];
  emiDetails?: {
    interestRate: number;
    tenureMonths: number;
    downPayment: number;
    processingFee: number;
  };
}): AffordabilityAnalysis {
  const {
    price,
    paymentMethod,
    user,
    accounts,
    goals,
    subscriptions,
    budgetCategories,
    transactions,
    emiDetails,
  } = params;

  const liquidFunds = calculateLiquidFunds(accounts);
  const upcomingCommitted = calculateUpcomingCommitted(subscriptions, budgetCategories, transactions);
  const goalCommitments = calculateMonthlyGoalCommitments(goals);
  const emergencyReserve = user.minimumEmergencyReserve || 30000;

  // Monthly discretionary capacity from salary
  const monthlyDiscretionary = Math.max(
    0,
    user.monthlySalary - upcomingCommitted - goalCommitments
  );

  let upfrontDeduction = price;
  let addedMonthlyObligation = 0;

  if (paymentMethod === 'emi' && emiDetails) {
    upfrontDeduction = (emiDetails.downPayment || 0) + (emiDetails.processingFee || 0);
    const emiResult = calculateEMI(
      price - (emiDetails.downPayment || 0),
      emiDetails.interestRate,
      emiDetails.tenureMonths,
      emiDetails.downPayment || 0,
      emiDetails.processingFee || 0
    );
    addedMonthlyObligation = emiResult.monthlyEmi;
  }

  // Funds remaining after upfront deduction
  const remainingLiquid = liquidFunds - upfrontDeduction;
  const remainingAvailable = remainingLiquid - upcomingCommitted - goalCommitments - emergencyReserve;

  // Emergency reserve buffer remaining
  const emergencyReserveAfter = Math.max(0, liquidFunds - upfrontDeduction - upcomingCommitted);

  // Goal impact analysis: how much does this purchase delay active goals?
  const goalDelays = goals
    .filter((g) => !g.isPaused && !g.isCompleted && g.monthlyContribution > 0)
    .map((goal) => {
      const remainingTarget = Math.max(0, goal.targetAmount - goal.currentAmount);
      const currentMonthsRemaining = Math.ceil(remainingTarget / goal.monthlyContribution);

      // If user uses savings or available capacity, calculate potential shift
      let projectedMonthsRemaining = currentMonthsRemaining;
      let delayMonths = 0;

      if (remainingAvailable < 0) {
        // If deficit, goal contribution might need to be reduced or paused for N months
        const deficit = Math.abs(remainingAvailable);
        delayMonths = Math.min(6, Math.max(0.5, Math.round((deficit / (goal.monthlyContribution || 1000)) * 10) / 10));
        projectedMonthsRemaining = Math.round((currentMonthsRemaining + delayMonths) * 10) / 10;
      }

      return {
        goalId: goal.id,
        goalName: goal.name,
        currentMonthsRemaining,
        projectedMonthsRemaining,
        delayMonths,
      };
    });

  // Calculate discretionary buffer % after purchase
  const discretionaryRemaining = Math.max(0, monthlyDiscretionary - addedMonthlyObligation);
  const discretionaryBufferPercentAfter =
    user.monthlySalary > 0 ? Math.round((discretionaryRemaining / user.monthlySalary) * 100) : 0;

  // Evaluation Rules
  const passedEmergencyReserveCheck = emergencyReserveAfter >= emergencyReserve;
  const passedAvailableCashCheck = remainingLiquid >= (upcomingCommitted + (emergencyReserve * 0.5));
  const passedDiscretionaryBufferCheck =
    paymentMethod === 'emi' ? addedMonthlyObligation <= monthlyDiscretionary * 0.5 : remainingAvailable >= 0;
  const impactsGoalDeadlines = goalDelays.some((g) => g.delayMonths > 0.5);

  let status: AffordabilityAnalysis['status'] = 'SAFE';
  let headline = 'Safe to purchase';
  let explanation = 'Based on your current financial plan, this purchase fits within your available spending capacity without compromising your emergency fund or goal milestones.';

  if (!passedEmergencyReserveCheck || remainingLiquid < 0) {
    status = 'HIGH_IMPACT';
    headline = 'High financial impact';
    if (remainingLiquid < 0) {
      explanation = `This purchase exceeds your available liquid funds by ₹${Math.abs(remainingLiquid).toLocaleString('en-IN')}. It would cause immediate cash flow distress.`;
    } else {
      explanation = `This purchase reduces your emergency reserve to ₹${emergencyReserveAfter.toLocaleString('en-IN')}, which is below your minimum safety threshold of ₹${emergencyReserve.toLocaleString('en-IN')}.`;
    }
  } else if (!passedDiscretionaryBufferCheck || impactsGoalDeadlines || remainingAvailable < 0) {
    status = 'CAUTION';
    headline = 'Exercise caution';
    if (impactsGoalDeadlines) {
      const topDelayed = goalDelays.find((g) => g.delayMonths > 0);
      explanation = `You have the liquid funds, but this purchase may delay your "${topDelayed?.goalName || 'active'}" goal by approximately ${topDelayed?.delayMonths || 1} months.`;
    } else if (paymentMethod === 'emi') {
      explanation = `The monthly EMI of ₹${Math.round(addedMonthlyObligation).toLocaleString('en-IN')} consumes ${(
        (addedMonthlyObligation / (monthlyDiscretionary || 1)) * 100
      ).toFixed(0)}% of your monthly discretionary capacity.`;
    } else {
      explanation = `You can afford this, but it will leave only a small buffer of ₹${Math.max(0, remainingAvailable).toLocaleString('en-IN')} until your next salary cycle.`;
    }
  }

  const impactOnGoalsSummary = goalDelays.length === 0
    ? 'No active goal deadlines are affected.'
    : goalDelays.some((g) => g.delayMonths > 0)
    ? `May shift timelines for ${goalDelays.filter((g) => g.delayMonths > 0).length} active goal(s).`
    : 'All current goals remain on their scheduled target dates.';

  return {
    status,
    headline,
    explanation,
    metrics: {
      purchasePrice: price,
      currentAvailableFunds: liquidFunds,
      upcomingCommittedExpenses: upcomingCommitted,
      minimumEmergencyReserve: emergencyReserve,
      existingGoalCommitments: goalCommitments,
      remainingAvailableAfterPurchase: remainingAvailable,
      emergencyReserveAfterPurchase: emergencyReserveAfter,
      discretionaryBufferPercentAfter,
      impactOnGoalsSummary,
      goalDelays,
    },
    rulesEvaluated: {
      passedEmergencyReserveCheck,
      passedAvailableCashCheck,
      passedDiscretionaryBufferCheck,
      impactsGoalDeadlines,
    },
  };
}

/**
 * Standard deterministic EMI calculation
 * E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  downPayment: number = 0,
  processingFee: number = 0
): EmiCalculationResult {
  const effectivePrincipal = Math.max(0, principal);
  const r = annualInterestRate / 12 / 100; // Monthly interest rate
  const n = Math.max(1, tenureMonths);

  let monthlyEmi = 0;
  if (r === 0) {
    monthlyEmi = effectivePrincipal / n;
  } else {
    monthlyEmi = (effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalRepayment = monthlyEmi * n;
  const totalInterest = Math.max(0, totalRepayment - effectivePrincipal);
  const effectiveTotalCost = totalRepayment + downPayment + processingFee;

  // Month by month breakdown schedule
  const monthlyBreakdown: EmiCalculationResult['monthlyBreakdown'] = [];
  let balance = effectivePrincipal;

  for (let m = 1; m <= n; m++) {
    const interestPayment = balance * r;
    const principalPayment = Math.min(balance, monthlyEmi - interestPayment);
    balance = Math.max(0, balance - principalPayment);

    monthlyBreakdown.push({
      month: m,
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      balance: Math.round(balance),
    });
  }

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment),
    principal: effectivePrincipal,
    downPayment,
    processingFee,
    effectiveTotalCost: Math.round(effectiveTotalCost),
    monthlyBreakdown,
  };
}

/**
 * Transparent, deterministic 4-Pillar Financial Health Score (0 - 100)
 */
export function calculateFinancialHealthScore(params: {
  user: UserProfile;
  accounts: Account[];
  goals: FinancialGoal[];
  subscriptions: Subscription[];
  budgetCategories: BudgetCategory[];
  transactions: Transaction[];
}): FinancialHealthScore {
  const { user, accounts, goals, subscriptions, budgetCategories, transactions } = params;

  const liquidFunds = calculateLiquidFunds(accounts);
  const liabilities = calculateLiabilities(accounts);
  const monthlySalary = user.monthlySalary || 1;

  // 1. Emergency Fund Pillar (25 points)
  // Target: 6 months of essential expenses
  const essentialExpenses = calculateUpcomingCommitted(subscriptions, budgetCategories, transactions) || (monthlySalary * 0.4);
  const emergencyCoverageMonths = essentialExpenses > 0 ? liquidFunds / essentialExpenses : 0;
  const targetEmergencyMonths = 6;
  const emergencyScore = Math.min(25, Math.round((emergencyCoverageMonths / targetEmergencyMonths) * 25));
  const emergencyStatus =
    emergencyCoverageMonths >= 5 ? 'Optimal' : emergencyCoverageMonths >= 3 ? 'Adequate' : 'Insufficient';

  // 2. Savings Rate Pillar (25 points)
  // Target: 20%+ savings rate of monthly salary
  const goalCommitments = calculateMonthlyGoalCommitments(goals);
  const currentMonthSavings = goalCommitments + Math.max(0, user.monthlySalary * 0.1);
  const savingsRatePercent = Math.min(100, Math.round((currentMonthSavings / monthlySalary) * 100));
  const savingsScore = Math.min(25, Math.round((savingsRatePercent / 20) * 25));
  const savingsStatus = savingsRatePercent >= 20 ? 'High' : savingsRatePercent >= 10 ? 'Healthy' : 'Low';

  // 3. Budget Adherence Pillar (25 points)
  // Compares category spending to monthly limits
  let overBudgetCategoriesCount = 0;
  let totalBudget = 0;
  let totalSpent = 0;

  budgetCategories.forEach((cat) => {
    totalBudget += cat.monthlyLimit;
    const spentInCat = transactions
      .filter((t) => t.type === 'expense' && (t.categoryId === cat.categoryId || t.categoryKey === cat.categoryKey))
      .reduce((s, t) => s + t.amount, 0);
    totalSpent += spentInCat;
    if (spentInCat > cat.monthlyLimit && cat.monthlyLimit > 0) {
      overBudgetCategoriesCount++;
    }
  });

  const adherencePercent = totalBudget > 0 ? Math.max(0, 100 - Math.round((totalSpent / totalBudget) * 100)) : 100;
  let budgetScore = 25;
  if (overBudgetCategoriesCount > 0) {
    budgetScore = Math.max(5, 25 - overBudgetCategoriesCount * 6);
  }
  const budgetStatus = overBudgetCategoriesCount === 0 ? 'Strict' : overBudgetCategoriesCount <= 2 ? 'Good' : 'Over Budget';

  // 4. Debt & Obligation Pillar (25 points)
  // Debt-to-income ratio target < 30%
  const monthlyDebtService = liabilities * 0.05; // 5% minimum payment estimate
  const debtRatioPercent = Math.round((monthlyDebtService / monthlySalary) * 100);
  let debtScore = 25;
  if (debtRatioPercent > 40) debtScore = 5;
  else if (debtRatioPercent > 25) debtScore = 12;
  else if (debtRatioPercent > 15) debtScore = 18;
  const debtStatus = debtRatioPercent <= 15 ? 'Low Debt' : debtRatioPercent <= 30 ? 'Moderate' : 'Heavy Debt';

  const totalScore = Math.min(100, Math.max(0, emergencyScore + savingsScore + budgetScore + debtScore));

  let grade: FinancialHealthScore['grade'] = 'Good';
  if (totalScore >= 85) grade = 'Excellent';
  else if (totalScore >= 70) grade = 'Good';
  else if (totalScore >= 50) grade = 'Fair';
  else grade = 'Needs Attention';

  const keyTakeaways: string[] = [];
  if (emergencyCoverageMonths < 3) {
    keyTakeaways.push(`Your emergency fund covers ${emergencyCoverageMonths.toFixed(1)} months of essentials. Aiming for 6 months builds a resilient safety cushion.`);
  } else {
    keyTakeaways.push(`Strong liquidity reserve covering ${emergencyCoverageMonths.toFixed(1)} months of fixed commitments.`);
  }

  if (savingsRatePercent >= 20) {
    keyTakeaways.push(`Your ${savingsRatePercent}% monthly savings allocation puts you ahead of standard benchmarks.`);
  } else {
    keyTakeaways.push(`Current savings rate is ${savingsRatePercent}%. Small trims in lifestyle spending can boost this toward the 20% mark.`);
  }

  if (overBudgetCategoriesCount > 0) {
    keyTakeaways.push(`${overBudgetCategoriesCount} category limit(s) exceeded this month.`);
  } else {
    keyTakeaways.push(`All categories are pacing within planned limits.`);
  }

  return {
    totalScore,
    grade,
    breakdown: {
      emergencyCoverage: {
        score: emergencyScore,
        months: Math.round(emergencyCoverageMonths * 10) / 10,
        targetMonths: targetEmergencyMonths,
        status: emergencyStatus,
      },
      savingsRate: {
        score: savingsScore,
        ratePercent: savingsRatePercent,
        status: savingsStatus,
      },
      budgetAdherence: {
        score: budgetScore,
        adherencePercent,
        overBudgetCategoriesCount,
        status: budgetStatus,
      },
      debtCommitmentRatio: {
        score: debtScore,
        ratioPercent: debtRatioPercent,
        status: debtStatus,
      },
    },
    keyTakeaways,
  };
}

/**
 * Lifestyle Inflation Calculator:
 * Compares percentage increase in salary against percentage increase in discretionary spending over time.
 */
export function calculateLifestyleInflation(
  baselineSalary: number,
  currentSalary: number,
  baselineLifestyleSpend: number,
  currentLifestyleSpend: number
) {
  const salaryGrowthPct = baselineSalary > 0 ? ((currentSalary - baselineSalary) / baselineSalary) * 100 : 0;
  const lifestyleGrowthPct = baselineLifestyleSpend > 0 ? ((currentLifestyleSpend - baselineLifestyleSpend) / baselineLifestyleSpend) * 100 : 0;
  const inflationGap = lifestyleGrowthPct - salaryGrowthPct;

  let takeaway = '';
  if (inflationGap > 15) {
    takeaway = `Lifestyle spending grew faster (+${lifestyleGrowthPct.toFixed(1)}%) than income (+${salaryGrowthPct.toFixed(1)}%). Consider locking in raises directly into automated savings.`;
  } else if (inflationGap < -5) {
    takeaway = `Outstanding financial discipline: Your income grew +${salaryGrowthPct.toFixed(1)}% while keeping lifestyle spending increases restrained (+${lifestyleGrowthPct.toFixed(1)}%).`;
  } else {
    takeaway = `Balanced growth: Lifestyle spending is growing proportionally with your salary progression.`;
  }

  return {
    salaryGrowthPct: Math.round(salaryGrowthPct * 10) / 10,
    lifestyleGrowthPct: Math.round(lifestyleGrowthPct * 10) / 10,
    inflationGap: Math.round(inflationGap * 10) / 10,
    isInflating: inflationGap > 10,
    takeaway,
  };
}

/**
 * Salary Growth Projection Simulator:
 * Projects future income over 1 to 5 years given annual increments and bonus expectations.
 */
export function projectSalaryGrowth(
  currentSalary: number,
  annualHikePercent: number,
  expectedBonusPercent: number,
  years: number = 5
) {
  const projections = [];
  let currentAnnual = currentSalary * 12;

  for (let year = 1; year <= years; year++) {
    currentAnnual = currentAnnual * (1 + annualHikePercent / 100);
    const bonus = currentAnnual * (expectedBonusPercent / 100);
    const totalComp = currentAnnual + bonus;
    const monthlyEquivalent = currentAnnual / 12;

    projections.push({
      year,
      baseAnnual: Math.round(currentAnnual),
      bonus: Math.round(bonus),
      totalComp: Math.round(totalComp),
      monthlyEquivalent: Math.round(monthlyEquivalent),
    });
  }

  return projections;
}
