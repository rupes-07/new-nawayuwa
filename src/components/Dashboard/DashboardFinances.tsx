import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Download, TrendingUp, TrendingDown, ShieldCheck, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { FinancialRecord } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardFinances: React.FC = () => {
  const { user } = useAuth();
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, currency: 'NPR' });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: 'Donation' as FinancialRecord['category'],
    title: '',
    amount: '',
    donorOrVendor: '',
    notes: '',
  });

  const loadFinances = async () => {
    try {
      setLoading(true);
      const data = await api.getFinances();
      setFinances(data.records);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinances();
  }, []);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addFinanceRecord({
        ...formData,
        amount: Number(formData.amount),
      });
      setShowAddModal(false);
      setFormData({
        type: 'income',
        category: 'Donation',
        title: '',
        amount: '',
        donorOrVendor: '',
        notes: '',
      });
      loadFinances();
    } catch (err: any) {
      alert(err.message || 'Failed to record entry');
    }
  };

  const isTreasurerOrAdmin = user?.role === 'admin' || user?.role === 'treasurer';

  const formatNPR = (val: number) => `Rs. ${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <span>Club Treasury & Financial Audit</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain public transparency for club sponsorships, grants, match equipment, and community welfare.
          </p>
        </div>

        {isTreasurerOrAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Transaction</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Current Balance</span>
          <div className="text-2xl font-black text-white mt-1">{formatNPR(summary.balance)}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Lumbini Bank Main Account</div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Recorded Revenue</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{formatNPR(summary.totalIncome)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Sponsorships & Donations</div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Expenditures</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{formatNPR(summary.totalExpense)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pitch Maintenance & Kits</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recorded Transactions Log
          </span>
          <span className="text-xs text-slate-500">{finances.length} Total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Title / Counterparty</th>
                <th className="py-3 px-4">Logged By</th>
                <th className="py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : finances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                finances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {item.receiptNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.type === 'income'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.title}</div>
                      {item.donorOrVendor && (
                        <div className="text-[10px] text-slate-400">{item.donorOrVendor}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.recordedBy}</td>
                    <td className="py-3 px-4 font-bold text-sm whitespace-nowrap">
                      <span className={item.type === 'income' ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.type === 'income' ? '+' : '-'} {formatNPR(item.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to record entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Record Financial Transaction</h3>

            <form onSubmit={handleRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="income">Income / Inflow (+)</option>
                    <option value="expense">Expense / Outflow (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Membership Dues">Membership Dues</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Donation">Donation</option>
                    <option value="Tournament Prize">Tournament Prize</option>
                    <option value="Ground Maintenance">Ground Maintenance</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Social Welfare">Social Welfare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transaction Title / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grass seeds & pitch watering"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (NPR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="15000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Counterparty / Donor</label>
                  <input
                    type="text"
                    placeholder="e.g. Local Patron / Vendor"
                    value={formData.donorOrVendor}
                    onChange={(e) => setFormData({ ...formData, donorOrVendor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Verified by finance secretary"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition mt-2"
              >
                Log to Public Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
