import React, { useState } from 'react';
import {
  Compass,
  UserPlus,
  HeartHandshake,
  AlertTriangle,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { PageContainer } from '../layout/PageContainer.tsx';
import { PageHeader } from '../layout/PageHeader.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { usePageMeta } from '../../lib/seo.ts';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
  onOpenJoin: () => void;
  onOpenReport: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigate,
  onOpenJoin,
  onOpenReport,
}) => {
  const { t, language } = useI18n();

  // SEO Page Meta
  usePageMeta({
    title: language === 'ne'
      ? 'कसरी काम गर्छ | नव युवा क्लब नेपाल'
      : 'How It Works | Nawa Yuwa Club Nepal',
    description: language === 'ne'
      ? 'नव युवा क्लबको ६-चरणको नागरिक सहभागिता ढाँचा: स्थानीय समस्या पहिचान, युवा सहभागिता, वडा समन्वय र प्रत्यक्ष प्रभाव।'
      : 'Understand the 6-step civic participation framework of Nawa Yuwa Club: Discover, Join, Participate, Report, Collaborate, and Create Impact.',
    canonicalPath: '/how-it-works',
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: language === 'ne' ? 'अन्वेषण (Discover)' : 'Discover Local Needs',
      nepaliTitle: 'स्थानीय आवश्यकता खोज्नुहोस्',
      description: language === 'ne'
        ? 'आफ्नो नगरपालिका वा वडामा सञ्चालित युवा शाखाहरू, चालू स्वयंसेवा परियोजनाहरू र छिमेकमा दर्ता भएका सामुदायिक आवश्यकताहरू हेर्नुहोस्।'
        : 'Explore verified youth chapters across Madhesh and Lumbini, browse upcoming volunteer drives, and check neighborhood civic issues in your ward.',
      icon: Compass,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
      actionText: language === 'ne' ? 'शाखाहरू हेर्नुहोस्' : 'Explore Chapters',
      actionPath: '/chapters',
    },
    {
      number: '02',
      title: language === 'ne' ? 'जोडिनुहोस् (Join)' : 'Join Your Local Chapter',
      nepaliTitle: 'आफ्नो शाखामा दर्ता हुनुहोस्',
      description: language === 'ne'
        ? 'सरल फारममार्फत आफ्नो वडाको युवा शाखामा निःशुल्क सदस्यता लिनुहोस् र समान विचारधारा भएका उत्साही युवाहरूसँग जोडिनुहोस्।'
        : 'Sign up in under two minutes to join your ward’s youth chapter council. Free membership for youth passionate about community service.',
      icon: UserPlus,
      color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]',
      actionText: language === 'ne' ? 'सदस्यता लिनुहोस्' : 'Register Now',
      actionPath: 'join',
    },
    {
      number: '03',
      title: language === 'ne' ? 'सहभागिता (Participate)' : 'Participate in Projects',
      nepaliTitle: 'अभियानहरूमा भाग लिनुहोस्',
      description: language === 'ne'
        ? 'वृक्षारोपण, निःशुल्क स्वास्थ्य तथा रक्तदान शिविर, खेलकुद प्रतियोगिता वा युवा नेतृत्व कार्यशालाहरूमा प्रत्यक्ष सहभागी हुनुहोस्।'
        : 'RSVP and volunteer for active field campaigns: clean drinking water stations, road greening drives, flood relief readiness, and sports clinics.',
      icon: HeartHandshake,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      actionText: language === 'ne' ? 'परियोजनाहरू हेर्नुहोस्' : 'Browse Projects',
      actionPath: '/#projects',
    },
    {
      number: '04',
      title: language === 'ne' ? 'रिपोर्टिङ (Report)' : 'Report Ward Issues',
      nepaliTitle: 'टोलका समस्या दर्ता गर्नुहोस्',
      description: language === 'ne'
        ? 'भाँचिएको खानेपानी पाइप, सडक बत्ती नबलेको वा फोहोरमैलाको समस्या देखेमा फोटोसहित केही सेकेन्डमै प्लेटफर्ममा रिपोर्ट गर्नुहोस्।'
        : 'Notice a broken water pipeline, malfunctioning solar streetlights, or clogged irrigation canal? Submit geotagged details in seconds.',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      actionText: language === 'ne' ? 'समस्या रिपोर्ट गर्नुहोस्' : 'Report an Issue',
      actionPath: 'report',
    },
    {
      number: '05',
      title: language === 'ne' ? 'सहकार्य (Collaborate)' : 'Collaborate with Local Government',
      nepaliTitle: 'वडा र नगरपालिकासँग समन्वय',
      description: language === 'ne'
        ? 'युवा क्लबका प्रतिनिधिहरूले स्थलगत प्रमाणीकरण गरी वडा कार्यालय र नगर इन्जिनियरसँग समस्या समाधानका लागि समन्वय गर्छन्।'
        : 'Local chapter teams verify the report on-site, draft formal community escalation notices, and engage municipal ward representatives constructively.',
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      actionText: language === 'ne' ? 'दर्ता सूची हेर्नुहोस्' : 'View Registry',
      actionPath: '/issues',
    },
    {
      number: '06',
      title: language === 'ne' ? 'प्रभाव सिर्जना (Create Impact)' : 'Create Lasting Impact',
      nepaliTitle: 'मापनयोग्य परिणाम र पारदर्शिता',
      description: language === 'ne'
        ? 'समस्या समाधान भएपछि नागरिकहरूले नै पुष्टि गर्छन् र प्रत्यक्ष तथ्याङ्क सार्वजनिक रूपमा सबैका लागि खुला राखिन्छ।'
        : 'Repairs and community projects are audited publicly. Real before-and-after change logged permanently in the public impact ledger.',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      actionText: language === 'ne' ? 'प्रभाव हेर्नुहोस्' : 'View Impact',
      actionPath: '/impact',
    },
  ];

  const faqs = [
    {
      q: language === 'ne' ? 'के नव युवा क्लबको सदस्यता निःशुल्क छ?' : 'Is joining Nawa Yuwa Club free?',
      a: language === 'ne'
        ? 'हो, नव युवा क्लबको सदस्यता पूर्ण रूपमा निःशुल्क छ। १६ देखि ३९ वर्षका कुनै पनि युवा यसमा आबद्ध हुन सक्छन्।'
        : 'Yes, membership in Nawa Yuwa Club is completely free. Any young person aged 16 to 39 can sign up and participate in their local chapter.',
    },
    {
      q: language === 'ne' ? 'दर्ता गरिएका समस्याहरू कसरी समाधान हुन्छन्?' : 'How do reported community issues actually get resolved?',
      a: language === 'ne'
        ? 'रिपोर्ट प्राप्त भएपछि सम्बन्धित वडाको युवा टोलीले २४ घण्टाभित्र स्थलगत निरीक्षण गर्छ। साना समस्याहरू श्रमदानमार्फत तत्काल समाधान गरिन्छ भने पूर्वाधार सम्बन्धी ठूला विषय वडा कार्यालयसँग समन्वय गरी समाधान गरिन्छ।'
        : 'When an issue is reported, local chapter volunteers conduct a site audit within 24 hours. Small issues are handled via direct volunteer shramdaan; larger municipal infrastructure problems are escalated formally to ward authorities with citizen backing.',
    },
    {
      q: language === 'ne' ? 'के म मेरो गाउँ वा सहरमा नयाँ शाखा खोल्न सक्छु?' : 'Can I establish a new chapter in my municipality?',
      a: language === 'ne'
        ? 'अवश्य! यदि तपाईंको वडामा अझै शाखा छैन भने ५ वा सोभन्दा बढी युवाहरू मिलेर नयाँ शाखा गठनको लागि आवेदन दिन सक्नुहुन्छ।'
        : 'Absolutely! If your ward does not yet have an active chapter, a group of 5 or more local youth can apply to establish a new chapter council.',
    },
    {
      q: language === 'ne' ? 'यस प्लेटफर्ममा देखाइएका तथ्याङ्कहरू कत्तिको विश्वसनीय छन्?' : 'How reliable are the platform impact statistics?',
      a: language === 'ne'
        ? 'हाम्रा तथ्याङ्कहरू १००% स्थलगत रूपमा प्रमाणित गरिएका रेकर्डहरू हुन्। कुनै पनि समस्या वा परियोजना समाधान नभएसम्म र नागरिकले पुष्टि नगरेसम्म तथ्याङ्कमा थपिँदैन।'
        : 'Every number displayed on our platform corresponds to an audited, field-verified issue or completed project verified by real residents.',
    },
  ];

  return (
    <div className="py-8 sm:py-12 bg-[var(--color-background)]">
      <PageContainer>
        {/* Header */}
        <PageHeader
          title={t('howItWorksTitle')}
          description={t('howItWorksDescription')}
          breadcrumbs={[
            { label: t('navHome'), href: '/' },
            { label: t('navHowItWorks'), current: true },
          ]}
          onNavigateBreadcrumb={onNavigate}
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={onOpenJoin}
              leftIcon={<Users className="w-4 h-4" />}
            >
              {language === 'ne' ? 'अहिले नै सुरु गर्नुहोस्' : 'Get Started'}
            </Button>
          }
        />

        {/* 6-Step Visual Participatory Journey */}
        <section aria-labelledby="steps-heading" className="mb-16">
          <h2 id="steps-heading" className="sr-only">
            Six Steps of Community Action
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card
                  key={step.number}
                  className="p-6 sm:p-7 flex flex-col justify-between hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-[var(--color-muted)]/40 font-mono">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="type-h3 font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                      {step.title}
                    </h3>

                    <p className="type-body text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)]">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-between text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)]"
                      onClick={() => {
                        if (step.actionPath === 'join') onOpenJoin();
                        else if (step.actionPath === 'report') onOpenReport();
                        else onNavigate(step.actionPath);
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    >
                      {step.actionText}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Participatory Roles Matrix */}
        <section aria-labelledby="roles-heading" className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 id="roles-heading" className="type-h2 font-bold text-[var(--color-foreground)]">
              {language === 'ne' ? 'तपाईं कसरी सहभागी हुन सक्नुहुन्छ?' : 'How You Fit Into the Platform'}
            </h2>
            <p className="type-body text-[var(--color-muted)]">
              {language === 'ne'
                ? 'नव युवा क्लबमा प्रत्येक नागरिकको भूमिका महत्वपूर्ण छ।'
                : 'Everyone has a unique and valuable role in transforming local neighborhoods.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                {language === 'ne' ? 'युवा तथा विद्यार्थीका लागि' : 'For Youth & Students'}
              </span>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? 'नेतृत्व र स्वयंसेवा' : 'Lead & Volunteer'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'आफ्नो समय र ऊर्जा आफ्नै टोलको सुधारमा लगाउनुहोस्। नेतृत्व सीप, परियोजना व्यवस्थापन र नागरिक अधिकारको प्रत्यक्ष अनुभव प्राप्त गर्नुहोस्।'
                  : 'Gain real leadership, civic organizing, and project coordination experience while solving real neighborhood problems.'}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {language === 'ne' ? 'टोलबासी तथा अभिभावकका लागि' : 'For Residents & Families'}
              </span>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? 'आवाज र निगरानी' : 'Report & Monitor'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'आफ्नो टोलको कुनै पनि समस्या फोटोसहित दर्ता गर्नुहोस् र समाधान नभएसम्म टाइमलाइनमार्फत प्रत्यक्ष अनुगमन गर्नुहोस्।'
                  : 'Submit neighborhood issues with photos in seconds and track progress transparently as youth volunteers coordinate solutions.'}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {language === 'ne' ? 'वडा तथा स्थानीय तहका लागि' : 'For Local Ward Offices'}
              </span>
              <h3 className="type-h3 font-bold text-[var(--color-foreground)]">
                {language === 'ne' ? 'सहकार्य र समाधान' : 'Partner & Coordinate'}
              </h3>
              <p className="type-small text-[var(--color-muted)] leading-relaxed">
                {language === 'ne'
                  ? 'नागरिकका प्राथमिकता बुझ्न, पूर्वाधार मर्मतलाई चुस्त बनाउन र युवा स्वयंसेवकहरूसँग मिलेर विकास योजनाहरू प्रभावकारी बनाउनुहोस्।'
                  : 'Access verified citizen feedback, prioritize ward maintenance budgets efficiently, and deploy youth volunteer force for municipal success.'}
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mb-12 max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 id="faq-heading" className="type-h2 font-bold text-[var(--color-foreground)] flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
              {language === 'ne' ? 'प्रायः सोधिने प्रश्नहरू' : 'Frequently Asked Questions'}
            </h2>
            <p className="type-body text-[var(--color-muted)] text-xs sm:text-sm">
              {language === 'ne' ? 'नव युवा क्लब सम्बन्धी मुख्य जानकारी' : 'Answers to common questions about participation and processes'}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[var(--color-foreground)] flex items-center justify-between gap-3 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--color-muted)] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-border-subtle)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-center space-y-6">
          <h2 className="type-hero text-2xl sm:text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto">
            {language === 'ne' ? 'परिवर्तनको सुरुआत तपाईंबाटै हुन्छ' : 'Real Change Begins With Your Initiative'}
          </h2>
          <p className="type-body text-white/90 max-w-xl mx-auto text-sm sm:text-base">
            {language === 'ne'
              ? 'अहिले नै नव युवा क्लबमा जोडिएर आफ्नो वडालाई अझ सुरक्षित, समृद्ध र एकताबद्ध बनाउनुहोस्।'
              : 'Join thousands of passionate young people taking practical local action across communities in Nepal.'}
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
