"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  IndianRupee,
  LogOut,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { clsx } from "clsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { defaultCategories, mockExpenses, paymentMethods, type Expense } from "@/lib/mock-data";

const emptyForm = {
  expense_date: new Date().toISOString().slice(0, 10),
  category: "Food",
  description: "",
  amount: "",
  payment_method: "UPI",
};

const chartColors = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#f87171"];

type AuthMode = "sign-in" | "sign-up";

export function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses],
  );

  const monthlyAverage = useMemo(() => {
    if (expenses.length === 0) return 0;
    return totalSpent / expenses.length;
  }, [expenses.length, totalSpent]);

  const topCategory = useMemo(() => {
    const groups = expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => b[1] - a[1])[0];
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const groups = expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(groups).map(([name, total]) => ({ name, total }));
  }, [expenses]);

  const monthlyChart = useMemo(() => {
    const groups = expenses.reduce<Record<string, number>>((acc, item) => {
      const month = item.expense_date.slice(0, 7);
      acc[month] = (acc[month] ?? 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([month, total]) => ({
        month: new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        total,
      }))
      .slice(-6);
  }, [expenses]);

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  const loadExpenses = async (userId: string) => {
    const client = supabase;
    if (!client) return;

    const { data, error } = await client
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("expense_date", { ascending: false });

    if (error) {
      console.error(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setExpenses([]);
      return;
    }

    const normalized = data.map((item) => ({
      id: Number(item.id),
      expense_date: item.expense_date,
      category: item.category,
      description: item.description,
      amount: Number(item.amount),
      payment_method: item.payment_method,
    }));

    setExpenses(normalized);
  };

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const initializeAuth = async () => {
      const {
        data: { session: currentSession },
      } = await client.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadExpenses(currentSession.user.id);
      }
    };

    void initializeAuth();

    const { data: authListener } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await loadExpenses(nextSession.user.id);
      } else {
        setExpenses(mockExpenses);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;
    if (!client || !isSupabaseConfigured) {
      setAuthStatus("Supabase environment variables are missing. Add them to continue with auth.");
      return;
    }

    setAuthLoading(true);
    setAuthStatus(null);

    try {
      if (authMode === "sign-up") {
        const { error } = await client.auth.signUp({
          email: authForm.email,
          password: authForm.password,
        });

        if (error) {
          setAuthStatus(error.message);
          return;
        }

        setAuthStatus("Check your email for the confirmation message.");
      } else {
        const { error } = await client.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });

        if (error) {
          setAuthStatus(error.message);
          return;
        }

        setAuthStatus(null);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const client = supabase;
    if (!client) return;

    await client.auth.signOut();
    setSession(null);
    setUser(null);
    setExpenses(mockExpenses);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(form.amount);

    if (!form.description.trim() || !form.category || !form.expense_date || Number.isNaN(value) || value <= 0) {
      setError("Please complete the form with a valid amount and description.");
      return;
    }

    const nextExpense: Expense = {
      id: Date.now(),
      expense_date: form.expense_date,
      category: form.category,
      description: form.description.trim(),
      amount: value,
      payment_method: form.payment_method,
    };

    setLoading(true);
    setError(null);

    const client = supabase;
    if (client && session?.user) {
      const { error: insertError } = await client.from("expenses").insert({
        user_id: session.user.id,
        expense_date: nextExpense.expense_date,
        category: nextExpense.category,
        description: nextExpense.description,
        amount: nextExpense.amount,
        payment_method: nextExpense.payment_method,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      await loadExpenses(session.user.id);
    } else {
      setExpenses((current) => [nextExpense, ...current]);
    }

    setForm(emptyForm);
    setLoading(false);
  };

  const onChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Expense Tracker</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Smart money overview</h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Signed in</p>
                <p className="mt-1 text-sm font-medium text-white">{user.email}</p>
              </div>
            ) : null}

            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : null}

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Total spent</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">₹{totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </header>

        {!user ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Secure access</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Sign in to sync your expenses</h2>
                <p className="mt-3 max-w-xl text-sm text-slate-300">
                  Your expenses are stored securely in Supabase. Use email/password auth to keep each account private and personalized.
                </p>
                {!isSupabaseConfigured ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    Supabase credentials are not configured yet. Demo mode is active until you add them.
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleAuthSubmit} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
                <div className="mb-4 flex rounded-xl border border-slate-700 bg-slate-900 p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("sign-in")}
                    className={clsx("flex-1 rounded-lg px-3 py-2 text-sm font-medium transition", authMode === "sign-in" ? "bg-emerald-500 text-slate-950" : "text-slate-300")}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("sign-up")}
                    className={clsx("flex-1 rounded-lg px-3 py-2 text-sm font-medium transition", authMode === "sign-up" ? "bg-emerald-500 text-slate-950" : "text-slate-300")}
                  >
                    Create account
                  </button>
                </div>

                {authStatus ? (
                  <div className="mb-4 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
                    {authStatus}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <Field label="Email">
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="Password">
                    <input
                      type="password"
                      value={authForm.password}
                      onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                      placeholder="••••••••"
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={authLoading || !isSupabaseConfigured}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
                  >
                    {authLoading ? "Please wait..." : authMode === "sign-up" ? "Create account" : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {user ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Monthly average"
                value={`₹${monthlyAverage.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                icon={<IndianRupee className="h-5 w-5" />}
                accent="text-cyan-300"
              />
              <StatCard
                title="Top spending"
                value={topCategory ? `${topCategory[0]} • ₹${topCategory[1].toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "No data"}
                icon={<TrendingUp className="h-5 w-5" />}
                accent="text-violet-300"
              />
              <StatCard
                title="Payment methods"
                value={`${new Set(expenses.map((item) => item.payment_method)).size} active`}
                icon={<CreditCard className="h-5 w-5" />}
                accent="text-amber-300"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
              <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Add an expense</h2>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {supabase ? "Live DB" : "Demo mode"}
                  </span>
                </div>

                {error ? (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <Field label="Date">
                    <input
                      type="date"
                      value={form.expense_date}
                      onChange={(event) => onChange("expense_date", event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 outline-none ring-0 transition focus:border-emerald-400"
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(event) => onChange("category", event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 outline-none transition focus:border-emerald-400"
                    >
                      {defaultCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Description">
                    <input
                      value={form.description}
                      onChange={(event) => onChange("description", event.target.value)}
                      placeholder="Groceries, fuel, rent..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Amount">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={form.amount}
                        onChange={(event) => onChange("amount", event.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                      />
                    </Field>

                    <Field label="Payment">
                      <select
                        value={form.payment_method}
                        onChange={(event) => onChange("payment_method", event.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-50 outline-none transition focus:border-emerald-400"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                      "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-800 disabled:text-slate-400",
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    {loading ? "Saving..." : "Add expense"}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Recent expenses</h2>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {expenses.length} items
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div>
                          <p className="text-base font-medium text-white">{expense.description}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{expense.expense_date}</span>
                            <span>•</span>
                            <span>{expense.payment_method}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-emerald-300">₹{Number(expense.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <ChartCard title="Monthly spending" icon={<BarChart3 className="h-4 w-4" />}>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#cbd5e1" tickLine={false} axisLine={false} />
                          <YAxis stroke="#cbd5e1" tickLine={false} axisLine={false} />
                          <Tooltip
                            formatter={(value) => [`₹${Number(Array.isArray(value) ? value[0] : value ?? 0).toLocaleString("en-IN")}`, "Spent"]}
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                          />
                          <Bar dataKey="total" fill="#34d399" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  <ChartCard title="Category share" icon={<Wallet className="h-4 w-4" />}>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryBreakdown} dataKey="total" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`${entry.name}-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`₹${Number(Array.isArray(value) ? value[0] : value ?? 0).toLocaleString("en-IN")}`, "Spent"]}
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
      <div className={clsx("mb-4 inline-flex rounded-xl bg-slate-800 p-2.5", accent)}>{icon}</div>
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
      <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-300">
        <span className="inline-flex rounded-lg bg-slate-800 p-2 text-emerald-300">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
