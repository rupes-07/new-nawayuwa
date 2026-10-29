import React, { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  ClipboardCheck,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { LeaderDashboardData, LeaderContext } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Card } from '../ui/Card.tsx';

export interface LeaderDashboardPageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

export const LeaderDashboardPage: React.FC<LeaderDashboardPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<LeaderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getLeaderDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch chapter dashboard data');
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
          Loading chapter analytics and pending actions...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
        <AlertCircle className="w-10 h-10 text-[var(--color-danger)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
          Unable to Load Dashboard
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={loadDashboard}>
          Try Again
        </Button>
      </div>
    );
  }

  const { chapterActivity, pendingActions, members, projects, issues, recentActivity } = data;

  return (
    <div className="space-y-8">
      {/* 1. Chapter Activity Metric Cards */}
      <section aria-labelledby="chapter-activity-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="chapter-activity-heading" className="text-lg font-extrabold text-[var(--color-foreground)]">
              Chapter Activity & Performance
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Real-time server-verified field metrics for {data.chapter.name}
            </p>
          </div>
          <Badge variant="outline" size="sm">
            <TrendingUp className="w-3 h-3 mr-1 text-[var(--color-success)]" />
            Live Sync
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Members */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Members</span>
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {chapterActivity.totalMembers}
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Active Chapter Volunteers
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
              <FolderGit2 className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {chapterActivity.activeProjects}
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Ongoing Field Drives
            </div>
          </div>

          {/* Open Issues */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Open Issues</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {chapterActivity.openIssues}
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Under Review / In Progress
            </div>
          </div>

          {/* Resolved Issues */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-success)]">
              {chapterActivity.resolvedIssues}
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Verified Civic Solutions
            </div>
          </div>

          {/* Volunteer Hours */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Service Hours</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
              {chapterActivity.volunteerHoursLogged}
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Total Community Hours
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Attendance</span>
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {chapterActivity.averageAttendanceRate}%
            </div>
            <div className="text-[11px] text-[var(--color-muted)] mt-1">
              Roster Engagement Rate
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pending Actions (Server-Provided Tasks) */}
      <section aria-labelledby="pending-actions-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 id="pending-actions-heading" className="text-lg font-extrabold text-[var(--color-foreground)]">
              Pending Actions
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
              {pendingActions.length} Required
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)] hidden sm:block">
            Actions prioritized by server authorization policies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingActions.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition shadow-xs flex flex-col justify-between ${
                task.priority === 'urgent'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : task.priority === 'high'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      task.priority === 'urgent'
                        ? 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        : task.priority === 'high'
                        ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)]'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[var(--color-foreground)] mb-1">
                  {task.title}
                </h3>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-4">
                  {task.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--color-muted)]">
                  {task.allowedActions.length} permitted actions
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate(task.route)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Take Action
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Split Grid: Chapter Projects & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-foreground)]">
                Chapter Projects ({projects.length})
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Active civic and community initiatives
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/leader/projects/new')}
              leftIcon={<PlusCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
            >
              New Project
            </Button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-muted)]">
                    <img
                      src={proj.imageUrl}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-foreground)] truncate">
                        {proj.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {proj.date}
                      </span>
                      <span>•</span>
                      <span>{proj.participantsCount} Volunteers</span>
                    </div>
                  </div>
                </div>

                <Badge variant={proj.status === 'In Progress' ? 'secondary' : 'default'} size="sm">
                  {proj.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Issues */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-foreground)]">
                Reported Ward Issues ({issues.length})
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Local neighborhood problems under chapter tracking
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/leader/issues')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Review All
            </Button>
          </div>

          <div className="space-y-3">
            {issues.slice(0, 3).map((iss) => (
              <div
                key={iss.id}
                className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 transition flex items-center justify-between gap-3 cursor-pointer"
                onClick={() => onNavigate('/leader/issues')}
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[var(--color-foreground)] truncate">
                    {iss.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {iss.ward || 'Ward 16'}
                    </span>
                    <span>•</span>
                    <span>{iss.category}</span>
                  </div>
                </div>
                <StatusBadge status={iss.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Split Grid: Members Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapter Members Overview */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-foreground)]">
                Roster Members ({members.length})
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Permitted active volunteers and leads
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/leader/members')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Manage Roster
            </Button>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={m.name}
                    className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--color-foreground)] truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)] truncate">
                      {m.clubWing} • {m.membershipId}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[var(--color-foreground)]">
                    {m.volunteerHours} hrs
                  </span>
                  <span className="block text-[10px] text-[var(--color-muted)] font-medium">
                    {m.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chapter Activity Feed */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-foreground)]">
                Recent Field Activity
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Audit trail of coordinator and volunteer actions
              </p>
            </div>
            <Badge variant="outline" size="sm">
              Server Logged
            </Badge>
          </div>

          <div className="space-y-3.5">
            {recentActivity.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--color-border-subtle)]">
                  {act.type === 'issue' && <AlertCircle className="w-4 h-4" />}
                  {act.type === 'attendance' && <ClipboardCheck className="w-4 h-4 text-emerald-600" />}
                  {act.type === 'project' && <FolderGit2 className="w-4 h-4 text-[var(--color-secondary)]" />}
                  {act.type === 'promotion' && <Award className="w-4 h-4 text-amber-500" />}
                  {act.type === 'member' && <Users className="w-4 h-4 text-purple-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[var(--color-foreground)]">
                      {act.action}
                    </span>
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {new Date(act.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-relaxed">
                    {act.details}
                  </p>
                  <span className="text-[10px] text-[var(--color-muted)] font-medium">
                    By {act.performedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
