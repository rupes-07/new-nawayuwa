import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  FolderGit2,
  CheckCircle2,
  HeartHandshake,
  Droplet,
  Lightbulb,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { PlatformStats } from '../../types/index.ts';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { Skeleton } from '../ui/Skeleton.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface ImpactPageProps {
  onNavigate: (path: string) => void;
  onOpenJoin: () => void;
  onOpenReport: () => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({
  onNavigate,
  onOpenJoin,
  onOpenReport,
}) => {
  const { t, language } = useI18n();

  // SEO Page Meta
  usePageMeta({
    title: language === 'ne'
      ? 'पारदर्शी सामुदायिक प्रभाव | नव युवा क्लब नेपाल'
      : 'Transparent Community Impact | Nawa Yuwa Club Nepal',
    description: language === 'ne'
      ? 'नव युवा क्लबको वास्तविक र प्रमाणित नागरिक प्रभाव: युवा स्वयंसेवा, वडा पूर्वाधार मर्मत र सामुदायिक समस्या समाधान।'
      : 'Transparent, verified community impact in Nepal: youth volunteerism, local infrastructure repair, and grassroots problem resolution.',
    canonicalPath: '/impact',
  });

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading platform statistics:', err);
      setError(err?.message || 'Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="py-8 sm:py-12 bg-[var(--color-background)]">
      <PageContainer>
        {/* Header */}
        <PageHeader
          title={t('impactTitle')}
          description={t('impactDescription')}
          breadcrumbs={[
            { label: t('navHome'), href: '/' },
            { label: t('navImpact'), current: true },
          ]}
          onNavigateBreadcrumb={onNavigate}
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={onOpenJoin}
              leftIcon={<Users className="w-4 h-4" />}
            >
              {language === 'ne' ? 'प्रभाव सिर्जना गर्नुहोस्' : 'Create Impact with Us'}
            </Button>
          }
        />

        {/* Section 1: Live Platform Verified Metrics */}
        <section aria-labelledby="live-metrics-heading" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 id="live-metrics-heading" className="type-h2 font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {t('verifiedData')}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === 'ne' ? 'प्रत्यक्ष डाटाबेसबाट' : 'Live from verified database'}</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : error ? (
            <ErrorState
              title={language === 'ne' ? 'तथ्याङ्क लोड हुन सकेन' : 'Unable to load statistics'}
              description={error}
              onRetry={fetchStats}
            />
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <Card className="p-6 text-center border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.youthMembers.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'दर्ता भएका युवा सदस्यहरू' : 'Registered Youth Members'}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'मधेश तथा लुम्बिनी प्रदेश' : 'Madhesh & Lumbini Provinces'}
                </div>
              </Card>

              <Card className="p-6 text-center border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.activeChapters}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'सक्रिय स्थानीय शाखाहरू' : 'Active Local Chapters'}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'नगरपालिका तथा गाउँपालिका' : 'Municipalities & Wards'}
                </div>
              </Card>

              <Card className="p-6 text-center border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.communityProjects}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'सामुदायिक परियोजनाहरू' : 'Community Projects'}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'सम्पन्न तथा सञ्चालनमा' : 'Completed & Active'}
                </div>
              </Card>

              <Card className="p-6 text-center border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {stats.issuesResolved}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'समाधान गरिएका समस्याहरू' : 'Ward Issues Resolved'}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] mt-1">
                  {language === 'ne' ? 'नागरिक प्रमाणीकरणसहित' : '100% verified field audits'}
                </div>
              </Card>
            </div>
          ) : null}
        </section>

        {/* Section 2: Transparency Manifesto */}
        <section aria-labelledby="manifesto-heading" className="mb-12">
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden shadow-xs">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'ne' ? 'हाम्रो प्रतिबद्धता' : 'Our Commitment'}
              </span>

              <h2 id="manifesto-heading" className="type-hero text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]">
                {t('impactManifesto')}
              </h2>

              <p className="type-body text-base text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'नव युवा क्लबमा हामी काल्पनिक संख्या वा सामाजिक सञ्जालका अनुयायीहरूको खोक्रो दाबी गर्दैनौं। हाम्रो प्रभाव भनेको टोलका भाँचिएका पानीका पाइप मर्मत हुनु, विद्यालय जाने बाटोमा सोलार बत्ती बल्नु, युवाहरूले आफ्नै हातले वृक्षारोपण गर्नु र वडा कार्यालयमा नागरिकका समस्या औपचारिक रूपमा दर्ता भई समाधान हुनु हो।'
                  : 'At Nawa Yuwa Club, we reject fabricated numbers and superficial follower metrics. Real civic impact is a repaired drinking water pipe in a ward, functional solar streetlights outside a community school, young people organizing tree drives along eroding rivers, and citizens holding local government constructively accountable.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1.5">
                  <div className="text-sm font-bold text-[var(--color-foreground)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {language === 'ne' ? 'स्थलगत प्रमाणीकरण' : 'Field Audited'}
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">
                    {language === 'ne' ? 'हरेक समस्या र परियोजना स्थानीय युवा स्वयंसेवकद्वारा प्रत्यक्ष रूपमा प्रमाणित गरिन्छ।' : 'Every issue and project is verified in-person by local youth volunteers.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1.5">
                  <div className="text-sm font-bold text-[var(--color-foreground)] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                    {language === 'ne' ? 'स्थानीय तहसँग सहकार्य' : 'Ward Collaboration'}
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">
                    {language === 'ne' ? 'नगरपालिका र वडा कार्यालयसँग औपचारिक संवादमार्फत दीर्घकालीन समाधान।' : 'Formal dialogue with municipalities ensures enduring systemic solutions.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1.5">
                  <div className="text-sm font-bold text-[var(--color-foreground)] flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-amber-600" />
                    {language === 'ne' ? 'श्रमदान संस्कृति' : 'Shramdaan Culture'}
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">
                    {language === 'ne' ? 'युवाहरूको प्रत्यक्ष श्रम, सीप र समयको निःस्वार्थ सामुदायिक लगानी।' : 'Direct volunteer labor and community solidarity for rapid local results.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The 4 Pillars of Community Impact */}
        <section aria-labelledby="pillars-heading" className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 id="pillars-heading" className="type-h2 font-bold text-[var(--color-foreground)]">
              {language === 'ne' ? 'सामुदायिक प्रभावका चार स्तम्भहरू' : 'The Four Pillars of Community Impact'}
            </h2>
            <p className="type-body text-[var(--color-muted)]">
              {language === 'ne'
                ? 'हाम्रा प्रत्येक गतिविधि यी मुख्य क्षेत्रहरूमा मापनयोग्य परिवर्तन ल्याउन लक्षित छन्।'
                : 'Every initiative on Nawa Yuwa Club is structured around concrete local change.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3 border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? '१. आधारभूत पूर्वाधार र स्वच्छता' : '1. Grassroots Infrastructure & Sanitation'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'खानेपानी पाइप मर्मत, ढल निकास खुलाउने, फोहोरमैला व्यवस्थापनका लागि डस्टबिन स्थापना र सार्वजनिक सडक बत्तीको व्यवस्थापन।'
                  : 'Restoring drinking water supply lines, clearing municipal drainage silt, installing proper waste bins, and fixing broken streetlights.'}
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? '२. युवा नेतृत्व र सीप विकास' : '2. Youth Leadership & Civic Skills'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'विद्यार्थीहरूलाई स्थानीय सरकारका नीति बुझाउने, सार्वजनिक समस्या पहिचान तथा दस्ताबेजीकरण गर्ने र नेतृत्व तालिम प्रदान गर्ने।'
                  : 'Equipping youth with local governance knowledge, civic problem reporting capabilities, meeting facilitation, and vocational training.'}
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? '३. विपद् व्यवस्थापन र सामाजिक एकता' : '3. Disaster Resilience & Mutual Aid'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'तराईका बाढी प्रभावित क्षेत्रमा उद्धार टोली, शीतलहरमा न्यानो कपडा वितरण र आकस्मिक रक्तदान कार्यक्रमहरूको निरन्तर सञ्चालन।'
                  : 'Rapid rescue readiness in flood-prone river plains, winter cold wave relief, and emergency blood donor networks across district hospitals.'}
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? '४. सार्वजनिक जवाफदेहिता र सहकार्य' : '4. Public Accountability & Dialogue'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'वडा तहमा युवा र जनप्रतिनिधिबीच नियमित छलफल, बजेट विनियोजनको पारदर्शी अनुगमन र रचनात्मक नागरिक दबाब।'
                  : 'Fostering productive monthly dialogues between citizens and ward chairs, monitoring public works spending, and building community trust.'}
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4: Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-center space-y-6">
          <h2 className="type-hero text-2xl sm:text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto">
            {language === 'ne'
              ? 'तपाईंको समुदायलाई तपाईंको आवाज र पहल चाहिन्छ'
              : 'Your Community Needs Your Voice and Action'}
          </h2>
          <p className="type-body text-white/90 max-w-xl mx-auto text-sm sm:text-base">
            {language === 'ne'
              ? 'आफ्नो टोलको समस्या रिपोर्ट गर्नुहोस् वा स्थानीय शाखामा स्वयंसेवकका रूपमा जोडिनुहोस्।'
              : 'Report an issue in your ward or sign up to volunteer with your local chapter today.'}
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenJoin}
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-transparent font-bold"
            >
              {language === 'ne' ? 'नव युवा क्लबमा जोडिनुहोस्' : 'Join Nawa Yuwa Club'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenReport}
              className="bg-transparent text-white border-white/60 hover:bg-white/10"
            >
              {t('reportCommunityIssue')}
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
