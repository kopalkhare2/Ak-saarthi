'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'advisor' | 'client'>('advisor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Clear inputs when role changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      // Successful login
      localStorage.setItem('ak_logged_in_role', data.role);
      if (data.clientId) {
        localStorage.setItem('ak_logged_in_client_id', data.clientId);
      } else {
        localStorage.removeItem('ak_logged_in_client_id');
      }

      if (data.role === 'advisor') {
        router.push('/advisor/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };



  return (
    <main className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-8 animate-float">
            <Sparkles size={36} className="text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AK Saarthi AI</h1>
          <p className="text-lg text-slate-400 mb-2">Financial Advisor Operating System</p>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Manage your entire advisory business — clients, policies, investments, commissions, and analytics — all in one premium platform.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-12 text-left">
            {[
              '360° Client CRM',
              'Insurance Tracking',
              'Investment Portfolio',
              'AI Assistant',
              'Commission Tracker',
              'Business Analytics',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--navy-950)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Sparkles size={20} className="text-slate-900" />
            </div>
            <h1 className="text-xl font-bold">AK Saarthi AI</h1>
          </div>

          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">Sign in to your account to continue</p>

          {/* Role Toggle */}
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl mb-6">
            <button
              onClick={() => setRole('advisor')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                role === 'advisor' ? 'bg-yellow-500/10 text-yellow-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Advisor
            </button>
            <button
              onClick={() => setRole('client')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                role === 'client' ? 'bg-yellow-500/10 text-yellow-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Client
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'advisor' ? 'advisor@aksaarthi.com' : 'client@email.com'}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="rounded border-slate-600" />
                Remember me
              </label>
              <a href="#" className="text-yellow-400 hover:text-yellow-300">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-base">
              Sign In as {role === 'advisor' ? 'Advisor' : 'Client'}
            </button>
          </form>



          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-medium">Sign Up</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400">← Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
