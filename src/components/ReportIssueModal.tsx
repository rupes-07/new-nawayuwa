import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Send, MapPin, Tag } from 'lucide-react';
import { useI18n } from '../context/I18nContext.tsx';
import { api } from '../services/api.ts';
import { Button } from './ui/Button.tsx';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { locale, t } = useI18n();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water & Sanitation');
  const [province, setProvince] = useState('Madhesh Pradesh');
  const [district, setDistrict] = useState('Dhanusha');
  const [ward, setWard] = useState('4');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError(
        locale === 'ne'
          ? 'कृपया शीर्षक, स्थान र विवरण अनिवार्य रूपमा भर्नुहोस्।'
          : 'Please provide issue title, location, and description.'
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.reportIssue({
        title,
        category,
        location: `${location}, Ward ${ward}, ${district}, ${province}`,
        description,
        ward,
        reportedBy: isAnonymous
          ? locale === 'ne'
            ? 'गोप्य नागरिक'
            : 'Anonymous Citizen'
          : reportedBy.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setDescription('');
        setLocation('');
        setReportedBy('');
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit community issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="touch-target absolute top-4 right-4 p-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-surface-muted)] transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3
              id="report-modal-title"
              className="text-lg sm:text-xl font-bold text-[var(--color-foreground)]"
            >
              {locale === 'ne' ? 'सामुदायिक समस्या दर्ता गर्नुहोस्' : 'Report a Community Issue'}
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              {locale === 'ne'
                ? 'तपाईंको टोल वा वडाको समस्या दर्ता गरी पारदर्शी अनुगमन गर्नुहोस्।'
                : 'Report a local issue for grassroots follow-up with municipal wards.'}
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[var(--color-foreground)]">
              {locale === 'ne' ? 'समस्या सफलतापूर्वक दर्ता भयो!' : 'Issue Reported Successfully!'}
            </h4>
            <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
              {locale === 'ne'
                ? 'यो समस्या अब सार्वजनिक सूचीमा समावेश भएको छ र सम्बन्धित शाखाद्वारा अनुगमन गरिनेछ।'
                : 'This issue is now published on the public tracker for civic review and action.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {error && (
              <div className="p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                {locale === 'ne' ? 'समस्याको शीर्षक *' : 'Issue Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  locale === 'ne'
                    ? 'जस्तै: जनकपुर चौकमा खानेपानी पाइप फुट्यो'
                    : 'e.g. Broken water pipeline near Janakpurdham Chowk'
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                  {locale === 'ne' ? 'वर्ग / प्रकार' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
                >
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Safety & Lighting">Safety & Lighting</option>
                  <option value="Road Infrastructure">Road Infrastructure</option>
                  <option value="Agriculture & Water">Agriculture & Water</option>
                  <option value="Education & School">Education & School</option>
                  <option value="Public Health">Public Health</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                  {locale === 'ne' ? 'वडा नं.' : 'Ward No.'}
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. 4 or 16"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                  {locale === 'ne' ? 'प्रदेश' : 'Province'}
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
                >
                  <option value="Madhesh Pradesh">Madhesh Pradesh (मधेश)</option>
                  <option value="Lumbini Province">Lumbini Province (लुम्बिनी)</option>
                  <option value="Bagmati Province">Bagmati Province (बागमती)</option>
                  <option value="Gandaki Province">Gandaki Province (गण्डकी)</option>
                  <option value="Koshi Province">Koshi Province (कोशी)</option>
                  <option value="Karnali Province">Karnali Province (कर्णाली)</option>
                  <option value="Sudurpashchim Province">Sudurpashchim Province (सुदूरपश्चिम)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                  {locale === 'ne' ? 'जिल्ला' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Dhanusha, Nawalparasi, Parsa"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                {locale === 'ne' ? 'टोल वा स्थानको नाम *' : 'Specific Location / Landmark *'}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={locale === 'ne' ? 'जस्तै: अस्पताल मार्ग, जनकपुर' : 'e.g. Hospital Road, Near Post Office'}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-foreground)] mb-1">
                {locale === 'ne' ? 'विस्तृत विवरण *' : 'Detailed Description *'}
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  locale === 'ne'
                    ? 'समस्याको प्रभाव र के कस्तो सहयोग आवश्यक छ खुलाउनुहोस्...'
                    : 'Describe the issue, how many residents are affected, and what action is needed...'
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)] resize-none"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                />
                <span>{locale === 'ne' ? 'गोप्य रूपमा पठाउनुहोस्' : 'Report Anonymously'}</span>
              </label>

              {!isAnonymous && (
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder={locale === 'ne' ? 'तपाईंको नाम (ऐच्छिक)' : 'Your Name (Optional)'}
                  className="px-2.5 py-1 text-xs rounded bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] w-44"
                />
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
              <Button type="button" variant="ghost" onClick={onClose}>
                {t('actionCancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                <Send className="w-4 h-4 mr-1.5" />
                <span>{loading ? 'Submitting...' : locale === 'ne' ? 'पेश गर्नुहोस्' : 'Submit Issue'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
