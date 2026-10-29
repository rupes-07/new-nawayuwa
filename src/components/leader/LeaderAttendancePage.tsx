import React, { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  HelpCircle,
  Search,
  Calendar,
  MapPin,
  RefreshCw,
  AlertCircle,
  Save,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type {
  LeaderAttendanceData,
  AttendanceRecord,
  AttendanceSession,
  LeaderContext,
} from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';

export interface LeaderAttendancePageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

export const LeaderAttendancePage: React.FC<LeaderAttendancePageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<LeaderAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Session
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  // Working records state
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const fetchAttendance = async (sessionId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getLeaderAttendance(sessionId);
      setData(res);
      setSelectedSessionId(res.activeSessionId);
      setRecords(res.records);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance register');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleSelectSession = async (sessId: string) => {
    setSelectedSessionId(sessId);
    await fetchAttendance(sessId);
  };

  const handleStatusChange = (
    memberId: string,
    newStatus: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.memberId === memberId) {
          const hours =
            newStatus === 'present'
              ? currentSession?.targetHours || 4
              : newStatus === 'late'
              ? Math.round((currentSession?.targetHours || 4) * 0.75)
              : 0;

          return {
            ...r,
            status: newStatus,
            hoursAwarded: hours,
            checkInTime:
              newStatus === 'present' || newStatus === 'late'
                ? r.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
          };
        }
        return r;
      })
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'present',
        hoursAwarded: currentSession?.targetHours || 4,
        checkInTime: r.checkInTime || '08:00 AM',
      }))
    );
  };

  const handleClearAll = () => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'absent',
        hoursAwarded: 0,
        checkInTime: undefined,
      }))
    );
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId || !data) return;

    try {
      setIsSaving(true);
      setSaveSuccessMsg(null);
      await api.markLeaderAttendance(
        selectedSessionId,
        records.map((r) => ({
          memberId: r.memberId,
          status: r.status,
          notes: r.notes,
        }))
      );
      setSaveSuccessMsg('Attendance records successfully saved to chapter audit registry!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
      await fetchAttendance(selectedSessionId);
    } catch (err: any) {
      alert(err.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Loading chapter attendance sessions and roster...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
        <AlertCircle className="w-10 h-10 text-[var(--color-danger)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
          Unable to Load Attendance
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchAttendance()}>
          Try Again
        </Button>
      </div>
    );
  }

  const currentSession = data.sessions.find((s) => s.id === selectedSessionId) || data.sessions[0];

  const presentCount = records.filter((r) => r.status === 'present').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const excusedCount = records.filter((r) => r.status === 'excused').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const totalRostered = records.length;
  const attendanceRate = totalRostered > 0 ? Math.round(((presentCount + lateCount) / totalRostered) * 100) : 0;

  const filteredRecords = records.filter(
    (r) =>
      r.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.clubWing && r.clubWing.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            Mobile Attendance Register
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Log verified member attendance for field volunteering, projects, and meetings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {context.chapter.name}
          </Badge>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Session Selector Cards */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] block">
          Select Event / Project Session
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.sessions.map((sess) => {
            const isSelected = sess.id === currentSession?.id;
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => handleSelectSession(sess.id)}
                className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]/20 shadow-xs'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-subtle)] bg-[var(--color-surface)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge variant={sess.type === 'project' ? 'primary' : 'secondary'} size="sm">
                      {sess.type.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-[var(--color-muted)] font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sess.date}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-foreground)] line-clamp-2 leading-tight">
                    {sess.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                  <span>{sess.targetHours} Hours Credit</span>
                  <span className="font-bold text-[var(--color-foreground)]">
                    {sess.totalPresent}/{sess.totalExpected} Present
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Mobile Attendance Metrics Bar */}
      {currentSession && (
        <div className="sticky top-16 z-30 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] block">
                Session Roster
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--color-foreground)]">
                  {presentCount + lateCount}/{totalRostered}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ({attendanceRate}%)
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-[var(--color-border)] hidden sm:block" />

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {presentCount} Present
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {lateCount} Late
              </span>
              <span className="flex items-center gap-1 font-semibold text-sky-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                {excusedCount} Excused
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                {absentCount} Absent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              className="text-xs shrink-0"
            >
              All Present
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs shrink-0 text-[var(--color-muted)]"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAttendance}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="shrink-0"
            >
              Save Register
            </Button>
          </div>
        </div>
      )}

      {/* Member Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter attendees by name, ID, or wing..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-xs"
        />
      </div>

      {/* Mobile-Friendly Touch-Optimized Attendance Cards */}
      <div className="space-y-3">
        {filteredRecords.map((record) => {
          const isPresent = record.status === 'present';
          const isLate = record.status === 'late';
          const isExcused = record.status === 'excused';
          const isAbsent = record.status === 'absent';

          return (
            <div
              key={record.memberId}
              className={`p-4 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                isPresent
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : isLate
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                  : isExcused
                  ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              }`}
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    record.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={record.memberName}
                  className="w-11 h-11 rounded-xl object-cover border border-[var(--color-border)] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-[var(--color-foreground)] truncate">
                      {record.memberName}
                    </h4>
                    <span className="text-xs font-mono text-[var(--color-muted)]">
                      {record.membershipId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] mt-0.5">
                    <span>{record.clubWing || 'General'}</span>
                    <span>•</span>
                    <span className="font-bold text-[var(--color-foreground)]">
                      +{record.hoursAwarded} hrs earned
                    </span>
                    {record.checkInTime && (
                      <>
                        <span>•</span>
                        <span>{record.checkInTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Touch-Friendly Status Selection Buttons (>=44px touch-target) */}
              <div
                role="group"
                aria-label={`Attendance status for ${record.memberName}`}
                className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border-subtle)]"
              >
                {/* Present Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(record.memberId, 'present')}
                  className={`touch-target flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                    isPresent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-emerald-700 hover:bg-emerald-100'
                  }`}
                  aria-pressed={isPresent}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Present</span>
                </button>

                {/* Late Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(record.memberId, 'late')}
                  className={`touch-target flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                    isLate
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-amber-700 hover:bg-amber-100'
                  }`}
                  aria-pressed={isLate}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Late</span>
                </button>

                {/* Excused Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(record.memberId, 'excused')}
                  className={`touch-target flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                    isExcused
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-sky-700 hover:bg-sky-100'
                  }`}
                  aria-pressed={isExcused}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Excused</span>
                </button>

                {/* Absent Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(record.memberId, 'absent')}
                  className={`touch-target flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                    isAbsent
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-rose-700 hover:bg-rose-100'
                  }`}
                  aria-pressed={isAbsent}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <Users className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2" />
          <h3 className="font-bold text-base text-[var(--color-foreground)]">
            No attendees match search query
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Try searching by first or last name or membership ID.
          </p>
        </div>
      )}

      {/* Floating Save Button on Mobile */}
      <div className="sm:hidden fixed bottom-18 left-4 right-4 z-40">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSaveAttendance}
          isLoading={isSaving}
          leftIcon={<Save className="w-5 h-5" />}
          className="w-full shadow-lg"
        >
          Save Attendance ({presentCount + lateCount} Present)
        </Button>
      </div>
    </div>
  );
};
