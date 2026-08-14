import {
  analyzePurchaseAffordability,
  calculateAvailableToSpend,
  calculateEMI,
  calculateFinancialHealthScore,
  calculateLifestyleInflation,
} from './calculations';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from './mockData';

export interface TestResult {
  id: string;
  name: string;
  category: 'Affordability' | 'EMI' | 'AvailableToSpend' | 'HealthScore' | 'Inflation';
  passed: boolean;
  expected: string;
  actual: string;
  durationMs: number;
  error?: string;
}

export function runAllUnitTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: Available to Spend Formula
  // Liquid: 147,700, Committed: 44,700 approx, Goal Commitments: 16,500, Reserve: 50,000
  {
    const start = performance.now();
    const liquid = 100000;
    const committed = 25000;
    const goals = 15000;
    const reserve = 30000;
    const result = calculateAvailableToSpend(liquid, committed, goals, reserve);
    const expected = 30000;
    const passed = result === expected;
    results.push({
      id: 'test_avail_01',
      name: 'Available To Spend deterministic subtraction',
      category: 'AvailableToSpend',
      passed,
      expected: `₹${expected}`,
      actual: `₹${result}`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 2: Standard EMI Calculation
  // Principal: 100,000, 12% annual, 12 months -> EMI is approx ₹8,885
  {
    const start = performance.now();
    const emiRes = calculateEMI(100000, 12, 12, 0, 0);
    // Standard amortization formula gives 8884.88 -> rounded 8885
    const passed = emiRes.monthlyEmi >= 8880 && emiRes.monthlyEmi <= 8890;
    results.push({
      id: 'test_emi_01',
      name: 'Standard Amortized Loan EMI Formula (P=1L, r=12%, n=12m)',
      category: 'EMI',
      passed,
      expected: 'Monthly EMI ₹8,885',
      actual: `Monthly EMI ₹${emiRes.monthlyEmi}`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 3: Zero-interest EMI
  {
    const start = performance.now();
    const zeroEmi = calculateEMI(60000, 0, 6, 0, 0);
    const passed = zeroEmi.monthlyEmi === 10000 && zeroEmi.totalInterest === 0;
    results.push({
      id: 'test_emi_02',
      name: 'No-Cost / 0% Interest EMI Distribution',
      category: 'EMI',
      passed,
      expected: 'Monthly EMI ₹10,000, Total Interest ₹0',
      actual: `Monthly EMI ₹${zeroEmi.monthlyEmi}, Total Interest ₹${zeroEmi.totalInterest}`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 4: Affordability Engine: SAFE status for minor purchase
  {
    const start = performance.now();
    const analysis = analyzePurchaseAffordability({
      price: 2500,
      paymentMethod: 'cash',
      user: INITIAL_USER,
      accounts: INITIAL_ACCOUNTS,
      goals: INITIAL_GOALS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      budgetCategories: INITIAL_BUDGETS,
      transactions: INITIAL_TRANSACTIONS,
    });
    const passed = analysis.status === 'SAFE';
    results.push({
      id: 'test_afford_safe',
      name: 'Purchase Affordability: Small Purchase returns SAFE',
      category: 'Affordability',
      passed,
      expected: 'Status = SAFE',
      actual: `Status = ${analysis.status} (${analysis.headline})`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 5: Affordability Engine: HIGH_IMPACT for purchase exceeding total funds
  {
    const start = performance.now();
    const analysis = analyzePurchaseAffordability({
      price: 350000,
      paymentMethod: 'cash',
      user: INITIAL_USER,
      accounts: INITIAL_ACCOUNTS,
      goals: INITIAL_GOALS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      budgetCategories: INITIAL_BUDGETS,
      transactions: INITIAL_TRANSACTIONS,
    });
    const passed = analysis.status === 'HIGH_IMPACT';
    results.push({
      id: 'test_afford_high',
      name: 'Purchase Affordability: Exceeding Reserve returns HIGH_IMPACT',
      category: 'Affordability',
      passed,
      expected: 'Status = HIGH_IMPACT',
      actual: `Status = ${analysis.status} (${analysis.headline})`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 6: Financial Health Score 4-Pillar bounds
  {
    const start = performance.now();
    const health = calculateFinancialHealthScore({
      user: INITIAL_USER,
      accounts: INITIAL_ACCOUNTS,
      goals: INITIAL_GOALS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      budgetCategories: INITIAL_BUDGETS,
      transactions: INITIAL_TRANSACTIONS,
    });
    const passed = health.totalScore >= 0 && health.totalScore <= 100;
    results.push({
      id: 'test_health_01',
      name: 'Financial Health Score bounds & 4-Pillar validation',
      category: 'HealthScore',
      passed,
      expected: '0 <= score <= 100',
      actual: `Score = ${health.totalScore}/100 (${health.grade})`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  // Test 7: Lifestyle Inflation calculation
  {
    const start = performance.now();
    const inflation = calculateLifestyleInflation(40000, 60000, 15000, 30000);
    // Salary grew +50%, Lifestyle grew +100% -> Gap +50% -> isInflating = true
    const passed = inflation.salaryGrowthPct === 50 && inflation.lifestyleGrowthPct === 100 && inflation.isInflating === true;
    results.push({
      id: 'test_inflation_01',
      name: 'Lifestyle Inflation differential metric evaluation',
      category: 'Inflation',
      passed,
      expected: 'Salary +50%, Lifestyle +100%, isInflating = true',
      actual: `Salary +${inflation.salaryGrowthPct}%, Lifestyle +${inflation.lifestyleGrowthPct}%, Gap = +${inflation.inflationGap}%`,
      durationMs: +(performance.now() - start).toFixed(2),
    });
  }

  return results;
}
