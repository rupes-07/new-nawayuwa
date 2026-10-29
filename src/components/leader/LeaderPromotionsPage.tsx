import React, { useEffect, useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Star,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type {
  PromotionCandidate,
  LeaderPromotionsResponse,
  LeaderContext,
} from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface LeaderPromotionsPageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

export const LeaderPromotionsPage: React.FC<LeaderPromotionsPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<LeaderPromotionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nomination Dialog State
  const [isNominateOpen, setIsNominateOpen] = useState(false);
  const [nominateMemberId, setNominateMemberId] = useState('');
  const [nominateRank, setNominateRank] = useState('');
  const [nominateReason, setNominateReason] = useState('');
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);

  // Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    candidate: PromotionCandidate | null;
    action: 'approve' | 'reject';
    title: string;
    message: string;
  }>({
    isOpen: false,
    candidate: null,
    action: 'approve',
    title: '',
    message: '',
  });
  const [isActionExecuting, setIsActionExecuting] = useState(false);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getLeaderPromotions();
      setData(res);
      if (res.rankHierarchy && res.rankHierarchy.length > 0) {
        setNominateRank(res.rankHierarchy[1] || 'Active Volunteer');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch promotion registry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const promptAction = (candidate: PromotionCandidate, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setConfirmModal({
        isOpen: true,
        candidate,
        action: 'approve',
        title: `Approve Promotion for ${candidate.memberName}?`,
        message: `This will elevate ${candidate.memberName} from "${candidate.currentRank}" to "${candidate.proposedRank}". Their permissions, field responsibilities, and badge credentials will be updated immediately.`,
      });
    } else {
      setConfirmModal({
        isOpen: true,
        candidate,
        action: 'reject',
        title: `Decline Promotion Nomination?`,
        message: `Are you sure you want to decline the promotion nomination for ${candidate.memberName}? This will close the current nomination ticket.`,
      });
    }
  };

  const handleConfirmAction = async () => {
    const { candidate, action } = confirmModal;
    if (!candidate) return;

    try {
      setIsActionExecuting(true);
      await api.executeLeaderPromotionAction(candidate.id, action);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      await fetchPromotions();
    } catch (err: any) {
      alert(err.message || 'Failed to execute promotion action');
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handleNominateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominateMemberId || !nominateRank) {
      alert('Please select a member and proposed rank');
      return;
    }

    try {
      setIsSubmittingNomination(true);
      await api.executeLeaderPromotionAction('new', 'nominate', {
        memberId: nominateMemberId,
        proposedRank: nominateRank,
        reason: nominateReason,
      });
      setIsNominateOpen(false);
      setNominateReason('');
      await fetchPromotions();
    } catch (err: any) {
      alert(err.message || 'Failed to nominate member');
    } finally {
      setIsSubmittingNomination(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Loading chapter promotion candidates and rank hierarchy...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
        <AlertCircle className="w-10 h-10 text-[var(--color-danger)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
          Unable to Load Promotions
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchPromotions}>
          Try Again
        </Button>
      </div>
    );
  }

  // Server authorization consumed strictly!
  const canNominate = data.capabilities.canManagePromotions && data.allowedActions.includes('promotion:nominate');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            Member Promotions & Leadership Ranks
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Review merit-based advancements, volunteer hour milestones, and chapter nominations.
          </p>
        </div>

        {canNominate && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNominateOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Nominate Member
          </Button>
        )}
      </div>

      {/* Rank Hierarchy Pathway Reference */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
            Nawa Yuwa Civic Advancement Ladder
          </span>
          <Badge variant="outline" size="sm">
            Server Rank Policy
          </Badge>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {data.rankHierarchy.map((rank, idx) => (
            <React.Fragment key={rank}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-surface-muted)] text-xs font-bold text-[var(--color-foreground)] shrink-0 border border-[var(--color-border-subtle)]">
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-[10px] font-black">
                  {idx + 1}
                </span>
                <span>{rank}</span>
              </div>
              {idx < data.rankHierarchy.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Promotion Candidates List */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Active Promotion Nominations ({data.candidates.length})
        </h3>

        {data.candidates.map((candidate) => {
          // Strictly consume candidate-level allowedActions from server!
          const canApprove = candidate.allowedActions.includes('promotion:approve') && candidate.status === 'pending';
          const canReject = candidate.allowedActions.includes('promotion:reject') && candidate.status === 'pending';

          return (
            <div
              key={candidate.id}
              className={`p-5 rounded-2xl border transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                candidate.status === 'approved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : candidate.status === 'rejected'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              }`}
            >
              {/* Member & Proposed Rank Info */}
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={
                    candidate.avatar ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
                  }
                  alt={candidate.memberName}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[var(--color-border)] shrink-0 shadow-xs"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-base text-[var(--color-foreground)]">
                      {candidate.memberName}
                    </h4>
                    <span className="text-xs font-mono text-[var(--color-muted)]">
                      {candidate.membershipId}
                    </span>
                    <Badge
                      variant={
                        candidate.status === 'approved'
                          ? 'primary'
                          : candidate.status === 'rejected'
                          ? 'subtle'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {candidate.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Rank Transition Indicator */}
                  <div className="flex items-center gap-2 text-xs font-bold pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-muted)] border border-[var(--color-border-subtle)]">
                      {candidate.currentRank}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span className="px-2.5 py-0.5 rounded-lg bg-[var(--color-primary)] text-white shadow-xs">
                      {candidate.proposedRank}
                    </span>
                  </div>

                  {/* Verified Criteria Checklist */}
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] block">
                      Verified Criteria Satisfied:
                    </span>
                    <div className="flex flex-col gap-1">
                      {candidate.criteriaMet.map((crit, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--color-foreground)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nomination Meta */}
                  <p className="text-[11px] text-[var(--color-muted)] pt-1">
                    Nominated by <strong className="text-[var(--color-foreground)]">{candidate.nominatedBy}</strong> on {candidate.nominatedDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons strictly driven by server permissions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-[var(--color-border-subtle)] w-full md:w-auto justify-end">
                {canApprove && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => promptAction(candidate, 'approve')}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Approve Promotion
                  </Button>
                )}

                {canReject && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => promptAction(candidate, 'reject')}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Decline
                  </Button>
                )}

                {candidate.status === 'approved' && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    Promotion Finalized
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data.candidates.length === 0 && (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <Award className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2" />
          <h3 className="font-bold text-base text-[var(--color-foreground)]">
            No pending promotions in this chapter
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Eligible volunteers who have completed service hours will appear here.
          </p>
        </div>
      )}

      {/* Nominate Member Dialog */}
      <Dialog
        isOpen={isNominateOpen}
        onClose={() => setIsNominateOpen(false)}
        title="Nominate Chapter Member for Promotion"
        size="md"
      >
        <form onSubmit={handleNominateSubmit} className="space-y-4">
          <p className="text-xs text-[var(--color-muted)]">
            Submit a formal rank advancement recommendation based on verified field hours and project leadership.
          </p>

          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
              Select Chapter Member
            </label>
            <select
              value={nominateMemberId}
              onChange={(e) => setNominateMemberId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
              required
            >
              <option value="">-- Choose Member --</option>
              <option value="user-member">Pradeep Chaudhary (NYC-2022-118) • 42 hrs</option>
              <option value="user-member-2">Sita Devkota (NYC-2023-088) • 78 hrs</option>
              <option value="user-member-3">Rohan Shrestha (NYC-2023-112) • 142 hrs</option>
              <option value="user-member-4">Kripa Sharma (NYC-2024-031) • 54 hrs</option>
              <option value="user-member-5">Bikash Mahato (NYC-2024-095) • 18 hrs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
              Proposed Advancement Rank
            </label>
            <select
              value={nominateRank}
              onChange={(e) => setNominateRank(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
              required
            >
              {data.rankHierarchy.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
              Recommendation Notes & Field Evidence
            </label>
            <textarea
              rows={3}
              value={nominateReason}
              onChange={(e) => setNominateReason(e.target.value)}
              placeholder="e.g. Demonstrated exceptional initiative during monsoon drainage emergency..."
              className="w-full px-3 py-2 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsNominateOpen(false)}
              disabled={isSubmittingNomination}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingNomination}
            >
              Submit Nomination
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Destructive / Major Promotion Actions */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.action === 'approve' ? 'Yes, Approve Promotion' : 'Yes, Decline Nomination'}
        isDestructive={confirmModal.action === 'reject'}
        isLoading={isActionExecuting}
      />
    </div>
  );
};
