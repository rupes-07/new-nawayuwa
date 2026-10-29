import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Check,
  Building2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, AdminPromotionsResponse, PromotionCandidate } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface AdminPromotionsPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminPromotionsPage: React.FC<AdminPromotionsPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminPromotionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Destructive Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDestructive: false,
    onConfirm: async () => {},
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminPromotions();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch executive promotion records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = (cand: PromotionCandidate & { chapterName: string }) => {
    setConfirmDialog({
      isOpen: true,
      title: `Confirm Presidential Promotion: ${cand.memberName}`,
      message: `You are granting Central Executive approval for ${cand.memberName} to be promoted from "${cand.currentRank}" to "${cand.proposedRank}". This advancement will be written into the platform permanent ledger.`,
      isDestructive: false,
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await api.executeAdminPromotionAction(cand.id, 'approve');
          triggerToast(`Promotion approved for ${cand.memberName} to ${cand.proposedRank}.`);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await loadPromotions();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const handleReject = (cand: PromotionCandidate & { chapterName: string }) => {
    setConfirmDialog({
      isOpen: true,
      title: `Decline Promotion Nomination: ${cand.memberName}`,
      message: `Are you sure you want to decline the nomination of ${cand.memberName} for "${cand.proposedRank}"? The chapter leader will be notified of this determination.`,
      isDestructive: true,
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await api.executeAdminPromotionAction(cand.id, 'reject');
          triggerToast(`Promotion nomination declined for ${cand.memberName}.`);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await loadPromotions();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const handleRevoke = (cand: PromotionCandidate & { chapterName: string }) => {
    setConfirmDialog({
      isOpen: true,
      title: `Revoke Rank: ${cand.memberName}`,
      message: `Critical Action: This will revoke ${cand.memberName}'s rank back to Active Volunteer and reset their coordinator credentials. This is logged to security audit.`,
      isDestructive: true,
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await api.executeAdminPromotionAction(cand.id, 'revoke');
          triggerToast(`Rank revoked for ${cand.memberName}.`);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await loadPromotions();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const filteredCandidates = (data?.candidates || []).filter((cand) => {
    if (statusFilter !== 'all' && cand.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        cand.memberName.toLowerCase().includes(q) ||
        cand.membershipId.toLowerCase().includes(q) ||
        cand.proposedRank.toLowerCase().includes(q) ||
        cand.chapterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)] flex items-center gap-2">
            <Award className="w-6 h-6 text-[var(--color-primary)]" />
            Executive Promotions & Leadership Ranks
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Review merit-based nominations, verify community service hours, and grant central credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPromotions} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Rank Hierarchy Information Bar */}
      <Card className="p-4 bg-[var(--color-surface-muted)]/50 border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
          Official Platform Rank Progression
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-semibold">
          {data?.rankHierarchy.map((rank, i) => (
            <React.Fragment key={rank}>
              <span className="px-2.5 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] shrink-0">
                {rank}
              </span>
              {i < (data.rankHierarchy.length - 1) && (
                <span className="text-[var(--color-muted)] shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search candidate, membership ID, or chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--color-muted)]">Verifying candidate credentials...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
          <Award className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-[var(--color-foreground)]">No candidates in this view</h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">All leadership nominations are currently up to date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((cand) => {
            const isPending = cand.status === 'pending';
            const isApproved = cand.status === 'approved';
            const isRejected = cand.status === 'rejected';

            // Server actions allowance check
            const allowedActions = cand.allowedActions || [];
            const canApprove = context.capabilities.canApprovePromotions && allowedActions.includes('approve');
            const canReject = context.capabilities.canApprovePromotions && allowedActions.includes('reject');
            const canRevoke = context.capabilities.canRevokePromotions && allowedActions.includes('revoke');

            return (
              <Card key={cand.id} className="p-5 sm:p-6 hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        cand.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                      }
                      alt={cand.memberName}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[var(--color-border)] shadow-xs"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[var(--color-foreground)]">
                          {cand.memberName}
                        </h3>
                        <Badge variant="outline" size="sm" className="font-mono">
                          {cand.membershipId}
                        </Badge>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {cand.status}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {cand.chapterName} • Nominated by {cand.nominatedBy} on{' '}
                        {new Date(cand.nominatedDate).toLocaleDateString()}
                      </p>

                      {/* Rank Transition Indicator */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-[var(--color-muted)]">{cand.currentRank}</span>
                        <span className="font-black text-[var(--color-primary)]">→</span>
                        <span className="font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          {cand.proposedRank}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Criteria Met & Verification Stats */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--color-surface-muted)] text-center text-xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[var(--color-muted)]">
                        Hours
                      </div>
                      <div className="text-sm font-black text-[var(--color-foreground)]">
                        {cand.volunteerHours}h
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[var(--color-muted)]">
                        Attendance
                      </div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {cand.attendanceRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[var(--color-muted)]">
                        Projects
                      </div>
                      <div className="text-sm font-black text-[var(--color-foreground)]">
                        {cand.projectsCompleted}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar strictly conditioned on server allowedActions */}
                  <div className="flex items-center gap-2 self-start lg:self-center flex-wrap shrink-0">
                    {isPending && canApprove && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(cand)}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        Approve Rank
                      </Button>
                    )}

                    {isPending && canReject && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(cand)}
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Decline
                      </Button>
                    )}

                    {isApproved && canRevoke && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(cand)}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        Revoke Rank
                      </Button>
                    )}
                  </div>
                </div>

                {/* Criteria Tags */}
                {cand.criteriaMet && cand.criteriaMet.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-muted)]">
                      Verified Criteria:
                    </span>
                    {cand.criteriaMet.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800"
                      >
                        <Check className="w-3 h-3" />
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Destructive Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        isLoading={isActionLoading}
        confirmLabel="Confirm Determination"
      />
    </div>
  );
};
