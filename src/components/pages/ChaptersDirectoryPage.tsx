import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Building2,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  Filter,
  X,
  Compass,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { Chapter } from '../../types/index.ts';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { CardSkeleton } from '../ui/Skeleton.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface ChaptersDirectoryPageProps {
  onNavigate: (path: string) => void;
  onOpenJoin: () => void;
}

export const ChaptersDirectoryPage: React.FC<ChaptersDirectoryPageProps> = ({
  onNavigate,
  onOpenJoin,
}) => {
  const { t, language } = useI18n();

  // SEO Page Meta
  usePageMeta({
    title: language === 'ne'
      ? 'स्थानीय शाखाहरू निर्देशिका | नव युवा क्लब नेपाल'
      : 'Local Chapters Directory | Nawa Yuwa Club Nepal',
    description: language === 'ne'
      ? 'नेपालभर स्वयंसेवा, सामुदायिक समस्या समाधान र नागरिक सशक्तीकरणमा सक्रिय स्थानीय युवा शाखाहरू खोज्नुहोस्।'
      : 'Explore active youth chapters driving grassroots volunteerism, local problem-solving, and civic action across Nepal.',
    canonicalPath: '/chapters',
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedLocalLevel, setSelectedLocalLevel] = useState('');

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getChapters();
      setChapters(data);
    } catch (err: any) {
      console.error('Error fetching chapters:', err);
      setError(err?.message || 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // Filter options derived from data
  const provinces = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach(c => {
      if (c.province) set.add(c.province);
    });
    return Array.from(set).sort();
  }, [chapters]);

  const districts = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach(c => {
      if (!selectedProvince || c.province === selectedProvince) {
        if (c.district) set.add(c.district);
      }
    });
    return Array.from(set).sort();
  }, [chapters, selectedProvince]);

  const localLevels = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach(c => {
      const matchProv = !selectedProvince || c.province === selectedProvince;
      const matchDist = !selectedDistrict || c.district === selectedDistrict;
      if (matchProv && matchDist && c.localLevel) {
        set.add(c.localLevel);
      }
    });
    return Array.from(set).sort();
  }, [chapters, selectedProvince, selectedDistrict]);

  // Filtered chapters list
  const filteredChapters = useMemo(() => {
    return chapters.filter(c => {
      const matchSearch = searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.localLevel && c.localLevel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProv = !selectedProvince || c.province === selectedProvince;
      const matchDist = !selectedDistrict || c.district === selectedDistrict;
      const matchLocal = !selectedLocalLevel || c.localLevel === selectedLocalLevel;

      return matchSearch && matchProv && matchDist && matchLocal;
    });
  }, [chapters, searchQuery, selectedProvince, selectedDistrict, selectedLocalLevel]);

  const hasActiveFilters = searchQuery !== '' || selectedProvince !== '' || selectedDistrict !== '' || selectedLocalLevel !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedLocalLevel('');
  };

  return (
    <div className="py-8 sm:py-12 bg-[var(--color-background)]">
      <PageContainer>
        {/* Page Header */}
        <PageHeader
          title={t('chaptersTitle')}
          description={t('chaptersDescription')}
          breadcrumbs={[
            { label: t('navHome'), href: '/' },
            { label: t('navChapters'), current: true },
          ]}
          onNavigateBreadcrumb={onNavigate}
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={onOpenJoin}
              leftIcon={<Users className="w-4 h-4" />}
            >
              {language === 'ne' ? 'नयाँ शाखा सुरु गर्नुहोस्' : 'Start a New Chapter'}
            </Button>
          }
        />

        {/* Filters & Search Control Bar */}
        <section aria-labelledby="chapter-filters-heading" className="mb-8">
          <h2 id="chapter-filters-heading" className="sr-only">
            Filter Chapters
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
                  placeholder={t('searchChaptersPlaceholder')}
                  aria-label={t('searchChaptersPlaceholder')}
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

              {/* Province filter */}
              <div>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                    setSelectedLocalLevel('');
                  }}
                  aria-label={t('filterByProvince')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{t('allProvinces')}</option>
                  {provinces.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              {/* District filter */}
              <div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedLocalLevel('');
                  }}
                  aria-label={t('filterByDistrict')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{t('allDistricts')}</option>
                  {districts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Local level / Municipality */}
              <div>
                <select
                  value={selectedLocalLevel}
                  onChange={(e) => setSelectedLocalLevel(e.target.value)}
                  aria-label={t('filterByLocalLevel')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                >
                  <option value="">{t('allLocalLevels')}</option>
                  {localLevels.map(loc => (
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
                    ? `जम्मा ${filteredChapters.length} शाखाहरू भेटिए`
                    : `Showing ${filteredChapters.length} of ${chapters.length} chapters`}
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

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title={language === 'ne' ? 'शाखाहरू लोड हुन सकेन' : 'Unable to load chapters'}
            description={error}
            onRetry={fetchChapters}
          />
        ) : filteredChapters.length === 0 ? (
          <EmptyState
            title={language === 'ne' ? 'कुनै शाखा भेटिएन' : 'No chapters found'}
            description={
              hasActiveFilters
                ? (language === 'ne' ? 'तपाईंको खोजी अनुसार कुनै शाखा भेटिएन। कृपया फरक मापदण्ड प्रयास गर्नुहोस्।' : 'No chapters match your current search and filter criteria. Try resetting filters.')
                : (language === 'ne' ? 'अहिले कुनै शाखा सूचीकृत छैन।' : 'No active chapters currently listed.')
            }
            actionLabel={hasActiveFilters ? (language === 'ne' ? 'फिल्टरहरू रिसेट गर्नुहोस्' : 'Reset Filters') : undefined}
            onAction={hasActiveFilters ? handleClearFilters : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <Card
                key={chapter.id}
                className="flex flex-col justify-between hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  {/* Top status & Province */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                      <Building2 className="w-3.5 h-3.5" />
                      {chapter.province}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {chapter.lastActive}
                    </span>
                  </div>

                  {/* Chapter Name & Location */}
                  <h3 className="type-h3 font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                    {chapter.name}
                  </h3>

                  <div className="flex items-start gap-1.5 mt-2 text-xs text-[var(--color-muted)]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-primary)]" />
                    <span>{chapter.location}</span>
                  </div>

                  {/* Description */}
                  <p className="type-small text-[var(--color-muted)] mt-3 line-clamp-3 leading-relaxed">
                    {chapter.shortDescription}
                  </p>

                  {/* Recent Activity Highlight */}
                  <div className="mt-4 p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">
                    <div className="text-[11px] font-semibold text-[var(--color-foreground)] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                      {t('chapterRecentActivity')}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] line-clamp-2">
                      {chapter.recentActivity}
                    </p>
                  </div>
                </div>

                {/* Bottom Stats & Actions (NO follower counts as specified!) */}
                <div className="pt-5 mt-5 border-t border-[var(--color-border-subtle)] space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[var(--color-surface-muted)]">
                      <div className="text-base font-extrabold text-[var(--color-foreground)] flex items-center justify-center gap-1">
                        <FolderGit2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {chapter.projectsCompleted}
                      </div>
                      <div className="text-[11px] text-[var(--color-muted)] mt-0.5">
                        {t('projectsCompleted')}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--color-surface-muted)]">
                      <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {chapter.issuesResolved}
                      </div>
                      <div className="text-[11px] text-[var(--color-muted)] mt-0.5">
                        {t('issuesResolved')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => onNavigate(`/chapters/${chapter.slug || chapter.id}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                    >
                      {t('viewChapter')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenJoin}
                      aria-label={`${t('joinChapter')} ${chapter.name}`}
                    >
                      {language === 'ne' ? 'जोडिनुहोस्' : 'Join'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
};
