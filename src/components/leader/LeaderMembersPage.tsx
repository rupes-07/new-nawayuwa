import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Clock,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Award,
  Trash2,
  UserCheck,
  RefreshCw,
  Building,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { LeaderMemberItem, LeaderMembersResponse, LeaderContext } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface LeaderMembersPageProps {
  context: LeaderContext;
  onNavigate: (path: string) => void;
}

export const LeaderMembersPage: React.FC<LeaderMembersPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<LeaderMembersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wingFilter, setWingFilter] = useState<string>('all');

  // Selected member for action
  const [selectedMember, setSelectedMember] = useState<LeaderMemberItem | null>(null);

  // Assign Wing Dialog State
  const [isAssignWingOpen, setIsAssignWingOpen] = useState(false);
  const [newWing, setNewWing] = useState('');
  const [isUpdatingWing, setIsUpdatingWing] = useState(false);

  // Confirm Destructive Action Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'suspend' | 'activate' | 'remove';
    member: LeaderMemberItem | null;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: 'suspend',
    member: null,
    isDestructive: true,
  });
  const [isActionExecuting, setIsActionExecuting] = useState(false);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getLeaderMembers();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch chapter members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAssignWing = (member: LeaderMemberItem) => {
    setSelectedMember(member);
    setNewWing(member.clubWing);
    setIsAssignWingOpen(true);
  };

  const handleSaveWing = async () => {
    if (!selectedMember || !newWing) return;
    try {
      setIsUpdatingWing(true);
      await api.executeLeaderMemberAction(selectedMember.id, 'assign_wing', { newWing });
      setIsAssignWingOpen(false);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to update member wing');
    } finally {
      setIsUpdatingWing(false);
    }
  };

  const promptConfirmAction = (member: LeaderMemberItem, action: 'suspend' | 'activate' | 'remove') => {
    if (action === 'remove') {
      setConfirmDialog({
        isOpen: true,
        title: `Remove ${member.name}?`,
        message: `Are you sure you want to permanently remove ${member.name} (${member.membershipId}) from the chapter roster? This action is irreversible.`,
        action: 'remove',
        member,
        isDestructive: true,
      });
    } else if (action === 'suspend') {
      setConfirmDialog({
        isOpen: true,
        title: `Suspend Membership for ${member.name}?`,
        message: `This will temporarily pause active membership, volunteer assignment, and voting privileges for ${member.name}.`,
        action: 'suspend',
        member,
        isDestructive: true,
      });
    } else if (action === 'activate') {
      setConfirmDialog({
        isOpen: true,
        title: `Re-activate ${member.name}?`,
        message: `Restore active volunteer status and chapter privileges for ${member.name}.`,
        action: 'activate',
        member,
        isDestructive: false,
      });
    }
  };

  const handleConfirmAction = async () => {
    const { member, action } = confirmDialog;
    if (!member) return;

    try {
      setIsActionExecuting(true);
      await api.executeLeaderMemberAction(member.id, action);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to execute member action');
    } finally {
      setIsActionExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Retrieving chapter membership roster and server permissions...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-[var(--color-danger)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
          Unable to Load Chapter Members
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchMembers}>
          Try Again
        </Button>
      </div>
    );
  }

  // Filter members based on user search and filters
  const filteredMembers = data.members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.ward && member.ward.includes(searchQuery));

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesWing = wingFilter === 'all' || member.clubWing === wingFilter;

    return matchesSearch && matchesStatus && matchesWing;
  });

  const availableWings = Array.from(new Set(data.members.map((m) => m.clubWing)));

  return (
    <div className="space-y-6">
      {/* Header & Permissions Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">
            Chapter Members Directory
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Displaying permitted member details for <strong className="text-[var(--color-foreground)]">{data.chapter.name}</strong> based on server authorization.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" size="md">
            Total Roster: {data.members.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/leader/promotions')}
            leftIcon={<Award className="w-4 h-4 text-amber-500" />}
          >
            Manage Promotions
          </Button>
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
            placeholder="Search by name, ID, or ward..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Wing Filter */}
          <select
            value={wingFilter}
            onChange={(e) => setWingFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer max-w-[180px] truncate"
          >
            <option value="all">All Wings</option>
            {availableWings.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          // Actions strictly determined from server allowedActions!
          const canAssignWing = member.allowedActions.includes('assign_wing');
          const canSuspend = member.allowedActions.includes('suspend') && member.status === 'active';
          const canActivate = member.allowedActions.includes('activate') && member.status !== 'active';
          const canRemove = member.allowedActions.includes('remove') && data.capabilities.canRemoveMembers;
          const canViewContact = member.allowedActions.includes('view_contact');

          return (
            <div
              key={member.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[var(--color-border-subtle)] transition"
            >
              <div>
                {/* Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border)] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm sm:text-base text-[var(--color-foreground)] truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] font-mono">
                        {member.membershipId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      member.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : member.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Badges / Wing & Rank */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  <Badge variant="primary" size="sm">
                    {member.clubWing}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {member.currentRank}
                  </Badge>
                  {member.ward && (
                    <Badge variant="default" size="sm">
                      Ward {member.ward}
                    </Badge>
                  )}
                </div>

                {/* Permitted Contact Info */}
                {canViewContact && (
                  <div className="space-y-1 mb-4 text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Field Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-muted)]/70 p-2.5 rounded-xl mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--color-muted)] uppercase font-semibold block">
                      Volunteer Hours
                    </span>
                    <span className="font-bold text-[var(--color-foreground)]">
                      {member.volunteerHours} hours
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-muted)] uppercase font-semibold block">
                      Attendance Rate
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {member.attendanceRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer strictly based on server permissions */}
              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {canAssignWing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAssignWing(member)}
                    >
                      Assign Wing
                    </Button>
                  )}

                  {canSuspend && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => promptConfirmAction(member, 'suspend')}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      Suspend
                    </Button>
                  )}

                  {canActivate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => promptConfirmAction(member, 'activate')}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Activate
                    </Button>
                  )}
                </div>

                {canRemove && (
                  <button
                    type="button"
                    onClick={() => promptConfirmAction(member, 'remove')}
                    title="Remove member (requires confirmation)"
                    className="touch-target p-1.5 text-[var(--color-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                    aria-label={`Remove ${member.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
          <Users className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2" />
          <h3 className="font-bold text-base text-[var(--color-foreground)]">
            No members match your criteria
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Try adjusting your search query or filters.
          </p>
        </div>
      )}

      {/* Assign Wing Modal */}
      {selectedMember && (
        <Dialog
          isOpen={isAssignWingOpen}
          onClose={() => setIsAssignWingOpen(false)}
          title={`Assign Wing: ${selectedMember.name}`}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[var(--color-muted)]">
              Select the active club wing for member <strong>{selectedMember.name}</strong> ({selectedMember.membershipId}).
            </p>

            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1">
                Chapter Wing
              </label>
              <select
                value={newWing}
                onChange={(e) => setNewWing(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
              >
                <option value="Environment & Climate Action">Environment & Climate Action</option>
                <option value="Disaster Relief & First Aid">Disaster Relief & First Aid</option>
                <option value="Youth Education & Literacy">Youth Education & Literacy</option>
                <option value="Sports & Wellness Wing">Sports & Wellness Wing</option>
                <option value="Cultural & Social Wing">Cultural & Social Wing</option>
                <option value="Civic Problem Solving Cell">Civic Problem Solving Cell</option>
                <option value="Bardaghat Chapter Executive">Bardaghat Chapter Executive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAssignWingOpen(false)}
                disabled={isUpdatingWing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveWing}
                isLoading={isUpdatingWing}
              >
                Confirm Wing Assignment
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Confirmation Dialog for Destructive / Status Actions */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        isLoading={isActionExecuting}
        confirmLabel={
          confirmDialog.action === 'remove'
            ? 'Yes, Remove Member'
            : confirmDialog.action === 'suspend'
            ? 'Yes, Suspend'
            : 'Reactivate Member'
        }
      />
    </div>
  );
};
