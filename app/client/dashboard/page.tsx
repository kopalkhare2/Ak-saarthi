'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
import StatCard from '@/components/ui/stat-card';
import Badge, { policyStatusBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate, daysFromNow } from '@/lib/utils';
import { Shield, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

export default function ClientDashboard() {
  const { clients, policies, investments, appointments } = useApp();
  const [clientId, setClientId] = useState<string>('client-001');

  useEffect(() => {
    const id = localStorage.getItem('ak_logged_in_client_id');
    if (id) {
      setClientId(id);
    }
  }, []);

  const activeClient = clients.find((c) => c.id === clientId);
  const firstName = activeClient ? activeClient.firstName : 'Client';

  const myPolicies = policies.filter((p) => p.clientId === clientId);
  const myInvestments = investments.filter((i) => i.clientId === clientId);
  const activePolicies = myPolicies.filter((p) => p.status === 'active').length;
  const totalPortfolio = myInvestments.reduce((s, i) => s + i.currentValue, 0);
  const premiumsDue = myPolicies.filter((p) => daysFromNow(p.dueDate) >= 0 && daysFromNow(p.dueDate) <= 30).length;
  const nextAppt = appointments.find((a) => a.clientId === clientId && a.status === 'scheduled');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back, {firstName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Policies" value={activePolicies.toString()} icon={<Shield size={20} />} accent="bg-emerald-500/10 text-emerald-400" />
        <StatCard title="Portfolio Value" value={formatCurrency(totalPortfolio)} icon={<TrendingUp size={20} />} accent="bg-blue-500/10 text-blue-400" />
        <StatCard title="Premiums Due" value={premiumsDue.toString()} icon={<AlertTriangle size={20} />} accent="bg-amber-500/10 text-amber-400" />
        <StatCard title="Next Appointment" value={nextAppt ? formatDate(nextAppt.date) : 'None'} icon={<Calendar size={20} />} accent="bg-purple-500/10 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* My Policies */}
        <div className="card p-5 animate-fade-in">
          <h3 className="font-semibold mb-4">My Policies</h3>
          <div className="space-y-3">
            {myPolicies.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium">{p.company}</p>
                  <p className="text-xs text-slate-500">{p.policyNumber} · Premium: {formatCurrency(p.premium)}/yr</p>
                </div>
                {policyStatusBadge(p.status)}
              </div>
            ))}
          </div>
        </div>

        {/* My Investments */}
        <div className="card p-5 animate-fade-in">
          <h3 className="font-semibold mb-4">My Investments</h3>
          <div className="space-y-3">
            {myInvestments.map((i) => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium">{i.schemeName}</p>
                  <p className="text-xs text-slate-500">Invested: {formatCurrency(i.investedAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{formatCurrency(i.currentValue)}</p>
                  <p className={`text-xs ${i.returns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{i.returns >= 0 ? '+' : ''}{i.returns.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
