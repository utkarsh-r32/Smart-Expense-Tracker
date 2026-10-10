import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Smart Expense Tracker",
  description: "How Smart Expense Tracker handles account and expense information.",
};

const sections = [
  {
    title: "Information this app handles",
    paragraphs: [
      "When you create an account or sign in, the authentication service processes your email address and authentication data. If you choose Google sign-in, Google and Supabase Auth process the account information needed to authenticate you, such as your email and basic profile details.",
      "When you use expense tracking, the app stores the expense details you submit: description, amount, date, category, and payment method. These records are associated with your account.",
      "The Android app can also save weekly and monthly budget amounts locally on your device. Those budget values are not currently synced to the web app or Supabase.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "Account information is used to authenticate you and protect access to your account. Expense information is used to display your expenses and calculate totals, charts, and reports. Information may also be processed to maintain, protect, and troubleshoot the service.",
      "Smart Expense Tracker does not sell your personal or expense information or use it for advertising.",
    ],
  },
  {
    title: "Service providers and storage",
    paragraphs: [
      "The web app is hosted by Vercel. Supabase provides authentication and stores synchronized expense records. Google processes sign-in when you choose Google authentication. These providers process information as needed to provide their services and under their own privacy terms.",
      "Expense records are intended to be isolated by account using Supabase access controls. No online service can guarantee absolute security, so protect your sign-in credentials and use a trusted device.",
    ],
  },
  {
    title: "Retention and deletion",
    paragraphs: [
      "Expense records remain in your account until you delete them or request account-data deletion. The current app does not provide an account-deletion control. To ask the maintainer about access, correction, or deletion, use the project issue tracker below and request a private follow-up. Do not include your email address, credentials, or financial details in a public issue.",
      "Local Android budget settings remain on the device until you clear the app's data or uninstall the app.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "This policy may be updated as the service changes. The latest version and its effective date will be published on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link className="text-sm font-medium text-emerald-300 hover:text-emerald-200" href="/">
          Smart Expense Tracker
        </Link>
        <p className="mt-10 text-sm text-slate-400">Last updated: October 10, 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Privacy Policy</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          This policy describes how Smart Expense Tracker handles information when you use the web app or Android app.
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
                    . Issues are public; request a private follow-up without sharing personal or financial information.
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-8 flex gap-5 text-sm text-slate-400">
          <Link className="hover:text-white" href="/terms">Terms of Service</Link>
          <Link className="hover:text-white" href="/">Return to app</Link>
        </footer>
      </article>
    </main>
  );
}
