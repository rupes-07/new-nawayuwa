import React, { useEffect, useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  Calendar,
  Lock,
  Plus,
  X,
  FileCheck,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { AdminContext, PlatformConfig } from '../../types/index.ts';
import { Card } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';

export interface AdminConfigPageProps {
  context: AdminContext;
  onNavigate: (path: string) => void;
}

export const AdminConfigPage: React.FC<AdminConfigPageProps> = ({
  context,
  onNavigate,
}) => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState('');

  // Confirmation for critical setting changes
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getAdminConfig();
      setConfig(res.config);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSave = () => {
    if (!config) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Platform Configuration Updates',
      message: 'This will modify core operational rules, volunteer advancement thresholds, and automated content moderation triggers across all chapters. This action is permanently recorded in the audit trail.',
      onConfirm: async () => {
        setIsSaving(true);
        try {
          await api.updateAdminConfig(config);
          triggerToast('Platform configuration successfully updated.');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await loadConfig();
        } catch (err: any) {
          alert(err.message || 'Failed to update platform settings');
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim() || !config) return;
    const kw = newKeyword.trim().toLowerCase();
    if (!config.flaggingKeywords.includes(kw)) {
      setConfig({
        ...config,
        flaggingKeywords: [...config.flaggingKeywords, kw],
      });
    }
    setNewKeyword('');
  };

  const removeKeyword = (kw: string) => {
    if (!config) return;
    setConfig({
      ...config,
      flaggingKeywords: config.flaggingKeywords.filter(k => k !== kw),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-sm text-[var(--color-muted)]">Loading verified platform configuration...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl text-center">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
        <h3 className="font-bold text-red-900 dark:text-red-200">Unable to Load Settings</h3>
        <p className="text-xs text-red-700 dark:text-red-300 mt-1 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={loadConfig}>
          Retry
        </Button>
      </div>
    );
  }

  const canManage = context.capabilities.canManageConfig;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-foreground)] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[var(--color-primary)]" />
            Platform Governance & System Configuration
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Configure institutional identities, civic verification thresholds, and automated safeguarding rules.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Configuration
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Institutional Identity */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <Building className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-bold text-base text-[var(--color-foreground)]">
              Institutional Identity
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Organization Official Name
              </label>
              <input
                type="text"
                disabled={!canManage}
                value={config.organizationName}
                onChange={(e) => setConfig({ ...config, organizationName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Public Helpline
                </label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={config.helplinePhone}
                  onChange={(e) => setConfig({ ...config, helplinePhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Fiscal Year (B.S.)
                </label>
                <input
                  type="text"
                  disabled={!canManage}
                  value={config.currentFiscalYear}
                  onChange={(e) => setConfig({ ...config, currentFiscalYear: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Central Support Email
              </label>
              <input
                type="email"
                disabled={!canManage}
                value={config.supportEmail}
                onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Leadership Advancement Thresholds */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <FileCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base text-[var(--color-foreground)]">
              Leadership Advancement Thresholds
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Min. Volunteer Hours for Squad Lead
                </label>
                <span className="text-sm font-black text-[var(--color-foreground)] font-mono">
                  {config.minVolunteerHoursForSquadLead} hrs
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                disabled={!canManage}
                value={config.minVolunteerHoursForSquadLead}
                onChange={(e) => setConfig({ ...config, minVolunteerHoursForSquadLead: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
              <p className="text-[11px] text-[var(--color-muted)] mt-1">
                Verified community service required before a member is eligible to coordinate a village squad.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Min. Volunteer Hours for Chapter Coordinator
                </label>
                <span className="text-sm font-black text-[var(--color-foreground)] font-mono">
                  {config.minVolunteerHoursForCoordinator} hrs
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                disabled={!canManage}
                value={config.minVolunteerHoursForCoordinator}
                onChange={(e) => setConfig({ ...config, minVolunteerHoursForCoordinator: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
              <p className="text-[11px] text-[var(--color-muted)] mt-1">
                Strict threshold required for Chapter Lead or Wing Coordinator elevation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Max Photo / Evidence Upload Size (MB)
              </label>
              <input
                type="number"
                disabled={!canManage}
                value={config.maxUploadFileSizeMb}
                onChange={(e) => setConfig({ ...config, maxUploadFileSizeMb: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Operational & Safety Policy Toggles */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <Lock className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-[var(--color-foreground)]">
              Operational & Safeguarding Policies
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle 1 */}
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <div>
                <span className="font-bold text-[var(--color-foreground)] block">
                  Auto-Verify Trusted Reporters
                </span>
                <span className="text-[var(--color-muted)] block mt-0.5">
                  Reports from members with &gt; 5 resolved issues bypass the initial verification queue.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!canManage}
                checked={config.autoVerifyTrustedReporters}
                onChange={(e) => setConfig({ ...config, autoVerifyTrustedReporters: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
            </label>

            {/* Toggle 2 */}
            <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-[var(--color-border)] pt-3">
              <div>
                <span className="font-bold text-[var(--color-foreground)] block">
                  Require Mobile OTP for Issue Submissions
                </span>
                <span className="text-[var(--color-muted)] block mt-0.5">
                  Guarantees local reporter phone authenticity before creating a civic ticket.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!canManage}
                checked={config.requirePhoneOtpForReporting}
                onChange={(e) => setConfig({ ...config, requirePhoneOtpForReporting: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
            </label>

            {/* Toggle 3 */}
            <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-[var(--color-border)] pt-3">
              <div>
                <span className="font-bold text-[var(--color-foreground)] block">
                  Public Financial Transparency Ledger
                </span>
                <span className="text-[var(--color-muted)] block mt-0.5">
                  Publish club income, ward donations, and project expenses live on the public transparency tab.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!canManage}
                checked={config.publicFinancialTransparency}
                onChange={(e) => setConfig({ ...config, publicFinancialTransparency: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
            </label>

            {/* Toggle 4 */}
            <label className="flex items-start justify-between gap-3 cursor-pointer border-t border-[var(--color-border)] pt-3">
              <div>
                <span className="font-bold text-[var(--color-foreground)] block">
                  Allow Direct Member Applications
                </span>
                <span className="text-[var(--color-muted)] block mt-0.5">
                  Permit prospective youth volunteers to submit self-membership forms via public chapter pages.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!canManage}
                checked={config.allowDirectMemberApplications}
                onChange={(e) => setConfig({ ...config, allowDirectMemberApplications: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
            </label>
          </div>
        </Card>

        {/* Section 4: Automated Moderation Flagging Keywords */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base text-[var(--color-foreground)]">
              Automated Content Moderation Keywords
            </h3>
          </div>

          <p className="text-xs text-[var(--color-muted)]">
            Submissions or community comments containing any of these keywords are automatically flagged into the moderation queue for review before public broadcast.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              disabled={!canManage}
              placeholder="Add keyword or trigger phrase..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={addKeyword}
              disabled={!canManage || !newKeyword.trim()}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {config.flaggingKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--color-surface-muted)] text-[var(--color-foreground)] border border-[var(--color-border)]"
              >
                <span>{kw}</span>
                {canManage && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-[var(--color-muted)] hover:text-red-500 cursor-pointer"
                    title={`Remove keyword ${kw}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Save Button Footer */}
      {canManage && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Configuration Updates
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={false}
        isLoading={isSaving}
        confirmLabel="Apply Configuration"
      />
    </div>
  );
};
