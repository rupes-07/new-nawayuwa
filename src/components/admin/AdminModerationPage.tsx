import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  EyeOff,
  Trash2,
  UserX,
  Flag,
  RefreshCw,
  Search,
  Filter,
  MessageSquare,
  FileText,
  User,
  FolderGit2,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, AdminModerationResponse, ModerationItem } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface AdminModerationPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminModerationPage: React.FC<AdminModerationPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminModerationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'quarantined' | 'dismissed'>('pending');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
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

  const loadModeration = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminModeration();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch moderation queue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModeration();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Moderation Action Dispatcher
  const handleAction = (item: ModerationItem, action: string) => {
    if (action === 'delete_content') {
      setConfirmDialog({
        isOpen: true,
        title: `Delete Content Permanently: ${item.targetTitle}`,
        message: `Destructive Action: Are you sure you want to permanently delete this content? If this is an issue, it will be completely purged from public registries and databases.`,
        isDestructive: true,
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await api.executeAdminModerationAction(item.id, 'delete_content', 'Purged due to violation.');
            triggerToast(`Item "${item.targetTitle}" permanently deleted.`);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await loadModeration();
          } finally {
            setIsActionLoading(false);
          }
        },
      });
      return;
    }

    if (action === 'suspend_user') {
      setConfirmDialog({
        isOpen: true,
        title: `Suspend Account of: ${item.reportedBy}`,
        message: `Destructive Action: Suspending this account will revoke membership credentials and block them from submitting issues or registering for volunteer activities.`,
        isDestructive: true,
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await api.executeAdminModerationAction(item.id, 'suspend_user', 'Account suspended for policy violation.');
            triggerToast(`User account suspended.`);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await loadModeration();
          } finally {
            setIsActionLoading(false);
          }
        },
      });
      return;
    }

    if (action === 'quarantine_content') {
      setConfirmDialog({
        isOpen: true,
        title: `Quarantine Content: ${item.targetTitle}`,
        message: `This will immediately hide this content from public feeds and community registries while remaining archived for legal and investigation purposes.`,
        isDestructive: true,
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await api.executeAdminModerationAction(item.id, 'quarantine_content');
            triggerToast(`Content quarantined from public feeds.`);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await loadModeration();
          } finally {
            setIsActionLoading(false);
          }
        },
      });
      return;
    }

    // Dismiss flag / Approve content / Warn user
    executeDirectAction(item.id, action);
  };

  const executeDirectAction = async (itemId: string, action: string) => {
    try {
      setIsActionLoading(true);
      await api.executeAdminModerationAction(itemId, action);
      triggerToast(action === 'dismiss_flag' ? 'Flag dismissed. Content verified.' : 'Action applied.');
      await loadModeration();
    } catch (err: any) {
      alert(err.message || 'Failed to apply moderation action');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredItems = (data?.queue || []).filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (riskFilter !== 'all' && item.riskLevel !== riskFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.targetTitle.toLowerCase().includes(q) ||
        item.reportedReason.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.reportedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getItemIcon = (type: ModerationItem['itemType']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'member_profile':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'project_submission':
        return <FolderGit2 className="w-4 h-4 text-emerald-500" />;
      case 'issue':
      default:
        return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

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
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            Content Integrity & Moderation Queue
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Review reported ward issues, comments, spam, or hostile submissions. Actions strictly governed by server capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadModeration} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Status Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 text-center border-l-4 border-l-amber-500">
          <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">Pending Review</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {data?.counts.pending ?? 0}
          </span>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-rose-500">
          <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">Quarantined</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {data?.counts.quarantined ?? 0}
          </span>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-emerald-500">
          <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">Dismissed / Safe</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {data?.counts.dismissed ?? 0}
          </span>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-slate-500">
          <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">Total Reports</span>
          <span className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            {data?.counts.total ?? 0}
          </span>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search report reason, target text, or reporter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="quarantined">Quarantined</option>
            <option value="dismissed">Dismissed</option>
          </select>

          {/* Risk Select */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </Card>

      {/* Moderation Items Feed */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--color-muted)]">Scanning moderation queue...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-[var(--color-foreground)]">No items in this queue</h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            The community reports queue is clean. All civic discussions and issue reports comply with guidelines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isCritical = item.riskLevel === 'critical' || item.riskLevel === 'high';
            const isQuarantined = item.status === 'quarantined';
            const isPending = item.status === 'pending';

            // Server capabilities check
            const canManage = context.capabilities.canManageModeration;
            const canQuarantine = context.capabilities.canQuarantineContent;
            const canDelete = context.capabilities.canDeleteContent;

            return (
              <Card key={item.id} className="p-5 sm:p-6 hover:shadow-md transition">
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1.5 rounded-lg bg-[var(--color-surface-muted)]">
                        {getItemIcon(item.itemType)}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
                        {item.itemType}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[var(--color-foreground)]">
                        {item.targetTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.riskLevel} Risk
                      </span>
                      <span className="text-xs text-[var(--color-muted)] font-mono font-medium">
                        Status: {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Flag Reason & Meta */}
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] flex-wrap">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5" />
                      {item.reportedReason}
                    </span>
                    <span>•</span>
                    <span>Reported by: <strong className="text-[var(--color-foreground)]">{item.reportedBy}</strong></span>
                    <span>•</span>
                    <span>{new Date(item.reportedDate).toLocaleDateString()}</span>
                  </div>

                  {/* Excerpt Box */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-foreground)] leading-relaxed italic">
                    "{item.excerpt}"
                  </div>

                  {/* Server Capabilities Action Bar */}
                  <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[var(--color-muted)]">
                        Server Allowed:
                      </span>
                      {item.allowedActions.map((act) => (
                        <span key={act} className="text-[10px] font-mono bg-[var(--color-surface-muted)] text-[var(--color-muted)] px-1.5 py-0.5 rounded">
                          {act}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Approve / Dismiss Flag */}
                      {canManage && isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(item, 'dismiss_flag')}
                          leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                        >
                          Dismiss Flag
                        </Button>
                      )}

                      {/* Quarantine Content */}
                      {canQuarantine && !isQuarantined && item.status !== 'deleted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(item, 'quarantine_content')}
                          leftIcon={<EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                          className="text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        >
                          Quarantine
                        </Button>
                      )}

                      {/* Warn Author */}
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(item, 'warn_user')}
                          leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-indigo-500" />}
                        >
                          Warn Author
                        </Button>
                      )}

                      {/* Suspend User */}
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(item, 'suspend_user')}
                          leftIcon={<UserX className="w-3.5 h-3.5 text-rose-500" />}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          Suspend User
                        </Button>
                      )}

                      {/* Delete Content Permanently */}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(item, 'delete_content')}
                          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                          className="text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
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
        confirmLabel="Confirm Moderation Action"
      />
    </div>
  );
};
