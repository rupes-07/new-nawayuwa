import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  FolderGit2,
  CheckCircle2,
  BookOpen,
  Compass,
  HeartHandshake,
  Droplet,
  AlertTriangle,
  Mountain,
  Palette,
  Award,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  Check,
  ExternalLink,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { PlatformStats, Chapter, CommunityIssue, CommunityProject } from '../../types/index.ts';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { Skeleton, CardSkeleton } from '../ui/Skeleton.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { Button } from '../ui/Button.tsx';

export interface HomePageProps {
  onOpenJoin?: () => void;
  onOpenReport?: () => void;
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenJoin,
  onOpenReport,
  onNavigate,
}) => {
  const { locale, t } = useI18n();

  // API Data State
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<boolean>(false);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState<boolean>(true);

  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState<boolean>(true);

  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [rsvpLoadingId, setRsvpLoadingId] = useState<string | null>(null);

  // Selected Chapter Modal
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Fetch all initial data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Stats
      try {
        setStatsLoading(true);
        const statsData = await api.getStats();
        if (isMounted) {
          setStats(statsData);
          setStatsError(false);
        }
      } catch (err) {
        if (isMounted) setStatsError(true);
      } finally {
        if (isMounted) setStatsLoading(false);
      }

      // 2. Chapters
      try {
        setChaptersLoading(true);
        const chaptersData = await api.getChapters();
        if (isMounted) setChapters(chaptersData);
      } catch (err) {
        console.error('Failed to load chapters', err);
      } finally {
        if (isMounted) setChaptersLoading(false);
      }

      // 3. Issues
      try {
        setIssuesLoading(true);
        const issuesData = await api.getIssues();
        if (isMounted) setIssues(issuesData);
      } catch (err) {
        console.error('Failed to load issues', err);
      } finally {
        if (isMounted) setIssuesLoading(false);
      }

      // 4. Projects
      try {
        setProjectsLoading(true);
        const projectsData = await api.getCommunityProjects();
        if (isMounted) setProjects(projectsData);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        if (isMounted) setProjectsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle RSVP to Project
  const handleToggleRsvp = async (projectId: string) => {
    try {
      setRsvpLoadingId(projectId);
      const res = await api.rsvpCommunityProject(projectId);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? res.project : p))
      );
    } catch (err) {
      console.error('Failed to toggle RSVP', err);
    } finally {
      setRsvpLoadingId(null);
    }
  };

  // Section 2: What We Do (8 explicit cards mandated by spec)
  const whatWeDoCards = [
    {
      id: 'education',
      titleEn: 'Youth Education',
      titleNe: 'युवा शिक्षा',
      descEn: 'Tutoring, digital literacy, and community study centers for students.',
      descNe: 'विद्यार्थीहरूका लागि ट्युसन, डिजिटल साक्षरता र सामुदायिक सिकाइ केन्द्र।',
      icon: BookOpen,
      accent: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
    },
    {
      id: 'leadership',
      titleEn: 'Leadership',
      titleNe: 'युवा नेतृत्व',
      descEn: 'Grassroots leadership training, public speaking, and civic governance skills.',
      descNe: 'स्थानीय नेतृत्व विकास, सार्वजनिक अभिव्यक्ति र नागरिक संवाद कार्यशाला।',
      icon: Compass,
      accent: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    },
    {
      id: 'volunteering',
      titleEn: 'Volunteering',
      titleNe: 'स्वयंसेवा',
      descEn: 'Emergency response, civic sanitation, public trail maintenance, and relief.',
      descNe: 'विपद् व्यवस्थापन, सरसफाइ अभियान, बाटो मर्मत र सामुदायिक उद्धार कार्य।',
      icon: HeartHandshake,
      accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    },
    {
      id: 'blood-donation',
      titleEn: 'Blood Donation',
      titleNe: 'रक्तदान कार्यक्रम',
      descEn: 'Regular voluntary donation camps and emergency donor mobilization network.',
      descNe: 'नियमित रक्तदान शिविर र आपत्कालीन रक्तदाता परिचालन सञ्जाल।',
      icon: Droplet,
      accent: 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
    },
    {
      id: 'community-issues',
      titleEn: 'Community Issues',
      titleNe: 'सामुदायिक समस्या समाधान',
      descEn: 'Documenting local municipal problems, civic reporting, and follow-ups.',
      descNe: 'स्थानीय टोलका समस्या दर्ता, वडा कार्यालयसँग समन्वय र निरन्तर समाधान पहल।',
      icon: AlertTriangle,
      accent: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
    },
    {
      id: 'tourism',
      titleEn: 'Tourism',
      titleNe: 'स्थानीय पर्यटन प्रवर्द्धन',
      descEn: 'Promoting local heritage sites, homestays, and community ecotourism trails.',
      descNe: 'स्थानीय ऐतिहासिक सम्पदा, होमस्टे र पर्यावरणमैत्री पर्यटन प्रवर्द्धन।',
      icon: Mountain,
      accent: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900',
    },
    {
      id: 'culture',
      titleEn: 'Culture',
      titleNe: 'कला तथा संस्कृति',
      descEn: 'Preserving indigenous traditions, cultural festivals, youth theatre, and arts.',
      descNe: 'परम्परागत चाडपर्व, लोकसंस्कृति, नाटक तथा युवा कला संरक्षण।',
      icon: Palette,
      accent: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900',
    },
    {
      id: 'social-awards',
      titleEn: 'Social Awards',
      titleNe: 'सामाजिक सम्मान तथा पुरस्कार',
      descEn: 'Recognizing unsung community champions, teachers, and selfless volunteers.',
      descNe: 'समाजमा निस्वार्थ योगदान पुर्याउने अग्रज, शिक्षक र युवाहरूको सम्मान।',
      icon: Award,
      accent: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    },
  ];

  // Section 3: How It Works Steps
  const howItWorksSteps = [
    {
      num: '01',
      titleEn: 'Discover',
      titleNe: 'पहिचान गर्नुहोस्',
      descEn: 'Find active youth chapters, verified community projects, and reported issues in your ward or municipality.',
      descNe: 'आफ्नो वडा वा नगरपालिकामा रहेका सक्रिय युवा शाखा, सामुदायिक परियोजना र स्थानीय समस्याहरू पहिचान गर्नुहोस्।',
      icon: Search,
    },
    {
      num: '02',
      titleEn: 'Join',
      titleNe: 'आबद्ध हुनुहोस्',
      descEn: 'Connect with your local youth chapter, register as an active volunteer, or submit verified municipal issues.',
      descNe: 'आफ्नो नजिकको शाखासँग जोडिनुहोस्, सक्रिय स्वयंसेवक बन्नुहोस् वा टोलका सार्वजनिक समस्या दर्ता गर्नुहोस्।',
      icon: UserCheck,
    },
    {
      num: '03',
      titleEn: 'Participate',
      titleNe: 'सहभागी हुनुहोस्',
      descEn: 'Attend civic workshops, tree drives, clean drinking water initiatives, or lead a problem-solving team.',
      descNe: 'नागरिक कार्यशाला, वृक्षारोपण, खानेपानी सुधार वा समुदाय सुधार टोलीको प्रत्यक्ष सहभागितामा जुट्नुहोस्।',
      icon: Activity,
    },
    {
      num: '04',
      titleEn: 'Create Impact',
      titleNe: 'दिगो प्रभाव पार्नुहोस्',
      descEn: 'Track tangible results with transparent ledgers, verified resolution badges, and community reports.',
      descNe: 'पारदर्शी तथ्याङ्क, समाधान प्रमाणपत्र र सामुदायिक प्रतिवेदनका साथ ठोस उपलब्धि र सकारात्मक परिवर्तन ल्याउनुहोस्।',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Civic Tag / Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold border border-[var(--color-primary)]/20 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {locale === 'ne' ? 'नेपालका युवाहरूको साझा मञ्च' : 'Empowering Grassroots Nepali Youth'}
                </span>
              </div>

              {/* H1 Heading mandated by spec */}
              <div className="space-y-2">
                <h1
                  id="hero-heading"
                  className="type-h1 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-[var(--color-foreground)] leading-tight"
                >
                  {locale === 'ne'
                    ? 'तपाईंको समुदाय। तपाईंको आवाज। तपाईंको पहल।'
                    : 'Your Community. Your Voice. Your Action.'}
                </h1>
                {locale === 'en' && (
                  <p className="text-sm sm:text-base font-semibold text-[var(--color-primary)]">
                    तपाईंको समुदाय। तपाईंको आवाज। तपाईंको पहल।
                  </p>
                )}
              </div>

              {/* Supporting Copy */}
              <p className="type-body text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl">
                {locale === 'ne'
                  ? 'नव युवा क्लबले युवाहरूलाई आफ्नो समुदाय, अवसर र सकारात्मक स्थानीय पहलसँग जोड्छ।'
                  : 'Nawa Yuwa Club connects young people with local communities, meaningful opportunities, and practical action.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenJoin}
                  className="font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>{locale === 'ne' ? 'तपाईंको समुदायमा जोडिनुहोस्' : 'Join Your Community'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onOpenReport}
                  className="font-semibold border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-[var(--color-primary)]" />
                  <span>{locale === 'ne' ? 'समुदायको समस्या रिपोर्ट गर्नुहोस्' : 'Report a Community Issue'}</span>
                </Button>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-3 pt-4 text-xs text-[var(--color-muted)] border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-1.5 text-[var(--color-success)] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{locale === 'ne' ? 'पारदर्शी नागरिक सञ्जाल' : 'Grassroots & Transparent'}</span>
                </div>
                <span>•</span>
                <span>{locale === 'ne' ? 'मधेश तथा लुम्बिनी प्रदेशका शाखाहरू' : 'Active in Madhesh & Lumbini'}</span>
              </div>
            </div>

            {/* Right Hero Visual Column (Nepal-inspired, community, youth, hope, action) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-[var(--color-surface-muted)] group">
                <img
                  src="/src/assets/images/nepal_youth_community_action_1791953691940.jpg"
                  alt="Nepali young people collaborating on community development in Nepal"
                  loading="eager"
                  className="w-full h-auto aspect-16/10 object-cover object-center group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-[var(--color-primary)] text-white px-2 py-0.5 rounded w-max mb-1">
                    {locale === 'ne' ? 'स्थानीय पहल' : 'Local Action'}
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    {locale === 'ne'
                      ? 'युवाहरूको सक्रिय सहभागितामा समुदाय सुधार अभियान'
                      : 'Youth changemakers collaborating on community planning'}
                  </p>
                  <span className="text-xs text-white/80 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Bardaghat & Madhesh Pradesh, Nepal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 — IMPACT
          Show meaningful platform statistics from API when available.
          If API data is unavailable: use loading/skeleton states. Do not invent real statistics.
          ========================================================================= */}
      <section
        id="impact"
        aria-labelledby="impact-heading"
        className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-12 sm:py-16 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              id="impact-heading"
              className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
            >
              {locale === 'ne' ? 'नेपालभर हाम्रो समुदायको प्रभाव' : 'Platform Impact Across Communities'}
            </h2>
            <p className="type-body text-sm sm:text-base text-[var(--color-muted)] mt-2">
              {locale === 'ne'
                ? 'प्रत्यक्ष प्रमाणित तथ्याङ्क: युवा सहभागिता, सक्रिय शाखाहरू र समाधान भएका समस्याहरू।'
                : 'Real-time verified data on youth engagement, active chapters, and community initiatives.'}
            </p>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center space-y-2 animate-pulse"
                >
                  <Skeleton height={36} width={80} className="mx-auto" />
                  <Skeleton height={16} width={120} className="mx-auto" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Youth Members */}
              <div className="p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center hover:border-[var(--color-primary)]/40 transition shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.youthMembers.toLocaleString()}
                  <span className="text-[var(--color-primary)] text-xl font-bold">+</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {locale === 'ne' ? 'युवा सदस्यहरू' : 'Youth Members'}
                </div>
              </div>

              {/* Active Chapters */}
              <div className="p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center hover:border-[var(--color-primary)]/40 transition shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.activeChapters}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {locale === 'ne' ? 'सक्रिय शाखाहरू' : 'Active Chapters'}
                </div>
              </div>

              {/* Community Projects */}
              <div className="p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center hover:border-[var(--color-primary)]/40 transition shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.communityProjects}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {locale === 'ne' ? 'सामुदायिक परियोजनाहरू' : 'Community Projects'}
                </div>
              </div>

              {/* Issues Resolved */}
              <div className="p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-center hover:border-[var(--color-primary)]/40 transition shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                  {stats.issuesResolved}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] mt-1">
                  {locale === 'ne' ? 'समाधान भएका समस्याहरू' : 'Issues Resolved'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-[var(--color-muted)]">
              {locale === 'ne' ? 'तथ्याङ्क उपलब्ध हुन सकेन।' : 'Platform impact metrics currently unavailable.'}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — WHAT WE DO
          Cards: Youth Education, Leadership, Volunteering, Blood Donation,
                 Community Issues, Tourism, Culture, Social Awards
          ========================================================================= */}
      <section
        id="what-we-do"
        aria-labelledby="what-we-do-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-primary)] text-xs font-semibold mb-2 border border-[var(--color-border)]">
            <Layers className="w-3.5 h-3.5" />
            <span>{locale === 'ne' ? 'हाम्रा मुख्य कार्यहरू' : 'Core Focus Areas'}</span>
          </div>
          <h2
            id="what-we-do-heading"
            className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
          >
            {locale === 'ne' ? 'हाम्रा मुख्य कार्यक्षेत्रहरू' : 'What We Do'}
          </h2>
          <p className="type-body text-sm sm:text-base text-[var(--color-muted)] mt-2">
            {locale === 'ne'
              ? 'नागरिक, शैक्षिक, सांस्कृतिक र सामाजिक क्षेत्रहरूमा युवाहरूलाई संगठित गरी समुदायको विकास।'
              : 'Connecting youth energy with practical programs that directly strengthen local communities.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {whatWeDoCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className="p-5 sm:p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${card.accent} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="type-h3 text-base sm:text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                    {locale === 'ne' ? card.titleNe : card.titleEn}
                  </h3>
                  <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    {locale === 'ne' ? card.descNe : card.descEn}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — HOW IT WORKS
          Steps: 01 Discover, 02 Join, 03 Participate, 04 Create Impact
          ========================================================================= */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-12 sm:py-16 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              id="how-it-works-heading"
              className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
            >
              {locale === 'ne' ? 'यो कसरी काम गर्छ' : 'How It Works'}
            </h2>
            <p className="type-body text-sm sm:text-base text-[var(--color-muted)] mt-2">
              {locale === 'ne'
                ? 'स्थानीय आवश्यकता पहिचानदेखि दिगो प्रभाव निर्माणसम्मको सीधा र पारदर्शी प्रक्रिया।'
                : 'A transparent 4-step framework from discovering local needs to measurable community impact.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howItWorksSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-[var(--color-primary)] opacity-80 tracking-tighter">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] shadow-2xs">
                        <StepIcon className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                    </div>
                    <h3 className="type-h3 text-lg font-bold text-[var(--color-foreground)] mb-2">
                      {locale === 'ne' ? step.titleNe : step.titleEn}
                    </h3>
                    <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                      {locale === 'ne' ? step.descNe : step.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — FEATURED CHAPTERS
          Show chapter cards: Chapter name, Location, Short description, Recent activity, View Chapter.
          Do NOT show follower counts.
          ========================================================================= */}
      <section
        id="chapters"
        aria-labelledby="chapters-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-primary)] text-xs font-semibold mb-2 border border-[var(--color-border)]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{locale === 'ne' ? 'स्थानीय शाखाहरू' : 'Local Chapters'}</span>
            </div>
            <h2
              id="chapters-heading"
              className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
            >
              {locale === 'ne' ? 'प्रमुख शाखाहरू' : 'Featured Chapters'}
            </h2>
            <p className="type-body text-sm text-[var(--color-muted)] mt-1">
              {locale === 'ne'
                ? 'मधेश प्रदेश, लुम्बिनी र स्थानीय तहहरूमा सक्रिय युवा शाखाहरू।'
                : 'Grassroots chapters working directly with municipalities and local youth.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('/chapters')}
              className="text-xs font-semibold cursor-pointer"
            >
              <span>{locale === 'ne' ? 'सबै शाखाहरू हेर्नुहोस्' : 'All Chapters Directory'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenJoin}
              className="text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 cursor-pointer"
            >
              <span>{locale === 'ne' ? 'नयाँ शाखा खोल्नुहोस्' : 'Start a Chapter'}</span>
            </Button>
          </div>
        </div>

        {chaptersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} hasImage={false} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chapters.map((chap) => (
              <article
                key={chap.id}
                className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">
                      {chap.province}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {chap.lastActive}
                    </span>
                  </div>

                  <h3 className="type-h3 text-base font-bold text-[var(--color-foreground)] leading-snug">
                    {chap.name}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-[var(--color-muted)]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-primary)]" />
                    <span className="line-clamp-1">{chap.location}</span>
                  </div>

                  <p className="type-body text-xs text-[var(--color-muted)] leading-relaxed line-clamp-3">
                    {chap.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-foreground)]">
                    <span className="font-semibold text-[var(--color-primary)]">
                      {locale === 'ne' ? 'हालको गतिविधि: ' : 'Recent: '}
                    </span>
                    <span className="text-[var(--color-muted)] line-clamp-2">
                      {chap.recentActivity}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-semibold justify-center cursor-pointer"
                    onClick={() => onNavigate?.(`/chapters/${chap.slug || chap.id}`)}
                  >
                    <span>{locale === 'ne' ? 'शाखा विवरण' : 'View Chapter'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 5 — COMMUNITY ISSUES
          Show selected public issues:
          Card: Issue title, Location, Category, Status, Date
          ========================================================================= */}
      <section
        id="issues"
        aria-labelledby="issues-heading"
        className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-12 sm:py-16 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-xs font-semibold mb-2 border border-[var(--color-danger)]/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{locale === 'ne' ? 'नागरिक समस्या समाधान' : 'Civic Problem Reporting'}</span>
              </div>
              <h2
                id="issues-heading"
                className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
              >
                {locale === 'ne' ? 'सामुदायिक समस्याहरू' : 'Community Issues'}
              </h2>
              <p className="type-body text-sm text-[var(--color-muted)] mt-1">
                {locale === 'ne'
                  ? 'स्थानीय युवाहरूद्वारा उठाइएका समस्याहरू, समाधान नभएसम्म पारदर्शी अनुगमन।'
                  : 'Publicly reported and verified local issues being actively monitored and addressed.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.('/issues')}
                className="text-xs font-semibold cursor-pointer"
              >
                <span>{locale === 'ne' ? 'सबै समस्याहरू हेर्नुहोस्' : 'All Community Issues'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenReport}
                className="text-xs font-bold shadow-xs cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                <span>{locale === 'ne' ? 'नयाँ समस्या दर्ता गर्नुहोस्' : 'Report an Issue'}</span>
              </Button>
            </div>
          </div>

          {issuesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} hasImage={false} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {issues.map((iss) => (
                <article
                  key={iss.id}
                  onClick={() => onNavigate?.(`/issues/${iss.id}`)}
                  className="p-5 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-sm transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)]">
                        {iss.category}
                      </span>
                      <StatusBadge status={iss.status} size="sm" />
                    </div>

                    <h3 className="type-h3 text-base sm:text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                      {iss.title}
                    </h3>

                    <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                      {iss.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-4 mt-4 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="truncate max-w-[200px]">{iss.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                      <span className="text-[11px] font-semibold">{locale === 'ne' ? 'विवरण' : 'Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — COMMUNITY PROJECTS
          Show: Project image, Project name, Location, Category, Date, Participation CTA
          ========================================================================= */}
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-primary)] text-xs font-semibold mb-2 border border-[var(--color-border)]">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{locale === 'ne' ? 'प्रत्यक्ष अभियानहरू' : 'Hands-on Action'}</span>
            </div>
            <h2
              id="projects-heading"
              className="type-h2 text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]"
            >
              {locale === 'ne' ? 'सामुदायिक परियोजनाहरू' : 'Community Projects'}
            </h2>
            <p className="type-body text-sm text-[var(--color-muted)] mt-1">
              {locale === 'ne'
                ? 'स्थानीय युवाहरूले अहिले नै सहभागी हुन सक्ने प्रत्यक्ष पहलहरू।'
                : 'Join local initiatives happening right now in your community.'}
            </p>
          </div>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} hasImage={true} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const isRsvpd = Boolean(proj.isParticipating);
              const isLoadingThis = rsvpLoadingId === proj.id;

              return (
                <article
                  key={proj.id}
                  className="rounded-xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Project Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-[var(--color-surface-muted)]">
                      <img
                        src={proj.imageUrl}
                        alt={proj.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        onError={(e) => {
                          // Fallback to high quality civic photography if any asset issue
                          (e.target as HTMLImageElement).src =
                            '/src/assets/images/nepal_youth_community_action_1791953691940.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-[var(--color-surface)]/95 text-[var(--color-foreground)] backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[var(--color-border)]">
                          {proj.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--color-primary)] text-white shadow-xs">
                          {proj.status}
                        </span>
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="type-h3 text-base sm:text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                        {proj.name}
                      </h3>

                      <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs text-[var(--color-muted)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          <span className="truncate">{proj.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          <span>{proj.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-[var(--color-foreground)]">
                          <Users className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />
                          <span>
                            {proj.participantsCount}{' '}
                            {locale === 'ne' ? 'सहभागी युवाहरू' : 'Youth Volunteers Participating'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participation CTA */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleToggleRsvp(proj.id)}
                      className={`touch-target w-full py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        isRsvpd
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-xs'
                      }`}
                    >
                      {isLoadingThis ? (
                        <span>{locale === 'ne' ? 'प्रक्रिया हुँदैछ...' : 'Updating...'}</span>
                      ) : isRsvpd ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{locale === 'ne' ? 'तपाईं सहभागी हुनुभएको छ' : "You're Participating"}</span>
                        </>
                      ) : (
                        <>
                          <HeartHandshake className="w-4 h-4" />
                          <span>{locale === 'ne' ? 'सहभागी हुनुहोस् (RSVP)' : 'Participate in Project'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 7 — FINAL CTA
          Heading: "Your community needs your voice."
          CTA: "Join Nawa Yuwa Club"
          ========================================================================= */}
      <section
        aria-labelledby="final-cta-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-8 sm:p-12 lg:p-16 shadow-xl text-center">
          {/* Subtle geometric pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>{locale === 'ne' ? 'स्थानीय नेतृत्वको आह्वान' : 'Youth Leadership Movement'}</span>
            </div>

            <h2
              id="final-cta-heading"
              className="type-h2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
            >
              {locale === 'ne'
                ? 'तपाईंको समुदायलाई तपाईंको आवाजको खाँचो छ।'
                : 'Your community needs your voice.'}
            </h2>

            <p className="type-body text-base sm:text-lg text-white/90 leading-relaxed">
              {locale === 'ne'
                ? 'सशक्त, सक्रिय र जोडिएको समुदाय निर्माण गर्न युवाहरूसँग मिलेर अघि बढ्नुहोस्। टोलका समस्या समाधान गर्नुहोस् र अर्थपूर्ण प्रभाव पार्नुहोस्।'
                : 'Join young people working together to build stronger, more active, and connected communities across Nepal.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenJoin}
                className="touch-target w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[var(--color-primary)] font-extrabold text-sm sm:text-base hover:bg-neutral-100 transition shadow-lg cursor-pointer"
              >
                {locale === 'ne' ? 'नव युवा क्लबमा जोडिनुहोस्' : 'Join Nawa Yuwa Club'}
              </button>

              <button
                type="button"
                onClick={onOpenReport}
                className="touch-target w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base transition border border-white/20 cursor-pointer"
              >
                {locale === 'ne' ? 'समस्या रिपोर्ट गर्नुहोस्' : 'Report an Issue'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Detail Dialog */}
      {selectedChapter && (
        <Dialog
          isOpen={Boolean(selectedChapter)}
          onClose={() => setSelectedChapter(null)}
          title={selectedChapter.name}
          description={`${selectedChapter.location} • ${selectedChapter.province}`}
          size="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-[var(--color-foreground)] mb-1">
                {locale === 'ne' ? 'शाखाको परिचय' : 'About this Chapter'}
              </h4>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {selectedChapter.shortDescription}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)] space-y-1">
              <span className="font-bold text-[var(--color-primary)] block">
                {locale === 'ne' ? 'हालको गतिविधि' : 'Recent Activity'}
              </span>
              <p className="text-[var(--color-foreground)]">
                {selectedChapter.recentActivity}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center pt-2">
              <div className="p-3 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                <span className="text-xl font-black text-[var(--color-foreground)] block">
                  {selectedChapter.projectsCompleted}
                </span>
                <span className="text-[11px] text-[var(--color-muted)] font-semibold">
                  {locale === 'ne' ? 'सम्पन्न परियोजनाहरू' : 'Projects Completed'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                <span className="text-xl font-black text-[var(--color-foreground)] block">
                  {selectedChapter.issuesResolved}
                </span>
                <span className="text-[11px] text-[var(--color-muted)] font-semibold">
                  {locale === 'ne' ? 'समाधान भएका समस्याहरू' : 'Issues Resolved'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--color-border)]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedChapter(null)}
              >
                {locale === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedChapter(null);
                  onOpenJoin?.();
                }}
              >
                {locale === 'ne' ? 'यस शाखामा जोडिनुहोस्' : 'Join this Chapter'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
