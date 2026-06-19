import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-4">
          AK Investments & Financial Services
        </p>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          AK Saarthi AI
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-8">
          Protecting Families. Empowering Advisors.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/advisor/dashboard"
            className="rounded-full bg-yellow-400 px-8 py-3 text-slate-950 font-semibold"
          >
            Advisor Login
          </Link>

          <Link
            href="/client/dashboard"
            className="rounded-full border border-white/30 px-8 py-3 font-semibold"
          >
            Client Portal
          </Link>
        </div>
      </div>
    </main>
  );
}