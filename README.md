# 💰 SalaryOS

### Get Paid. Plan Smart. Spend With Confidence.

SalaryOS is a modern personal finance and salary planning platform designed to help users understand their income, manage monthly expenses, build savings goals, track recurring payments, and make smarter purchasing decisions.

> **Don't just track where your money went. Plan where your money should go.**

---
## 🌐 Live Demo
https://salaryos-one.vercel.app/

## 🚀 Overview

Managing a salary isn't just about tracking expenses.

SalaryOS helps users answer important real-world questions:

- 💰 Where should my salary go?
- 📊 How much can I safely spend this month?
- 🎯 How much should I save for my goals?
- 🛒 Can I afford a major purchase?
- 💳 How will an EMI affect my monthly budget?
- 🚨 How strong is my emergency fund?
- 🔄 How much am I spending on subscriptions?
- 📈 Is my financial situation improving?

SalaryOS brings these decisions together into one professional financial planning dashboard.

---

## ✨ Key Features

### 💵 Salary Planner

Plan your monthly salary across:

- Essential expenses
- Savings
- Emergency fund
- Financial goals
- Lifestyle
- Flexible spending

Get a clear picture of where every part of your income is going.

---

### 🛒 Can I Afford This?

The signature SalaryOS feature.

Enter a planned purchase and understand its impact on your financial plan.

For example:

```text
Laptop
₹80,000

Current Available Funds
₹95,000

Upcoming Expenses
₹25,000

Emergency Reserve
₹30,000

Goal Commitments
₹15,000
````

SalaryOS analyzes the purchase and provides a transparent result:

```text
🟢 SAFE
🟡 CAUTION
🔴 HIGH IMPACT
```

The system considers more than just your current bank balance.

---

### 📊 Smart Budget Management

Create monthly budgets for:

* Food
* Housing
* Transport
* Shopping
* Entertainment
* Utilities
* Healthcare
* Education
* Travel
* Subscriptions

Track:

```text
Budget:    ₹5,000
Spent:     ₹3,420
Remaining: ₹1,580
```

---

### 🎯 Financial Goals

Create and track goals such as:

* 💻 Laptop
* 🚨 Emergency Fund
* 🏍️ Bike
* 🚗 Car
* ✈️ Travel
* 🎓 Education
* 🏠 House
* 📱 Phone

Track:

* Target amount
* Current savings
* Monthly contribution
* Progress
* Estimated completion
* Deadline

---

### 🚨 Emergency Fund

Track your emergency reserve based on your essential monthly expenses.

Example:

```text
Essential Expenses: ₹25,000/month

Target Coverage: 6 months

Target: ₹1,50,000
Current: ₹82,000

Coverage: 3.28 months
```

---

### 🔄 Subscription Tracker

Monitor recurring expenses such as:

* Streaming services
* Cloud storage
* Gym memberships
* Software subscriptions
* Internet
* Insurance

View:

* Monthly recurring cost
* Annual recurring cost
* Upcoming renewals

---

### 💳 EMI Calculator

Calculate estimated:

* Monthly EMI
* Total interest
* Total repayment
* Loan amount
* Down payment

Users can understand the potential impact of financing a purchase.

---

### 📈 Financial Analytics

Visualize:

* Income trends
* Expense trends
* Savings
* Category spending
* Goal progress
* Net worth
* Recurring expenses

---

### 💎 Net Worth Tracking

Track:

#### Assets

* Bank accounts
* Cash
* Investments
* Other assets

#### Liabilities

* Loans
* Credit cards
* Other debt

Calculate:

```text
Net Worth = Total Assets - Total Liabilities
```

---

### 📅 Monthly Financial Review

At the end of each month, SalaryOS provides an overview of:

* Total income
* Total expenses
* Savings
* Goal contributions
* Budget performance
* Top spending categories
* Subscription costs
* Net worth changes

---

### 📈 Salary Growth Simulator

Estimate future income based on:

* Current salary
* Expected annual increment
* Expected bonuses

Example:

```text
Year 1 → ₹50,000
Year 2 → ₹54,000
Year 3 → ₹58,320
Year 4 → ₹62,986
Year 5 → ₹68,025
```

> Projections are estimates and actual income may differ.

---

### 📉 Lifestyle Inflation Tracking

Compare salary growth with lifestyle spending.

Example:

```text
Salary Growth       +50%
Lifestyle Spending +120%
Savings Growth      +10%
```

This helps users understand how lifestyle changes affect savings.

---

## 🧠 Product Philosophy

SalaryOS follows a simple principle:

```text
EARN
  ↓
