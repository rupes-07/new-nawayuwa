import React, { useEffect, useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, AdminAuditResponse, AdminAuditRecord } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { Dialog } from '../ui/Dialog.tsx';

export interface AdminAuditPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminAuditPage: React.FC<AdminAuditPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminAuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedResult, setSelectedResult] = useState('all');

  // Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<AdminAuditRecord | null>(null);

  const loadAudit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminAudit({
        action: selectedAction !== 'all' ? selectedAction : undefined,
        result: selectedResult !== 'all' ? selectedResult : undefined,
        search: search.trim() || undefined,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve security and audit ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, [selectedAction, selectedResult]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAudit();
  };

  // Export audit logs as sanitized JSON
  const handleExport = () => {
    if (!data?.records) return;
    const sanitizedData = data.records.map(r => ({
      auditId: r.id,
      actor: `${r.actor.name} (${r.actor.identifier})`,
      actorRole: r.actor.role,
      action: r.action,
      resource: r.resource,
      result: r.result,
      timestamp: r.date,
      details: r.details,
    }));

    const blob = new Blob([JSON.stringify(sanitizedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nawa-yuwa-audit-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)] flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" />
            Security & Platform Audit Registry
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Immutable log of administrative operations, moderation decisions, rank advancements, and chapter updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {context.capabilities.canExportAudit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Sanitized Log
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={loadAudit} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Data Privacy & Protection:</strong> All actor credentials and personal data are pseudonymized (e.g. NYC-PRESIDENT, NYC-MOD-01). No tokens, hashed passwords, or private user credentials are ever exposed in audit registries.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Strict Compliance v2.4
        </span>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search action, actor name, resource, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Action Type Filter */}
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
            >
              <option value="all">All Actions</option>
              {data?.actionTypes?.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>

            {/* Result Filter */}
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
            >
              <option value="all">All Results</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="DENIED">DENIED</option>
              <option value="FLAGGED">FLAGGED</option>
            </select>

            <Button variant="primary" size="sm" type="submit">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Audit Records Table / Feed */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--color-muted)]">Querying audit ledger...</p>
        </div>
      ) : !data?.records || data.records.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
          <History className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-[var(--color-foreground)]">No audit records match the criteria</h3>
          <p className="text-xs text-[var(--color-muted)] mt-1 mb-4">Try clearing filters or search keywords.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setSelectedAction('all'); setSelectedResult('all'); loadAudit(); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] text-[var(--color-muted)] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {data.records.map((record) => {
                  const isSuccess = record.result === 'SUCCESS';
                  const isDenied = record.result === 'DENIED';

                  return (
                    <tr key={record.id} className="hover:bg-[var(--color-surface-muted)]/50 transition">
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)] font-mono">
                        <div>{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-[10px]">
                          {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-[var(--color-foreground)]">
                          {record.actor.name}
                        </div>
                        <div className="text-[10px] text-[var(--color-muted)] font-mono">
                          {record.actor.identifier} ({record.actor.role})
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          {record.action}
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-[var(--color-foreground)] max-w-xs truncate">
                        {record.resource}
                      </td>

                      {/* Result */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isDenied
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {record.result}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3 text-[var(--color-muted)] max-w-sm truncate">
                        {record.details}
                      </td>

                      {/* Inspect */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="px-2.5 py-1 rounded bg-[var(--color-surface-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] font-semibold transition cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Inspect Record Modal */}
      <Dialog
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title="Audit Record Detail"
        size="md"
      >
        {selectedRecord && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-[var(--color-surface-muted)] space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)] uppercase">Audit ID:</span>
                <span className="font-bold text-[var(--color-foreground)]">{selectedRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)] uppercase">Timestamp:</span>
                <span className="text-[var(--color-foreground)]">{new Date(selectedRecord.date).toISOString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)] uppercase">Result:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedRecord.result}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--color-muted)] block">
                Actor Context
              </span>
              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="font-bold text-sm text-[var(--color-foreground)]">
                  {selectedRecord.actor.name}
                </div>
                <div className="text-[var(--color-muted)] mt-0.5">
                  Identifier: <span className="font-mono">{selectedRecord.actor.identifier}</span> | Role: <span className="font-mono">{selectedRecord.actor.role}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--color-muted)] block">
                Resource & Action Target
              </span>
              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {selectedRecord.action}
                </div>
                <div className="text-[var(--color-foreground)] font-medium">
                  {selectedRecord.resource}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--color-muted)] block">
                Action Description & Audit Notes
              </span>
              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] leading-relaxed text-[var(--color-foreground)]">
                {selectedRecord.details}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--color-border)]">
              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
