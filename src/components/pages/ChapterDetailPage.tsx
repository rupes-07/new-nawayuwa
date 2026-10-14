import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  Calendar,
  Clock,
  UserCheck,
  Phone,
  Mail,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { Chapter, CommunityProject, CommunityIssue } from '../../types/index.ts';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Skeleton } from '../ui/Skeleton.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface ChapterDetailPageProps {
  slugOrId: string;
  onNavigate: (path: string) => void;
  onOpenJoin: () => void;
  onOpenReport: () => void;
}

export const ChapterDetailPage: React.FC<ChapterDetailPageProps> = ({
  slugOrId,
  onNavigate,
  onOpenJoin,
  onOpenReport,
}) => {
  const { t, language } = useI18n();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO Page Meta
  usePageMeta({
    title: chapter
      ? `${chapter.name} | ${language === 'ne' ? 'नव युवा क्लब' : 'Nawa Yuwa Club Nepal'}`
      : 'Chapter Details | Nawa Yuwa Club',
    description: chapter?.shortDescription || 'Local youth chapter in Nepal working on grassroots community action, leadership, and volunteer projects.',
    canonicalPath: `/chapters/${slugOrId}`,
  });

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [chapterData, allProjects, allIssues] = await Promise.all([
        api.getChapter(slugOrId),
        api.getCommunityProjects(),
        api.getIssues(),
      ]);
      setChapter(chapterData);

      // Filter projects related to chapter location/province or show featured projects
      const relatedProjects = allProjects.filter(p =>
        p.location.toLowerCase().includes(chapterData.district.toLowerCase()) ||
        p.location.toLowerCase().includes(chapterData.name.toLowerCase().replace(' chapter', '')) ||
        chapterData.location.toLowerCase().includes(p.location.split(',')[0].toLowerCase())
      );
      setProjects(relatedProjects.length > 0 ? relatedProjects : allProjects.slice(0, 2));

      // Filter issues for this chapter's area
      const relatedIssues = allIssues.filter(i =>
        i.location.toLowerCase().includes(chapterData.district.toLowerCase()) ||
        chapterData.location.toLowerCase().includes(i.location.split(',')[0].toLowerCase())
      );
      setIssues(relatedIssues.length > 0 ? relatedIssues : allIssues.slice(0, 3));
    } catch (err: any) {
      console.error('Error loading chapter details:', err);
      setError(err?.message || 'Failed to load chapter information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="py-8 sm:py-12 bg-[var(--color-background)]">
        <PageContainer>
          <div className="space-y-6">
            <Skeleton className="h-6 w-48 rounded-md" />
            <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <Skeleton className="h-10 w-3/4 max-w-md rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-80 rounded-2xl" />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="py-12 bg-[var(--color-background)]">
        <PageContainer>
          <ErrorState
            title={language === 'ne' ? 'शाखा भेटिएन' : 'Chapter Not Found'}
            description={error || (language === 'ne' ? 'अनुरोध गरिएको शाखा फेला परेन। कृपया शाखा निर्देशिका हेर्नुहोस्।' : 'The requested chapter could not be found. Please check the directory.')}
            onRetry={() => onNavigate('/chapters')}
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[var(--color-background)]">
      <PageContainer>
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <PageHeader
            title={chapter.name}
            description={chapter.shortDescription}
            breadcrumbs={[
              { label: t('navHome'), href: '/' },
              { label: t('navChapters'), href: '/chapters' },
              { label: chapter.name, current: true },
            ]}
            onNavigateBreadcrumb={onNavigate}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/chapters')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  {t('backToChapters')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenJoin}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  {t('joinChapter')}
                </Button>
              </div>
            }
          />
        </div>

        {/* Chapter Hero Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 md:p-10 mb-8 shadow-xs">
          {/* Subtle Dhaka ornament accent */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-radial from-[var(--color-primary)]/10 to-transparent rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  <Building2 className="w-3.5 h-3.5" />
                  {chapter.province}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-surface-muted)] text-[var(--color-foreground)] border border-[var(--color-border)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  {chapter.district}
                </span>
                {chapter.establishedYear && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-[var(--color-muted)] bg-[var(--color-surface-muted)]">
                    <Calendar className="w-3 h-3" />
                    Est. {chapter.establishedYear}
                  </span>
                )}
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium ml-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {chapter.lastActive}
                </span>
              </div>

              <h1 className="type-hero text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-foreground)] tracking-tight">
                {chapter.name}
              </h1>

              <p className="type-body text-[var(--color-muted)] leading-relaxed">
                {chapter.about || chapter.shortDescription}
              </p>

              {/* Quick Actions */}
              <div className="flex items-center flex-wrap gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenJoin}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  {t('joinChapter')}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={onOpenReport}
                  leftIcon={<AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />}
                >
                  {language === 'ne' ? 'यस क्षेत्रको समस्या रिपोर्ट गर्नुहोस्' : 'Report Issue in this Area'}
                </Button>
              </div>
            </div>

            {/* Impact Highlights Card */}
            <div className="shrink-0 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-2xl p-5 w-full lg:w-72 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                {language === 'ne' ? 'शाखाको स्थानीय प्रभाव' : 'Chapter Local Impact'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-center">
                  <div className="text-2xl font-black text-[var(--color-foreground)] flex items-center justify-center gap-1">
                    <FolderGit2 className="w-5 h-5 text-[var(--color-primary)]" />
                    {chapter.projectsCompleted}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] mt-1 font-medium">
                    {t('projectsCompleted')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-center">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-5 h-5" />
                    {chapter.issuesResolved}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] mt-1 font-medium">
                    {t('issuesResolved')}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'ne' ? 'प्रमाणित ग्रासरुट नागरिक रेकर्ड' : 'Verified grassroots civic records'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column (2 spans) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About & Mission */}
            <Card className="space-y-4">
              <h2 className="type-h2 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                {t('chapterAbout')}
              </h2>
              <p className="type-body text-[var(--color-foreground)]/90 leading-relaxed">
                {chapter.about || chapter.shortDescription}
              </p>
              <div className="p-4 rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-2">
                <div className="text-xs font-bold text-[var(--color-foreground)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  {t('chapterRecentActivity')}
                </div>
                <p className="type-small text-[var(--color-muted)]">
                  {chapter.recentActivity}
                </p>
              </div>
            </Card>

            {/* Chapter Projects */}
            <section aria-labelledby="chapter-projects-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="chapter-projects-heading" className="type-h2 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-[var(--color-primary)]" />
                  {language === 'ne' ? 'शाखाका परियोजना तथा अभियानहरू' : 'Chapter Projects & Drives'}
                </h2>
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  {projects.length} {language === 'ne' ? 'परियोजनाहरू' : 'Projects'}
                </span>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        loading="lazy"
                        className="w-full sm:w-44 h-32 object-cover rounded-xl shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                          {project.category}
                        </span>
                        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {project.date}
                        </span>
                      </div>
                      <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                        {project.name}
                      </h3>
                      <p className="type-small text-[var(--color-muted)] line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          {project.location}
                        </span>
                        <span className="text-xs font-semibold text-[var(--color-primary)]">
                          {project.participantsCount} {language === 'ne' ? 'स्वयंसेवक' : 'volunteers'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Chapter Community Issues */}
            <section aria-labelledby="chapter-issues-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="chapter-issues-heading" className="type-h2 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                  {language === 'ne' ? 'यस क्षेत्रका सामुदायिक समस्याहरू' : 'Local Community Issues'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/issues')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {language === 'ne' ? 'सबै समस्याहरू' : 'View All Issues'}
                </Button>
              </div>

              <div className="space-y-3">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onNavigate(`/issues/${issue.id}`)}
                    className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-muted)] border border-[var(--color-border)]">
                          {issue.category}
                        </span>
                        <span className="text-[11px] text-[var(--color-muted)]">
                          {issue.ward || issue.location}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition">
                        {issue.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <StatusBadge status={issue.status} />
                      <ArrowRight className="w-4 h-4 text-[var(--color-muted)] group-hover:translate-x-1 group-hover:text-[var(--color-primary)] transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar Column (1 span) */}
          <div className="space-y-6">
            {/* Chapter Location & Meeting Details */}
            <Card className="space-y-4">
              <h3 className="type-h3 font-bold text-[var(--color-foreground)] border-b border-[var(--color-border-subtle)] pb-3">
                {language === 'ne' ? 'बैठक तथा सम्पर्क विवरण' : 'Meeting & Contact Info'}
              </h3>

              <div className="space-y-3.5 text-xs text-[var(--color-foreground)]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[var(--color-muted)]">{t('chapterMeetingPlace')}</div>
                    <div className="mt-0.5 font-medium">{chapter.meetingPlace || chapter.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[var(--color-muted)]">{t('chapterMeetingSchedule')}</div>
                    <div className="mt-0.5 font-medium">{chapter.meetingSchedule || 'Regular bi-weekly civic forums'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[var(--color-muted)]">{t('chapterCoordinator')}</div>
                    <div className="mt-0.5 font-medium">{chapter.coordinatorName || 'Chapter Leadership Council'}</div>
                  </div>
                </div>

                {chapter.coordinatorContact && (
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[var(--color-muted)]">{t('chapterContact')}</div>
                      <div className="mt-0.5 font-medium">{chapter.coordinatorContact}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Join CTA Box */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold leading-snug">
                {language === 'ne'
                  ? 'आफ्नो वडामा युवा नेतृत्वको हिस्सा बन्नुहोस्'
                  : 'Become Part of Youth Leadership in your Ward'}
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                {language === 'ne'
                  ? 'तपाईंको विचार, समय र सक्रिय सहभागिताले तपाईंको स्थानीय समुदायलाई अझ सुरक्षित र समृद्ध बनाउन सक्छ।'
                  : 'Your ideas, time, and active volunteer spirit can make your local neighborhood stronger, cleaner, and connected.'}
              </p>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={onOpenJoin}
                className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-transparent font-bold cursor-pointer"
              >
                {t('joinChapter')}
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
