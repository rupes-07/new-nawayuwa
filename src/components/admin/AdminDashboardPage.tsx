import React, { useEffect, useState } from 'react';
import {
  Building2,
  FolderGit2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  CheckCircle2,
  RefreshCw,
  Award,
  Sliders,
  History,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, AdminDashboardData } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';

export interface AdminDashboardPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform administration metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Retrieving live central platform telemetry & audit state...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl text-center">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-900 dark:text-red-200">Unable to Load Dashboard</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={loadDashboard}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Platform Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Central Operations Console
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Platform Governance & Executive Oversight
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoring {data.summary.totalChapters} chartered chapters across {data.summary.provincesCovered} provinces. Overseeing civic integrity, member advancement, and civic transparency for youth action in Nepal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/chapters')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Manage Chapters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/moderation')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Moderation Queue ({data.summary.moderationPending})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/audit')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Security Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Top Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chapters */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--color-primary)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Chapters Active
            </span>
            <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {data.summary.activeChapters}
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              / {data.summary.totalChapters} total ({data.summary.provincesCovered} Prov.)
            </span>
          </div>
          <button
            onClick={() => onNavigate('/admin/chapters')}
            className="mt-3 text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Review Chapter Charters <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Projects */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Civic Projects
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {data.summary.totalProjects}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {data.summary.activeProjects} In Progress
            </span>
          </div>
          <button
            onClick={() => onNavigate('/leader/projects/new')}
            className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Launch Project <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Civic Issues */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Ward Issues Tracked
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {data.summary.totalIssues}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              {data.summary.openIssues} Open / {data.summary.resolvedIssues} Resolved
            </span>
          </div>
          <button
            onClick={() => onNavigate('/issues')}
            className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Public Registry <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Moderation Queue */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Moderation Pending
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {data.summary.moderationPending}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              Action Required
            </span>
          </div>
          <button
            onClick={() => onNavigate('/admin/moderation')}
            className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open Moderation Queue <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Pending Central Actions (Priority items) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">
              Central Pending Actions
            </h3>
            <Badge variant="primary" size="sm">
              {data.pendingActions.length} Pending
            </Badge>
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            Server Authoritative Queue
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.pendingActions.map((action) => (
            <Card key={action.id} className="p-5 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      action.priority === 'urgent'
                        ? 'primary'
                        : action.priority === 'high'
                        ? 'secondary'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {action.priority.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-[var(--color-muted)] font-mono">
                    {action.type}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--color-foreground)] leading-snug">
                  {action.title}
                </h4>
                <p className="text-xs text-[var(--color-muted)] line-clamp-3">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {action.allowedActions.map((act) => (
                    <span
                      key={act}
                      className="text-[10px] bg-[var(--color-surface-muted)] text-[var(--color-muted)] px-1.5 py-0.5 rounded font-mono"
                    >
                      {act.split(':')[1] || act}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(action.route)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Chapters Summary & Moderation Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapters Overview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-[var(--color-foreground)]">
                Chartered Chapters Directory
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/chapters')}
            >
              View All ({data.chapters.length})
            </Button>
          </div>

          <div className="space-y-3">
            {data.chapters.slice(0, 4).map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-xl bg-[var(--color-surface-muted)]/60 border border-[var(--color-border)] flex items-center justify-between gap-3 hover:border-[var(--color-primary)] transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[var(--color-foreground)] truncate">
                      {ch.name}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        (ch as any).status === 'paused'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {(ch as any).status || 'active'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {ch.location} • Coord: {ch.coordinatorName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[var(--color-foreground)]">
                    {ch.projectsCompleted} Projects
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    {ch.issuesResolved} Issues Resolved
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Moderation Items Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-[var(--color-foreground)]">
                Moderation Queue
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/moderation')}
            >
              Review Queue ({data.moderationQueue.length})
            </Button>
          </div>

          <div className="space-y-3">
            {data.moderationQueue.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[var(--color-surface-muted)]/60 border border-[var(--color-border)] space-y-2 hover:border-rose-300 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.riskLevel === 'high' || item.riskLevel === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.riskLevel} risk
                    </span>
                    <h4 className="font-bold text-xs text-[var(--color-foreground)] truncate">
                      {item.targetTitle}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[var(--color-muted)] font-mono shrink-0">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 italic bg-[var(--color-surface)] p-2 rounded border border-[var(--color-border)]">
                  "{item.excerpt}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                  <span>Reported: {item.reportedReason}</span>
                  <span className="font-semibold text-[var(--color-foreground)]">by {item.reportedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Platform Activity & Audit Stream */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-[var(--color-foreground)]">
              Recent Platform Security & Administrative Activity
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/admin/audit')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Full Audit Registry
          </Button>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {data.recentActivity.slice(0, 6).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {log.action}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-foreground)]">
                    {log.resource}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      log.result === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {log.result}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  {log.details}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0 text-xs">
                <div className="font-medium text-[var(--color-foreground)]">
                  {log.actor.name} <span className="text-[11px] text-[var(--color-muted)]">({log.actor.identifier})</span>
                </div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
