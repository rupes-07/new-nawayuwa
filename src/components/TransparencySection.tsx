import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck, Download, Filter } from 'lucide-react';
import type { FinancialRecord } from '../types/index.ts';
import { api } from '../services/api.ts';

export const TransparencySection: React.FC = () => {
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, currency: 'NPR' });
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
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
    fetchFinances();
  }, []);

  const filteredRecords = finances.filter((rec) => {
    if (filterType === 'all') return true;
    return rec.type === filterType;
  });

  const formatNPR = (val: number) => {
    return `Rs. ${val.toLocaleString('en-IN')}`;
  };

  const handleExportCSV = () => {
    const headers = 'Receipt,Date,Type,Category,Title,Donor/Vendor,Amount\n';
    const rows = finances
      .map(
        (f) =>
          `"${f.receiptNumber}","${f.date}","${f.type}","${f.category}","${f.title}","${f.donorOrVendor || ''}","${f.amount}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nawa_Yuwa_Club_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="transparency" className="py-16 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Accountability</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Financial Transparency & Donor Ledger
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Every single rupee contributed by sponsors, diaspora patrons, and community members is publicly logged and audited.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Ledger (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Treasury Balance</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2">
              {formatNPR(summary.balance)}
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              Verified Club Bank Account • Lumbini Bank
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Inflow / Donations</span>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">
              {formatNPR(summary.totalIncome)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Sponsorships, Membership Dues & Gifts</div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Community Outflow</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
              {formatNPR(summary.totalExpense)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Ground Upkeep, Gear & Flood Welfare</div>
          </div>
        </div>

        {/* Ledger Filter Tabs */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Transactions:</span>
          </div>

          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex space-x-1">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                  filterType === t
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Entries' : t === 'income' ? 'Income / Gifts' : 'Expenses'}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Description / Entity</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Loading financial ledger...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No records found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-amber-400">
                        {item.receiptNumber}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{item.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.type === 'income'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white text-xs sm:text-sm">{item.title}</div>
                        {item.donorOrVendor && (
                          <div className="text-[11px] text-slate-400">
                            Partner: {item.donorOrVendor}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm whitespace-nowrap">
                        <span className={item.type === 'income' ? 'text-emerald-400' : 'text-amber-400'}>
                          {item.type === 'income' ? '+' : '-'} {formatNPR(item.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Audited</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
