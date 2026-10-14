import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { CommunityIssue } from '../../types/index.ts';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Skeleton } from '../ui/Skeleton.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface IssuesRegistryPageProps {
  onNavigate: (path: string) => void;
  onOpenReport: () => void;
}

export const IssuesRegistryPage: React.FC<IssuesRegistryPageProps> = ({
  onNavigate,
  onOpenReport,
}) => {
  const { t, language } = useI18n();

  // SEO Page Meta
  usePageMeta({
    title: language === 'ne'
      ? 'सामुदायिक समस्याहरूको दर्ता सूची | नव युवा क्लब नेपाल'
      : 'Community Issues Registry | Nawa Yuwa Club Nepal',
    description: language === 'ne'
      ? 'नागरिकहरूद्वारा दर्ता गरिएका र युवा स्वयंसेवकहरूद्वारा प्रमाणित टोल-टोलका समस्याहरूको प्रत्यक्ष अनुगमन र समाधान ट्रयाकर।'
      : 'Public tracker for neighborhood civic challenges reported by citizens and verified by youth volunteers across Nepal.',
    canonicalPath: '/issues',
  });

  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getIssues();
      setIssues(data);
    } catch (err: any) {
      console.error('Error fetching community issues:', err);
      setError(err?.message || 'Failed to load community issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filter Categories & Locations derived from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    issues.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set).sort();
  }, [issues]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    issues.forEach(i => {
      if (i.district) set.add(i.district);
      else if (i.location) {
        const parts = i.location.split(',');
        const last = parts[parts.length - 1].trim();
        if (last) set.add(last);
      }
    });
    return Array.from(set).sort();
  }, [issues]);

  const statuses = ['Reported', 'Under Review', 'Verified', 'In Progress', 'Resolved'];

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchSearch = searchQuery.trim() === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.ward && issue.ward.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = !selectedCategory || issue.category === selectedCategory;
      const matchStatus = !selectedStatus || issue.status === selectedStatus;
      const matchLocation = !selectedLocation ||
        issue.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        (issue.district && issue.district.toLowerCase().includes(selectedLocation.toLowerCase()));

      return matchSearch && matchCategory && matchStatus && matchLocation;
    });
  }, [issues, searchQuery, selectedCategory, selectedStatus, selectedLocation]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== '' || selectedStatus !== '' || selectedLocation !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedLocation('');
  };

  // Status Counts
  const resolvedCount = useMemo(() => issues.filter(i => i.status === 'Resolved').length, [issues]);
  const inProgressCount = useMemo(() => issues.filter(i => i.status === 'In Progress').length, [issues]);
  const underReviewCount = useMemo(() => issues.filter(i => i.status === 'Under Review' || i.status === 'Verified' || i.status === 'Reported').length, [issues]);

  return (
    <div className="py-8 sm:py-12 bg-[var(--color-background)]">
      <PageContainer>
        {/* Header */}
        <PageHeader
          title={t('issuesTitle')}
          description={t('issuesDescription')}
          breadcrumbs={[
            { label: t('navHome'), href: '/' },
            { label: t('navIssues'), current: true },
          ]}
          onNavigateBreadcrumb={onNavigate}
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={onOpenReport}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              {t('reportCommunityIssue')}
            </Button>
          }
        />

        {/* Quick Resolution Summary Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-foreground)]">
                {resolvedCount}
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                {language === 'ne' ? 'समाधान भएका समस्या' : 'Resolved Issues'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-foreground)]">
                {inProgressCount}
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                {language === 'ne' ? 'कारबाही प्रगतिमा रहेका' : 'Currently In Progress'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-foreground)]">
                {underReviewCount}
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                {language === 'ne' ? 'प्रमाणीकरण तथा समीक्षा चरणमा' : 'Under Field Verification'}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <section aria-labelledby="issues-filter-heading" className="mb-8">
          <h2 id="issues-filter-heading" className="sr-only">
            Filter Community Issues
          </h2>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchIssuesPlaceholder')}
                  aria-label={t('searchIssuesPlaceholder')}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label={t('filterByCategory')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label={t('filterByStatus')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{t('allStatuses')}</option>
                  {statuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Location filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  aria-label={t('labelLocation')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{language === 'ne' ? 'सबै जिल्ला / स्थान' : 'All Districts / Locations'}</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter tags & Reset */}
            <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border-subtle)] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" />
                <span>
                  {language === 'ne'
                    ? `जम्मा ${filteredIssues.length} समस्याहरू फेला परे`
                    : `Showing ${filteredIssues.length} of ${issues.length} reported issues`}
                </span>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  {language === 'ne' ? 'सबै फिल्टर हटाउनुहोस्' : 'Clear all filters'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <ErrorState
            title={language === 'ne' ? 'समस्याहरू लोड हुन सकेन' : 'Unable to load issues'}
            description={error}
            onRetry={fetchIssues}
          />
        ) : filteredIssues.length === 0 ? (
          <EmptyState
            title={language === 'ne' ? 'कुनै समस्या फेला परेन' : 'No issues found'}
            description={
              hasActiveFilters
                ? (language === 'ne' ? 'तपाईंको छनोट अनुसार कुनै समस्या भेटिएन। कृपया फिल्टरहरू परिवर्तन गर्नुहोस्।' : 'No issues match your current filters. Try adjusting or clearing search filters.')
                : (language === 'ne' ? 'अहिले कुनै सार्वजनिक समस्या दर्ता भएको छैन। नयाँ समस्या रिपोर्ट गर्नुहोस्।' : 'No community issues currently reported. Be the first to report an issue in your neighborhood.')
            }
            actionLabel={hasActiveFilters ? (language === 'ne' ? 'फिल्टरहरू रिसेट गर्नुहोस्' : 'Reset Filters') : t('reportCommunityIssue')}
            onAction={hasActiveFilters ? handleClearFilters : onOpenReport}
          />
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onNavigate(`/issues/${issue.id}`)}
                className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  {/* Category, Location, and Date */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--color-muted)]">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                      {issue.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      {issue.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {issue.reportedDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="type-h3 font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                    {issue.title}
                  </h3>

                  {/* Description Preview */}
                  <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Status & CTA Arrow */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-border-subtle)]">
                  <StatusBadge status={issue.status} />
                  <div className="flex items-center text-xs font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                    <span className="hidden sm:inline mr-1">{language === 'ne' ? 'विवरण' : 'Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
};
