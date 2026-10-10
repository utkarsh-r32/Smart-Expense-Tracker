export type Expense = {
  id: number;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
};

export const mockExpenses: Expense[] = [
  {
    id: 1,
    expense_date: "2026-10-03",
    category: "Food",
    description: "Lunch with team",
    amount: 280,
    payment_method: "UPI",
  },
  {
    id: 2,
    expense_date: "2026-10-06",
    category: "Transport",
    description: "Metro commute",
    amount: 110,
    payment_method: "Cash",
  },
  {
    id: 3,
    expense_date: "2026-10-08",
    category: "Shopping",
    description: "Office supplies",
    amount: 680,
    payment_method: "Debit Card",
  },
  {
    id: 4,
    expense_date: "2026-10-09",
    category: "Bills",
    description: "Internet and utilities",
    amount: 1400,
    payment_method: "Bank Transfer",
  },
  {
    id: 5,
    expense_date: "2026-10-10",
    category: "Entertainment",
    description: "Movie night",
    amount: 520,
    payment_method: "Credit Card",
  },
];

export const defaultCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Education",
  "Healthcare",
  "Bills",
  "Entertainment",
  "Travel",
  "Recharge",
  "Other",
];

export const paymentMethods = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Other",
];
