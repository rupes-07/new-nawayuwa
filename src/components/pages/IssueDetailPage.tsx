import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  User,
  Share2,
  FileText,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { CommunityIssue, CommunityProject } from '../../types/index.ts';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Skeleton } from '../ui/Skeleton.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface IssueDetailPageProps {
  id: string;
  onNavigate: (path: string) => void;
  onOpenReport: () => void;
  onOpenJoin: () => void;
}

export const IssueDetailPage: React.FC<IssueDetailPageProps> = ({
  id,
  onNavigate,
  onOpenReport,
  onOpenJoin,
}) => {
  const { t, language } = useI18n();

  const [issue, setIssue] = useState<CommunityIssue | null>(null);
  const [relatedProject, setRelatedProject] = useState<CommunityProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO Page Meta
  usePageMeta({
    title: issue
      ? `${issue.title} | ${language === 'ne' ? 'सामुदायिक समस्या' : 'Community Issue'} | Nawa Yuwa Club`
      : 'Issue Details | Nawa Yuwa Club',
    description: issue?.description || 'Community reported issue verified and tracked by youth volunteers in Nepal.',
    canonicalPath: `/issues/${id}`,
  });

  const fetchIssueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const issueData = await api.getIssue(id);
      setIssue(issueData);

      if (issueData.relatedProjectId) {
        try {
          const projects = await api.getCommunityProjects();
          const proj = projects.find(p => p.id === issueData.relatedProjectId);
          if (proj) setRelatedProject(proj);
        } catch (e) {
          console.warn('Could not load related project', e);
        }
      }
    } catch (err: any) {
      console.error('Error loading issue details:', err);
      setError(err?.message || 'Failed to load community issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-8 sm:py-12 bg-[var(--color-background)]">
        <PageContainer>
          <div className="space-y-6">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-72 rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-96 rounded-2xl" />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="py-12 bg-[var(--color-background)]">
        <PageContainer>
          <ErrorState
            title={language === 'ne' ? 'समस्या फेला परेन' : 'Issue Not Found'}
            description={error || (language === 'ne' ? 'अनुरोध गरिएको समस्या फेला परेन।' : 'The requested community issue could not be found.')}
            onRetry={() => onNavigate('/issues')}
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
            title={issue.title}
            breadcrumbs={[
              { label: t('navHome'), href: '/' },
              { label: t('navIssues'), href: '/issues' },
              { label: issue.title, current: true },
            ]}
            onNavigateBreadcrumb={onNavigate}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/issues')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  {t('backToIssues')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenReport}
                  leftIcon={<AlertTriangle className="w-4 h-4" />}
                >
                  {t('reportCommunityIssue')}
                </Button>
              </div>
            }
          />
        </div>

        {/* Top Issue Meta Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  {issue.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-muted)] border border-[var(--color-border)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  {issue.location}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[var(--color-muted)] bg-[var(--color-surface-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  {t('reportedOn')} {issue.reportedDate}
                </span>
              </div>

              <h1 className="type-hero text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)] tracking-tight">
                {issue.title}
              </h1>

              {issue.reportedBy && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ne' ? 'रिपोर्टकर्ता:' : 'Reported by:'} <strong className="text-[var(--color-foreground)]">{issue.reportedBy}</strong>
                  </span>
                  {issue.ward && (
                    <span>• {issue.ward}</span>
                  )}
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center md:flex-col md:items-end gap-2">
              <div className="text-xs text-[var(--color-muted)] font-medium">
                {language === 'ne' ? 'वर्तमान स्थिति' : 'Current Status'}
              </div>
              <StatusBadge status={issue.status} />
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-4">
            <h2 className="type-h3 font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--color-primary)]" />
              {language === 'ne' ? 'समस्याको विस्तृत विवरण' : 'Detailed Issue Description'}
            </h2>
            <p className="type-body text-base text-[var(--color-foreground)]/90 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Action Taken Callout */}
          {issue.actionTaken && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[var(--color-primary-muted)]/50 border border-[var(--color-primary)]/20 space-y-2">
              <div className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('issueActionTaken')}
              </div>
              <p className="type-body text-xs sm:text-sm text-[var(--color-foreground)] leading-relaxed">
                {issue.actionTaken}
              </p>
            </div>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline & Field Updates (2 spans) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
                <h2 className="type-h2 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  {t('issueTimeline')}
                </h2>
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  {issue.timeline?.length || 0} {language === 'ne' ? 'चरणहरू' : 'steps recorded'}
                </span>
              </div>

              {issue.timeline && issue.timeline.length > 0 ? (
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--color-border)]">
                  {issue.timeline.map((event, idx) => (
                    <div key={idx} className="relative group">
                      {/* Checkpoint Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          event.completed
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] border-2 border-[var(--color-border)]'
                        }`}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            event.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-muted)]'
                          }`}>
                            {event.step}
                          </span>
                          <span className="text-xs text-[var(--color-muted)]">
                            {event.date}
                          </span>
                        </div>

                        <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                          {event.title}
                        </h3>

                        <p className="type-small text-[var(--color-muted)] leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--color-muted)]">
                  {language === 'ne' ? 'यस समस्याको टाइमलाइन अद्यावधिक भइरहेको छ।' : 'Timeline for this issue is currently being updated.'}
                </p>
              )}
            </Card>
          </div>

          {/* Sidebar (1 span) */}
          <div className="space-y-6">
            {/* Related Action Project if available */}
            {relatedProject ? (
              <Card className="space-y-4 border-[var(--color-primary)]/30">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  {t('relatedProject')}
                </div>

                {relatedProject.imageUrl && (
                  <img
                    src={relatedProject.imageUrl}
                    alt={relatedProject.name}
                    loading="lazy"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                )}

                <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                  {relatedProject.name}
                </h3>

                <p className="type-small text-[var(--color-muted)] line-clamp-3">
                  {relatedProject.description}
                </p>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={onOpenJoin}
                  >
                    {language === 'ne' ? 'परियोजनामा स्वयंसेवक बन्नुहोस्' : 'Volunteer for this Project'}
                  </Button>
                </div>
              </Card>
            ) : issue.relatedProjectName ? (
              <Card className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  {t('relatedProject')}
                </div>
                <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                  {issue.relatedProjectName}
                </h3>
                <p className="text-xs text-[var(--color-muted)]">
                  {language === 'ne'
                    ? 'स्थानीय शाखाले यस समस्या समाधानका लागि विशेष युवा अभियान सुरु गरेको छ।'
                    : 'The local chapter initiated a dedicated community project to permanently address this problem.'}
                </p>
              </Card>
            ) : null}

            {/* How Issues are Resolved Box */}
            <Card className="space-y-3 bg-[var(--color-surface-muted)]">
              <h3 className="type-h3 font-bold text-[var(--color-foreground)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {language === 'ne' ? 'प्रमाणीकरण प्रक्रिया' : 'Verification Process'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'दर्ता भएका हरेक समस्यालाई स्थानीय वडाका युवा स्वयंसेवकहरूले स्थलगत निरीक्षण गर्छन् र सम्बन्धित नगरपालिका तथा वडा कार्यालयसँग समन्वय गरी समाधानतर्फ अघि बढाउँछन्।'
                  : 'Every reported issue is verified on-site by neighborhood youth volunteers. We prepare formal technical reports and collaborate with local municipal ward offices.'}
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={onOpenReport}
                  leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning)]" />}
                >
                  {language === 'ne' ? 'अन्य समस्या रिपोर्ट गर्नुहोस्' : 'Report Another Issue'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
