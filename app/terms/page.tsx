import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Smart Expense Tracker",
  description: "Terms for using Smart Expense Tracker.",
};

const sections = [
  {
    title: "Using the service",
    paragraphs: [
      "Smart Expense Tracker provides tools to record personal expenses and view totals, charts, and reports. You may use the service only in compliance with applicable laws and these terms.",
      "You are responsible for the accuracy of information you enter, keeping your account credentials secure, and activity carried out through your account. Do not attempt to access another person's account or data, interfere with the service, or use it unlawfully.",
    ],
  },
  {
    title: "Not financial advice",
    paragraphs: [
      "The app is an organizational tool. Its totals, charts, and reports may be incomplete or inaccurate and are not financial, tax, accounting, or legal advice. Check important figures independently before relying on them.",
    ],
  },
  {
    title: "Accounts and your information",
    paragraphs: [
      "You may stop using the service at any time. Expense records are associated with your authenticated account. The app currently has no account-deletion control; contact the maintainer to request account-data deletion. See the Privacy Policy for information about data handling.",
    ],
  },
  {
    title: "Availability and changes",
    paragraphs: [
      "The service is provided without a promise of uninterrupted availability. Features may change, be suspended, or be discontinued. You should keep your own records of information that is important to you.",
    ],
  },
  {
    title: "Disclaimer and liability",
    paragraphs: [
      "To the extent permitted by law, the service is provided on an “as is” and “as available” basis, without warranties. To the extent permitted by law, the maintainer is not liable for indirect or consequential loss arising from use of the service or reliance on its calculations. Nothing in these terms limits rights or liability that cannot legally be limited.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "These terms may be updated as the service changes. Continued use after an updated version is published means you accept the revised terms, to the extent permitted by law.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link className="text-sm font-medium text-emerald-300 hover:text-emerald-200" href="/">
          Smart Expense Tracker
        </Link>
        <p className="mt-10 text-sm text-slate-400">Last updated: October 10, 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Terms of Service</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          By using Smart Expense Tracker, you agree to these terms.
        </p>

        <div className="mt-10 divide-y divide-slate-800 border-y border-slate-800">
          {sections.map((section) => (
            <section className="py-7" key={section.title}>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="mt-3 space-y-4 text-base leading-7 text-slate-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.title === "Changes and contact" ? (
                  <p>
                    Contact the maintainer through the{" "}
                    <a
                      className="text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-200"
                      href="https://github.com/utkarsh-r32/Smart-Expense-Tracker/issues"
                      rel="noreferrer"
                      target="_blank"
                    >
                      project issue tracker
                    </a>
                    . Issues are public; do not share personal or financial information there.
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-8 flex gap-5 text-sm text-slate-400">
          <Link className="hover:text-white" href="/privacy">Privacy Policy</Link>
          <Link className="hover:text-white" href="/">Return to app</Link>
        </footer>
      </article>
    </main>
  );
}