PLAN
  ↓
ALLOCATE
  ↓
SPEND
  ↓
SAVE
  ↓
ACHIEVE
  ↓
REVIEW
```

The application is designed to help users make better decisions with the money they already earn.

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      SalaryOS        │
                    │      Web App         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Application/API    │
                    │       Layer          │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌────────────┐    ┌────────────┐    ┌────────────┐
      │ PostgreSQL │    │   Auth     │    │   Storage  │
      │  Database  │    │  Service   │    │   / Files  │
      └────────────┘    └────────────┘    └────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

## Backend

* Next.js API / Server Actions
* TypeScript
* RESTful architecture
* Zod validation

## Database

* PostgreSQL
* Prisma / Drizzle ORM

## Authentication

* Secure session-based authentication

## Deployment

* Vercel

---

# 📁 Project Structure

```text
salaryos/
│
├── app/
│   ├── dashboard/
│   ├── budget/
│   ├── transactions/
│   ├── goals/
│   ├── purchases/
│   ├── analytics/
│   ├── subscriptions/
│   ├── profile/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── budget/
│   ├── goals/
│   ├── purchases/
│   └── charts/
│
├── features/
│   ├── salary/
│   ├── transactions/
│   ├── budgets/
│   ├── goals/
│   ├── purchases/
│   ├── subscriptions/
│   └── analytics/
│
├── lib/
│   ├── auth/
│   ├── database/
│   ├── validation/
│   └── utilities/
│
├── services/
│   ├── SalaryService.ts
│   ├── BudgetService.ts
│   ├── GoalService.ts
│   ├── PurchasePlannerService.ts
│   ├── TransactionService.ts
│   └── FinancialHealthService.ts
│
├── repositories/
│
├── hooks/
│
├── types/
│
├── validators/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── tests/
│
├── .env.example
├── README.md
└── package.json
```

---

# 🔐 Security

SalaryOS treats financial information as sensitive data.

Security considerations include:

* 🔒 Secure authentication
* 🛡️ Server-side authorization
* 🔍 Input validation
* 🚫 XSS protection
* 🗄️ SQL injection protection
* 🔐 Secure cookies
* ⚡ Rate limiting
* 🔑 Environment-based secrets
* 👤 User data isolation
* 📋 Audit logging
* 🛡️ Security headers

Sensitive environment variables are never exposed to the client.

---

# 📱 Responsive Design

SalaryOS is designed for:

* 💻 Desktop
* 🖥️ Large screens
* 📱 Mobile
* 📲 Tablet

The interface adapts to different screen sizes rather than simply shrinking the desktop layout.

### Mobile Navigation

```text
Home
Budget
Goals
Transactions
Profile
```

A quick-action button allows users to:

* Add expense
* Add income
* Create goal
* Plan purchase

---

# ♿ Accessibility

SalaryOS follows modern accessibility practices including:

* Semantic HTML
* Keyboard navigation
* Accessible forms
* Focus states
* ARIA labels where required
* Screen-reader support
* Proper contrast
* Reduced-motion support
* Responsive typography

---

# 🧪 Testing

Testing covers important financial and application logic.

### Unit Tests

* Salary calculations
* Budget calculations
* Goal calculations
* Purchase affordability
* EMI calculations
* Net worth
* Savings rate

### Integration Tests

* Authentication
* Transactions
* Goals
* Budgets
* Purchase simulations

### End-to-End Tests

* User registration
* Onboarding
* Salary setup
* Expense creation
* Goal creation
* Purchase planning

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/salaryos.git
```

