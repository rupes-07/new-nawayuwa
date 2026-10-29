import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Calendar,
  Send,
  MessageSquare,
  Search,
  ChevronRight,
  Filter,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { CommunityIssue, LeaderIssuesResponse, LeaderContext } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface LeaderIssuesPageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

export const LeaderIssuesPage: React.FC<LeaderIssuesPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<LeaderIssuesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Review issue modal
  const [selectedIssue, setSelectedIssue] = useState<CommunityIssue | null>(null);

  // Status change state
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Field Note state
  const [fieldNote, setFieldNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Confirmation for marking Resolved
  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getLeaderIssues();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch chapter issues');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleOpenReview = (issue: CommunityIssue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setStatusNote('');
    setFieldNote('');
  };

  const handleUpdateStatus = async (statusToSet?: string) => {
    if (!selectedIssue) return;
    const targetStatus = statusToSet || newStatus;

    if (targetStatus === 'Resolved' && !resolveConfirmOpen && statusToSet !== 'Resolved') {
      setResolveConfirmOpen(true);
      return;
    }

    try {
      setIsUpdatingStatus(true);
      await api.updateLeaderIssueStatus(selectedIssue.id, targetStatus, statusNote);
      await fetchIssues();

      // Update selected issue locally
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              status: targetStatus as any,
              timeline: [
                ...(prev.timeline || []),
                {
                  step: targetStatus,
                  title: `Status changed to ${targetStatus}`,
                  description: statusNote || 'Updated by Chapter Leadership.',
                  date: new Date().toISOString().split('T')[0],
                  completed: true,
                },
              ],
            }
          : null
      );
      setStatusNote('');
      setResolveConfirmOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update issue status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddFieldNote = async () => {
    if (!selectedIssue || !fieldNote.trim()) return;

    try {
      setIsAddingNote(true);
      await api.addLeaderIssueNote(selectedIssue.id, fieldNote.trim());
      await fetchIssues();

      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              timeline: [
                ...(prev.timeline || []),
                {
                  step: 'Field Update',
                  title: 'Chapter Action Note',
                  description: fieldNote.trim(),
                  date: new Date().toISOString().split('T')[0],
                  completed: true,
                },
              ],
            }
          : null
      );
      setFieldNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to add action note');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Loading chapter community issues and verification logs...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-[var(--color-danger)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
          Unable to Load Chapter Issues
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchIssues}>
          Try Again
        </Button>
      </div>
    );
  }

  // Filter issues
  const filteredIssues = data.issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.ward && issue.ward.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(data.issues.map((i) => i.category)));

  // Permissions from server
  const canUpdateStatus = data.capabilities.canUpdateIssueStatus && data.allowedActions.includes('issue:update_status');
  const canAddNote = data.capabilities.canAddIssueNotes && data.allowedActions.includes('issue:add_note');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            Chapter Community Issues
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Review, verify, and resolve neighborhood problems in <strong className="text-[var(--color-foreground)]">{data.chapter.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="md">
            {filteredIssues.length} issues in jurisdiction
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by keyword, ward, or location..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {data.statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs hover:border-[var(--color-border-subtle)] transition flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            onClick={() => handleOpenReview(issue)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <StatusBadge status={issue.status} size="sm" />
                <Badge variant="primary" size="sm">
                  {issue.category}
                </Badge>
                {issue.ward && (
                  <Badge variant="default" size="sm">
                    {issue.ward}
                  </Badge>
                )}
                <span className="text-[11px] text-[var(--color-muted)] font-mono">
                  #{issue.id}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[var(--color-foreground)] mb-1">
                {issue.title}
              </h3>

              <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-2 leading-relaxed">
                {issue.description}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-[var(--color-muted)] flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  {issue.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Reported: {issue.reportedDate}
                </span>
                {issue.reportedBy && (
                  <>
                    <span>•</span>
                    <span>By: {issue.reportedBy}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenReview(issue);
                }}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Review & Update
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <AlertCircle className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2" />
          <h3 className="font-bold text-base text-[var(--color-foreground)]">
            No issues match current filters
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Try clearing search queries or switching status filter.
          </p>
        </div>
      )}

      {/* Review & Update Issue Dialog */}
      {selectedIssue && (
        <Dialog
          isOpen={Boolean(selectedIssue)}
          onClose={() => setSelectedIssue(null)}
          title={`Review Issue #${selectedIssue.id}`}
          size="lg"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header / Meta */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={selectedIssue.status} size="md" />
                <Badge variant="primary" size="sm">
                  {selectedIssue.category}
                </Badge>
                {selectedIssue.ward && (
                  <Badge variant="default" size="sm">
                    {selectedIssue.ward}
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
                {selectedIssue.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedIssue.location}
                </span>
                <span>•</span>
                <span>Reported: {selectedIssue.reportedDate}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[var(--color-surface-muted)]/70 p-4 rounded-xl text-xs text-[var(--color-foreground)] leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--color-muted)] block mb-1">
                Community Report Description
              </span>
              {selectedIssue.description}
            </div>

            {/* Server-Controlled Status Update Section */}
            {canUpdateStatus ? (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                    Authorized Status Update
                  </h4>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    Permitted action from server
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                    >
                      {data.statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1">
                      Status Change Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Ward engineer site visit completed"
                      className="w-full px-3 py-2 text-xs bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus()}
                    isLoading={isUpdatingStatus}
                    disabled={newStatus === selectedIssue.status && !statusNote.trim()}
                  >
                    Save Status Update
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs">
                Status modification for this record is restricted by server authorization policy.
              </div>
            )}

            {/* Field Action Note Section */}
            {canAddNote && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[var(--color-secondary)]" />
                  Append Field Progress Note
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fieldNote}
                    onChange={(e) => setFieldNote(e.target.value)}
                    placeholder="Log volunteer team dispatch, materials purchased, or government meeting..."
                    className="flex-1 px-3 py-2 text-xs bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFieldNote();
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddFieldNote}
                    isLoading={isAddingNote}
                    disabled={!fieldNote.trim()}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-3">
                Progress & Verification Timeline
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-[var(--color-border)]">
                {(selectedIssue.timeline || []).map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div
                      className={`w-3 h-3 rounded-full absolute -left-[7px] top-1 border-2 border-[var(--color-surface)] ${
                        step.completed ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
                      }`}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--color-foreground)]">
                        {step.title}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        {step.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Confirmation Dialog for Resolving Issue */}
      <ConfirmDialog
        isOpen={resolveConfirmOpen}
        onClose={() => setResolveConfirmOpen(false)}
        onConfirm={() => handleUpdateStatus('Resolved')}
        title="Mark Issue as Resolved?"
        message={`Are you sure you want to mark "${selectedIssue?.title}" as officially Resolved? This signifies the community problem has been physically verified as resolved.`}
        confirmLabel="Confirm Resolution"
        isLoading={isUpdatingStatus}
      />
    </div>
  );
};
