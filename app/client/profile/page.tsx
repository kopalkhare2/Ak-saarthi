'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
import Badge, { riskProfileBadge } from '@/components/ui/badge';
import { getFullName, formatDate, formatCurrency } from '@/lib/utils';
import { User, CreditCard, Users as UsersIcon, Banknote, Shield, MapPin, Phone, Mail, Briefcase } from 'lucide-react';

export default function ClientProfilePage() {
  const { clients } = useApp();
  const [clientId, setClientId] = useState<string>('client-001');

  useEffect(() => {
    const id = localStorage.getItem('ak_logged_in_client_id');
    if (id) {
      setClientId(id);
    }
  }, []);

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex justify-between py-3 border-b border-slate-800/50">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-200">{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage and view your personal details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl font-bold text-blue-400 mb-4 border border-blue-500/20">
            {client.firstName[0]}{client.lastName[0]}
          </div>
          <h2 className="text-xl font-bold">{getFullName(client.firstName, client.lastName)}</h2>
          <p className="text-sm text-slate-400 mt-1">{client.occupation}</p>
          <div className="flex gap-2 mt-4">
            <Badge label={client.status} variant={client.status === 'active' ? 'success' : 'neutral'} />
            {riskProfileBadge(client.riskProfile)}
          </div>
        </div>

        {/* Contact & Personal */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2 mb-4">
            <User size={18} className="text-blue-400" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Email" value={client.email} />
            <InfoRow label="Phone" value={client.phone} />
            {client.alternatePhone && <InfoRow label="Alt Phone" value={client.alternatePhone} />}
            <InfoRow label="Date of Birth" value={formatDate(client.dob)} />
            <InfoRow label="Gender" value={client.gender.charAt(0).toUpperCase() + client.gender.slice(1)} />
            <InfoRow label="Marital Status" value={client.maritalStatus.charAt(0).toUpperCase() + client.maritalStatus.slice(1)} />
            <InfoRow label="Employer" value={client.employer} />
            <InfoRow label="Annual Income" value={formatCurrency(client.annualIncome)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        {/* Identity & Address */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-blue-400" />
              Identity Details
            </h3>
            <InfoRow label="PAN Number" value={client.pan} />
            <InfoRow label="Aadhaar Number" value={client.aadhaar} />
            {client.passport && <InfoRow label="Passport" value={client.passport} />}
            {client.drivingLicense && <InfoRow label="Driving License" value={client.drivingLicense} />}
          </div>

          <div className="pt-2">
            <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-blue-400" />
              Address Details
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{client.address}</p>
            <p className="text-sm text-slate-400 mt-1">{client.city}, {client.state} - {client.pincode}</p>
          </div>
        </div>

        {/* Family Members */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2 mb-4">
            <UsersIcon size={18} className="text-blue-400" />
            Family Members & Nominees
          </h3>
          {client.family.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No family members registered.</p>
          ) : (
            <div className="space-y-3">
              {client.family.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800/50">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.relation.charAt(0).toUpperCase() + m.relation.slice(1)}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {m.dob && <p>{formatDate(m.dob)}</p>}
                    {m.phone && <p className="mt-0.5">{m.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