## 2. Navigate to the project

```bash
cd salaryos
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```bash
.env.local
```

Copy the required variables from:

```bash
.env.example
```

Example:

```env
DATABASE_URL=
AUTH_SECRET=
```

Never commit real secrets.

## 5. Setup the database

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

## 6. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🌐 Deployment

SalaryOS is designed to be deployed using Vercel.

Production deployment requires:

* Production database
* Authentication configuration
* Environment variables
* Secure deployment settings

Never place production secrets directly inside source code.

---

# 🗺️ Roadmap

## ✅ Phase 1 — Foundation

* [x] Project architecture
* [x] Design system
* [x] Responsive layout
* [x] Authentication
* [x] Database architecture

## 🚧 Phase 2 — Core Finance

* [ ] Salary planner
* [ ] Dashboard
* [ ] Transactions
* [ ] Budget management
* [ ] Account tracking

## 🚧 Phase 3 — Financial Planning

* [ ] Financial goals
* [ ] Emergency fund
* [ ] Subscription tracker
* [ ] Purchase planner
* [ ] EMI calculator

## 🔮 Phase 4 — Intelligence

* [ ] Advanced analytics
* [ ] Net worth tracking
* [ ] Lifestyle inflation analysis
* [ ] Salary growth simulator
* [ ] Monthly financial reports

## 🔮 Phase 5 — Future

* [ ] CSV bank statement import
* [ ] Advanced financial insights
* [ ] Household budgeting
* [ ] Shared financial goals
* [ ] Optional financial integrations

---

# 💡 Example Use Case

Imagine a user earns:

```text
Monthly Salary
₹60,000
```

Their monthly plan:

```text
Essentials       ₹23,000
Savings          ₹10,000
Emergency Fund    ₹5,000
Goals             ₹8,000
Lifestyle         ₹7,000
Flexible          ₹7,000
```

Now they want to purchase:

```text
Laptop
₹80,000
```

Instead of simply asking:

> "Do I have ₹80,000?"

SalaryOS asks:

> **"What happens to my financial plan if I spend ₹80,000?"**

It analyzes the purchase and shows the potential effect on:

* Emergency fund
* Savings
* Monthly budget
* Financial goals
* Available spending capacity

This is the core idea behind SalaryOS.

---

# ⚠️ Financial Disclaimer

SalaryOS is a personal budgeting, tracking, and financial planning software project.

It does not provide regulated financial, investment, tax, or legal advice.

Financial projections and calculations are estimates based on user-provided information and assumptions.

Users should independently verify important financial decisions with a qualified professional where appropriate.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

# 📜 License

This project is currently available for educational and portfolio purposes.

Add an appropriate open-source license if you intend to accept external contributions.

---

# 👨‍💻 Developer

## Garv Shaw

**Computer Science Engineering | Cloud Computing & AI**

Interested in:

* ☁️ Cloud Computing
* 🤖 Artificial Intelligence
* 💻 Software Development
* 📊 Financial Technology
* 📈 Capital Markets
* 🚀 Product Development

---

# ⭐ Support

If you find SalaryOS useful or interesting:

⭐ Star this repository

🍴 Fork the project

🐛 Report issues

💡 Suggest features

---

## SalaryOS

### 💰 Get Paid. Plan Smart. Spend With Confidence.

````

### GitHub repository topics

Add these to your repository:

```text
salaryos
personal-finance
finance-app
budgeting
expense-tracker
financial-planning
fintech
nextjs
react
typescript
postgresql
tailwindcss
full-stack
saas
financial-goals
budget-management
purchase-planner
responsive-design
````

This README positions **SalaryOS as a real fintech-style SaaS portfolio project**, while making it clear that it's a planning tool rather than a regulated financial-advice product.
