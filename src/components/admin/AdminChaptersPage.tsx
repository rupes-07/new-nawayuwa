import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Phone,
  User,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Archive,
  Edit3,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, AdminChaptersResponse, Chapter } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface AdminChaptersPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminChaptersPage: React.FC<AdminChaptersPageProps> = ({
  context,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminChaptersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Edit Chapter Modal State
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    coordinatorName: '',
    coordinatorContact: '',
    location: '',
    meetingSchedule: '',
    meetingPlace: '',
    shortDescription: '',
    about: '',
  });

  // Create Chapter Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    province: 'Lumbini Province',
    district: 'Nawalparasi West',
    location: '',
    coordinatorName: '',
    coordinatorContact: '',
    meetingSchedule: 'Every Saturday at 8:00 AM',
    meetingPlace: '',
    shortDescription: '',
  });

  // Confirmation Dialog State for destructive actions
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

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminChapters();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load chapters registry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Handle Edit Chapter submission
  const handleSaveEdit = async () => {
    if (!editingChapter) return;
    try {
      setIsActionLoading(true);
      await api.updateAdminChapter(editingChapter.id, editForm);
      triggerToast(`Chapter "${editForm.name}" updated successfully.`);
      setIsEditOpen(false);
      await loadChapters();
    } catch (err: any) {
      alert(err.message || 'Failed to update chapter');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Charter New Chapter
  const handleCreateChapter = async () => {
    if (!createForm.name || !createForm.location || !createForm.district) {
      alert('Please fill in Chapter Name, Location, and District');
      return;
    }
    try {
      setIsActionLoading(true);
      await api.createAdminChapter(createForm);
      triggerToast(`New Chapter "${createForm.name}" chartered successfully.`);
      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        province: 'Lumbini Province',
        district: 'Nawalparasi West',
        location: '',
        coordinatorName: '',
        coordinatorContact: '',
        meetingSchedule: 'Every Saturday at 8:00 AM',
        meetingPlace: '',
        shortDescription: '',
      });
      await loadChapters();
    } catch (err: any) {
      alert(err.message || 'Failed to charter chapter');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Chapter Status Action (pause, activate, archive)
  const handleChapterAction = (chapter: Chapter, action: 'pause' | 'activate' | 'archive') => {
    if (action === 'pause') {
      setConfirmDialog({
        isOpen: true,
        title: `Pause Chapter: ${chapter.name}`,
        message: `Are you sure you want to pause operations for ${chapter.name}? Active projects and issue escalation will be frozen until reactivated by central admin.`,
        isDestructive: true,
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await api.executeAdminChapterAction(chapter.id, 'pause');
            triggerToast(`Chapter "${chapter.name}" paused.`);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await loadChapters();
          } finally {
            setIsActionLoading(false);
          }
        },
      });
      return;
    }

    if (action === 'archive') {
      setConfirmDialog({
        isOpen: true,
        title: `Archive Chapter Charter: ${chapter.name}`,
        message: `This will mark ${chapter.name} as archived in historical archives. Members will no longer be able to log hours under this charter without re-authorization.`,
        isDestructive: true,
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await api.executeAdminChapterAction(chapter.id, 'archive');
            triggerToast(`Chapter "${chapter.name}" archived.`);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            await loadChapters();
          } finally {
            setIsActionLoading(false);
          }
        },
      });
      return;
    }

    // Activate
    executeActionDirectly(chapter.id, 'activate', `Chapter "${chapter.name}" re-activated.`);
  };

  const executeActionDirectly = async (chapterId: string, action: string, msg: string) => {
    try {
      setIsActionLoading(true);
      await api.executeAdminChapterAction(chapterId, action);
      triggerToast(msg);
      await loadChapters();
    } catch (err: any) {
      alert(err.message || `Failed to execute action ${action}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredChapters = (data?.chapters || []).filter((ch) => {
    if (selectedProvince !== 'all' && ch.province !== selectedProvince) return false;
    if (selectedStatus !== 'all' && (ch.status || 'active') !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ch.name.toLowerCase().includes(q) ||
        ch.location.toLowerCase().includes(q) ||
        ch.district.toLowerCase().includes(q) ||
        (ch.coordinatorName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
            Chapter Governance & Regional Charters
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Authorize, update, pause, or charter community youth chapters across Nepal.
          </p>
        </div>

        {/* Server capabilities gate: canCreateChapter */}
        {context.capabilities.canCreateChapter && (
          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Charter New Chapter
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search by chapter name, coordinator, district or municipality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Province Filter */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
          >
            <option value="all">All Provinces</option>
            {data?.provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>

          <Button variant="ghost" size="sm" onClick={loadChapters} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Chapters Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-sm text-[var(--color-muted)]">Loading chapter records...</p>
        </div>
      ) : filteredChapters.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
          <Building2 className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-[var(--color-foreground)]">No chapters match your criteria</h3>
          <p className="text-xs text-[var(--color-muted)] mt-1 mb-4">Try clearing the search query or status filter.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setSelectedProvince('all'); setSelectedStatus('all'); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => {
            const isPaused = chapter.status === 'paused';
            const isArchived = chapter.status === 'archived';

            return (
              <Card key={chapter.id} className="p-5 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-4">
                  {/* Top Bar: Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-[var(--color-foreground)] leading-snug">
                          {chapter.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
                        {chapter.location} ({chapter.district})
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isPaused
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : isArchived
                          ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {chapter.status || 'active'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-muted)] line-clamp-2">
                    {chapter.shortDescription}
                  </p>

                  {/* Chapter Key Data Points */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[var(--color-surface-muted)] text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">
                        Coordinator
                      </span>
                      <span className="font-semibold text-[var(--color-foreground)] truncate block">
                        {chapter.coordinatorName}
                      </span>
                      <span className="text-[11px] text-[var(--color-muted)] block">
                        {chapter.coordinatorContact}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block">
                        Activity
                      </span>
                      <span className="font-semibold text-[var(--color-foreground)] block">
                        {chapter.projectsCompleted} Projects
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        {chapter.issuesResolved} Issues Resolved
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--color-muted)] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-[var(--color-muted)]" />
                      <span>{chapter.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-muted)]" />
                      <span className="truncate">{chapter.meetingPlace}</span>
                    </div>
                  </div>
                </div>

                {/* Capability-driven Actions Bar */}
                <div className="mt-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {/* Public page link */}
                    <button
                      onClick={() => onNavigate(`/chapters/${chapter.slug}`)}
                      className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] text-xs flex items-center gap-1 cursor-pointer font-medium"
                      title="View Public Chapter Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit: server capability canUpdateChapter */}
                    {context.capabilities.canUpdateChapter && (
                      <button
                        onClick={() => {
                          setEditingChapter(chapter);
                          setEditForm({
                            name: chapter.name || '',
                            coordinatorName: chapter.coordinatorName || '',
                            coordinatorContact: chapter.coordinatorContact || '',
                            location: chapter.location || '',
                            meetingSchedule: chapter.meetingSchedule || '',
                            meetingPlace: chapter.meetingPlace || '',
                            shortDescription: chapter.shortDescription || '',
                            about: chapter.about || '',
                          });
                          setIsEditOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[var(--color-surface-muted)] hover:bg-[var(--color-border)] text-xs text-[var(--color-foreground)] flex items-center gap-1 font-semibold cursor-pointer"
                        title="Edit Chapter Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Pause / Activate action */}
                    {context.capabilities.canPauseChapter && !isPaused && !isArchived && (
                      <button
                        onClick={() => handleChapterAction(chapter, 'pause')}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        title="Pause Chapter Operations"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}

                    {context.capabilities.canPauseChapter && isPaused && (
                      <button
                        onClick={() => handleChapterAction(chapter, 'activate')}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        title="Re-activate Chapter Charter"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Activate</span>
                      </button>
                    )}

                    {/* Archive action: destructive */}
                    {!isArchived && (
                      <button
                        onClick={() => handleChapterAction(chapter, 'archive')}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs cursor-pointer"
                        title="Archive Chapter"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Chapter Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Chapter: ${editingChapter?.name}`}
        size="md"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Chapter Official Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Coordinator Name
              </label>
              <input
                type="text"
                value={editForm.coordinatorName}
                onChange={(e) => setEditForm(prev => ({ ...prev, coordinatorName: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Coordinator Phone
              </label>
              <input
                type="text"
                value={editForm.coordinatorContact}
                onChange={(e) => setEditForm(prev => ({ ...prev, coordinatorContact: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Location (Municipality/Ward)
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Meeting Schedule
              </label>
              <input
                type="text"
                value={editForm.meetingSchedule}
                onChange={(e) => setEditForm(prev => ({ ...prev, meetingSchedule: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Meeting Place / Assembly Hall
            </label>
            <input
              type="text"
              value={editForm.meetingPlace}
              onChange={(e) => setEditForm(prev => ({ ...prev, meetingPlace: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Short Civic Mission
            </label>
            <textarea
              rows={2}
              value={editForm.shortDescription}
              onChange={(e) => setEditForm(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} isLoading={isActionLoading}>
              Save Chapter Details
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Charter New Chapter Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Charter New Youth Community Chapter"
        size="md"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Chapter Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Butwal Chapter"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Province *
              </label>
              <select
                value={createForm.province}
                onChange={(e) => setCreateForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <option value="Lumbini Province">Lumbini Province</option>
                <option value="Madhesh Pradesh">Madhesh Pradesh</option>
                <option value="Bagmati Province">Bagmati Province</option>
                <option value="Gandaki Province">Gandaki Province</option>
                <option value="Koshi Province">Koshi Province</option>
                <option value="Karnali Province">Karnali Province</option>
                <option value="Sudurpashchim Province">Sudurpashchim Province</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                District *
              </label>
              <input
                type="text"
                placeholder="e.g. Rupandehi"
                value={createForm.district}
                onChange={(e) => setCreateForm(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Location (Municipality/Ward) *
              </label>
              <input
                type="text"
                placeholder="e.g. Butwal Sub-Metropolitan, Ward 4"
                value={createForm.location}
                onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Coordinator Name
              </label>
              <input
                type="text"
                placeholder="Full name of chapter lead"
                value={createForm.coordinatorName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, coordinatorName: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Coordinator Contact
              </label>
              <input
                type="text"
                placeholder="+977-98XXXXXXXX"
                value={createForm.coordinatorContact}
                onChange={(e) => setCreateForm(prev => ({ ...prev, coordinatorContact: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Meeting Place
              </label>
              <input
                type="text"
                placeholder="Community Building / Ward Office"
                value={createForm.meetingPlace}
                onChange={(e) => setCreateForm(prev => ({ ...prev, meetingPlace: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateChapter} isLoading={isActionLoading}>
              Issue Chapter Charter
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Destructive Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        isLoading={isActionLoading}
        confirmLabel="Confirm Action"
      />
    </div>
  );
};
